"use client";

import { useLocale } from "next-intl";
import type { Translations } from "@/locales/en";
import { en } from "@/locales/en";
import { nl } from "@/locales/nl";

/**
 * Custom hook that provides backward-compatible access to translations.
 * Uses next-intl's locale detection but returns the full translation object
 * for existing components that use dot notation (e.g., t.nav.about).
 *
 * For new components, prefer using `useTranslations` from 'next-intl' directly
 * with namespaced access like: const t = useTranslations('hero');
 */
export function useTranslation(): Translations {
  const locale = useLocale();
  return locale === "nl" ? nl : en;
}

// Re-export next-intl's hooks for new components
export { useLocale, useTranslations } from "next-intl";
