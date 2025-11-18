"use client";

import { Github, Linkedin, Twitter, Mail } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "@/hooks/useTranslation";

export default function Footer() {
  const t = useTranslation();
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      name: t.footer.links.github,
      href: "https://github.com/leroysteding",
      icon: Github,
    },
    {
      name: t.footer.links.linkedin,
      href: "https://linkedin.com/in/leroysteding",
      icon: Linkedin,
    },
    {
      name: t.footer.links.twitter,
      href: "https://twitter.com/leroysteding",
      icon: Twitter,
    },
    {
      name: t.footer.links.email,
      href: "mailto:leroy@steding.digital",
      icon: Mail,
    },
  ];

  const footerLinks = [
    { name: t.footer.links.privacy, href: "/privacy" },
    { name: t.footer.links.terms, href: "/terms" },
  ];

  return (
    <footer className="bg-tertiary-bg border-t-2 border-surface">
      <div className="container mx-auto px-8 lg:px-16 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Branding */}
          <div className="space-y-6">
            <h3 className="text-3xl font-display font-black text-gradient">
              STEDING.
            </h3>
            <p className="text-text-secondary text-lg leading-relaxed font-medium">
              Full-Stack Developer & AI Automation Architect building scalable
              AI-driven web platforms and digital automation solutions.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="text-2xl font-display font-bold text-accent-primary">
              {t.nav.about === "Over Mij" ? "Snelle Links" : "Quick Links"}
            </h4>
            <ul className="space-y-3">
              {footerLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-text-secondary hover:text-accent-primary transition-colors duration-200 text-base font-semibold"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div className="space-y-6">
            <h4 className="text-2xl font-display font-bold text-accent-secondary">
              {t.nav.about === "Over Mij" ? "Verbinden" : "Connect"}
            </h4>
            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="card p-4 hover:scale-110 transition-all duration-200 group"
                    aria-label={social.name}
                  >
                    <Icon className="w-7 h-7 text-text-secondary group-hover:text-accent-primary transition-colors duration-200" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t-2 border-surface">
          <p className="text-center text-text-muted text-base font-semibold">
            © {currentYear} Leroy Steding — {t.nav.about === "Over Mij" ? "Alle rechten voorbehouden" : "All rights reserved"}
          </p>
        </div>
      </div>
    </footer>
  );
}
