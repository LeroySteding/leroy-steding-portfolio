import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-lg bg-surface-light",
        className
      )}
    />
  );
}

export function SkeletonText({ className }: SkeletonProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-11/12" />
      <Skeleton className="h-4 w-4/5" />
    </div>
  );
}

export function SkeletonImage({ className }: SkeletonProps) {
  return (
    <Skeleton
      className={cn(
        "relative overflow-hidden",
        "before:absolute before:inset-0",
        "before:-translate-x-full before:animate-[shimmer_2s_infinite]",
        "before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent",
        className
      )}
    />
  );
}

interface SkeletonCardProps {
  variant?: "blog" | "project" | "default";
  className?: string;
}

export function SkeletonCard({ variant = "default", className }: SkeletonCardProps) {
  if (variant === "blog") {
    return (
      <div className={cn("card p-6 space-y-4", className)}>
        <div className="flex items-center gap-3">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
        <Skeleton className="h-8 w-3/4" />
        <SkeletonText className="space-y-2" />
        <div className="flex items-center gap-4 pt-4">
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-4 w-20" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>
      </div>
    );
  }

  if (variant === "project") {
    return (
      <div className={cn("card overflow-hidden", className)}>
        <SkeletonImage className="h-64 w-full" />
        <div className="p-6 space-y-4">
          <Skeleton className="h-7 w-3/4" />
          <SkeletonText />
          <div className="flex flex-wrap gap-2 pt-2">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-24 rounded-full" />
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-6 w-28 rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("card p-6 space-y-4", className)}>
      <Skeleton className="h-6 w-3/4" />
      <SkeletonText />
    </div>
  );
}

interface SkeletonListProps {
  count?: number;
  variant?: "blog" | "project" | "default";
  className?: string;
}

export function SkeletonList({ count = 3, variant = "default", className }: SkeletonListProps) {
  return (
    <div className={className}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} variant={variant} />
      ))}
    </div>
  );
}

// Blog Post Page Skeleton
export function SkeletonBlogPost() {
  return (
    <main className="min-h-screen bg-primary-bg">
      {/* Reading Progress Bar Placeholder */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-surface z-50" />

      {/* Hero Section Skeleton */}
      <div className="relative min-h-[70vh] flex items-end overflow-hidden bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-accent-primary to-transparent" />
        
        <div className="relative z-10 w-full px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 pb-16 pt-32">
          <Skeleton className="h-6 w-32 mb-8 rounded-xl" />
          
          <div className="flex items-center gap-3 mb-6">
            <Skeleton className="h-9 w-24 rounded-xl" />
            <Skeleton className="h-9 w-20 rounded-xl" />
          </div>

          <Skeleton className="h-16 md:h-20 w-full max-w-5xl mb-6" />
          <Skeleton className="h-12 md:h-16 w-5/6 max-w-5xl mb-6" />

          <Skeleton className="h-8 w-full max-w-4xl mb-8" />

          <div className="flex flex-wrap items-center gap-6">
            <Skeleton className="h-16 w-48 rounded-xl" />
            <Skeleton className="h-16 w-40 rounded-xl" />
            <Skeleton className="h-16 w-32 rounded-xl" />
          </div>
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="relative z-10 w-full px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 py-20">
        <div className="grid lg:grid-cols-[1fr_350px] gap-12 max-w-[1600px] mx-auto">
          {/* Article Content */}
          <article className="min-w-0 space-y-8">
            <div className="space-y-6">
              <Skeleton className="h-10 w-3/4" />
              <SkeletonText />
              <SkeletonText />
              
              <Skeleton className="h-8 w-2/3" />
              <SkeletonText />
              
              <SkeletonImage className="h-64 w-full my-8 rounded-xl" />
              
              <Skeleton className="h-8 w-3/5" />
              <SkeletonText />
              <SkeletonText />
            </div>
          </article>

          {/* Sidebar Skeleton */}
          <aside className="hidden lg:block">
            <div className="sticky top-32 space-y-8">
              {/* Share Buttons */}
              <div className="card p-6 space-y-3">
                <Skeleton className="h-6 w-32 mb-4" />
                <Skeleton className="h-12 w-full rounded-xl" />
                <Skeleton className="h-12 w-full rounded-xl" />
                <Skeleton className="h-12 w-full rounded-xl" />
                <Skeleton className="h-12 w-full rounded-xl" />
              </div>

              {/* Table of Contents */}
              <div className="card p-6 space-y-2">
                <Skeleton className="h-6 w-40 mb-4" />
                <Skeleton className="h-8 w-full rounded-lg" />
                <Skeleton className="h-8 w-11/12 rounded-lg" />
                <Skeleton className="h-8 w-5/6 rounded-lg ml-4" />
                <Skeleton className="h-8 w-full rounded-lg" />
                <Skeleton className="h-8 w-4/5 rounded-lg ml-4" />
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

// Project Page Skeleton
export function SkeletonProject() {
  return (
    <main className="min-h-screen bg-primary-bg">
      {/* Hero Section */}
      <div className="relative min-h-[80vh] flex items-end overflow-hidden">
        <SkeletonImage className="absolute inset-0" />
        <div className="absolute inset-0 bg-gradient-to-b from-primary-bg/60 via-primary-bg/80 to-primary-bg" />
        
        <div className="relative z-10 w-full px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 pb-16 pt-32">
          <Skeleton className="h-6 w-32 mb-8 rounded-xl" />
          
          <Skeleton className="h-16 md:h-20 w-full max-w-4xl mb-6" />
          <Skeleton className="h-8 w-5/6 max-w-3xl mb-8" />

          <div className="flex flex-wrap gap-3 mb-8">
            <Skeleton className="h-8 w-24 rounded-full" />
            <Skeleton className="h-8 w-20 rounded-full" />
            <Skeleton className="h-8 w-28 rounded-full" />
            <Skeleton className="h-8 w-16 rounded-full" />
          </div>

          <div className="flex flex-wrap gap-4">
            <Skeleton className="h-12 w-36 rounded-xl" />
            <Skeleton className="h-12 w-32 rounded-xl" />
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="relative z-10 w-full px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 py-20">
        <div className="max-w-6xl mx-auto space-y-16">
          {/* Project Details */}
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card p-6 space-y-3">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-8 w-32" />
            </div>
            <div className="card p-6 space-y-3">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-8 w-28" />
            </div>
            <div className="card p-6 space-y-3">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-8 w-24" />
            </div>
          </div>

          {/* Content */}
          <div className="space-y-8">
            <Skeleton className="h-10 w-64" />
            <SkeletonText />
            <SkeletonText />
            
            <Skeleton className="h-8 w-48" />
            <SkeletonText />
          </div>

          {/* Gallery */}
          <div className="space-y-6">
            <Skeleton className="h-10 w-48" />
            <div className="grid md:grid-cols-2 gap-6">
              <SkeletonImage className="h-64 rounded-xl" />
              <SkeletonImage className="h-64 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
