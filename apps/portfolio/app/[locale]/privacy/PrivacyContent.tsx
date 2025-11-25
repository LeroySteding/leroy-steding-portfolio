"use client";

import { motion } from "framer-motion";
import { Cookie, Database, Eye, Lock, Mail, Shield } from "lucide-react";
import Link from "next/link";

export default function PrivacyContent() {
  const sections = [
    {
      icon: Database,
      title: "Information We Collect",
      content: [
        {
          subtitle: "Personal Information",
          text: "When you contact me through forms or subscribe to my newsletter, I collect information such as your name, email address, and any message content you provide. This information is collected solely for the purpose of responding to your inquiry or sending you requested updates.",
        },
        {
          subtitle: "Automatically Collected Information",
          text: "Like most websites, I automatically collect certain technical information when you visit, including your IP address, browser type, device information, and pages visited. This data helps me understand how visitors use the site and improve the user experience.",
        },
        {
          subtitle: "Cookies and Tracking",
          text: "This website uses cookies and similar technologies to enhance functionality, remember your preferences (like dark/light mode and language selection), and analyze site traffic. You can control cookie settings through your browser preferences.",
        },
      ],
    },
    {
      icon: Lock,
      title: "How We Use Your Information",
      content: [
        {
          subtitle: "Communication",
          text: "Your contact information is used exclusively to respond to your inquiries, send newsletters (if subscribed), and provide requested information about my services and projects.",
        },
        {
          subtitle: "Service Improvement",
          text: "Aggregated and anonymized data helps me understand site usage patterns, identify popular content, and improve the overall user experience. This data cannot be used to identify individual users.",
        },
        {
          subtitle: "Legal Compliance",
          text: "In rare cases, I may need to use or disclose your information to comply with legal obligations, protect rights and safety, or respond to lawful requests from authorities.",
        },
      ],
    },
    {
      icon: Eye,
      title: "Information Sharing",
      content: [
        {
          subtitle: "Third-Party Services",
          text: "This website uses trusted third-party services for analytics, email delivery, and hosting. These providers have access to certain data only as necessary to perform their functions and are contractually obligated to protect your information.",
        },
        {
          subtitle: "No Selling of Data",
          text: "I do not sell, trade, or rent your personal information to third parties. Your data is never used for advertising purposes or shared with marketers.",
        },
      ],
    },
    {
      icon: Cookie,
      title: "Cookies and Tracking Technologies",
      content: [
        {
          subtitle: "Essential Cookies",
          text: "Required for basic site functionality, including user preferences (theme, language) and security features. These cookies cannot be disabled without affecting site operation.",
        },
        {
          subtitle: "Analytics Cookies",
          text: "Help me understand how visitors interact with the site, which pages are most popular, and where improvements can be made. These cookies collect anonymous data only.",
        },
        {
          subtitle: "Managing Cookies",
          text: "You can control and delete cookies through your browser settings. However, disabling certain cookies may impact site functionality and your user experience.",
        },
      ],
    },
    {
      icon: Shield,
      title: "Data Security",
      content: [
        {
          subtitle: "Protection Measures",
          text: "I implement industry-standard security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. This includes secure HTTPS connections, encrypted data transmission, and regular security updates.",
        },
        {
          subtitle: "Data Retention",
          text: "Personal information is retained only as long as necessary to fulfill the purposes outlined in this policy or as required by law. Newsletter subscribers can unsubscribe at any time, and their data will be promptly removed.",
        },
      ],
    },
    {
      icon: Mail,
      title: "Your Rights",
      content: [
        {
          subtitle: "Access and Control",
          text: "You have the right to access, update, or delete your personal information at any time. Contact me using the information below to exercise these rights.",
        },
        {
          subtitle: "GDPR Compliance",
          text: "For users in the European Union, I comply with GDPR requirements. You have additional rights including data portability, restriction of processing, and the right to object to processing.",
        },
        {
          subtitle: "Opt-Out Options",
          text: "You can unsubscribe from newsletters at any time using the unsubscribe link in emails. You can also opt out of analytics tracking through browser settings or privacy extensions.",
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-primary-bg">
      {/* Hero Section */}
      <section className="relative py-32 bg-secondary-bg overflow-hidden">
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
              <Shield className="w-12 h-12 text-accent-primary" />
            </motion.div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-black mb-6 leading-tight">
              Privacy <span className="text-gradient">Policy</span>
            </h1>

            <p className="text-xl md:text-2xl text-text-secondary leading-relaxed mb-6">
              Your privacy is important to me. This policy explains how I
              collect, use, and protect your personal information.
            </p>

            <p className="text-sm text-text-muted">
              Last updated:{" "}
              {new Date().toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-24 bg-primary-bg">
        <div className="container relative z-10 mx-auto px-8 lg:px-16">
          <div className="max-w-4xl mx-auto space-y-16">
            {sections.map((section, index) => {
              const Icon = section.icon;
              return (
                <motion.div
                  key={section.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="card p-10"
                >
                  <div className="flex items-center gap-4 mb-8">
                    <div className="p-4 rounded-xl bg-accent-primary/10">
                      <Icon className="w-8 h-8 text-accent-primary" />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-display font-bold text-text-primary">
                      {section.title}
                    </h2>
                  </div>

                  <div className="space-y-6">
                    {section.content.map((item, idx) => (
                      <div key={idx}>
                        <h3 className="text-xl font-bold text-text-primary mb-3">
                          {item.subtitle}
                        </h3>
                        <p className="text-text-secondary leading-relaxed">
                          {item.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              );
            })}

            {/* Contact Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="card p-10 bg-gradient-to-br from-accent-secondary/10 to-accent-primary/10 border-2 border-accent-primary/30"
            >
              <h2 className="text-3xl font-display font-bold text-text-primary mb-4">
                Questions About Privacy?
              </h2>
              <p className="text-text-secondary mb-6 leading-relaxed">
                If you have any questions about this Privacy Policy or how your
                data is handled, please don't hesitate to contact me.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/contact" className="btn-primary">
                  Contact Me
                </Link>
                <Link href="/" className="btn-secondary">
                  Back to Home
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
