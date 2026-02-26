"use client";

import { useCallback, useMemo } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { 
  X, 
  ChevronDown, 
  Filter as FilterIcon,
  SortAsc,
  Calendar,
  Award,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export type CategoryFilter = "all" | "product" | "client" | "internal";
export type SortOption = "date-desc" | "date-asc" | "title-asc" | "title-desc";

interface ProjectFiltersProps {
  categories: Record<string, string>;
  allTechnologies: string[];
  locale: string;
  translations: {
    filter: {
      all: string;
      category: string;
      technologies: string;
      sortBy: string;
      clearAll: string;
      results: string;
    };
    sort: {
      dateDesc: string;
      dateAsc: string;
      titleAsc: string;
      titleDesc: string;
    };
  };
  totalResults: number;
}

export default function ProjectFilters({
  categories,
  allTechnologies,
  translations: t,
  totalResults,
}: ProjectFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Get current filters from URL
  const currentCategory = (searchParams.get("category") as CategoryFilter) || "all";
  const currentTech = searchParams.getAll("tech");
  const currentSort = (searchParams.get("sort") as SortOption) || "date-desc";

  // Create URL with updated params
  const createQueryString = useCallback(
    (updates: Record<string, string | string[] | null>) => {
      const params = new URLSearchParams(searchParams);

      Object.entries(updates).forEach(([name, value]) => {
        if (value === null || value === "" || value === "all") {
          params.delete(name);
        } else if (Array.isArray(value)) {
          params.delete(name);
          value.forEach((v) => params.append(name, v));
        } else {
          params.set(name, value);
        }
      });

      return params.toString();
    },
    [searchParams]
  );

  // Update URL with new filters
  const updateFilters = useCallback(
    (updates: Record<string, string | string[] | null>) => {
      const queryString = createQueryString(updates);
      router.push(`${pathname}${queryString ? `?${queryString}` : ""}`, {
        scroll: false,
      });
    },
    [createQueryString, pathname, router]
  );

  // Toggle tech filter
  const toggleTech = useCallback(
    (tech: string) => {
      const newTech = currentTech.includes(tech)
        ? currentTech.filter((t) => t !== tech)
        : [...currentTech, tech];
      updateFilters({ tech: newTech.length > 0 ? newTech : null });
    },
    [currentTech, updateFilters]
  );

  // Clear all filters
  const clearAllFilters = useCallback(() => {
    router.push(pathname, { scroll: false });
  }, [pathname, router]);

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (currentCategory !== "all") count++;
    count += currentTech.length;
    return count;
  }, [currentCategory, currentTech]);

  // Sort options
  const sortOptions: { value: SortOption; label: string; icon: typeof Calendar }[] = [
    { value: "date-desc", label: t.sort.dateDesc, icon: Calendar },
    { value: "date-asc", label: t.sort.dateAsc, icon: Calendar },
    { value: "title-asc", label: t.sort.titleAsc, icon: SortAsc },
    { value: "title-desc", label: t.sort.titleDesc, icon: SortAsc },
  ];

  return (
    <div className="space-y-6 mb-8">
      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        {/* Left: Filter chips and results */}
        <div className="flex-1 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          {/* Results count */}
          <div className="flex items-center gap-2 text-text-secondary text-sm font-medium">
            <FilterIcon className="w-4 h-4" />
            <span>
              {totalResults} {t.filter.results}
            </span>
          </div>

          {/* Active filter chips */}
          <AnimatePresence mode="popLayout">
            {activeFilterCount > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center gap-2 flex-wrap"
              >
                {currentCategory !== "all" && (
                  <motion.button
                    layout
                    type="button"
                    onClick={() => updateFilters({ category: "all" })}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-accent-primary/20 text-accent-primary text-sm font-bold hover:bg-accent-primary/30 transition-colors"
                  >
                    <span>{categories[currentCategory]}</span>
                    <X className="w-3.5 h-3.5" />
                  </motion.button>
                )}

                {currentTech.map((tech) => (
                  <motion.button
                    layout
                    key={tech}
                    type="button"
                    onClick={() => toggleTech(tech)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-accent-secondary/20 text-accent-secondary text-sm font-bold hover:bg-accent-secondary/30 transition-colors"
                  >
                    <span>{tech}</span>
                    <X className="w-3.5 h-3.5" />
                  </motion.button>
                ))}

                {activeFilterCount > 0 && (
                  <button
                    type="button"
                    onClick={clearAllFilters}
                    className="text-text-muted hover:text-accent-primary text-sm font-bold transition-colors underline"
                  >
                    {t.filter.clearAll}
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right: Sort dropdown */}
        <div className="relative">
          <select
            value={currentSort}
            onChange={(e) => updateFilters({ sort: e.target.value })}
            className="appearance-none pl-10 pr-12 py-3 rounded-xl bg-surface text-text-primary font-bold text-sm border-2 border-surface hover:border-accent-primary/30 focus:border-accent-primary outline-none transition-colors cursor-pointer"
            aria-label={t.filter.sortBy}
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <Award className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
        </div>
      </div>

      {/* Category Filters */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-text-muted uppercase tracking-wider">
          {t.filter.category}
        </h3>
        <div className="flex flex-wrap gap-2">
          {(["all", "product", "client", "internal"] as CategoryFilter[]).map(
            (category) => (
              <button
                key={category}
                type="button"
                onClick={() => updateFilters({ category })}
                className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${
                  currentCategory === category
                    ? "bg-accent-primary text-primary-bg shadow-lg scale-105"
                    : "bg-surface text-text-secondary hover:bg-surface-light hover:text-accent-primary border-2 border-transparent hover:border-accent-primary/30"
                }`}
              >
                {category === "all" ? t.filter.all : categories[category]}
              </button>
            )
          )}
        </div>
      </div>

      {/* Technology Filters */}
      {allTechnologies.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-text-muted uppercase tracking-wider">
            {t.filter.technologies}
          </h3>
          <div className="flex flex-wrap gap-2">
            {allTechnologies.map((tech) => (
              <button
                key={tech}
                type="button"
                onClick={() => toggleTech(tech)}
                className={`px-4 py-2 rounded-lg font-bold text-sm transition-all duration-300 ${
                  currentTech.includes(tech)
                    ? "bg-accent-secondary/20 text-accent-secondary border-2 border-accent-secondary"
                    : "bg-surface text-text-secondary hover:bg-surface-light hover:text-accent-secondary border-2 border-transparent hover:border-accent-secondary/30"
                }`}
              >
                {tech}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
