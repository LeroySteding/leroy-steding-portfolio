"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { techStack } from "@/data/techStack";
import { useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { useLanguage } from "@/contexts/LanguageContext";

export default function TechStack() {
  const t = useTranslation();
  const { language } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const displayTechnologies = selectedCategory
    ? techStack.find(cat => cat.name === selectedCategory)?.technologies || []
    : techStack.flatMap(cat => cat.technologies);

  return (
    <section id="skills" className="section relative bg-tertiary-bg overflow-hidden">
      {/* Subtle accent line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-accent-secondary to-transparent" />

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
            {t.techStack.title} <span className="text-gradient">{t.techStack.titleHighlight}</span>
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="w-32 h-2 bg-accent-secondary rounded-full mb-8"
          />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-xl text-text-secondary max-w-3xl"
          >
            {t.techStack.description}
          </motion.p>
        </div>

        {/* Category filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="flex flex-wrap gap-4 mb-16"
        >
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-8 py-4 rounded-lg font-bold text-lg transition-all duration-300 ${
              selectedCategory === null
                ? "btn-primary"
                : "btn-secondary"
            }`}
          >
            {t.techStack.all}
          </button>
          {techStack.map((category) => (
            <button
              key={category.name}
              onClick={() => setSelectedCategory(category.name)}
              className={`px-8 py-4 rounded-lg font-bold text-lg transition-all duration-300 flex items-center gap-3 ${
                selectedCategory === category.name
                  ? "btn-primary"
                  : "btn-secondary"
              }`}
            >
              <span className="text-2xl">{category.icon}</span>
              <span>{language === 'nl' ? category.nameNL : category.name}</span>
            </button>
          ))}
        </motion.div>

        {/* Technologies grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 mb-16">
          {(selectedCategory 
            ? techStack.filter(cat => cat.name === selectedCategory)
            : techStack
          ).map((category) => (
            category.technologies.map((tech, index) => (
              <motion.div
                key={`${category.name}-${tech.name}`}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.03 }}
                viewport={{ once: true }}
                className="card group p-6 flex flex-col items-center justify-center gap-4 cursor-pointer"
              >
                {/* Tech icon */}
                <div className="relative w-16 h-16 flex items-center justify-center">
                  {tech.icon.startsWith('http') ? (
                    <Image
                      src={tech.icon}
                      alt={tech.name}
                      width={64}
                      height={64}
                      className="object-contain group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <span className="text-5xl">{tech.icon}</span>
                  )}
                </div>

                {/* Tech name */}
                <h3 className="text-base font-bold text-text-primary text-center group-hover:text-accent-primary transition-colors">
                  {tech.name}
                </h3>

                {/* Proficiency bar */}
                <div className="w-full bg-surface rounded-full h-2 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${tech.proficiency}%` }}
                    transition={{ duration: 0.8, delay: index * 0.03 }}
                    viewport={{ once: true }}
                    className="h-full bg-gradient-to-r from-accent-primary to-accent-secondary rounded-full"
                  />
                </div>

                {/* Proficiency percentage */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="px-3 py-1.5 text-sm font-bold rounded-full bg-accent-primary text-primary-bg">
                    {tech.proficiency}%
                  </span>
                </div>
              </motion.div>
            ))
          ))}
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          <div className="card p-8 text-center">
            <div className="text-5xl font-black text-accent-primary mb-3">
              {techStack.flatMap(cat => cat.technologies).length}+
            </div>
            <div className="text-text-muted text-base font-semibold uppercase tracking-wide">Technologies</div>
          </div>
          <div className="card p-8 text-center">
            <div className="text-5xl font-black text-accent-secondary mb-3">
              {techStack.length}
            </div>
            <div className="text-text-muted text-base font-semibold uppercase tracking-wide">Categories</div>
          </div>
          <div className="card p-8 text-center">
            <div className="text-5xl font-black text-accent-primary mb-3">
              12+
            </div>
            <div className="text-text-muted text-base font-semibold uppercase tracking-wide">{t.techStack.stats.experience}</div>
          </div>
          <div className="card p-8 text-center">
            <div className="text-5xl font-black text-accent-secondary mb-3">
              100+
            </div>
            <div className="text-text-muted text-base font-semibold uppercase tracking-wide">{t.techStack.stats.projects}</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
