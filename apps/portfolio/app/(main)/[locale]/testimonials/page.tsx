"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Calendar,
  MessageSquareQuote,
  Quote,
  Star,
} from "lucide-react";
import Link from "next/link";
import LayoutContainer, { LayoutGrid } from "@/components/ui/LayoutContainer";
import PageHero from "@/components/ui/PageHero";
import { useTranslation } from "@/hooks/useTranslation";

const testimonials = [
  {
    nameKey: "client1Name",
    roleKey: "client1Role",
    companyKey: "client1Company",
    quoteKey: "client1Quote",
    rating: 5,
  },
  {
    nameKey: "client2Name",
    roleKey: "client2Role",
    companyKey: "client2Company",
    quoteKey: "client2Quote",
    rating: 5,
  },
  {
    nameKey: "client3Name",
    roleKey: "client3Role",
    companyKey: "client3Company",
    quoteKey: "client3Quote",
    rating: 5,
  },
];

export default function TestimonialsPage() {
  const t = useTranslation();

  return (
    <main className="min-h-screen bg-primary-bg">
      {/* Hero Section */}
      <PageHero
        title="Client"
        titleHighlight="Testimonials"
        subtitle="Hear from clients who have transformed their businesses with our solutions"
        icon={MessageSquareQuote}
        breadcrumbs={[{ label: "Testimonials" }]}
        backgroundImage="https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1920&q=80"
      />

      {/* Stats Section */}
      <section className="section relative bg-primary-bg">
        <LayoutContainer>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            {[
              { value: "50+", label: "Happy Clients", icon: Star },
              { value: "100+", label: "Projects Delivered", icon: Calendar },
              { value: "5.0", label: "Average Rating", icon: Star },
              { value: "100%", label: "Satisfaction Rate", icon: Quote },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card p-6 text-center hover:scale-105 transition-transform duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-3xl font-display font-black text-gradient mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-text-secondary font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </LayoutContainer>
      </section>

      {/* Testimonials Grid */}
      <section className="section relative bg-secondary-bg">
        <LayoutContainer>
          <LayoutGrid>
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.nameKey}
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
                <div className="relative card h-full p-8 flex flex-col">
                  {/* Quote icon */}
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center mb-6">
                    <Quote className="w-6 h-6 text-white" />
                  </div>

                  {/* Rating */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 fill-yellow-500 text-yellow-500"
                      />
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="text-text-secondary text-base leading-relaxed mb-6 flex-1 italic">
                    "
                    {t.testimonials[
                      testimonial.quoteKey as keyof typeof t.testimonials
                    ] || testimonial.quoteKey}
                    "
                  </p>

                  {/* Author */}
                  <div className="border-t-2 border-surface pt-6">
                    <p className="font-bold text-lg text-text-primary">
                      {t.testimonials[
                        testimonial.nameKey as keyof typeof t.testimonials
                      ] || testimonial.nameKey}
                    </p>
                    <p className="text-text-muted text-sm">
                      {t.testimonials[
                        testimonial.roleKey as keyof typeof t.testimonials
                      ] || testimonial.roleKey}{" "}
                      ·{" "}
                      {t.testimonials[
                        testimonial.companyKey as keyof typeof t.testimonials
                      ] || testimonial.companyKey}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </LayoutGrid>
        </LayoutContainer>
      </section>

      {/* CTA Section */}
      <section className="section relative bg-primary-bg overflow-hidden">
        <LayoutContainer>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center card p-12"
          >
            <h2 className="font-display font-black text-4xl md:text-5xl mb-6">
              Ready to Join Our{" "}
              <span className="text-gradient">Success Stories?</span>
            </h2>
            <p className="text-xl text-text-secondary mb-10 leading-relaxed">
              Let's discuss how we can help you achieve your goals and become
              our next success story
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
                href="/services"
                className="btn-secondary inline-flex items-center justify-center gap-3"
              >
                View Our Services
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        </LayoutContainer>
      </section>
    </main>
  );
}
