"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-1 p-1 rounded-lg bg-surface border-2 border-surface">
      <motion.button
        onClick={() => setLanguage("en")}
        className={`px-4 py-2 text-sm font-bold rounded transition-all duration-300 ${
          language === "en"
            ? "bg-accent-primary text-primary-bg"
            : "text-text-secondary hover:text-text-primary hover:bg-surface-light"
        }`}
        whileTap={{ scale: 0.95 }}
      >
        EN
      </motion.button>
      <motion.button
        onClick={() => setLanguage("nl")}
        className={`px-4 py-2 text-sm font-bold rounded transition-all duration-300 ${
          language === "nl"
            ? "bg-accent-primary text-primary-bg"
            : "text-text-secondary hover:text-text-primary hover:bg-surface-light"
        }`}
        whileTap={{ scale: 0.95 }}
      >
        NL
      </motion.button>
    </div>
  );
}
