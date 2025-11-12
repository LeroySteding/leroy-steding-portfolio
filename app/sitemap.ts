import { MetadataRoute } from "next";
import { projects } from "@/data/projects";
import { experiences } from "@/data/experiences";

const siteUrl = "https://leroysteding.nl";

export default function sitemap(): MetadataRoute.Sitemap {
  const languages = ["en", "nl"];

  // Homepage
  const homepage = languages.map((lang) => ({
    url: `${siteUrl}?lang=${lang}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 1.0,
    alternates: {
      languages: {
        en: `${siteUrl}?lang=en`,
        nl: `${siteUrl}?lang=nl`,
      },
    },
  }));

  // Project pages
  const projectPages = projects.flatMap((project) =>
    languages.map((lang) => ({
      url: `${siteUrl}/projects/${project.id}?lang=${lang}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
      alternates: {
        languages: {
          en: `${siteUrl}/projects/${project.id}?lang=en`,
          nl: `${siteUrl}/projects/${project.id}?lang=nl`,
        },
      },
    }))
  );

  // Experience pages
  const experiencePages = experiences.flatMap((experience) =>
    languages.map((lang) => ({
      url: `${siteUrl}/experience/${experience.id}?lang=${lang}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
      alternates: {
        languages: {
          en: `${siteUrl}/experience/${experience.id}?lang=en`,
          nl: `${siteUrl}/experience/${experience.id}?lang=nl`,
        },
      },
    }))
  );

  // CV page
  const cvPage = languages.map((lang) => ({
    url: `${siteUrl}/cv?lang=${lang}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
    alternates: {
      languages: {
        en: `${siteUrl}/cv?lang=en`,
        nl: `${siteUrl}/cv?lang=nl`,
      },
    },
  }));

  return [...homepage, ...projectPages, ...experiencePages, ...cvPage];
}
