"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun, Menu, X } from "lucide-react";
import Link from "next/link";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useTranslation } from "@/hooks/useTranslation";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const t = useTranslation();
  
  const navigation = [
    { name: t.nav.about, href: "/#about" },
    { name: t.nav.experience, href: "/#experience" },
    { name: t.nav.skills, href: "/#skills" },
    { name: t.nav.projects, href: "/#projects" },
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
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-cyber-dark/90 backdrop-blur-md border-b border-cyber-gray-light"
          : "bg-transparent"
      }`}
    >
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-2 group"
          >
            <span className="text-2xl md:text-3xl font-display font-bold bg-gradient-to-r from-neon-cyan to-neon-violet bg-clip-text text-transparent group-hover:animate-glow-pulse transition-all">
              LS
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-text-secondary hover:text-neon-cyan transition-colors duration-200 font-medium relative group"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-neon-cyan transition-all duration-300 group-hover:w-full" />
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
              className="p-2 rounded-lg bg-cyber-gray hover:bg-cyber-gray-light transition-colors duration-200 neon-border-cyan"
              aria-label={t.nav.toggleTheme}
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5 text-neon-cyan" />
              ) : (
                <Moon className="w-5 h-5 text-neon-violet" />
              )}
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-cyber-gray hover:bg-cyber-gray-light transition-colors duration-200"
              aria-label={t.nav.toggleMenu}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-neon-cyan" />
              ) : (
                <Menu className="w-6 h-6 text-neon-cyan" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2 border-t border-cyber-gray-light">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-4 py-2 text-text-secondary hover:text-neon-cyan hover:bg-cyber-gray rounded-lg transition-all duration-200"
              >
                {item.name}
              </Link>
            ))}
            {/* Language Switcher - Mobile */}
            <div className="px-4 pt-4 border-t border-cyber-gray-light">
              <LanguageSwitcher />
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
