import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import About from "@/components/sections/About";
import Experience from "@/components/sections/Experience";
import TechStack from "@/components/sections/TechStack";
import {
  getAboutSection,
  getExperienceSection,
  getExperiences,
  getTechStackSection,
} from "@/lib/sanity-content";
import AboutPageHero from "./AboutPageHero";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const isNL = locale === "nl";

  return {
    title: isNL
      ? "Over mij | Leroy Steding - Full-Stack Developer & AI Automation Architect"
      : "About | Leroy Steding - Full-Stack Developer & AI Automation Architect",
    description: isNL
      ? "Leer meer over Leroy Stedings reis, ervaring, technische expertise en opleiding. Full-stack developer gespecialiseerd in AI automatisering, Next.js, React en moderne webtechnologieën."
      : "Learn about Leroy Steding's journey, experience, technical expertise, and education. Full-stack developer specializing in AI automation, Next.js, React, and modern web technologies.",
    openGraph: {
      title: isNL
        ? "Over Leroy Steding | Full-Stack Developer & AI Automation Architect"
        : "About Leroy Steding | Full-Stack Developer & AI Automation Architect",
      description: isNL
        ? "Leer meer over Leroy Stedings reis, ervaring, technische expertise en opleiding."
        : "Learn about Leroy Steding's journey, experience, technical expertise, and education.",
      url: isNL
        ? "https://leroysteding.nl/about"
        : "https://leroysteding.nl/en/about",
      siteName: "Leroy Steding Portfolio",
      locale: isNL ? "nl_NL" : "en_US",
      type: "profile",
    },
    alternates: {
      canonical: isNL
        ? "https://leroysteding.nl/about"
        : "https://leroysteding.nl/en/about",
      languages: {
        nl: "https://leroysteding.nl/about",
        en: "https://leroysteding.nl/en/about",
      },
    },
  };
}

export default async function AboutPage() {
  const locale = await getLocale();

  // Fetch all Sanity data in parallel
  const [aboutData, experienceSection, experiences, techStackSection] =
    await Promise.all([
      getAboutSection(locale),
      getExperienceSection(locale),
      getExperiences(locale),
      getTechStackSection(locale),
    ]);

  return (
    <main className="min-h-screen bg-primary-bg">
      <AboutPageHero />
      <About data={aboutData} />
      <Experience data={experiences} sectionData={experienceSection} />
      <TechStack sectionData={techStackSection} />
    </main>
  );
}
