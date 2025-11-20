"use client";

import { ArrowRight, Download, Calendar } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useTranslation } from "@/hooks/useTranslation";
import { useLocalizedPath } from "@/lib/localization";

export default function Hero() {
  const t = useTranslation();
  const getLocalizedPath = useLocalizedPath();

  return (
    <section className="relative min-h-screen flex flex-col justify-end overflow-hidden bg-primary-bg">
      {/* Enhanced gradient background with animated elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-bg via-secondary-bg to-primary-bg" />
      
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-20 w-96 h-96 bg-accent-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="container relative z-10 mx-auto px-8 lg:px-16 pb-32 pt-[30rem] md:pt-[35rem]">
        {/* Main Content - Full Width */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-5xl space-y-16"
        >
          {/* Heading Section */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h2 className="font-display font-black leading-[0.9]">
                <span className="block text-6xl md:text-7xl lg:text-8xl xl:text-9xl text-gradient mb-6 drop-shadow-2xl">
                  {t.hero.title}
                </span>
                <span className="block text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-accent-secondary font-bold drop-shadow-lg">
                  {t.hero.subtitle}
                </span>
              </h2>
            </motion.div>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-2xl lg:text-3xl text-text-secondary leading-relaxed max-w-4xl"
            >
              {t.hero.tagline}
            </motion.p>
          </div>

          {/* Stats Grid - Below Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="grid grid-cols-3 gap-6 md:gap-8 max-w-4xl"
          >
            <motion.div 
              whileHover={{ scale: 1.05, y: -5 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/20 to-accent-primary/5 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
              <div className="relative card p-6 md:p-8 backdrop-blur-sm border-2 border-accent-primary/20 group-hover:border-accent-primary/40 transition-all duration-300">
                <div className="text-5xl md:text-6xl lg:text-7xl font-display font-black text-accent-primary mb-3 leading-none">12+</div>
                <div className="text-xs md:text-sm lg:text-base text-text-muted font-bold uppercase tracking-wider">{t.hero.stats.experience}</div>
              </div>
            </motion.div>
            
            <motion.div 
              whileHover={{ scale: 1.05, y: -5 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-accent-secondary/20 to-accent-secondary/5 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
              <div className="relative card p-6 md:p-8 backdrop-blur-sm border-2 border-accent-secondary/20 group-hover:border-accent-secondary/40 transition-all duration-300">
                <div className="text-5xl md:text-6xl lg:text-7xl font-display font-black text-accent-secondary mb-3 leading-none">100+</div>
                <div className="text-xs md:text-sm lg:text-base text-text-muted font-bold uppercase tracking-wider">{t.hero.stats.projects}</div>
              </div>
            </motion.div>
            
            <motion.div 
              whileHover={{ scale: 1.05, y: -5 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/20 to-accent-primary/5 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
              <div className="relative card p-6 md:p-8 backdrop-blur-sm border-2 border-accent-primary/20 group-hover:border-accent-primary/40 transition-all duration-300">
                <div className="text-5xl md:text-6xl lg:text-7xl font-display font-black text-accent-primary mb-3 leading-none">50+</div>
                <div className="text-xs md:text-sm lg:text-base text-text-muted font-bold uppercase tracking-wider">{t.hero.stats.clients}</div>
              </div>
            </motion.div>
          </motion.div>

          {/* CTA Buttons - Redesigned */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-wrap gap-4 md:gap-6"
          >
            <Link
              href="#projects"
              className="group relative overflow-hidden bg-accent-primary hover:bg-accent-primary/90 text-primary-bg font-bold text-base md:text-lg px-10 py-5 rounded-xl transition-all duration-300 inline-flex items-center gap-3 shadow-2xl hover:shadow-accent-primary/50 hover:scale-105"
            >
              <span className="relative z-10">{t.hero.cta.projects}</span>
              <ArrowRight className="relative z-10 w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
              <div className="absolute inset-0 bg-gradient-to-r from-accent-primary to-accent-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>
            
            <Link
              href={getLocalizedPath("/cv")}
              target="_blank"
              className="group relative overflow-hidden bg-surface hover:bg-surface-light border-2 border-accent-primary/30 hover:border-accent-primary text-text-primary font-bold text-base md:text-lg px-10 py-5 rounded-xl transition-all duration-300 inline-flex items-center gap-3 shadow-xl hover:scale-105"
            >
              <Download className="relative z-10 w-5 h-5 group-hover:translate-y-1 transition-transform duration-300" />
              <span className="relative z-10">{t.hero.cta.cv}</span>
            </Link>
            
            <Link
              href={getLocalizedPath("/book")}
              className="group relative overflow-hidden bg-surface hover:bg-surface-light border-2 border-accent-secondary/30 hover:border-accent-secondary text-text-primary font-bold text-base md:text-lg px-10 py-5 rounded-xl transition-all duration-300 inline-flex items-center gap-3 shadow-xl hover:scale-105"
            >
              <Calendar className="relative z-10 w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
              <span className="relative z-10">Schedule a Call</span>
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Enhanced scroll indicator */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1 }}
        className="absolute bottom-16 left-1/2 -translate-x-1/2 z-20"
      >
        <Link href="#about" className="group flex flex-col items-center gap-4 cursor-pointer">
          <span className="text-sm text-text-muted group-hover:text-accent-primary font-semibold uppercase tracking-widest transition-colors duration-300">
            {t.hero.scroll}
          </span>
          <div className="relative">
            {/* Outer glow ring */}
            <div className="absolute inset-0 rounded-full bg-accent-primary/20 group-hover:bg-accent-primary/40 blur-xl transition-all duration-300" />
            
            {/* Mouse scroll indicator */}
            <div className="relative w-8 h-14 border-2 border-accent-primary group-hover:border-accent-secondary rounded-full flex justify-center p-2 transition-all duration-300">
              <motion.div
                animate={{ y: [0, 20, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="w-2 h-2 bg-accent-primary group-hover:bg-accent-secondary rounded-full transition-colors duration-300"
              />
            </div>
          </div>
          
          {/* Animated chevron */}
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
            className="text-accent-primary group-hover:text-accent-secondary transition-colors duration-300"
          >
            <ArrowRight className="w-6 h-6 rotate-90" />
          </motion.div>
        </Link>
      </motion.div>
    </section>
  );
}
