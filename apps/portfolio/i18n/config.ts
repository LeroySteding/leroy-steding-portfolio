export const locales = ["nl", "en"] as const;
export const defaultLocale = "nl" as const;
export type Locale = (typeof locales)[number];
