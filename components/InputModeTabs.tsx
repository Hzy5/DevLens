"use client";

import { MODE_LABELS } from "@/lib/constants";
import { cn } from "@/lib/cn";
import { INPUT_MODES, type InputMode } from "@/types/analysis";

type InputModeTabsProps = {
  value: InputMode;
  onChange: (mode: InputMode) => void;
};

export function InputModeTabs({ value, onChange }: InputModeTabsProps) {
  return (
    <div
      role="tablist"
      aria-label="Input mode"
      className="flex flex-wrap gap-1 border-b border-border px-2 py-2 sm:px-3"
    >
      {INPUT_MODES.map((mode) => {
        const selected = value === mode;
        return (
          <button
            key={mode}
            type="button"
            role="tab"
            id={`mode-tab-${mode}`}
            aria-selected={selected}
            aria-controls="debug-input"
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(mode)}
            onKeyDown={(event) => {
              if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
              event.preventDefault();
              const index = INPUT_MODES.indexOf(mode);
              const next =
                event.key === "ArrowRight"
                  ? INPUT_MODES[(index + 1) % INPUT_MODES.length]
                  : INPUT_MODES[(index - 1 + INPUT_MODES.length) % INPUT_MODES.length];
              onChange(next);
              document.getElementById(`mode-tab-${next}`)?.focus();
            }}
            className={cn(
              "rounded-md px-2.5 py-1.5 text-xs font-medium tracking-tight transition-colors sm:text-[13px]",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
              selected
                ? "bg-accent text-on-accent"
                : "text-muted hover:bg-surface-2/70 hover:text-foreground",
            )}
          >
            {MODE_LABELS[mode]}
          </button>
        );
      })}
    </div>
  );
}
