"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Calendar, MapPin, Users, Briefcase, Target, TrendingUp } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { getExperienceById } from "@/utils/getLocalizedData";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "@/hooks/useTranslation";
import MetaTags from "@/components/seo/MetaTags";

export default function ExperienceDetailPage() {
  const params = useParams();
  const { language } = useLanguage();
  const t = useTranslation();
  const experience = getExperienceById(params.id as string, language);

  const pageTitle = experience
    ? `${experience.title} at ${experience.company} | Leroy Steding`
    : t.experience.detail.notFound;
  const pageDescription = experience?.description || "";
  const pageUrl = `https://leroysteding.nl/experience/${params.id}`;

  if (!experience) {
    return (
      <div className="min-h-screen bg-cyber-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-display font-bold text-text-primary mb-4">
            {t.experience.detail.notFound}
          </h1>
          <Link
            href="/#experience"
            className="inline-flex items-center gap-2 text-neon-cyan hover:text-neon-violet transition-colors"
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
      <div className="min-h-screen bg-cyber-black">
      {/* Hero Section */}
      <section className="relative py-32 bg-cyber-darker overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-full h-full opacity-30">
          <div className={`absolute top-1/4 -left-48 w-96 h-96 bg-neon-${experience.color}/20 rounded-full blur-3xl`} />
          <div className={`absolute bottom-1/4 -right-48 w-96 h-96 bg-neon-${experience.color === 'cyan' ? 'violet' : 'cyan'}/20 rounded-full blur-3xl`} />
        </div>

        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link
              href="/#experience"
              className="inline-flex items-center gap-2 text-text-secondary hover:text-neon-cyan transition-colors mb-8"
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
                <div className="mb-8">
                  <div className="inline-block p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-cyber-gray-light">
                    {experience.companyLogo.startsWith('/') ? (
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

              <div className="flex flex-wrap items-center gap-4 mb-4">
                <div className="flex items-center gap-2 text-text-secondary">
                  <Calendar className="w-4 h-4" />
                  <span>{experience.period}</span>
                </div>
                <div className="flex items-center gap-2 text-text-secondary">
                  <MapPin className="w-4 h-4" />
                  <span>{experience.location}</span>
                </div>
                {experience.teamSize && (
                  <div className="flex items-center gap-2 text-text-secondary">
                    <Users className="w-4 h-4" />
                    <span>Team: {experience.teamSize}</span>
                  </div>
                )}
              </div>
              
              <h1 className="text-5xl sm:text-6xl font-display font-bold mb-4">
                {experience.title}
              </h1>
              
              <h2 className={`text-3xl font-display font-semibold mb-6 text-neon-${experience.color}`}>
                {experience.company}
              </h2>
              
              <p className="text-xl text-text-secondary leading-relaxed">
                {experience.description}
              </p>
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
                <Briefcase className={`w-8 h-8 text-neon-${experience.color}`} />
                {t.experience.detail.technologies}
              </h2>
              <div className="flex flex-wrap gap-3">
                {experience.technologies.map((tech) => (
                  <span
                    key={tech}
                    className={`px-4 py-2 text-sm font-semibold rounded-lg bg-cyber-darker border border-cyber-gray-light text-text-secondary hover:border-neon-${experience.color} hover:text-neon-${experience.color} transition-all duration-300`}
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
              <h2 className="text-3xl font-display font-bold mb-6">{t.experience.detail.aboutRole}</h2>
              <div className="prose prose-invert max-w-none">
                {experience.longDescription.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="text-text-secondary leading-relaxed mb-4">
                    {paragraph}
                  </p>
                ))}
              </div>
            </motion.div>

            {/* Responsibilities */}
            {experience.responsibilities && experience.responsibilities.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="mb-16"
              >
                <h2 className="text-3xl font-display font-bold mb-6 flex items-center gap-3">
                  <Target className={`w-8 h-8 text-neon-${experience.color}`} />
                  {t.experience.detail.responsibilities}
                </h2>
                <ul className="space-y-4">
                  {experience.responsibilities.map((responsibility, index) => (
                    <li
                      key={index}
                      className="flex gap-4 p-4 rounded-lg bg-cyber-darker border border-cyber-gray-light"
                    >
                      <span className={`text-neon-${experience.color} font-bold text-xl`}>✓</span>
                      <span className="text-text-secondary">{responsibility}</span>
                    </li>
                  ))}
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
                className="mb-16"
              >
                <h2 className="text-3xl font-display font-bold mb-6">Highlights</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {experience.highlights.map((highlight, index) => (
                    <div
                      key={index}
                      className={`p-6 rounded-xl bg-gradient-to-br from-neon-${experience.color}/10 to-neon-${experience.color === 'cyan' ? 'violet' : 'cyan'}/10 border border-cyber-gray-light hover:border-neon-${experience.color}/50 transition-all duration-300`}
                    >
                      <div className="text-3xl mb-2">⭐</div>
                      <p className="text-text-secondary">{highlight}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Achievements */}
            {experience.achievements && experience.achievements.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="mb-16"
              >
                <h2 className="text-3xl font-display font-bold mb-6 flex items-center gap-3">
                  <TrendingUp className={`w-8 h-8 text-neon-${experience.color}`} />
                  {t.experience.detail.achievements}
                </h2>
                <ul className="space-y-4">
                  {experience.achievements.map((achievement, index) => (
                    <li
                      key={index}
                      className="flex gap-4 p-4 rounded-lg bg-cyber-darker border border-cyber-gray-light"
                    >
                      <span className={`text-neon-${experience.color} font-bold text-xl`}>🏆</span>
                      <span className="text-text-secondary">{achievement}</span>
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
                className="mb-16"
              >
                <h2 className="text-3xl font-display font-bold mb-6">{t.experience.detail.impact}</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {experience.impact.map((item, index) => (
                    <div
                      key={index}
                      className={`p-6 rounded-xl bg-gradient-to-br from-neon-${experience.color}/10 to-neon-${experience.color === 'cyan' ? 'violet' : 'cyan'}/10 border border-cyber-gray-light hover:border-neon-${experience.color}/50 transition-all duration-300`}
                    >
                      <div className="text-4xl mb-2">📈</div>
                      <p className="text-text-secondary">{item}</p>
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
              className="text-center p-8 rounded-xl bg-gradient-to-r from-neon-violet/10 to-neon-cyan/10 border border-cyber-gray-light"
            >
              <h3 className="text-2xl font-display font-bold mb-4">
                {t.experience.detail.cta.title}
              </h3>
              <p className="text-text-secondary mb-6">
                {t.experience.detail.cta.subtitle}
              </p>
              <Link
                href="/#contact"
                className={`inline-flex items-center gap-2 px-8 py-4 bg-neon-${experience.color} text-cyber-black font-semibold rounded-lg hover:scale-105 transition-transform duration-200`}
              >
                {t.experience.detail.cta.button}
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
    </>
  );
}
