"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Github, ArrowRight, Calendar, Award } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "@/hooks/useTranslation";
import { useLanguage } from "@/contexts/LanguageContext";
import { getProjects } from "@/utils/getLocalizedData";
import { useLocalizedPath } from "@/lib/localization";

type CategoryFilter = 'all' | 'product' | 'client' | 'internal';

export default function Projects() {
  const t = useTranslation();
  const { language } = useLanguage();
  const getLocalizedPath = useLocalizedPath();
  const allProjects = getProjects(language);
  const featuredProjects = allProjects.filter(p => p.featured).slice(0, 3); // Only show 3 featured projects
  
  const [filter, setFilter] = useState<CategoryFilter>('all');
  
  // Filter projects based on selected category
  const projects = filter === 'all' 
    ? featuredProjects 
    : featuredProjects.filter(p => p.category === filter);

  return (
    <section id="projects" className="section relative bg-primary-bg overflow-hidden">
      {/* Subtle accent line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-accent-primary to-transparent" />

      <div className="container relative z-10 mx-auto px-8 lg:px-16">
        {/* Section header */}
        <div className="mb-20 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="font-display font-black mb-6"
          >
            {t.projects.title} <span className="text-gradient">{t.projects.titleHighlight}</span>
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="w-32 h-2 bg-accent-primary rounded-full mx-auto"
          />
        </div>

        {/* Projects grid */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={filter}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
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

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="text-xl text-text-secondary mb-8 font-medium">
            Want to see more projects?
          </p>
          <Link
            href={getLocalizedPath("/projects")}
            className="btn-secondary inline-flex items-center gap-3"
          >
            View All Projects
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
