"use client";

import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Linkedin, Github, Twitter, Send, Calendar, Download, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import NewsletterSubscribe from "@/components/ui/NewsletterSubscribe";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const contactInfo = [
    {
      icon: Mail,
      label: "Email",
      value: "leroy@steding.digital",
      href: "mailto:leroy@steding.digital",
    },
    {
      icon: Phone,
      label: "Phone",
      value: "+31 6 12345678",
      href: "tel:+31612345678",
    },
    {
      icon: MapPin,
      label: "Location",
      value: "Netherlands",
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
      title: "Schedule a Meeting",
      description: "Book a 30-minute call to discuss your project",
      href: "https://calendly.com/leroysteding",
      buttonText: "View Calendar",
    },
    {
      icon: Download,
      title: "Download Resume",
      description: "Get a detailed overview of my experience and skills",
      href: "/cv/leroy-steding-resume.pdf",
      buttonText: "Download CV",
    },
    {
      icon: Linkedin,
      title: "Connect on LinkedIn",
      description: "Let's connect and expand our professional network",
      href: "https://linkedin.com/in/leroysteding",
      buttonText: "View Profile",
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // TODO: Integrate with Formspree or Supabase Edge Function
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
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
    <div className="min-h-screen bg-primary-bg">
      {/* Hero Section */}
      <section className="relative py-32 bg-secondary-bg overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-full h-full opacity-20">
          <div className="absolute top-1/4 -left-48 w-96 h-96 bg-accent-primary/30 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-accent-secondary/30 rounded-full blur-3xl" />
        </div>

        <div className="container relative z-10 mx-auto px-8 lg:px-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20 mb-6"
            >
              <Mail className="w-12 h-12 text-accent-primary" />
            </motion.div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-black mb-6 leading-tight">
              Let's <span className="text-gradient">Connect</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-text-secondary leading-relaxed">
              Have a project in mind or just want to chat? I'm always open to discussing new opportunities, creative ideas, or ways to be part of your vision.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-24 bg-primary-bg">
        <div className="container relative z-10 mx-auto px-8 lg:px-16">
          <div className="grid lg:grid-cols-5 gap-16 mb-24">
            {/* Contact Info Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="lg:col-span-2 space-y-12"
            >
              {/* Contact Information */}
              <div>
                <h2 className="text-3xl font-display font-bold mb-6 text-accent-primary">
                  Contact Information
                </h2>
                
                <div className="space-y-4">
                  {contactInfo.map((item) => {
                    const Icon = item.icon;
                    const content = (
                      <div className="card p-6 flex items-start gap-6 group">
                        <div className="p-4 rounded-xl bg-accent-primary/10 group-hover:bg-accent-primary/20 transition-colors duration-300">
                          <Icon className="w-7 h-7 text-accent-primary" />
                        </div>
                        <div>
                          <div className="text-sm text-text-muted mb-1 font-semibold uppercase tracking-wide">
                            {item.label}
                          </div>
                          <div className="text-text-primary font-bold text-lg">
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
                <h2 className="text-3xl font-display font-bold mb-6 text-accent-secondary">
                  Social Profiles
                </h2>
                
                <div className="flex gap-4">
                  {socialLinks.map((social) => {
                    const Icon = social.icon;
                    return (
                      <a
                        key={social.label}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`card p-6 hover:scale-110 transition-all duration-300 group ${social.color}`}
                        aria-label={social.label}
                      >
                        <Icon className="w-8 h-8 text-text-secondary group-hover:text-current transition-colors duration-300" />
                      </a>
                    );
                  })}
                </div>
              </div>

              {/* Availability Badge */}
              <div className="card p-6 bg-gradient-to-br from-green-500/10 to-green-500/5 border-2 border-green-500/30">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-lg font-bold text-green-500">Available for Work</span>
                </div>
                <p className="text-sm text-text-secondary">
                  Currently open to new opportunities and exciting projects
                </p>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="lg:col-span-3"
            >
              <div className="card p-10">
                <h2 className="text-3xl font-display font-bold mb-2 text-text-primary">
                  Send a Message
                </h2>
                <p className="text-text-secondary mb-8">
                  Fill out the form below and I'll get back to you as soon as possible.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-base font-bold mb-3 text-text-primary">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-6 py-4 text-base rounded-xl bg-surface border-2 border-surface-light text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-primary transition-colors duration-300"
                        placeholder="John Doe"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-base font-bold mb-3 text-text-primary">
                        Your Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-6 py-4 text-base rounded-xl bg-surface border-2 border-surface-light text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-primary transition-colors duration-300"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-base font-bold mb-3 text-text-primary">
                      Subject *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-6 py-4 text-base rounded-xl bg-surface border-2 border-surface-light text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-primary transition-colors duration-300"
                      placeholder="Project Inquiry"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-base font-bold mb-3 text-text-primary">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full px-6 py-4 text-base rounded-xl bg-surface border-2 border-surface-light text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-primary transition-colors duration-300 resize-none"
                      placeholder="Tell me about your project..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
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
                    <div className="p-6 rounded-xl bg-green-500/10 border-2 border-green-500/50 text-green-500 font-bold text-base">
                      ✓ Message sent successfully! I'll get back to you soon.
                    </div>
                  )}
                  
                  {submitStatus === "error" && (
                    <div className="p-6 rounded-xl bg-red-500/10 border-2 border-red-500/50 text-red-500 font-bold text-base">
                      ✗ Something went wrong. Please try again.
                    </div>
                  )}
                </form>
              </div>
            </motion.div>
          </div>

          {/* Newsletter Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-24"
          >
            <NewsletterSubscribe variant="default" />
          </motion.div>

          {/* Alternative Contact Methods */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-display font-black mb-12 text-center">
              Other Ways to <span className="text-gradient">Connect</span>
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              {alternativeActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <motion.div
                    key={action.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="relative group"
                  >
                    <div className="absolute -inset-1 bg-gradient-to-r from-accent-primary/20 to-accent-secondary/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <div className="relative card p-8 h-full flex flex-col">
                      <div className="p-4 rounded-xl bg-accent-secondary/10 w-fit mb-4 group-hover:bg-accent-secondary/20 transition-colors duration-300">
                        <Icon className="w-8 h-8 text-accent-secondary" />
                      </div>

                      <h3 className="text-2xl font-display font-bold mb-3 text-text-primary">
                        {action.title}
                      </h3>

                      <p className="text-text-secondary mb-6 flex-1">
                        {action.description}
                      </p>

                      <a
                        href={action.href}
                        target={action.href.startsWith('http') ? '_blank' : undefined}
                        rel={action.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                        className="btn-secondary w-full"
                      >
                        {action.buttonText}
                        <ExternalLink className="w-5 h-5" />
                      </a>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
