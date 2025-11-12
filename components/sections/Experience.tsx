"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Briefcase, Calendar, ArrowRight, MapPin } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { useLanguage } from "@/contexts/LanguageContext";
import { getExperiences } from "@/utils/getLocalizedData";

export default function Experience() {
  const t = useTranslation();
  const { language } = useLanguage();
  const experiences = getExperiences(language);
  const targetRef = useRef<HTMLDivElement>(null);
  
  // Show top 7 experiences on homepage
  const displayExperiences = experiences.slice(0, 7);

  // Scroll-linked horizontal animation (right to left)
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  // Calculate horizontal translation - start from right (positive) and move left (negative)
  // Reduced multiplier so cards appear sooner and scroll faster
  const x = useTransform(
    scrollYProgress,
    [0, 1],
    ["50%", `-${displayExperiences.length * 100}%`]
  );

  return (
    <>
      {/* Section header */}
      <section className="relative py-24 bg-cyber-black">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-neon-violet to-transparent" />
        
        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-4xl sm:text-5xl font-display font-bold mb-4"
            >
              {t.experience.title} <span className="bg-gradient-to-r from-neon-violet to-neon-cyan bg-clip-text text-transparent">{t.experience.titleHighlight}</span>
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              whileInView={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="w-24 h-1 bg-gradient-to-r from-neon-violet to-neon-cyan mx-auto rounded-full"
            />
          </div>
        </div>
      </section>

      {/* Horizontal Scrolling Timeline - Scroll-jacking section */}
      <section 
        ref={targetRef} 
        className="relative bg-cyber-black" 
        style={{ height: `${displayExperiences.length * 60}vh` }}
      >
        <div className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden py-12">
          {/* Timeline Line - Horizontal */}
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-neon-cyan via-neon-violet to-neon-cyan opacity-30 z-0" />
          
          {/* Scrolling Cards Container */}
          <motion.div 
            style={{ x }}
            className="flex gap-16 px-16 relative z-10"
          >
            {displayExperiences.map((exp, index) => (
              <motion.div
                key={exp.id}
                className="flex-shrink-0 w-[600px] relative"
              >
                {/* Timeline Dot */}
                <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 z-20">
                  <div className={`w-6 h-6 rounded-full bg-neon-${exp.color} border-4 border-cyber-black shadow-lg shadow-neon-${exp.color}/50 animate-glow-pulse`} />
                </div>

                {/* Experience Card */}
                <Link href={`/experience/${exp.id}`}>
                  <div className={`relative h-full p-8 rounded-2xl bg-gradient-to-br from-cyber-darker to-cyber-black border-2 border-neon-${exp.color}/30 glass hover:border-neon-${exp.color}/70 transition-all duration-500 group hover:scale-105 hover:shadow-2xl hover:shadow-neon-${exp.color}/20 cursor-pointer`}>
                    
                    {/* Company Logo - Top Right */}
                    {exp.companyLogo && (
                      <div className="absolute top-4 right-4 w-16 h-16 rounded-lg bg-white/95 backdrop-blur-sm border border-cyber-gray-light shadow-lg p-2 group-hover:scale-110 transition-transform duration-300 z-20 flex items-center justify-center">
                        {exp.companyLogo.startsWith('/') ? (
                          <Image
                            src={exp.companyLogo}
                            alt={`${exp.company} logo`}
                            width={48}
                            height={48}
                            unoptimized
                            className="object-contain w-full h-full"
                          />
                        ) : (
                          <span className="text-3xl">{exp.companyLogo}</span>
                        )}
                      </div>
                    )}

                    {/* Header Section */}
                    <div className="mb-6 pr-20">
                      <div className="flex items-center gap-3 mb-3">
                        <Calendar className={`w-5 h-5 text-neon-${exp.color} flex-shrink-0`} />
                        <span className={`text-sm font-bold text-neon-${exp.color} uppercase tracking-wide`}>
                          {exp.period}
                        </span>
                      </div>
                      
                      <h3 className="text-3xl font-display font-bold mb-2 text-text-primary group-hover:text-neon-cyan transition-colors leading-tight">
                        {exp.title}
                      </h3>
                      
                      <h4 className={`text-xl font-semibold text-neon-${exp.color} mb-2 flex items-center gap-2`}>
                        <Briefcase className="w-5 h-5" />
                        {exp.company}
                      </h4>

                      {exp.location && (
                        <p className="flex items-center gap-2 text-text-secondary text-sm">
                          <MapPin className="w-4 h-4" />
                          {exp.location}
                        </p>
                      )}
                    </div>
                    
                    {/* Description */}
                    <p className="text-text-secondary mb-6 leading-relaxed text-base">
                      {exp.description}
                    </p>

                    {/* Key Achievements */}
                    {exp.achievements && exp.achievements.length > 0 && (
                      <div className="mb-6">
                        <h5 className="text-sm font-bold text-text-primary mb-3 uppercase tracking-wide">Key Achievements</h5>
                        <ul className="space-y-2">
                          {exp.achievements.slice(0, 3).map((achievement, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                              <span className={`text-neon-${exp.color} mt-1 flex-shrink-0`}>▸</span>
                              <span>{achievement}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {/* Technologies */}
                    <div className="mb-6">
                      <h5 className="text-sm font-bold text-text-primary mb-3 uppercase tracking-wide">Technologies</h5>
                      <div className="flex flex-wrap gap-2">
                        {exp.technologies.slice(0, 6).map((tech) => (
                          <span
                            key={tech}
                            className={`px-4 py-2 text-xs font-semibold rounded-lg bg-neon-${exp.color}/10 text-neon-${exp.color} border border-neon-${exp.color}/30 hover:bg-neon-${exp.color}/20 transition-colors`}
                          >
                            {tech}
                          </span>
                        ))}
                        {exp.technologies.length > 6 && (
                          <span className={`px-4 py-2 text-xs font-semibold rounded-lg bg-neon-${exp.color}/10 text-neon-${exp.color} border border-neon-${exp.color}/30`}>
                            +{exp.technologies.length - 6} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* View Details Link */}
                    <div className="flex items-center gap-2 text-neon-${exp.color} text-sm font-bold group-hover:gap-4 transition-all duration-300 pt-4 border-t border-cyber-gray-light">
                      <span>{t.experience.viewDetails}</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                    </div>
                  </div>
                </Link>

                {/* Card Number/Index */}
                <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-cyber-black border-2 border-neon-${exp.color} flex items-center justify-center text-neon-${exp.color} font-bold text-lg shadow-lg z-20">
                  {String(index + 1).padStart(2, '0')}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Scroll Progress Indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 text-text-secondary z-10">
            <div className="flex items-center gap-2">
              <ArrowRight className="w-4 h-4 animate-pulse" />
              <span className="text-sm font-medium">Scroll to explore timeline</span>
            </div>
            <div className="w-32 h-1 bg-cyber-gray-light rounded-full overflow-hidden">
              <motion.div 
                style={{ scaleX: scrollYProgress }}
                className="h-full bg-gradient-to-r from-neon-violet to-neon-cyan origin-left"
              />
            </div>
          </div>
        </div>
      </section>

      {/* View All CTA */}
      {experiences.length > 7 && (
        <section className="relative py-24 bg-cyber-black">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <p className="text-text-secondary mb-6 text-lg">
                {t.experience.viewAll.text}
              </p>
              <Link
                href="/experience"
                className="inline-flex items-center gap-2 px-8 py-4 text-lg font-semibold text-text-primary bg-cyber-gray hover:bg-cyber-gray-light border-2 border-neon-cyan rounded-lg transition-all duration-300 hover:scale-105"
              >
                {t.experience.viewAll.button}
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </div>
        </section>
      )}
    </>
  );
}
