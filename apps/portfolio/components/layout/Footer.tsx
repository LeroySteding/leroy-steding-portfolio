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
    <footer className="bg-cyber-darker border-t border-cyber-gray-light">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Branding */}
          <div className="space-y-4">
            <h3 className="text-2xl font-display font-bold bg-gradient-to-r from-neon-cyan to-neon-violet bg-clip-text text-transparent">
              Leroy Steding
            </h3>
            <p className="text-text-secondary text-sm leading-relaxed">
              Full-Stack Developer & AI Automation Architect building scalable
              AI-driven web platforms and digital automation solutions.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-display font-semibold text-neon-cyan">
              {t.nav.about === "Over Mij" ? "Snelle Links" : "Quick Links"}
            </h4>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-text-secondary hover:text-neon-cyan transition-colors duration-200 text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-display font-semibold text-neon-violet">
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
                    className="p-3 rounded-lg bg-cyber-gray hover:bg-cyber-gray-light transition-all duration-200 group neon-border-cyan hover:scale-110"
                    aria-label={social.name}
                  >
                    <Icon className="w-5 h-5 text-text-secondary group-hover:text-neon-cyan transition-colors duration-200" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-cyber-gray-light">
          <p className="text-center text-text-muted text-sm">
            © {currentYear} Leroy Steding — {t.nav.about === "Over Mij" ? "Alle rechten voorbehouden" : "All rights reserved"}
          </p>
        </div>
      </div>
    </footer>
  );
}
