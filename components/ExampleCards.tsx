"use client";

import { EXAMPLE_CARDS, type ExampleCard } from "@/lib/examples";

type ExampleCardsProps = {
  onSelect: (example: ExampleCard) => void;
  disabled?: boolean;
};

export function ExampleCards({ onSelect, disabled }: ExampleCardsProps) {
  return (
    <section id="examples" aria-labelledby="examples-heading" className="mt-8">
      <h2 id="examples-heading" className="text-sm font-medium text-foreground">
        Try an example
      </h2>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {EXAMPLE_CARDS.map((example) => (
          <button
            key={example.id}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(example)}
            className="panel rounded-lg border border-border bg-surface/90 px-4 py-3 text-left transition-colors hover:border-accent/40 hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-50"
          >
            <p className="text-sm font-medium text-foreground">{example.title}</p>
            <p className="mt-1 font-mono text-xs leading-5 text-muted">{example.preview}</p>
          </button>
        ))}
      </div>
    </section>
  );
}
