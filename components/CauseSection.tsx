import type { Analysis } from "@/types/analysis";

type CauseSectionProps = {
  analysis: Analysis;
};

export function CauseSection({ analysis }: CauseSectionProps) {
  const uncertain = analysis.causeCertainty === "likely";

  return (
    <section aria-labelledby="cause-heading" className="space-y-2">
      <h3 id="cause-heading" className="text-sm font-medium text-foreground">
        <span aria-hidden="true">🔍 </span>Why it happened
      </h3>
      {uncertain ? (
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-warning">
          Most likely cause
        </p>
      ) : null}
      <p className="text-[15px] leading-7 text-muted-strong">{analysis.cause}</p>
    </section>
  );
}
