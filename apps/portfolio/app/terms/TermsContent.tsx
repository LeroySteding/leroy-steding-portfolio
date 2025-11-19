"use client";

import { motion } from "framer-motion";
import { FileText, AlertCircle, Scale, Users, Code, Ban } from "lucide-react";
import Link from "next/link";

export default function TermsContent() {
  const sections = [
    {
      icon: Users,
      title: "Acceptance of Terms",
      content: [
        {
          subtitle: "Agreement to Terms",
          text: "By accessing and using this website, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use this website."
        },
        {
          subtitle: "Changes to Terms",
          text: "I reserve the right to modify these terms at any time. Changes will be effective immediately upon posting. Your continued use of the website following any changes constitutes acceptance of those changes."
        }
      ]
    },
    {
      icon: Code,
      title: "Use of Website",
      content: [
        {
          subtitle: "Permitted Use",
          text: "This website is provided for informational and professional networking purposes. You may browse, read content, and contact me through provided forms. All content viewing must be for personal, non-commercial use unless otherwise specified."
        },
        {
          subtitle: "User Conduct",
          text: "You agree not to use this website for any unlawful purpose or in any way that could damage, disable, or impair the site. Prohibited activities include attempting to gain unauthorized access, interfering with site security, or transmitting malicious code."
        }
      ]
    },
    {
      icon: Scale,
      title: "Intellectual Property",
      content: [
        {
          subtitle: "Copyright and Ownership",
          text: "All content on this website, including text, images, code examples, design, and graphics, is owned by me or licensed to me and protected by copyright laws. Unauthorized use, reproduction, or distribution is prohibited."
        },
        {
          subtitle: "Limited License",
          text: "You are granted a limited, non-exclusive license to view and use the website for personal purposes. Code snippets and examples may be used for learning purposes with proper attribution. Any commercial use requires explicit written permission."
        },
        {
          subtitle: "Third-Party Content",
          text: "Some content may include links to or embed third-party resources. These are provided for convenience and do not imply endorsement. Third-party content is subject to their own terms and conditions."
        }
      ]
    },
    {
      icon: Ban,
      title: "Prohibited Activities",
      content: [
        {
          subtitle: "Security and Integrity",
          text: "You may not attempt to hack, reverse engineer, or compromise the security of this website. Any unauthorized access attempts will be logged and may be reported to authorities."
        },
        {
          subtitle: "Content Scraping",
          text: "Automated scraping, data mining, or extraction of content without permission is strictly prohibited. This includes using bots, scrapers, or automated tools to collect information."
        },
        {
          subtitle: "Misrepresentation",
          text: "You may not impersonate me or any other person, misrepresent your affiliation with me, or use my identity or work for unauthorized purposes."
        }
      ]
    },
    {
      icon: AlertCircle,
      title: "Disclaimers and Limitations",
      content: [
        {
          subtitle: "No Warranties",
          text: 'This website is provided "as is" without warranties of any kind. I do not guarantee accuracy, completeness, or reliability of any content. Technical information and code examples are provided for educational purposes without warranty of fitness for any particular purpose.'
        },
        {
          subtitle: "Limitation of Liability",
          text: "To the maximum extent permitted by law, I shall not be liable for any indirect, incidental, special, or consequential damages arising from use of this website, including loss of data, profits, or business interruption."
        },
        {
          subtitle: "External Links",
          text: "This website contains links to external sites. I am not responsible for the content, accuracy, or practices of third-party websites. Use of external links is at your own risk."
        }
      ]
    },
    {
      icon: FileText,
      title: "Contact and Communication",
      content: [
        {
          subtitle: "Professional Services",
          text: "Contact through this website does not create a client relationship or obligation to provide services. Any professional engagement requires a separate written agreement outlining scope, terms, and compensation."
        },
        {
          subtitle: "Response Times",
          text: "While I strive to respond to inquiries promptly, I make no guarantees about response times. Messages may be filtered, and I reserve the right to decline communication at my discretion."
        },
        {
          subtitle: "Newsletter and Updates",
          text: "By subscribing to newsletters or updates, you consent to receive emails. You may unsubscribe at any time using provided opt-out mechanisms. Subscription does not guarantee any specific frequency or type of communication."
        }
      ]
    }
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
              <FileText className="w-12 h-12 text-accent-primary" />
            </motion.div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-black mb-6 leading-tight">
              Terms of <span className="text-gradient">Service</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-text-secondary leading-relaxed mb-6">
              Please read these terms carefully before using this website. By using this site, you agree to these terms.
            </p>

            <p className="text-sm text-text-muted">
              Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
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
                    <div className="p-4 rounded-xl bg-accent-secondary/10">
                      <Icon className="w-8 h-8 text-accent-secondary" />
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

            {/* Governing Law */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="card p-10"
            >
              <h2 className="text-3xl font-display font-bold text-text-primary mb-6">
                Governing Law and Disputes
              </h2>
              <p className="text-text-secondary leading-relaxed mb-4">
                These Terms of Service are governed by the laws of the Netherlands. Any disputes arising from use of this website shall be subject to the exclusive jurisdiction of the courts in the Netherlands.
              </p>
              <p className="text-text-secondary leading-relaxed">
                If any provision of these terms is found to be unenforceable, the remaining provisions shall remain in full effect.
              </p>
            </motion.div>

            {/* Contact Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="card p-10 bg-gradient-to-br from-accent-primary/10 to-accent-secondary/10 border-2 border-accent-secondary/30"
            >
              <h2 className="text-3xl font-display font-bold text-text-primary mb-4">
                Questions About These Terms?
              </h2>
              <p className="text-text-secondary mb-6 leading-relaxed">
                If you have any questions about these Terms of Service, please feel free to reach out.
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
