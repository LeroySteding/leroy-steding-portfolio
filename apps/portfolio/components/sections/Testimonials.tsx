"use client";

import { motion } from "framer-motion";
import { ArrowRight, Quote, Star } from "lucide-react";
import Link from "next/link";
import { useLayout } from "@/contexts/LayoutContext";
import { useTranslation } from "@/hooks/useTranslation";
import { useLocalizedPath } from "@/lib/localization";

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

export default function Testimonials() {
  const t = useTranslation();
  const getLocalizedPath = useLocalizedPath();
  const { containerClass, gridClass } = useLayout();

  return (
    <section
      id="testimonials"
      className="section relative bg-secondary-bg overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 right-10 w-96 h-96 bg-accent-primary rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-72 h-72 bg-accent-secondary rounded-full blur-3xl" />
      </div>

      <div className={`relative z-10 ${containerClass}`}>
        {/* Section header */}
        <div className="mb-20 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="font-display font-black mb-6"
          >
            Client <span className="text-gradient">Testimonials</span>
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="w-32 h-2 bg-accent-primary rounded-full mx-auto"
          />
        </div>

        {/* Testimonials grid */}
        <div className={`${gridClass} mb-16`}>
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
                  {String(
                    t.testimonials[
                      testimonial.quoteKey as keyof typeof t.testimonials
                    ] || "",
                  )}
                  "
                </p>

                {/* Author */}
                <div className="border-t-2 border-surface pt-6">
                  <p className="font-bold text-lg text-text-primary">
                    {String(
                      t.testimonials[
                        testimonial.nameKey as keyof typeof t.testimonials
                      ] || "",
                    )}
                  </p>
                  <p className="text-text-muted text-sm">
                    {String(
                      t.testimonials[
                        testimonial.roleKey as keyof typeof t.testimonials
                      ] || "",
                    )}{" "}
                    ·{" "}
                    {String(
                      t.testimonials[
                        testimonial.companyKey as keyof typeof t.testimonials
                      ] || "",
                    )}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="text-xl text-text-secondary mb-8 font-medium">
            See what more clients have to say
          </p>
          <Link
            href={getLocalizedPath("/testimonials")}
            className="btn-secondary inline-flex items-center gap-3"
          >
            View All Testimonials
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
