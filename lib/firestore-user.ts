import { DAILY_ANALYSIS_LIMIT } from "@/lib/constants";
import { AnalyzeError } from "@/lib/errors";
import type { VerifiedRequestUser } from "@/lib/firebase-admin";
import type { RateLimitResult } from "@/lib/rate-limit";
import type { Analysis, InputMode } from "@/types/analysis";

type FirestoreFields = Record<string, Record<string, unknown>>;

function projectId() {
  return (
    process.env.FIREBASE_ADMIN_PROJECT_ID ||
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ||
    ""
  );
}

function rootPath() {
  return `projects/${projectId()}/databases/(default)/documents`;
}

function documentName(...segments: string[]) {
  return `${rootPath()}/${segments.join("/")}`;
}

function documentsUrl(...segments: string[]) {
  const key = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  const url = `https://firestore.googleapis.com/v1/${documentName(...segments)}`;
  return key ? `${url}?key=${encodeURIComponent(key)}` : url;
}

function commitUrl() {
  const key = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  const url = `https://firestore.googleapis.com/v1/projects/${projectId()}/databases/(default)/documents:commit`;
  return key ? `${url}?key=${encodeURIComponent(key)}` : url;
}

function stringValue(value: string | null) {
  return value == null ? { nullValue: null } : { stringValue: value };
}

function boolValue(value: boolean) {
  return { booleanValue: value };
}

function intValue(value: number) {
  return { integerValue: String(value) };
}

function timestampNow() {
  return { timestampValue: new Date().toISOString() };
}

function readInteger(fields: FirestoreFields | undefined, name: string) {
  const field = fields?.[name];
  if (!field) return 0;
  if (typeof field.integerValue === "string") return Number(field.integerValue);
  if (typeof field.doubleValue === "number") return field.doubleValue;
  return 0;
}

async function getDocument(idToken: string, ...segments: string[]) {
  const response = await fetch(documentsUrl(...segments), {
    headers: { Authorization: `Bearer ${idToken}` },
    cache: "no-store",
    signal: AbortSignal.timeout(2000),
  });

  if (response.status === 404) return null;
  if (!response.ok) {
    console.error("firestore_get_failed", { status: response.status });
    throw new Error("firestore_get_failed");
  }

  return (await response.json()) as { fields?: FirestoreFields };
}

async function commit(idToken: string, writes: unknown[]) {
  const response = await fetch(commitUrl(), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${idToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ writes }),
    cache: "no-store",
    signal: AbortSignal.timeout(2000),
  });

  if (!response.ok) {
    let code = "unknown";
    try {
      const payload = (await response.json()) as {
        error?: { status?: string };
      };
      code = payload.error?.status ?? code;
    } catch {
      // ignore parse errors
    }
    console.error("firestore_commit_failed", {
      status: response.status,
      code,
    });
    throw new Error("firestore_commit_failed");
  }
}

function nextUtcMidnight(now = new Date()) {
  return Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate() + 1,
  );
}

function utcDayKey(now = new Date()) {
  return now.toISOString().slice(0, 10);
}

export async function reserveDailyUsageWithUserToken(
  user: VerifiedRequestUser,
  idToken: string,
  limit = DAILY_ANALYSIS_LIMIT,
): Promise<RateLimitResult> {
  if (!projectId()) {
    throw new Error("firestore_project_missing");
  }

  const now = new Date();
  const day = utcDayKey(now);
  const resetAt = nextUtcMidnight(now);
  const retryAfterSeconds = Math.max(1, Math.ceil((resetAt - now.getTime()) / 1000));

  const [profile, daily] = await Promise.all([
    getDocument(idToken, "users", user.uid),
    getDocument(idToken, "users", user.uid, "daily", day),
  ]);

  const used = readInteger(daily?.fields, "analyses");
  if (used >= limit) {
    throw new AnalyzeError("quota_exceeded");
  }

  const profileFields: FirestoreFields = {
    ownerUID: stringValue(user.uid),
    email: stringValue(user.email),
    emailVerified: boolValue(user.emailVerified),
    updatedAt: timestampNow(),
  };
  const profileMask = ["ownerUID", "email", "emailVerified", "updatedAt"];

  if (!profile) {
    profileFields.createdAt = timestampNow();
    profileFields.totalAnalyses = intValue(0);
    profileFields.successfulAnalyses = intValue(0);
    profileFields.failedAnalyses = intValue(0);
    profileMask.push(
      "createdAt",
      "totalAnalyses",
      "successfulAnalyses",
      "failedAnalyses",
    );
  }

  await commit(idToken, [
    {
      update: {
        name: documentName("users", user.uid),
        fields: profileFields,
      },
      updateMask: { fieldPaths: profileMask },
    },
    {
      update: {
        name: documentName("users", user.uid, "daily", day),
        fields: {
          date: stringValue(day),
          analyses: intValue(used + 1),
          updatedAt: timestampNow(),
        },
      },
      updateMask: { fieldPaths: ["date", "analyses", "updatedAt"] },
    },
  ]);

  return {
    ok: true,
    remaining: limit - used - 1,
    resetAt,
    retryAfterSeconds,
  };
}

export async function recordAnalysisUsageWithUserToken(input: {
  user: VerifiedRequestUser;
  idToken: string;
  mode: InputMode;
  ok: boolean;
  error?: string | null;
  inputChars: number;
  hadScreenshot: boolean;
  analysis?: Analysis | null;
}) {
  if (!projectId()) {
    throw new Error("firestore_project_missing");
  }

  const day = utcDayKey();
  const eventId = crypto.randomUUID();
  const [profile, daily] = await Promise.all([
    getDocument(input.idToken, "users", input.user.uid),
    getDocument(input.idToken, "users", input.user.uid, "daily", day),
  ]);

  const profileFields: FirestoreFields = {
    ownerUID: stringValue(input.user.uid),
    email: stringValue(input.user.email),
    emailVerified: boolValue(input.user.emailVerified),
    totalAnalyses: intValue(readInteger(profile?.fields, "totalAnalyses") + 1),
    successfulAnalyses: intValue(
      readInteger(profile?.fields, "successfulAnalyses") + (input.ok ? 1 : 0),
    ),
    failedAnalyses: intValue(
      readInteger(profile?.fields, "failedAnalyses") + (input.ok ? 0 : 1),
    ),
    lastAnalyzedAt: timestampNow(),
    updatedAt: timestampNow(),
  };
  const profileMask = [
    "ownerUID",
    "email",
    "emailVerified",
    "totalAnalyses",
    "successfulAnalyses",
    "failedAnalyses",
    "lastAnalyzedAt",
    "updatedAt",
  ];
  if (!profile) {
    profileFields.createdAt = timestampNow();
    profileMask.push("createdAt");
  }

  await commit(input.idToken, [
    {
      update: {
        name: documentName("users", input.user.uid),
        fields: profileFields,
      },
      updateMask: { fieldPaths: profileMask },
    },
    {
      update: {
        name: documentName("users", input.user.uid, "daily", day),
        fields: {
          date: stringValue(day),
          successful: intValue(
            readInteger(daily?.fields, "successful") + (input.ok ? 1 : 0),
          ),
          failed: intValue(
            readInteger(daily?.fields, "failed") + (input.ok ? 0 : 1),
          ),
          updatedAt: timestampNow(),
        },
      },
      updateMask: { fieldPaths: ["date", "successful", "failed", "updatedAt"] },
    },
    {
      update: {
        name: documentName("users", input.user.uid, "analyses", eventId),
        fields: {
          createdAt: timestampNow(),
          day: stringValue(day),
          mode: stringValue(input.mode),
          ok: boolValue(input.ok),
          error: stringValue(input.error ?? null),
          inputChars: intValue(input.inputChars),
          hadScreenshot: boolValue(input.hadScreenshot),
          analysisType: stringValue(input.analysis?.type ?? null),
          technology: stringValue(input.analysis?.technology ?? null),
          severity: stringValue(input.analysis?.severity ?? null),
        },
      },
    },
  ]);
}
