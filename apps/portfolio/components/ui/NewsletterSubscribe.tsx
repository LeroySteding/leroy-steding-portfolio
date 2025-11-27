"use client";

import { motion } from "framer-motion";
import { AlertCircle, Check, Mail, Send } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "@/hooks/useTranslation";

interface NewsletterSubscribeProps {
  variant?: "default" | "compact" | "inline";
  showIcon?: boolean;
  title?: string;
  description?: string;
  className?: string;
}

export default function NewsletterSubscribe({
  variant = "default",
  showIcon = true,
  title,
  description,
  className = "",
}: NewsletterSubscribeProps) {
  const t = useTranslation();
  const { language } = useLanguage();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes("@")) {
      setStatus("error");
      setMessage(t.newsletter.errors.invalidEmail);
      setTimeout(() => setStatus("idle"), 3000);
      return;
    }

    setStatus("loading");

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, locale: language }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to subscribe");
      }

      setStatus("success");
      setMessage(t.newsletter.messages.success);
      setEmail("");

      setTimeout(() => setStatus("idle"), 5000);
    } catch (_error) {
      setStatus("error");
      setMessage(t.newsletter.errors.generic);
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  // Default content
  const defaultTitle = title || t.newsletter.title;
  const defaultDescription = description || t.newsletter.description;

  // Variant-specific layouts
  if (variant === "compact") {
    return (
      <div className={`card p-8 ${className}`}>
        <div className="flex items-start gap-4 mb-6">
          {showIcon && (
            <div className="p-3 rounded-xl bg-accent-primary/10 flex-shrink-0">
              <Mail className="w-6 h-6 text-accent-primary" />
            </div>
          )}
          <div className="flex-1">
            <h3 className="text-xl font-display font-bold text-text-primary mb-2">
              {defaultTitle}
            </h3>
            <p className="text-sm text-text-secondary">{defaultDescription}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t.newsletter.placeholder}
              disabled={status === "loading" || status === "success"}
              className="w-full px-4 py-3 rounded-lg bg-surface border-2 border-surface-light text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-primary transition-colors duration-300 disabled:opacity-50"
            />
          </div>

          <button
            type="submit"
            disabled={status === "loading" || status === "success"}
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === "loading" ? (
              <>
                <div className="w-5 h-5 border-2 border-primary-bg border-t-transparent rounded-full animate-spin" />
                {t.newsletter.buttons.subscribing}
              </>
            ) : status === "success" ? (
              <>
                <Check className="w-5 h-5" />
                {t.newsletter.buttons.subscribed}
              </>
            ) : (
              <>
                {t.newsletter.subscribe}
                <Send className="w-5 h-5" />
              </>
            )}
          </button>

          {status === "success" && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-2 p-4 rounded-lg bg-green-500/10 border-2 border-green-500/50 text-green-500 text-sm font-semibold"
            >
              <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>{message}</span>
            </motion.div>
          )}

          {status === "error" && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-2 p-4 rounded-lg bg-red-500/10 border-2 border-red-500/50 text-red-500 text-sm font-semibold"
            >
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>{message}</span>
            </motion.div>
          )}
        </form>

        <p className="text-xs text-text-muted mt-4">
          {t.newsletter.privacy.text}{" "}
          <a href="/privacy" className="text-accent-primary hover:underline">
            {t.newsletter.privacy.link}
          </a>
          .
        </p>
      </div>
    );
  }

  if (variant === "inline") {
    return (
      <div className={`${className}`}>
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            disabled={status === "loading" || status === "success"}
            className="flex-1 px-6 py-4 rounded-xl bg-surface border-2 border-surface-light text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-primary transition-colors duration-300 disabled:opacity-50 font-semibold"
          />
          <button
            type="submit"
            disabled={status === "loading" || status === "success"}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
            aria-label={
              status === "loading"
                ? t.newsletter.buttons.subscribing
                : status === "success"
                  ? t.newsletter.buttons.subscribed
                  : t.newsletter.subscribe
            }
          >
            {status === "loading" ? (
              <div className="w-5 h-5 border-2 border-primary-bg border-t-transparent rounded-full animate-spin" />
            ) : status === "success" ? (
              <Check className="w-5 h-5" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </form>

        {(status === "success" || status === "error") && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-3 text-sm font-semibold ${
              status === "success" ? "text-green-500" : "text-red-500"
            }`}
          >
            {message}
          </motion.div>
        )}
      </div>
    );
  }

  // Default variant
  return (
    <div className={`card p-12 ${className}`}>
      <div className="max-w-2xl mx-auto text-center">
        {showIcon && (
          <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20 mb-6">
            <Mail className="w-12 h-12 text-accent-primary" />
          </div>
        )}

        <h2 className="text-3xl md:text-4xl font-display font-black text-text-primary mb-4">
          {defaultTitle}
        </h2>

        <p className="text-lg text-text-secondary mb-8 leading-relaxed">
          {defaultDescription}
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t.newsletter.placeholder}
              disabled={status === "loading" || status === "success"}
              className="flex-1 px-6 py-4 text-lg rounded-xl bg-surface border-2 border-surface-light text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-primary transition-colors duration-300 disabled:opacity-50 font-semibold"
            />
            <button
              type="submit"
              disabled={status === "loading" || status === "success"}
              className="btn-primary whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === "loading" ? (
                <>
                  <div className="w-5 h-5 border-2 border-primary-bg border-t-transparent rounded-full animate-spin" />
                  {t.newsletter.buttons.subscribing}
                </>
              ) : status === "success" ? (
                <>
                  <Check className="w-5 h-5" />
                  {t.newsletter.buttons.subscribed}
                </>
              ) : (
                <>
                  {t.newsletter.buttons.subscribeNow}
                  <Send className="w-5 h-5" />
                </>
              )}
            </button>
          </div>

          {status === "success" && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center gap-2 p-4 rounded-lg bg-green-500/10 border-2 border-green-500/50 text-green-500 font-semibold"
            >
              <Check className="w-5 h-5" />
              <span>{message}</span>
            </motion.div>
          )}

          {status === "error" && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center gap-2 p-4 rounded-lg bg-red-500/10 border-2 border-red-500/50 text-red-500 font-semibold"
            >
              <AlertCircle className="w-5 h-5" />
              <span>{message}</span>
            </motion.div>
          )}
        </form>

        <p className="text-sm text-text-muted mt-6">
          {t.newsletter.footer.text}{" "}
          <a
            href="/privacy"
            className="text-accent-primary hover:underline font-semibold"
          >
            {t.newsletter.footer.link}
          </a>
        </p>
      </div>
    </div>
  );
}
