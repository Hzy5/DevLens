import { PAGE_WRAP } from "@/lib/layout";

const INPUTS = [
  { tag: "crash", title: "Crash logs", body: "Find likely crash causes." },
  { tag: "error", title: "Errors", body: "Understand compiler and runtime errors." },
  { tag: "code", title: "Code", body: "Find suspicious or broken code." },
  { tag: "http", title: "API responses", body: "Understand status codes and malformed responses." },
  { tag: "shot", title: "Screenshots", body: "Turn error screenshots into actionable fixes." },
];

export function InputTypes() {
  return (
    <section
      aria-labelledby="inputs-heading"
      className={`${PAGE_WRAP} py-12`}
    >
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
        Inputs
      </p>
      <h2 id="inputs-heading" className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
        One lens. Different problems.
      </h2>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {INPUTS.map((item) => (
          <article
            key={item.title}
            className="panel rounded-xl border border-border bg-surface/90 p-5"
          >
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent">
              {item.tag}
            </p>
            <h3 className="mt-3 text-base font-medium text-foreground">{item.title}</h3>
            <p className="mt-2 text-sm leading-6 text-muted-strong">{item.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
