"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Search, X } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLayout } from "@/contexts/LayoutContext";
import { techStack } from "@/data/techStack";
import { useTranslation } from "@/hooks/useTranslation";
import type { SanityTechStackSection } from "@/lib/sanity-content";

// Helper function to get proficiency level
const getProficiencyLevel = (
  proficiency: number,
): { label: string; color: string } => {
  if (proficiency >= 90) return { label: "Master", color: "text-green-400" };
  if (proficiency >= 75)
    return { label: "Expert", color: "text-accent-primary" };
  if (proficiency >= 60) return { label: "Advanced", color: "text-blue-400" };
  if (proficiency >= 40)
    return { label: "Intermediate", color: "text-accent-secondary" };
  return { label: "Beginner", color: "text-text-muted" };
};

interface TechStackProps {
  sectionData?: SanityTechStackSection | null;
}

export default function TechStack({ sectionData }: TechStackProps) {
  const t = useTranslation();
  const { language } = useLanguage();
  const { containerClass } = useLayout();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Section content from Sanity or defaults
  const sectionTitle = sectionData?.title || t.techStack.title;
  const sectionTitleHighlight =
    sectionData?.titleHighlight || t.techStack.titleHighlight;

  // Toggle category selection (multi-select)
  const toggleCategory = (categoryName: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryName)
        ? prev.filter((c) => c !== categoryName)
        : [...prev, categoryName],
    );
  };

  // Filter technologies based on search and selected categories
  const displayTechnologies = useMemo(() => {
    let technologies =
      selectedCategories.length > 0
        ? techStack
            .filter((cat) => selectedCategories.includes(cat.name))
            .flatMap((cat) => cat.technologies)
        : techStack.flatMap((cat) => cat.technologies);

    if (searchQuery) {
      technologies = technologies.filter((tech) =>
        tech.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    return technologies;
  }, [selectedCategories, searchQuery]);

  return (
    <section
      id="skills"
      className="section relative bg-tertiary-bg overflow-hidden"
    >
      {/* Subtle accent line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-accent-secondary to-transparent" />

      <div className={`relative z-10 ${containerClass}`}>
        {/* Section header */}
        <div className="mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="font-display font-black mb-6"
          >
            {sectionTitle}{" "}
            <span className="text-gradient">{sectionTitleHighlight}</span>
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="w-32 h-2 bg-accent-secondary rounded-full mb-8"
          />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-xl text-text-secondary max-w-3xl mb-8"
          >
            {t.techStack.description}
          </motion.p>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="relative max-w-md"
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search technologies..."
              className="w-full pl-12 pr-12 py-4 rounded-xl bg-surface border-2 border-surface focus:border-accent-secondary text-text-primary placeholder:text-text-muted transition-all duration-300 font-semibold"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-surface-light rounded-full transition-colors"
              >
                <X className="w-4 h-4 text-text-muted" />
              </button>
            )}
          </motion.div>
        </div>

        {/* Category filters - Multi-select */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="flex items-center gap-4 mb-6">
            <h3 className="text-lg font-bold text-text-primary">
              Filter by Category:
            </h3>
            {selectedCategories.length > 0 && (
              <button
                type="button"
                onClick={() => setSelectedCategories([])}
                className="text-sm font-semibold text-accent-primary hover:text-accent-secondary transition-colors flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Clear All
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-3">
            {techStack.map((category) => {
              const isSelected = selectedCategories.includes(category.name);
              return (
                <button
                  type="button"
                  key={category.name}
                  onClick={() => toggleCategory(category.name)}
                  className={`px-6 py-3 rounded-xl font-bold text-base transition-all duration-300 flex items-center gap-3 ${
                    isSelected
                      ? "bg-accent-secondary text-primary-bg shadow-lg scale-105"
                      : "bg-surface text-text-secondary hover:bg-surface-light hover:text-accent-secondary border-2 border-transparent hover:border-accent-secondary/30"
                  }`}
                >
                  <span className="text-2xl">{category.icon}</span>
                  <span>
                    {language === "nl" ? category.nameNL : category.name}
                  </span>
                  {isSelected && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-2 h-2 rounded-full bg-primary-bg"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Results count */}
        {(selectedCategories.length > 0 || searchQuery) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 text-text-secondary font-semibold"
          >
            Found {displayTechnologies.length}{" "}
            {displayTechnologies.length === 1 ? "technology" : "technologies"}
          </motion.div>
        )}

        {/* Technologies grid */}
        <AnimatePresence mode="wait">
          {displayTechnologies.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="card p-16 text-center mb-16"
            >
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-text-primary mb-2">
                No technologies found
              </h3>
              <p className="text-text-secondary mb-6">
                Try adjusting your search or filters
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategories([]);
                }}
                className="btn-secondary"
              >
                Clear Filters
              </button>
            </motion.div>
          ) : (
            <motion.div
              key={`${selectedCategories.join("-")}-${searchQuery}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 mb-16"
            >
              {displayTechnologies.map((tech, index) => (
                <motion.div
                  key={tech.name}
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.03,
                    type: "spring",
                    stiffness: 300,
                    damping: 20,
                  }}
                  className="relative group"
                >
                  {/* Glow effect */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-accent-secondary/20 to-accent-primary/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Card content */}
                  <div className="relative card p-6 flex flex-col items-center justify-center gap-3 cursor-pointer h-full min-h-[200px]">
                    {/* Tech icon */}
                    <div className="relative w-16 h-16 flex items-center justify-center">
                      {tech.icon.startsWith("http") ? (
                        <Image
                          src={tech.icon}
                          alt={tech.name}
                          width={64}
                          height={64}
                          className="object-contain group-hover:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        <span className="text-5xl group-hover:scale-110 transition-transform duration-300">
                          {tech.icon}
                        </span>
                      )}
                    </div>

                    {/* Tech name */}
                    <h3 className="text-base font-bold text-text-primary text-center group-hover:text-accent-secondary transition-colors min-h-[48px] flex items-center">
                      {tech.name}
                    </h3>

                    {/* Proficiency bar */}
                    <div className="w-full">
                      <div className="flex items-center justify-between mb-1.5">
                        <span
                          className={`text-xs font-bold ${getProficiencyLevel(tech.proficiency).color}`}
                        >
                          {getProficiencyLevel(tech.proficiency).label}
                        </span>
                        <span className="text-xs font-bold text-accent-secondary">
                          {tech.proficiency}%
                        </span>
                      </div>
                      <div className="w-full bg-surface rounded-full h-2 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${tech.proficiency}%` }}
                          transition={{
                            duration: 1,
                            delay: index * 0.03,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                          className="h-full bg-gradient-to-r from-accent-secondary to-accent-primary rounded-full relative"
                        >
                          <div className="absolute inset-0 bg-white/20 animate-pulse" />
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          <div className="card p-8 text-center">
            <div className="text-5xl font-black text-accent-primary mb-3">
              {techStack.flatMap((cat) => cat.technologies).length}+
            </div>
            <div className="text-text-muted text-base font-semibold uppercase tracking-wide">
              Technologies
            </div>
          </div>
          <div className="card p-8 text-center">
            <div className="text-5xl font-black text-accent-secondary mb-3">
              {techStack.length}
            </div>
            <div className="text-text-muted text-base font-semibold uppercase tracking-wide">
              Categories
            </div>
          </div>
          <div className="card p-8 text-center">
            <div className="text-5xl font-black text-accent-primary mb-3">
              12+
            </div>
            <div className="text-text-muted text-base font-semibold uppercase tracking-wide">
              {t.techStack.stats.experience}
            </div>
          </div>
          <div className="card p-8 text-center">
            <div className="text-5xl font-black text-accent-secondary mb-3">
              100+
            </div>
            <div className="text-text-muted text-base font-semibold uppercase tracking-wide">
              {t.techStack.stats.projects}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
