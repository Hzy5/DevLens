"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { cn } from "@/lib/cn";

export function VerifyEmailPanel() {
  const {
    isLoaded,
    isSignedIn,
    isEmailVerified,
    user,
    sendVerificationEmail,
    refreshEmailVerification,
    signOut,
  } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn) {
      router.replace("/sign-in?redirect_url=/verify-email");
      return;
    }
    if (isEmailVerified) {
      router.replace("/#debug");
    }
  }, [isLoaded, isSignedIn, isEmailVerified, router]);

  useEffect(() => {
    if (!isSignedIn || isEmailVerified) return;

    async function check() {
      const verified = await refreshEmailVerification();
      if (verified) {
        router.replace("/#debug");
      }
    }

    function onVisible() {
      if (document.visibilityState === "visible") {
        void check();
      }
    }

    void check();
    document.addEventListener("visibilitychange", onVisible);
    const timer = window.setInterval(() => {
      void check();
    }, 8000);

    return () => {
      document.removeEventListener("visibilitychange", onVisible);
      window.clearInterval(timer);
    };
  }, [isSignedIn, isEmailVerified, refreshEmailVerification, router]);

  async function onResend() {
    setError(null);
    setStatus(null);
    setBusy(true);
    try {
      await sendVerificationEmail();
      setStatus("Confirmation email sent. Check your inbox and spam folder.");
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : "Couldn't send that email.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function onConfirmed() {
    setError(null);
    setStatus(null);
    setBusy(true);
    try {
      const verified = await refreshEmailVerification();
      if (verified) {
        router.replace("/#debug");
        return;
      }
      setError("Email isn't confirmed yet. Open the link we sent, then try again.");
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : "Couldn't check confirmation.",
      );
    } finally {
      setBusy(false);
    }
  }

  if (!isLoaded || !isSignedIn || isEmailVerified) {
    return (
      <div
        className="h-48 w-full max-w-sm rounded-xl border border-border bg-surface/90"
        aria-hidden="true"
      />
    );
  }

  return (
    <div className="panel w-full max-w-sm rounded-xl border border-border bg-surface/90 p-6 backdrop-blur-sm">
      <h1 className="text-lg font-semibold text-foreground">Confirm your email</h1>
      <p className="mt-2 text-sm leading-6 text-muted">
        We sent a confirmation link to{" "}
        <span className="font-medium text-foreground">{user?.email}</span>. Open
        it to start analyzing.
      </p>
      {status ? (
        <p role="status" className="mt-4 text-sm text-muted-strong">
          {status}
        </p>
      ) : null}
      {error ? (
        <p role="alert" className="mt-4 text-sm text-danger">
          {error}
        </p>
      ) : null}
      <div className="mt-5 space-y-3">
        <button
          type="button"
          onClick={() => void onConfirmed()}
          disabled={busy}
          className={cn(
            "w-full rounded-md bg-accent px-3 py-2.5 text-sm font-medium text-on-accent",
            "transition-opacity hover:opacity-90 disabled:opacity-50",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
          )}
        >
          I confirmed my email
        </button>
        <button
          type="button"
          onClick={() => void onResend()}
          disabled={busy}
          className="w-full rounded-md border border-border px-3 py-2.5 text-sm text-foreground transition-colors hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-50"
        >
          Resend confirmation email
        </button>
      </div>
      <p className="mt-5 text-sm text-muted">
        Wrong account?{" "}
        <button
          type="button"
          onClick={() => void signOut()}
          className="text-foreground underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          Sign out
        </button>
        {" · "}
        <Link
          href="/"
          className="text-foreground underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          Home
        </Link>
      </p>
    </div>
  );
}
