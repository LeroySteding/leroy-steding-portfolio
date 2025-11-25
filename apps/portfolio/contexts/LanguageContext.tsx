"use client";

import { usePathname, useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { createContext, useCallback, useContext } from "react";
import { defaultLocale, type Locale, locales } from "@/i18n/config";

interface LanguageContextType {
  language: Locale;
  setLanguage: (lang: Locale) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();

  const setLanguage = useCallback(
    (lang: Locale) => {
      if (typeof window !== "undefined") {
        localStorage.setItem("language", lang);
      }

      // Get the current path without locale prefix
      let pathWithoutLocale = pathname;

      // Remove current locale prefix if present
      for (const loc of locales) {
        if (pathname.startsWith(`/${loc}/`)) {
          pathWithoutLocale = pathname.slice(loc.length + 1);
          break;
        } else if (pathname === `/${loc}`) {
          pathWithoutLocale = "/";
          break;
        }
      }

      // Build new path with target locale
      // Default locale (nl) doesn't need prefix, other locales do
      const newPath =
        lang === defaultLocale
          ? pathWithoutLocale
          : `/${lang}${pathWithoutLocale === "/" ? "" : pathWithoutLocale}`;

      router.push(newPath || "/");
    },
    [pathname, router],
  );

  const t = (key: string) => {
    // Placeholder translation function - actual translations use useTranslation hook
    return key;
  };

  return (
    <LanguageContext.Provider value={{ language: locale, setLanguage, t }}>
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

// Re-export locale types for convenience
export type { Locale };
export { locales, defaultLocale };
