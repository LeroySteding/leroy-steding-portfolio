"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";

type Language = "en" | "nl";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    // Detect language from URL path
    const isNlRoute = pathname?.startsWith("/nl");
    const routeLang: Language = isNlRoute ? "nl" : "en";
    
    // Check localStorage for user preference (only if not on a specific language route)
    const savedLang = localStorage.getItem("language") as Language | null;
    
    // Priority: URL route > saved preference > browser language
    let detectedLang = routeLang;
    
    if (!isNlRoute && savedLang) {
      detectedLang = savedLang;
    } else if (!isNlRoute && !savedLang) {
      const browserLang = navigator.language.toLowerCase().startsWith("nl") ? "nl" : "en";
      detectedLang = browserLang;
    }
    
    if (detectedLang !== language) {
      setLanguageState(detectedLang);
    }
  }, [pathname, language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem("language", lang);
      
      // Navigate to the appropriate route
      const currentPath = window.location.pathname;
      if (lang === "nl" && !currentPath.startsWith("/nl")) {
        window.location.href = "/nl" + currentPath;
      } else if (lang === "en" && currentPath.startsWith("/nl")) {
        window.location.href = currentPath.replace("/nl", "") || "/";
      }
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
