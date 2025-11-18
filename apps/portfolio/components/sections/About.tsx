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
    <section id="about" className="section relative bg-secondary-bg overflow-hidden">
      {/* Subtle accent line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-accent-primary to-transparent" />
      
      <div className="container relative z-10 mx-auto px-8 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          {/* Section header */}
          <div className="mb-20">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="font-display font-black mb-6"
            >
              {t.about.title} <span className="text-gradient">{t.about.titleHighlight}</span>
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              whileInView={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="w-32 h-2 bg-accent-primary rounded-full"
            />
          </div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-8 text-xl text-text-secondary leading-relaxed mb-20 max-w-4xl"
          >
            <p className="text-2xl font-semibold">{parseTranslation(t.about.intro)}</p>
            <p>{parseTranslation(t.about.expertise)}</p>
            <p>{parseTranslation(t.about.experience)}</p>
          </motion.div>

          {/* Highlights grid */}
          <div className="grid md:grid-cols-3 gap-8">
            {highlights.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                  viewport={{ once: true }}
                  className="card p-8 group"
                >
                  <div className="w-16 h-16 rounded-xl bg-tertiary-bg flex items-center justify-center mb-6 group-hover:bg-accent-primary transition-all duration-300">
                    <Icon className="w-8 h-8 text-accent-primary group-hover:text-primary-bg transition-colors duration-300" />
                  </div>
                  <h3 className="text-2xl font-display font-bold mb-4 text-text-primary">
                    {item.title}
                  </h3>
                  <p className="text-text-secondary text-lg leading-relaxed">
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
