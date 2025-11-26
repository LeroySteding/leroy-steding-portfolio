/**
 * Simple logger utility that guards console statements in production
 *
 * In production, only errors and warnings are logged.
 * In development, all log levels are available.
 */

const isDev = process.env.NODE_ENV === "development";

export const logger = {
  /**
   * Log debug information (development only)
   */
  debug: (...args: unknown[]): void => {
    if (isDev) {
      console.log("[DEBUG]", ...args);
    }
  },

  /**
   * Log general information (development only)
   */
  info: (...args: unknown[]): void => {
    if (isDev) {
      console.log("[INFO]", ...args);
    }
  },

  /**
   * Log warnings (always logged)
   */
  warn: (...args: unknown[]): void => {
    console.warn("[WARN]", ...args);
  },

  /**
   * Log errors (always logged)
   */
  error: (...args: unknown[]): void => {
    console.error("[ERROR]", ...args);
  },
};

export default logger;
