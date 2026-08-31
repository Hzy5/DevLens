const INPUTS = [
  { icon: "💥", title: "Crash logs", body: "Find likely crash causes." },
  { icon: "🔴", title: "Errors", body: "Understand compiler and runtime errors." },
  { icon: "🧩", title: "Code", body: "Find suspicious or broken code." },
  { icon: "🔌", title: "API responses", body: "Understand status codes and malformed responses." },
  { icon: "📸", title: "Screenshots", body: "Turn error screenshots into actionable fixes." },
];

export function InputTypes() {
  return (
    <section
      aria-labelledby="inputs-heading"
      className="mx-auto w-full max-w-5xl px-4 py-12"
    >
      <h2 id="inputs-heading" className="text-2xl font-semibold tracking-tight text-foreground">
        One lens. Different problems.
      </h2>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {INPUTS.map((item) => (
          <article
            key={item.title}
            className="rounded-xl border border-border bg-surface p-5"
          >
            <p className="text-lg" aria-hidden="true">
              {item.icon}
            </p>
            <h3 className="mt-3 text-base font-medium text-foreground">{item.title}</h3>
            <p className="mt-2 text-sm leading-6 text-muted-strong">{item.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
