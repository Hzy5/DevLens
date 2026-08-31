import { cn } from "@/lib/cn";

type LogoVariant = "full" | "icon" | "wordmark";
type LogoSize = "sm" | "md" | "lg";

type DevLensLogoProps = {
  variant?: LogoVariant;
  size?: LogoSize;
  className?: string;
};

const SIZE = {
  sm: { icon: 20, text: "text-[14px]", gap: "gap-1.5" },
  md: { icon: 28, text: "text-lg", gap: "gap-2" },
  lg: { icon: 40, text: "text-[28px]", gap: "gap-2.5" },
} as const;

function LensMark({ size, title }: { size: number; title?: boolean }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
    >
      {title ? <title>DevLens</title> : null}
      <circle cx="14.25" cy="14.25" r="8.15" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M11.15 11.7L8.85 14.25l2.3 2.55"
        stroke="currentColor"
        strokeWidth="1.55"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17.35 11.7l2.3 2.55-2.3 2.55"
        stroke="currentColor"
        strokeWidth="1.55"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20.3 20.3L26.15 26.15"
        stroke="currentColor"
        strokeWidth="2.15"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function DevLensLogo({
  variant = "full",
  size = "md",
  className,
}: DevLensLogoProps) {
  const tokens = SIZE[size];

  return (
    <span
      className={cn(
        "inline-flex items-center text-current",
        tokens.gap,
        className,
      )}
    >
      {variant !== "wordmark" ? (
        <LensMark size={tokens.icon} title={variant === "icon"} />
      ) : null}
      {variant !== "icon" ? (
        <span
          className={cn(
            "font-semibold tracking-tight",
            tokens.text,
          )}
        >
          DevLens
        </span>
      ) : null}
    </span>
  );
}
