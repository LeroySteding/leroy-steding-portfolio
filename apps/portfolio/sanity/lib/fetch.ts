import { createClient } from "next-sanity";
import {
  experienceBySlugQuery,
  experiencesQuery,
  featuredPostsQuery,
  featuredProjectsQuery,
  postBySlugQuery,
  postsByCategoryQuery,
  postsQuery,
  projectBySlugQuery,
  projectsQuery,
} from "./queries";

// Types
export type Language = "en" | "nl";

export interface BlogPost {
  _id: string;
  id?: string;
  title: string;
  slug: { current: string } | string;
  excerpt: string;
  coverImage?: string;
  content?: string;
  category: "article" | "tutorial" | "research";
  tags: string[];
  author: string;
  publishedAt: string;
  readingTime: string;
  featured: boolean;
  language?: string;
}

export interface Project {
  _id: string;
  id?: string;
  title: string;
  slug: string;
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
  showOnCV?: boolean;
  language?: string;
}

export interface Experience {
  _id: string;
  id?: string;
  title: string;
  slug: string;
  company: string;
  companyLogo?: string;
  companyUrl?: string;
  period: string;
  startDate?: string;
  endDate?: string;
  location: string;
  description: string;
  longDescription?: string;
  technologies: string[];
  color?: string;
  highlights?: string[];
  achievements?: string[];
  responsibilities?: string[];
  teamSize?: string;
  impact?: string[];
  language?: string;
}

// Sanity client configuration
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "p6hg7krm";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-01-01";

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: process.env.NODE_ENV === "production",
});

// Helper to normalize slug
function normalizeSlug(slug: { current: string } | string | undefined): string {
  if (!slug) return "";
  if (typeof slug === "string") return slug;
  return slug.current || "";
}

// Helper to normalize post data
function normalizePost(post: BlogPost): BlogPost {
  return {
    ...post,
    id: post._id || post.id,
    slug: normalizeSlug(post.slug),
  } as BlogPost;
}

// Helper to normalize project data
function normalizeProject(project: Project): Project {
  return {
    ...project,
    id: project.slug || project._id || project.id,
    slug: project.slug || "",
  };
}

// Helper to normalize experience data
function normalizeExperience(experience: Experience): Experience {
  return {
    ...experience,
    id: experience.slug || experience._id || experience.id,
    slug: experience.slug || "",
  };
}

// ==================== BLOG POSTS ====================

export async function getSanityPosts(
  language: Language = "en",
): Promise<BlogPost[]> {
  try {
    const posts = await client.fetch<BlogPost[]>(postsQuery, { language });
    return posts.map(normalizePost);
  } catch (error) {
    console.error("Error fetching posts from Sanity:", error);
    return [];
  }
}

export async function getSanityPostBySlug(
  slug: string,
  language: Language = "en",
): Promise<BlogPost | null> {
  try {
    const post = await client.fetch<BlogPost | null>(postBySlugQuery, {
      slug,
      language,
    });
    return post ? normalizePost(post) : null;
  } catch (error) {
    console.error("Error fetching post from Sanity:", error);
    return null;
  }
}

export async function getSanityFeaturedPosts(
  language: Language = "en",
): Promise<BlogPost[]> {
  try {
    const posts = await client.fetch<BlogPost[]>(featuredPostsQuery, {
      language,
    });
    return posts.map(normalizePost);
  } catch (error) {
    console.error("Error fetching featured posts from Sanity:", error);
    return [];
  }
}

export async function getSanityPostsByCategory(
  category: string,
  language: Language = "en",
): Promise<BlogPost[]> {
  try {
    const posts = await client.fetch<BlogPost[]>(postsByCategoryQuery, {
      category,
      language,
    });
    return posts.map(normalizePost);
  } catch (error) {
    console.error("Error fetching posts by category from Sanity:", error);
    return [];
  }
}

// ==================== PROJECTS ====================

export async function getSanityProjects(
  language: Language = "en",
): Promise<Project[]> {
  try {
    const projects = await client.fetch<Project[]>(projectsQuery, { language });
    return projects.map(normalizeProject);
  } catch (error) {
    console.error("Error fetching projects from Sanity:", error);
    return [];
  }
}

export async function getSanityProjectBySlug(
  slug: string,
  language: Language = "en",
): Promise<Project | null> {
  try {
    const project = await client.fetch<Project | null>(projectBySlugQuery, {
      slug,
      language,
    });
    return project ? normalizeProject(project) : null;
  } catch (error) {
    console.error("Error fetching project from Sanity:", error);
    return null;
  }
}

export async function getSanityFeaturedProjects(
  language: Language = "en",
): Promise<Project[]> {
  try {
    const projects = await client.fetch<Project[]>(featuredProjectsQuery, {
      language,
    });
    return projects.map(normalizeProject);
  } catch (error) {
    console.error("Error fetching featured projects from Sanity:", error);
    return [];
  }
}

// ==================== EXPERIENCES ====================

export async function getSanityExperiences(
  language: Language = "en",
): Promise<Experience[]> {
  try {
    const experiences = await client.fetch<Experience[]>(experiencesQuery, {
      language,
    });
    return experiences.map(normalizeExperience);
  } catch (error) {
    console.error("Error fetching experiences from Sanity:", error);
    return [];
  }
}

export async function getSanityExperienceBySlug(
  slug: string,
  language: Language = "en",
): Promise<Experience | null> {
  try {
    const experience = await client.fetch<Experience | null>(
      experienceBySlugQuery,
      {
        slug,
        language,
      },
    );
    return experience ? normalizeExperience(experience) : null;
  } catch (error) {
    console.error("Error fetching experience from Sanity:", error);
    return null;
  }
}
