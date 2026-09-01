"use client";

import { useAuth } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";
import { useCallback, useRef, useState } from "react";
import { AnalysisResult } from "@/components/AnalysisResult";
import { CodeInput } from "@/components/CodeInput";
import { ExampleCards } from "@/components/ExampleCards";
import { InputModeTabs } from "@/components/InputModeTabs";
import { LoadingState } from "@/components/LoadingState";
import { ScreenshotUpload } from "@/components/ScreenshotUpload";
import { trackEvent } from "@/lib/analytics";
import {
  DAILY_ANALYSIS_LIMIT,
  ERROR_MESSAGES,
  MAX_IMAGE_BYTES,
  PRIVACY_NOTE,
} from "@/lib/constants";
import { cn } from "@/lib/cn";
import { PAGE_WRAP } from "@/lib/layout";
import type { ExampleCard } from "@/lib/examples";
import type {
  Analysis,
  AnalyzeResponse,
  ClientErrorCode,
  InputMode,
  ScreenshotPayload,
} from "@/types/analysis";

const IMAGE_TYPES = new Set(["image/png", "image/jpeg", "image/jpg", "image/webp"]);

type WorkspaceView = "input" | "loading" | "ready" | "result";

type AttachedImage = ScreenshotPayload & { previewUrl: string };

export function DebugWorkspace() {
  const {
    isSignedIn,
    isEmailVerified,
    isLoaded,
    getIdToken,
    refreshEmailVerification,
  } = useAuth();
  const router = useRouter();
  const [mode, setMode] = useState<InputMode>("auto");
  const [input, setInput] = useState("");
  const [image, setImage] = useState<AttachedImage | null>(null);
  const [view, setView] = useState<WorkspaceView>("input");
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const dragDepth = useRef(0);

  const busy = view === "loading" || view === "ready";

  const setModeAndTrack = useCallback((next: InputMode) => {
    setMode(next);
    trackEvent("mode_selected");
  }, []);

  const attachFile = useCallback(async (file: File) => {
    if (!IMAGE_TYPES.has(file.type)) {
      setError(ERROR_MESSAGES.unsupported_file);
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setError(ERROR_MESSAGES.too_large);
      return;
    }

    try {
      const { compressScreenshot } = await import("@/lib/image");
      const compressed = await compressScreenshot(file);
      setImage(compressed);
      setError(null);
      if (mode === "auto") setMode("screenshot");
      trackEvent("screenshot_uploaded");
    } catch {
      setError(ERROR_MESSAGES.unsupported_file);
    }
  }, [mode]);

  const onFiles = useCallback(
    (files: FileList | File[]) => {
      const file = [...files].find((item) => item.type.startsWith("image/"));
      if (!file) {
        setError(ERROR_MESSAGES.unsupported_file);
        return;
      }
      void attachFile(file);
    },
    [attachFile],
  );

  function clear() {
    setInput("");
    setImage(null);
    setError(null);
    setAnalysis(null);
    setView("input");
  }

  function analyzeAnother() {
    setAnalysis(null);
    setError(null);
    setView("input");
    window.requestAnimationFrame(() => {
      document.getElementById("debug")?.scrollIntoView({ behavior: "smooth" });
      document.getElementById("debug-input")?.focus();
    });
  }

  function requireSignIn() {
    router.push("/sign-in?redirect_url=/#debug");
  }

  function requireVerifiedEmail() {
    router.push("/verify-email");
  }

  async function analyze() {
    if (!isSignedIn) {
      requireSignIn();
      return;
    }
    if (!isEmailVerified) {
      const verified = await refreshEmailVerification();
      if (!verified) {
        requireVerifiedEmail();
        return;
      }
    }

    if (!input.trim() && !image) {
      setError(ERROR_MESSAGES.empty_input);
      return;
    }

    setError(null);
    setView("loading");
    trackEvent("analysis_started");

    try {
      const token = await getIdToken(true);
      if (!token) {
        requireSignIn();
        setView("input");
        return;
      }

      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          mode,
          input,
          image: image
            ? { data: image.data, mimeType: image.mimeType }
            : null,
        }),
      });

      let payload: AnalyzeResponse | null = null;
      try {
        payload = (await response.json()) as AnalyzeResponse;
      } catch {
        payload = null;
      }

      if (!payload || payload.ok !== true) {
        if (!payload && (response.status === 504 || response.status === 508)) {
          setError("That took too long. Try a smaller log.");
          setView("input");
          trackEvent("analysis_failed");
          return;
        }
        const code = payload && payload.ok === false ? payload.error : "api_failure";
        setError(
          payload && payload.ok === false
            ? payload.message
            : ERROR_MESSAGES[code as ClientErrorCode] ?? ERROR_MESSAGES.api_failure,
        );
        setView("input");
        trackEvent("analysis_failed");
        return;
      }

      setAnalysis(payload.analysis);
      setView("ready");
      trackEvent("analysis_completed");
      window.setTimeout(() => setView("result"), 450);
    } catch {
      setError(ERROR_MESSAGES.api_failure);
      setView("input");
      trackEvent("analysis_failed");
    }
  }

  function onExample(example: ExampleCard) {
    setInput(example.input);
    setMode(example.mode);
    setImage(null);
    setError(null);
    setView("input");
    trackEvent("example_clicked");
    document.getElementById("debug-input")?.focus();
  }

  return (
    <section id="debug" aria-labelledby="workspace-heading" className={PAGE_WRAP}>
      <h2 id="workspace-heading" className="sr-only">
        Debug workspace
      </h2>

      {view === "result" && analysis ? (
        <AnalysisResult analysis={analysis} onAnalyzeAnother={analyzeAnother} />
      ) : view === "loading" || view === "ready" ? (
        <LoadingState ready={view === "ready"} />
      ) : (
        <div
          className="panel overflow-hidden rounded-xl border border-border bg-surface/90 backdrop-blur-sm"
          onKeyDown={(event) => {
            if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
              event.preventDefault();
              void analyze();
            }
          }}
          onDragEnter={(event) => {
            event.preventDefault();
            dragDepth.current += 1;
            setDragging(true);
          }}
          onDragOver={(event) => {
            event.preventDefault();
          }}
          onDragLeave={(event) => {
            event.preventDefault();
            dragDepth.current = Math.max(0, dragDepth.current - 1);
            if (dragDepth.current === 0) setDragging(false);
          }}
          onDrop={(event) => {
            event.preventDefault();
            dragDepth.current = 0;
            setDragging(false);
            if (event.dataTransfer.files.length) onFiles(event.dataTransfer.files);
          }}
        >
          <div className="flex items-center gap-2 border-b border-border px-3 py-2">
            <span className="size-2 rounded-full bg-[#ff5f57]" aria-hidden="true" />
            <span className="size-2 rounded-full bg-[#febc2e]" aria-hidden="true" />
            <span className="size-2 rounded-full bg-[#28c840]" aria-hidden="true" />
            <p className="ml-2 font-mono text-[11px] text-muted">debug.session</p>
            <p className="ml-auto font-mono text-[10px] uppercase tracking-[0.16em] text-accent">
              live
            </p>
          </div>
          <InputModeTabs value={mode} onChange={setModeAndTrack} />
          <CodeInput
            value={input}
            onChange={setInput}
            onFiles={onFiles}
            dragging={dragging}
            disabled={busy}
          />
          <div className="flex flex-col gap-4 border-t border-border px-4 py-4 sm:px-5">
            <ScreenshotUpload
              previewUrl={image?.previewUrl ?? null}
              onSelect={(file) => void attachFile(file)}
              onRemove={() => setImage(null)}
              disabled={busy}
            />
            <p className="text-xs leading-5 text-muted">{PRIVACY_NOTE}</p>
            {isLoaded && !isSignedIn ? (
              <p className="text-sm text-muted-strong">
                Sign in to analyze. Free accounts get {DAILY_ANALYSIS_LIMIT} diagnoses a day.
              </p>
            ) : null}
            {isLoaded && isSignedIn && !isEmailVerified ? (
              <p className="text-sm text-muted-strong">
                Confirm your email to analyze. Check your inbox for the link we sent.
              </p>
            ) : null}
            {error ? (
              <p role="alert" className="text-sm text-danger">
                {error}
              </p>
            ) : null}
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  void analyze();
                }}
                disabled={busy || !isLoaded}
                className={cn(
                  "inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-on-accent",
                  "transition-opacity hover:opacity-90",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
                  "disabled:opacity-50",
                )}
              >
                <SearchIcon />
                {isLoaded && !isSignedIn
                  ? "Sign in to analyze"
                  : isLoaded && !isEmailVerified
                    ? "Confirm email to analyze"
                    : "Analyze"}
              </button>
              <button
                type="button"
                onClick={clear}
                disabled={busy}
                className="rounded-md px-3 py-2 text-sm text-muted transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-50"
              >
                Clear
              </button>
              <span className="ml-auto hidden text-xs text-muted sm:inline">
                ⌘ / Ctrl + Enter
              </span>
            </div>
          </div>
        </div>
      )}

      <ExampleCards onSelect={onExample} disabled={busy} />
    </section>
  );
}

function SearchIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="7" cy="7" r="4.25" stroke="currentColor" strokeWidth="1.6" />
      <path d="M10.2 10.2L13.4 13.4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
