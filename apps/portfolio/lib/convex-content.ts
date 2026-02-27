/**
 * Convex Content Fetching Utilities
 *
 * Drop-in replacement for sanity-content.ts.
 * Same interfaces, same function signatures, backed by Convex instead of Sanity.
 * Uses ConvexHttpClient for SSR compatibility.
 */

import { queryConvex } from "./convex-client";
import { calculateReadingTime } from "./utils/reading-time";

// ==================== TYPE DEFINITIONS ====================
// Re-exported with same names for backward compatibility

export interface SanityHeroSection {
  _id: string;
  name: string;
  title: string;
  subtitle: string;
  tagline: string;
  ctaButtons?: { label: string; href: string; variant: string }[];
  stats?: { value: string; label: string }[];
  language: string;
}

export interface SanityAboutSection {
  _id: string;
  name: string;
  title: string;
  subtitle: string;
  description: string;
  highlights?: { title: string; description: string }[];
  image?: string;
  language: string;
}

export interface SanityContactSection {
  _id: string;
  name: string;
  title: string;
  subtitle: string;
  description: string;
  email: string;
  phone?: string;
  location?: string;
  socialLinks?: { platform: string; url: string }[];
  language: string;
}

export interface SanityProjectsSection {
  _id: string;
  name: string;
  title: string;
  titleHighlight: string;
  subtitle: string;
  language: string;
}

export interface SanityExperienceSection {
  _id: string;
  name: string;
  title: string;
  titleHighlight: string;
  subtitle: string;
  language: string;
}

export interface SanitySkillsSection {
  _id: string;
  name: string;
  title: string;
  titleHighlight: string;
  subtitle: string;
  skills?: { name: string; level: number; category: string }[];
  language: string;
}

export interface SanityBlogSection {
  _id: string;
  name: string;
  title: string;
  titleHighlight: string;
  subtitle: string;
  language: string;
}

export interface SanityTechStackSection {
  _id: string;
  name: string;
  title: string;
  titleHighlight: string;
  subtitle: string;
  technologies?: { name: string; icon: string; category: string }[];
  language: string;
}

export interface SanityProject {
  _id: string;
  title: string;
  slug: string;
  id: string;
  description: string;
  longDescription?: string;
  image?: string;
  galleryImages?: string[];
  technologies: string[];
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
  category: string;
  year: number;
  duration?: string;
  role?: string;
  client?: string;
  challenges?: string[];
  solutions?: string[];
  impact?: string;
  testimonial?: string;
  achievements?: string[];
  showOnCV?: boolean;
  language: string;
}

export interface SanityExperience {
  _id: string;
  title: string;
  slug: string;
  id: string;
  company: string;
  companyLogo?: string;
  companyUrl?: string;
  period: string;
  startDate: string;
  endDate?: string;
  location?: string;
  description: string;
  longDescription?: string;
  technologies: string[];
  color?: string;
  highlights?: string[];
  achievements?: string[];
  responsibilities?: string[];
  teamSize?: number;
  impact?: string;
  language: string;
}

export interface SanityPost {
  _id: string;
  id?: string;
  title: string;
  slug: { current: string } | string;
  excerpt: string;
  coverImage?: string;
  content: unknown;
  category: "article" | "tutorial" | "research";
  tags: string[];
  author: string;
  publishedAt: string;
  readingTime: number;
  featured: boolean;
  language: string;
}

export interface SanityService {
  _id: string;
  title: string;
  slug: string;
  id: string;
  description: string;
  longDescription?: string;
  icon: string;
  gradient: string;
  features?: string[];
  technologies?: string[];
  processSteps?: { title: string; description: string }[];
  benefits?: string[];
  faqs?: { question: string; answer: string }[];
  stats?: { value: string; label: string; icon: string }[];
  caseStudies?: {
    title: string;
    description: string;
    results: string[];
    image?: string;
  }[];
  order: number;
  language: string;
}

// ==================== HELPERS ====================

type ConvexLocale = "en" | "nl";

function toConvexLocale(locale: string): ConvexLocale {
  return locale === "nl" ? "nl" : "en";
}

// ==================== SECTION FETCHERS ====================

export async function getHeroSection(
  locale: string,
): Promise<SanityHeroSection | null> {
  return queryConvex<SanityHeroSection | null>("portfolio:getSection", {
    key: "section:hero",
    locale: toConvexLocale(locale),
  });
}

export async function getAboutSection(
  locale: string,
): Promise<SanityAboutSection | null> {
  return queryConvex<SanityAboutSection | null>("portfolio:getSection", {
    key: "section:about",
    locale: toConvexLocale(locale),
  });
}

export async function getContactSection(
  locale: string,
): Promise<SanityContactSection | null> {
  return queryConvex<SanityContactSection | null>("portfolio:getSection", {
    key: "section:contact",
    locale: toConvexLocale(locale),
  });
}

export async function getProjectsSection(
  locale: string,
): Promise<SanityProjectsSection | null> {
  return queryConvex<SanityProjectsSection | null>("portfolio:getSection", {
    key: "section:projects",
    locale: toConvexLocale(locale),
  });
}

export async function getExperienceSection(
  locale: string,
): Promise<SanityExperienceSection | null> {
  return queryConvex<SanityExperienceSection | null>("portfolio:getSection", {
    key: "section:experience",
    locale: toConvexLocale(locale),
  });
}

export async function getSkillsSection(
  locale: string,
): Promise<SanitySkillsSection | null> {
  return queryConvex<SanitySkillsSection | null>("portfolio:getSection", {
    key: "section:skills",
    locale: toConvexLocale(locale),
  });
}

export async function getBlogSection(
  locale: string,
): Promise<SanityBlogSection | null> {
  return queryConvex<SanityBlogSection | null>("portfolio:getSection", {
    key: "section:blog",
    locale: toConvexLocale(locale),
  });
}

export async function getTechStackSection(
  locale: string,
): Promise<SanityTechStackSection | null> {
  return queryConvex<SanityTechStackSection | null>("portfolio:getSection", {
    key: "section:techstack",
    locale: toConvexLocale(locale),
  });
}

// ==================== CONTENT FETCHERS ====================

function mapConvexProject(p: any): SanityProject {
  // Extract text from Tiptap JSON if present
  let longDesc = "";
  if (typeof p.content === "string") {
    longDesc = p.content;
  } else if (p.content?.type === "doc" && Array.isArray(p.content?.content)) {
    longDesc = p.content.content
      .map((node: any) => {
        if (node.type === "paragraph" && Array.isArray(node.content)) {
          return node.content.map((c: any) => c.text || "").join("");
        }
        return "";
      })
      .filter(Boolean)
      .join("\n\n");
  }

  return {
    _id: p._id,
    title: p.title,
    slug: p.slug,
    id: p._id,
    description: p.description,
    longDescription: longDesc || p.description,
    image: p.coverImage,
    galleryImages: p.galleryImages ?? [],
    technologies: p.technologies ?? [],
    liveUrl: p.liveUrl,
    githubUrl: p.githubUrl,
    featured: p.featured ?? false,
    category: "product", // Default category (Convex schema doesn't have this field)
    year: p.year ?? new Date().getFullYear(),
    duration: p.duration,
    role: p.role,
    client: p.client,
    language: p.locale,
    // Optional fields not in Convex schema
    challenges: [],
    solutions: [],
    impact: undefined,
    testimonial: undefined,
  };
}

function mapConvexExperience(e: any): SanityExperience {
  const startDate = e.startDate;
  const endDate = e.endDate;
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : null;
  const period = end
    ? `${start.getFullYear()} - ${end.getFullYear()}`
    : `${start.getFullYear()} - Present`;

  return {
    _id: e._id,
    title: e.position ?? e.title,
    slug: `${e.company}-${e.title}`.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    id: e._id,
    company: e.company,
    companyLogo: e.logoUrl,
    period,
    startDate: e.startDate,
    endDate: e.endDate,
    location: e.location,
    description:
      e.description ?? (typeof e.content === "string" ? e.content : ""),
    technologies: e.technologies ?? [],
    achievements: e.achievements,
    language: e.locale,
  };
}

function mapConvexPost(p: any): SanityPost {
  // Calculate reading time from content if not provided
  let readingTimeMinutes = p.readingTime ?? 5;

  // If no reading time is stored, calculate it from content
  if (!p.readingTime && p.content) {
    readingTimeMinutes = calculateReadingTime(p.content);
  }

  return {
    _id: p._id,
    id: p._id,
    title: p.title,
    slug: p.slug,
    excerpt: p.excerpt ?? "",
    coverImage: p.coverImage,
    content: p.content,
    category: "article",
    tags: p.tags ?? [],
    author: p.authorName ?? p.author ?? "Leroy Steding",
    publishedAt: p.publishedAt
      ? new Date(p.publishedAt).toISOString()
      : new Date(p._creationTime).toISOString(),
    readingTime: readingTimeMinutes,
    featured: p.featured ?? false,
    language: p.locale,
  };
}

export async function getProjects(locale: string): Promise<SanityProject[]> {
  const projects = await queryConvex<any[]>("portfolio:getPublishedProjects", {
    locale: toConvexLocale(locale),
  });
  return projects.map(mapConvexProject);
}

export async function getProjectById(
  id: string,
  locale: string,
): Promise<SanityProject | null> {
  try {
    const project = await queryConvex<any | null>("portfolio:getProjectById", {
      id,
      locale: toConvexLocale(locale),
    });
    return project ? mapConvexProject(project) : null;
  } catch (error) {
    // Invalid ID format, return null
    return null;
  }
}

export async function getProjectBySlug(
  slug: string,
  locale: string,
): Promise<SanityProject | null> {
  const project = await queryConvex<any | null>("portfolio:getProjectBySlug", {
    slug,
    locale: toConvexLocale(locale),
  });
  return project ? mapConvexProject(project) : null;
}

export async function getProjectByIdOrSlug(
  idOrSlug: string,
  locale: string,
): Promise<SanityProject | null> {
  // Try ID lookup first (safe - returns null if not a valid ID)
  const byId = await getProjectById(idOrSlug, locale);
  if (byId) return byId;

  // Fallback to slug lookup
  return getProjectBySlug(idOrSlug, locale);
}

export async function getFeaturedProjects(
  locale: string,
): Promise<SanityProject[]> {
  const projects = await queryConvex<any[]>("portfolio:getFeaturedProjects", {
    locale: toConvexLocale(locale),
  });
  return projects.map(mapConvexProject);
}

export async function getExperiences(
  locale: string,
): Promise<SanityExperience[]> {
  const experiences = await queryConvex<any[]>(
    "portfolio:getPublishedExperiences",
    { locale: toConvexLocale(locale) },
  );
  return experiences.map(mapConvexExperience);
}

export async function getExperienceBySlug(
  slug: string,
  locale: string,
): Promise<SanityExperience | null> {
  const experience = await queryConvex<any | null>(
    "portfolio:getExperienceBySlug",
    { slug, locale: toConvexLocale(locale) },
  );
  return experience ? mapConvexExperience(experience) : null;
}

export async function getPosts(locale: string): Promise<SanityPost[]> {
  const posts = await queryConvex<any[]>("portfolio:getPublishedPosts", {
    locale: toConvexLocale(locale),
  });
  return posts.map(mapConvexPost);
}

export async function getPostById(
  id: string,
  locale: string,
): Promise<SanityPost | null> {
  try {
    const post = await queryConvex<any | null>("portfolio:getPostById", {
      id,
      locale: toConvexLocale(locale),
    });
    return post ? mapConvexPost(post) : null;
  } catch (error) {
    // Invalid ID format, return null
    return null;
  }
}

export async function getPostBySlug(
  slug: string,
  locale: string,
): Promise<SanityPost | null> {
  const post = await queryConvex<any | null>("portfolio:getPostBySlug", {
    slug,
    locale: toConvexLocale(locale),
  });
  return post ? mapConvexPost(post) : null;
}

export async function getPostByIdOrSlug(
  idOrSlug: string,
  locale: string,
): Promise<SanityPost | null> {
  // Try ID lookup first (safe - returns null if not a valid ID)
  const byId = await getPostById(idOrSlug, locale);
  if (byId) return byId;

  // Fallback to slug lookup
  return getPostBySlug(idOrSlug, locale);
}

export async function getFeaturedPosts(locale: string): Promise<SanityPost[]> {
  const posts = await queryConvex<any[]>("portfolio:getFeaturedPosts", {
    locale: toConvexLocale(locale),
  });
  return posts.map(mapConvexPost);
}

// ==================== SERVICE FETCHERS ====================
// Services are stored in site_settings as "section:services"

export async function getServices(locale: string): Promise<SanityService[]> {
  const services = await queryConvex<SanityService[] | null>(
    "portfolio:getSection",
    { key: "content:services", locale: toConvexLocale(locale) },
  );
  return services ?? [];
}

export async function getServiceBySlug(
  slug: string,
  locale: string,
): Promise<SanityService | null> {
  const services = await getServices(locale);
  return services.find((s) => s.slug === slug) ?? null;
}

// ==================== UTILITY FUNCTIONS ====================

export async function fetchWithFallback<T>(
  _query: string,
  locale: string,
  _additionalParams: Record<string, unknown> = {},
): Promise<T | null> {
  // With Convex, fallback is handled server-side in the query functions
  // This is kept for API compatibility
  console.warn(
    "fetchWithFallback is deprecated with Convex backend. Use specific fetchers instead.",
  );
  return null;
}

export async function getHomePageSections(locale: string) {
  const [hero, about, projects, experience, skills, blog, techStack, contact] =
    await Promise.all([
      getHeroSection(locale),
      getAboutSection(locale),
      getProjectsSection(locale),
      getExperienceSection(locale),
      getSkillsSection(locale),
      getBlogSection(locale),
      getTechStackSection(locale),
      getContactSection(locale),
    ]);

  return {
    hero,
    about,
    projects,
    experience,
    skills,
    blog,
    techStack,
    contact,
  };
}

export async function getHomePageContent(locale: string) {
  const [
    sections,
    projectItems,
    experienceItems,
    featuredPosts,
    featuredProjects,
  ] = await Promise.all([
    getHomePageSections(locale),
    getProjects(locale),
    getExperiences(locale),
    getFeaturedPosts(locale),
    getFeaturedProjects(locale),
  ]);

  return {
    sections,
    projectItems,
    experienceItems,
    featuredPosts,
    featuredProjects,
  };
}
