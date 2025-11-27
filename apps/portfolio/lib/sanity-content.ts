/**
 * Sanity Content Fetching Utilities
 *
 * Centralized layer for fetching content from Sanity CMS with locale support.
 * All functions accept a locale parameter and handle English fallback automatically.
 */

import { client } from "@/sanity/lib/client";
import {
  aboutSectionQuery,
  blogSectionQuery,
  contactSectionQuery,
  experienceBySlugQuery,
  experienceSectionQuery,
  experiencesQuery,
  featuredPostsQuery,
  featuredProjectsQuery,
  // Section queries
  heroSectionQuery,
  postBySlugQuery,
  postsQuery,
  projectBySlugQuery,
  // Content queries
  projectsQuery,
  projectsSectionQuery,
  serviceBySlugQuery,
  servicesQuery,
  skillsSectionQuery,
  techStackSectionQuery,
} from "@/sanity/lib/queries";

// ==================== TYPE DEFINITIONS ====================

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
  technologies: string[];
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
  category: string;
  year: number;
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
  id?: string; // Alias for compatibility
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

// ==================== SECTION FETCHERS ====================

export async function getHeroSection(
  locale: string,
): Promise<SanityHeroSection | null> {
  return client.fetch<SanityHeroSection | null>(heroSectionQuery, {
    language: locale,
  });
}

export async function getAboutSection(
  locale: string,
): Promise<SanityAboutSection | null> {
  return client.fetch<SanityAboutSection | null>(aboutSectionQuery, {
    language: locale,
  });
}

export async function getContactSection(
  locale: string,
): Promise<SanityContactSection | null> {
  return client.fetch<SanityContactSection | null>(contactSectionQuery, {
    language: locale,
  });
}

export async function getProjectsSection(
  locale: string,
): Promise<SanityProjectsSection | null> {
  return client.fetch<SanityProjectsSection | null>(projectsSectionQuery, {
    language: locale,
  });
}

export async function getExperienceSection(
  locale: string,
): Promise<SanityExperienceSection | null> {
  return client.fetch<SanityExperienceSection | null>(experienceSectionQuery, {
    language: locale,
  });
}

export async function getSkillsSection(
  locale: string,
): Promise<SanitySkillsSection | null> {
  return client.fetch<SanitySkillsSection | null>(skillsSectionQuery, {
    language: locale,
  });
}

export async function getBlogSection(
  locale: string,
): Promise<SanityBlogSection | null> {
  return client.fetch<SanityBlogSection | null>(blogSectionQuery, {
    language: locale,
  });
}

export async function getTechStackSection(
  locale: string,
): Promise<SanityTechStackSection | null> {
  return client.fetch<SanityTechStackSection | null>(techStackSectionQuery, {
    language: locale,
  });
}

// ==================== CONTENT FETCHERS ====================

export async function getProjects(locale: string): Promise<SanityProject[]> {
  return client.fetch<SanityProject[]>(projectsQuery, { language: locale });
}

export async function getProjectBySlug(
  slug: string,
  locale: string,
): Promise<SanityProject | null> {
  return client.fetch<SanityProject | null>(projectBySlugQuery, {
    slug,
    language: locale,
  });
}

export async function getFeaturedProjects(
  locale: string,
): Promise<SanityProject[]> {
  return client.fetch<SanityProject[]>(featuredProjectsQuery, {
    language: locale,
  });
}

export async function getExperiences(
  locale: string,
): Promise<SanityExperience[]> {
  return client.fetch<SanityExperience[]>(experiencesQuery, {
    language: locale,
  });
}

export async function getExperienceBySlug(
  slug: string,
  locale: string,
): Promise<SanityExperience | null> {
  return client.fetch<SanityExperience | null>(experienceBySlugQuery, {
    slug,
    language: locale,
  });
}

export async function getPosts(locale: string): Promise<SanityPost[]> {
  return client.fetch<SanityPost[]>(postsQuery, { language: locale });
}

export async function getPostBySlug(
  slug: string,
  locale: string,
): Promise<SanityPost | null> {
  return client.fetch<SanityPost | null>(postBySlugQuery, {
    slug,
    language: locale,
  });
}

export async function getFeaturedPosts(locale: string): Promise<SanityPost[]> {
  return client.fetch<SanityPost[]>(featuredPostsQuery, { language: locale });
}

// ==================== SERVICE FETCHERS ====================

export async function getServices(locale: string): Promise<SanityService[]> {
  return client.fetch<SanityService[]>(servicesQuery, { language: locale });
}

export async function getServiceBySlug(
  slug: string,
  locale: string,
): Promise<SanityService | null> {
  return client.fetch<SanityService | null>(serviceBySlugQuery, {
    slug,
    language: locale,
  });
}

// ==================== UTILITY FUNCTIONS ====================

/**
 * Generic fetcher with English fallback
 * If content doesn't exist in requested locale, falls back to English
 */
export async function fetchWithFallback<T>(
  query: string,
  locale: string,
  additionalParams: Record<string, unknown> = {},
): Promise<T | null> {
  let data = await client.fetch<T | null>(query, {
    language: locale,
    ...additionalParams,
  });

  // Fallback to English if no data found and locale isn't already English
  if (!data && locale !== "en") {
    data = await client.fetch<T | null>(query, {
      language: "en",
      ...additionalParams,
    });
  }

  return data;
}

/**
 * Fetch all homepage sections in parallel
 */
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

/**
 * Fetch all homepage content (sections + data) in parallel
 */
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
