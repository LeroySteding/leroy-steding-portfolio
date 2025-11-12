"use client";

import { motion } from "framer-motion";
import { Mail, Send, MapPin, Linkedin, Github, Twitter } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";

export default function Contact() {
  const t = useTranslation();
  
  const contactInfo = [
    {
      icon: Mail,
      label: t.contact.info.email,
      value: "leroy@steding.digital",
      href: "mailto:leroy@steding.digital",
    },
    {
      icon: MapPin,
      label: t.contact.info.location,
      value: t.contact.info.locationValue,
      href: null,
    },
  ];

  const socialLinks = [
    {
      icon: Linkedin,
      label: t.contact.social.linkedin,
      href: "https://linkedin.com/in/leroysteding",
    },
    {
      icon: Github,
      label: t.contact.social.github,
      href: "https://github.com/leroysteding",
    },
    {
      icon: Twitter,
      label: t.contact.social.twitter,
      href: "https://twitter.com/leroysteding",
    },
  ];
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // TODO: Integrate with Formspree or Supabase Edge Function
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulated delay
      
      setSubmitStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });
      
      setTimeout(() => setSubmitStatus("idle"), 5000);
    } catch (error) {
      setSubmitStatus("error");
      setTimeout(() => setSubmitStatus("idle"), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <section id="contact" className="relative py-24 bg-cyber-dark overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-neon-cyan to-transparent" />
      
      {/* Gradient orbs */}
      <div className="absolute top-1/3 -left-48 w-96 h-96 bg-neon-cyan/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/3 -right-48 w-96 h-96 bg-neon-violet/10 rounded-full blur-3xl" />

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-4xl sm:text-5xl font-display font-bold mb-4"
          >
            {t.contact.title} <span className="bg-gradient-to-r from-neon-cyan to-neon-violet bg-clip-text text-transparent">{t.contact.titleHighlight}</span>
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="w-24 h-1 bg-gradient-to-r from-neon-cyan to-neon-violet mx-auto rounded-full"
          />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
            className="mt-6 text-lg text-text-secondary max-w-2xl mx-auto"
          >
            {t.contact.subtitle}
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-5 gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="lg:col-span-2 space-y-8"
          >
            <div>
              <h3 className="text-2xl font-display font-bold mb-6 text-neon-cyan">
                {t.contact.info.title}
              </h3>
              
              <div className="space-y-4">
                {contactInfo.map((item) => {
                  const Icon = item.icon;
                  const content = (
                    <div className="flex items-start gap-4 p-4 rounded-lg bg-cyber-darker border border-cyber-gray-light glass hover:border-neon-cyan/50 transition-all duration-300">
                      <div className="p-3 rounded-lg bg-neon-cyan/10 border border-neon-cyan/20">
                        <Icon className="w-5 h-5 text-neon-cyan" />
                      </div>
                      <div>
                        <div className="text-sm text-text-muted mb-1">{item.label}</div>
                        <div className="text-text-primary font-semibold">{item.value}</div>
                      </div>
                    </div>
                  );
                  
                  return item.href ? (
                    <a key={item.label} href={item.href} className="block group">
                      {content}
                    </a>
                  ) : (
                    <div key={item.label}>{content}</div>
                  );
                })}
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-display font-bold mb-6 text-neon-violet">
                Social Links
              </h3>
              
              <div className="flex gap-4">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-4 rounded-lg bg-cyber-darker border border-cyber-gray-light glass hover:border-neon-violet/50 hover:scale-110 transition-all duration-300 group"
                      aria-label={social.label}
                    >
                      <Icon className="w-6 h-6 text-text-secondary group-hover:text-neon-violet transition-colors duration-300" />
                    </a>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="lg:col-span-3"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold mb-2 text-text-primary">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-cyber-darker border border-cyber-gray-light text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-cyan transition-colors duration-300"
                    placeholder={t.contact.form.namePlaceholder}
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold mb-2 text-text-primary">
                    Your Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-cyber-darker border border-cyber-gray-light text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-cyan transition-colors duration-300"
                    placeholder={t.contact.form.emailPlaceholder}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-semibold mb-2 text-text-primary">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-cyber-darker border border-cyber-gray-light text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-cyan transition-colors duration-300"
                  placeholder={t.contact.form.subjectPlaceholder}
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-semibold mb-2 text-text-primary">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 rounded-lg bg-cyber-darker border border-cyber-gray-light text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-cyan transition-colors duration-300 resize-none"
                  placeholder={t.contact.form.messagePlaceholder}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-8 py-4 bg-neon-cyan text-cyber-black font-semibold rounded-lg hover:bg-neon-cyan-dark transition-all duration-300 neon-border-cyan hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-cyber-black border-t-transparent rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    Send Message
                    <Send className="w-5 h-5" />
                  </>
                )}
              </button>

              {/* Status messages */}
              {submitStatus === "success" && (
                <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/50 text-green-500">
                  {t.contact.form.success}
                </div>
              )}
              
              {submitStatus === "error" && (
                <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/50 text-red-500">
                  {t.contact.form.error}
                </div>
              )}
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
