type Entry = { count: number; resetAt: number };
const buckets = new Map<string, Entry>();

/** Lightweight per-process limiter. Use a shared store (e.g. Upstash) when deploying across instances. */
export function rateLimit(key: string, max: number, windowMs: number) {
  const now = Date.now();
  const current = buckets.get(key);
  if (!current || current.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfter: 0 };
  }
  current.count += 1;
  return { allowed: current.count <= max, retryAfter: Math.ceil((current.resetAt - now) / 1000) };
}

/** Returns the current lock state without consuming an attempt. */
export function isRateLimited(key: string) {
  const entry = buckets.get(key);
  const now = Date.now();
  if (!entry || entry.resetAt <= now) {
    if (entry) buckets.delete(key);
    return { limited: false, retryAfter: 0 };
  }
  return { limited: entry.count >= 5, retryAfter: Math.ceil((entry.resetAt - now) / 1000) };
}

export function resetRateLimit(key: string) {
  buckets.delete(key);
}

export function clientIp(request: Request) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
}
