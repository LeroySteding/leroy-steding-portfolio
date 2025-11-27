/**
 * Simple in-memory rate limiter for API routes
 * Uses a sliding window approach
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

// Clean up old entries every 5 minutes
setInterval(
  () => {
    const now = Date.now();
    for (const [key, entry] of rateLimitStore.entries()) {
      if (entry.resetTime < now) {
        rateLimitStore.delete(key);
      }
    }
  },
  5 * 60 * 1000,
);

interface RateLimitOptions {
  /** Maximum number of requests allowed in the window */
  limit: number;
  /** Time window in seconds */
  windowSeconds: number;
}

interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

/**
 * Check if a request should be rate limited
 * @param identifier - Unique identifier for the client (e.g., IP address)
 * @param options - Rate limit configuration
 */
export function rateLimit(
  identifier: string,
  options: RateLimitOptions,
): RateLimitResult {
  const { limit, windowSeconds } = options;
  const now = Date.now();
  const windowMs = windowSeconds * 1000;
  const resetTime = now + windowMs;

  const entry = rateLimitStore.get(identifier);

  // If no entry or window has expired, create new entry
  if (!entry || entry.resetTime < now) {
    rateLimitStore.set(identifier, { count: 1, resetTime });
    return {
      success: true,
      limit,
      remaining: limit - 1,
      reset: resetTime,
    };
  }

  // Increment count
  entry.count += 1;

  // Check if over limit
  if (entry.count > limit) {
    return {
      success: false,
      limit,
      remaining: 0,
      reset: entry.resetTime,
    };
  }

  return {
    success: true,
    limit,
    remaining: limit - entry.count,
    reset: entry.resetTime,
  };
}

/**
 * Get client IP from request headers
 */
export function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp;
  }

  // Fallback for development
  return "127.0.0.1";
}
