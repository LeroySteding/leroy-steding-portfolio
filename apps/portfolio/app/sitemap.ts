import type { MetadataRoute } from "next";
import { getExperiences, getPosts, getProjects } from "@/lib/convex-content";

const baseUrl = "https://www.leroysteding.nl";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fetch all content from Convex for both locales
  const [
    postsEn,
    postsNl,
    projectsEn,
    projectsNl,
    experiencesEn,
    experiencesNl,
  ] = await Promise.all([
    getPosts("en"),
    getPosts("nl"),
    getProjects("en"),
    getProjects("nl"),
    getExperiences("en"),
    getExperiences("nl"),
  ]);

  // Static pages for both languages
  const locales = ["en", "nl"];
  const staticPages = ["", "/about", "/projects", "/blog", "/contact"];

  const staticUrls: MetadataRoute.Sitemap = locales.flatMap((locale) =>
    staticPages.map((page) => ({
      url: `${baseUrl}/${locale}${page}`,
      lastModified: new Date(),
      changeFrequency: page === "" ? "weekly" : "monthly",
      priority: page === "" ? 1.0 : 0.8,
    })),
  );

  // Blog posts
  const allPosts = [
    ...postsEn.map((p) => ({ ...p, lang: "en" })),
    ...postsNl.map((p) => ({ ...p, lang: "nl" })),
  ];
  const postUrls: MetadataRoute.Sitemap = allPosts.map((post) => {
    const slug =
      typeof post.slug === "string"
        ? post.slug
        : ((post.slug as any)?.current ?? "");
    return {
      url: `${baseUrl}/${post.lang}/blog/${slug}`,
      lastModified: new Date(post.publishedAt),
      changeFrequency: "monthly",
      priority: 0.7,
    };
  });

  // Projects
  const allProjects = [
    ...projectsEn.map((p) => ({ ...p, lang: "en" })),
    ...projectsNl.map((p) => ({ ...p, lang: "nl" })),
  ];
  const projectUrls: MetadataRoute.Sitemap = allProjects.map((project) => ({
    url: `${baseUrl}/${project.lang}/projects/${project.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  // Experiences
  const allExperiences = [
    ...experiencesEn.map((e) => ({ ...e, lang: "en" })),
    ...experiencesNl.map((e) => ({ ...e, lang: "nl" })),
  ];
  const experienceUrls: MetadataRoute.Sitemap = allExperiences.map((exp) => ({
    url: `${baseUrl}/${exp.lang}/experience/${exp.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticUrls, ...postUrls, ...projectUrls, ...experienceUrls];
}
