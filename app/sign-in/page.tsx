import Link from "next/link";
import { Suspense } from "react";
import { AuthForm } from "@/components/AuthForm";
import { DevLensLogo } from "@/components/DevLensLogo";

export default function SignInPage() {
  return (
    <main className="flex min-h-full flex-col items-center justify-center px-4 py-16">
      <Link
        href="/"
        className="mb-8 text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        <DevLensLogo variant="full" size="md" />
      </Link>
      <h1 className="sr-only">Sign in</h1>
      <p className="mb-6 max-w-sm text-center text-sm text-muted">
        Sign in to analyze errors. This keeps free usage from burning through API tokens.
      </p>
      <Suspense>
        <AuthForm mode="sign-in" />
      </Suspense>
      <p className="mt-6 text-sm text-muted">
        No account?{" "}
        <Link
          href="/sign-up"
          className="text-foreground underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          Sign up
        </Link>
      </p>
    </main>
  );
}
