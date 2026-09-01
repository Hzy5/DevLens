import { SUPPORTED_TECHNOLOGIES } from "@/lib/constants";
import { PAGE_WRAP } from "@/lib/layout";

export function SupportedTech() {
  return (
    <section
      aria-labelledby="tech-heading"
      className={`${PAGE_WRAP} py-12`}
    >
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
        Stack
      </p>
      <h2 id="tech-heading" className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
        Built for the stack you already use
      </h2>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-strong">
        DevLens is strongest on the technologies below. It can still inspect other
        errors — we don&apos;t claim perfect support for every language or framework.
      </p>
      <ul className="mt-6 flex flex-wrap gap-2">
        {SUPPORTED_TECHNOLOGIES.map((tech) => (
          <li
            key={tech}
            className="rounded-md border border-border bg-surface/90 px-3 py-1.5 font-mono text-[12px] text-foreground"
          >
            {tech}
          </li>
        ))}
      </ul>
    </section>
  );
}
