import { DevLensLogo } from "@/components/DevLensLogo";

const SITE_LINKS = [
  { href: "#debug", label: "Debug" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#examples", label: "Examples" },
];

const ELSEWHERE_LINKS = [
  { href: "https://github.com/Hzy5", label: "GitHub" },
  { href: "https://x.com/hzydevelops", label: "X" },
  { href: "https://hzy5.github.io/MyPortfolio/", label: "HzY Develops" },
];

const linkClass =
  "text-muted transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-10 sm:grid-cols-3">
        <div>
          <DevLensLogo variant="full" size="sm" />
          <p className="mt-3 max-w-sm text-sm leading-6 text-muted">
            A focused debugging lens by HzY Develops.
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">Site</p>
          <ul className="mt-3 space-y-2 text-sm">
            {SITE_LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href} className={linkClass}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">Elsewhere</p>
          <ul className="mt-3 space-y-2 text-sm">
            {ELSEWHERE_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className={linkClass}
                  target="_blank"
                  rel="noreferrer"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <p className="mx-auto max-w-6xl px-4 py-4 text-xs text-muted">
          © 2026 HzY Develops. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
