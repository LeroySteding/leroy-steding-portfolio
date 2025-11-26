import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { type Locale, locales } from "@/i18n/config";

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isNL = locale === "nl";

  return {
    title: isNL
      ? "STEDING. | Full-Stack Developer & AI Automation Architect"
      : "STEDING. | Full-Stack Developer & AI Automation Architect",
    description: isNL
      ? "Schaalbare AI-gestuurde webplatforms & digitale automatiseringsoplossingen bouwen."
      : "Building scalable AI-driven web platforms & digital automation solutions.",
    alternates: {
      canonical: isNL
        ? "https://leroysteding.nl"
        : "https://leroysteding.nl/en",
      languages: {
        nl: "https://leroysteding.nl",
        en: "https://leroysteding.nl/en",
        "x-default": "https://leroysteding.nl",
      },
    },
    openGraph: {
      locale: isNL ? "nl_NL" : "en_US",
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  // Validate locale
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  // Children are wrapped with NextIntlClientProvider in root layout
  return children;
}
