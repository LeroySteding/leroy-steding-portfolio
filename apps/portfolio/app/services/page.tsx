"use client";

import { motion } from "framer-motion";
import { Code, Sparkles, Zap, Rocket, Globe, Database, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "@/hooks/useTranslation";
import { services } from "@/data/services";

const iconMap = {
  Code,
  Sparkles,
  Zap,
  Rocket,
  Globe,
  Database,
};

export default function ServicesPage() {
  const t = useTranslation();

  return (
    <main className="min-h-screen bg-primary-bg">
      {/* Hero Section */}
      <section className="section relative bg-gradient-to-b from-primary-bg to-secondary-bg overflow-hidden pt-32">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-72 h-72 bg-accent-primary rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent-secondary rounded-full blur-3xl" />
        </div>

        <div className="container relative z-10 mx-auto px-8 lg:px-16">
          <div className="max-w-4xl mx-auto text-center mb-20">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="font-display font-black text-5xl md:text-6xl lg:text-7xl mb-6"
            >
              Professional <span className="text-gradient">Services</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-xl text-text-secondary leading-relaxed"
            >
              Comprehensive solutions to transform your business with modern technology and AI automation
            </motion.p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section relative bg-primary-bg">
        <div className="container relative z-10 mx-auto px-8 lg:px-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const Icon = iconMap[service.icon as keyof typeof iconMap];
              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.1,
                    type: "spring",
                    stiffness: 300,
                    damping: 20,
                  }}
                  viewport={{ once: true }}
                  className="relative group h-full"
                >
                  {/* Glow effect */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-accent-primary/20 to-accent-secondary/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Card */}
                  <Link href={`/services/${service.slug}`}>
                    <div className="relative card h-full p-8 flex flex-col">
                      {/* Icon */}
                      <div
                        className={`w-16 h-16 rounded-xl bg-gradient-to-br ${service.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                      >
                        <Icon className="w-8 h-8 text-white" />
                      </div>

                      {/* Title */}
                      <h3 className="text-2xl font-display font-bold mb-4 text-text-primary group-hover:text-accent-primary transition-colors duration-300">
                        {(t.services as any)[service.titleKey]?.title || service.titleKey}
                      </h3>

                      {/* Description */}
                      <p className="text-text-secondary text-base leading-relaxed mb-6 flex-1">
                        {(t.services as any)[service.descriptionKey]?.description || ''}
                      </p>

                      {/* Features preview */}
                      <div className="mb-6">
                        <ul className="space-y-2">
                          {service.features.slice(0, 3).map((feature, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                              <span className="text-accent-primary mt-1">✓</span>
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* CTA */}
                      <div className="flex items-center gap-2 text-accent-primary text-base font-bold mt-auto">
                        Learn More
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section relative bg-secondary-bg overflow-hidden">
        <div className="container relative z-10 mx-auto px-8 lg:px-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="font-display font-black text-4xl md:text-5xl mb-6">
              Ready to Get <span className="text-gradient">Started?</span>
            </h2>
            <p className="text-xl text-text-secondary mb-10 leading-relaxed">
              Let's discuss your project and find the perfect solution for your needs
            </p>
            <Link href="/book" className="btn-primary inline-flex items-center gap-3">
              Schedule a Free Consultation
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
