"use client";

import { motion } from "framer-motion";
import { Calendar, Mail, Linkedin, ExternalLink, CheckCircle2, Clock, Shield } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "@/hooks/useTranslation";
import CalendlyWidget from "@/components/ui/CalendlyWidget";

export default function BookingPageClient() {
  const t = useTranslation();

  const benefits = t.booking.benefits.items || [
    {
      title: "Free Consultation",
      description: "No obligation, just valuable insights for your project",
    },
    {
      title: "Technical Expertise",
      description: "Get expert advice on architecture, tech stack, and implementation",
    },
    {
      title: "Clear Next Steps",
      description: "Walk away with actionable recommendations and timeline estimates",
    },
  ];

  const trustIndicators = [
    {
      icon: Clock,
      label: t.booking.trustIndicators.response || "24h Response",
    },
    {
      icon: CheckCircle2,
      label: t.booking.trustIndicators.availability || "Available Now",
    },
    {
      icon: Shield,
      label: t.booking.trustIndicators.secure || "Secure Booking",
    },
  ];

  const alternativeActions = [
    {
      icon: Mail,
      title: t.booking.cta.email || "Send an Email",
      href: "mailto:leroy@steding.digital",
      description: "Prefer email? Reach out directly",
    },
    {
      icon: Linkedin,
      title: t.booking.cta.linkedin || "Connect on LinkedIn",
      href: "https://linkedin.com/in/leroysteding",
      description: "Let's connect professionally",
    },
    {
      icon: ExternalLink,
      title: t.booking.cta.projects || "View My Work",
      href: "/projects",
      description: "See what I've built",
    },
  ];

  return (
    <div className="min-h-screen bg-primary-bg">
      {/* Hero Section */}
      <section className="relative py-32 bg-secondary-bg overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-20">
          <div className="absolute top-1/4 -left-48 w-96 h-96 bg-accent-primary/30 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-accent-secondary/30 rounded-full blur-3xl" />
        </div>

        <div className="container relative z-10 mx-auto px-8 lg:px-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20 mb-6"
            >
              <Calendar className="w-12 h-12 text-accent-primary" />
            </motion.div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-black mb-6 leading-tight">
              {t.booking.hero.title}{" "}
              <span className="text-gradient">{t.booking.hero.titleHighlight}</span>
            </h1>

            <p className="text-xl md:text-2xl text-text-secondary leading-relaxed">
              {t.booking.hero.subtitle}
            </p>

            {/* Trust Indicators */}
            <div className="grid grid-cols-3 gap-4 mt-12 max-w-2xl mx-auto">
              {trustIndicators.map((indicator, index) => {
                const Icon = indicator.icon;
                return (
                  <motion.div
                    key={indicator.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
                    className="text-center p-4 rounded-xl bg-surface"
                  >
                    <Icon className="w-6 h-6 text-accent-primary mx-auto mb-2" />
                    <div className="text-sm font-semibold text-text-primary">
                      {indicator.label}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-24 bg-primary-bg">
        <div className="container relative z-10 mx-auto px-8 lg:px-16">
          <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">
            {/* Calendly Widget */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="lg:col-span-3"
            >
              <div className="card p-8">
                <CalendlyWidget
                  styles={{ height: "700px", width: "100%" }}
                  pageSettings={{
                    backgroundColor: "1a1a1a",
                    hideEventTypeDetails: false,
                    primaryColor: "0066ff",
                    textColor: "e5e5e5",
                  }}
                  utm={{
                    utmSource: "portfolio",
                    utmMedium: "booking_page",
                    utmCampaign: "consultation",
                  }}
                />
              </div>
            </motion.div>

            {/* Benefits Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="lg:col-span-2 space-y-8"
            >
              {/* What to Expect */}
              <div>
                <h2 className="text-2xl md:text-3xl font-display font-bold mb-6 text-accent-primary">
                  {t.booking.benefits.title}
                </h2>

                <div className="space-y-4">
                  {benefits.map((benefit, index) => (
                    <motion.div
                      key={benefit.title}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="card p-6"
                    >
                      <div className="flex items-start gap-4">
                        <div className="p-3 rounded-lg bg-accent-primary/10 flex-shrink-0">
                          <CheckCircle2 className="w-6 h-6 text-accent-primary" />
                        </div>
                        <div>
                          <h3 className="font-bold text-text-primary mb-2">
                            {benefit.title}
                          </h3>
                          <p className="text-sm text-text-secondary">
                            {benefit.description}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Alternative Actions */}
              <div>
                <h3 className="text-xl font-display font-bold mb-4 text-text-primary">
                  {t.booking.cta.title}
                </h3>

                <div className="space-y-3">
                  {alternativeActions.map((action) => {
                    const Icon = action.icon;
                    const isExternal = action.href.startsWith("http");

                    return (
                      <Link
                        key={action.title}
                        href={action.href}
                        target={isExternal ? "_blank" : undefined}
                        rel={isExternal ? "noopener noreferrer" : undefined}
                        className="flex items-center gap-4 p-4 rounded-xl hover:bg-surface transition-colors group"
                      >
                        <div className="p-3 rounded-lg bg-accent-secondary/10 group-hover:bg-accent-secondary/20 transition-colors">
                          <Icon className="w-5 h-5 text-accent-secondary" />
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-text-primary group-hover:text-accent-secondary transition-colors">
                            {action.title}
                          </div>
                          <div className="text-sm text-text-muted">
                            {action.description}
                          </div>
                        </div>
                        {isExternal && (
                          <ExternalLink className="w-4 h-4 text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Availability Badge */}
              <div className="card p-6 bg-gradient-to-br from-green-500/10 to-green-500/5 border-2 border-green-500/30">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-lg font-bold text-green-500">
                    Available for Calls
                  </span>
                </div>
                <p className="text-sm text-text-secondary">
                  Currently accepting new project consultations and collaboration opportunities
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
