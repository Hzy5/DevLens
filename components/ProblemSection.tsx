import type { Analysis } from "@/types/analysis";

type ProblemSectionProps = {
  analysis: Analysis;
};

export function ProblemSection({ analysis }: ProblemSectionProps) {
  return (
    <section aria-labelledby="problem-heading" className="space-y-2">
      <h3 id="problem-heading" className="text-sm font-medium text-foreground">
        <span aria-hidden="true">🔴 </span>What&apos;s wrong?
      </h3>
      <p className="text-[15px] leading-7 text-muted-strong">{analysis.problem}</p>
    </section>
  );
}
