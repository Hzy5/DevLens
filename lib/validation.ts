import { z } from "zod";
import {
  ALLOWED_IMAGE_TYPES,
  MAX_IMAGE_BYTES,
  MAX_INPUT_CHARS,
} from "@/lib/constants";
import { AnalyzeError } from "@/lib/errors";
import {
  ANALYSIS_TYPES,
  CAUSE_CERTAINTIES,
  INPUT_MODES,
  SEVERITIES,
  type Analysis,
  type InputMode,
  type ScreenshotPayload,
} from "@/types/analysis";

export const analysisSchema = z.object({
  type: z.enum(ANALYSIS_TYPES),
  technology: z.string().min(1).max(80),
  title: z.string().min(1).max(160),
  severity: z.enum(SEVERITIES),
  problem: z.string().min(1).max(600),
  cause: z.string().min(1).max(800),
  causeCertainty: z.enum(CAUSE_CERTAINTIES),
  confidence: z.number().int().min(0).max(100),
  evidence: z.string().min(1).max(800),
  fix: z.object({
    summary: z.string().min(1).max(400),
    codeBefore: z.string().max(4000).nullable(),
    codeAfter: z.string().max(4000).nullable(),
    language: z.string().max(40).nullable(),
  }),
  checks: z.array(z.string().min(1).max(240)).min(2).max(4),
  nextStep: z.string().min(1).max(400),
});

const screenshotSchema = z.object({
  data: z.string().min(1).max(7_000_000),
  mimeType: z.enum(ALLOWED_IMAGE_TYPES),
});

export function parseMode(value: unknown): InputMode {
  if (typeof value !== "string" || !INPUT_MODES.includes(value as InputMode)) {
    throw new AnalyzeError("invalid_request");
  }
  return value as InputMode;
}

export function parseInputText(value: unknown): string {
  if (value == null) return "";
  if (typeof value !== "string") {
    throw new AnalyzeError("invalid_request");
  }
  if (value.length > MAX_INPUT_CHARS) {
    throw new AnalyzeError("too_large");
  }
  return value;
}

function decodeBase64Size(data: string): number {
  const normalized = data.includes(",") ? (data.split(",").pop() ?? "") : data;
  const padding = normalized.endsWith("==") ? 2 : normalized.endsWith("=") ? 1 : 0;
  return Math.floor((normalized.length * 3) / 4) - padding;
}

function sniffImageMime(bytes: Uint8Array): string | null {
  if (bytes.length >= 8 && bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) {
    return "image/png";
  }
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return "image/jpeg";
  }
  if (
    bytes.length >= 12 &&
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46 &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50
  ) {
    return "image/webp";
  }
  return null;
}

function decodeImageBytes(data: string): Uint8Array {
  const normalized = data.includes(",") ? (data.split(",").pop() ?? "") : data;
  try {
    const buffer = Buffer.from(normalized, "base64");
    if (buffer.length === 0) {
      throw new AnalyzeError("unsupported_file");
    }
    return new Uint8Array(buffer);
  } catch (error) {
    if (error instanceof AnalyzeError) throw error;
    throw new AnalyzeError("unsupported_file");
  }
}

export function parseScreenshot(value: unknown): ScreenshotPayload | null {
  if (value == null) return null;

  const parsed = screenshotSchema.safeParse(value);
  if (!parsed.success) {
    const tooLarge = parsed.error.issues.some(
      (issue) => issue.path.includes("data") && issue.code === "too_big",
    );
    throw new AnalyzeError(tooLarge ? "too_large" : "unsupported_file");
  }

  if (decodeBase64Size(parsed.data.data) > MAX_IMAGE_BYTES) {
    throw new AnalyzeError("too_large");
  }

  const bytes = decodeImageBytes(parsed.data.data);
  if (bytes.byteLength > MAX_IMAGE_BYTES) {
    throw new AnalyzeError("too_large");
  }

  const sniffed = sniffImageMime(bytes);
  if (!sniffed) {
    throw new AnalyzeError("unsupported_file");
  }

  const declared = parsed.data.mimeType === "image/jpg" ? "image/jpeg" : parsed.data.mimeType;
  if (sniffed !== declared) {
    throw new AnalyzeError("unsupported_file");
  }

  return {
    data: parsed.data.data.includes(",")
      ? (parsed.data.data.split(",").pop() ?? parsed.data.data)
      : parsed.data.data,
    mimeType: sniffed,
  };
}

export function requirePayload(input: string, image: ScreenshotPayload | null, mode: InputMode) {
  if (mode === "screenshot" && !image) {
    throw new AnalyzeError("empty_input");
  }
  if (!input.trim() && !image) {
    throw new AnalyzeError("empty_input");
  }
}

export function parseAnalysis(value: unknown): Analysis {
  const parsed = analysisSchema.safeParse(value);
  if (!parsed.success) {
    throw new AnalyzeError("api_failure");
  }
  return parsed.data;
}
