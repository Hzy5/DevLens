import type { Analysis } from "@/types/analysis";

export function formatReport(analysis: Analysis): string {
  return [
    "DevLens Diagnosis",
    "",
    "Problem:",
    analysis.title,
    "",
    "Cause:",
    analysis.cause,
    "",
    "Fix:",
    analysis.fix.summary,
    "",
    "Recommended next step:",
    analysis.nextStep,
  ].join("\n");
}

export function formatShareText(analysis: Analysis): string {
  return `${analysis.title} — ${analysis.fix.summary}`;
}
