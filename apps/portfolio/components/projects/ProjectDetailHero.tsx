"use client";

import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Users,
  ExternalLink,
  Github,
  CheckCircle,
  Activity,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface ProjectDetailHeroProps {
  title: string;
  tagline: string;
  description: string;
  coverImage?: string;
  category: "product" | "client" | "internal";
  technologies: string[];
  stats: {
    timeline?: string;
    teamSize?: string;
    status: "live" | "in-progress" | "completed" | "archived";
    year: number;
  };
  links?: {
    live?: string;
    github?: string;
    caseStudy?: string;
  };
  categoryLabels: Record<string, string>;
  backToProjectsLabel: string;
  locale: string;
}

export default function ProjectDetailHero({
  title,
  tagline,
  description,
  coverImage,
  category,
  technologies,
  stats,
  links,
  categoryLabels,
  backToProjectsLabel,
  locale,
}: ProjectDetailHeroProps) {
  const statusConfig = {
    live: { label: "Live", color: "bg-green-500", icon: CheckCircle },
    "in-progress": { label: "In Progress", color: "bg-yellow-500", icon: Activity },
    completed: { label: "Completed", color: "bg-blue-500", icon: CheckCircle },
    archived: { label: "Archived", color: "bg-gray-500", icon: CheckCircle },
  };

  const statusInfo = statusConfig[stats.status];
  const StatusIcon = statusInfo.icon;

  return (
    <section className="relative min-h-[90vh] flex items-end overflow-hidden">
      {/* Hero Background Image */}
      {coverImage ? (
        <div className="absolute inset-0">
          <Image
            src={coverImage}
            alt={title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-primary-bg/40 via-primary-bg/70 to-primary-bg" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-bg/60 to-transparent" />
        </div>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/20 via-secondary-bg to-accent-secondary/20" />
      )}

      {/* Top Bar with gradient */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent-primary via-accent-secondary to-accent-primary" />

      {/* Content */}
      <div className="relative z-10 w-full px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 pb-16 pt-32">
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <Link
              href={locale === "nl" ? "/projects" : "/en/projects"}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl backdrop-blur-sm bg-surface/50 hover:bg-surface text-text-secondary hover:text-accent-primary transition-all font-bold border-2 border-transparent hover:border-accent-primary/30"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{backToProjectsLabel}</span>
            </Link>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-end">
            {/* Left: Project Info */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >
              {/* Category Badge */}
              <div className="flex items-center gap-4">
                <span className="px-4 py-2 rounded-xl bg-accent-primary/20 backdrop-blur-sm border-2 border-accent-primary text-accent-primary text-sm font-bold">
                  {categoryLabels[category]}
                </span>
                <div className={`flex items-center gap-2 px-4 py-2 rounded-xl backdrop-blur-sm ${statusInfo.color}/20 border-2 border-${statusInfo.color} text-sm font-bold`}>
                  <StatusIcon className="w-4 h-4" />
                  <span>{statusInfo.label}</span>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-display font-black leading-none text-gradient">
                {title}
              </h1>

              {/* Tagline */}
              <p className="text-2xl sm:text-3xl font-display font-bold text-accent-primary">
                {tagline}
              </p>

              {/* Description */}
              <p className="text-xl text-text-secondary leading-relaxed max-w-2xl">
                {description}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 pt-4">
                {links?.live && (
                  <Link
                    href={links.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary inline-flex items-center gap-3 group"
                  >
                    <ExternalLink className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <span>View Live Site</span>
                  </Link>
                )}
                {links?.github && (
                  <Link
                    href={links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary inline-flex items-center gap-3 group"
                  >
                    <Github className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                    <span>View Code</span>
                  </Link>
                )}
              </div>
            </motion.div>

            {/* Right: Stats & Tech Stack */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="space-y-6"
            >
              {/* Quick Stats */}
              <div className="card p-6 backdrop-blur-md bg-surface/50 border-2 border-surface-light">
                <h3 className="text-lg font-bold text-text-primary mb-4">
                  Quick Facts
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-accent-primary flex-shrink-0 mt-1" />
                    <div>
                      <div className="text-sm text-text-muted font-bold uppercase tracking-wider">
                        Year
                      </div>
                      <div className="text-lg font-bold text-text-primary">
                        {stats.year}
                      </div>
                    </div>
                  </div>

                  {stats.timeline && (
                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-accent-primary flex-shrink-0 mt-1" />
                      <div>
                        <div className="text-sm text-text-muted font-bold uppercase tracking-wider">
                          Timeline
                        </div>
                        <div className="text-lg font-bold text-text-primary">
                          {stats.timeline}
                        </div>
                      </div>
                    </div>
                  )}

                  {stats.teamSize && (
                    <div className="flex items-start gap-3">
                      <Users className="w-5 h-5 text-accent-primary flex-shrink-0 mt-1" />
                      <div>
                        <div className="text-sm text-text-muted font-bold uppercase tracking-wider">
                          Team
                        </div>
                        <div className="text-lg font-bold text-text-primary">
                          {stats.teamSize}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Tech Stack Badges */}
              <div className="card p-6 backdrop-blur-md bg-surface/50 border-2 border-surface-light">
                <h3 className="text-lg font-bold text-text-primary mb-4">
                  Tech Stack
                </h3>
                <div className="flex flex-wrap gap-2">
                  {technologies.slice(0, 8).map((tech, i) => (
                    <motion.span
                      key={tech}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.6 + i * 0.05 }}
                      className="px-3 py-1.5 text-sm font-bold rounded-lg bg-surface text-text-secondary border-2 border-surface-light hover:border-accent-primary hover:text-accent-primary transition-all"
                    >
                      {tech}
                    </motion.span>
                  ))}
                  {technologies.length > 8 && (
                    <span className="px-3 py-1.5 text-sm font-bold rounded-lg bg-accent-primary/20 text-accent-primary">
                      +{technologies.length - 8} more
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
