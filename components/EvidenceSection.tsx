import type { Analysis } from "@/types/analysis";

type EvidenceSectionProps = {
  analysis: Analysis;
};

export function EvidenceSection({ analysis }: EvidenceSectionProps) {
  return (
    <section aria-labelledby="evidence-heading" className="space-y-2">
      <h3 id="evidence-heading" className="text-sm font-medium text-foreground">
        Evidence
      </h3>
      <p className="text-[15px] leading-7 text-muted-strong">{analysis.evidence}</p>
    </section>
  );
}
