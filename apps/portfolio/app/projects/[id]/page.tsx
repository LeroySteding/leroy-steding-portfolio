"use client";

import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink, Github, Calendar, Tag } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getProjectById } from "@/utils/getLocalizedData";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "@/hooks/useTranslation";
import MetaTags from "@/components/seo/MetaTags";

export default function ProjectDetailPage() {
  const params = useParams();
  const { language } = useLanguage();
  const t = useTranslation();
  const project = getProjectById(params.id as string, language);

  const pageTitle = project
    ? `${project.title} | Leroy Steding`
    : t.projects.detail.notFound;
  const pageDescription = project?.description || "";
  const pageUrl = `https://leroysteding.nl/projects/${params.id}`;

  if (!project) {
    return (
      <div className="min-h-screen bg-cyber-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-display font-bold text-text-primary mb-4">
            {t.projects.detail.notFound}
          </h1>
          <Link
            href="/#projects"
            className="inline-flex items-center gap-2 text-neon-cyan hover:text-neon-violet transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {t.projects.detail.backToProjects}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <MetaTags
        title={pageTitle}
        description={pageDescription}
        url={pageUrl}
        keywords={project?.technologies || []}
      />
      <div className="min-h-screen bg-cyber-black">
      {/* Hero Section */}
      <section className="relative py-32 bg-cyber-darker overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-full h-full opacity-30">
          <div className="absolute top-1/4 -left-48 w-96 h-96 bg-neon-violet/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-neon-cyan/20 rounded-full blur-3xl" />
        </div>

        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link
              href="/#projects"
              className="inline-flex items-center gap-2 text-text-secondary hover:text-neon-cyan transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              {t.projects.detail.backToProjects}
            </Link>
          </motion.div>

          {/* Project Header */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-6"
            >
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <span className="px-4 py-2 rounded-full bg-neon-cyan/10 border border-neon-cyan text-neon-cyan text-sm font-semibold">
                  {project.category === 'product' ? `🚀 ${t.projects.categories.product}` : project.category === 'client' ? `💼 ${t.projects.categories.client}` : `🏢 ${t.projects.categories.internal}`}
                </span>
                <div className="flex items-center gap-2 text-text-secondary">
                  <Calendar className="w-4 h-4" />
                  <span>{project.year}</span>
                </div>
              </div>
              
              <h1 className="text-5xl sm:text-6xl font-display font-bold mb-6">
                {project.title}
              </h1>
              
              <p className="text-xl text-text-secondary leading-relaxed">
                {project.description}
              </p>
            </motion.div>

            {/* Action buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-wrap gap-4"
            >
              {project.liveUrl && (
                <Link
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-neon-cyan text-cyber-black font-semibold rounded-lg hover:scale-105 transition-transform duration-200"
                >
                  <ExternalLink className="w-5 h-5" />
                  View Live Site
                </Link>
              )}
              {project.githubUrl && (
                <Link
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-cyber-gray border-2 border-neon-violet text-text-primary font-semibold rounded-lg hover:scale-105 transition-transform duration-200"
                >
                  <Github className="w-5 h-5" />
                  View on GitHub
                </Link>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto">
            {/* Technologies */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="mb-16"
            >
              <h2 className="text-3xl font-display font-bold mb-6 flex items-center gap-3">
                <Tag className="w-8 h-8 text-neon-cyan" />
                {t.projects.detail.technologies}
              </h2>
              <div className="flex flex-wrap gap-3">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-4 py-2 text-sm font-semibold rounded-lg bg-cyber-darker border border-cyber-gray-light text-text-secondary hover:border-neon-cyan hover:text-neon-cyan transition-all duration-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Long Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="mb-16"
            >
              <h2 className="text-3xl font-display font-bold mb-6">Overview</h2>
              <div className="prose prose-invert max-w-none">
                {project.longDescription.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="text-text-secondary leading-relaxed mb-4">
                    {paragraph}
                  </p>
                ))}
              </div>
            </motion.div>

            {/* Challenges */}
            {project.challenges && project.challenges.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="mb-16"
              >
                <h2 className="text-3xl font-display font-bold mb-6">{t.projects.detail.challenges}</h2>
                <ul className="space-y-4">
                  {project.challenges.map((challenge, index) => (
                    <li
                      key={index}
                      className="flex gap-4 p-4 rounded-lg bg-cyber-darker border border-cyber-gray-light"
                    >
                      <span className="text-neon-violet font-bold text-xl">⚠️</span>
                      <span className="text-text-secondary">{challenge}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}

            {/* Solutions */}
            {project.solutions && project.solutions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="mb-16"
              >
                <h2 className="text-3xl font-display font-bold mb-6">{t.projects.detail.solutions}</h2>
                <ul className="space-y-4">
                  {project.solutions.map((solution, index) => (
                    <li
                      key={index}
                      className="flex gap-4 p-4 rounded-lg bg-cyber-darker border border-cyber-gray-light"
                    >
                      <span className="text-neon-cyan font-bold text-xl">✅</span>
                      <span className="text-text-secondary">{solution}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}

            {/* Impact */}
            {project.impact && project.impact.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="mb-16"
              >
                <h2 className="text-3xl font-display font-bold mb-6">{t.projects.detail.impact}</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {project.impact.map((item, index) => (
                    <div
                      key={index}
                      className="p-6 rounded-xl bg-gradient-to-br from-neon-cyan/10 to-neon-violet/10 border border-cyber-gray-light hover:border-neon-cyan/50 transition-all duration-300"
                    >
                      <div className="text-4xl mb-2">📈</div>
                      <p className="text-text-secondary">{item}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Testimonial */}
            {project.testimonial && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="mb-16"
              >
                <div className="p-8 rounded-xl bg-cyber-darker border-l-4 border-neon-cyan">
                  <p className="text-xl text-text-secondary italic mb-4">
                    "{project.testimonial.quote}"
                  </p>
                  <div className="flex items-center gap-4">
                    <div>
                      <div className="font-semibold text-text-primary">
                        {project.testimonial.author}
                      </div>
                      <div className="text-sm text-text-secondary">
                        {project.testimonial.role}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center p-8 rounded-xl bg-gradient-to-r from-neon-violet/10 to-neon-cyan/10 border border-cyber-gray-light"
            >
              <h3 className="text-2xl font-display font-bold mb-4">
                {t.projects.detail.cta.title}
              </h3>
              <p className="text-text-secondary mb-6">
                {t.projects.detail.cta.subtitle}
              </p>
              <Link
                href="/#contact"
                className="inline-flex items-center gap-2 px-8 py-4 bg-neon-cyan text-cyber-black font-semibold rounded-lg hover:scale-105 transition-transform duration-200"
              >
                {t.projects.detail.cta.button}
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
    </>
  );
}
