import { NextResponse } from "next/server";
import { DAILY_ANALYSIS_LIMIT, MAX_BODY_BYTES } from "@/lib/constants";
import { AnalyzeError, errorJson } from "@/lib/errors";
import { verifyRequestUser } from "@/lib/firebase-admin";
import { analyzeWithOpenAI } from "@/lib/openai";
import { checkRateLimit } from "@/lib/rate-limit";
import { recordAnalysisUsage, reserveDailyUsage } from "@/lib/usage";
import {
  parseInputText,
  parseMode,
  parseScreenshot,
  requirePayload,
} from "@/lib/validation";
import type { AnalyzeRequestBody, ClientErrorCode } from "@/types/analysis";

export const runtime = "nodejs";
export const maxDuration = 60;

function jsonError(code: ClientErrorCode, extraHeaders?: HeadersInit) {
  return NextResponse.json(errorJson(code), {
    status: new AnalyzeError(code).status,
    headers: extraHeaders,
  });
}

export async function POST(request: Request) {
  try {
    const user = await verifyRequestUser(request);
    if (!user) {
      return jsonError("unauthorized");
    }
    if (!user.emailVerified) {
      return jsonError("email_not_verified");
    }
    const idToken = request.headers.get("authorization")?.slice(7).trim() || "";

    const contentLength = request.headers.get("content-length");
    if (contentLength && Number(contentLength) > MAX_BODY_BYTES) {
      return jsonError("too_large");
    }

    const burst = checkRateLimit(user.uid);
    if (!burst.ok) {
      return jsonError("rate_limited", {
        "X-RateLimit-Remaining": "0",
        "Retry-After": String(burst.retryAfterSeconds),
      });
    }

    let body: AnalyzeRequestBody;
    try {
      body = (await request.json()) as AnalyzeRequestBody;
    } catch {
      return jsonError("invalid_request");
    }

    const mode = parseMode(body.mode ?? "auto");
    const input = parseInputText(body.input);
    const image = parseScreenshot(body.image);
    requirePayload(input, image, mode);

    const quota = await reserveDailyUsage(user, DAILY_ANALYSIS_LIMIT, idToken);
    const limitHeaders = {
      "X-RateLimit-Remaining": String(Math.min(quota.remaining, burst.remaining)),
      "Retry-After": String(quota.retryAfterSeconds),
    };

    try {
      const analysis = await analyzeWithOpenAI({ input, mode, image });
      try {
        await recordAnalysisUsage({
          user,
          idToken,
          mode,
          ok: true,
          inputChars: input.length,
          hadScreenshot: Boolean(image),
          analysis,
        });
      } catch (error) {
        console.error("usage_record_failed", {
          type: error instanceof Error ? error.name : "unknown",
        });
      }

      return NextResponse.json(
        { ok: true, analysis, remainingToday: quota.remaining },
        { status: 200, headers: limitHeaders },
      );
    } catch (error) {
      const code =
        error instanceof AnalyzeError ? error.code : "api_failure";
      try {
        await recordAnalysisUsage({
          user,
          idToken,
          mode,
          ok: false,
          error: code,
          inputChars: input.length,
          hadScreenshot: Boolean(image),
        });
      } catch (recordError) {
        console.error("usage_record_failed", {
          type: recordError instanceof Error ? recordError.name : "unknown",
        });
      }
      throw error;
    }
  } catch (error) {
    if (error instanceof AnalyzeError) {
      return jsonError(error.code);
    }

    console.error("analyze_unhandled", {
      type: error instanceof Error ? error.name : "unknown",
    });
    return jsonError("api_failure");
  }
}
