import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

describe("rateLimit", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("allows requests within the limit", () => {
    const result = rateLimit("test-user-1", { limit: 5, windowSeconds: 60 });

    expect(result.success).toBe(true);
    expect(result.limit).toBe(5);
    expect(result.remaining).toBe(4);
  });

  it("tracks multiple requests from the same identifier", () => {
    const identifier = "test-user-2";
    const options = { limit: 3, windowSeconds: 60 };

    const result1 = rateLimit(identifier, options);
    expect(result1.remaining).toBe(2);

    const result2 = rateLimit(identifier, options);
    expect(result2.remaining).toBe(1);

    const result3 = rateLimit(identifier, options);
    expect(result3.remaining).toBe(0);
  });

  it("blocks requests when limit is exceeded", () => {
    const identifier = "test-user-3";
    const options = { limit: 2, windowSeconds: 60 };

    rateLimit(identifier, options); // 1st request
    rateLimit(identifier, options); // 2nd request

    const result = rateLimit(identifier, options); // 3rd request - should be blocked

    expect(result.success).toBe(false);
    expect(result.remaining).toBe(0);
  });

  it("resets after the window expires", () => {
    const identifier = "test-user-4";
    const options = { limit: 2, windowSeconds: 60 };

    rateLimit(identifier, options);
    rateLimit(identifier, options);

    // Verify limit is reached
    const blockedResult = rateLimit(identifier, options);
    expect(blockedResult.success).toBe(false);

    // Advance time past the window
    vi.advanceTimersByTime(61 * 1000);

    // Should be allowed again
    const newResult = rateLimit(identifier, options);
    expect(newResult.success).toBe(true);
    expect(newResult.remaining).toBe(1);
  });

  it("handles different identifiers independently", () => {
    const options = { limit: 1, windowSeconds: 60 };

    const result1 = rateLimit("user-a", options);
    const result2 = rateLimit("user-b", options);

    expect(result1.success).toBe(true);
    expect(result2.success).toBe(true);

    // Now both should be blocked
    expect(rateLimit("user-a", options).success).toBe(false);
    expect(rateLimit("user-b", options).success).toBe(false);
  });

  it("returns correct reset timestamp", () => {
    const now = Date.now();
    vi.setSystemTime(now);

    const result = rateLimit("test-user-5", { limit: 5, windowSeconds: 120 });

    expect(result.reset).toBe(now + 120 * 1000);
  });
});

describe("getClientIp", () => {
  it("extracts IP from x-forwarded-for header", () => {
    const request = new Request("http://localhost", {
      headers: { "x-forwarded-for": "192.168.1.1, 10.0.0.1" },
    });

    expect(getClientIp(request)).toBe("192.168.1.1");
  });

  it("extracts IP from x-real-ip header", () => {
    const request = new Request("http://localhost", {
      headers: { "x-real-ip": "192.168.1.2" },
    });

    expect(getClientIp(request)).toBe("192.168.1.2");
  });

  it("prefers x-forwarded-for over x-real-ip", () => {
    const request = new Request("http://localhost", {
      headers: {
        "x-forwarded-for": "192.168.1.1",
        "x-real-ip": "192.168.1.2",
      },
    });

    expect(getClientIp(request)).toBe("192.168.1.1");
  });

  it("returns fallback IP when no headers present", () => {
    const request = new Request("http://localhost");

    expect(getClientIp(request)).toBe("127.0.0.1");
  });

  it("trims whitespace from forwarded-for header", () => {
    const request = new Request("http://localhost", {
      headers: { "x-forwarded-for": "  192.168.1.1  , 10.0.0.1" },
    });

    expect(getClientIp(request)).toBe("192.168.1.1");
  });
});
