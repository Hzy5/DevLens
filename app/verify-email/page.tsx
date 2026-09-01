import type { Metadata } from "next";
import Link from "next/link";
import { DevLensLogo } from "@/components/DevLensLogo";
import { VerifyEmailPanel } from "@/components/VerifyEmailPanel";

export const metadata: Metadata = {
  title: "Confirm your email — DevLens",
  description: "Confirm your email to start analyzing with DevLens.",
};

export default function VerifyEmailPage() {
  return (
    <main className="flex min-h-full flex-col items-center justify-center px-4 py-16">
      <Link
        href="/"
        className="mb-8 text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        <DevLensLogo variant="full" size="md" />
      </Link>
      <VerifyEmailPanel />
    </main>
  );
}
