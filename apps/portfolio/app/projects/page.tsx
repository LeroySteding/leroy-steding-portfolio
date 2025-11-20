"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Github, ArrowRight, Calendar, Award } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "@/hooks/useTranslation";
import { useLanguage } from "@/contexts/LanguageContext";
import { getProjects } from "@/utils/getLocalizedData";

type CategoryFilter = 'all' | 'product' | 'client' | 'internal';

export default function ProjectsPage() {
  const t = useTranslation();
  const { language } = useLanguage();
  const allProjects = getProjects(language);
  const featuredProjects = allProjects.filter(p => p.featured);
  
  const [filter, setFilter] = useState<CategoryFilter>('all');
  
  // Filter projects based on selected category
  const projects = filter === 'all' 
    ? featuredProjects 
    : featuredProjects.filter(p => p.category === filter);

  return (
    <main className="min-h-screen bg-primary-bg">
      {/* Hero Section */}
      <section className="section relative bg-gradient-to-b from-primary-bg to-secondary-bg overflow-hidden pt-32">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-72 h-72 bg-accent-primary rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent-secondary rounded-full blur-3xl" />
        </div>

        <div className="container relative z-10 mx-auto px-8 lg:px-16">
          <div className="max-w-4xl mx-auto text-center mb-20">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="font-display font-black text-5xl md:text-6xl lg:text-7xl mb-6"
            >
              Featured <span className="text-gradient">Projects</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-xl text-text-secondary leading-relaxed"
            >
              Explore my portfolio of web applications, AI automation solutions, and client projects
            </motion.p>
          </div>

          {/* Category Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap gap-3 justify-center mb-12"
          >
            {(['all', 'product', 'client', 'internal'] as CategoryFilter[]).map((category) => (
              <button
                key={category}
                onClick={() => setFilter(category)}
                className={`px-6 py-3 rounded-xl font-bold text-base transition-all duration-300 ${
                  filter === category
                    ? 'bg-accent-primary text-primary-bg shadow-lg scale-105'
                    : 'bg-surface text-text-secondary hover:bg-surface-light hover:text-accent-primary border-2 border-transparent hover:border-accent-primary/30'
                }`}
              >
                {category === 'all' ? 'All Projects' : 
                 category === 'product' ? t.projects.categories.product :
                 category === 'client' ? t.projects.categories.client :
                 t.projects.categories.internal}
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="section relative bg-primary-bg">
        <div className="container relative z-10 mx-auto px-8 lg:px-16">
          <AnimatePresence mode="wait">
            <motion.div 
              key={filter}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {projects.map((project, index) => (
                <motion.div
                  key={project.id}
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
                  className="relative group h-full"
                >
                  {/* Glow effect */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-accent-primary/20 to-accent-secondary/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Card content */}
                  <div className="relative card overflow-hidden h-full flex flex-col">
                    {/* Image */}
                    <div className="relative h-64 bg-secondary-bg overflow-hidden">
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
                      
                      {/* Overlay on hover */}
                      <div className="absolute inset-0 bg-primary-bg/95 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                        <Link
                          href={`/projects/${project.id}`}
                          className="p-4 rounded-lg bg-accent-primary text-primary-bg hover:scale-110 transition-transform duration-200 font-bold"
                          aria-label={t.projects.viewLive}
                        >
                          <ArrowRight className="w-6 h-6" />
                        </Link>
                        {project.liveUrl && (
                          <Link
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-4 rounded-lg bg-accent-secondary text-primary-bg hover:scale-110 transition-transform duration-200 font-bold"
                            aria-label={t.projects.viewSite}
                          >
                            <ExternalLink className="w-6 h-6" />
                          </Link>
                        )}
                        {project.githubUrl && (
                          <Link
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-4 rounded-lg bg-surface text-text-primary hover:scale-110 transition-transform duration-200 font-bold"
                            aria-label={t.projects.viewGithub}
                          >
                            <Github className="w-6 h-6" />
                          </Link>
                        )}
                      </div>
                    </div>

                    {/* Content */}
                    <Link href={`/projects/${project.id}`} className="flex-1 flex flex-col">
                      <div className="p-8 flex-1 flex flex-col">
                        {/* Project Metrics */}
                        <div className="flex items-center gap-4 mb-4 text-sm text-text-muted">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span className="font-semibold">{project.year}</span>
                          </div>
                          {project.achievements && project.achievements.length > 0 && (
                            <div className="flex items-center gap-2">
                              <Award className="w-4 h-4" />
                              <span className="font-semibold">{project.achievements.length}</span>
                            </div>
                          )}
                          {project.liveUrl && (
                            <div className="flex items-center gap-2">
                              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                              <span className="font-semibold">Live</span>
                            </div>
                          )}
                        </div>

                        <h3 className="text-2xl font-display font-bold mb-3 text-text-primary group-hover:text-accent-primary transition-colors duration-300">
                          {project.title}
                        </h3>
                        
                        <p className="text-text-secondary text-base leading-relaxed mb-6 flex-1">
                          {project.description}
                        </p>
                        
                        {/* Technologies - Scrollable */}
                        <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-6 pb-2 mt-auto">
                          {project.technologies.map((tech, i) => (
                            <motion.span
                              key={tech}
                              initial={{ opacity: 0, x: -10 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.05 }}
                              viewport={{ once: true }}
                              className="px-4 py-2 text-sm font-bold rounded-lg bg-surface text-text-secondary border-2 border-surface group-hover:border-accent-primary group-hover:text-accent-primary transition-all duration-300 whitespace-nowrap flex-shrink-0"
                            >
                              {tech}
                            </motion.span>
                          ))}
                        </div>

                        {/* View Details Link */}
                        <div className="flex items-center gap-2 text-accent-primary text-base font-bold">
                          {t.projects.viewDetails}
                          <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                        </div>
                      </div>
                    </Link>

                    {/* Category badge */}
                    <div className="absolute top-6 right-6 px-4 py-2 rounded-lg bg-accent-primary text-primary-bg text-sm font-bold shadow-lg">
                      {project.category === 'product' ? t.projects.categories.product : project.category === 'client' ? t.projects.categories.client : t.projects.categories.internal}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
    </main>
  );
}
