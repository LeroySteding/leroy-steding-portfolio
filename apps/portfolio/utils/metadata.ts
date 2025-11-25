import type { Metadata } from "next";

type Language = "en" | "nl";

interface MetadataConfig {
  title: string;
  description: string;
  keywords: string[];
  path?: string;
}

const siteUrl = "https://leroysteding.nl";

export const metadataByLanguage: Record<Language, MetadataConfig> = {
  en: {
    title: "Leroy Steding | Full-Stack Developer & AI Automation Architect",
    description:
      "Building scalable AI-driven web platforms & digital automation solutions. Full-stack developer specializing in Next.js, TypeScript, React, and AI automation.",
    keywords: [
      "Leroy Steding",
      "Full-Stack Developer",
      "AI Automation",
      "Next.js",
      "TypeScript",
      "React",
      "STEDING",
      "Hifive",
      "Web Development",
      "Netherlands",
    ],
  },
  nl: {
    title: "Leroy Steding | Full-Stack Developer & AI Automatisering Architect",
    description:
      "Bouwt schaalbare AI-gedreven webplatforms & digitale automatiseringsoplossingen. Full-stack developer gespecialiseerd in Next.js, TypeScript, React en AI-automatisering.",
    keywords: [
      "Leroy Steding",
      "Full-Stack Developer",
      "AI Automatisering",
      "Next.js",
      "TypeScript",
      "React",
      "STEDING",
      "Hifive",
      "Webontwikkeling",
      "Nederland",
    ],
  },
};

export function generateMetadata(
  language: Language = "en",
  config?: Partial<MetadataConfig>,
): Metadata {
  const baseConfig = metadataByLanguage[language];
  const title = config?.title || baseConfig.title;
  const description = config?.description || baseConfig.description;
  const keywords = config?.keywords || baseConfig.keywords;
  const path = config?.path || "";

  const url = `${siteUrl}${path}`;
  const _alternateLanguage = language === "en" ? "nl" : "en";

  return {
    title,
    description,
    keywords,
    authors: [{ name: "Leroy Steding" }],
    creator: "Leroy Steding",
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: url,
      languages: {
        en: `${siteUrl}${path}?lang=en`,
        nl: `${siteUrl}${path}?lang=nl`,
        "x-default": `${siteUrl}${path}`,
      },
    },
    openGraph: {
      type: "website",
      locale: language === "en" ? "en_US" : "nl_NL",
      url,
      siteName: "Leroy Steding Portfolio",
      title,
      description,
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og-image.png"],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export function generateProjectMetadata(
  projectTitle: string,
  projectDescription: string,
  language: Language = "en",
): Metadata {
  const baseTitle =
    language === "en"
      ? "Leroy Steding | Full-Stack Developer"
      : "Leroy Steding | Full-Stack Developer";

  return generateMetadata(language, {
    title: `${projectTitle} | ${baseTitle}`,
    description: projectDescription,
    path: `/projects/${projectTitle.toLowerCase().replace(/\s+/g, "-")}`,
  });
}

export function generateExperienceMetadata(
  experienceTitle: string,
  company: string,
  experienceDescription: string,
  language: Language = "en",
): Metadata {
  const baseTitle =
    language === "en"
      ? "Leroy Steding | Professional Experience"
      : "Leroy Steding | Professionele Ervaring";

  return generateMetadata(language, {
    title: `${experienceTitle} at ${company} | ${baseTitle}`,
    description: experienceDescription,
    path: `/experience/${company.toLowerCase().replace(/\s+/g, "-")}`,
  });
}
