import { SkeletonList } from "@/components/ui/Skeleton";
import LayoutContainer from "@/components/ui/LayoutContainer";

export default function BlogLoading() {
  return (
    <main className="min-h-screen bg-primary-bg">
      {/* Hero Section Skeleton */}
      <div className="relative overflow-hidden bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-accent-primary to-transparent" />
        
        <div className="section-sm">
          <LayoutContainer>
            <div className="max-w-4xl animate-fade-in space-y-6">
              {/* Back link skeleton */}
              <div className="h-6 w-32 bg-surface-light rounded-lg animate-pulse" />
              
              {/* Title skeleton */}
              <div className="space-y-4">
                <div className="h-16 md:h-20 w-full max-w-3xl bg-surface-light rounded-lg animate-pulse" />
                <div className="h-16 md:h-20 w-5/6 bg-surface-light rounded-lg animate-pulse" />
              </div>
              
              {/* Subtitle skeleton */}
              <div className="space-y-3 pt-4">
                <div className="h-6 w-full max-w-2xl bg-surface-light rounded-lg animate-pulse" />
                <div className="h-6 w-4/5 max-w-2xl bg-surface-light rounded-lg animate-pulse" />
              </div>
            </div>
          </LayoutContainer>
        </div>
      </div>

      {/* Content Section Skeleton */}
      <LayoutContainer className="pb-20">
        <div className="py-16 space-y-12">
          {/* Filter tabs skeleton */}
          <div className="flex items-center gap-4 pb-8 border-b-2 border-surface overflow-x-auto">
            <div className="h-12 w-24 bg-surface-light rounded-lg animate-pulse shrink-0" />
            <div className="h-12 w-32 bg-surface-light rounded-lg animate-pulse shrink-0" />
            <div className="h-12 w-28 bg-surface-light rounded-lg animate-pulse shrink-0" />
            <div className="h-12 w-36 bg-surface-light rounded-lg animate-pulse shrink-0" />
          </div>

          {/* Search bar skeleton */}
          <div className="max-w-xl">
            <div className="h-14 w-full bg-surface-light rounded-xl animate-pulse" />
          </div>

          {/* Blog posts grid skeleton */}
          <SkeletonList 
            count={6} 
            variant="blog"
            className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
          />
        </div>
      </LayoutContainer>
    </main>
  );
}
