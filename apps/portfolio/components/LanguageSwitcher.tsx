"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => setLanguage("en")}
        className={`px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
          language === "en"
            ? "bg-accent-primary text-white"
            : "text-text-secondary hover:text-accent-primary hover:bg-surface/50"
        }`}
      >
        EN
      </button>
      <button
        onClick={() => setLanguage("nl")}
        className={`px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
          language === "nl"
            ? "bg-accent-primary text-white"
            : "text-text-secondary hover:text-accent-primary hover:bg-surface/50"
        }`}
      >
        NL
      </button>
    </div>
  );
}
