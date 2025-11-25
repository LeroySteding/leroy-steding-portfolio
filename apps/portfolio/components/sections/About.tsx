"use client";

import { motion } from "framer-motion";
import { Code2, Rocket, Sparkles } from "lucide-react";
import Image from "next/image";
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
    <section
      id="about"
      className="section relative bg-secondary-bg overflow-hidden"
    >
      {/* Subtle accent line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-transparent via-accent-primary to-transparent" />

      <div className="container relative z-10 mx-auto px-4 sm:px-6 md:px-8 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          {/* Section header */}
          <div className="mb-12 sm:mb-16 md:mb-20">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="font-display font-black mb-6"
            >
              {t.about.title}{" "}
              <span className="text-gradient">{t.about.titleHighlight}</span>
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              whileInView={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="w-32 h-2 bg-accent-primary rounded-full"
            />
          </div>

          <div className="grid lg:grid-cols-2 gap-10 sm:gap-12 md:gap-16 items-center mb-12 sm:mb-16 md:mb-20">
            {/* Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="space-y-6 sm:space-y-7 md:space-y-8 text-base sm:text-lg md:text-xl text-text-secondary leading-relaxed"
            >
              <p className="text-lg sm:text-xl md:text-2xl font-semibold">
                {parseTranslation(
                  typeof t.about.intro === "object" &&
                    t.about.intro?.description
                    ? t.about.intro.description
                    : String(t.about.intro),
                )}
              </p>
              <p>{parseTranslation(t.about.expertise)}</p>
              <p>{parseTranslation(t.about.experience)}</p>
            </motion.div>

            {/* Portrait Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative w-full aspect-square max-w-lg lg:ml-auto">
                {/* Simple accent border */}
                <div className="absolute -inset-4 border-4 border-accent-primary rounded-2xl" />

                {/* Image container */}
                <div className="relative w-full h-full rounded-2xl overflow-hidden bg-secondary-bg">
                  <Image
                    src="/leroy-profile-pic.jpeg"
                    alt="Leroy Steding Portrait"
                    fill
                    className="object-cover"
                    priority
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAn/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwAB//2Q=="
                  />
                </div>

                {/* Decorative corner elements */}
                <div className="absolute -top-6 -left-6 w-32 h-32 border-l-4 border-t-4 border-accent-secondary rounded-tl-2xl" />
                <div className="absolute -bottom-6 -right-6 w-32 h-32 border-r-4 border-b-4 border-accent-primary rounded-br-2xl" />
              </div>
            </motion.div>
          </div>

          {/* Highlights grid */}
          <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-6 sm:gap-7 md:gap-8">
            {highlights.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                  viewport={{ once: true }}
                  className="card p-6 sm:p-7 md:p-8 group"
                >
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-tertiary-bg flex items-center justify-center mb-5 sm:mb-6 group-hover:bg-accent-primary transition-all duration-300">
                    <Icon className="w-7 h-7 sm:w-8 sm:h-8 text-accent-primary group-hover:text-primary-bg transition-colors duration-300" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-display font-bold mb-3 sm:mb-4 text-text-primary">
                    {item.title}
                  </h3>
                  <p className="text-text-secondary text-base sm:text-lg leading-relaxed">
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
