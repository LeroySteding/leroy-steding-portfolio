import type { BlogPost } from "@/data/blog";
import type { Experience } from "@/data/experiences";
import { experiences as experiencesEN } from "@/data/experiences";
import { experiencesNL } from "@/data/experiences-nl";
import type { Project } from "@/data/projects";
import { projects as projectsEN } from "@/data/projects";
import { projectsNL } from "@/data/projects-nl";
import { type SanityPost, transformSanityPost } from "../types";
import { client } from "./client";
import {
  categoriesQuery,
  cvProjectsQuery,
  experienceBySlugQuery,
  experiencesQuery,
  featuredPostsQuery,
  featuredProjectsQuery,
  postBySlugQuery,
  postsByCategoryQuery,
  postsByTagQuery,
  postsQuery,
  projectBySlugQuery,
  projectsQuery,
  tagsQuery,
} from "./queries";

/**
 * Server-side data fetching functions for Sanity CMS
 * These replace the static data imports from data/blog.ts
 */

export async function getAllPosts(
  language: "en" | "nl" = "en",
): Promise<BlogPost[]> {
  try {
    const posts = await client.fetch<SanityPost[]>(postsQuery, { language });
    return posts.map(transformSanityPost);
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
}

export async function getPostBySlug(
  slug: string,
  language: "en" | "nl" = "en",
): Promise<BlogPost | null> {
  try {
    const post = await client.fetch<SanityPost | null>(postBySlugQuery, {
      slug,
      language,
    });
    return post ? transformSanityPost(post) : null;
  } catch (error) {
    console.error("Error fetching post:", error);
    return null;
  }
}

export async function getFeaturedPosts(
  language: "en" | "nl" = "en",
): Promise<BlogPost[]> {
  try {
    const posts = await client.fetch<SanityPost[]>(featuredPostsQuery, {
      language,
    });
    return posts.map(transformSanityPost);
  } catch (error) {
    console.error("Error fetching featured posts:", error);
    return [];
  }
}

export async function getPostsByCategory(
  category: string,
  language: "en" | "nl" = "en",
): Promise<BlogPost[]> {
  try {
    const posts = await client.fetch<SanityPost[]>(postsByCategoryQuery, {
      category,
      language,
    });
    return posts.map(transformSanityPost);
  } catch (error) {
    console.error("Error fetching posts by category:", error);
    return [];
  }
}

export async function getPostsByTag(
  tag: string,
  language: "en" | "nl" = "en",
): Promise<BlogPost[]> {
  try {
    const posts = await client.fetch<SanityPost[]>(postsByTagQuery, {
      tagName: tag,
      language,
    });
    return posts.map(transformSanityPost);
  } catch (error) {
    console.error("Error fetching posts by tag:", error);
    return [];
  }
}

export async function getAllCategories(
  language: "en" | "nl" = "en",
): Promise<string[]> {
  try {
    return await client.fetch<string[]>(categoriesQuery, { language });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

export async function getAllTags(
  language: "en" | "nl" = "en",
): Promise<string[]> {
  try {
    return await client.fetch<string[]>(tagsQuery, { language });
  } catch (error) {
    console.error("Error fetching tags:", error);
    return [];
  }
}

// ==================== PROJECT ACTIONS ====================

/**
 * Transform Sanity project to static Project interface
 */
function transformSanityProject(
  sanityProject: Record<string, unknown>,
): Project {
  return {
    id: (sanityProject.slug as string) || (sanityProject._id as string),
    title: sanityProject.title as string,
    description: sanityProject.description as string,
    longDescription: sanityProject.longDescription as string,
    image: sanityProject.image as string,
    technologies: sanityProject.technologies as string[],
    liveUrl: (sanityProject.liveUrl as string) || null,
    githubUrl: (sanityProject.githubUrl as string) || null,
    featured: sanityProject.featured as boolean,
    category: sanityProject.category as "product" | "client" | "internal",
    year: sanityProject.year as string,
    challenges: sanityProject.challenges as string[] | undefined,
    solutions: sanityProject.solutions as string[] | undefined,
    impact: sanityProject.impact as string[] | undefined,
    testimonial: sanityProject.testimonial as
      | { quote: string; author: string; role: string }
      | undefined,
    achievements: sanityProject.achievements as string[] | undefined,
    showOnCV: sanityProject.showOnCV as boolean | undefined,
  };
}

/**
 * Get all projects - fetches from Sanity with fallback to static data
 */
export async function getAllProjects(
  language: "en" | "nl" = "en",
): Promise<Project[]> {
  try {
    const projects = await client.fetch<Record<string, unknown>[]>(
      projectsQuery,
      { language },
    );
    if (projects && projects.length > 0) {
      return projects.map(transformSanityProject);
    }
    // Fallback to static data if Sanity returns empty
    console.warn(
      `No projects in Sanity for ${language}, using static fallback`,
    );
    return language === "nl" ? projectsNL : projectsEN;
  } catch (error) {
    console.error("Error fetching projects from Sanity:", error);
    return language === "nl" ? projectsNL : projectsEN;
  }
}

/**
 * Get a single project by slug - fetches from Sanity with fallback to static data
 */
export async function getProjectBySlug(
  slug: string,
  language: "en" | "nl" = "en",
): Promise<Project | null> {
  try {
    const project = await client.fetch<Record<string, unknown> | null>(
      projectBySlugQuery,
      {
        slug,
        language,
      },
    );
    if (project) {
      return transformSanityProject(project);
    }
    // Fallback to static data
    const staticProjects = language === "nl" ? projectsNL : projectsEN;
    return staticProjects.find((p) => p.id === slug) || null;
  } catch (error) {
    console.error("Error fetching project from Sanity:", error);
    const staticProjects = language === "nl" ? projectsNL : projectsEN;
    return staticProjects.find((p) => p.id === slug) || null;
  }
}

/**
 * Get featured projects - fetches from Sanity with fallback to static data
 */
export async function getFeaturedProjects(
  language: "en" | "nl" = "en",
): Promise<Project[]> {
  try {
    const projects = await client.fetch<Record<string, unknown>[]>(
      featuredProjectsQuery,
      { language },
    );
    if (projects && projects.length > 0) {
      return projects.map(transformSanityProject);
    }
    // Fallback to static data
    const staticProjects = language === "nl" ? projectsNL : projectsEN;
    return staticProjects.filter((p) => p.featured);
  } catch (error) {
    console.error("Error fetching featured projects from Sanity:", error);
    const staticProjects = language === "nl" ? projectsNL : projectsEN;
    return staticProjects.filter((p) => p.featured);
  }
}

/**
 * Get CV projects - fetches from Sanity with fallback to static data
 */
export async function getCVProjects(
  language: "en" | "nl" = "en",
): Promise<Project[]> {
  try {
    const projects = await client.fetch<Record<string, unknown>[]>(
      cvProjectsQuery,
      { language },
    );
    if (projects && projects.length > 0) {
      return projects.map(transformSanityProject);
    }
    // Fallback to static data
    const staticProjects = language === "nl" ? projectsNL : projectsEN;
    return staticProjects.filter((p) => p.showOnCV);
  } catch (error) {
    console.error("Error fetching CV projects from Sanity:", error);
    const staticProjects = language === "nl" ? projectsNL : projectsEN;
    return staticProjects.filter((p) => p.showOnCV);
  }
}

// ==================== EXPERIENCE ACTIONS ====================

/**
 * Transform Sanity experience to static Experience interface
 */
function transformSanityExperience(
  sanityExp: Record<string, unknown>,
): Experience {
  return {
    id: (sanityExp.slug as string) || (sanityExp._id as string),
    title: sanityExp.title as string,
    company: sanityExp.company as string,
    companyLogo: sanityExp.companyLogo as string | undefined,
    companyUrl: sanityExp.companyUrl as string | undefined,
    period: sanityExp.period as string,
    location: sanityExp.location as string,
    description: sanityExp.description as string,
    longDescription: sanityExp.longDescription as string,
    technologies: sanityExp.technologies as string[],
    color: sanityExp.color as "cyan" | "violet",
    highlights: sanityExp.highlights as string[] | undefined,
    achievements: sanityExp.achievements as string[] | undefined,
    responsibilities: sanityExp.responsibilities as string[] | undefined,
    teamSize: sanityExp.teamSize as string | undefined,
    impact: sanityExp.impact as string[] | undefined,
  };
}

/**
 * Get all experiences - fetches from Sanity with fallback to static data
 */
export async function getAllExperiences(
  language: "en" | "nl" = "en",
): Promise<Experience[]> {
  try {
    const experiences = await client.fetch<Record<string, unknown>[]>(
      experiencesQuery,
      { language },
    );
    if (experiences && experiences.length > 0) {
      return experiences.map(transformSanityExperience);
    }
    // Fallback to static data if Sanity returns empty
    console.warn(
      `No experiences in Sanity for ${language}, using static fallback`,
    );
    return language === "nl" ? experiencesNL : experiencesEN;
  } catch (error) {
    console.error("Error fetching experiences from Sanity:", error);
    return language === "nl" ? experiencesNL : experiencesEN;
  }
}

/**
 * Get a single experience by slug - fetches from Sanity with fallback to static data
 */
export async function getExperienceBySlug(
  slug: string,
  language: "en" | "nl" = "en",
): Promise<Experience | null> {
  try {
    const experience = await client.fetch<Record<string, unknown> | null>(
      experienceBySlugQuery,
      {
        slug,
        language,
      },
    );
    if (experience) {
      return transformSanityExperience(experience);
    }
    // Fallback to static data
    const staticExperiences = language === "nl" ? experiencesNL : experiencesEN;
    return staticExperiences.find((e) => e.id === slug) || null;
  } catch (error) {
    console.error("Error fetching experience from Sanity:", error);
    const staticExperiences = language === "nl" ? experiencesNL : experiencesEN;
    return staticExperiences.find((e) => e.id === slug) || null;
  }
}
