import { CauseSection } from "@/components/CauseSection";
import { EvidenceSection } from "@/components/EvidenceSection";
import { FixSection } from "@/components/FixSection";
import { NextChecks } from "@/components/NextChecks";
import { ProblemSection } from "@/components/ProblemSection";
import { ShareReport } from "@/components/ShareReport";
import { CONFIDENCE_TOOLTIP } from "@/lib/constants";
import { cn } from "@/lib/cn";
import type { Analysis, Severity } from "@/types/analysis";

type AnalysisResultProps = {
  analysis: Analysis;
  onAnalyzeAnother?: () => void;
};

const SEVERITY_CLASS: Record<Severity, string> = {
  low: "text-muted",
  medium: "text-warning",
  high: "text-danger",
  critical: "text-danger",
};

export function AnalysisResult({ analysis, onAnalyzeAnother }: AnalysisResultProps) {
  return (
    <article
      aria-labelledby="diagnosis-title"
      className="overflow-hidden rounded-xl border border-border bg-surface"
    >
      <header className="space-y-4 border-b border-border px-5 py-6 sm:px-7">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
          🔍 DevLens
        </p>
        <h2
          id="diagnosis-title"
          className="text-2xl font-semibold tracking-tight text-foreground sm:text-[28px]"
        >
          {analysis.title}
        </h2>
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="rounded-md border border-border px-2 py-0.5 font-medium text-foreground">
            {analysis.technology}
          </span>
          <span className={cn("font-medium capitalize", SEVERITY_CLASS[analysis.severity])}>
            {analysis.severity}
          </span>
          <span className="text-border" aria-hidden="true">
            ·
          </span>
          <span
            className="group relative cursor-help text-muted"
            tabIndex={0}
            aria-describedby="confidence-tooltip"
          >
            Confidence: {analysis.confidence}%
            <span
              id="confidence-tooltip"
              role="tooltip"
              className="pointer-events-none absolute left-0 top-full z-10 mt-2 hidden w-64 rounded-md border border-border bg-background p-2 text-xs leading-5 text-muted-strong shadow-lg group-hover:block group-focus:block"
            >
              {CONFIDENCE_TOOLTIP}
            </span>
          </span>
        </div>
        <div
          className="h-1 overflow-hidden rounded-full bg-surface-2"
          role="meter"
          aria-label="Diagnosis confidence"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={analysis.confidence}
        >
          <div
            className="h-full bg-accent"
            style={{ width: `${analysis.confidence}%` }}
          />
        </div>
      </header>

      <div className="space-y-8 px-5 py-6 sm:px-7">
        <ProblemSection analysis={analysis} />
        <CauseSection analysis={analysis} />
        <FixSection analysis={analysis} />
        <EvidenceSection analysis={analysis} />
        <NextChecks analysis={analysis} />
        <ShareReport analysis={analysis} onAnalyzeAnother={onAnalyzeAnother} />
      </div>
    </article>
  );
}
