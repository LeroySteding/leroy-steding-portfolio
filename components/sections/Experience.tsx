"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Briefcase, Calendar, ArrowRight } from "lucide-react";
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

  // Scroll-linked horizontal animation
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  // Calculate how far to move items horizontally as you scroll vertically
  const x = useTransform(
    scrollYProgress,
    [0, 1],
    ["1%", `-${(displayExperiences.length - 1) * 100}%`]
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
        style={{ height: `${displayExperiences.length * 100}vh` }}
      >
        <div className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden">
          <motion.div 
            style={{ x }}
            className="flex gap-8 px-8"
          >
            {displayExperiences.map((exp) => (
              <motion.div
                key={exp.id}
                className="flex-shrink-0 w-[400px]"
              >
                <Link href={`/experience/${exp.id}`}>
                  <div className={`h-full p-6 rounded-xl bg-cyber-darker border border-cyber-gray-light glass hover:border-neon-${exp.color}/50 transition-all duration-300 group hover:scale-105 cursor-pointer relative`}>
                    {/* Company Logo */}
                    {exp.companyLogo && exp.companyLogo.startsWith('/logos/') && (
                      <div className="absolute top-4 right-4 w-16 h-16 rounded-lg bg-white/5 backdrop-blur-sm border border-cyber-gray-light p-2">
                        <Image
                          src={exp.companyLogo}
                          alt={`${exp.company} logo`}
                          width={48}
                          height={48}
                          unoptimized
                          className="rounded object-contain w-full h-full"
                        />
                      </div>
                    )}

                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className={`w-4 h-4 text-neon-${exp.color}`} />
                      <span className={`text-sm font-semibold text-neon-${exp.color}`}>
                        {exp.period}
                      </span>
                    </div>
                    
                    <h3 className="text-2xl font-display font-bold mb-1 text-text-primary group-hover:text-neon-cyan transition-colors pr-20">
                      {exp.title}
                    </h3>
                    
                    <h4 className={`text-lg font-semibold text-neon-${exp.color} mb-3`}>
                      {exp.company}
                    </h4>
                    
                    <p className="text-text-secondary mb-4 leading-relaxed line-clamp-3">
                      {exp.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {exp.technologies.slice(0, 3).map((tech) => (
                        <span
                          key={tech}
                          className={`px-3 py-1 text-xs font-semibold rounded-full bg-neon-${exp.color}/10 text-neon-${exp.color} border border-neon-${exp.color}/20`}
                        >
                          {tech}
                        </span>
                      ))}
                      {exp.technologies.length > 3 && (
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full bg-neon-${exp.color}/10 text-neon-${exp.color} border border-neon-${exp.color}/20`}>
                          +{exp.technologies.length - 3}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-neon-${exp.color} text-sm font-semibold">
                      {t.experience.viewDetails}
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 flex justify-center items-center gap-2 text-text-secondary text-sm">
            <ArrowRight className="w-4 h-4 animate-pulse" />
            <span>Scroll to explore timeline</span>
          </div>
        </div>
      </section>

      {/* Vertical Timeline (Original) */}
      <section className="relative py-24 bg-cyber-black">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-neon-cyan via-neon-violet to-neon-cyan" />

            {/* Timeline items */}
            <div className="space-y-12">
              {displayExperiences.map((exp, index) => (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className={`relative flex ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-8`}
                >
                  {/* Content */}
                  <div className={`flex-1 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                    <Link href={`/experience/${exp.id}`}>
                      <div className={`ml-16 md:ml-0 p-6 rounded-xl bg-cyber-darker border border-cyber-gray-light glass hover:border-neon-${exp.color}/50 transition-all duration-300 group hover:scale-105 cursor-pointer relative`}>
                        {/* Company Logo */}
                        {exp.companyLogo && exp.companyLogo.startsWith('/logos/') && (
                          <div className={`absolute top-4 ${index % 2 === 0 ? 'md:left-4' : 'md:right-4'} right-4 w-16 h-16 rounded-lg bg-white/5 backdrop-blur-sm border border-cyber-gray-light p-2`}>
                            <Image
                              src={exp.companyLogo}
                              alt={`${exp.company} logo`}
                              width={48}
                              height={48}
                              unoptimized
                              className="rounded object-contain w-full h-full"
                            />
                          </div>
                        )}

                        <div className={`flex items-center gap-2 mb-2 ${index % 2 === 0 ? 'md:justify-end' : 'md:justify-start'}`}>
                          <Calendar className={`w-4 h-4 text-neon-${exp.color}`} />
                          <span className={`text-sm font-semibold text-neon-${exp.color}`}>
                            {exp.period}
                          </span>
                        </div>
                        
                        <h3 className={`text-2xl font-display font-bold mb-1 text-text-primary group-hover:text-neon-cyan transition-colors ${exp.companyLogo && exp.companyLogo.startsWith('/logos/') ? 'pr-20' : ''}`}>
                          {exp.title}
                        </h3>
                        
                        <h4 className={`text-lg font-semibold text-neon-${exp.color} mb-3`}>
                          {exp.company}
                        </h4>
                        
                        <p className="text-text-secondary mb-4 leading-relaxed">
                          {exp.description}
                        </p>
                        
                        <div className={`flex flex-wrap gap-2 mb-4 ${index % 2 === 0 ? 'md:justify-end' : 'md:justify-start'}`}>
                          {exp.technologies.slice(0, 4).map((tech) => (
                            <span
                              key={tech}
                              className={`px-3 py-1 text-xs font-semibold rounded-full bg-neon-${exp.color}/10 text-neon-${exp.color} border border-neon-${exp.color}/20`}
                            >
                              {tech}
                            </span>
                          ))}
                          {exp.technologies.length > 4 && (
                            <span className={`px-3 py-1 text-xs font-semibold rounded-full bg-neon-${exp.color}/10 text-neon-${exp.color} border border-neon-${exp.color}/20`}>
                              +{exp.technologies.length - 4} more
                            </span>
                          )}
                        </div>

                        {/* View Details Link */}
                        <div className={`flex items-center gap-2 text-neon-${exp.color} text-sm font-semibold ${index % 2 === 0 ? 'md:justify-end' : 'md:justify-start'}`}>
                          {t.experience.viewDetails}
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                        </div>
                      </div>
                    </Link>
                  </div>

                  {/* Timeline dot */}
                  <div className={`absolute left-8 md:left-1/2 md:-translate-x-1/2 w-16 h-16 rounded-full bg-cyber-dark border-4 border-neon-${exp.color} flex items-center justify-center hover:scale-110 transition-transform duration-300`}>
                    <div className={`w-8 h-8 rounded-full bg-neon-${exp.color} flex items-center justify-center animate-glow-pulse`}>
                      <Briefcase className="w-4 h-4 text-cyber-black" />
                    </div>
                  </div>

                  {/* Spacer for alternating layout */}
                  <div className="flex-1 hidden md:block" />
                </motion.div>
              ))}
            </div>
          </div>

          {/* View All CTA */}
          {experiences.length > 7 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="mt-16 text-center"
            >
              <p className="text-text-secondary mb-6">
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
          )}
        </div>
      </section>
    </>
  );
}
