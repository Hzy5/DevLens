"use client";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center px-4 text-center">
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
        DevLens
      </p>
      <h1 className="mt-3 text-2xl font-semibold tracking-tight text-foreground">
        Something broke in the lens.
      </h1>
      <p className="mt-2 max-w-md text-sm text-muted-strong">
        DevLens couldn&apos;t render this page. Try again.
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-6 rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        Try again
      </button>
    </div>
  );
}
