"use client";

import { useEffect, useState } from "react";

const MESSAGES = [
  "Reading the error...",
  "Finding the likely cause...",
  "Checking the fix...",
  "Looking for the smallest solution...",
  "Building the diagnosis...",
];

type LoadingStateProps = {
  ready?: boolean;
};

export function LoadingState({ ready = false }: LoadingStateProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (ready) return;
    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % MESSAGES.length);
    }, 1400);
    return () => window.clearInterval(id);
  }, [ready]);

  return (
    <div
      className="rounded-xl border border-border bg-surface p-6 sm:p-8"
      role="status"
      aria-live="polite"
      aria-busy={!ready}
    >
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
        DevLens
      </p>
      <p className="mt-3 text-lg font-medium tracking-tight text-foreground">
        {ready ? "Diagnosis ready." : MESSAGES[index]}
      </p>
      <div className="relative mt-6 overflow-hidden rounded-md border border-border">
        <div className="space-y-3 p-4">
          <div className="h-3 w-2/5 rounded bg-surface-2" />
          <div className="h-3 w-4/5 rounded bg-surface-2" />
          <div className="h-3 w-3/5 rounded bg-surface-2" />
          <div className="h-16 rounded bg-surface-2" />
        </div>
        {!ready ? (
          <div className="scan-line pointer-events-none absolute inset-y-0 w-1/3 bg-linear-to-r from-transparent via-accent/20 to-transparent" />
        ) : null}
      </div>
    </div>
  );
}
