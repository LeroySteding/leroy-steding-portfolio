"use client";

import { motion } from "framer-motion";
import { ExternalLink, Github, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "@/hooks/useTranslation";
import { useLanguage } from "@/contexts/LanguageContext";
import { getProjects } from "@/utils/getLocalizedData";

export default function Projects() {
  const t = useTranslation();
  const { language } = useLanguage();
  const allProjects = getProjects(language);
  // Show only featured projects on homepage
  const projects = allProjects.filter(p => p.featured);

  return (
    <section id="projects" className="relative py-24 bg-cyber-black overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-neon-violet to-transparent" />
      
      {/* Gradient orbs */}
      <div className="absolute top-1/4 -left-48 w-96 h-96 bg-neon-violet/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-neon-cyan/10 rounded-full blur-3xl" />

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-4xl sm:text-5xl font-display font-bold mb-4"
          >
            {t.projects.title} <span className="bg-gradient-to-r from-neon-violet to-neon-cyan bg-clip-text text-transparent">{t.projects.titleHighlight}</span>
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="w-24 h-1 bg-gradient-to-r from-neon-violet to-neon-cyan mx-auto rounded-full"
          />
        </div>

        {/* Projects grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className="group relative rounded-xl bg-cyber-darker border border-cyber-gray-light glass overflow-hidden hover:border-neon-cyan/50 transition-all duration-300"
            >
              {/* Image */}
              <div className="relative h-48 bg-cyber-gray overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/20 to-neon-violet/20" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-6xl opacity-50">🚀</span>
                </div>
                
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-cyber-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                  <Link
                    href={`/projects/${project.id}`}
                    className="p-3 rounded-lg bg-neon-cyan text-cyber-black hover:scale-110 transition-transform duration-200"
                    aria-label={t.projects.viewLive}
                  >
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                  {project.liveUrl && (
                    <Link
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-lg bg-neon-violet text-white hover:scale-110 transition-transform duration-200"
                      aria-label={t.projects.viewSite}
                    >
                      <ExternalLink className="w-5 h-5" />
                    </Link>
                  )}
                  {project.githubUrl && (
                    <Link
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-lg bg-cyber-gray text-white hover:scale-110 transition-transform duration-200"
                      aria-label={t.projects.viewGithub}
                    >
                      <Github className="w-5 h-5" />
                    </Link>
                  )}
                </div>
              </div>

              {/* Content */}
              <Link href={`/projects/${project.id}`}>
                <div className="p-6">
                  <h3 className="text-xl font-display font-bold mb-2 text-text-primary group-hover:text-neon-cyan transition-colors duration-300">
                    {project.title}
                  </h3>
                  
                  <p className="text-text-secondary text-sm leading-relaxed mb-4">
                    {project.description}
                  </p>
                  
                  {/* Technologies */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.slice(0, 3).map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 text-xs font-semibold rounded-full bg-cyber-gray text-text-secondary border border-cyber-gray-light group-hover:border-neon-cyan/30 group-hover:text-neon-cyan transition-all duration-300"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 3 && (
                      <span className="px-3 py-1 text-xs font-semibold rounded-full bg-cyber-gray text-text-secondary border border-cyber-gray-light">
                        +{project.technologies.length - 3} more
                      </span>
                    )}
                  </div>

                  {/* View Details Link */}
                  <div className="flex items-center gap-2 text-neon-cyan text-sm font-semibold">
                    {t.projects.viewDetails}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                  </div>
                </div>
              </Link>

              {/* Category badge */}
              <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-neon-cyan/20 border border-neon-cyan text-neon-cyan text-xs font-semibold backdrop-blur-sm">
                {project.category === 'product' ? t.projects.categories.product : project.category === 'client' ? t.projects.categories.client : t.projects.categories.internal}
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <p className="text-text-secondary mb-6">
            {t.projects.moreProjects.text}
          </p>
          <Link
            href="https://github.com/leroysteding"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 text-lg font-semibold text-text-primary bg-cyber-gray hover:bg-cyber-gray-light border-2 border-neon-violet rounded-lg transition-all duration-300 hover:scale-105 neon-border-violet"
          >
            <Github className="w-5 h-5" />
            {t.projects.moreProjects.button}
            <ExternalLink className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
