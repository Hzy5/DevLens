import Link from "next/link";
import { Suspense } from "react";
import { AuthForm } from "@/components/AuthForm";
import { DevLensLogo } from "@/components/DevLensLogo";

export default function SignUpPage() {
  return (
    <main className="flex min-h-full flex-col items-center justify-center px-4 py-16">
      <Link
        href="/"
        className="mb-8 text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        <DevLensLogo variant="full" size="md" />
      </Link>
      <h1 className="sr-only">Sign up</h1>
      <p className="mb-6 max-w-sm text-center text-sm text-muted">
        Create a free account to analyze. We will email you a confirmation link first.
      </p>
      <Suspense>
        <AuthForm mode="sign-up" />
      </Suspense>
      <p className="mt-6 text-sm text-muted">
        Already have an account?{" "}
        <Link
          href="/sign-in"
          className="text-foreground underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          Sign in
        </Link>
      </p>
    </main>
  );
}
