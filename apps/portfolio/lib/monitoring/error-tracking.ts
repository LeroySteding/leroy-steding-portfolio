/**
 * Error Tracking Service Configuration
 *
 * Uses Sentry for error tracking and monitoring.
 * Configuration is in sentry.client.config.ts, sentry.server.config.ts, and sentry.edge.config.ts
 */

import * as Sentry from "@sentry/nextjs";
import logger from "@/lib/logger";

interface ErrorContext {
  user?: {
    id?: string;
    email?: string;
    username?: string;
  };
  tags?: Record<string, string>;
  level?: "fatal" | "error" | "warning" | "info" | "debug";
  extra?: Record<string, unknown>;
}

/**
 * Initialize error tracking service
 * Note: Sentry is auto-initialized via config files, this is for manual initialization if needed
 */
export function initErrorTracking(): void {
  if (process.env.NODE_ENV === "development") {
    logger.info(
      "🔍 Error tracking initialized (development mode - Sentry disabled)",
    );
    return;
  }

  if (!process.env.NEXT_PUBLIC_SENTRY_DSN) {
    logger.warn(
      "⚠️ NEXT_PUBLIC_SENTRY_DSN not configured - error tracking disabled",
    );
    return;
  }

  logger.info("🔍 Sentry error tracking active");
}

/**
 * Log an error to Sentry
 */
export function logError(error: Error, context?: ErrorContext): void {
  // Always log to console in development
  if (process.env.NODE_ENV === "development") {
    logger.error("Error logged:", error, context);
    return;
  }

  // Send to Sentry in production
  if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    Sentry.withScope((scope) => {
      // Set user context
      if (context?.user) {
        scope.setUser(context.user);
      }

      // Set tags
      if (context?.tags) {
        Object.entries(context.tags).forEach(([key, value]) => {
          scope.setTag(key, value);
        });
      }

      // Set level
      if (context?.level) {
        scope.setLevel(context.level);
      }

      // Set extra context
      if (context?.extra) {
        Object.entries(context.extra).forEach(([key, value]) => {
          scope.setExtra(key, value);
        });
      }

      Sentry.captureException(error);
    });
  } else {
    // Fallback: log to console
    logger.error("Error occurred:", error, context);
  }
}

/**
 * Set user context for error tracking
 */
export function setUser(user: {
  id: string;
  email?: string;
  username?: string;
}): void {
  if (process.env.NODE_ENV === "development") {
    logger.debug("User context set:", user);
    return;
  }

  if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    Sentry.setUser(user);
  }
}

/**
 * Clear user context (on logout)
 */
export function clearUser(): void {
  if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    Sentry.setUser(null);
  }
}

/**
 * Add breadcrumb for debugging
 */
export function addBreadcrumb(
  message: string,
  data?: Record<string, unknown>,
): void {
  if (process.env.NODE_ENV === "development") {
    logger.debug("Breadcrumb:", message, data);
    return;
  }

  if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    Sentry.addBreadcrumb({
      message,
      data,
      level: "info",
    });
  }
}

/**
 * Capture a custom message
 */
export function captureMessage(
  message: string,
  level: "info" | "warning" | "error" = "info",
): void {
  if (process.env.NODE_ENV === "development") {
    logger.debug(`[${level.toUpperCase()}]`, message);
    return;
  }

  if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    Sentry.captureMessage(message, level);
  }
}
