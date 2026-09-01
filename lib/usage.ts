import { FieldValue } from "firebase-admin/firestore";
import { DAILY_ANALYSIS_LIMIT } from "@/lib/constants";
import { AnalyzeError } from "@/lib/errors";
import {
  recordAnalysisUsageWithUserToken,
  reserveDailyUsageWithUserToken,
} from "@/lib/firestore-user";
import { getAdminDb, type VerifiedRequestUser } from "@/lib/firebase-admin";
import { checkDailyQuota, type RateLimitResult } from "@/lib/rate-limit";
import type { Analysis, InputMode } from "@/types/analysis";

export type RecordAnalysisUsageInput = {
  user: VerifiedRequestUser;
  idToken?: string;
  mode: InputMode;
  ok: boolean;
  error?: string | null;
  inputChars: number;
  hadScreenshot: boolean;
  analysis?: Analysis | null;
};

function utcDayKey(now = new Date()) {
  return now.toISOString().slice(0, 10);
}

function nextUtcMidnight(now = new Date()) {
  return Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate() + 1,
  );
}

function userRef(uid: string) {
  const db = getAdminDb();
  if (!db) return null;
  return db.collection("users").doc(uid);
}

async function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      promise,
      new Promise<T>((_, reject) => {
        timer = setTimeout(() => reject(new Error("timeout")), ms);
      }),
    ]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

function memoryQuota(userId: string, limit: number): RateLimitResult {
  const quota = checkDailyQuota(userId, limit);
  if (!quota.ok) {
    throw new AnalyzeError("quota_exceeded");
  }
  return quota;
}

export async function reserveDailyUsage(
  user: VerifiedRequestUser,
  limit = DAILY_ANALYSIS_LIMIT,
  idToken?: string,
): Promise<RateLimitResult> {
  const db = getAdminDb();
  if (db) {
    try {
      return await withTimeout(reserveWithAdmin(user, limit), 2500);
    } catch (error) {
      if (error instanceof AnalyzeError) throw error;
      console.error("firestore_admin_reserve_failed", {
        type: error instanceof Error ? error.name : "unknown",
      });
    }
  }

  if (idToken) {
    try {
      return await withTimeout(
        reserveDailyUsageWithUserToken(user, idToken, limit),
        2500,
      );
    } catch (error) {
      if (error instanceof AnalyzeError) throw error;
      console.error("firestore_user_reserve_failed", {
        type: error instanceof Error ? error.name : "unknown",
      });
    }
  }

  return memoryQuota(user.uid, limit);
}

async function reserveWithAdmin(
  user: VerifiedRequestUser,
  limit: number,
): Promise<RateLimitResult> {
  const db = getAdminDb();
  const profileRef = userRef(user.uid);
  if (!db || !profileRef) {
    throw new Error("firestore_admin_unavailable");
  }

  const now = new Date();
  const day = utcDayKey(now);
  const resetAt = nextUtcMidnight(now);
  const retryAfterSeconds = Math.max(1, Math.ceil((resetAt - now.getTime()) / 1000));
  const dailyRef = profileRef.collection("daily").doc(day);

  const result = await db.runTransaction(async (tx) => {
    const [profileSnap, dailySnap] = await Promise.all([
      tx.get(profileRef),
      tx.get(dailyRef),
    ]);

    const used = dailySnap.exists ? Number(dailySnap.get("analyses") ?? 0) : 0;
    if (used >= limit) {
      return {
        ok: false as const,
        remaining: 0,
        resetAt,
        retryAfterSeconds,
      };
    }

    const profileUpdate: Record<string, unknown> = {
      ownerUID: user.uid,
      email: user.email,
      emailVerified: user.emailVerified,
      updatedAt: FieldValue.serverTimestamp(),
    };
    if (!profileSnap.exists) {
      profileUpdate.createdAt = FieldValue.serverTimestamp();
      profileUpdate.totalAnalyses = 0;
      profileUpdate.successfulAnalyses = 0;
      profileUpdate.failedAnalyses = 0;
    }

    tx.set(profileRef, profileUpdate, { merge: true });
    tx.set(
      dailyRef,
      {
        date: day,
        analyses: used + 1,
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true },
    );

    return {
      ok: true as const,
      remaining: limit - used - 1,
      resetAt,
      retryAfterSeconds,
    };
  });

  if (!result.ok) {
    throw new AnalyzeError("quota_exceeded");
  }

  return result;
}

export async function recordAnalysisUsage(input: RecordAnalysisUsageInput) {
  try {
    const db = getAdminDb();
    const profileRef = userRef(input.user.uid);
    if (db && profileRef) {
      await recordWithAdmin(input);
      return;
    }
    if (input.idToken) {
      await recordAnalysisUsageWithUserToken({
        user: input.user,
        idToken: input.idToken,
        mode: input.mode,
        ok: input.ok,
        error: input.error,
        inputChars: input.inputChars,
        hadScreenshot: input.hadScreenshot,
        analysis: input.analysis,
      });
    }
  } catch (error) {
    console.error("usage_record_failed", {
      type: error instanceof Error ? error.name : "unknown",
    });
  }
}

async function recordWithAdmin(input: RecordAnalysisUsageInput) {
  const db = getAdminDb();
  const profileRef = userRef(input.user.uid);
  if (!db || !profileRef) {
    throw new Error("firestore_admin_unavailable");
  }

  const day = utcDayKey();
  const dailyRef = profileRef.collection("daily").doc(day);
  const eventRef = profileRef.collection("analyses").doc();

  const batch = db.batch();
  batch.set(
    profileRef,
    {
      email: input.user.email,
      emailVerified: input.user.emailVerified,
      ownerUID: input.user.uid,
      lastAnalyzedAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
      totalAnalyses: FieldValue.increment(1),
      successfulAnalyses: FieldValue.increment(input.ok ? 1 : 0),
      failedAnalyses: FieldValue.increment(input.ok ? 0 : 1),
    },
    { merge: true },
  );
  batch.set(
    dailyRef,
    {
      date: day,
      successful: FieldValue.increment(input.ok ? 1 : 0),
      failed: FieldValue.increment(input.ok ? 0 : 1),
      updatedAt: FieldValue.serverTimestamp(),
    },
    { merge: true },
  );
  batch.set(eventRef, {
    createdAt: FieldValue.serverTimestamp(),
    day,
    mode: input.mode,
    ok: input.ok,
    error: input.error ?? null,
    inputChars: input.inputChars,
    hadScreenshot: input.hadScreenshot,
    analysisType: input.analysis?.type ?? null,
    technology: input.analysis?.technology ?? null,
    severity: input.analysis?.severity ?? null,
  });

  await batch.commit();
}
