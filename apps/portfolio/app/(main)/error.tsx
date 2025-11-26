"use client";

import { AlertTriangle, Home, RefreshCw } from "lucide-react";
import { useEffect } from "react";
import { logError } from "@/lib/monitoring/error-tracking";

/**
 * Next.js Error Component
 * Automatically wraps route segments in an error boundary
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/error
 */
export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to error tracking service (Sentry)
    logError(error, {
      tags: {
        errorBoundary: "segment",
        digest: error.digest || "unknown",
      },
      level: "error",
    });
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <div className="rounded-full bg-red-100 dark:bg-red-900/20 p-6">
            <AlertTriangle className="w-12 h-12 text-red-600 dark:text-red-400" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">
            Oops! Something went wrong
          </h1>
          <p className="text-muted-foreground">
            We encountered an unexpected error while processing your request.
          </p>
        </div>

        {process.env.NODE_ENV === "development" && (
          <details className="text-left bg-muted p-4 rounded-lg">
            <summary className="cursor-pointer font-semibold text-sm mb-2">
              Error Details (Development Only)
            </summary>
            <pre className="text-xs overflow-auto text-red-600 dark:text-red-400 whitespace-pre-wrap">
              {error.message}
              {error.digest && `\n\nDigest: ${error.digest}`}
              {error.stack && `\n\n${error.stack}`}
            </pre>
          </details>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-semibold"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all font-semibold"
          >
            <Home className="w-4 h-4" />
            Go Home
          </a>
        </div>

        {error.digest && (
          <p className="text-xs text-muted-foreground">
            Error ID: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}
