"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, ArrowRight, Search, X, BookOpen, Code, FlaskConical, Tag } from "lucide-react";
import Link from "next/link";
import { getAllPosts } from "@/data/blog";
import { useTranslation } from "@/hooks/useTranslation";

type CategoryFilter = 'all' | 'article' | 'tutorial' | 'research';

const categoryIcons = {
  article: BookOpen,
  tutorial: Code,
  research: FlaskConical,
};

export default function BlogPage() {
  const t = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('all');
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const allPosts = getAllPosts();
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    allPosts.forEach(post => post.tags.forEach(tag => tags.add(tag)));
    return Array.from(tags).sort();
  }, [allPosts]);

  const filteredPosts = useMemo(() => {
    let posts = allPosts;

    if (selectedCategory !== 'all') {
      posts = posts.filter(post => post.category === selectedCategory);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      posts = posts.filter(post =>
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query) ||
        post.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    if (selectedTags.length > 0) {
      posts = posts.filter(post =>
        selectedTags.every(tag => post.tags.includes(tag))
      );
    }

    return posts;
  }, [allPosts, selectedCategory, searchQuery, selectedTags]);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSelectedCategory('all');
    setSearchQuery("");
    setSelectedTags([]);
  };

  return (
    <main className="min-h-screen bg-primary-bg pt-32 pb-20">
      <div className="container relative z-10 mx-auto px-8 lg:px-16">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h1 className="font-display font-black mb-6 text-6xl md:text-7xl">
            {t.blog.page.title} <span className="text-gradient">{t.blog.page.titleHighlight}</span>
          </h1>
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="w-32 h-2 bg-accent-primary rounded-full mb-8"
          />
          <p className="text-xl text-text-secondary max-w-3xl leading-relaxed">
            {t.blog.page.description}
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12 space-y-6"
        >
          {/* Search Bar */}
          <div className="relative max-w-2xl">
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

          {/* Category Filter */}
          <div className="flex flex-wrap gap-3">
            {(['all', 'article', 'tutorial', 'research'] as CategoryFilter[]).map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-xl font-bold text-base transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-accent-primary text-primary-bg shadow-lg scale-105'
                    : 'bg-surface text-text-secondary hover:bg-surface-light hover:text-accent-primary border-2 border-transparent hover:border-accent-primary/30'
                }`}
              >
                {t.blog.page.categories[category]}
              </button>
            ))}
          </div>

          {/* Tag Filter */}
          {allTags.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Tag className="w-4 h-4 text-text-secondary" />
                <span className="text-sm font-bold text-text-secondary">{t.blog.page.tags.title}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-4 py-2 text-sm rounded-lg font-bold transition-all duration-300 ${
                      selectedTags.includes(tag)
                        ? 'bg-accent-secondary text-primary-bg border-2 border-accent-secondary'
                        : 'bg-surface text-text-secondary hover:bg-surface-light border-2 border-transparent hover:border-accent-secondary/30'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Clear Filters */}
          {(selectedCategory !== 'all' || searchQuery || selectedTags.length > 0) && (
            <div>
              <button
                onClick={clearFilters}
                className="text-accent-secondary hover:text-accent-primary transition-colors font-bold flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                {t.blog.page.actions.clearFilters}
              </button>
            </div>
          )}
        </motion.div>

        {/* Results Count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-8 text-text-secondary font-medium"
        >
          {t.blog.page.results.showing} <span className="text-accent-primary font-bold">{filteredPosts.length}</span> {filteredPosts.length === 1 ? t.blog.page.results.post : t.blog.page.results.posts}
        </motion.div>

        {/* Blog Posts Grid */}
        <AnimatePresence mode="wait">
          {filteredPosts.length > 0 ? (
            <motion.div
              key="posts-grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredPosts.map((post, index) => {
                const CategoryIcon = categoryIcons[post.category];
                return (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    whileHover={{ y: -8, scale: 1.02 }}
                    transition={{ 
                      duration: 0.6, 
                      delay: index * 0.1,
                      type: "spring",
                      stiffness: 300,
                      damping: 20
                    }}
                    className="relative group"
                  >
                    {/* Glow effect */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-accent-primary/20 to-accent-secondary/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    {/* Card content */}
                    <div className="relative card overflow-hidden">
                      {/* Header with image or icon */}
                      <div className="relative h-48 bg-secondary-bg overflow-hidden">
                        {post.coverImage ? (
                          <>
                            <img
                              src={post.coverImage}
                              alt={post.title}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-primary-bg/80 to-transparent" />
                          </>
                        ) : (
                          <>
                            <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/10 to-accent-secondary/10" />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <CategoryIcon className="w-20 h-20 opacity-40 text-text-secondary" />
                            </div>
                          </>
                        )}
                      </div>

                      {/* Content */}
                      <Link href={`/blog/${post.slug}`}>
                        <div className="p-8">
                          {/* Meta Information */}
                          <div className="flex items-center gap-4 mb-4 text-sm text-text-muted">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              <span className="font-semibold">{new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              <span className="font-semibold">{post.readingTime}</span>
                            </div>
                          </div>

                          <h3 className="text-2xl font-display font-bold mb-3 text-text-primary group-hover:text-accent-primary transition-colors duration-300">
                            {post.title}
                          </h3>
                          
                          <p className="text-text-secondary text-base leading-relaxed mb-6 line-clamp-3">
                            {post.excerpt}
                          </p>
                          
                          {/* Tags */}
                          <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-6 pb-2">
                            {post.tags.slice(0, 3).map((tag, i) => (
                              <motion.span
                                key={tag}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="px-4 py-2 text-sm font-bold rounded-lg bg-surface text-text-secondary border-2 border-surface group-hover:border-accent-primary group-hover:text-accent-primary transition-all duration-300 whitespace-nowrap flex-shrink-0"
                              >
                                {tag}
                              </motion.span>
                            ))}
                          </div>

                          {/* Read More Link */}
                          <div className="flex items-center gap-2 text-accent-primary text-base font-bold">
                            {t.blog.page.actions.readArticle}
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                          </div>
                        </div>
                      </Link>

                      {/* Category badge */}
                      <div className="absolute top-6 right-6 px-4 py-2 rounded-lg bg-accent-primary text-primary-bg text-sm font-bold shadow-lg capitalize">
                        {post.category}
                      </div>

                      {/* Featured badge */}
                      {post.featured && (
                        <div className="absolute top-6 left-6 px-4 py-2 rounded-lg bg-gradient-to-r from-yellow-500 to-orange-500 text-primary-bg text-sm font-bold shadow-lg">
                          {t.blog.page.badges.featured}
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            <motion.div
              key="no-results"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center py-20"
            >
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-surface flex items-center justify-center">
                <Search className="w-10 h-10 text-text-secondary" />
              </div>
              <h3 className="text-2xl font-bold text-text-primary mb-2">
                {t.blog.page.empty.title}
              </h3>
              <p className="text-text-secondary mb-6">
                {t.blog.page.empty.subtitle}
              </p>
              <button
                onClick={clearFilters}
                className="px-6 py-3 bg-accent-primary text-primary-bg rounded-xl font-bold hover:scale-105 transition-transform"
              >
                {t.blog.page.actions.clearFiltersButton}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
