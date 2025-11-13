"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-1 p-1 rounded-lg bg-cyber-gray border border-cyber-gray-light">
      <motion.button
        onClick={() => setLanguage("en")}
        className={`px-3 py-1.5 text-sm font-semibold rounded transition-all duration-300 ${
          language === "en"
            ? "bg-neon-cyan text-cyber-black"
            : "text-text-secondary hover:text-text-primary"
        }`}
        whileTap={{ scale: 0.95 }}
      >
        EN
      </motion.button>
      <motion.button
        onClick={() => setLanguage("nl")}
        className={`px-3 py-1.5 text-sm font-semibold rounded transition-all duration-300 ${
          language === "nl"
            ? "bg-neon-cyan text-cyber-black"
            : "text-text-secondary hover:text-text-primary"
        }`}
        whileTap={{ scale: 0.95 }}
      >
        NL
      </motion.button>
    </div>
  );
}
