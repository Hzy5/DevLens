"use client";

import { useState } from "react";
import { CodeBlock } from "@/components/CodeBlock";
import { trackEvent } from "@/lib/analytics";
import type { Analysis } from "@/types/analysis";

type FixSectionProps = {
  analysis: Analysis;
};

export function FixSection({ analysis }: FixSectionProps) {
  const { fix } = analysis;
  const [copied, setCopied] = useState(false);

  async function copyFix() {
    const text = [fix.summary, fix.codeAfter].filter(Boolean).join("\n\n");
    await navigator.clipboard.writeText(text);
    trackEvent("copy_fix_clicked");
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <section aria-labelledby="fix-heading" className="space-y-4">
      <div className="space-y-2">
        <h3 id="fix-heading" className="text-sm font-medium text-foreground">
          <span aria-hidden="true">🛠 </span>Fix
        </h3>
        <p className="text-[15px] leading-7 text-muted-strong">{fix.summary}</p>
      </div>

      {fix.codeBefore ? (
        <CodeBlock code={fix.codeBefore} label="Before" language={fix.language} />
      ) : null}
      {fix.codeAfter ? (
        <CodeBlock code={fix.codeAfter} label="After" language={fix.language} />
      ) : null}

      <button
        type="button"
        onClick={copyFix}
        className="rounded-md border border-border px-3 py-2 text-sm text-foreground transition-colors hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        {copied ? "Copied" : "Copy Fix"}
      </button>
    </section>
  );
}
