"use client";

import { motion } from "framer-motion";
import { Calendar, Mail, Linkedin, ExternalLink, CheckCircle2, Clock, Shield, MessageSquare, Users, Code, Star, Quote } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "@/hooks/useTranslation";
import UniversalCalendarWidget from "@/components/ui/UniversalCalendarWidget";
import { useState } from "react";

type MeetingType = "quickChat" | "consultation" | "deepDive";

export default function BookingPageClient() {
  const t = useTranslation();
  const [selectedMeetingType, setSelectedMeetingType] = useState<MeetingType>("consultation");
  const [isLoadingCalendar, setIsLoadingCalendar] = useState(false);

  // Map meeting types to Cal.com event URLs
  const getCalcomUrl = (type: MeetingType): string | undefined => {
    switch (type) {
      case "quickChat":
        return process.env.NEXT_PUBLIC_CALCOM_QUICK_CHAT;
      case "consultation":
        return process.env.NEXT_PUBLIC_CALCOM_URL;
      case "deepDive":
        return process.env.NEXT_PUBLIC_CALCOM_DEEP_DIVE;
      default:
        return process.env.NEXT_PUBLIC_CALCOM_URL;
    }
  };

  // Handle meeting type change with loading state
  const handleMeetingTypeChange = (type: MeetingType) => {
    if (type !== selectedMeetingType) {
      setIsLoadingCalendar(true);
      setSelectedMeetingType(type);
      // Reset loading state after calendar loads
      setTimeout(() => setIsLoadingCalendar(false), 800);
    }
  };

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "CEO, TechStart",
      content: "Leroy's expertise in AI automation transformed our workflow. His consultation gave us clarity and a clear roadmap forward.",
      rating: 5,
    },
    {
      name: "Mark Peters",
      role: "CTO, InnovateCo",
      content: "The technical deep dive was incredibly valuable. Leroy identified bottlenecks we didn't know existed and provided actionable solutions.",
      rating: 5,
    },
    {
      name: "Lisa Chen",
      role: "Product Manager, StartupXYZ",
      content: "Professional, knowledgeable, and genuinely helpful. The 30-minute consultation exceeded my expectations.",
      rating: 5,
    },
  ];

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

  const meetingTypes = [
    {
      id: "quickChat" as MeetingType,
      icon: MessageSquare,
      title: t.booking.meetingTypes?.quickChat?.title || "Quick Chat",
      duration: t.booking.meetingTypes?.quickChat?.duration || "15 minutes",
      description: t.booking.meetingTypes?.quickChat?.description || "Brief introduction or quick question",
      color: "from-green-500 to-emerald-500",
    },
    {
      id: "consultation" as MeetingType,
      icon: Users,
      title: t.booking.meetingTypes?.consultation?.title || "Project Consultation",
      duration: t.booking.meetingTypes?.consultation?.duration || "30 minutes",
      description: t.booking.meetingTypes?.consultation?.description || "Discuss your project requirements in detail",
      color: "from-accent-primary to-blue-500",
    },
    {
      id: "deepDive" as MeetingType,
      icon: Code,
      title: t.booking.meetingTypes?.deepDive?.title || "Technical Deep Dive",
      duration: t.booking.meetingTypes?.deepDive?.duration || "60 minutes",
      description: t.booking.meetingTypes?.deepDive?.description || "In-depth technical planning and architecture review",
      color: "from-purple-500 to-pink-500",
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

      {/* Testimonials Section */}
      <section className="py-16 bg-secondary-bg border-y-2 border-surface">
        <div className="container mx-auto px-8 lg:px-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl md:text-3xl font-display font-bold mb-3">
              What Clients Say
            </h2>
            <p className="text-text-secondary">
              Trusted by professionals and businesses worldwide
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card p-6 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                  ))}
                </div>
                
                <Quote className="w-8 h-8 text-accent-primary/20 mb-3" />
                
                <p className="text-text-secondary mb-6 leading-relaxed italic">
                  "{testimonial.content}"
                </p>
                
                <div className="flex items-center gap-3 pt-4 border-t border-surface">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center text-white font-bold">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-text-primary text-sm">
                      {testimonial.name}
                    </div>
                    <div className="text-xs text-text-muted">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-24 bg-primary-bg">
        <div className="container relative z-10 mx-auto px-8 lg:px-16">
          {/* Meeting Type Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                {t.booking.meetingTypes?.title || "Choose Your Meeting Type"}
              </h2>
              <p className="text-text-secondary text-lg">
                Select the meeting format that best fits your needs
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {meetingTypes.map((type, index) => {
                const Icon = type.icon;
                const isSelected = selectedMeetingType === type.id;
                
                return (
                  <motion.button
                    key={type.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    onClick={() => handleMeetingTypeChange(type.id)}
                    whileHover={{ scale: isSelected ? 1.05 : 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`relative group card p-8 text-left transition-all duration-300 ${
                      isSelected
                        ? 'ring-2 ring-accent-primary shadow-2xl scale-105 bg-gradient-to-br from-accent-primary/10 to-accent-primary/5'
                        : 'hover:shadow-xl hover:bg-surface/80'
                    }`}
                  >
                    {/* Selection indicator */}
                    {isSelected && (
                      <motion.div
                        layoutId="selectedMeeting"
                        className="absolute inset-0 rounded-xl border-2 border-accent-primary"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    
                    <div className="relative">
                      <div className="flex items-start gap-4 mb-4">
                        <div className={`p-4 rounded-xl bg-gradient-to-br ${type.color} flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                          <Icon className="w-7 h-7 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-text-primary mb-2 text-xl">
                            {type.title}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-text-muted mb-1">
                            <Clock className="w-4 h-4" />
                            <span className="font-medium">{type.duration}</span>
                          </div>
                        </div>
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", bounce: 0.5 }}
                          >
                            <CheckCircle2 className="w-7 h-7 text-accent-primary flex-shrink-0" />
                          </motion.div>
                        )}
                      </div>
                      <p className="text-sm text-text-secondary leading-relaxed">
                        {type.description}
                      </p>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>

          {/* Full Width Calendar */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-7xl mx-auto mb-16"
          >
            <div className="relative">
              {/* Loading overlay */}
              {isLoadingCalendar && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-secondary-bg/80 backdrop-blur-sm rounded-xl z-10 flex items-center justify-center"
                >
                  <div className="text-center">
                    <div className="w-12 h-12 border-4 border-accent-primary/30 border-t-accent-primary rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-text-secondary font-medium">Loading calendar...</p>
                  </div>
                </motion.div>
              )}
              
              <div className="card p-0 overflow-hidden shadow-2xl border-2 border-surface" style={{ minHeight: '800px', height: '800px' }}>
                <div className="w-full h-full">
                  <UniversalCalendarWidget
                    url={getCalcomUrl(selectedMeetingType)}
                    styles={{ 
                      height: "800px", 
                      width: "100%",
                      minHeight: "800px"
                    }}
                    calendlyPageSettings={{
                      backgroundColor: "1a1a1a",
                      hideEventTypeDetails: false,
                      primaryColor: "0066ff",
                      textColor: "e5e5e5",
                    }}
                    calcomConfig={{
                      theme: "dark",
                    }}
                    utm={{
                      utmSource: "portfolio",
                      utmMedium: "booking_page",
                      utmCampaign: selectedMeetingType,
                    }}
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Benefits Grid Below Calendar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-7xl mx-auto mb-20"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                {t.booking.benefits.title || "What to Expect"}
              </h2>
              <p className="text-text-secondary text-lg">
                Every consultation is designed to provide maximum value
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="card p-8 hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="mb-6">
                    <div className="inline-flex p-4 rounded-xl bg-gradient-to-br from-accent-primary/20 to-accent-primary/10 group-hover:from-accent-primary/30 group-hover:to-accent-primary/20 transition-all duration-300">
                      <CheckCircle2 className="w-8 h-8 text-accent-primary" />
                    </div>
                  </div>
                  <h3 className="font-bold text-text-primary mb-3 text-xl">
                    {benefit.title}
                  </h3>
                  <p className="text-text-secondary leading-relaxed">
                    {benefit.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Alternative Actions - Full Width */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-6xl mx-auto"
          >
            <div className="text-center mb-10">
              <h3 className="text-2xl md:text-3xl font-display font-bold mb-3 text-text-primary">
                {t.booking.cta.title || "Prefer Another Way?"}
              </h3>
              <p className="text-text-secondary">
                Choose the communication method that works best for you
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {alternativeActions.map((action, index) => {
                const Icon = action.icon;
                const isExternal = action.href.startsWith("http");

                return (
                  <motion.div
                    key={action.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Link
                      href={action.href}
                      target={isExternal ? "_blank" : undefined}
                      rel={isExternal ? "noopener noreferrer" : undefined}
                      className="block card p-8 text-center hover:scale-105 hover:shadow-xl transition-all duration-300 group h-full"
                    >
                      <div className="inline-flex p-5 rounded-2xl bg-gradient-to-br from-accent-secondary/20 to-accent-secondary/10 group-hover:from-accent-secondary/30 group-hover:to-accent-secondary/20 transition-all duration-300 mb-6">
                        <Icon className="w-8 h-8 text-accent-secondary" />
                      </div>
                      <div className="font-bold text-text-primary group-hover:text-accent-secondary transition-colors mb-3 text-lg">
                        {action.title}
                      </div>
                      <div className="text-sm text-text-muted leading-relaxed">
                        {action.description}
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Hidden old sidebar structure */}
          <div className="hidden">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="lg:col-span-4 space-y-6"
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

            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
