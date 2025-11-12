"use client";

import { ArrowRight, Download } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useTranslation } from "@/hooks/useTranslation";

export default function Hero() {
  const t = useTranslation();
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-cyber-black via-cyber-dark to-cyber-black">
      {/* Animated background grid */}
      <div className="absolute inset-0 cyber-grid opacity-20" />
      
      {/* Gradient orbs */}
      <div className="absolute top-1/4 -left-48 w-96 h-96 bg-neon-cyan/20 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-neon-violet/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-4"
            >
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold leading-tight">
                <span className="block text-text-primary">{t.hero.name}</span>
                <span className="block mt-2 bg-gradient-to-r from-neon-cyan via-neon-violet to-neon-cyan bg-clip-text text-transparent animate-gradient">
                  {t.hero.title}
                </span>
                <span className="block mt-2 bg-gradient-to-r from-neon-violet via-neon-cyan to-neon-violet bg-clip-text text-transparent animate-gradient">
                  {t.hero.subtitle}
                </span>
              </h1>
              
              <p className="text-xl sm:text-2xl text-text-secondary max-w-2xl leading-relaxed">
                {t.hero.tagline}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link
                href="#projects"
                className="group inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-cyber-black bg-neon-cyan rounded-lg hover:bg-neon-cyan-dark transition-all duration-300 neon-border-cyan hover:scale-105"
              >
                {t.hero.cta.projects}
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
              
              <Link
                href="/cv"
                target="_blank"
                className="group inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-text-primary bg-cyber-gray hover:bg-cyber-gray-light border-2 border-neon-violet rounded-lg transition-all duration-300 hover:scale-105"
              >
                <Download className="mr-2 w-5 h-5" />
                {t.hero.cta.cv}
              </Link>
              
              <Link
                href="#contact"
                className="group inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-text-primary bg-cyber-gray hover:bg-cyber-gray-light border-2 border-neon-cyan rounded-lg transition-all duration-300 hover:scale-105"
              >
                {t.hero.cta.contact}
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="grid grid-cols-3 gap-6 pt-8 border-t border-cyber-gray-light"
            >
              <div>
                <div className="text-3xl font-display font-bold text-neon-cyan">12+</div>
                <div className="text-sm text-text-muted mt-1">{t.hero.stats.experience}</div>
              </div>
              <div>
                <div className="text-3xl font-display font-bold text-neon-violet">100+</div>
                <div className="text-sm text-text-muted mt-1">{t.hero.stats.projects}</div>
              </div>
              <div>
                <div className="text-3xl font-display font-bold text-neon-cyan">50+</div>
                <div className="text-sm text-text-muted mt-1">{t.hero.stats.clients}</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Portrait Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            <div className="relative w-full aspect-square max-w-lg mx-auto">
              {/* Glowing border effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan via-neon-violet to-neon-cyan rounded-2xl blur-2xl opacity-50 animate-glow-pulse" />
              
              {/* Image container */}
              <div className="relative w-full h-full rounded-2xl overflow-hidden border-2 border-neon-cyan/50 glass">
                <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/10 to-neon-violet/10" />
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
              
              {/* Decorative elements */}
              <div className="absolute -top-4 -left-4 w-24 h-24 border-l-2 border-t-2 border-neon-cyan rounded-tl-2xl" />
              <div className="absolute -bottom-4 -right-4 w-24 h-24 border-r-2 border-b-2 border-neon-violet rounded-br-2xl" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-sm text-text-muted">{t.hero.scroll}</span>
          <div className="w-6 h-10 border-2 border-neon-cyan rounded-full flex justify-center p-1">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-1.5 bg-neon-cyan rounded-full"
            />
          </div>
        </div>
      </motion.div>
    </section>
  );
}
