"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Calendar, ExternalLink, Github, Tag } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import MetaTags from "@/components/seo/MetaTags";
import CTA from "@/components/ui/CTA";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "@/hooks/useTranslation";
import { getProjectById } from "@/utils/getLocalizedData";

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
      <div className="min-h-screen bg-primary-bg flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-display font-bold text-text-primary mb-4">
            {t.projects.detail.notFound}
          </h1>
          <Link
            href="/#projects"
            className="inline-flex items-center gap-2 text-accent-primary hover:text-accent-hover transition-colors"
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
      <div className="min-h-screen bg-primary-bg">
        {/* Hero Section with Featured Image */}
        <section className="relative h-[60vh] min-h-[500px] overflow-hidden">
          {/* Featured Image Background */}
          {project.image ? (
            <div className="absolute inset-0">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover"
              />
              {/* Dark gradient overlay for readability */}
              <div className="absolute inset-0 bg-gradient-to-b from-primary-bg/60 via-primary-bg/80 to-primary-bg" />
            </div>
          ) : (
            <>
              {/* Fallback background decoration */}
              <div className="absolute inset-0 bg-secondary-bg" />
              <div className="absolute top-0 left-0 w-full h-full opacity-20">
                <div className="absolute top-1/4 -left-48 w-96 h-96 bg-accent-primary/30 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-accent-secondary/30 rounded-full blur-3xl" />
              </div>
            </>
          )}

          <div className="container relative z-10 mx-auto px-8 lg:px-16 h-full flex flex-col justify-end pb-16">
            {/* Back button */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Link
                href="/#projects"
                className="inline-flex items-center gap-2 text-text-secondary hover:text-accent-primary transition-colors mb-8 font-semibold"
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
                <div className="flex flex-wrap items-center gap-4 mb-6">
                  <span className="px-5 py-2.5 rounded-full bg-accent-primary/10 border-2 border-accent-primary text-accent-primary text-sm font-bold">
                    {project.category === "product"
                      ? `🚀 ${t.projects.categories.product}`
                      : project.category === "client"
                        ? `💼 ${t.projects.categories.client}`
                        : `🏢 ${t.projects.categories.internal}`}
                  </span>
                  <div className="flex items-center gap-2 text-text-secondary font-semibold">
                    <Calendar className="w-5 h-5" />
                    <span className="text-base">{project.year}</span>
                  </div>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-black mb-6 leading-tight text-text-primary">
                  {project.title}
                </h1>

                <p className="text-lg sm:text-xl text-text-secondary leading-relaxed max-w-3xl">
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
                    className="btn-primary inline-flex items-center gap-3"
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
                    className="btn-secondary inline-flex items-center gap-3"
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
          <div className="container relative z-10 mx-auto px-8 lg:px-16">
            <div className="mx-auto">
              {/* Technologies */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="mb-20"
              >
                <h2 className="text-4xl md:text-5xl font-display font-black mb-8 flex items-center gap-4">
                  <Tag className="w-10 h-10 text-accent-primary" />
                  {t.projects.detail.technologies}
                </h2>
                <div className="flex flex-wrap gap-3">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-5 py-2.5 text-base font-bold rounded-xl bg-surface border-2 border-surface-light text-text-secondary hover:border-accent-primary hover:text-accent-primary hover:bg-surface-light transition-all duration-300"
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
                className="mb-20"
              >
                <h2 className="text-4xl md:text-5xl font-display font-black mb-8">
                  Overview
                </h2>
                <div className="prose prose-invert max-w-none">
                  {project.longDescription
                    .split("\n\n")
                    .map((paragraph, index) => (
                      <p
                        key={index}
                        className="text-lg text-text-secondary leading-relaxed mb-6"
                      >
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
                  className="mb-20"
                >
                  <h2 className="text-4xl md:text-5xl font-display font-black mb-8">
                    {t.projects.detail.challenges}
                  </h2>
                  <ul className="space-y-4">
                    {project.challenges.map((challenge, index) => (
                      <li key={index} className="card flex gap-4 p-6">
                        <span className="text-accent-secondary font-bold text-2xl">
                          ⚠️
                        </span>
                        <span className="text-text-secondary text-base leading-relaxed">
                          {challenge}
                        </span>
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
                  className="mb-20"
                >
                  <h2 className="text-4xl md:text-5xl font-display font-black mb-8">
                    {t.projects.detail.solutions}
                  </h2>
                  <ul className="space-y-4">
                    {project.solutions.map((solution, index) => (
                      <li key={index} className="card flex gap-4 p-6">
                        <span className="text-accent-primary font-bold text-2xl">
                          ✅
                        </span>
                        <span className="text-text-secondary text-base leading-relaxed">
                          {solution}
                        </span>
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
                  className="mb-20"
                >
                  <h2 className="text-4xl md:text-5xl font-display font-black mb-8">
                    {t.projects.detail.impact}
                  </h2>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {project.impact.map((item, index) => (
                      <div
                        key={index}
                        className="card p-8 hover:border-accent-primary/50 transition-all duration-300"
                      >
                        <div className="text-5xl mb-4">📈</div>
                        <p className="text-text-secondary text-base leading-relaxed">
                          {item}
                        </p>
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
                  className="mb-20"
                >
                  <div className="card p-10 border-l-8 border-accent-primary">
                    <p className="text-2xl text-text-secondary italic mb-6 leading-relaxed">
                      "{project.testimonial.quote}"
                    </p>
                    <div className="flex items-center gap-4">
                      <div>
                        <div className="font-bold text-text-primary text-lg">
                          {project.testimonial.author}
                        </div>
                        <div className="text-base text-text-muted font-medium">
                          {project.testimonial.role}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* CTA */}
              <CTA variant="project" />
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
