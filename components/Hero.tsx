import { WorkbenchFrame } from "@/components/WorkbenchFrame";
import { PAGE_WRAP } from "@/lib/layout";

export function Hero() {
  return (
    <section className={`${PAGE_WRAP} pb-6 pt-14 sm:pt-20`}>
      <div className="mx-auto max-w-3xl text-center">
        <p className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/80 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
          <span className="size-1.5 rounded-full bg-accent" aria-hidden="true" />
          Late-night debugging, focused
        </p>
        <h1 className="mt-5 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl sm:leading-[1.08]">
          Drop the error.
          <br />
          See what&apos;s actually wrong.
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-muted-strong sm:text-[17px]">
          Paste an error, crash log, code snippet, API response, or screenshot.
          DevLens finds the problem and shows you what to fix — like a second
          pair of eyes on the desk.
        </p>
      </div>
      <WorkbenchFrame
        className="mt-10"
        title="AppDelegate.swift"
        meta="Thread 1 crashed"
      >
        <div className="grid grid-cols-[2.25rem_minmax(0,1fr)] gap-x-3 px-4 py-4 font-mono text-[12px] leading-6 sm:text-[13px]">
          <span className="text-right text-muted/70">38</span>
          <span className="text-muted-strong">func loadSession() {"{"}</span>
          <span className="text-right text-muted/70">39</span>
          <span className="pl-4 text-muted-strong">
            let user = currentUser
            <span className="text-danger">!</span>
          </span>
          <span className="text-right text-muted/70">40</span>
          <span className="pl-4 text-muted-strong">
            profile.label = user.name
            <span className="caret-blink ml-0.5 inline-block h-4 w-[7px] translate-y-0.5 bg-accent align-middle" />
          </span>
          <span className="text-right text-muted/70">41</span>
          <span className="text-muted-strong">{"}"}</span>
          <span className="col-span-2 mt-3 rounded-md border border-danger/30 bg-danger/10 px-3 py-2 text-[11px] text-danger">
            Fatal error: Unexpectedly found nil while unwrapping an Optional
          </span>
        </div>
      </WorkbenchFrame>
    </section>
  );
}
