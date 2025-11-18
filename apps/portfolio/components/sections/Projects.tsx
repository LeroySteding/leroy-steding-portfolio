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
    <section id="projects" className="section relative bg-primary-bg overflow-hidden">
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
            {t.projects.title} <span className="text-gradient">{t.projects.titleHighlight}</span>
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="w-32 h-2 bg-accent-primary rounded-full"
          />
        </div>

        {/* Projects grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="card group overflow-hidden"
            >
              {/* Image */}
              <div className="relative h-64 bg-secondary-bg overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/10 to-accent-secondary/10" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-8xl opacity-40">🚀</span>
                </div>
                
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
              <Link href={`/projects/${project.id}`}>
                <div className="p-8">
                  <h3 className="text-2xl font-display font-bold mb-3 text-text-primary group-hover:text-accent-primary transition-colors duration-300">
                    {project.title}
                  </h3>
                  
                  <p className="text-text-secondary text-base leading-relaxed mb-6">
                    {project.description}
                  </p>
                  
                  {/* Technologies */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.technologies.slice(0, 3).map((tech) => (
                      <span
                        key={tech}
                        className="px-4 py-2 text-sm font-bold rounded-lg bg-surface text-text-secondary border-2 border-surface group-hover:border-accent-primary group-hover:text-accent-primary transition-all duration-300"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 3 && (
                      <span className="px-4 py-2 text-sm font-bold rounded-lg bg-surface text-text-muted border-2 border-surface">
                        +{project.technologies.length - 3}
                      </span>
                    )}
                  </div>

                  {/* View Details Link */}
                  <div className="flex items-center gap-2 text-accent-primary text-base font-bold">
                    {t.projects.viewDetails}
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-200" />
                  </div>
                </div>
              </Link>

              {/* Category badge */}
              <div className="absolute top-6 right-6 px-4 py-2 rounded-lg bg-accent-primary text-primary-bg text-sm font-bold">
                {project.category === 'product' ? t.projects.categories.product : project.category === 'client' ? t.projects.categories.client : t.projects.categories.internal}
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="text-xl text-text-secondary mb-8 font-medium">
            {t.projects.moreProjects.text}
          </p>
          <Link
            href="https://github.com/leroysteding"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary inline-flex items-center gap-3"
          >
            <Github className="w-6 h-6" />
            {t.projects.moreProjects.button}
            <ExternalLink className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
