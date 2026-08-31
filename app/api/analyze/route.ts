import { NextResponse } from "next/server";
import { MAX_BODY_BYTES } from "@/lib/constants";
import { AnalyzeError, errorJson } from "@/lib/errors";
import { analyzeWithOpenAI } from "@/lib/openai";
import {
  checkRateLimit,
  getClientIdentifier,
  hashIdentifier,
} from "@/lib/rate-limit";
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
    const contentLength = request.headers.get("content-length");
    if (contentLength && Number(contentLength) > MAX_BODY_BYTES) {
      return jsonError("too_large");
    }

    const identifier = await hashIdentifier(getClientIdentifier(request));
    const limit = checkRateLimit(identifier);
    const limitHeaders = {
      "X-RateLimit-Remaining": String(limit.remaining),
      "Retry-After": String(limit.retryAfterSeconds),
    };

    if (!limit.ok) {
      return jsonError("rate_limited", limitHeaders);
    }

    let body: AnalyzeRequestBody;
    try {
      body = (await request.json()) as AnalyzeRequestBody;
    } catch {
      return jsonError("invalid_request", limitHeaders);
    }

    const mode = parseMode(body.mode ?? "auto");
    const input = parseInputText(body.input);
    const image = parseScreenshot(body.image);
    requirePayload(input, image, mode);

    const analysis = await analyzeWithOpenAI({ input, mode, image });

    return NextResponse.json(
      { ok: true, analysis },
      { status: 200, headers: limitHeaders },
    );
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
