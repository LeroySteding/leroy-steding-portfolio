"use client";

import { motion } from "framer-motion";
import { Code2, Sparkles, Rocket } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { parseTranslation } from "@/utils/parseTranslation";

export default function About() {
  const t = useTranslation();
  
  const highlights = [
    {
      icon: Code2,
      title: t.about.highlights.fullstack.title,
      description: t.about.highlights.fullstack.description,
    },
    {
      icon: Sparkles,
      title: t.about.highlights.ai.title,
      description: t.about.highlights.ai.description,
    },
    {
      icon: Rocket,
      title: t.about.highlights.saas.title,
      description: t.about.highlights.saas.description,
    },
  ];
  return (
    <section id="about" className="relative py-24 bg-cyber-dark overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-neon-cyan to-transparent" />
      
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          {/* Section header */}
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-4xl sm:text-5xl font-display font-bold mb-4"
            >
              {t.about.title} <span className="bg-gradient-to-r from-neon-cyan to-neon-violet bg-clip-text text-transparent">{t.about.titleHighlight}</span>
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              whileInView={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="w-24 h-1 bg-gradient-to-r from-neon-cyan to-neon-violet mx-auto rounded-full"
            />
          </div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
            className="space-y-6 text-lg text-text-secondary leading-relaxed mb-12"
          >
            <p>{parseTranslation(t.about.intro)}</p>
            <p>{parseTranslation(t.about.expertise)}</p>
            <p>{parseTranslation(t.about.experience)}</p>
          </motion.div>

          {/* Highlights grid */}
          <div className="grid md:grid-cols-3 gap-6">
            {highlights.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05 }}
                  className="p-6 rounded-xl bg-cyber-darker border border-cyber-gray-light glass hover:border-neon-cyan/50 transition-all duration-300 group"
                >
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-neon-cyan/20 to-neon-violet/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-6 h-6 text-neon-cyan" />
                  </div>
                  <h3 className="text-xl font-display font-semibold mb-2 text-text-primary">
                    {item.title}
                  </h3>
                  <p className="text-text-secondary text-sm leading-relaxed">
                    {item.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
