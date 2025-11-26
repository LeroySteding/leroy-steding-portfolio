"use client";

import { motion } from "framer-motion";
import {
  ArrowLeft,
  Briefcase,
  Calendar,
  MapPin,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import MetaTags from "@/components/seo/MetaTags";
import CTA from "@/components/ui/CTA";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "@/hooks/useTranslation";
import { getExperienceById } from "@/utils/getLocalizedData";

export default function ExperienceDetailPage() {
  const params = useParams();
  const { language } = useLanguage();
  const t = useTranslation();
  const experience = getExperienceById(params.id as string, language);

  const pageTitle = experience
    ? `${experience.title} at ${experience.company} | STEDING.`
    : t.experience.detail.notFound;
  const pageDescription = experience?.description || "";
  const pageUrl = `https://leroysteding.nl/experience/${params.id}`;

  if (!experience) {
    return (
      <div className="min-h-screen bg-primary-bg flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-display font-bold text-text-primary mb-4">
            {t.experience.detail.notFound}
          </h1>
          <Link
            href="/#experience"
            className="inline-flex items-center gap-2 text-accent-primary hover:text-accent-hover transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {t.experience.detail.backToExperience}
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
        keywords={experience?.technologies || []}
      />
      <div className="min-h-screen bg-primary-bg">
        {/* Hero Section */}
        <section className="relative py-32 bg-secondary-bg overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 left-0 w-full h-full opacity-20">
            <div className="absolute top-1/4 -left-48 w-96 h-96 bg-accent-primary/30 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-accent-secondary/30 rounded-full blur-3xl" />
          </div>

          <div className="container relative z-10 mx-auto px-8 lg:px-16">
            {/* Back button */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Link
                href="/#experience"
                className="inline-flex items-center gap-2 text-text-secondary hover:text-accent-primary transition-colors mb-8 font-semibold"
              >
                <ArrowLeft className="w-4 h-4" />
                {t.experience.detail.backToExperience}
              </Link>
            </motion.div>

            {/* Experience Header */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-6"
              >
                {/* Company Logo */}
                {experience.companyLogo && (
                  <div className="mb-10">
                    <div className="inline-block p-6 rounded-2xl bg-surface/50 backdrop-blur-sm border-2 border-surface-light">
                      {experience.companyLogo.startsWith("/") ? (
                        <Image
                          src={experience.companyLogo}
                          alt={`${experience.company} logo`}
                          width={120}
                          height={120}
                          unoptimized
                          className="rounded-xl object-contain"
                        />
                      ) : (
                        <span className="text-8xl block w-[120px] h-[120px] flex items-center justify-center">
                          {experience.companyLogo}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-4 mb-6">
                  <div className="flex items-center gap-2 text-text-secondary font-semibold">
                    <Calendar className="w-5 h-5" />
                    <span className="text-base">{experience.period}</span>
                  </div>
                  <div className="flex items-center gap-2 text-text-secondary font-semibold">
                    <MapPin className="w-5 h-5" />
                    <span className="text-base">{experience.location}</span>
                  </div>
                  {experience.teamSize && (
                    <div className="flex items-center gap-2 text-text-secondary font-semibold">
                      <Users className="w-5 h-5" />
                      <span className="text-base">
                        Team: {experience.teamSize}
                      </span>
                    </div>
                  )}
                </div>

                <h1 className="text-6xl sm:text-7xl lg:text-8xl font-display font-black mb-6 leading-none">
                  {experience.title}
                </h1>

                <h2 className="text-4xl sm:text-5xl font-display font-bold mb-8 text-accent-primary">
                  {experience.company}
                </h2>

                <p className="text-xl sm:text-2xl text-text-secondary leading-relaxed max-w-4xl">
                  {experience.description}
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-24">
          <div className="container mx-auto px-8 lg:px-16">
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
                  <Briefcase className="w-10 h-10 text-accent-primary" />
                  {t.experience.detail.technologies}
                </h2>
                <div className="flex flex-wrap gap-3">
                  {experience.technologies.map((tech) => (
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
                  {t.experience.detail.aboutRole}
                </h2>
                <div className="prose prose-invert max-w-none">
                  {experience.longDescription
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

              {/* Responsibilities */}
              {experience.responsibilities &&
                experience.responsibilities.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="mb-20"
                  >
                    <h2 className="text-4xl md:text-5xl font-display font-black mb-8 flex items-center gap-4">
                      <Target className="w-10 h-10 text-accent-primary" />
                      {t.experience.detail.responsibilities}
                    </h2>
                    <ul className="space-y-4">
                      {experience.responsibilities.map(
                        (responsibility, index) => (
                          <li key={index} className="card flex gap-4 p-6">
                            <span className="text-accent-primary font-bold text-2xl">
                              ✓
                            </span>
                            <span className="text-text-secondary text-base leading-relaxed">
                              {responsibility}
                            </span>
                          </li>
                        ),
                      )}
                    </ul>
                  </motion.div>
                )}

              {/* Highlights */}
              {experience.highlights && experience.highlights.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                  className="mb-20"
                >
                  <h2 className="text-4xl md:text-5xl font-display font-black mb-8">
                    Highlights
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-6">
                    {experience.highlights.map((highlight, index) => (
                      <div
                        key={index}
                        className="card p-8 hover:border-accent-primary/50 transition-all duration-300"
                      >
                        <div className="text-4xl mb-4">⭐</div>
                        <p className="text-text-secondary text-base leading-relaxed">
                          {highlight}
                        </p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Achievements */}
              {experience.achievements &&
                experience.achievements.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="mb-20"
                  >
                    <h2 className="text-4xl md:text-5xl font-display font-black mb-8 flex items-center gap-4">
                      <TrendingUp className="w-10 h-10 text-accent-primary" />
                      {t.experience.detail.achievements}
                    </h2>
                    <ul className="space-y-4">
                      {experience.achievements.map((achievement, index) => (
                        <li key={index} className="card flex gap-4 p-6">
                          <span className="text-accent-secondary font-bold text-2xl">
                            🏆
                          </span>
                          <span className="text-text-secondary text-base leading-relaxed">
                            {achievement}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}

              {/* Impact */}
              {experience.impact && experience.impact.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                  className="mb-20"
                >
                  <h2 className="text-4xl md:text-5xl font-display font-black mb-8">
                    {t.experience.detail.impact}
                  </h2>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {experience.impact.map((item, index) => (
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

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <CTA
                  variant="contact"
                  title={t.experience.detail.cta.title}
                  description={t.experience.detail.cta.subtitle}
                />
              </motion.div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
