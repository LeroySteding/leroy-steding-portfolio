"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";
import { useEffect } from "react";

/**
 * Global Error Component
 * Handles errors in the root layout
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/error#global-errortsx
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to console in development
    if (process.env.NODE_ENV === "development") {
      console.error("Global Application Error:", error);
    }

    // TODO: Log to error tracking service
    // Example: Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <div className="min-h-screen flex items-center justify-center bg-black text-white px-4">
          <div className="max-w-md w-full text-center space-y-6">
            <div className="flex justify-center">
              <div className="rounded-full bg-red-900/20 p-6">
                <AlertTriangle className="w-12 h-12 text-red-400" />
              </div>
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl font-bold">Critical Application Error</h1>
              <p className="text-gray-400">
                We encountered a critical error. Please try refreshing the page.
              </p>
            </div>

            {process.env.NODE_ENV === "development" && (
              <details className="text-left bg-gray-900 p-4 rounded-lg">
                <summary className="cursor-pointer font-semibold text-sm mb-2">
                  Error Details (Development Only)
                </summary>
                <pre className="text-xs overflow-auto text-red-400 whitespace-pre-wrap">
                  {error.message}
                  {error.digest && `\n\nDigest: ${error.digest}`}
                  {error.stack && `\n\n${error.stack}`}
                </pre>
              </details>
            )}

            <button
              onClick={reset}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-white text-black hover:bg-gray-200 transition-colors font-semibold"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>

            {error.digest && (
              <p className="text-xs text-gray-500">Error ID: {error.digest}</p>
            )}
          </div>
        </div>
      </body>
    </html>
  );
}
