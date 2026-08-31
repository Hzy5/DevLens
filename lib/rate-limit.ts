/**
 * In-memory rate limiter for the Vercel MVP.
 *
 * This is process-local. On Vercel, each isolate has its own map, so it
 * blocks obvious repeated requests from the same instance but is not a
 * global guarantee. That is enough for V1 abuse protection.
 *
 * Upgrade later with one of:
 * - Vercel Firewall / WAF rate-limiting rules
 * - Upstash Redis sliding window
 * - Vercel Redis / another shared store
 */

type Bucket = {
  count: number;
  resetAt: number;
};

const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 10;

const buckets = new Map<string, Bucket>();

function prune(now: number) {
  if (buckets.size < 2_000) return;
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}

export async function hashIdentifier(value: string): Promise<string> {
  const encoded = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", encoded);
  return Array.from(new Uint8Array(digest), (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");
}

export function getClientIdentifier(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  const raw = forwarded?.split(",")[0]?.trim() || realIp?.trim() || "unknown";
  return raw;
}

export type RateLimitResult = {
  ok: boolean;
  remaining: number;
  resetAt: number;
  retryAfterSeconds: number;
};

export function checkRateLimit(id: string): RateLimitResult {
  const now = Date.now();
  prune(now);

  const existing = buckets.get(id);
  if (!existing || existing.resetAt <= now) {
    const resetAt = now + WINDOW_MS;
    buckets.set(id, { count: 1, resetAt });
    return {
      ok: true,
      remaining: MAX_REQUESTS - 1,
      resetAt,
      retryAfterSeconds: Math.ceil(WINDOW_MS / 1000),
    };
  }

  if (existing.count >= MAX_REQUESTS) {
    return {
      ok: false,
      remaining: 0,
      resetAt: existing.resetAt,
      retryAfterSeconds: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
    };
  }

  existing.count += 1;
  return {
    ok: true,
    remaining: MAX_REQUESTS - existing.count,
    resetAt: existing.resetAt,
    retryAfterSeconds: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
  };
}
