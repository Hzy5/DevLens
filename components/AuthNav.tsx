"use client";

import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";

export function AuthNav() {
  const { isLoaded, isSignedIn, isEmailVerified, user, signOut } = useAuth();

  if (!isLoaded) {
    return <div className="h-8 w-24 rounded-md bg-surface-2" aria-hidden="true" />;
  }

  if (!isSignedIn) {
    return (
      <div className="flex items-center gap-2 sm:gap-3">
        <Link
          href="/sign-in"
          className="rounded-md px-3 py-1.5 text-sm text-muted transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          Sign in
        </Link>
        <Link
          href="/sign-up"
          className="rounded-md bg-foreground px-3 py-1.5 text-sm font-medium text-background transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          Sign up
        </Link>
      </div>
    );
  }

  const label = user?.email?.split("@")[0] ?? "Account";

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <Link
        href={isEmailVerified ? "/#debug" : "/verify-email"}
        className="hidden rounded-md bg-foreground px-3 py-1.5 text-sm font-medium text-background transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:inline-flex"
      >
        {isEmailVerified ? "Try DevLens" : "Confirm email"}
      </Link>
      <span className="hidden max-w-28 truncate text-sm text-muted sm:inline">
        {label}
      </span>
      <button
        type="button"
        onClick={() => void signOut()}
        className="rounded-md px-3 py-1.5 text-sm text-muted transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        Sign out
      </button>
    </div>
  );
}
