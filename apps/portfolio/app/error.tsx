'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error caught by error boundary:', error);
    }
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary-bg px-4">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-6xl font-display font-black text-gradient">
            Oops!
          </h1>
          <h2 className="text-2xl font-bold text-text-primary">
            Something went wrong
          </h2>
          <p className="text-text-secondary">
            We encountered an unexpected error. Don't worry, you can try again.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={reset}
            className="btn-primary"
          >
            Try Again
          </button>
          <Link href="/" className="btn-secondary">
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
