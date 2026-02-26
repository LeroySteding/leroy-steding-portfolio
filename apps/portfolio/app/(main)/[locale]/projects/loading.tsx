import { SkeletonList } from "@/components/ui/Skeleton";
import LayoutContainer from "@/components/ui/LayoutContainer";

export default function ProjectsLoading() {
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
                <div className="h-16 md:h-20 w-4/5 bg-surface-light rounded-lg animate-pulse" />
              </div>
              
              {/* Subtitle skeleton */}
              <div className="space-y-3 pt-4">
                <div className="h-6 w-full max-w-2xl bg-surface-light rounded-lg animate-pulse" />
                <div className="h-6 w-3/4 max-w-2xl bg-surface-light rounded-lg animate-pulse" />
              </div>
            </div>
          </LayoutContainer>
        </div>
      </div>

      {/* Content Section Skeleton */}
      <LayoutContainer className="pb-20">
        <div className="py-16 space-y-12">
          {/* Filter buttons skeleton */}
          <div className="flex items-center gap-4 flex-wrap">
            <div className="h-12 w-24 bg-surface-light rounded-xl animate-pulse" />
            <div className="h-12 w-32 bg-surface-light rounded-xl animate-pulse" />
            <div className="h-12 w-28 bg-surface-light rounded-xl animate-pulse" />
            <div className="h-12 w-36 bg-surface-light rounded-xl animate-pulse" />
          </div>

          {/* Featured project skeleton */}
          <div className="card overflow-hidden">
            <div className="grid md:grid-cols-2 gap-0">
              <div className="h-96 bg-surface-light animate-pulse" />
              <div className="p-8 md:p-12 space-y-6">
                <div className="h-6 w-20 bg-surface-light rounded-full animate-pulse" />
                <div className="space-y-3">
                  <div className="h-10 w-full bg-surface-light rounded-lg animate-pulse" />
                  <div className="h-10 w-5/6 bg-surface-light rounded-lg animate-pulse" />
                </div>
                <div className="space-y-2">
                  <div className="h-5 w-full bg-surface-light rounded animate-pulse" />
                  <div className="h-5 w-11/12 bg-surface-light rounded animate-pulse" />
                  <div className="h-5 w-4/5 bg-surface-light rounded animate-pulse" />
                </div>
                <div className="flex flex-wrap gap-2 pt-4">
                  <div className="h-7 w-24 bg-surface-light rounded-full animate-pulse" />
                  <div className="h-7 w-20 bg-surface-light rounded-full animate-pulse" />
                  <div className="h-7 w-28 bg-surface-light rounded-full animate-pulse" />
                </div>
                <div className="flex gap-4 pt-6">
                  <div className="h-12 w-36 bg-surface-light rounded-xl animate-pulse" />
                  <div className="h-12 w-32 bg-surface-light rounded-xl animate-pulse" />
                </div>
              </div>
            </div>
          </div>

          {/* Projects grid skeleton */}
          <div>
            <div className="h-10 w-48 bg-surface-light rounded-lg animate-pulse mb-8" />
            <SkeletonList 
              count={6} 
              variant="project"
              className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
            />
          </div>
        </div>
      </LayoutContainer>
    </main>
  );
}
