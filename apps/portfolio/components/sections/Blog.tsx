"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, ArrowRight, BookOpen, Code, FlaskConical } from "lucide-react";
import Link from "next/link";
import { getAllPosts, type BlogPost } from "@/data/blog";

type CategoryFilter = 'all' | 'article' | 'tutorial' | 'research';

const categoryIcons = {
  article: BookOpen,
  tutorial: Code,
  research: FlaskConical,
};

export default function Blog() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('all');
  
  const allPosts = getAllPosts();
  const featuredPosts = allPosts.filter(p => p.featured).slice(0, 6);

  const filteredPosts = useMemo(() => {
    const posts = featuredPosts;
    if (selectedCategory === 'all') return posts;
    return posts.filter(post => post.category === selectedCategory);
  }, [featuredPosts, selectedCategory]);

  return (
    <section id="blog" className="section relative bg-primary-bg overflow-hidden">
      {/* Subtle accent line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-accent-primary to-transparent" />

      <div className="container relative z-10 mx-auto px-8 lg:px-16">
        {/* Section header */}
        <div className="mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="font-display font-black mb-6"
          >
            Latest from the <span className="text-gradient">Journal</span>
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="w-32 h-2 bg-accent-primary rounded-full mb-12"
          />
          
          {/* Category Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex flex-wrap gap-3"
          >
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
                {category === 'all' ? 'All Posts' : 
                 category === 'article' ? 'Articles' :
                 category === 'tutorial' ? 'Tutorials' :
                 'Research'}
              </button>
            ))}
          </motion.div>
        </div>

        {/* Blog Posts Grid */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={selectedCategory}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
          >
            {filteredPosts.map((post, index) => {
              const CategoryIcon = categoryIcons[post.category];
              return (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ 
                    duration: 0.6, 
                    delay: index * 0.1,
                    type: "spring",
                    stiffness: 300,
                    damping: 20
                  }}
                  viewport={{ once: true, margin: "0px 0px -100px 0px" }}
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
                        
                        {/* Tags - Scrollable */}
                        <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-6 pb-2">
                          {post.tags.slice(0, 3).map((tag, i) => (
                            <motion.span
                              key={tag}
                              initial={{ opacity: 0, x: -10 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.05 }}
                              viewport={{ once: true }}
                              className="px-4 py-2 text-sm font-bold rounded-lg bg-surface text-text-secondary border-2 border-surface group-hover:border-accent-primary group-hover:text-accent-primary transition-all duration-300 whitespace-nowrap flex-shrink-0"
                            >
                              {tag}
                            </motion.span>
                          ))}
                        </div>

                        {/* Read More Link */}
                        <div className="flex items-center gap-2 text-accent-primary text-base font-bold">
                          Read Article
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
                        Featured
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {/* CTA - View All Posts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="text-xl text-text-secondary mb-8 font-medium">
            Want to read more articles, tutorials, and research?
          </p>
          <Link
            href="/blog"
            className="btn-secondary inline-flex items-center gap-3"
          >
            <BookOpen className="w-6 h-6" />
            View All Posts
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
