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
    <section id="skills" className="relative py-24 bg-cyber-darker overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-neon-cyan to-transparent" />
      
      {/* Gradient orbs */}
      <div className="absolute top-1/4 -right-48 w-96 h-96 bg-neon-cyan/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -left-48 w-96 h-96 bg-neon-violet/10 rounded-full blur-3xl" />

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
            {t.techStack.title} <span className="bg-gradient-to-r from-neon-cyan to-neon-violet bg-clip-text text-transparent">{t.techStack.titleHighlight}</span>
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="w-24 h-1 bg-gradient-to-r from-neon-cyan to-neon-violet mx-auto rounded-full mb-6"
          />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-text-secondary max-w-2xl mx-auto"
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
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
              selectedCategory === null
                ? "bg-neon-cyan text-cyber-black"
                : "bg-cyber-gray text-text-secondary hover:bg-cyber-gray-light"
            }`}
          >
            {t.techStack.all}
          </button>
          {techStack.map((category) => (
            <button
              key={category.name}
              onClick={() => setSelectedCategory(category.name)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 ${
                selectedCategory === category.name
                  ? "bg-neon-cyan text-cyber-black"
                  : "bg-cyber-gray text-text-secondary hover:bg-cyber-gray-light"
              }`}
            >
              <span>{category.icon}</span>
              <span>{language === 'nl' ? category.nameNL : category.name}</span>
            </button>
          ))}
        </motion.div>

        {/* Technologies grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {(selectedCategory 
            ? techStack.filter(cat => cat.name === selectedCategory)
            : techStack
          ).map((category) => (
            category.technologies.map((tech, index) => (
              <motion.div
                key={`${category.name}-${tech.name}`}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="group relative p-6 rounded-xl bg-cyber-dark border border-cyber-gray-light hover:border-neon-cyan/50 transition-all duration-300 flex flex-col items-center justify-center gap-3 cursor-pointer"
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
                <h3 className="text-sm font-semibold text-text-primary text-center group-hover:text-neon-cyan transition-colors">
                  {tech.name}
                </h3>

                {/* Proficiency bar */}
                <div className="w-full bg-cyber-gray-light rounded-full h-1.5 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${tech.proficiency}%` }}
                    transition={{ duration: 1, delay: index * 0.05 }}
                    viewport={{ once: true }}
                    className="h-full bg-gradient-to-r from-neon-cyan to-neon-violet rounded-full"
                  />
                </div>

                {/* Proficiency tooltip */}
                <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="px-2 py-1 text-xs font-bold rounded-full bg-neon-cyan text-cyber-black">
                    {tech.proficiency}%
                  </span>
                </div>

                {/* Glow effect on hover */}
                <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <div 
                    className="absolute inset-0 rounded-xl blur-xl" 
                    style={{ backgroundColor: `${tech.color}20` }}
                  />
                </div>
              </motion.div>
            ))
          ))}
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          <div className="p-6 rounded-xl bg-gradient-to-br from-neon-cyan/10 to-neon-violet/10 border border-cyber-gray-light text-center">
            <div className="text-4xl font-display font-bold text-neon-cyan mb-2">
              {techStack.flatMap(cat => cat.technologies).length}+
            </div>
            <div className="text-text-secondary text-sm">Technologies</div>
          </div>
          <div className="p-6 rounded-xl bg-gradient-to-br from-neon-violet/10 to-neon-cyan/10 border border-cyber-gray-light text-center">
            <div className="text-4xl font-display font-bold text-neon-violet mb-2">
              {techStack.length}
            </div>
            <div className="text-text-secondary text-sm">Categories</div>
          </div>
          <div className="p-6 rounded-xl bg-gradient-to-br from-neon-cyan/10 to-neon-violet/10 border border-cyber-gray-light text-center">
            <div className="text-4xl font-display font-bold text-neon-cyan mb-2">
              12+
            </div>
            <div className="text-text-secondary text-sm">{t.techStack.stats.experience}</div>
          </div>
          <div className="p-6 rounded-xl bg-gradient-to-br from-neon-violet/10 to-neon-cyan/10 border border-cyber-gray-light text-center">
            <div className="text-4xl font-display font-bold text-neon-violet mb-2">
              100+
            </div>
            <div className="text-text-secondary text-sm">{t.techStack.stats.projects}</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
