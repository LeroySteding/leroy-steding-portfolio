"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun, Menu, X, Search, Calendar } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useScroll, useTransform } from "framer-motion";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useTranslation } from "@/hooks/useTranslation";
import { useLocalizedPath } from "@/lib/localization";

interface HeaderProps {
  onSearchClick?: () => void;
}

export default function Header({ onSearchClick }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const t = useTranslation();
  const getLocalizedPath = useLocalizedPath();
  const pathname = usePathname();
  const isHomePage = pathname === '/' || pathname === '/en' || pathname === '/nl';
  
  // Only use scroll on home page to prevent cleanup errors
  const { scrollY } = isHomePage ? useScroll() : { scrollY: null };
  
  // Responsive logo animation - scales based on viewport width
  const [windowWidth, setWindowWidth] = useState(1440);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    const updateWidth = () => setWindowWidth(window.innerWidth);
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);
  
  // Calculate responsive transform values based on viewport
  const isMobile = windowWidth < 768;
  const isTablet = windowWidth >= 768 && windowWidth < 1024;
  
  // Mobile: smaller scale, different positioning
  // Tablet: medium scale
  // Desktop: original scale
  const scaleStart = isMobile ? 0.8 : isTablet ? 1.0 : 1.15;
  const scaleEnd = isMobile ? 0.25 : isTablet ? 0.18 : 0.14;
  
  const yStart = isMobile ? 50 : isTablet ? 80 : 100;
  const yEnd = isMobile ? -60 : isTablet ? -150 : -213.5;
  
  // X transform relative to viewport width
  const xStart = isMobile ? 0 : isTablet ? 50 : 100;
  const xEnd = isMobile ? windowWidth * -0.35 : isTablet ? windowWidth * -0.45 : -605.5;
  
  // Only create transforms if on home page
  const scale = isHomePage && scrollY ? useTransform(scrollY, [0, 500], [scaleStart, scaleEnd]) : null;
  const y = isHomePage && scrollY ? useTransform(scrollY, [0, 500], [yStart, yEnd]) : null;
  const x = isHomePage && scrollY ? useTransform(scrollY, [0, 500], [xStart, xEnd]) : null;
  
  const navigation = [
    { name: t.nav.about, href: getLocalizedPath("/about") },
    { name: t.nav.services, href: getLocalizedPath("/services") },
    { name: t.nav.projects, href: getLocalizedPath("/projects") },
    { name: t.nav.blog, href: getLocalizedPath("/blog") },
    { name: t.nav.contact, href: getLocalizedPath("/contact") },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  if (!mounted) {
    return null;
  }

  return (
    <>
      {/* Animated STEDING logo - only on home page */}
      {/*{isHomePage && scale && y && x && (
        <motion.div
          style={{ scale, y, x }}
          className="fixed top-32 left-0 right-0 z-60 pointer-events-none"
        >
          <div className="container mx-auto px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20">
            <h1 
              className="font-display font-black text-gradient whitespace-nowrap leading-none text-[22vw] sm:text-[18vw] md:text-[15vw] lg:text-[13vw] xl:text-[12vw]"
              style={{ 
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              STEDING.
            </h1>
          </div>
        </motion.div>
      )}*/}

      <header
        className={`fixed top-0 left-0 right-0 z-55 transition-all duration-300 ${
          isScrolled
            ? "bg-primary-bg/95 backdrop-blur-md border-b-2 border-surface"
            : "bg-transparent"
        }`}
      >
        <nav className="container mx-auto px-8 lg:px-16">
          <div className="flex items-center justify-between h-20 md:h-24">
            {/* Logo */}
            <Link
              href={getLocalizedPath("/")}
              prefetch={false}
              className="flex items-center space-x-2 group"
            >
              <span className="text-3xl md:text-4xl font-display font-black text-gradient transition-all">
                STEDING.
              </span>
              {/*{!isHomePage ? (
                <span className="text-3xl md:text-4xl font-display font-black text-gradient transition-all">
                  STEDING.
                </span>
              ) : (
                <span className="text-3xl md:text-4xl font-display font-black text-outline">
                  STEDING.
                </span>
              )}*/}
            </Link>

          {/* Desktop Navigation - Unified Sizing */}
          <div className="hidden lg:flex items-center gap-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                prefetch={false}
                className="px-3 py-2 text-text-secondary hover:text-accent-primary hover:bg-surface/50 rounded-md transition-all duration-200 font-medium text-sm relative group"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right Side Actions - Unified Sizing */}
          <div className="flex items-center gap-2">
            {/* Book a Call CTA - Same Height as Other Buttons */}
            <Link
              href={getLocalizedPath("/book")}
              prefetch={false}
              className="hidden lg:flex items-center gap-2 px-3 py-2 bg-accent-primary hover:bg-accent-primary/90 text-white font-medium text-sm rounded-md transition-all duration-200 hover:scale-105"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Call</span>
            </Link>

            {/* Utility Actions - Same Sizing */}
            <div className="hidden lg:flex items-center gap-1">
              {/* Search Button */}
              <button
                onClick={onSearchClick}
                className="p-2 rounded-md text-text-muted hover:text-accent-primary hover:bg-surface/50 transition-all duration-200"
                aria-label="Search"
                title="Search (⌘K)"
              >
                <Search className="w-4 h-4" />
              </button>

              {/* Language Switcher */}
              <LanguageSwitcher />

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-md text-text-muted hover:text-accent-primary hover:bg-surface/50 transition-all duration-200"
                aria-label={t.nav.toggleTheme}
                title={theme === "dark" ? "Light mode" : "Dark mode"}
              >
                {theme === "dark" ? (
                  <Sun className="w-4 h-4" />
                ) : (
                  <Moon className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-lg bg-surface hover:bg-accent-primary transition-all duration-200 border border-surface hover:border-accent-primary group"
              aria-label={t.nav.toggleMenu}
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-text-primary group-hover:text-white" />
              ) : (
                <Menu className="w-5 h-5 text-text-primary group-hover:text-white" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation - Cleaner */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden border-t border-surface"
          >
            <div className="py-6 space-y-2">
              {/* Book a Call CTA - Featured */}
              <div className="px-6 mb-4">
                <Link
                  href={getLocalizedPath("/book")}
                  prefetch={false}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-accent-primary hover:bg-accent-primary/90 text-white font-semibold text-base rounded-lg transition-all duration-200 shadow-lg w-full"
                >
                  <Calendar className="w-5 h-5" />
                  <span>Book a Call</span>
                </Link>
              </div>

              {/* Navigation Links */}
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  prefetch={false}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-6 py-3 text-base font-medium text-text-secondary hover:text-accent-primary hover:bg-surface/50 transition-all duration-200"
                >
                  {item.name}
                </Link>
              ))}

              {/* Utility Section */}
              <div className="px-6 pt-4 mt-4 border-t border-surface space-y-3">
                {/* Search */}
                <button
                  onClick={() => {
                    onSearchClick?.();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-3 w-full px-4 py-2.5 text-base font-medium text-text-secondary hover:text-accent-primary hover:bg-surface/50 rounded-lg transition-all duration-200"
                >
                  <Search className="w-5 h-5" />
                  <span>Search</span>
                </button>

                {/* Language & Theme Row */}
                <div className="flex items-center justify-between px-4">
                  <LanguageSwitcher />
                  <button
                    onClick={toggleTheme}
                    className="p-2 rounded-lg bg-surface hover:bg-surface-light transition-all duration-200"
                    aria-label={t.nav.toggleTheme}
                  >
                    {theme === "dark" ? (
                      <Sun className="w-5 h-5 text-text-muted" />
                    ) : (
                      <Moon className="w-5 h-5 text-text-muted" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
        </nav>
      </header>
    </>
  );
}
