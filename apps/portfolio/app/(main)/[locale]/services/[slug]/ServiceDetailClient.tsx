"use client";

import { motion } from "framer-motion";
import {
  Activity,
  ArrowLeft,
  Award,
  Briefcase,
  Calendar,
  Check,
  Clock,
  Code,
  Database,
  FileCode,
  GitBranch,
  Globe,
  GraduationCap,
  Heart,
  Layers,
  Package,
  Rocket,
  Search,
  Shield,
  Smartphone,
  Sparkles,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";
import Link from "next/link";
import type { Service } from "@/data/services";
import { useTranslation } from "@/hooks/useTranslation";

const iconMap = {
  Code,
  Sparkles,
  Zap,
  Rocket,
  Globe,
  Database,
  TrendingUp,
  Clock,
  Target,
  Activity,
  Shield,
  Award,
  Briefcase,
  Heart,
  GraduationCap,
  Layers,
  Package,
  GitBranch,
  FileCode,
  Smartphone,
  Search,
};

interface ServiceDetailClientProps {
  service: Service;
}

export default function ServiceDetailClient({
  service,
}: ServiceDetailClientProps) {
  const t = useTranslation();
  const Icon = iconMap[service.icon as keyof typeof iconMap];

  return (
    <main className="min-h-screen bg-primary-bg">
      {/* Hero Section */}
      <section className="section relative bg-gradient-to-b from-primary-bg to-secondary-bg overflow-hidden pt-32">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-96 h-96 bg-accent-primary rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-accent-secondary rounded-full blur-3xl" />
        </div>

        <div className="container relative z-10 mx-auto px-8 lg:px-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <Link
              href="/services"
              className="inline-flex items-center gap-2 text-text-secondary hover:text-accent-primary transition-colors duration-200 group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" />
              <span className="font-medium">Back to Services</span>
            </Link>
          </motion.div>

          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br ${service.gradient} mb-8`}
            >
              <Icon className="w-10 h-10 text-white" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="font-display font-black text-5xl md:text-6xl lg:text-7xl mb-6"
            >
              {t.services[service.titleKey as keyof typeof t.services]?.title ||
                service.titleKey}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-xl text-text-secondary leading-relaxed mb-10"
            >
              {t.services[service.titleKey as keyof typeof t.services]
                ?.description || service.descriptionKey}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Link
                href="/book"
                className="btn-primary inline-flex items-center gap-3"
              >
                <Calendar className="w-5 h-5" />
                Book a Consultation
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section relative bg-primary-bg">
        <div className="container relative z-10 mx-auto px-8 lg:px-16">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {service.stats.map((stat, index) => {
                const StatIcon = iconMap[stat.icon as keyof typeof iconMap];
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="card p-6 text-center hover:scale-105 transition-transform duration-300"
                  >
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${service.gradient} flex items-center justify-center mx-auto mb-4`}
                    >
                      <StatIcon className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-3xl font-display font-black text-gradient mb-2">
                      {stat.value}
                    </div>
                    <div className="text-sm text-text-secondary font-medium">
                      {stat.label}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section relative bg-secondary-bg">
        <div className="container relative z-10 mx-auto px-8 lg:px-16">
          <div className="max-w-6xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="font-display font-black text-4xl md:text-5xl mb-12 text-center"
            >
              What's <span className="text-gradient">Included</span>
            </motion.h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {service.features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="card p-6 flex items-start gap-4 hover:border-accent-primary transition-colors duration-300"
                >
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-text-primary font-medium">{feature}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Case Studies Section */}
      {service.caseStudies && service.caseStudies.length > 0 && (
        <section className="section relative bg-primary-bg">
          <div className="container relative z-10 mx-auto px-8 lg:px-16">
            <div className="max-w-6xl mx-auto">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="font-display font-black text-4xl md:text-5xl mb-12 text-center"
              >
                Success <span className="text-gradient">Stories</span>
              </motion.h2>

              <div className="grid md:grid-cols-2 gap-8">
                {service.caseStudies.map((caseStudy, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                    viewport={{ once: true }}
                    className="card p-8 hover:shadow-2xl transition-shadow duration-300"
                  >
                    <h3 className="text-2xl font-display font-bold mb-4 text-text-primary">
                      {caseStudy.title}
                    </h3>
                    <p className="text-text-secondary leading-relaxed mb-6">
                      {caseStudy.description}
                    </p>
                    <div className="space-y-3">
                      <p className="text-sm font-bold text-accent-primary uppercase tracking-wide">
                        Key Results
                      </p>
                      {caseStudy.results.map((result, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center flex-shrink-0">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                          <p className="text-text-primary font-medium">
                            {result}
                          </p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Process Section */}
      <section className="section relative bg-secondary-bg">
        <div className="container relative z-10 mx-auto px-8 lg:px-16">
          <div className="max-w-6xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="font-display font-black text-4xl md:text-5xl mb-12 text-center"
            >
              Our <span className="text-gradient">Process</span>
            </motion.h2>

            <div className="space-y-8">
              {service.processSteps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="card p-8 flex gap-6 hover:shadow-xl transition-shadow duration-300"
                >
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${service.gradient} flex items-center justify-center flex-shrink-0 font-bold text-white text-xl`}
                  >
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-display font-bold mb-3 text-text-primary">
                      {step.titleKey}
                    </h3>
                    <p className="text-text-secondary leading-relaxed">
                      {step.descriptionKey}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Technologies Section */}
      <section className="section relative bg-primary-bg">
        <div className="container relative z-10 mx-auto px-8 lg:px-16">
          <div className="max-w-6xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="font-display font-black text-4xl md:text-5xl mb-12 text-center"
            >
              Technologies <span className="text-gradient">We Use</span>
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="flex flex-wrap gap-4 justify-center"
            >
              {service.technologies.map((tech, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.1 }}
                  className="px-6 py-3 text-base font-bold rounded-xl bg-surface text-text-secondary border-2 border-surface hover:border-accent-primary hover:text-accent-primary transition-all duration-300 cursor-default"
                >
                  {tech}
                </motion.span>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="section relative bg-secondary-bg">
        <div className="container relative z-10 mx-auto px-8 lg:px-16">
          <div className="max-w-6xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="font-display font-black text-4xl md:text-5xl mb-12 text-center"
            >
              Key <span className="text-gradient">Benefits</span>
            </motion.h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {service.benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -8 }}
                  className="card p-6 text-center"
                >
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${service.gradient} flex items-center justify-center mx-auto mb-4`}
                  >
                    <Check className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-text-primary font-bold">{benefit}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section relative bg-primary-bg overflow-hidden">
        <div className="container relative z-10 mx-auto px-8 lg:px-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center card p-12"
          >
            <h2 className="font-display font-black text-4xl md:text-5xl mb-6">
              Ready to Transform Your{" "}
              <span className="text-gradient">Business?</span>
            </h2>
            <p className="text-xl text-text-secondary mb-10 leading-relaxed">
              Let's discuss how{" "}
              {(
                t.services[service.titleKey as keyof typeof t.services]
                  ?.title || service.titleKey
              ).toLowerCase()}{" "}
              can help you achieve your goals
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/book"
                className="btn-primary inline-flex items-center justify-center gap-3"
              >
                <Calendar className="w-5 h-5" />
                Schedule Free Consultation
              </Link>
              <Link
                href="/contact"
                className="btn-secondary inline-flex items-center justify-center gap-3"
              >
                Contact Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
