"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { cn } from "@/lib/cn";

type AuthFormProps = {
  mode: "sign-in" | "sign-up";
};

export function AuthForm({ mode }: AuthFormProps) {
  const { signIn, signUp, signInWithGoogle } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const redirectTo = searchParams.get("redirect_url") || "/#debug";

  function finish(emailVerified: boolean) {
    router.replace(emailVerified ? redirectTo : "/verify-email");
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const result =
        mode === "sign-in"
          ? await signIn(email, password)
          : await signUp(email, password);
      finish(result.emailVerified);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Couldn't complete that.");
    } finally {
      setBusy(false);
    }
  }

  async function onGoogle() {
    setError(null);
    setBusy(true);
    try {
      const result = await signInWithGoogle();
      finish(result.emailVerified);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Couldn't complete that.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="panel w-full max-w-sm rounded-xl border border-border bg-surface/90 p-6 backdrop-blur-sm">
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="email" className="text-sm font-medium text-foreground">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="password" className="text-sm font-medium text-foreground">
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete={mode === "sign-in" ? "current-password" : "new-password"}
            required
            minLength={6}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          />
        </div>
        {error ? (
          <p role="alert" className="text-sm text-danger">
            {error}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={busy}
          className={cn(
            "w-full rounded-md bg-accent px-3 py-2.5 text-sm font-medium text-on-accent",
            "transition-opacity hover:opacity-90 disabled:opacity-50",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
          )}
        >
          {mode === "sign-in" ? "Sign in" : "Create account"}
        </button>
      </form>
      <div className="my-4 flex items-center gap-3 text-xs text-muted">
        <span className="h-px flex-1 bg-border" />
        or
        <span className="h-px flex-1 bg-border" />
      </div>
      <button
        type="button"
        onClick={() => void onGoogle()}
        disabled={busy}
        className="w-full rounded-md border border-border px-3 py-2.5 text-sm text-foreground transition-colors hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-50"
      >
        Continue with Google
      </button>
    </div>
  );
}
