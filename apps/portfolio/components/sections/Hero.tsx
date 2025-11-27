"use client";

import { motion } from "framer-motion";
import { ArrowRight, Calendar, Download } from "lucide-react";
import Link from "next/link";
import { useLayout } from "@/contexts/LayoutContext";
import { useTranslation } from "@/hooks/useTranslation";
import { useLocalizedPath } from "@/lib/localization";
import type { SanityHeroSection } from "@/lib/sanity-content";

interface HeroProps {
  data?: SanityHeroSection | null;
}

export default function Hero({ data }: HeroProps) {
  const t = useTranslation();
  const getLocalizedPath = useLocalizedPath();
  const { layoutMode, heroContainerClass, heroMaxWidthClass } = useLayout();

  // Use Sanity data with static translation fallbacks
  const title = data?.title || t.hero.title;
  const subtitle = data?.subtitle || t.hero.subtitle;
  const tagline = data?.tagline || t.hero.tagline;

  // Scale text sizes based on layout mode - mobile-first with gradual scaling
  const titleSizes =
    layoutMode === "full-width"
      ? "text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl"
      : "text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl";

  const subtitleSizes =
    layoutMode === "full-width"
      ? "text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl"
      : "text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl";

  const taglineSizes =
    layoutMode === "full-width"
      ? "text-base sm:text-lg md:text-xl lg:text-2xl"
      : "text-sm sm:text-base md:text-lg lg:text-xl";

  // Content layout - spread in full-width, centered in contained
  const contentLayoutClass =
    layoutMode === "full-width"
      ? "flex flex-col lg:flex-row items-center lg:justify-between gap-8 sm:gap-12 lg:gap-16 xl:gap-24"
      : "flex flex-col lg:flex-row items-center justify-center gap-8 sm:gap-12 lg:gap-16 xl:gap-24";

  return (
    <section className="relative min-h-screen flex flex-col justify-end overflow-hidden bg-primary-bg">
      {/* Enhanced gradient background with animated elements */}
      <div className="absolute inset-0 bg-linear-to-br from-primary-bg via-secondary-bg to-primary-bg" />

      {/* Animated background pattern - responsive sizes */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-10 left-5 sm:top-20 sm:left-20 w-48 h-48 sm:w-72 sm:h-72 lg:w-96 lg:h-96 bg-accent-primary/10 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-10 right-5 sm:bottom-20 sm:right-20 w-48 h-48 sm:w-72 sm:h-72 lg:w-96 lg:h-96 bg-accent-secondary/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
      </div>

      <div
        className={`z-10 w-full min-h-screen flex items-center justify-center ${heroContainerClass}`}
      >
        {/* Main Content - Centered */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className={`${contentLayoutClass} ${heroMaxWidthClass}`}
        >
          {/* Left side - Text content */}
          <div className="space-y-4 sm:space-y-6 md:space-y-8 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h2 className="font-display font-black leading-[0.9]">
                <span
                  className={`block ${titleSizes} text-gradient mb-3 sm:mb-4 md:mb-6 drop-shadow-2xl`}
                >
                  {title}
                </span>
                <span
                  className={`block ${subtitleSizes} text-accent-secondary font-bold drop-shadow-lg`}
                >
                  {subtitle}
                </span>
              </h2>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className={`${taglineSizes} text-text-secondary leading-relaxed max-w-2xl mx-auto lg:mx-0`}
            >
              {tagline}
            </motion.p>
          </div>

          {/* Right side - CTA Buttons (flex-col) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col gap-3 sm:gap-4 md:gap-5 w-full max-w-xs sm:max-w-sm"
          >
            <Link
              href="#projects"
              className="group relative overflow-hidden bg-accent-primary hover:bg-accent-primary/90 text-primary-bg font-bold text-sm sm:text-base md:text-lg px-6 sm:px-8 md:px-10 py-3.5 sm:py-4 md:py-5 rounded-xl transition-all duration-300 inline-flex items-center justify-center gap-2 sm:gap-3 shadow-2xl hover:shadow-accent-primary/50 hover:scale-105 min-h-[48px]"
            >
              <span className="relative z-10">{t.hero.cta.projects}</span>
              <ArrowRight className="relative z-10 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-2 transition-transform duration-300" />
              <div className="absolute inset-0 bg-linear-to-r from-accent-primary to-accent-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>

            <Link
              href={getLocalizedPath("/cv")}
              target="_blank"
              className="group relative overflow-hidden bg-surface hover:bg-surface-light border-2 border-accent-primary/30 hover:border-accent-primary text-text-primary font-bold text-sm sm:text-base md:text-lg px-6 sm:px-8 md:px-10 py-3.5 sm:py-4 md:py-5 rounded-xl transition-all duration-300 inline-flex items-center justify-center gap-2 sm:gap-3 shadow-xl hover:scale-105 min-h-[48px]"
            >
              <Download className="relative z-10 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-y-1 transition-transform duration-300" />
              <span className="relative z-10">{t.hero.cta.cv}</span>
            </Link>

            <Link
              href={getLocalizedPath("/book")}
              className="group relative overflow-hidden bg-surface hover:bg-surface-light border-2 border-accent-secondary/30 hover:border-accent-secondary text-text-primary font-bold text-sm sm:text-base md:text-lg px-6 sm:px-8 md:px-10 py-3.5 sm:py-4 md:py-5 rounded-xl transition-all duration-300 inline-flex items-center justify-center gap-2 sm:gap-3 shadow-xl hover:scale-105 min-h-[48px]"
            >
              <Calendar className="relative z-10 w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform duration-300" />
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
        <Link
          href="#about"
          className="group flex flex-col items-center gap-4 cursor-pointer"
        >
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
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="w-2 h-2 bg-accent-primary group-hover:bg-accent-secondary rounded-full transition-colors duration-300"
              />
            </div>
          </div>

          {/* Animated chevron */}
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.2,
            }}
            className="text-accent-primary group-hover:text-accent-secondary transition-colors duration-300"
          >
            <ArrowRight className="w-6 h-6 rotate-90" />
          </motion.div>
        </Link>
      </motion.div>
    </section>
  );
}
