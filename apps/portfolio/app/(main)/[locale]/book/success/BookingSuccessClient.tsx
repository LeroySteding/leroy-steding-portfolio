"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  FileText,
  Linkedin,
  Mail,
} from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

interface BookingSuccessClientProps {
  language?: string;
}

export default function BookingSuccessClient({
  language = "en",
}: BookingSuccessClientProps = {}) {
  useEffect(() => {
    // Track conversion
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "booking_completed", {
        event_category: "booking",
        event_label: "success_page_view",
        value: 1,
      });
    }
  }, []);

  const nextSteps = [
    {
      icon: Mail,
      title: "Check Your Email",
      description:
        "You'll receive a confirmation email with the meeting link and calendar invite within the next few minutes.",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Calendar,
      title: "Add to Calendar",
      description:
        "Click the calendar invite in your email to automatically add our meeting to your calendar.",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: FileText,
      title: "Prepare Your Questions",
      description:
        "Think about your project goals, technical challenges, and any specific questions you'd like to discuss.",
      color: "from-green-500 to-emerald-500",
    },
  ];

  const preparationTips = [
    "Brief overview of your project or business challenge",
    "Your main goals and success criteria",
    "Current tech stack (if applicable)",
    "Budget and timeline expectations",
    "Any specific technical questions",
  ];

  const relatedContent = [
    {
      title: "How to Prepare for a Technical Consultation",
      href: "/blog/technical-consultation-guide",
      description:
        "Get the most out of your consultation with these preparation tips",
    },
    {
      title: "Common Web Development Challenges",
      href: "/blog/web-development-challenges",
      description: "Learn about typical challenges and how to address them",
    },
    {
      title: "Choosing the Right Tech Stack",
      href: "/blog/choosing-tech-stack",
      description:
        "A guide to selecting the best technologies for your project",
    },
  ];

  return (
    <div className="min-h-screen bg-primary-bg">
      {/* Success Hero */}
      <section className="relative py-24 bg-secondary-bg overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-20">
          <div className="absolute top-1/4 -left-48 w-96 h-96 bg-green-500/30 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl" />
        </div>

        <div className="container relative z-10 mx-auto px-8 lg:px-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            {/* Success Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
              className="inline-flex p-6 rounded-full bg-gradient-to-br from-green-500/20 to-emerald-500/20 mb-8"
            >
              <div className="p-4 rounded-full bg-gradient-to-br from-green-500 to-emerald-500">
                <CheckCircle2 className="w-16 h-16 text-white" />
              </div>
            </motion.div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-black mb-6 leading-tight">
              You're All Set! 🎉
            </h1>

            <p className="text-xl md:text-2xl text-text-secondary leading-relaxed mb-8">
              Your consultation has been successfully booked. I'm looking
              forward to our conversation!
            </p>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-accent-primary hover:bg-accent-primary/90 text-white font-semibold rounded-lg transition-all duration-200 hover:scale-105 shadow-lg"
              >
                Back to Home
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 px-6 py-3 border-2 border-accent-primary text-accent-primary hover:bg-accent-primary hover:text-white font-semibold rounded-lg transition-all duration-200 hover:scale-105"
              >
                Read Blog
                <ExternalLink className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Next Steps */}
      <section className="py-20 bg-primary-bg">
        <div className="container mx-auto px-8 lg:px-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              What Happens Next?
            </h2>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">
              Here's what you can expect in the next few minutes and days
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-20">
            {nextSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="card p-8 hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="mb-6">
                    <div
                      className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${step.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <h3 className="font-bold text-text-primary mb-3 text-xl">
                    {step.title}
                  </h3>
                  <p className="text-text-secondary leading-relaxed">
                    {step.description}
                  </p>
                </motion.div>
              );
            })}
          </div>

          {/* Preparation Tips */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <div className="card p-10 bg-gradient-to-br from-accent-primary/5 to-accent-secondary/5 border-2 border-accent-primary/20">
              <div className="flex items-start gap-6 mb-8">
                <div className="p-4 rounded-xl bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20 flex-shrink-0">
                  <Clock className="w-8 h-8 text-accent-primary" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-text-primary mb-3">
                    While You Wait: Prepare for Maximum Value
                  </h3>
                  <p className="text-text-secondary leading-relaxed">
                    Come prepared to make the most of our time together. Here's
                    what to have ready:
                  </p>
                </div>
              </div>

              <ul className="space-y-3">
                {preparationTips.map((tip, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    viewport={{ once: true }}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle2 className="w-5 h-5 text-accent-primary flex-shrink-0 mt-0.5" />
                    <span className="text-text-secondary">{tip}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Related Content */}
      <section className="py-20 bg-secondary-bg border-t-2 border-surface">
        <div className="container mx-auto px-8 lg:px-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Recommended Reading
            </h2>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">
              Get a head start by exploring these helpful resources
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {relatedContent.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Link
                  href={item.href}
                  className="block card p-6 hover:shadow-xl transition-all duration-300 group h-full"
                >
                  <h3 className="font-bold text-text-primary mb-3 text-lg group-hover:text-accent-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-text-secondary text-sm leading-relaxed mb-4">
                    {item.description}
                  </p>
                  <div className="flex items-center gap-2 text-accent-primary font-medium text-sm">
                    <span>Read more</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stay Connected */}
      <section className="py-20 bg-primary-bg">
        <div className="container mx-auto px-8 lg:px-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center card p-12 bg-gradient-to-br from-accent-primary/10 to-accent-secondary/10 border-2 border-accent-primary/20"
          >
            <h2 className="text-2xl md:text-3xl font-display font-bold mb-4">
              Let's Stay Connected
            </h2>
            <p className="text-text-secondary mb-8 text-lg">
              Follow me on LinkedIn for tech insights, project updates, and
              industry news
            </p>
            <Link
              href="https://linkedin.com/in/leroysteding"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 bg-accent-secondary hover:bg-accent-secondary/90 text-white font-semibold text-lg rounded-lg transition-all duration-200 hover:scale-105 shadow-lg"
            >
              <Linkedin className="w-6 h-6" />
              Connect on LinkedIn
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
