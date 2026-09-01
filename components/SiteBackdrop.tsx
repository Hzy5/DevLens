export function SiteBackdrop() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-background" />
      <div
        className="desk-glow absolute -left-24 -top-32 h-[28rem] w-[28rem] rounded-full blur-3xl"
        style={{ background: "var(--lamp)" }}
      />
      <div
        className="desk-glow absolute -right-16 top-24 h-[32rem] w-[32rem] rounded-full blur-3xl"
        style={{ background: "var(--glow)" }}
      />
      <div
        className="absolute inset-0 opacity-80"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--grid) 1px, transparent 1px), linear-gradient(to bottom, var(--grid) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage:
            "radial-gradient(ellipse 90% 70% at 50% -10%, black, transparent 72%)",
        }}
      />
      <pre className="absolute left-[4%] top-[18%] hidden max-w-sm font-mono text-[11px] leading-5 text-muted/25 lg:block">
        {`func fetchUser() {
  guard let id = currentUser?.id else {
    fatalError("missing session")
  }
  return api.get("/users/\\(id)")
}`}
      </pre>
      <pre className="absolute bottom-[12%] right-[5%] hidden max-w-xs font-mono text-[11px] leading-5 text-muted/20 lg:block">
        {`POST /api/analyze 200
latency 3.1s
cause: force unwrap
fix: if let user = currentUser`}
      </pre>
    </div>
  );
}
