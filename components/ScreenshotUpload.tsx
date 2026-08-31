"use client";

import { useId, useRef } from "react";

type ScreenshotUploadProps = {
  previewUrl: string | null;
  onSelect: (file: File) => void;
  onRemove: () => void;
  disabled?: boolean;
};

export function ScreenshotUpload({
  previewUrl,
  onSelect,
  onRemove,
  disabled,
}: ScreenshotUploadProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-col gap-3">
      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/webp"
        className="sr-only"
        disabled={disabled}
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) onSelect(file);
          event.target.value = "";
        }}
      />

      {previewUrl ? (
        <div className="flex items-start gap-3 rounded-lg border border-border bg-surface-2 p-3">
          {/* Preview is a local object/data URL, not a remote asset. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewUrl}
            alt="Attached screenshot preview"
            className="h-16 w-16 rounded-md object-cover"
          />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-foreground">Screenshot attached</p>
            <p className="mt-0.5 text-xs text-muted">Not stored after this analysis.</p>
          </div>
          <button
            type="button"
            onClick={onRemove}
            disabled={disabled}
            className="rounded-md px-2 py-1 text-xs text-muted transition-colors hover:bg-surface hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-50"
          >
            Remove
          </button>
        </div>
      ) : (
        <button
          type="button"
          disabled={disabled}
          onClick={() => inputRef.current?.click()}
          className="inline-flex items-center gap-2 self-start rounded-md border border-border px-3 py-2 text-sm text-muted transition-colors hover:border-foreground/20 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-50"
        >
          <PaperclipIcon />
          Upload screenshot
        </button>
      )}
    </div>
  );
}

function PaperclipIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M10.2 4.4L5.05 9.55a2.1 2.1 0 1 0 3 3l5.55-5.55a3.4 3.4 0 0 0-4.8-4.8L3.15 8.25"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}
