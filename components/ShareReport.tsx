"use client";

import { useState } from "react";
import { trackEvent } from "@/lib/analytics";
import { formatReport, formatShareText } from "@/lib/report";
import type { Analysis } from "@/types/analysis";

type ShareReportProps = {
  analysis: Analysis;
  onAnalyzeAnother?: () => void;
};

export function ShareReport({ analysis, onAnalyzeAnother }: ShareReportProps) {
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);

  async function copyReport() {
    await navigator.clipboard.writeText(formatReport(analysis));
    trackEvent("copy_report_clicked");
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  async function share() {
    const text = formatReport(analysis);
    trackEvent("share_clicked");

    if (navigator.share) {
      try {
        await navigator.share({
          title: "DevLens Diagnosis",
          text,
        });
        setShared(true);
        window.setTimeout(() => setShared(false), 1600);
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
      }
    }

    await navigator.clipboard.writeText(formatShareText(analysis));
    setShared(true);
    window.setTimeout(() => setShared(false), 1600);
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
      <button
        type="button"
        onClick={copyReport}
        className="rounded-md border border-border px-3 py-2 text-sm text-foreground transition-colors hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        {copied ? "Copied" : "Copy Report"}
      </button>
      <button
        type="button"
        onClick={share}
        className="rounded-md border border-border px-3 py-2 text-sm text-foreground transition-colors hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        {shared ? "Shared" : "Share"}
      </button>
      {onAnalyzeAnother ? (
        <button
          type="button"
          onClick={onAnalyzeAnother}
          className="rounded-md bg-foreground px-3 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          Analyze Another
        </button>
      ) : null}
    </div>
  );
}
