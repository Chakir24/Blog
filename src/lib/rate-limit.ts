/**
 * Simple in-memory rate limiter for API routes.
 * For production at scale, consider Redis-based rate limiting.
 */

const store = new Map<string, { count: number; resetAt: number }>();

const WINDOW_MS = 60 * 1000; // 1 minute

function getClientKey(identifier: string): string {
  return identifier;
}

function cleanup(): void {
  const now = Date.now();
  for (const [key, data] of store.entries()) {
    if (data.resetAt < now) store.delete(key);
  }
}

// Run cleanup every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(cleanup, 5 * 60 * 1000);
}

export function checkRateLimit(
  identifier: string,
  maxRequests: number,
  windowMs = WINDOW_MS
): { allowed: boolean; remaining: number; resetIn: number } {
  const key = getClientKey(identifier);
  const now = Date.now();
  let data = store.get(key);

  if (!data || data.resetAt < now) {
    data = { count: 1, resetAt: now + windowMs };
    store.set(key, data);
    return { allowed: true, remaining: maxRequests - 1, resetIn: windowMs };
  }

  data.count++;
  const remaining = Math.max(0, maxRequests - data.count);
  return {
    allowed: data.count <= maxRequests,
    remaining,
    resetIn: Math.max(0, data.resetAt - now),
  };
}

export function getClientIdentifier(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const ip = forwarded?.split(',')[0]?.trim() || realIp || 'unknown';
  return ip;
}
