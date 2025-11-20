"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Mail, Calendar, Download, ExternalLink } from "lucide-react";

interface CTAProps {
  variant?: "primary" | "secondary" | "contact" | "project" | "collaboration";
  title?: string;
  description?: string;
  primaryButton?: {
    text: string;
    href: string;
    icon?: "arrow" | "mail" | "calendar" | "download" | "external";
  };
  secondaryButton?: {
    text: string;
    href: string;
    icon?: "arrow" | "mail" | "calendar" | "download" | "external";
  };
  className?: string;
}

const iconMap = {
  arrow: ArrowRight,
  mail: Mail,
  calendar: Calendar,
  download: Download,
  external: ExternalLink,
};

export default function CTA({
  variant = "primary",
  title,
  description,
  primaryButton,
  secondaryButton,
  className = "",
}: CTAProps) {
  // Preset configurations based on variant
  const presets = {
    primary: {
      title: "Let's Build Something Amazing Together",
      description: "Have a project in mind? Let's discuss how we can bring your ideas to life with cutting-edge technology and innovative solutions.",
      primaryButton: { text: "Start a Conversation", href: "/contact", icon: "mail" as const },
      secondaryButton: { text: "View My Work", href: "/#projects", icon: "arrow" as const },
    },
    secondary: {
      title: "Ready to Collaborate?",
      description: "I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision.",
      primaryButton: { text: "Get in Touch", href: "/contact", icon: "mail" as const },
    },
    contact: {
      title: "Let's Talk",
      description: "Whether you have a question, want to discuss a project, or just want to connect, I'd love to hear from you.",
      primaryButton: { text: "Send a Message", href: "/contact", icon: "mail" as const },
      secondaryButton: { text: "Schedule a Call", href: "/book", icon: "calendar" as const },
    },
    project: {
      title: "Interested in Similar Work?",
      description: "I'd love to help you build something great. Let's discuss your project requirements and how I can contribute to your success.",
      primaryButton: { text: "Discuss Your Project", href: "/contact", icon: "mail" as const },
      secondaryButton: { text: "View More Projects", href: "/#projects", icon: "arrow" as const },
    },
    collaboration: {
      title: "Want to Work Together?",
      description: "I'm always looking for exciting opportunities to collaborate on innovative projects and create impactful solutions.",
      primaryButton: { text: "Let's Connect", href: "/contact", icon: "mail" as const },
      secondaryButton: { text: "Download Resume", href: "/cv/leroy-steding-resume.pdf", icon: "download" as const },
    },
  };

  const preset = presets[variant];
  
  const config = {
    title: title || preset.title,
    description: description || preset.description,
    primaryButton: primaryButton || preset.primaryButton,
    secondaryButton: secondaryButton || (preset as any).secondaryButton,
  };

  const PrimaryIcon = config.primaryButton?.icon ? iconMap[config.primaryButton.icon] : ArrowRight;
  const SecondaryIcon = config.secondaryButton?.icon && config.secondaryButton.icon in iconMap 
    ? iconMap[config.secondaryButton.icon as keyof typeof iconMap] 
    : ArrowRight;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className={`relative group ${className}`}
    >
      {/* Glow effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-accent-primary/20 to-accent-secondary/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Card content */}
      <div className="relative card p-12 text-center">
        {/* Decorative gradient orb */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-accent-primary/10 to-accent-secondary/10 rounded-full blur-3xl opacity-50" />
        
        <div className="relative z-10 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-display font-black text-text-primary mb-4">
            {config.title}
          </h2>
          
          <p className="text-lg text-text-secondary mb-8 leading-relaxed">
            {config.description}
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {config.primaryButton && (
              <Link
                href={config.primaryButton.href}
                className="btn-primary w-full sm:w-auto"
                target={config.primaryButton.href.startsWith('http') ? '_blank' : undefined}
                rel={config.primaryButton.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              >
                {config.primaryButton.text}
                <PrimaryIcon className="w-5 h-5" />
              </Link>
            )}
            
            {config.secondaryButton && (
              <Link
                href={config.secondaryButton.href}
                className="btn-secondary w-full sm:w-auto"
                target={config.secondaryButton.href.startsWith('http') ? '_blank' : undefined}
                rel={config.secondaryButton.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              >
                {config.secondaryButton.text}
                <SecondaryIcon className="w-5 h-5" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
