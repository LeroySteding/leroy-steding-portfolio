import type { MetadataRoute } from "next";
import { groq } from "next-sanity";
import { client } from "@/sanity/lib/client";

const baseUrl = "https://www.leroysteding.nl";

// Queries for sitemap data
const postsForSitemapQuery = groq`
  *[_type == "post"] {
    "slug": slug.current,
    _updatedAt,
    language
  }
`;

const projectsForSitemapQuery = groq`
  *[_type == "project"] {
    "slug": slug.current,
    _updatedAt,
    language
  }
`;

const experiencesForSitemapQuery = groq`
  *[_type == "experience"] {
    "slug": slug.current,
    _updatedAt,
    language
  }
`;

type SanityDocument = {
  slug: string;
  _updatedAt: string;
  language?: string;
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fetch all content from Sanity
  const [posts, projects, experiences] = await Promise.all([
    client.fetch<SanityDocument[]>(postsForSitemapQuery),
    client.fetch<SanityDocument[]>(projectsForSitemapQuery),
    client.fetch<SanityDocument[]>(experiencesForSitemapQuery),
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
  const postUrls: MetadataRoute.Sitemap = posts.map((post) => {
    const locale = post.language || "en";
    return {
      url: `${baseUrl}/${locale}/blog/${post.slug}`,
      lastModified: new Date(post._updatedAt),
      changeFrequency: "monthly",
      priority: 0.7,
    };
  });

  // Projects
  const projectUrls: MetadataRoute.Sitemap = projects.map((project) => {
    const locale = project.language || "en";
    return {
      url: `${baseUrl}/${locale}/projects/${project.slug}`,
      lastModified: new Date(project._updatedAt),
      changeFrequency: "monthly",
      priority: 0.7,
    };
  });

  // Experiences
  const experienceUrls: MetadataRoute.Sitemap = experiences.map((exp) => {
    const locale = exp.language || "en";
    return {
      url: `${baseUrl}/${locale}/experience/${exp.slug}`,
      lastModified: new Date(exp._updatedAt),
      changeFrequency: "monthly",
      priority: 0.6,
    };
  });

  return [...staticUrls, ...postUrls, ...projectUrls, ...experienceUrls];
}
