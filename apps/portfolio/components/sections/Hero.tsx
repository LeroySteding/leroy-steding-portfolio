"use client";

import { ArrowRight, Download } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useTranslation } from "@/hooks/useTranslation";

export default function Hero() {
  const t = useTranslation();
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-primary-bg">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary-bg via-secondary-bg to-primary-bg opacity-60" />

      <div className="container relative z-10 mx-auto px-8 lg:px-16 pt-32 pb-20">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-12"
          >
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="space-y-6"
            >
              <h1 className="font-display font-black leading-none">
                <span className="block text-text-primary text-7xl lg:text-9xl">{t.hero.name}</span>
                <span className="block mt-4 text-5xl lg:text-7xl text-gradient">
                  {t.hero.title}
                </span>
                <span className="block mt-2 text-4xl lg:text-6xl text-accent-secondary font-bold">
                  {t.hero.subtitle}
                </span>
              </h1>
              
              <p className="text-xl lg:text-2xl text-text-secondary max-w-2xl leading-relaxed font-normal">
                {t.hero.tagline}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link
                href="#projects"
                className="btn-primary inline-flex items-center justify-center gap-2"
              >
                {t.hero.cta.projects}
                <ArrowRight className="w-5 h-5" />
              </Link>
              
              <Link
                href="/cv"
                target="_blank"
                className="btn-secondary inline-flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                {t.hero.cta.cv}
              </Link>
              
              <Link
                href="#contact"
                className="btn-secondary inline-flex items-center justify-center gap-2"
              >
                {t.hero.cta.contact}
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="grid grid-cols-3 gap-8 pt-12 border-t-2 border-surface"
            >
              <div>
                <div className="text-5xl font-display font-black text-accent-primary">12+</div>
                <div className="text-base text-text-muted mt-2 font-semibold uppercase tracking-wide">{t.hero.stats.experience}</div>
              </div>
              <div>
                <div className="text-5xl font-display font-black text-accent-secondary">100+</div>
                <div className="text-base text-text-muted mt-2 font-semibold uppercase tracking-wide">{t.hero.stats.projects}</div>
              </div>
              <div>
                <div className="text-5xl font-display font-black text-accent-primary">50+</div>
                <div className="text-base text-text-muted mt-2 font-semibold uppercase tracking-wide">{t.hero.stats.clients}</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Portrait Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative w-full aspect-square max-w-lg mx-auto">
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
      </div>

      {/* Minimal scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2"
      >
        <div className="flex flex-col items-center gap-3">
          <span className="text-sm text-text-muted font-semibold uppercase tracking-widest">{t.hero.scroll}</span>
          <div className="w-6 h-12 border-2 border-accent-primary rounded-full flex justify-center p-1.5">
            <motion.div
              animate={{ y: [0, 16, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="w-1.5 h-1.5 bg-accent-primary rounded-full"
            />
          </div>
        </div>
      </motion.div>
    </section>
  );
}
