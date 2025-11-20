"use client";

import { Github, Linkedin, Twitter, Mail, MapPin, Phone, Calendar } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "@/hooks/useTranslation";
import { useLocalizedPath } from "@/lib/localization";
import NewsletterSubscribe from "@/components/ui/NewsletterSubscribe";

export default function Footer() {
  const t = useTranslation();
  const getLocalizedPath = useLocalizedPath();
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
  ];

  const contactInfo = [
    {
      icon: Mail,
      label: "Email",
      value: "leroy@steding.digital",
      href: "mailto:leroy@steding.digital",
    },
    {
      icon: Phone,
      label: "Phone",
      value: "+31 6 12345678",
      href: "tel:+31612345678",
    },
    {
      icon: MapPin,
      label: "Location",
      value: "Netherlands",
    },
  ];

  const footerLinks = [
    { name: t.nav.about, href: getLocalizedPath("/about") },
    { name: t.nav.services, href: getLocalizedPath("/services") },
    { name: t.nav.projects, href: getLocalizedPath("/projects") },
    { name: t.nav.blog, href: getLocalizedPath("/blog") },
    { name: t.nav.contact, href: getLocalizedPath("/contact") },
  ];

  const legalLinks = [
    { name: t.footer.links.privacy, href: getLocalizedPath("/privacy") },
    { name: t.footer.links.terms, href: getLocalizedPath("/terms") },
  ];

  return (
    <footer className="bg-tertiary-bg border-t-2 border-surface">
      {/* Newsletter Section */}
      <div className="border-b-2 border-surface">
        <div className="container mx-auto px-8 lg:px-16 py-16">
          <NewsletterSubscribe variant="inline" className="max-w-2xl mx-auto text-center" />
        </div>
      </div>

      {/* Booking CTA Section */}
      <div className="border-b-2 border-surface bg-gradient-to-r from-accent-primary/5 via-accent-secondary/5 to-accent-primary/5">
        <div className="container mx-auto px-8 lg:px-16 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex p-3 rounded-xl bg-accent-primary/10 mb-6">
              <Calendar className="w-8 h-8 text-accent-primary" />
            </div>
            
            <h3 className="text-3xl md:text-4xl font-display font-black mb-4">
              {t.nav.about === "Over Mij" ? "Klaar om te Starten?" : "Ready to Get Started?"}
            </h3>
            
            <p className="text-lg text-text-secondary mb-8 max-w-2xl mx-auto leading-relaxed">
              {t.nav.about === "Over Mij" 
                ? "Plan een gratis 30-minuten gesprek om uw project te bespreken en ontdek hoe we samen uw ideeën tot leven kunnen brengen."
                : "Schedule a free 30-minute consultation to discuss your project and discover how we can bring your ideas to life together."}
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                href={getLocalizedPath("/book")}
                className="btn-primary group"
              >
                <Calendar className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>{t.nav.about === "Over Mij" ? "Plan een Gesprek" : "Schedule a Call"}</span>
              </Link>
              
              <Link 
                href="/contact"
                className="btn-secondary group"
              >
                <Mail className="w-5 h-5" />
                <span>{t.nav.about === "Over Mij" ? "Stuur een Bericht" : "Send a Message"}</span>
              </Link>
            </div>
            
            <div className="flex items-center justify-center gap-8 mt-8 text-sm text-text-muted">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span>{t.nav.about === "Over Mij" ? "Beschikbaar voor Nieuwe Projecten" : "Available for New Projects"}</span>
              </div>
              <span>•</span>
              <div>{t.nav.about === "Over Mij" ? "Meestal binnen 24u reactie" : "Usually responds within 24h"}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-8 lg:px-16 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Branding */}
          <div className="space-y-6">
            <h3 className="text-3xl font-display font-black text-gradient">
              STEDING.
            </h3>
            <p className="text-text-secondary text-base leading-relaxed font-medium">
              Full-Stack Developer & AI Automation Architect building scalable
              AI-driven web platforms and digital automation solutions.
            </p>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h4 className="text-2xl font-display font-bold text-accent-primary">
              {t.nav.about === "Over Mij" ? "Contact" : "Contact"}
            </h4>
            <ul className="space-y-3">
              {contactInfo.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.label}>
                    {item.href ? (
                      <a
                        href={item.href}
                        className="flex items-center gap-3 text-text-secondary hover:text-accent-primary transition-colors duration-200 group"
                      >
                        <Icon className="w-4 h-4 flex-shrink-0" />
                        <span className="text-sm font-semibold">{item.value}</span>
                      </a>
                    ) : (
                      <div className="flex items-center gap-3 text-text-secondary">
                        <Icon className="w-4 h-4 flex-shrink-0" />
                        <span className="text-sm font-semibold">{item.value}</span>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="text-2xl font-display font-bold text-accent-secondary">
              {t.nav.about === "Over Mij" ? "Snelle Links" : "Quick Links"}
            </h4>
            <ul className="space-y-3">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-text-secondary hover:text-accent-secondary transition-colors duration-200 text-sm font-semibold"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div className="space-y-6">
            <h4 className="text-2xl font-display font-bold text-accent-primary">
              {t.nav.about === "Over Mij" ? "Social" : "Social"}
            </h4>
            <div className="flex space-x-3">
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
                    <Icon className="w-6 h-6 text-text-secondary group-hover:text-accent-primary transition-colors duration-200" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Copyright & Legal */}
        <div className="pt-8 border-t-2 border-surface">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-text-muted text-sm font-semibold">
              © {currentYear} Leroy Steding — {t.nav.about === "Over Mij" ? "Alle rechten voorbehouden" : "All rights reserved"}
            </p>
            
            <div className="flex items-center gap-6">
              {legalLinks.map((link, index) => (
                <span key={link.href} className="flex items-center gap-6">
                  <Link
                    href={link.href}
                    className="text-text-muted hover:text-accent-primary transition-colors duration-200 text-sm font-semibold"
                  >
                    {link.name}
                  </Link>
                  {index < legalLinks.length - 1 && (
                    <span className="text-text-muted">•</span>
                  )}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
