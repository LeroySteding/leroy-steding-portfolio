"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

/**
 * Global Error Handler
 * This catches errors that occur in the root layout or during rendering
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/error#global-errorjs
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to Sentry in production
    if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
      Sentry.captureException(error, {
        tags: {
          errorBoundary: "global",
          digest: error.digest || "unknown",
        },
      });
    }
  }, [error]);

  return (
    <html lang="en">
      <body>
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#0a0a0a",
            color: "#ffffff",
            padding: "1rem",
          }}
        >
          <div
            style={{
              maxWidth: "28rem",
              width: "100%",
              textAlign: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: "1.5rem",
              }}
            >
              <div
                style={{
                  borderRadius: "50%",
                  backgroundColor: "rgba(239, 68, 68, 0.2)",
                  padding: "1.5rem",
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-labelledby="error-icon-title"
                  role="img"
                >
                  <title id="error-icon-title">Error warning icon</title>
                  <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                  <path d="M12 9v4" />
                  <path d="M12 17h.01" />
                </svg>
              </div>
            </div>

            <h1
              style={{
                fontSize: "1.5rem",
                fontWeight: "bold",
                marginBottom: "0.5rem",
              }}
            >
              Something went wrong!
            </h1>
            <p
              style={{
                color: "#a1a1aa",
                marginBottom: "1.5rem",
              }}
            >
              A critical error occurred. We&apos;ve been notified and are
              working on a fix.
            </p>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
                alignItems: "center",
              }}
            >
              <button
                type="button"
                onClick={reset}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  padding: "0.75rem 1.5rem",
                  borderRadius: "0.5rem",
                  backgroundColor: "#22d3ee",
                  color: "#0a0a0a",
                  fontWeight: 600,
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Try Again
              </button>
              <a
                href="/"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  padding: "0.75rem 1.5rem",
                  borderRadius: "0.5rem",
                  border: "2px solid #22d3ee",
                  color: "#22d3ee",
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                Go Home
              </a>
            </div>

            {error.digest && (
              <p
                style={{
                  marginTop: "1.5rem",
                  fontSize: "0.75rem",
                  color: "#71717a",
                }}
              >
                Error ID: {error.digest}
              </p>
            )}
          </div>
        </div>
      </body>
    </html>
  );
}
