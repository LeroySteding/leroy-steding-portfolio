import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// We need to mock process.env before importing the logger
describe("logger", () => {
  const originalEnv = process.env.NODE_ENV;

  beforeEach(() => {
    vi.resetModules();
    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    process.env.NODE_ENV = originalEnv;
    vi.restoreAllMocks();
  });

  describe("in development mode", () => {
    beforeEach(() => {
      process.env.NODE_ENV = "development";
    });

    it("logs debug messages", async () => {
      vi.resetModules();
      const { logger } = await import("@/lib/logger");

      logger.debug("test debug message");
      expect(console.log).toHaveBeenCalledWith("[DEBUG]", "test debug message");
    });

    it("logs info messages", async () => {
      vi.resetModules();
      const { logger } = await import("@/lib/logger");

      logger.info("test info message");
      expect(console.log).toHaveBeenCalledWith("[INFO]", "test info message");
    });

    it("logs warn messages", async () => {
      vi.resetModules();
      const { logger } = await import("@/lib/logger");

      logger.warn("test warning");
      expect(console.warn).toHaveBeenCalledWith("[WARN]", "test warning");
    });

    it("logs error messages", async () => {
      vi.resetModules();
      const { logger } = await import("@/lib/logger");

      logger.error("test error");
      expect(console.error).toHaveBeenCalledWith("[ERROR]", "test error");
    });

    it("handles multiple arguments", async () => {
      vi.resetModules();
      const { logger } = await import("@/lib/logger");

      logger.info("message", { data: "test" }, 123);
      expect(console.log).toHaveBeenCalledWith(
        "[INFO]",
        "message",
        { data: "test" },
        123,
      );
    });
  });

  describe("in production mode", () => {
    beforeEach(() => {
      process.env.NODE_ENV = "production";
    });

    it("does not log debug messages", async () => {
      vi.resetModules();
      const { logger } = await import("@/lib/logger");

      logger.debug("test debug message");
      expect(console.log).not.toHaveBeenCalled();
    });

    it("does not log info messages", async () => {
      vi.resetModules();
      const { logger } = await import("@/lib/logger");

      logger.info("test info message");
      expect(console.log).not.toHaveBeenCalled();
    });

    it("still logs warn messages", async () => {
      vi.resetModules();
      const { logger } = await import("@/lib/logger");

      logger.warn("test warning");
      expect(console.warn).toHaveBeenCalledWith("[WARN]", "test warning");
    });

    it("still logs error messages", async () => {
      vi.resetModules();
      const { logger } = await import("@/lib/logger");

      logger.error("test error");
      expect(console.error).toHaveBeenCalledWith("[ERROR]", "test error");
    });
  });

  describe("in test mode", () => {
    beforeEach(() => {
      process.env.NODE_ENV = "test";
    });

    it("does not log debug messages (non-development)", async () => {
      vi.resetModules();
      const { logger } = await import("@/lib/logger");

      logger.debug("test debug message");
      expect(console.log).not.toHaveBeenCalled();
    });

    it("always logs warnings and errors", async () => {
      vi.resetModules();
      const { logger } = await import("@/lib/logger");

      logger.warn("warning");
      logger.error("error");

      expect(console.warn).toHaveBeenCalledWith("[WARN]", "warning");
      expect(console.error).toHaveBeenCalledWith("[ERROR]", "error");
    });
  });
});
