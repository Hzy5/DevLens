export const INPUT_MODES = [
  "auto",
  "error",
  "crash",
  "code",
  "api",
  "screenshot",
] as const;

export type InputMode = (typeof INPUT_MODES)[number];

export const ANALYSIS_TYPES = [
  "error",
  "crash",
  "code",
  "api",
  "screenshot",
  "unknown",
] as const;

export type AnalysisType = (typeof ANALYSIS_TYPES)[number];

export const SEVERITIES = ["low", "medium", "high", "critical"] as const;

export type Severity = (typeof SEVERITIES)[number];

export const CAUSE_CERTAINTIES = ["confirmed", "likely"] as const;

export type CauseCertainty = (typeof CAUSE_CERTAINTIES)[number];

export type AnalysisFix = {
  summary: string;
  codeBefore: string | null;
  codeAfter: string | null;
  language: string | null;
};

export type Analysis = {
  type: AnalysisType;
  technology: string;
  title: string;
  severity: Severity;
  problem: string;
  cause: string;
  causeCertainty: CauseCertainty;
  confidence: number;
  evidence: string;
  fix: AnalysisFix;
  checks: string[];
  nextStep: string;
};

export const CLIENT_ERROR_CODES = [
  "empty_input",
  "unsupported_file",
  "too_large",
  "invalid_request",
  "rate_limited",
  "api_failure",
] as const;

export type ClientErrorCode = (typeof CLIENT_ERROR_CODES)[number];

export type AnalyzeErrorResponse = {
  ok: false;
  error: ClientErrorCode;
  message: string;
};

export type AnalyzeSuccessResponse = {
  ok: true;
  analysis: Analysis;
};

export type AnalyzeResponse = AnalyzeSuccessResponse | AnalyzeErrorResponse;

export type ScreenshotPayload = {
  data: string;
  mimeType: string;
};

export type AnalyzeRequestBody = {
  mode?: unknown;
  input?: unknown;
  image?: unknown;
};
