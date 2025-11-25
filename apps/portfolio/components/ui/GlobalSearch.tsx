"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Briefcase,
  Command,
  FileText,
  Search,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "@/hooks/useTranslation";
import { getBlogPosts, getProjects } from "@/utils/getLocalizedData";

interface SearchResult {
  type: "blog" | "project";
  id: string;
  title: string;
  description: string;
  url: string;
  category?: string;
  technologies?: string[];
}

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GlobalSearch({ isOpen, onClose }: GlobalSearchProps) {
  const t = useTranslation();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { language } = useLanguage();

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setResults([]);
      setSelectedIndex(0);
      // Focus input when opened
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    if (query.trim() === "") {
      setResults([]);
      return;
    }

    // Perform search
    const searchQuery = query.toLowerCase();
    const projects = getProjects(language);
    const blogPosts = getBlogPosts(language);

    const projectResults: SearchResult[] = projects
      .filter((project) => {
        const matchTitle = project.title.toLowerCase().includes(searchQuery);
        const matchDescription = project.description
          .toLowerCase()
          .includes(searchQuery);
        const matchTechnologies = project.technologies.some((tech) =>
          tech.toLowerCase().includes(searchQuery),
        );
        return matchTitle || matchDescription || matchTechnologies;
      })
      .map((project) => ({
        type: "project" as const,
        id: project.id,
        title: project.title,
        description: project.description,
        url: `/projects/${project.id}`,
        technologies: project.technologies,
      }));

    const blogResults: SearchResult[] = blogPosts
      .filter((post) => {
        const matchTitle = post.title.toLowerCase().includes(searchQuery);
        const matchExcerpt = post.excerpt.toLowerCase().includes(searchQuery);
        const matchCategory = post.category
          ?.toLowerCase()
          .includes(searchQuery);
        const matchTags = post.tags?.some((tag) =>
          tag.toLowerCase().includes(searchQuery),
        );
        return matchTitle || matchExcerpt || matchCategory || matchTags;
      })
      .map((post) => ({
        type: "blog" as const,
        id: post.slug,
        title: post.title,
        description: post.excerpt,
        url: `/blog/${post.slug}`,
        category: post.category,
      }));

    const allResults = [...blogResults, ...projectResults].slice(0, 10);
    setResults(allResults);
    setSelectedIndex(0);
  }, [query, language]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + results.length) % results.length);
    } else if (e.key === "Enter" && results.length > 0) {
      e.preventDefault();
      router.push(results[selectedIndex].url);
      onClose();
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  const handleResultClick = (url: string) => {
    router.push(url);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70]"
          />

          {/* Search Modal */}
          <div className="fixed inset-0 z-[70] flex items-start justify-center pt-[10vh]">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full max-w-2xl mx-4"
            >
              <div className="bg-secondary-bg border-2 border-accent-primary/30 rounded-2xl shadow-2xl overflow-hidden">
                {/* Search Input */}
                <div className="flex items-center gap-4 p-6 border-b-2 border-surface">
                  <Search className="w-6 h-6 text-accent-primary flex-shrink-0" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={t.search.placeholder}
                    className="flex-1 bg-transparent text-text-primary text-lg placeholder:text-text-muted focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={onClose}
                    className="text-text-muted hover:text-text-primary transition-colors"
                    aria-label="Close search"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Results */}
                <div className="max-h-[60vh] overflow-y-auto">
                  {query.trim() === "" ? (
                    <div className="p-12 text-center">
                      <div className="w-16 h-16 bg-accent-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Search className="w-8 h-8 text-accent-primary" />
                      </div>
                      <p className="text-text-secondary text-base mb-3">
                        {t.search.emptyTitle}
                      </p>
                      <div className="flex items-center justify-center gap-2 text-sm text-text-muted">
                        {t.search.emptyHelp}
                      </div>
                    </div>
                  ) : results.length === 0 ? (
                    <div className="p-12 text-center">
                      <div className="text-6xl mb-4">🔍</div>
                      <h3 className="text-xl font-bold text-text-primary mb-2">
                        {t.search.noResultsTitle}
                      </h3>
                      <p className="text-text-secondary">
                        {t.search.noResultsDescription}
                      </p>
                    </div>
                  ) : (
                    <div className="p-3">
                      {results.map((result, index) => (
                        <motion.button
                          key={`${result.type}-${result.id}`}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          onClick={() => handleResultClick(result.url)}
                          onMouseEnter={() => setSelectedIndex(index)}
                          className={`w-full text-left p-4 rounded-xl transition-all duration-200 mb-2 ${
                            index === selectedIndex
                              ? "bg-accent-primary/10 border-2 border-accent-primary"
                              : "bg-surface/50 border-2 border-transparent hover:border-surface-light"
                          }`}
                        >
                          <div className="flex items-start gap-4">
                            {/* Icon */}
                            <div
                              className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
                                result.type === "blog"
                                  ? "bg-accent-primary/20 text-accent-primary"
                                  : "bg-accent-secondary/20 text-accent-secondary"
                              }`}
                            >
                              {result.type === "blog" ? (
                                <FileText className="w-5 h-5" />
                              ) : (
                                <Briefcase className="w-5 h-5" />
                              )}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-bold text-text-primary truncate">
                                  {result.title}
                                </h4>
                                {result.category && (
                                  <span className="px-2 py-0.5 text-xs font-semibold rounded bg-accent-primary/20 text-accent-primary flex-shrink-0">
                                    {result.category}
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-text-secondary line-clamp-2 mb-2">
                                {result.description}
                              </p>
                              {result.technologies &&
                                result.technologies.length > 0 && (
                                  <div className="flex flex-wrap gap-1">
                                    {result.technologies
                                      .slice(0, 3)
                                      .map((tech) => (
                                        <span
                                          key={tech}
                                          className="px-2 py-0.5 text-xs rounded bg-surface text-text-muted"
                                        >
                                          {tech}
                                        </span>
                                      ))}
                                    {result.technologies.length > 3 && (
                                      <span className="px-2 py-0.5 text-xs rounded bg-surface text-text-muted">
                                        +{result.technologies.length - 3}
                                      </span>
                                    )}
                                  </div>
                                )}
                            </div>

                            {/* Arrow */}
                            <ArrowRight
                              className={`flex-shrink-0 w-5 h-5 transition-all duration-200 ${
                                index === selectedIndex
                                  ? "text-accent-primary translate-x-1"
                                  : "text-text-muted"
                              }`}
                            />
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between px-6 py-4 bg-surface/50 border-t-2 border-surface">
                  <div className="flex items-center gap-2 text-sm text-text-muted">
                    <span>{t.search.footer.searchBy}</span>
                    <span className="font-semibold text-accent-primary">
                      STEDING.
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <kbd className="px-2 py-1 bg-secondary-bg border border-surface-light rounded text-xs font-mono text-text-secondary flex items-center gap-1">
                      <Command className="w-3 h-3" />K
                    </kbd>
                    <span className="text-xs text-text-muted">
                      {t.search.footer.toOpen}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
