/**
 * Error Tracking Service Configuration
 *
 * This module provides centralized error tracking and monitoring.
 * Supports multiple providers: Sentry, LogRocket, Bugsnag, etc.
 *
 * To enable error tracking:
 * 1. Install your preferred provider: pnpm add @sentry/nextjs
 * 2. Add environment variables (see .env.example)
 * 3. Uncomment the provider configuration below
 * 4. Update error.tsx and global-error.tsx to call logError()
 */

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
 * Call this in your root layout or _app.tsx
 */
export function initErrorTracking(): void {
  if (process.env.NODE_ENV === "development") {
    console.log("🔍 Error tracking initialized (development mode)");
    return;
  }

  // TODO: Uncomment and configure your preferred error tracking service

  /* Sentry Configuration
  if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    const Sentry = require('@sentry/nextjs');
    
    Sentry.init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      environment: process.env.NEXT_PUBLIC_VERCEL_ENV || 'development',
      tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
      
      // Filter out non-critical errors
      beforeSend(event, hint) {
        // Don't send events in development
        if (process.env.NODE_ENV === 'development') {
          return null;
        }
        
        // Filter out known third-party errors
        const error = hint.originalException as Error;
        if (error?.message?.includes('third-party-service')) {
          return null;
        }
        
        return event;
      },
      
      integrations: [
        new Sentry.BrowserTracing(),
        new Sentry.Replay({
          maskAllText: true,
          blockAllMedia: true,
        }),
      ],
      
      // Session Replay sampling
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,
    });
    
    console.log('🔍 Sentry error tracking initialized');
  }
  */

  /* LogRocket Configuration
  if (process.env.NEXT_PUBLIC_LOGROCKET_APP_ID) {
    const LogRocket = require('logrocket');
    
    LogRocket.init(process.env.NEXT_PUBLIC_LOGROCKET_APP_ID, {
      console: {
        shouldAggregateConsoleErrors: true,
      },
      network: {
        requestSanitizer: (request) => {
          // Remove sensitive headers
          if (request.headers.Authorization) {
            request.headers.Authorization = '[REDACTED]';
          }
          return request;
        },
      },
    });
    
    console.log('🔍 LogRocket initialized');
  }
  */

  console.log("⚠️ Error tracking not configured - add your preferred service");
}

/**
 * Log an error to the error tracking service
 */
export function logError(error: Error, context?: ErrorContext): void {
  // Always log to console in development
  if (process.env.NODE_ENV === "development") {
    console.error("Error logged:", error, context);
    return;
  }

  // TODO: Uncomment based on your error tracking service

  /* Sentry
  if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_SENTRY_DSN) {
    const Sentry = require('@sentry/nextjs');
    
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
  }
  */

  /* LogRocket
  if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_LOGROCKET_APP_ID) {
    const LogRocket = require('logrocket');
    LogRocket.captureException(error, {
      tags: context?.tags,
      extra: context?.extra,
    });
  }
  */

  // Fallback: log to console
  console.error("Error occurred:", error, context);
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
    console.log("User context set:", user);
    return;
  }

  /* Sentry
  if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_SENTRY_DSN) {
    const Sentry = require('@sentry/nextjs');
    Sentry.setUser(user);
  }
  */

  /* LogRocket
  if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_LOGROCKET_APP_ID) {
    const LogRocket = require('logrocket');
    LogRocket.identify(user.id, {
      email: user.email,
      name: user.username,
    });
  }
  */
}

/**
 * Clear user context (on logout)
 */
export function clearUser(): void {
  /* Sentry
  if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_SENTRY_DSN) {
    const Sentry = require('@sentry/nextjs');
    Sentry.setUser(null);
  }
  */
  /* LogRocket
  // LogRocket doesn't have a clear user method
  */
}

/**
 * Add breadcrumb for debugging
 */
export function addBreadcrumb(
  message: string,
  data?: Record<string, unknown>,
): void {
  if (process.env.NODE_ENV === "development") {
    console.log("Breadcrumb:", message, data);
    return;
  }

  /* Sentry
  if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_SENTRY_DSN) {
    const Sentry = require('@sentry/nextjs');
    Sentry.addBreadcrumb({
      message,
      data,
      level: 'info',
    });
  }
  */
}

/**
 * Capture a custom message
 */
export function captureMessage(
  message: string,
  level: "info" | "warning" | "error" = "info",
): void {
  if (process.env.NODE_ENV === "development") {
    console.log(`[${level.toUpperCase()}]`, message);
    return;
  }

  /* Sentry
  if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_SENTRY_DSN) {
    const Sentry = require('@sentry/nextjs');
    Sentry.captureMessage(message, level);
  }
  */
}
