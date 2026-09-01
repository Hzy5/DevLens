import Link from "next/link";
import { AuthNav } from "@/components/AuthNav";
import { DevLensLogo } from "@/components/DevLensLogo";

const LINKS = [
  { href: "/#debug", label: "Debug" },
  { href: "/#how-it-works", label: "How it works" },
  { href: "/#examples", label: "Examples" },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-30 border-b border-border/80 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4">
        <Link
          href="/"
          className="rounded-md text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          <DevLensLogo variant="full" size="sm" />
        </Link>
        <nav aria-label="Primary" className="hidden items-center gap-6 md:flex">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-muted transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <AuthNav />
      </div>
    </header>
  );
}
