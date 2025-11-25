"use client";

import { usePathname, useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { defaultLocale, type Locale, locales } from "@/i18n/config";

export default function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();

  const switchLocale = (newLocale: Locale) => {
    if (newLocale === locale) return;

    // Store preference
    if (typeof window !== "undefined") {
      localStorage.setItem("language", newLocale);
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
      newLocale === defaultLocale
        ? pathWithoutLocale || "/"
        : `/${newLocale}${pathWithoutLocale === "/" ? "" : pathWithoutLocale}`;

    router.push(newPath);
  };

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => switchLocale("en")}
        aria-label="Switch to English"
        className={`px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
          locale === "en"
            ? "bg-accent-primary text-white"
            : "text-text-secondary hover:text-accent-primary hover:bg-surface/50"
        }`}
      >
        EN
      </button>
      <button
        onClick={() => switchLocale("nl")}
        aria-label="Switch to Dutch"
        className={`px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
          locale === "nl"
            ? "bg-accent-primary text-white"
            : "text-text-secondary hover:text-accent-primary hover:bg-surface/50"
        }`}
      >
        NL
      </button>
    </div>
  );
}
