"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Calendar,
  CheckCircle2,
  ChevronDown,
  Download,
  ExternalLink,
  Github,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Send,
  Twitter,
  X,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import ChatPage from "@/components/ui/ChatPage";
import LayoutContainer from "@/components/ui/LayoutContainer";
import NewsletterSubscribe from "@/components/ui/NewsletterSubscribe";
import PageHero from "@/components/ui/PageHero";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "@/hooks/useTranslation";

export default function ContactPage() {
  const { language } = useLanguage();
  const t = useTranslation();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    subject: "",
    message: "",
    subscribeToNewsletter: false,
    // Honeypot field - should remain empty
    website: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [showOptionalFields, setShowOptionalFields] = useState(false);

  const contactInfo = [
    {
      icon: Mail,
      label: t.contact.info.email,
      value: "leroy@steding.digital",
      href: "mailto:leroy@steding.digital",
    },
    {
      icon: Phone,
      label: t.contact.info.phone,
      value: "+31 6 12345678",
      href: "tel:+31612345678",
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
      label: "LinkedIn",
      href: "https://linkedin.com/in/leroysteding",
      color: "hover:text-blue-500",
    },
    {
      icon: Github,
      label: "GitHub",
      href: "https://github.com/leroysteding",
      color: "hover:text-purple-500",
    },
    {
      icon: Twitter,
      label: "Twitter",
      href: "https://twitter.com/leroysteding",
      color: "hover:text-blue-400",
    },
  ];

  const alternativeActions = [
    {
      icon: Calendar,
      title: t.contact.alternativeActions.scheduleMeeting.title,
      description: t.contact.alternativeActions.scheduleMeeting.description,
      href: "/book",
      buttonText: t.contact.alternativeActions.scheduleMeeting.buttonText,
    },
    {
      icon: Download,
      title: t.contact.alternativeActions.downloadResume.title,
      description: t.contact.alternativeActions.downloadResume.description,
      href: "/cv/leroy-steding-resume.pdf",
      buttonText: t.contact.alternativeActions.downloadResume.buttonText,
    },
    {
      icon: Linkedin,
      title: t.contact.alternativeActions.linkedin.title,
      description: t.contact.alternativeActions.linkedin.description,
      href: "https://linkedin.com/in/leroysteding",
      buttonText: t.contact.alternativeActions.linkedin.buttonText,
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          locale: language,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      setSubmitStatus("success");
      // Don't clear the form immediately - keep email visible for confirmation
    } catch (_error) {
      setSubmitStatus("error");
      setTimeout(() => setSubmitStatus("idle"), 8000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      company: "",
      phone: "",
      subject: "",
      message: "",
      subscribeToNewsletter: false,
      website: "",
    });
    setSubmitStatus("idle");
    setShowOptionalFields(false);
  };

  const messageLength = formData.message.length;
  const isMessageTooShort = messageLength > 0 && messageLength < 20;
  const isMessageGoodLength = messageLength >= 20;

  return (
    <div className="min-h-screen bg-primary-bg">
      {/* Hero Section */}
      <PageHero
        title={t.contact.hero.title}
        titleHighlight={t.contact.hero.titleHighlight}
        subtitle={t.contact.hero.subtitle}
        icon={Mail}
        breadcrumbs={[{ label: "Contact" }]}
        backgroundImage="https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=1920&q=80"
      />

      {/* Main Content */}
      <section className="py-24 bg-primary-bg">
        <LayoutContainer>
          {/* Form First on Mobile, Grid on Desktop */}
          <div className="grid lg:grid-cols-5 gap-12 lg:gap-16 mb-24">
            {/* Contact Form - Order 1 on mobile, Order 2 on desktop */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="order-1 lg:order-2 lg:col-span-3"
            >
              <div className="card p-8 md:p-10">
                {/* Trust Indicators Bar */}
                <div className="grid grid-cols-3 gap-4 mb-8 p-5 rounded-xl bg-surface">
                  <div className="text-center">
                    <div className="text-2xl md:text-3xl font-bold text-accent-primary">
                      24h
                    </div>
                    <div className="text-xs text-text-muted">
                      {t.contact.form.trustIndicators.responseTime}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse mr-2" />
                      <div className="text-2xl md:text-3xl font-bold text-green-500">
                        ●
                      </div>
                    </div>
                    <div className="text-xs text-text-muted">
                      {t.contact.form.trustIndicators.availableNow}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl md:text-3xl">🔒</div>
                    <div className="text-xs text-text-muted">
                      {t.contact.form.trustIndicators.securePrivate}
                    </div>
                  </div>
                </div>

                <h2 className="text-3xl md:text-4xl font-display font-black mb-2 text-text-primary">
                  {t.contact.form.heading}
                </h2>
                <p className="text-text-secondary mb-8">
                  {t.contact.form.subheading}
                </p>

                <AnimatePresence mode="wait">
                  {submitStatus === "success" ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="p-8 rounded-2xl bg-green-500/10 border-2 border-green-500/50"
                    >
                      <div className="flex items-start gap-4 mb-4">
                        <CheckCircle2 className="w-8 h-8 text-green-500 flex-shrink-0 mt-1" />
                        <div>
                          <h3 className="text-2xl font-bold text-green-500 mb-2">
                            {t.contact.form.successMessage.title}
                          </h3>
                          <p className="text-text-secondary mb-1">
                            {t.contact.form.successMessage.body}{" "}
                            <strong className="text-text-primary">
                              {formData.email}
                            </strong>{" "}
                            {t.contact.form.successMessage.bodyEnd}
                          </p>
                          <p className="text-sm text-text-muted">
                            {t.contact.form.successMessage.spam}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3 mt-6">
                        <button
                          type="button"
                          onClick={resetForm}
                          className="btn-primary flex-1 sm:flex-none"
                        >
                          {t.contact.form.actions.sendAnother}
                        </button>
                        <Link
                          href="/projects"
                          className="btn-secondary flex-1 sm:flex-none text-center"
                        >
                          {t.contact.form.actions.browseWork}
                        </Link>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onSubmit={handleSubmit}
                      className="space-y-6"
                    >
                      {/* Essential Field: Email */}
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-base font-bold mb-2 text-text-primary"
                        >
                          {t.contact.form.emailLabel}
                          <span className="text-sm text-text-muted font-normal ml-2">
                            {t.contact.form.emailHelper}
                          </span>
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          autoComplete="email"
                          className="w-full px-6 py-5 text-base md:text-lg rounded-xl bg-surface border-2 border-surface-light text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-primary transition-colors duration-300 min-h-[56px]"
                          placeholder="you@example.com"
                        />
                      </div>

                      {/* Essential Field: Message */}
                      <div>
                        <label
                          htmlFor="message"
                          className="block text-base font-bold mb-2 text-text-primary"
                        >
                          How can I help?
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          required
                          rows={6}
                          maxLength={1000}
                          className="w-full px-6 py-5 text-base md:text-lg rounded-xl bg-surface border-2 border-surface-light text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-primary transition-colors duration-300 resize-none"
                          placeholder="Project inquiry, collaboration opportunity, question, or just saying hi..."
                        />
                        <div className="flex justify-between items-center text-sm mt-2">
                          <span
                            className={
                              messageLength === 0
                                ? "text-text-muted"
                                : isMessageTooShort
                                  ? "text-orange-500"
                                  : isMessageGoodLength
                                    ? "text-green-500"
                                    : "text-text-muted"
                            }
                          >
                            {messageLength === 0
                              ? t.contact.form.messagePlaceholder
                              : isMessageTooShort
                                ? t.contact.form.validation.tooShort
                                : t.contact.form.validation.perfect}
                          </span>
                          <span className="text-text-muted">
                            {messageLength}/1000
                          </span>
                        </div>
                      </div>

                      {/* Progressive Disclosure: Optional Fields */}
                      <div>
                        <button
                          type="button"
                          onClick={() =>
                            setShowOptionalFields(!showOptionalFields)
                          }
                          className="flex items-center gap-2 text-sm text-accent-primary hover:text-accent-secondary transition-colors duration-200"
                        >
                          <ChevronDown
                            className={`w-4 h-4 transition-transform duration-200 ${showOptionalFields ? "rotate-180" : ""}`}
                          />
                          {showOptionalFields
                            ? t.contact.form.actions.hideOptional
                            : t.contact.form.actions.showOptional}{" "}
                          {t.contact.form.actions.optionalLabel}
                        </button>

                        <AnimatePresence>
                          {showOptionalFields && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="overflow-hidden"
                            >
                              <div className="grid sm:grid-cols-2 gap-4 mt-4">
                                <div>
                                  <label
                                    htmlFor="name"
                                    className="block text-sm font-semibold mb-2 text-text-primary"
                                  >
                                    Your name
                                  </label>
                                  <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    autoComplete="name"
                                    className="w-full px-6 py-4 text-base rounded-xl bg-surface border-2 border-surface-light text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-primary transition-colors duration-300 min-h-[56px]"
                                    placeholder="John Doe"
                                  />
                                </div>

                                <div>
                                  <label
                                    htmlFor="company"
                                    className="block text-sm font-semibold mb-2 text-text-primary"
                                  >
                                    Company
                                  </label>
                                  <input
                                    type="text"
                                    id="company"
                                    name="company"
                                    value={formData.company}
                                    onChange={handleChange}
                                    autoComplete="organization"
                                    className="w-full px-6 py-4 text-base rounded-xl bg-surface border-2 border-surface-light text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-primary transition-colors duration-300 min-h-[56px]"
                                    placeholder="Acme Inc."
                                  />
                                </div>

                                <div>
                                  <label
                                    htmlFor="phone"
                                    className="block text-sm font-semibold mb-2 text-text-primary"
                                  >
                                    Phone
                                  </label>
                                  <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    autoComplete="tel"
                                    className="w-full px-6 py-4 text-base rounded-xl bg-surface border-2 border-surface-light text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-primary transition-colors duration-300 min-h-[56px]"
                                    placeholder="+31 6 12345678"
                                  />
                                </div>

                                <div>
                                  <label
                                    htmlFor="subject"
                                    className="block text-sm font-semibold mb-2 text-text-primary"
                                  >
                                    Subject
                                  </label>
                                  <input
                                    type="text"
                                    id="subject"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    className="w-full px-6 py-4 text-base rounded-xl bg-surface border-2 border-surface-light text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-primary transition-colors duration-300 min-h-[56px]"
                                    placeholder="Project inquiry"
                                  />
                                </div>
                              </div>

                              {/* Newsletter Opt-in */}
                              <div className="mt-4">
                                <label className="flex items-start gap-3 cursor-pointer group">
                                  <input
                                    type="checkbox"
                                    name="subscribeToNewsletter"
                                    checked={formData.subscribeToNewsletter}
                                    onChange={handleChange}
                                    className="mt-1 w-5 h-5 rounded border-2 border-surface-light bg-surface text-accent-primary focus:ring-accent-primary focus:ring-offset-0 cursor-pointer"
                                  />
                                  <span className="text-sm text-text-secondary group-hover:text-text-primary transition-colors">
                                    Keep me updated with occasional insights on
                                    web development, AI, and tech trends. No
                                    spam, unsubscribe anytime.
                                  </span>
                                </label>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Honeypot field - hidden from humans, catches bots */}
                      <div
                        aria-hidden="true"
                        style={{
                          position: "absolute",
                          left: "-9999px",
                          top: "-9999px",
                        }}
                      >
                        <label htmlFor="website">
                          Website (leave empty)
                          <input
                            type="text"
                            id="website"
                            name="website"
                            value={formData.website}
                            onChange={handleChange}
                            tabIndex={-1}
                            autoComplete="off"
                          />
                        </label>
                      </div>

                      {/* Submit Button */}
                      <div>
                        <button
                          type="submit"
                          disabled={
                            isSubmitting || !formData.email || !formData.message
                          }
                          aria-label={
                            isSubmitting
                              ? "Sending message, please wait"
                              : "Send message"
                          }
                          className="btn-primary w-full text-lg py-5 disabled:opacity-50 disabled:cursor-not-allowed"
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

                        {/* Privacy Reassurance */}
                        <p className="text-xs text-center text-text-muted mt-4">
                          🔒 Your information is secure and will never be
                          shared.{" "}
                          <Link
                            href="/privacy"
                            className="text-accent-primary hover:underline"
                          >
                            Privacy policy
                          </Link>
                        </p>
                      </div>

                      {/* Error Message */}
                      {submitStatus === "error" && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          role="alert"
                          aria-live="polite"
                          className="p-6 rounded-xl bg-red-500/10 border-2 border-red-500/50 text-red-500"
                        >
                          <div className="flex items-start gap-3">
                            <X className="w-6 h-6 flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="font-bold mb-1">
                                <span className="sr-only">Error:</span>
                                Something went wrong
                              </p>
                              <p className="text-sm text-text-secondary">
                                Please try again or email me directly at{" "}
                                <a
                                  href="mailto:leroy@steding.digital"
                                  className="underline hover:no-underline"
                                >
                                  leroy@steding.digital
                                </a>
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Contact Info Sidebar - Order 2 on mobile, Order 1 on desktop */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="order-2 lg:order-1 lg:col-span-2 space-y-8"
            >
              {/* Contact Information */}
              <div>
                <h2 className="text-2xl md:text-3xl font-display font-bold mb-6 text-accent-primary">
                  Contact Info
                </h2>

                <div className="space-y-4">
                  {contactInfo.map((item) => {
                    const Icon = item.icon;
                    const content = (
                      <div className="card p-5 flex items-start gap-4 group">
                        <div className="p-3 rounded-xl bg-accent-primary/10 group-hover:bg-accent-primary/20 transition-colors duration-300">
                          <Icon className="w-6 h-6 text-accent-primary" />
                        </div>
                        <div>
                          <div className="text-xs text-text-muted mb-1 font-semibold uppercase tracking-wide">
                            {item.label}
                          </div>
                          <div className="text-text-primary font-bold text-base">
                            {item.value}
                          </div>
                        </div>
                      </div>
                    );

                    return item.href ? (
                      <a key={item.label} href={item.href} className="block">
                        {content}
                      </a>
                    ) : (
                      <div key={item.label}>{content}</div>
                    );
                  })}
                </div>
              </div>

              {/* Social Links */}
              <div>
                <h2 className="text-2xl md:text-3xl font-display font-bold mb-6 text-accent-secondary">
                  Social
                </h2>

                <div className="flex gap-3">
                  {socialLinks.map((social) => {
                    const Icon = social.icon;
                    return (
                      <a
                        key={social.label}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`card p-5 hover:scale-110 transition-all duration-300 group ${social.color}`}
                        aria-label={social.label}
                      >
                        <Icon className="w-7 h-7 text-text-secondary group-hover:text-current transition-colors duration-300" />
                      </a>
                    );
                  })}
                </div>
              </div>

              {/* Availability Badge */}
              <div className="card p-6 bg-gradient-to-br from-green-500/10 to-green-500/5 border-2 border-green-500/30">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-lg font-bold text-green-500">
                    Available for Work
                  </span>
                </div>
                <p className="text-sm text-text-secondary">
                  Currently open to new opportunities and exciting projects
                </p>
              </div>
            </motion.div>
          </div>

          {/* Alternative Contact Methods - Compact Layout */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-24"
          >
            <div className="card p-8">
              <h3 className="text-2xl md:text-3xl font-display font-bold mb-6 text-center">
                Prefer a Different Approach?
              </h3>

              <div className="grid md:grid-cols-3 gap-4">
                {alternativeActions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <a
                      key={action.title}
                      href={action.href}
                      target={
                        action.href.startsWith("http") ? "_blank" : undefined
                      }
                      rel={
                        action.href.startsWith("http")
                          ? "noopener noreferrer"
                          : undefined
                      }
                      className="flex items-center gap-4 p-4 rounded-xl hover:bg-surface transition-colors group"
                    >
                      <div className="p-3 rounded-lg bg-accent-secondary/10 group-hover:bg-accent-secondary/20 transition-colors">
                        <Icon className="w-6 h-6 text-accent-secondary" />
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-text-primary group-hover:text-accent-secondary transition-colors">
                          {action.title}
                        </div>
                        <div className="text-sm text-text-muted">
                          {action.description}
                        </div>
                      </div>
                      <ExternalLink className="w-4 h-4 text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* AI Chat Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-24"
          >
            <ChatPage translations={t.contact.chat} locale={language} />
          </motion.div>

          {/* Newsletter Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <NewsletterSubscribe variant="default" />
          </motion.div>
        </LayoutContainer>
      </section>
    </div>
  );
}
