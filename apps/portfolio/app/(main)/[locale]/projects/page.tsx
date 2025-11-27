import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import LayoutContainer from "@/components/ui/LayoutContainer";
import PageHero from "@/components/ui/PageHero";
import { getTranslations } from "@/lib/translations";
import { client } from "@/sanity/lib/client";
import { projectsQuery, projectsSectionQuery } from "@/sanity/lib/queries";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const isNL = locale === "nl";

  const ogImageUrl = new URL("/api/og", "https://www.leroysteding.nl");
  ogImageUrl.searchParams.set("title", "Featured Projects");
  ogImageUrl.searchParams.set(
    "description",
    "Explore my portfolio of web applications, AI automation solutions, and client projects",
  );
  ogImageUrl.searchParams.set("type", "project");

  return {
    title: isNL ? "Projecten | Leroy Steding" : "Projects | Leroy Steding",
    description: isNL
      ? "Ontdek mijn portfolio van webapplicaties, AI-automatiseringsoplossingen en klantprojecten"
      : "Explore my portfolio of web applications, AI automation solutions, and client projects",
    alternates: {
      canonical: isNL
        ? "https://leroysteding.nl/projects"
        : "https://leroysteding.nl/en/projects",
      languages: {
        nl: "https://leroysteding.nl/projects",
        en: "https://leroysteding.nl/en/projects",
        "x-default": "https://leroysteding.nl/projects",
      },
    },
    openGraph: {
      title: isNL
        ? "Uitgelichte Projecten | Leroy Steding"
        : "Featured Projects | Leroy Steding",
      description: isNL
        ? "Ontdek mijn portfolio van webapplicaties, AI-automatiseringsoplossingen en klantprojecten"
        : "Explore my portfolio of web applications, AI automation solutions, and client projects",
      locale: isNL ? "nl_NL" : "en_US",
      images: [
        {
          url: ogImageUrl.toString(),
          width: 1200,
          height: 630,
          alt: "Leroy Steding Projects",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: isNL
        ? "Uitgelichte Projecten | Leroy Steding"
        : "Featured Projects | Leroy Steding",
      description: isNL
        ? "Ontdek mijn portfolio van webapplicaties, AI-automatiseringsoplossingen en klantprojecten"
        : "Explore my portfolio of web applications, AI automation solutions, and client projects",
      images: [ogImageUrl.toString()],
    },
  };
}

import ProjectsGrid from "./ProjectsGrid";

export interface SanityProject {
  _id: string;
  title: string;
  slug: string;
  id: string;
  description: string;
  longDescription?: string;
  image?: string;
  technologies: string[];
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
  category: "product" | "client" | "internal";
  year: number;
  challenges?: string[];
  solutions?: string[];
  impact?: string[];
  testimonial?: {
    quote: string;
    author: string;
    role: string;
  };
  achievements?: string[];
  language?: string;
}

interface ProjectsSection {
  _id: string;
  title: string;
  titleHighlight: string;
  subtitle: string;
}

export default async function ProjectsPage() {
  const locale = await getLocale();
  const t = getTranslations(locale);

  // Fetch projects and section data from Sanity
  const [projects, section]: [SanityProject[], ProjectsSection | null] =
    await Promise.all([
      client.fetch(projectsQuery, { language: locale }),
      client.fetch(projectsSectionQuery, { language: locale }),
    ]);

  // Filter featured projects
  const featuredProjects = projects.filter((p) => p.featured);

  return (
    <main className="min-h-screen bg-primary-bg">
      {/* Hero Section */}
      <PageHero
        title={section?.title || t.projects.title || "Featured"}
        titleHighlight={
          section?.titleHighlight || t.projects.titleHighlight || "Projects"
        }
        subtitle={
          section?.subtitle ||
          "Explore my portfolio of web applications, AI automation solutions, and client projects"
        }
        iconName="FolderKanban"
        breadcrumbs={[{ label: "Projects" }]}
        backgroundImage="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1920&q=80"
      />

      {/* Projects Grid */}
      <section className="section relative bg-primary-bg">
        <LayoutContainer>
          <ProjectsGrid
            projects={featuredProjects}
            translations={t}
            locale={locale}
          />
        </LayoutContainer>
      </section>
    </main>
  );
}
