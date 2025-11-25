import { useLanguage } from "@/contexts/LanguageContext";

/**
 * Get a localized path by adding the appropriate locale prefix
 * @param path - The base path (e.g., "/about")
 * @param locale - The locale to use ("en" or "nl")
 * @returns The localized path (e.g., "/nl/about" for Dutch, "/about" for English)
 */
export function getLocalizedPath(path: string, locale: "en" | "nl"): string {
  // Remove any existing locale prefix
  const cleanPath = path.replace(/^\/(en|nl)/, "") || "/";

  // Add locale prefix if Dutch (English is the default with no prefix)
  return locale === "nl" ? `/nl${cleanPath}` : cleanPath;
}

/**
 * Hook to get a function that localizes paths based on current language
 * @returns Function that takes a path and returns the localized version
 */
export function useLocalizedPath() {
  const { language } = useLanguage();
  return (path: string) => getLocalizedPath(path, language);
}
