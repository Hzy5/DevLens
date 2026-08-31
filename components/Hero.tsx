export function Hero() {
  return (
    <section className="mx-auto max-w-3xl px-4 pb-8 pt-16 text-center sm:pt-24">
      <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted">
        DevLens
      </p>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl sm:leading-[1.1]">
        Drop the error.
        <br />
        See what&apos;s actually wrong.
      </h1>
      <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-muted-strong sm:text-[17px]">
        Paste an error, crash log, code snippet, API response, or screenshot.
        DevLens finds the problem and shows you what to fix.
      </p>
    </section>
  );
}
