"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Calendar, Mail, Clock, ArrowRight, Download, MessageSquare, Linkedin } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface BookingSuccessClientProps {
  language?: 'en' | 'nl';
}

export default function BookingSuccessClient({ language = 'en' }: BookingSuccessClientProps) {
  const [countdown, setCountdown] = useState(3);

  const content = {
    en: {
      title: "You're All Set!",
      subtitle: "Booking Confirmed",
      message: "Thank you for scheduling a call with me. You should receive a confirmation email shortly with all the meeting details and a calendar invite.",
      nextSteps: {
        title: "What Happens Next?",
        steps: [
          {
            icon: Mail,
            title: "Check Your Email",
            description: "You'll receive a confirmation email with the meeting link and calendar invite",
          },
          {
            icon: Calendar,
            title: "Add to Calendar",
            description: "Save the event to your calendar so you don't miss it",
          },
          {
            icon: MessageSquare,
            title: "Prepare Questions",
            description: "Think about what you'd like to discuss during our call",
          },
        ],
      },
      tips: {
        title: "Meeting Tips",
        items: [
          "Have your project requirements or questions ready",
          "Be in a quiet space with good internet connection",
          "Feel free to share your screen if needed",
          "No need to prepare a formal presentation",
        ],
      },
      actions: {
        title: "In the Meantime",
        buttons: [
          {
            label: "View My Projects",
            href: "/projects",
            icon: ArrowRight,
            variant: "primary" as const,
          },
          {
            label: "Read My Blog",
            href: "/blog",
            icon: ArrowRight,
            variant: "secondary" as const,
          },
          {
            label: "Download My CV",
            href: "/cv",
            icon: Download,
            variant: "outline" as const,
          },
        ],
      },
      footer: {
        needToReschedule: "Need to reschedule?",
        checkEmail: "Check your confirmation email for the reschedule link.",
        questions: "Have questions before the call?",
        reachOut: "Feel free to reach out via",
        email: "email",
        or: "or",
        linkedin: "LinkedIn",
      },
    },
    nl: {
      title: "Alles Geregeld!",
      subtitle: "Afspraak Bevestigd",
      message: "Bedankt voor het plannen van een gesprek met mij. U ontvangt binnenkort een bevestigingsmail met alle details en een agendauitnodiging.",
      nextSteps: {
        title: "Wat Gebeurt Er Nu?",
        steps: [
          {
            icon: Mail,
            title: "Controleer Uw Email",
            description: "U ontvangt een bevestigingsmail met de meetinglink en agendauitnodiging",
          },
          {
            icon: Calendar,
            title: "Toevoegen aan Agenda",
            description: "Bewaar de afspraak in uw agenda zodat u het niet vergeet",
          },
          {
            icon: MessageSquare,
            title: "Bereid Vragen Voor",
            description: "Denk na over wat u tijdens ons gesprek wilt bespreken",
          },
        ],
      },
      tips: {
        title: "Meeting Tips",
        items: [
          "Heb uw projectvereisten of vragen klaar",
          "Zorg voor een rustige ruimte met goede internetverbinding",
          "U kunt uw scherm delen indien nodig",
          "Geen formele presentatie nodig",
        ],
      },
      actions: {
        title: "In de Tussentijd",
        buttons: [
          {
            label: "Bekijk Mijn Projecten",
            href: "/nl/projects",
            icon: ArrowRight,
            variant: "primary" as const,
          },
          {
            label: "Lees Mijn Blog",
            href: "/nl/blog",
            icon: ArrowRight,
            variant: "secondary" as const,
          },
          {
            label: "Download Mijn CV",
            href: "/nl/cv",
            icon: Download,
            variant: "outline" as const,
          },
        ],
      },
      footer: {
        needToReschedule: "Moet u verzetten?",
        checkEmail: "Controleer uw bevestigingsmail voor de link om te verzetten.",
        questions: "Vragen voor het gesprek?",
        reachOut: "Neem gerust contact op via",
        email: "email",
        or: "of",
        linkedin: "LinkedIn",
      },
    },
  };

  const t = content[language];

  // Auto-redirect countdown (optional)
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  return (
    <div className="min-h-screen bg-primary-bg">
      {/* Success Hero */}
      <section className="relative py-32 bg-secondary-bg overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-20">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/30 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-primary/30 rounded-full blur-3xl" />
        </div>

        <div className="container relative z-10 mx-auto px-8 lg:px-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="mx-auto text-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex p-6 rounded-full bg-green-500/20 mb-8"
            >
              <CheckCircle2 className="w-16 h-16 text-green-500" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="inline-block px-4 py-2 rounded-full bg-green-500/20 text-green-500 font-bold text-sm mb-4">
                {t.subtitle}
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-black mb-6 text-gradient leading-tight">
                {t.title}
              </h1>

              <p className="text-xl md:text-2xl text-text-secondary leading-relaxed max-w-2xl mx-auto">
                {t.message}
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Next Steps */}
      <section className="py-24 bg-primary-bg">
        <div className="container mx-auto px-8 lg:px-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              {t.nextSteps.title}
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-20">
            {t.nextSteps.steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="card p-8 text-center"
                >
                  <div className="inline-flex p-4 rounded-xl bg-accent-primary/10 mb-6">
                    <Icon className="w-8 h-8 text-accent-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-text-primary">
                    {step.title}
                  </h3>
                  <p className="text-text-secondary leading-relaxed">
                    {step.description}
                  </p>
                </motion.div>
              );
            })}
          </div>

          {/* Meeting Tips */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mx-auto m-20"
          >
            <div className="card p-8">
              <h3 className="text-2xl font-display font-bold mb-6 text-center">
                {t.tips.title}
              </h3>
              <ul className="space-y-4">
                {t.tips.items.map((tip, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
                    <span className="text-text-secondary">{tip}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h3 className="text-2xl font-display font-bold mb-8">
              {t.actions.title}
            </h3>
            <div className="flex flex-wrap items-center justify-center gap-4">
              {t.actions.buttons.map((button) => {
                const Icon = button.icon;
                const buttonClass =
                  button.variant === "primary"
                    ? "btn-primary"
                    : button.variant === "secondary"
                    ? "btn-secondary"
                    : "px-6 py-3 rounded-lg border-2 border-accent-primary text-accent-primary hover:bg-accent-primary hover:text-white transition-all duration-300 font-semibold flex items-center gap-2";

                return (
                  <Link key={button.label} href={button.href} className={buttonClass}>
                    <span>{button.label}</span>
                    <Icon className="w-5 h-5" />
                  </Link>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer Info */}
      <section className="py-16 bg-secondary-bg border-t-2 border-surface">
        <div className="container mx-auto px-8 lg:px-16">
          <div className="mx-auto text-center space-y-6">
            <div className="card p-6">
              <p className="text-text-secondary mb-2">
                <strong className="text-text-primary">{t.footer.needToReschedule}</strong>
              </p>
              <p className="text-sm text-text-muted">{t.footer.checkEmail}</p>
            </div>

            <div className="card p-6">
              <p className="text-text-secondary mb-3">
                <strong className="text-text-primary">{t.footer.questions}</strong>
              </p>
              <p className="text-sm text-text-muted">
                {t.footer.reachOut}{" "}
                <a
                  href="mailto:leroy@steding.digital"
                  className="text-accent-primary hover:text-accent-secondary font-semibold underline"
                >
                  {t.footer.email}
                </a>{" "}
                {t.footer.or}{" "}
                <a
                  href="https://linkedin.com/in/leroysteding"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent-primary hover:text-accent-secondary font-semibold underline"
                >
                  {t.footer.linkedin}
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
