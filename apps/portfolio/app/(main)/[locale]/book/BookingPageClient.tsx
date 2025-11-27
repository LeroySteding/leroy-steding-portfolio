"use client";

import { motion } from "framer-motion";
import {
  Calendar,
  CheckCircle2,
  ChevronDown,
  Clock,
  Code,
  ExternalLink,
  HelpCircle,
  Linkedin,
  Mail,
  MessageSquare,
  Quote,
  Shield,
  Star,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import LayoutContainer from "@/components/ui/LayoutContainer";
import PageHero from "@/components/ui/PageHero";
import UniversalCalendarWidget from "@/components/ui/UniversalCalendarWidget";
import { useTranslation } from "@/hooks/useTranslation";

type MeetingType = "quickChat" | "consultation" | "deepDive";

export default function BookingPageClient() {
  const t = useTranslation();
  const [selectedMeetingType, setSelectedMeetingType] =
    useState<MeetingType>("consultation");
  const [isLoadingCalendar, setIsLoadingCalendar] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0); // First FAQ open by default

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
      name: "Sarah M.",
      role: "Startup Founder",
      company: "SaaS Platform",
      content:
        "The consultation was incredibly valuable. Leroy helped us make critical architecture decisions that saved us months of technical debt. His insights on scaling our platform were spot-on.",
      rating: 5,
      highlight: "Architecture Review",
      image: null, // Add actual image path when available
    },
    {
      name: "Thomas V.",
      role: "CTO",
      company: "E-commerce Company",
      content:
        "Leroy's technical expertise is outstanding. He quickly identified performance bottlenecks in our system and provided actionable solutions. The ROI from that one consultation was remarkable.",
      rating: 5,
      highlight: "Performance Optimization",
      image: null,
    },
    {
      name: "Maria K.",
      role: "Product Manager",
      company: "Tech Startup",
      content:
        "Professional, clear communication, and genuinely helpful. The 30-minute consultation gave us exactly what we needed to move forward with confidence.",
      rating: 5,
      highlight: "Project Planning",
      image: null,
    },
  ];

  const faqs = [
    {
      question: "What should I prepare for the consultation?",
      answer:
        "Come with a brief overview of your project or challenge, your main goals, and any specific technical questions. If you have existing documentation, architecture diagrams, or code repositories, feel free to share them 24 hours before our call.",
    },
    {
      question: "Which meeting type should I choose?",
      answer:
        "Choose Quick Chat (15 min) for brief questions or introductions. Project Consultation (30 min) is perfect for most projects and requirement discussions. Technical Deep Dive (60 min) is ideal for complex systems, architecture reviews, or comprehensive technical planning.",
    },
    {
      question: "What if I need to reschedule or cancel?",
      answer:
        "No problem! You can reschedule or cancel anytime through the confirmation email link. I ask for at least 4 hours notice when possible, but I understand things come up.",
    },
    {
      question: "What happens after I book?",
      answer:
        "You'll receive an immediate confirmation email with a Google Meet link and calendar invite. You'll also get reminder emails 24 hours and 1 hour before our scheduled time.",
    },
    {
      question: "What timezone are the times shown in?",
      answer:
        "Times are automatically shown in your local timezone. The system detects your timezone from your browser. All meetings are flexible and can accommodate clients worldwide.",
    },
    {
      question: "Is this consultation really free?",
      answer:
        "Yes! The initial consultation is completely free with no obligation. It's an opportunity for us to discuss your needs and see if we're a good fit to work together.",
    },
  ];

  const benefits = t.booking.benefits.items || [
    {
      title: "Free Consultation",
      description: "No obligation, just valuable insights for your project",
    },
    {
      title: "Technical Expertise",
      description:
        "Get expert advice on architecture, tech stack, and implementation",
    },
    {
      title: "Clear Next Steps",
      description:
        "Walk away with actionable recommendations and timeline estimates",
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
      description:
        t.booking.meetingTypes?.quickChat?.description ||
        "Brief introduction or quick question",
      color: "from-green-500 to-emerald-500",
    },
    {
      id: "consultation" as MeetingType,
      icon: Users,
      title:
        t.booking.meetingTypes?.consultation?.title || "Project Consultation",
      duration: t.booking.meetingTypes?.consultation?.duration || "30 minutes",
      description:
        t.booking.meetingTypes?.consultation?.description ||
        "Discuss your project requirements in detail",
      color: "from-accent-primary to-blue-500",
    },
    {
      id: "deepDive" as MeetingType,
      icon: Code,
      title: t.booking.meetingTypes?.deepDive?.title || "Technical Deep Dive",
      duration: t.booking.meetingTypes?.deepDive?.duration || "60 minutes",
      description:
        t.booking.meetingTypes?.deepDive?.description ||
        "In-depth technical planning and architecture review",
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
      <PageHero
        title={t.booking.hero.title}
        titleHighlight={t.booking.hero.titleHighlight}
        subtitle={t.booking.hero.subtitle}
        icon={Calendar}
        breadcrumbs={[{ label: "Book" }]}
        backgroundImage="https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=1920&q=80"
      >
        {/* Trust Indicators */}
        <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
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
      </PageHero>

      {/* Testimonials Section */}
      <section className="py-20 bg-secondary-bg border-y-2 border-surface">
        <LayoutContainer>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-4">
              What Clients Say
            </h2>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">
              Trusted by professionals and businesses worldwide to deliver
              exceptional results
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 xl:grid-cols-3 gap-6 lg:gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative group"
              >
                {/* Highlight badge */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                  <div className="px-4 py-1.5 rounded-full bg-gradient-to-r from-accent-primary to-accent-secondary text-white text-xs font-bold shadow-lg">
                    {testimonial.highlight}
                  </div>
                </div>

                <div className="card p-8 hover:shadow-2xl transition-all duration-300 h-full flex flex-col">
                  {/* Stars */}
                  <div className="flex items-center gap-1 mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={`star-${testimonial.name}-${i}`}
                        className="w-5 h-5 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>

                  {/* Quote icon */}
                  <Quote className="w-10 h-10 text-accent-primary/30 mb-4" />

                  {/* Content */}
                  <p className="text-text-secondary mb-6 leading-relaxed text-base flex-grow">
                    "{testimonial.content}"
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-4 pt-6 border-t border-surface">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:scale-110 transition-transform">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-text-primary text-base mb-1">
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-text-muted">
                        {testimonial.role}
                      </div>
                      <div className="text-xs text-accent-primary font-medium">
                        {testimonial.company}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </LayoutContainer>
      </section>

      {/* Main Content */}
      <section className="py-24 bg-primary-bg">
        <LayoutContainer>
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

            <div className="grid md:grid-cols-3 gap-6">
              {meetingTypes.map((type, index) => {
                const Icon = type.icon;
                const isSelected = selectedMeetingType === type.id;

                return (
                  <motion.button
                    type="button"
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
                        ? "ring-2 ring-accent-primary shadow-2xl scale-105 bg-gradient-to-br from-accent-primary/10 to-accent-primary/5"
                        : "hover:shadow-xl hover:bg-surface/80"
                    }`}
                  >
                    {/* Selection indicator */}
                    {isSelected && (
                      <motion.div
                        layoutId="selectedMeeting"
                        className="absolute inset-0 rounded-xl border-2 border-accent-primary"
                        transition={{
                          type: "spring",
                          bounce: 0.2,
                          duration: 0.6,
                        }}
                      />
                    )}

                    <div className="relative">
                      <div className="flex items-start gap-4 mb-4">
                        <div
                          className={`p-4 rounded-xl bg-gradient-to-br ${type.color} flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                        >
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
            className="mb-16"
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
                    <p className="text-text-secondary font-medium">
                      Loading calendar...
                    </p>
                  </div>
                </motion.div>
              )}

              <div
                className="card p-0 overflow-hidden shadow-2xl border-2 border-surface"
                style={{ minHeight: "800px", height: "800px" }}
              >
                <div className="w-full h-full">
                  <UniversalCalendarWidget
                    url={getCalcomUrl(selectedMeetingType)}
                    styles={{
                      height: "800px",
                      width: "100%",
                      minHeight: "800px",
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
            className="mb-20"
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
            className=""
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

          {/* FAQ Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mt-24"
          >
            <div className="text-center mb-12">
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20 mb-6"
              >
                <HelpCircle className="w-8 h-8 text-accent-primary" />
              </motion.div>
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-text-secondary text-lg">
                Everything you need to know about booking a consultation
              </p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => {
                const isOpen = openFaqIndex === index;
                const faqKey = faq.question
                  .slice(0, 20)
                  .replace(/\s+/g, "-")
                  .toLowerCase();

                return (
                  <motion.div
                    key={faqKey}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    viewport={{ once: true }}
                    className="card overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                      className="w-full text-left p-6 flex items-start justify-between gap-4 hover:bg-surface/50 transition-colors"
                    >
                      <div className="flex-1">
                        <h3 className="font-bold text-text-primary text-lg mb-1">
                          {faq.question}
                        </h3>
                        {isOpen && (
                          <motion.p
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="text-text-secondary leading-relaxed mt-3"
                          >
                            {faq.answer}
                          </motion.p>
                        )}
                      </div>
                      <motion.div
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex-shrink-0"
                      >
                        <ChevronDown
                          className={`w-6 h-6 ${isOpen ? "text-accent-primary" : "text-text-muted"}`}
                        />
                      </motion.div>
                    </button>
                  </motion.div>
                );
              })}
            </div>

            {/* Still have questions CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="mt-12 text-center card p-8 bg-gradient-to-br from-accent-primary/5 to-accent-secondary/5 border-2 border-accent-primary/20"
            >
              <h3 className="text-xl font-bold text-text-primary mb-3">
                Still have questions?
              </h3>
              <p className="text-text-secondary mb-6">
                Feel free to reach out directly. I'm here to help!
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link
                  href="mailto:leroy@steding.digital"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-accent-primary hover:bg-accent-primary/90 text-white font-semibold transition-all hover:scale-105"
                >
                  <Mail className="w-5 h-5" />
                  Send an Email
                </Link>
                <Link
                  href="https://linkedin.com/in/leroysteding"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border-2 border-accent-secondary text-accent-secondary hover:bg-accent-secondary hover:text-white font-semibold transition-all hover:scale-105"
                >
                  <Linkedin className="w-5 h-5" />
                  Connect on LinkedIn
                </Link>
              </div>
            </motion.div>
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
        </LayoutContainer>
      </section>
    </div>
  );
}
