"use client";

import { motion } from "framer-motion";
import { ArrowRight, Clock, FileText, Users } from "lucide-react";
import Link from "next/link";
import { useLayout } from "@/contexts/LayoutContext";
import { useTranslation } from "@/hooks/useTranslation";

const tools = [
  {
    icon: "💰",
    titleKey: "belastingbot",
    url: "https://zzp-tax-app.vercel.app",
    gradient: "from-green-500 to-emerald-500",
    available: true,
  },
  {
    icon: "📄",
    titleKey: "factuurApp",
    url: "https://zzp-factuur-app.vercel.app",
    gradient: "from-blue-500 to-cyan-500",
    available: true,
  },
  {
    icon: "🤝",
    titleKey: "klantportaal",
    url: "#",
    gradient: "from-purple-500 to-pink-500",
    available: false,
  },
];

export default function ZZPTools() {
  const t = useTranslation();
  const { containerClass, gridClass } = useLayout();

  return (
    <section
      id="zzp-tools"
      className="section relative bg-secondary-bg overflow-hidden"
    >
      {/* Subtle accent line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-accent-secondary to-transparent" />

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
            {t.zzpTools.title}{" "}
            <span className="text-gradient">{t.zzpTools.titleHighlight}</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-base sm:text-lg md:text-xl text-text-secondary max-w-3xl mx-auto mb-8"
          >
            {t.zzpTools.subtitle}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="w-32 h-2 bg-accent-secondary rounded-full mx-auto"
          />
        </div>

        {/* Tools grid */}
        <div className={`${gridClass} mb-12 sm:mb-14 md:mb-16`}>
          {tools.map((tool, index) => {
            return (
              <motion.div
                key={tool.titleKey}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                whileHover={tool.available ? { y: -8, scale: 1.02 } : {}}
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
                {tool.available && (
                  <div className="absolute -inset-1 bg-gradient-to-r from-accent-secondary/20 to-accent-primary/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                )}

                {/* Card */}
                <div
                  className={`relative card h-full p-6 sm:p-7 md:p-8 flex flex-col items-center text-center ${
                    !tool.available ? "opacity-75" : ""
                  }`}
                >
                  {/* Coming Soon Badge */}
                  {!tool.available && (
                    <div className="absolute top-4 right-4 px-3 py-1.5 rounded-lg bg-accent-secondary text-white text-xs font-bold shadow-lg">
                      {t.zzpTools.comingSoon}
                    </div>
                  )}

                  {/* Icon */}
                  <div
                    className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-gradient-to-br ${tool.gradient} flex items-center justify-center mb-5 sm:mb-6 group-hover:scale-110 transition-transform duration-300 text-4xl sm:text-5xl`}
                  >
                    {tool.icon}
                  </div>

                  {/* Title */}
                  <h3 className="text-xl sm:text-2xl font-display font-bold mb-3 sm:mb-4 text-text-primary group-hover:text-accent-secondary transition-colors duration-300">
                    {
                      (
                        t.zzpTools.tools[
                          tool.titleKey as keyof typeof t.zzpTools.tools
                        ] as { title: string; description: string }
                      ).title
                    }
                  </h3>

                  {/* Description */}
                  <p className="text-text-secondary text-sm sm:text-base leading-relaxed mb-6 flex-1">
                    {
                      (
                        t.zzpTools.tools[
                          tool.titleKey as keyof typeof t.zzpTools.tools
                        ] as { title: string; description: string }
                      ).description
                    }
                  </p>

                  {/* CTA Button */}
                  {tool.available ? (
                    <Link
                      href={tool.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary inline-flex items-center gap-2 min-h-[48px]"
                    >
                      {t.zzpTools.tryNow}
                      <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </Link>
                  ) : (
                    <button
                      disabled
                      className="btn-secondary opacity-50 cursor-not-allowed inline-flex items-center gap-2 min-h-[48px]"
                    >
                      <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
                      {t.zzpTools.comingSoon}
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Feature highlights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-accent-secondary/10 flex items-center justify-center">
                <Clock className="w-6 h-6 text-accent-secondary" />
              </div>
              <p className="text-text-primary font-semibold">
                {t.zzpTools.features.fast}
              </p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-accent-secondary/10 flex items-center justify-center">
                <FileText className="w-6 h-6 text-accent-secondary" />
              </div>
              <p className="text-text-primary font-semibold">
                {t.zzpTools.features.simple}
              </p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-accent-secondary/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-accent-secondary" />
              </div>
              <p className="text-text-primary font-semibold">
                {t.zzpTools.features.zzp}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
