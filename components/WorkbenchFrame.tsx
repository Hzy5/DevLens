import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type WorkbenchFrameProps = {
  title?: string;
  meta?: string;
  children: ReactNode;
  className?: string;
};

export function WorkbenchFrame({
  title,
  meta,
  children,
  className,
}: WorkbenchFrameProps) {
  return (
    <div
      className={cn(
        "panel overflow-hidden rounded-xl border border-border bg-surface/90 backdrop-blur-sm",
        className,
      )}
    >
      <div className="flex items-center gap-2 border-b border-border px-3 py-2">
        <span className="size-2 rounded-full bg-[#ff5f57]" aria-hidden="true" />
        <span className="size-2 rounded-full bg-[#febc2e]" aria-hidden="true" />
        <span className="size-2 rounded-full bg-[#28c840]" aria-hidden="true" />
        {title ? (
          <p className="ml-2 truncate font-mono text-[11px] text-muted">{title}</p>
        ) : null}
        {meta ? (
          <p className="ml-auto shrink-0 font-mono text-[10px] uppercase tracking-[0.16em] text-accent">
            {meta}
          </p>
        ) : null}
      </div>
      {children}
    </div>
  );
}
