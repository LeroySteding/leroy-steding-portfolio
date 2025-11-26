"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Award,
  Calendar,
  ExternalLink,
  Github,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import type { Translations } from "@/locales/en";
import type { SanityProject } from "./page";

type CategoryFilter = "all" | "product" | "client" | "internal";

interface ProjectsGridProps {
  projects: SanityProject[];
  translations: Translations;
  locale: string;
}

export default function ProjectsGrid({
  projects,
  translations: t,
  locale,
}: ProjectsGridProps) {
  const [filter, setFilter] = useState<CategoryFilter>("all");

  // Filter projects based on selected category
  const filteredProjects =
    filter === "all" ? projects : projects.filter((p) => p.category === filter);

  const getLocalizedPath = (path: string) => {
    return locale === "nl" ? path : `/en${path}`;
  };

  return (
    <>
      {/* Filter buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        viewport={{ once: true }}
        className="flex flex-wrap gap-2 sm:gap-3 mb-12"
      >
        {(["all", "product", "client", "internal"] as CategoryFilter[]).map(
          (category) => (
            <button
              type="button"
              key={category}
              onClick={() => setFilter(category)}
              className={`px-4 sm:px-5 md:px-6 py-2.5 sm:py-3 rounded-xl font-bold text-sm sm:text-base transition-all duration-300 min-h-[44px] ${
                filter === category
                  ? "bg-accent-primary text-primary-bg shadow-lg scale-105"
                  : "bg-surface text-text-secondary hover:bg-surface-light hover:text-accent-primary border-2 border-transparent hover:border-accent-primary/30"
              }`}
            >
              {category === "all"
                ? t.projects.filter.all
                : t.projects.categories[category]}
            </button>
          ),
        )}
      </motion.div>

      {/* Projects grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={filter}
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
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                }}
                viewport={{ once: true, margin: "0px 0px -100px 0px" }}
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
                        <img
                          src={project.image}
                          alt={project.title}
                          className="w-full h-full object-cover"
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
                          // Handle both string and potential object formats from Sanity
                          const techName =
                            typeof tech === "string"
                              ? tech
                              : (tech as { name?: string })?.name || "";
                          if (!techName) return null;
                          return (
                            <motion.span
                              key={techName}
                              initial={{ opacity: 0, x: -10 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.05 }}
                              viewport={{ once: true }}
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
            No projects found in this category.
          </p>
        </motion.div>
      )}
    </>
  );
}
