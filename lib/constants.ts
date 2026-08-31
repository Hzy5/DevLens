import type { ClientErrorCode, InputMode } from "@/types/analysis";

export const APP_NAME = "DevLens";
export const APP_TAGLINE = "See what's actually wrong.";
export const APP_TITLE = "DevLens — See What's Actually Wrong";
export const APP_DESCRIPTION =
  "Debug errors, crash logs, code, API responses, and screenshots with DevLens. Find the problem, understand the cause, and get the fix.";

export const MAX_INPUT_CHARS = 80_000;
export const MAX_IMAGE_BYTES = 4 * 1024 * 1024;
export const MAX_BODY_BYTES = 5 * 1024 * 1024;
export const ALLOWED_IMAGE_TYPES = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
] as const;

export const ERROR_MESSAGES: Record<ClientErrorCode, string> = {
  empty_input: "Paste something for me to inspect.",
  unsupported_file: "That file type isn't supported yet.",
  too_large: "That input is too large. Try a smaller log or screenshot.",
  invalid_request: "DevLens couldn't analyze this right now. Try again.",
  rate_limited: "Too many requests. Try again shortly.",
  api_failure: "DevLens couldn't analyze this right now. Try again.",
};

export const MODE_LABELS: Record<InputMode, string> = {
  auto: "Auto Detect",
  error: "Error",
  crash: "Crash",
  code: "Code",
  api: "API",
  screenshot: "Screenshot",
};

export const SUPPORTED_TECHNOLOGIES = [
  "Swift",
  "SwiftUI",
  "UIKit",
  "Objective-C",
  "React Native",
  "TypeScript",
  "JavaScript",
  "Node.js",
  "Firebase",
  "REST APIs",
] as const;

export const CONFIDENCE_TOOLTIP =
  "Confidence represents how strongly the provided evidence supports this diagnosis. It is not a guarantee.";

export const PRIVACY_NOTE =
  "Your code stays yours. We don't permanently store your debugging input.";
