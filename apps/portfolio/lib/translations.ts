import type { Translations } from "@/locales/en";
import { en } from "@/locales/en";
import { nl } from "@/locales/nl";

/**
 * Server-side translation helper.
 * Returns the full translation object for a given locale.
 */
export function getTranslations(locale: string): Translations {
  return locale === "nl" ? nl : en;
}
