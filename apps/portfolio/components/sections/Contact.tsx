"use client";

import { motion } from "framer-motion";
import { Github, Linkedin, Mail, MapPin, Send, Twitter } from "lucide-react";
import { useState } from "react";
import { useLayout } from "@/contexts/LayoutContext";
import { useTranslation } from "@/hooks/useTranslation";
import type { SanityContactSection } from "@/lib/sanity-content";

interface ContactProps {
  data?: SanityContactSection | null;
}

export default function Contact({ data }: ContactProps) {
  const t = useTranslation();
  const { containerClass } = useLayout();

  // Use Sanity data with static translation fallbacks
  const sectionTitle = data?.title || t.contact.title;
  const sectionTitleHighlight = data?.subtitle || t.contact.titleHighlight;
  const sectionSubtitle = data?.description || t.contact.subtitle;
  const contactEmail = data?.email || "leroy@steding.digital";

  const contactInfo = [
    {
      icon: Mail,
      label: t.contact.info.email,
      value: contactEmail,
      href: `mailto:${contactEmail}`,
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
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      setSubmitStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });

      setTimeout(() => setSubmitStatus("idle"), 5000);
    } catch (_error) {
      setSubmitStatus("error");
      setTimeout(() => setSubmitStatus("idle"), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <section
      id="contact"
      className="section relative bg-secondary-bg overflow-hidden"
    >
      {/* Subtle accent line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-accent-secondary to-transparent" />

      <div className={`relative z-10 ${containerClass}`}>
        {/* Section header */}
        <div className="mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="font-display font-black mb-6"
          >
            {sectionTitle}{" "}
            <span className="text-gradient">{sectionTitleHighlight}</span>
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="w-32 h-2 bg-accent-secondary rounded-full mb-8"
          />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-xl text-text-secondary max-w-3xl"
          >
            {sectionSubtitle}
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-5 gap-16">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="lg:col-span-2 space-y-12"
          >
            <div>
              <h3 className="text-3xl font-display font-bold mb-8 text-accent-primary">
                {t.contact.info.title}
              </h3>

              <div className="space-y-6">
                {contactInfo.map((item) => {
                  const Icon = item.icon;
                  const content = (
                    <div className="card p-6 flex items-start gap-6">
                      <div className="p-4 rounded-xl bg-accent-primary/10">
                        <Icon className="w-7 h-7 text-accent-primary" />
                      </div>
                      <div>
                        <div className="text-sm text-text-muted mb-2 font-semibold uppercase tracking-wide">
                          {item.label}
                        </div>
                        <div className="text-text-primary font-bold text-lg">
                          {item.value}
                        </div>
                      </div>
                    </div>
                  );

                  return item.href ? (
                    <a
                      key={item.label}
                      href={item.href}
                      className="block group"
                    >
                      {content}
                    </a>
                  ) : (
                    <div key={item.label}>{content}</div>
                  );
                })}
              </div>
            </div>

            <div>
              <h3 className="text-3xl font-display font-bold mb-8 text-accent-secondary">
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
                      className="card p-5 hover:scale-110 transition-all duration-300 group"
                      aria-label={social.label}
                    >
                      <Icon className="w-8 h-8 text-text-secondary group-hover:text-accent-secondary transition-colors duration-300" />
                    </a>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="lg:col-span-3"
          >
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-base font-bold mb-3 text-text-primary"
                  >
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-6 py-4 text-lg rounded-lg bg-tertiary-bg border-2 border-surface text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-primary transition-colors duration-300"
                    placeholder={t.contact.form.namePlaceholder}
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-base font-bold mb-3 text-text-primary"
                  >
                    Your Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-6 py-4 text-lg rounded-lg bg-tertiary-bg border-2 border-surface text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-primary transition-colors duration-300"
                    placeholder={t.contact.form.emailPlaceholder}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="block text-base font-bold mb-3 text-text-primary"
                >
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-6 py-4 text-lg rounded-lg bg-tertiary-bg border-2 border-surface text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-primary transition-colors duration-300"
                  placeholder={t.contact.form.subjectPlaceholder}
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-base font-bold mb-3 text-text-primary"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-6 py-4 text-lg rounded-lg bg-tertiary-bg border-2 border-surface text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-primary transition-colors duration-300 resize-none"
                  placeholder={t.contact.form.messagePlaceholder}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-3"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-6 h-6 border-3 border-primary-bg border-t-transparent rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    Send Message
                    <Send className="w-6 h-6" />
                  </>
                )}
              </button>

              {/* Status messages */}
              {submitStatus === "success" && (
                <div className="p-6 rounded-lg bg-green-500/10 border-2 border-green-500/50 text-green-500 font-bold text-lg">
                  {t.contact.form.success}
                </div>
              )}

              {submitStatus === "error" && (
                <div className="p-6 rounded-lg bg-red-500/10 border-2 border-red-500/50 text-red-500 font-bold text-lg">
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
