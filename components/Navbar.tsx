import Link from "next/link";
import { AuthNav } from "@/components/AuthNav";
import { DevLensLogo } from "@/components/DevLensLogo";
import { PAGE_WRAP } from "@/lib/layout";

const LINKS = [
  { href: "/#debug", label: "Debug" },
  { href: "/#how-it-works", label: "How it works" },
  { href: "/#examples", label: "Examples" },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-30 border-b border-border/80 bg-background/70 backdrop-blur-xl">
      <div className={`${PAGE_WRAP} flex h-14 items-center justify-between`}>
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
              className="font-mono text-[12px] uppercase tracking-[0.14em] text-muted transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
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
