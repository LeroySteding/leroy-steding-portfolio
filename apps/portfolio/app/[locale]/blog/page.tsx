"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  Code,
  FlaskConical,
  Search,
  Tag,
  X,
} from "lucide-react";
import Link from "next/link";
import { useLocale } from "next-intl";
import { useMemo, useState } from "react";
import { getAllPosts } from "@/data/blog";
import { getAllPostsNL } from "@/data/blog-nl";
import { useTranslation } from "@/hooks/useTranslation";

type CategoryFilter = "all" | "article" | "tutorial" | "research";

const categoryIcons = {
  article: BookOpen,
  tutorial: Code,
  research: FlaskConical,
};

const POSTS_PER_PAGE = 6;

export default function BlogPage() {
  const t = useTranslation();
  const locale = useLocale();
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  // Get posts based on current locale
  const allPosts = locale === "nl" ? getAllPostsNL() : getAllPosts();

  // Get featured posts (up to 3 - featured ones first, then most recent)
  const featuredPosts = useMemo(() => {
    const featured = allPosts.filter((post) => post.featured);
    const recent = allPosts.filter((post) => !post.featured);
    return [...featured, ...recent].slice(0, 3);
  }, [allPosts]);

  // Get all unique tags
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    allPosts.forEach((post) => post.tags.forEach((tag) => tags.add(tag)));
    return Array.from(tags).sort();
  }, [allPosts]);

  // Filter posts (excluding featured posts from main list)
  const featuredIds = featuredPosts.map((p) => p.id);
  const filteredPosts = useMemo(() => {
    let posts = allPosts.filter((post) => !featuredIds.includes(post.id));

    if (selectedCategory !== "all") {
      posts = posts.filter((post) => post.category === selectedCategory);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      posts = posts.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          post.excerpt.toLowerCase().includes(query) ||
          post.tags.some((tag) => tag.toLowerCase().includes(query)),
      );
    }

    if (selectedTags.length > 0) {
      posts = posts.filter((post) =>
        selectedTags.every((tag) => post.tags.includes(tag)),
      );
    }

    return posts;
  }, [allPosts, featuredIds, selectedCategory, searchQuery, selectedTags]);

  // Pagination
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const paginatedPosts = useMemo(() => {
    const start = (currentPage - 1) * POSTS_PER_PAGE;
    return filteredPosts.slice(start, start + POSTS_PER_PAGE);
  }, [filteredPosts, currentPage]);

  // Reset to page 1 when filters change
  useMemo(() => {
    setCurrentPage(1);
  }, []);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const clearFilters = () => {
    setSelectedCategory("all");
    setSearchQuery("");
    setSelectedTags([]);
    setCurrentPage(1);
  };

  const mainFeatured = featuredPosts[0];
  const secondaryFeatured = featuredPosts.slice(1, 3);

  return (
    <main className="min-h-screen bg-primary-bg pt-32 pb-20">
      <div className="container relative z-10 mx-auto px-8 lg:px-16">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h1 className="font-display font-black mb-6 text-5xl md:text-6xl lg:text-7xl">
            {t.blog.page.title}{" "}
            <span className="text-gradient">{t.blog.page.titleHighlight}</span>
          </h1>
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="w-32 h-1.5 bg-accent-primary rounded-full mb-6"
          />
          <p className="text-lg text-text-secondary max-w-2xl leading-relaxed">
            {t.blog.page.description}
          </p>
        </motion.div>

        {/* Featured Posts Hero - Bento Grid */}
        {featuredPosts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-16"
          >
            <div className="grid lg:grid-cols-2 gap-6 h-[500px]">
              {/* Main Featured Post - Large */}
              {mainFeatured && (
                <Link
                  href={`/blog/${mainFeatured.slug}`}
                  className="block h-full group"
                >
                  <div className="relative h-full rounded-2xl overflow-hidden">
                    {/* Background Image */}
                    {mainFeatured.coverImage ? (
                      <img
                        src={mainFeatured.coverImage}
                        alt={mainFeatured.title}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/30 to-accent-secondary/30" />
                    )}

                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />

                    {/* Content */}
                    <div className="absolute inset-0 p-8 flex flex-col justify-end">
                      {/* Badge */}
                      {mainFeatured.featured && (
                        <div className="absolute top-6 left-6 px-4 py-2 rounded-lg bg-gradient-to-r from-yellow-500 to-orange-500 text-primary-bg text-sm font-bold shadow-lg">
                          {t.blog.page.badges.featured}
                        </div>
                      )}

                      {/* Meta */}
                      <div className="flex items-center gap-4 mb-4 text-sm text-white/70">
                        <span className="px-3 py-1 rounded-full bg-accent-primary/30 backdrop-blur-sm text-white font-semibold capitalize">
                          {mainFeatured.category}
                        </span>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {new Date(
                              mainFeatured.publishedAt,
                            ).toLocaleDateString(
                              locale === "nl" ? "nl-NL" : "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              },
                            )}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>{mainFeatured.readingTime}</span>
                        </div>
                      </div>

                      {/* Title */}
                      <h2 className="text-3xl lg:text-4xl font-display font-bold mb-4 text-white group-hover:text-accent-primary transition-colors">
                        {mainFeatured.title}
                      </h2>

                      {/* Excerpt */}
                      <p className="text-white/80 leading-relaxed mb-6 line-clamp-3 max-w-xl">
                        {mainFeatured.excerpt}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-6">
                        {mainFeatured.tags.slice(0, 4).map((tag) => (
                          <span
                            key={tag}
                            className="px-3 py-1 text-sm rounded-lg bg-white/10 backdrop-blur-sm text-white/80"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* CTA */}
                      <div className="flex items-center gap-2 text-accent-primary font-bold">
                        {t.blog.page.actions.readArticle}
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                      </div>
                    </div>
                  </div>
                </Link>
              )}

              {/* Secondary Featured Posts - Stacked */}
              <div className="grid grid-rows-2 gap-6 h-full">
                {secondaryFeatured.map((post, index) => {
                  const _PostIcon = categoryIcons[post.category];
                  return (
                    <Link
                      key={post.id}
                      href={`/blog/${post.slug}`}
                      className="block h-full group"
                    >
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                        className="relative h-full rounded-2xl overflow-hidden"
                      >
                        {/* Background Image */}
                        {post.coverImage ? (
                          <img
                            src={post.coverImage}
                            alt={post.title}
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-accent-secondary/30 to-accent-primary/30" />
                        )}

                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/30" />

                        {/* Content */}
                        <div className="absolute inset-0 p-6 flex flex-col justify-end">
                          {/* Meta */}
                          <div className="flex items-center gap-3 mb-3 text-xs text-white/70">
                            <span className="px-2 py-1 rounded-full bg-accent-primary/30 backdrop-blur-sm text-white font-semibold capitalize">
                              {post.category}
                            </span>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5" />
                              <span>
                                {new Date(post.publishedAt).toLocaleDateString(
                                  locale === "nl" ? "nl-NL" : "en-US",
                                  { month: "short", day: "numeric" },
                                )}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              <span>{post.readingTime}</span>
                            </div>
                          </div>

                          {/* Title */}
                          <h3 className="text-xl lg:text-2xl font-display font-bold mb-2 text-white group-hover:text-accent-primary transition-colors line-clamp-2">
                            {post.title}
                          </h3>

                          {/* Excerpt */}
                          <p className="text-sm text-white/70 leading-relaxed line-clamp-2 mb-4">
                            {post.excerpt}
                          </p>

                          {/* CTA */}
                          <div className="flex items-center gap-2 text-accent-primary text-sm font-bold">
                            {t.blog.page.actions.readArticle}
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </motion.div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {/* Main Content with Sidebar */}
        <div className="grid lg:grid-cols-[1fr_320px] gap-12">
          {/* Posts Grid */}
          <div>
            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-8"
            >
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t.blog.page.search.placeholder}
                  className="w-full pl-12 pr-12 py-4 rounded-xl bg-surface border-2 border-surface focus:border-accent-primary outline-none text-text-primary placeholder:text-text-secondary transition-all font-medium"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-surface-hover rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-text-secondary" />
                  </button>
                )}
              </div>
            </motion.div>

            {/* Results Count */}
            <div className="mb-6 text-text-secondary font-medium">
              {t.blog.page.results.showing}{" "}
              <span className="text-accent-primary font-bold">
                {filteredPosts.length}
              </span>{" "}
              {filteredPosts.length === 1
                ? t.blog.page.results.post
                : t.blog.page.results.posts}
            </div>

            {/* Posts Grid */}
            <AnimatePresence mode="wait">
              {paginatedPosts.length > 0 ? (
                <motion.div
                  key={`posts-${currentPage}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid md:grid-cols-2 gap-6"
                >
                  {paginatedPosts.map((post, index) => {
                    const PostCategoryIcon = categoryIcons[post.category];
                    return (
                      <motion.div
                        key={post.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ y: -4 }}
                        transition={{ duration: 0.4, delay: index * 0.05 }}
                        className="group"
                      >
                        <Link href={`/blog/${post.slug}`}>
                          <div className="relative h-full rounded-xl overflow-hidden bg-surface border border-surface-light hover:border-accent-primary/50 transition-all duration-300">
                            {/* Image */}
                            <div className="relative h-44 overflow-hidden">
                              {post.coverImage ? (
                                <>
                                  <img
                                    src={post.coverImage}
                                    alt={post.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent" />
                                </>
                              ) : (
                                <div className="w-full h-full bg-gradient-to-br from-accent-primary/10 to-accent-secondary/10 flex items-center justify-center">
                                  <PostCategoryIcon className="w-12 h-12 text-accent-primary/40" />
                                </div>
                              )}
                              {/* Category Badge */}
                              <div className="absolute top-3 right-3 px-3 py-1 rounded-lg bg-accent-primary text-primary-bg text-xs font-bold capitalize">
                                {post.category}
                              </div>
                            </div>

                            {/* Content */}
                            <div className="p-5">
                              <div className="flex items-center gap-3 mb-3 text-xs text-text-muted">
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-3.5 h-3.5" />
                                  <span>
                                    {new Date(
                                      post.publishedAt,
                                    ).toLocaleDateString(
                                      locale === "nl" ? "nl-NL" : "en-US",
                                      { month: "short", day: "numeric" },
                                    )}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="w-3.5 h-3.5" />
                                  <span>{post.readingTime}</span>
                                </div>
                              </div>

                              <h3 className="text-lg font-display font-bold mb-2 text-text-primary group-hover:text-accent-primary transition-colors line-clamp-2">
                                {post.title}
                              </h3>

                              <p className="text-sm text-text-secondary leading-relaxed mb-4 line-clamp-2">
                                {post.excerpt}
                              </p>

                              <div className="flex items-center gap-2 text-accent-primary text-sm font-bold">
                                {t.blog.page.actions.readArticle}
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                              </div>
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    );
                  })}
                </motion.div>
              ) : (
                <motion.div
                  key="no-results"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="text-center py-16"
                >
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-surface flex items-center justify-center">
                    <Search className="w-8 h-8 text-text-secondary" />
                  </div>
                  <h3 className="text-xl font-bold text-text-primary mb-2">
                    {t.blog.page.empty.title}
                  </h3>
                  <p className="text-text-secondary mb-4">
                    {t.blog.page.empty.subtitle}
                  </p>
                  <button
                    onClick={clearFilters}
                    className="px-5 py-2 bg-accent-primary text-primary-bg rounded-lg font-bold hover:scale-105 transition-transform"
                  >
                    {t.blog.page.actions.clearFiltersButton}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Pagination */}
            {totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-center gap-2 mt-12"
              >
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg bg-surface border border-surface-light hover:border-accent-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-10 h-10 rounded-lg font-bold transition-all ${
                        currentPage === page
                          ? "bg-accent-primary text-primary-bg"
                          : "bg-surface border border-surface-light hover:border-accent-primary text-text-secondary"
                      }`}
                    >
                      {page}
                    </button>
                  ),
                )}

                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg bg-surface border border-surface-light hover:border-accent-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <motion.aside
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-8"
          >
            {/* Categories */}
            <div className="p-6 rounded-xl bg-surface border border-surface-light">
              <h3 className="text-lg font-display font-bold mb-4 text-text-primary">
                {locale === "nl" ? "Categorieën" : "Categories"}
              </h3>
              <div className="space-y-2">
                {(
                  ["all", "article", "tutorial", "research"] as CategoryFilter[]
                ).map((category) => {
                  const count =
                    category === "all"
                      ? allPosts.length
                      : allPosts.filter((p) => p.category === category).length;
                  return (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-lg font-medium transition-all ${
                        selectedCategory === category
                          ? "bg-accent-primary text-primary-bg"
                          : "bg-surface-light text-text-secondary hover:bg-accent-primary/20 hover:text-accent-primary"
                      }`}
                    >
                      <span>{t.blog.page.categories[category]}</span>
                      <span
                        className={`text-sm ${selectedCategory === category ? "text-primary-bg/80" : "text-text-muted"}`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tags */}
            {allTags.length > 0 && (
              <div className="p-6 rounded-xl bg-surface border border-surface-light">
                <div className="flex items-center gap-2 mb-4">
                  <Tag className="w-5 h-5 text-accent-primary" />
                  <h3 className="text-lg font-display font-bold text-text-primary">
                    {locale === "nl" ? "Tags" : "Tags"}
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {allTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-all ${
                        selectedTags.includes(tag)
                          ? "bg-accent-secondary text-primary-bg"
                          : "bg-surface-light text-text-secondary hover:bg-accent-secondary/20 hover:text-accent-secondary"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Clear Filters */}
            {(selectedCategory !== "all" ||
              searchQuery ||
              selectedTags.length > 0) && (
              <button
                onClick={clearFilters}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 border-accent-primary/50 text-accent-primary font-bold hover:bg-accent-primary hover:text-primary-bg transition-all"
              >
                <X className="w-4 h-4" />
                {t.blog.page.actions.clearFilters}
              </button>
            )}

            {/* Newsletter CTA */}
            <div className="p-6 rounded-xl bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20 border border-accent-primary/30">
              <h3 className="text-lg font-display font-bold mb-2 text-text-primary">
                {t.newsletter.title}
              </h3>
              <p className="text-sm text-text-secondary mb-4">
                {t.newsletter.description}
              </p>
              <Link
                href="/contact"
                className="block w-full text-center px-4 py-3 bg-accent-primary text-primary-bg rounded-lg font-bold hover:scale-105 transition-transform"
              >
                {t.newsletter.subscribe}
              </Link>
            </div>
          </motion.aside>
        </div>
      </div>
    </main>
  );
}
