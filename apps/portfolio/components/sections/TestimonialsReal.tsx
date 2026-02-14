"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import Image from "next/image";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  companyUrl?: string;
  image: string;
  quote: string;
  projectLink?: string;
  projectName?: string;
}

const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Jan Bakker",
    role: "CEO",
    company: "TechCorp",
    image: "/testimonials/jan-bakker.jpg",
    quote:
      "Leroy leverde een uitzonderlijk AI-aangedreven platform dat onze bedrijfsvoering transformeerde. Zijn expertise in full-stack ontwikkeling en automatisering is ongeëvenaard.",
  },
  {
    id: "2",
    name: "Sophie de Vries",
    role: "CTO",
    company: "InnovateLab",
    companyUrl: "https://innovatelab.nl",
    image: "/testimonials/sophie-devries.jpg",
    quote:
      "Samenwerken met Leroy was een game-changer. Hij leverde niet alleen een robuust SaaS-platform, maar bood ook waardevolle technische begeleiding gedurende het hele project.",
    projectLink: "https://innovatelab.nl/case-study",
    projectName: "InnovateLab Platform",
  },
  {
    id: "3",
    name: "Michael Chen",
    role: "Founder",
    company: "StartupX",
    image: "/testimonials/michael-chen.jpg",
    quote:
      "Leroy's vermogen om complexe vereisten te begrijpen en deze te vertalen naar elegante, schaalbare oplossingen is opmerkelijk. Zeer aanbevolen!",
  },
];

export default function TestimonialsReal() {
  return (
    <section className="py-24 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Client Testimonials
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Don't just take my word for it — hear from clients who've worked
            with me on real projects.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group"
            >
              <div className="h-full bg-card border border-border rounded-2xl p-8 hover:shadow-xl transition-all duration-300 hover:border-primary/50 flex flex-col">
                {/* Quote Icon */}
                <div className="mb-6">
                  <Quote className="h-10 w-10 text-primary/20 group-hover:text-primary/40 transition-colors" />
                </div>

                {/* Testimonial Text */}
                <blockquote className="text-foreground/90 leading-relaxed mb-8 flex-grow">
                  "{testimonial.quote}"
                </blockquote>

                {/* Author Info */}
                <div className="flex items-center gap-4 border-t border-border/50 pt-6">
                  <div className="relative h-14 w-14 rounded-full overflow-hidden bg-muted flex-shrink-0">
                    {testimonial.image ? (
                      <Image
                        src={testimonial.image}
                        alt={testimonial.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-primary/10 text-primary font-bold text-lg">
                        {testimonial.name.charAt(0)}
                      </div>
                    )}
                  </div>

                  <div className="flex-grow min-w-0">
                    <p className="font-semibold text-foreground truncate">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role} at {testimonial.company}
                    </p>
                    {testimonial.projectLink && testimonial.projectName && (
                      <a
                        href={testimonial.projectLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline inline-flex items-center gap-1 mt-1"
                      >
                        View Project →
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-16"
        >
          <p className="text-muted-foreground mb-4">Want to work together?</p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
          >
            Get in Touch
          </a>
        </motion.div>
      </div>
    </section>
  );
}
