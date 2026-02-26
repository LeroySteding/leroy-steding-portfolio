"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { createPortal } from "react-dom";
import Fuse from "fuse.js";
import { 
  Search, 
  X, 
  Calendar, 
  Clock, 
  Tag,
  ArrowRight,
  Command,
  TrendingUp,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  publishedAt: string;
  readingTime: string;
  coverImage?: string;
  featured?: boolean;
}

interface BlogSearchProps {
  posts: BlogPost[];
  language?: "en" | "nl";
}

// Fuse.js configuration for optimal search relevance
const fuseOptions = {
  keys: [
    { name: "title", weight: 0.4 },        // Highest weight for title matches
    { name: "tags", weight: 0.25 },        // High weight for tag matches
    { name: "excerpt", weight: 0.2 },      // Medium weight for excerpt
    { name: "category", weight: 0.1 },     // Lower weight for category
    { name: "content", weight: 0.05 },     // Lowest weight for content
  ],
  threshold: 0.3,                          // Lower = stricter matching
  distance: 100,                           // Character distance for fuzzy matching
  minMatchCharLength: 2,                   // Minimum characters to start matching
  includeScore: true,                      // Include relevance score
  includeMatches: true,                    // Include match positions for highlighting
};

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default function BlogSearch({ posts, language = "en" }: BlogSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();

  const debouncedQuery = useDebounce(query, 150);

  // Initialize Fuse.js
  const fuse = useMemo(() => new Fuse(posts, fuseOptions), [posts]);

  // Perform search
  const searchResults = useMemo(() => {
    if (!debouncedQuery.trim()) {
      return [];
    }
    return fuse.search(debouncedQuery).slice(0, 8); // Limit to 8 results
  }, [debouncedQuery, fuse]);

  // Get popular/recent posts for empty state
  const popularPosts = useMemo(() => {
    return posts
      .filter((post) => post.featured)
      .slice(0, 4)
      .map((post) => ({ item: post }));
  }, [posts]);

  const displayPosts = query.trim() ? searchResults : popularPosts;

  // Keyboard shortcut handler
  useEffect(() => {
    setMounted(true);

    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl+K to open
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(true);
      }

      // Escape to close
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
        setQuery("");
        setSelectedIndex(0);
      }

      // Arrow navigation
      if (isOpen && displayPosts.length > 0) {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          setSelectedIndex((prev) => 
            prev < displayPosts.length - 1 ? prev + 1 : 0
          );
        }
        if (e.key === "ArrowUp") {
          e.preventDefault();
          setSelectedIndex((prev) => 
            prev > 0 ? prev - 1 : displayPosts.length - 1
          );
        }
        if (e.key === "Enter" && displayPosts[selectedIndex]) {
          e.preventDefault();
          handleSelectPost(displayPosts[selectedIndex].item);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, displayPosts, selectedIndex]);

  // Reset selection when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [debouncedQuery]);

  const handleSelectPost = useCallback((post: BlogPost) => {
    const path = language === "nl" ? `/nl/blog/${post.slug}` : `/blog/${post.slug}`;
    router.push(path);
    setIsOpen(false);
    setQuery("");
    setSelectedIndex(0);
  }, [language, router]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setQuery("");
    setSelectedIndex(0);
  }, []);

  const t = {
    placeholder: language === "nl" 
      ? "Zoek artikelen..." 
      : "Search articles...",
    popular: language === "nl" 
      ? "Populaire artikelen" 
      : "Popular articles",
    noResults: language === "nl"
      ? "Geen resultaten gevonden"
      : "No results found",
    tryDifferent: language === "nl"
      ? "Probeer een andere zoekopdracht"
      : "Try a different search query",
  };

  if (!mounted) return null;

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface hover:bg-surface-light text-text-secondary transition-colors group border-2 border-transparent hover:border-accent-primary/30"
        aria-label="Search blog posts"
      >
        <Search className="w-4 h-4" />
        <span className="hidden sm:inline text-sm">{t.placeholder}</span>
        <kbd className="hidden md:inline-flex items-center gap-1 px-2 py-1 text-xs font-mono bg-surface-light rounded border border-surface-light group-hover:border-accent-primary/30 transition-colors">
          <Command className="w-3 h-3" />
          <span>K</span>
        </kbd>
      </button>
    );
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[10vh] animate-fade-in">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-primary-bg/80 backdrop-blur-sm"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Search Modal */}
      <div 
        className="relative w-full max-w-2xl bg-secondary-bg rounded-2xl border-2 border-surface shadow-2xl overflow-hidden animate-slide-in"
        role="dialog"
        aria-modal="true"
        aria-labelledby="search-title"
      >
        {/* Search Header */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-surface">
          <Search className="w-5 h-5 text-text-muted flex-shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.placeholder}
            className="flex-1 bg-transparent text-text-primary placeholder:text-text-muted outline-none text-lg"
            autoFocus
            id="search-title"
          />
          <button
            type="button"
            onClick={handleClose}
            className="flex-shrink-0 p-2 hover:bg-surface rounded-lg transition-colors"
            aria-label="Close search"
          >
            <X className="w-5 h-5 text-text-muted" />
          </button>
        </div>

        {/* Search Results */}
        <div className="max-h-[60vh] overflow-y-auto scrollbar-hide">
          {displayPosts.length > 0 ? (
            <div className="p-2">
              {/* Section Header */}
              {!query.trim() && (
                <div className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-text-muted uppercase tracking-wider">
                  <TrendingUp className="w-4 h-4" />
                  <span>{t.popular}</span>
                </div>
              )}

              {/* Results List */}
              <div className="space-y-1">
                {displayPosts.map((result, index) => {
                  const post = result.item;
                  const isSelected = index === selectedIndex;

                  return (
                    <button
                      key={post.id}
                      type="button"
                      onClick={() => handleSelectPost(post)}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`w-full text-left px-4 py-3 rounded-xl transition-all ${
                        isSelected 
                          ? "bg-accent-primary/20 border-2 border-accent-primary/50" 
                          : "hover:bg-surface border-2 border-transparent"
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        {/* Thumbnail */}
                        <div className="relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-surface">
                          {post.coverImage ? (
                            <Image
                              src={post.coverImage}
                              alt=""
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-accent-primary/10 to-accent-secondary/10 flex items-center justify-center">
                              <span className="text-xl font-display font-bold text-accent-primary/40">
                                {post.title.charAt(0)}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          {/* Category Badge */}
                          <span className="inline-block px-2 py-0.5 text-xs font-bold rounded-full capitalize bg-accent-primary/20 text-accent-primary mb-2">
                            {post.category}
                          </span>

                          {/* Title */}
                          <h3 className={`font-bold mb-1 line-clamp-1 transition-colors ${
                            isSelected ? "text-accent-primary" : "text-text-primary"
                          }`}>
                            {post.title}
                          </h3>

                          {/* Meta Info */}
                          <div className="flex items-center gap-3 text-xs text-text-muted mb-2">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              <time dateTime={post.publishedAt}>
                                {new Date(post.publishedAt).toLocaleDateString(
                                  language === "nl" ? "nl-NL" : "en-US",
                                  { month: "short", day: "numeric", year: "numeric" }
                                )}
                              </time>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>{post.readingTime}</span>
                            </div>
                          </div>

                          {/* Tags */}
                          {post.tags.length > 0 && (
                            <div className="flex items-center gap-2 flex-wrap">
                              <Tag className="w-3 h-3 text-text-muted" />
                              {post.tags.slice(0, 3).map((tag) => (
                                <span
                                  key={tag}
                                  className="text-xs text-text-muted"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Arrow indicator for selected */}
                        {isSelected && (
                          <ArrowRight className="w-5 h-5 text-accent-primary flex-shrink-0 mt-1" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : query.trim() ? (
            // No results state
            <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
              <div className="w-16 h-16 mb-4 rounded-full bg-surface flex items-center justify-center">
                <Search className="w-8 h-8 text-text-muted" />
              </div>
              <h3 className="text-lg font-bold text-text-primary mb-2">
                {t.noResults}
              </h3>
              <p className="text-sm text-text-muted">
                {t.tryDifferent}
              </p>
            </div>
          ) : null}
        </div>

        {/* Footer Hint */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-surface text-xs text-text-muted">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="px-2 py-1 bg-surface rounded border border-surface-light">↑↓</kbd>
              <span>Navigate</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-2 py-1 bg-surface rounded border border-surface-light">↵</kbd>
              <span>Select</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-2 py-1 bg-surface rounded border border-surface-light">esc</kbd>
              <span>Close</span>
            </span>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
