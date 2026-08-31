"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";

type CodeBlockProps = {
  code: string;
  label: string;
  language?: string | null;
};

export function CodeBlock({ code, label, language }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-[#0c0c0e]">
      <div className="flex items-center justify-between border-b border-white/8 px-3 py-2">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-zinc-400">
            {label}
          </span>
          {language ? (
            <span className="rounded px-1.5 py-0.5 font-mono text-[10px] text-zinc-500">
              {language}
            </span>
          ) : null}
        </div>
        <button
          type="button"
          onClick={copy}
          className={cn(
            "rounded px-2 py-1 text-[11px] text-zinc-400 transition-colors hover:bg-white/6 hover:text-zinc-200",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400",
          )}
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto p-4">
        <code className="font-mono text-[13px] leading-6 text-zinc-100">{code}</code>
      </pre>
    </div>
  );
}
