import { ERROR_MESSAGES } from "@/lib/constants";
import type { ClientErrorCode } from "@/types/analysis";

export class AnalyzeError extends Error {
  readonly code: ClientErrorCode;
  readonly status: number;

  constructor(code: ClientErrorCode, status?: number) {
    super(ERROR_MESSAGES[code]);
    this.name = "AnalyzeError";
    this.code = code;
    this.status = status ?? statusForCode(code);
  }
}

export function statusForCode(code: ClientErrorCode): number {
  switch (code) {
    case "empty_input":
    case "unsupported_file":
    case "invalid_request":
      return 400;
    case "too_large":
      return 413;
    case "rate_limited":
      return 429;
    case "api_failure":
      return 502;
  }
}

export function errorJson(code: ClientErrorCode) {
  return {
    ok: false as const,
    error: code,
    message: ERROR_MESSAGES[code],
  };
}
