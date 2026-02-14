"use client";

import { motion } from "framer-motion";
import { Briefcase, Code2, GitBranch, Users } from "lucide-react";
import { useEffect, useState } from "react";

interface Stat {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  suffix?: string;
}

export default function LiveStats() {
  const [stats, setStats] = useState<Stat[]>([
    {
      icon: <Briefcase className="w-5 h-5" />,
      value: 0,
      label: "Projects Delivered",
      suffix: "+",
    },
    {
      icon: <Code2 className="w-5 h-5" />,
      value: 0,
      label: "Years Experience",
      suffix: "+",
    },
    {
      icon: <GitBranch className="w-5 h-5" />,
      value: 0,
      label: "GitHub Commits",
      suffix: "+",
    },
    {
      icon: <Users className="w-5 h-5" />,
      value: 0,
      label: "Happy Clients",
      suffix: "+",
    },
  ]);

  useEffect(() => {
    // Animate counting up
    const targets = [25, 8, 1234, 15];
    const duration = 2000; // 2 seconds
    const steps = 60;
    const interval = duration / steps;

    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;

      setStats((prev) =>
        prev.map((stat, index) => ({
          ...stat,
          value: Math.floor(targets[index] * progress),
        })),
      );

      if (currentStep >= steps) {
        clearInterval(timer);
        // Set final values
        setStats((prev) =>
          prev.map((stat, index) => ({
            ...stat,
            value: targets[index],
          })),
        );
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.6 }}
      className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-8 sm:mt-12 max-w-4xl mx-auto lg:mx-0"
    >
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
          className="relative group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-accent-primary/20 to-accent-secondary/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          <div className="relative bg-surface/50 backdrop-blur-sm border border-border hover:border-accent-primary/50 rounded-xl p-4 sm:p-6 transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between mb-2">
              <div className="text-accent-primary group-hover:text-accent-secondary transition-colors duration-300">
                {stat.icon}
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-gradient">
                {stat.value}
                {stat.suffix}
              </div>
            </div>
            <p className="text-xs sm:text-sm text-text-muted group-hover:text-text-secondary transition-colors duration-300">
              {stat.label}
            </p>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
