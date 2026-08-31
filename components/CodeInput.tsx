"use client";

import { cn } from "@/lib/cn";

type CodeInputProps = {
  value: string;
  onChange: (value: string) => void;
  onFiles: (files: FileList | File[]) => void;
  dragging: boolean;
  disabled?: boolean;
};

const PLACEHOLDER = `Paste your error, stack trace, code, API response, or logs here...

Example:

Thread 1: Fatal error: Unexpectedly found nil
while implicitly unwrapping an Optional value`;

export function CodeInput({
  value,
  onChange,
  onFiles,
  dragging,
  disabled,
}: CodeInputProps) {
  return (
    <div className="relative">
      <label htmlFor="debug-input" className="sr-only">
        Debugging input
      </label>
      <textarea
        id="debug-input"
        name="input"
        value={value}
        disabled={disabled}
        spellCheck={false}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        placeholder={PLACEHOLDER}
        onChange={(event) => onChange(event.target.value)}
        onPaste={(event) => {
          const files = event.clipboardData?.files;
          if (files && files.length > 0 && [...files].some((file) => file.type.startsWith("image/"))) {
            event.preventDefault();
            onFiles(files);
          }
        }}
        className={cn(
          "min-h-[280px] w-full resize-y bg-transparent px-4 py-4 font-mono text-[13px] leading-6 text-foreground",
          "placeholder:text-muted/70",
          "focus-visible:outline-none",
          "disabled:cursor-not-allowed disabled:opacity-60",
        )}
      />
      {dragging ? (
        <div
          className="absolute inset-3 flex items-center justify-center rounded-lg border border-dashed border-accent bg-background/85"
          aria-hidden="true"
        >
          <p className="text-sm font-medium text-foreground">Drop screenshot to analyze</p>
        </div>
      ) : null}
    </div>
  );
}
