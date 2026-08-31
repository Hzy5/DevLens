import type { Analysis } from "@/types/analysis";

type NextChecksProps = {
  analysis: Analysis;
};

export function NextChecks({ analysis }: NextChecksProps) {
  return (
    <section aria-labelledby="checks-heading" className="space-y-3">
      <h3 id="checks-heading" className="text-sm font-medium text-foreground">
        <span aria-hidden="true">🔎 </span>Check this next
      </h3>
      <ul className="space-y-2">
        {analysis.checks.map((check) => (
          <li
            key={check}
            className="flex gap-2 text-[15px] leading-7 text-muted-strong"
          >
            <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
            <span>{check}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
