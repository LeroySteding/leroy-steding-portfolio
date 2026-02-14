import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export default function TemplatesHero() {
  return (
    <section className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center">
          <Badge className="mb-4 inline-flex">
            🚀 New: BelastingBot Template
          </Badge>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            Ship Your SaaS in Days,{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Not Months
            </span>
          </h1>

          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Production-ready SaaS templates built with Next.js 16, Convex, and
            Clerk. Everything you need to launch fast and profitably.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" href="#templates">
              Browse Templates
            </Button>
            <Button size="lg" variant="outline" href="#whats-included">
              See What's Included
            </Button>
          </div>

          {/* Social Proof Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto pt-8 border-t border-gray-200 dark:border-gray-700">
            <div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                10+
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Templates Sold
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                4.9/5
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Buyer Rating
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                2-7 days
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Avg. Launch Time
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
