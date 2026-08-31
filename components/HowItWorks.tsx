const STEPS = [
  {
    n: "01",
    title: "Drop the problem",
    body: "Paste an error, log, code, API response, or screenshot.",
  },
  {
    n: "02",
    title: "DevLens investigates",
    body: "It identifies the likely problem and root cause.",
  },
  {
    n: "03",
    title: "Fix it",
    body: "Get the smallest practical fix and what to check next.",
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      aria-labelledby="how-heading"
      className="mx-auto w-full max-w-5xl px-4 py-20"
    >
      <h2 id="how-heading" className="text-2xl font-semibold tracking-tight text-foreground">
        How DevLens Works
      </h2>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {STEPS.map((step) => (
          <article
            key={step.n}
            className="rounded-xl border border-border bg-surface p-5"
          >
            <p className="font-mono text-xs text-muted">{step.n}</p>
            <h3 className="mt-3 text-base font-medium text-foreground">{step.title}</h3>
            <p className="mt-2 text-sm leading-6 text-muted-strong">{step.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
