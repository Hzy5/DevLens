import { AnalysisResult } from "@/components/AnalysisResult";
import { WorkbenchFrame } from "@/components/WorkbenchFrame";
import { PAGE_WRAP } from "@/lib/layout";
import { EXAMPLE_ANALYSIS } from "@/lib/examples";

export function ExampleResult() {
  return (
    <section
      id="example-result"
      aria-labelledby="example-result-heading"
      className={`${PAGE_WRAP} py-16`}
    >
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
        Report
      </p>
      <h2
        id="example-result-heading"
        className="mt-2 text-2xl font-semibold tracking-tight text-foreground"
      >
        What a diagnosis looks like
      </h2>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-strong">
        No API request required. This is a static example of the report DevLens produces.
      </p>
      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
        <WorkbenchFrame title="crash.log" meta="input">
          <pre className="overflow-x-auto p-5 font-mono text-[13px] leading-6 text-muted-strong">
            {`Thread 1: Fatal error:
Unexpectedly found nil while
implicitly unwrapping an Optional value`}
          </pre>
        </WorkbenchFrame>
        <AnalysisResult analysis={EXAMPLE_ANALYSIS} />
      </div>
    </section>
  );
}
