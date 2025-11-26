export default function Loading() {
  return (
    <div className="min-h-screen bg-primary-bg flex items-center justify-center">
      <div className="text-center">
        {/* Animated logo/spinner */}
        <div className="relative w-16 h-16 mx-auto mb-6">
          <div className="absolute inset-0 rounded-full border-4 border-surface animate-pulse" />
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-accent-primary animate-spin" />
        </div>

        {/* Loading text */}
        <p className="text-text-muted text-sm font-medium animate-pulse">
          Loading...
        </p>
      </div>
    </div>
  );
}
