"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Language = "en" | "nl";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    // Check localStorage or browser language
    const savedLang = localStorage.getItem("language") as Language | null;
    const browserLang = navigator.language.toLowerCase().startsWith("nl") ? "nl" : "en";
    const initialLang = savedLang || browserLang;
    
    if (initialLang !== language) {
      setLanguageState(initialLang);
    }
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem("language", lang);
    }
  };

  const t = (key: string) => {
    // Translation function - will be used throughout the app
    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
