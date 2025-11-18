"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useScroll, useTransform } from "framer-motion";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useTranslation } from "@/hooks/useTranslation";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const t = useTranslation();
  const pathname = usePathname();
  const isHomePage = pathname === '/' || pathname === '/en' || pathname === '/nl';
  
  const { scrollY } = useScroll();
  
  // Transform values for the STEDING title animation (only on home page)translateX(-620px) translateY(-210px) scale(0.16)
  const scale = useTransform(scrollY, [0, 500], [1.15, 0.12]);
  const y = useTransform(scrollY, [0, 500], [100, -210]);
  const x = useTransform(scrollY, [0, 500], [100, -618]);
  
  const navigation = [
    { name: t.nav.about, href: "/#about" },
    { name: t.nav.experience, href: "/#experience" },
    { name: t.nav.skills, href: "/#skills" },
    { name: t.nav.projects, href: "/#projects" },
    { name: t.nav.blog, href: "/blog" },
    { name: t.nav.contact, href: "/#contact" },
  ];
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
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
      {isHomePage && (
        <motion.div
          style={{ scale, y, x }}
          className="fixed top-32 left-0 right-0 z-60 pointer-events-none"
        >
          <div className="container mx-auto px-80 lg:px-16">
            <h1 
              className="ml:20 font-display font-black text-gradient whitespace-nowrap leading-none text-[20vw] md:text-[15vw] lg:text-[13vw]"
              style={{ 
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                letterSpacing: '0.05em'
              }}
            >
              STEDING.
            </h1>
          </div>
        </motion.div>
      )}

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
              href="/"
              className="flex items-center space-x-2 group"
            >
              {!isHomePage && (
                <span className="text-3xl md:text-4xl font-display font-black text-gradient transition-all">
                  STEDING.
                </span>
              )}
            </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-10">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-text-secondary hover:text-accent-primary transition-colors duration-200 font-bold text-lg relative group"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-1 bg-accent-primary transition-all duration-300 group-hover:w-full rounded-full" />
              </Link>
            ))}
          </div>

          {/* Language, Theme Toggle & Mobile Menu Button */}
          <div className="flex items-center space-x-4">
            {/* Language Switcher - Desktop */}
            <div className="hidden md:block">
              <LanguageSwitcher />
            </div>

            <button
              onClick={toggleTheme}
              className="p-3 rounded-lg bg-surface hover:bg-accent-primary hover:text-primary-bg transition-all duration-200 border-2 border-surface hover:border-accent-primary"
              aria-label={t.nav.toggleTheme}
            >
              {theme === "dark" ? (
                <Sun className="w-6 h-6 text-accent-primary" />
              ) : (
                <Moon className="w-6 h-6 text-accent-secondary" />
              )}
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-3 rounded-lg bg-surface hover:bg-accent-primary hover:text-primary-bg transition-all duration-200 border-2 border-surface hover:border-accent-primary"
              aria-label={t.nav.toggleMenu}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-6 space-y-3 border-t-2 border-surface">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-6 py-3 text-lg font-bold text-text-secondary hover:text-accent-primary hover:bg-surface rounded-lg transition-all duration-200"
              >
                {item.name}
              </Link>
            ))}
            {/* Language Switcher - Mobile */}
            <div className="px-6 pt-4 border-t-2 border-surface">
              <LanguageSwitcher />
            </div>
          </div>
        )}
        </nav>
      </header>
    </>
  );
}
