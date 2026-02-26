"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Award,
  Calendar,
  ExternalLink,
  Github,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Translations } from "@/locales/en";
import type { SanityProject } from "./page";
import ProjectFilters, { 
  type CategoryFilter, 
  type SortOption 
} from "@/components/projects/ProjectFilters";

interface ProjectsGridClientProps {
  projects: SanityProject[];
  translations: Translations;
  locale: string;
}

export default function ProjectsGridClient({
  projects,
  translations: t,
  locale,
}: ProjectsGridClientProps) {
  const searchParams = useSearchParams();

  // Get current filters from URL
  const categoryFilter = (searchParams.get("category") as CategoryFilter) || "all";
  const techFilters = searchParams.getAll("tech");
  const sortOption = (searchParams.get("sort") as SortOption) || "date-desc";

  // Extract all unique technologies
  const allTechnologies = useMemo(() => {
    const techSet = new Set<string>();
    projects.forEach((project) => {
      project.technologies.forEach((tech) => {
        const techName = typeof tech === "string" 
          ? tech 
          : (tech as { name?: string })?.name || "";
        if (techName) techSet.add(techName);
      });
    });
    return Array.from(techSet).sort();
  }, [projects]);

  // Filter and sort projects
  const filteredProjects = useMemo(() => {
    let filtered = projects;

    // Filter by category
    if (categoryFilter !== "all") {
      filtered = filtered.filter((p) => p.category === categoryFilter);
    }

    // Filter by technologies
    if (techFilters.length > 0) {
      filtered = filtered.filter((project) => {
        const projectTechs = project.technologies.map((tech) =>
          typeof tech === "string" ? tech : (tech as { name?: string })?.name || ""
        );
        return techFilters.every((filter) => projectTechs.includes(filter));
      });
    }

    // Sort projects
    filtered = [...filtered].sort((a, b) => {
      switch (sortOption) {
        case "date-desc":
          return b.year - a.year;
        case "date-asc":
          return a.year - b.year;
        case "title-asc":
          return a.title.localeCompare(b.title);
        case "title-desc":
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });

    return filtered;
  }, [projects, categoryFilter, techFilters, sortOption]);

  const getLocalizedPath = (path: string) => {
    return locale === "nl" ? path : `/en${path}`;
  };

  return (
    <>
      {/* Filters */}
      <ProjectFilters
        categories={{
          product: t.projects.categories.product,
          client: t.projects.categories.client,
          internal: t.projects.categories.internal,
        }}
        allTechnologies={allTechnologies}
        locale={locale}
        translations={{
          filter: {
            all: t.projects.filter.all,
            category: t.projects.filter.category || "Category",
            technologies: t.projects.filter.technologies || "Technologies",
            sortBy: t.projects.filter.sortBy || "Sort by",
            clearAll: t.projects.filter.clearAll || "Clear all",
            results: t.projects.filter.results || "projects",
          },
          sort: {
            dateDesc: t.projects.sort?.dateDesc || "Newest first",
            dateAsc: t.projects.sort?.dateAsc || "Oldest first",
            titleAsc: t.projects.sort?.titleAsc || "A to Z",
            titleDesc: t.projects.sort?.titleDesc || "Z to A",
          },
        }}
        totalResults={filteredProjects.length}
      />

      {/* Projects grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${categoryFilter}-${techFilters.join(",")}-${sortOption}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredProjects.map((project, index) => {
            // Handle slug as either string or object
            const projectSlug =
              typeof project.slug === "object" && project.slug !== null
                ? (project.slug as { current?: string }).current || project._id
                : project.slug || project._id;

            return (
              <motion.div
                key={project._id}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                }}
                className="relative group h-full"
              >
                {/* Glow effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-accent-primary/20 to-accent-secondary/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Card content */}
                <div className="relative card overflow-hidden h-full flex flex-col">
                  {/* Image */}
                  <div className="relative h-48 sm:h-56 md:h-64 bg-secondary-bg overflow-hidden">
                    {project.image ? (
                      <>
                        <Image
                          src={project.image}
                          alt={project.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-primary-bg/60 to-transparent" />
                      </>
                    ) : (
                      <>
                        <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/10 to-accent-secondary/10" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-8xl opacity-40">🚀</span>
                        </div>
                      </>
                    )}

                    {/* Action buttons */}
                    <div className="absolute bottom-4 right-4 flex items-center gap-2 sm:gap-3 md:opacity-0 md:group-hover:opacity-100 md:bottom-1/2 md:right-1/2 md:translate-x-1/2 md:translate-y-1/2 transition-opacity duration-300">
                      <Link
                        href={getLocalizedPath(`/projects/${projectSlug}`)}
                        className="p-3 sm:p-4 rounded-lg bg-accent-primary text-primary-bg hover:scale-110 transition-transform duration-200 font-bold shadow-lg min-w-[48px] min-h-[48px] flex items-center justify-center"
                        aria-label={t.projects.viewLive}
                      >
                        <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
                      </Link>
                      {project.liveUrl && (
                        <Link
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-3 sm:p-4 rounded-lg bg-accent-secondary text-primary-bg hover:scale-110 transition-transform duration-200 font-bold shadow-lg min-w-[48px] min-h-[48px] flex items-center justify-center"
                          aria-label={t.projects.viewSite}
                        >
                          <ExternalLink className="w-5 h-5 sm:w-6 sm:h-6" />
                        </Link>
                      )}
                      {project.githubUrl && (
                        <Link
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-3 sm:p-4 rounded-lg bg-surface text-text-primary hover:scale-110 transition-transform duration-200 font-bold shadow-lg min-w-[48px] min-h-[48px] flex items-center justify-center"
                          aria-label={t.projects.viewGithub}
                        >
                          <Github className="w-5 h-5 sm:w-6 sm:h-6" />
                        </Link>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <Link
                    href={getLocalizedPath(`/projects/${projectSlug}`)}
                    className="flex-1 flex flex-col"
                  >
                    <div className="p-5 sm:p-6 md:p-8 flex-1 flex flex-col">
                      {/* Project Metrics */}
                      <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4 text-xs sm:text-sm text-text-muted">
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          <span className="font-semibold">{project.year}</span>
                        </div>
                        {project.achievements &&
                          project.achievements.length > 0 && (
                            <div className="flex items-center gap-1.5 sm:gap-2">
                              <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                              <span className="font-semibold">
                                {project.achievements.length}
                              </span>
                            </div>
                          )}
                        {project.liveUrl && (
                          <div className="flex items-center gap-1.5 sm:gap-2">
                            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full animate-pulse" />
                            <span className="font-semibold">Live</span>
                          </div>
                        )}
                      </div>

                      <h3 className="text-xl sm:text-2xl font-display font-bold mb-2 sm:mb-3 text-text-primary group-hover:text-accent-primary transition-colors duration-300">
                        {project.title}
                      </h3>

                      <p className="text-text-secondary text-sm sm:text-base leading-relaxed mb-4 sm:mb-6 flex-1">
                        {project.description}
                      </p>

                      {/* Technologies */}
                      <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-4 sm:mb-6 pb-2 mt-auto">
                        {project.technologies.slice(0, 4).map((tech, i) => {
                          const techName =
                            typeof tech === "string"
                              ? tech
                              : (tech as { name?: string })?.name || "";
                          if (!techName) return null;
                          return (
                            <motion.span
                              key={techName}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.05 }}
                              className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-bold rounded-lg bg-surface text-text-secondary border-2 border-surface group-hover:border-accent-primary group-hover:text-accent-primary transition-all duration-300 whitespace-nowrap flex-shrink-0"
                            >
                              {techName}
                            </motion.span>
                          );
                        })}
                      </div>

                      {/* View Details Link */}
                      <div className="flex items-center gap-2 text-accent-primary text-sm sm:text-base font-bold">
                        {t.projects.viewDetails}
                        <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-2 transition-transform duration-300" />
                      </div>
                    </div>
                  </Link>

                  {/* Category badge */}
                  <div className="absolute top-4 right-4 sm:top-5 sm:right-5 md:top-6 md:right-6 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-accent-primary text-primary-bg text-xs sm:text-sm font-bold shadow-lg">
                    {t.projects.categories[project.category]}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </AnimatePresence>

      {/* Empty state */}
      {filteredProjects.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <p className="text-text-secondary text-lg">
            {t.projects.empty || "No projects found matching your filters."}
          </p>
        </motion.div>
      )}
    </>
  );
}
