"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Code,
  Database,
  Globe,
  Rocket,
  Sparkles,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useLayout } from "@/contexts/LayoutContext";
import { useTranslation } from "@/hooks/useTranslation";
import { useLocalizedPath } from "@/lib/localization";

const services = [
  {
    icon: Code,
    titleKey: "webDevelopment",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: Sparkles,
    titleKey: "aiAutomation",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    icon: Zap,
    titleKey: "apiIntegration",
    gradient: "from-orange-500 to-red-500",
  },
  {
    icon: Rocket,
    titleKey: "consulting",
    gradient: "from-green-500 to-emerald-500",
  },
  {
    icon: Globe,
    titleKey: "fullStack",
    gradient: "from-indigo-500 to-blue-500",
  },
  {
    icon: Database,
    titleKey: "cloudInfra",
    gradient: "from-violet-500 to-purple-500",
  },
];

export default function Services() {
  const t = useTranslation();
  const getLocalizedPath = useLocalizedPath();
  const { containerClass, gridClass } = useLayout();

  // Only show first 3 services on homepage
  const displayedServices = services.slice(0, 3);

  return (
    <section
      id="services"
      className="section relative bg-primary-bg overflow-hidden"
    >
      {/* Subtle accent line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-accent-primary to-transparent" />

      <div className={`relative z-10 ${containerClass}`}>
        {/* Section header */}
        <div className="mb-12 sm:mb-16 md:mb-20 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="font-display font-black mb-6"
          >
            What I <span className="text-gradient">Offer</span>
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="w-32 h-2 bg-accent-primary rounded-full mx-auto"
          />
        </div>

        {/* Services grid */}
        <div className={`${gridClass} mb-12 sm:mb-14 md:mb-16`}>
          {displayedServices.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.titleKey}
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
                <div className="relative card h-full p-6 sm:p-7 md:p-8 flex flex-col items-center text-center">
                  {/* Icon */}
                  <div
                    className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-br ${service.gradient} flex items-center justify-center mb-5 sm:mb-6 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl sm:text-2xl font-display font-bold mb-3 sm:mb-4 text-text-primary group-hover:text-accent-primary transition-colors duration-300">
                    {(t.services as any)[service.titleKey]?.title ||
                      service.titleKey}
                  </h3>

                  {/* Description */}
                  <p className="text-text-secondary text-sm sm:text-base leading-relaxed">
                    {(t.services as any)[service.titleKey]?.description || ""}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="text-base sm:text-lg md:text-xl text-text-secondary mb-6 sm:mb-8 font-medium">
            Explore all our professional services
          </p>
          <Link
            href={getLocalizedPath("/services")}
            className="btn-secondary inline-flex items-center gap-2 sm:gap-3 min-h-[48px]"
          >
            View All Services
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
