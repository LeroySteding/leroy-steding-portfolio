/**
 * Metadata Utilities
 *
 * Helper functions for generating consistent metadata across pages.
 */

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.leroysteding.nl";

/**
 * Generate canonical URL for a page
 * @param path - The page path (e.g., "/about", "/blog/my-post")
 * @param locale - The current locale ("en" or "nl")
 * @returns The full canonical URL
 */
export function getCanonicalUrl(path: string, locale: string): string {
  // Remove leading slash if present
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;

  // Dutch is the default locale, so it doesn't have a prefix
  // English has /en prefix
  if (locale === "nl") {
    return cleanPath ? `${SITE_URL}/${cleanPath}` : SITE_URL;
  }

  return cleanPath ? `${SITE_URL}/en/${cleanPath}` : `${SITE_URL}/en`;
}

/**
 * Generate alternate language URLs for a page
 * @param path - The page path (e.g., "/about", "/blog/my-post")
 * @returns Object with language URLs
 */
export function getAlternateLanguages(path: string): {
  nl: string;
  en: string;
  "x-default": string;
} {
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;

  return {
    nl: cleanPath ? `${SITE_URL}/${cleanPath}` : SITE_URL,
    en: cleanPath ? `${SITE_URL}/en/${cleanPath}` : `${SITE_URL}/en`,
    "x-default": cleanPath ? `${SITE_URL}/${cleanPath}` : SITE_URL,
  };
}

/**
 * Generate complete alternates metadata for a page
 * @param path - The page path (e.g., "/about", "/blog/my-post")
 * @param locale - The current locale ("en" or "nl")
 * @returns Alternates metadata object
 */
export function getAlternatesMetadata(
  path: string,
  locale: string,
): {
  canonical: string;
  languages: { nl: string; en: string; "x-default": string };
} {
  return {
    canonical: getCanonicalUrl(path, locale),
    languages: getAlternateLanguages(path),
  };
}
