import { WorkbenchFrame } from "@/components/WorkbenchFrame";
import { PAGE_WRAP } from "@/lib/layout";

const STEPS = [
  {
    n: "01",
    title: "Drop the problem",
    file: "inbox.log",
    body: "Paste an error, log, code, API response, or screenshot.",
  },
  {
    n: "02",
    title: "DevLens investigates",
    file: "inspect.ts",
    body: "It identifies the likely problem and root cause.",
  },
  {
    n: "03",
    title: "Fix it",
    file: "patch.diff",
    body: "Get the smallest practical fix and what to check next.",
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      aria-labelledby="how-heading"
      className={`${PAGE_WRAP} py-20`}
    >
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
        Workflow
      </p>
      <h2 id="how-heading" className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
        How DevLens Works
      </h2>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {STEPS.map((step) => (
          <WorkbenchFrame key={step.n} title={step.file} meta={step.n}>
            <article className="p-5">
              <h3 className="text-base font-medium text-foreground">{step.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-strong">{step.body}</p>
            </article>
          </WorkbenchFrame>
        ))}
      </div>
    </section>
  );
}
