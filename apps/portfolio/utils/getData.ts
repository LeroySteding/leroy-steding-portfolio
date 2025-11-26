import {
  type BlogPost,
  type Experience,
  getSanityExperienceBySlug,
  getSanityExperiences,
  getSanityFeaturedPosts,
  getSanityFeaturedProjects,
  getSanityPostBySlug,
  getSanityPosts,
  getSanityProjectBySlug,
  getSanityProjects,
  type Language,
  type Project,
} from "@/sanity/lib/fetch";
import {
  getBlogPostBySlug as getStaticBlogPostBySlug,
  getBlogPosts as getStaticBlogPosts,
  getExperienceById as getStaticExperienceById,
  getExperiences as getStaticExperiences,
  getProjectById as getStaticProjectById,
  getProjects as getStaticProjects,
} from "./getLocalizedData";

// Environment flag to enable/disable Sanity
const USE_SANITY = process.env.NEXT_PUBLIC_USE_SANITY !== "false";

// ==================== BLOG POSTS ====================

export async function getPosts(language: Language = "en"): Promise<BlogPost[]> {
  if (USE_SANITY) {
    const sanityPosts = await getSanityPosts(language);
    if (sanityPosts.length > 0) {
      return sanityPosts;
    }
  }
  // Fallback to static data
  const staticPosts = getStaticBlogPosts(language);
  return staticPosts.map((post) => ({
    _id: post.id,
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    coverImage: post.coverImage,
    content: post.content,
    category: post.category as "article" | "tutorial" | "research",
    tags: post.tags,
    author: post.author,
    publishedAt: post.publishedAt,
    readingTime: post.readingTime,
    featured: post.featured,
    language,
  }));
}

export async function getPostBySlug(
  slug: string,
  language: Language = "en",
): Promise<BlogPost | null> {
  if (USE_SANITY) {
    const sanityPost = await getSanityPostBySlug(slug, language);
    if (sanityPost) {
      return sanityPost;
    }
  }
  // Fallback to static data
  const staticPost = getStaticBlogPostBySlug(slug, language);
  if (!staticPost) return null;
  return {
    _id: staticPost.id,
    id: staticPost.id,
    title: staticPost.title,
    slug: staticPost.slug,
    excerpt: staticPost.excerpt,
    coverImage: staticPost.coverImage,
    content: staticPost.content,
    category: staticPost.category as "article" | "tutorial" | "research",
    tags: staticPost.tags,
    author: staticPost.author,
    publishedAt: staticPost.publishedAt,
    readingTime: staticPost.readingTime,
    featured: staticPost.featured,
    language,
  };
}

export async function getFeaturedPosts(
  language: Language = "en",
): Promise<BlogPost[]> {
  if (USE_SANITY) {
    const sanityPosts = await getSanityFeaturedPosts(language);
    if (sanityPosts.length > 0) {
      return sanityPosts;
    }
  }
  // Fallback to static data
  const staticPosts = getStaticBlogPosts(language)
    .filter((p) => p.featured)
    .slice(0, 6);
  return staticPosts.map((post) => ({
    _id: post.id,
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    coverImage: post.coverImage,
    content: post.content,
    category: post.category as "article" | "tutorial" | "research",
    tags: post.tags,
    author: post.author,
    publishedAt: post.publishedAt,
    readingTime: post.readingTime,
    featured: post.featured,
    language,
  }));
}

// ==================== PROJECTS ====================

export async function getProjects(
  language: Language = "en",
): Promise<Project[]> {
  if (USE_SANITY) {
    const sanityProjects = await getSanityProjects(language);
    if (sanityProjects.length > 0) {
      return sanityProjects;
    }
  }
  // Fallback to static data
  const staticProjects = getStaticProjects(language);
  return staticProjects.map((project) => ({
    _id: project.id,
    id: project.id,
    title: project.title,
    slug: project.id,
    description: project.description,
    longDescription: project.longDescription,
    image: project.image,
    technologies: project.technologies,
    liveUrl: project.liveUrl,
    githubUrl: project.githubUrl,
    featured: project.featured,
    category: project.category as "product" | "client" | "internal",
    year: project.year,
    challenges: project.challenges,
    solutions: project.solutions,
    impact: project.impact,
    testimonial: project.testimonial,
    achievements: project.achievements,
    language,
  }));
}

export async function getProjectBySlug(
  slug: string,
  language: Language = "en",
): Promise<Project | null> {
  if (USE_SANITY) {
    const sanityProject = await getSanityProjectBySlug(slug, language);
    if (sanityProject) {
      return sanityProject;
    }
  }
  // Fallback to static data
  const staticProject = getStaticProjectById(slug, language);
  if (!staticProject) return null;
  return {
    _id: staticProject.id,
    id: staticProject.id,
    title: staticProject.title,
    slug: staticProject.id,
    description: staticProject.description,
    longDescription: staticProject.longDescription,
    image: staticProject.image,
    technologies: staticProject.technologies,
    liveUrl: staticProject.liveUrl,
    githubUrl: staticProject.githubUrl,
    featured: staticProject.featured,
    category: staticProject.category as "product" | "client" | "internal",
    year: staticProject.year,
    challenges: staticProject.challenges,
    solutions: staticProject.solutions,
    impact: staticProject.impact,
    testimonial: staticProject.testimonial,
    achievements: staticProject.achievements,
    language,
  };
}

export async function getFeaturedProjects(
  language: Language = "en",
): Promise<Project[]> {
  if (USE_SANITY) {
    const sanityProjects = await getSanityFeaturedProjects(language);
    if (sanityProjects.length > 0) {
      return sanityProjects;
    }
  }
  // Fallback to static data
  const staticProjects = getStaticProjects(language).filter((p) => p.featured);
  return staticProjects.map((project) => ({
    _id: project.id,
    id: project.id,
    title: project.title,
    slug: project.id,
    description: project.description,
    image: project.image,
    technologies: project.technologies,
    category: project.category as "product" | "client" | "internal",
    year: project.year,
    featured: true,
    language,
  }));
}

// ==================== EXPERIENCES ====================

export async function getExperiences(
  language: Language = "en",
): Promise<Experience[]> {
  if (USE_SANITY) {
    const sanityExperiences = await getSanityExperiences(language);
    if (sanityExperiences.length > 0) {
      return sanityExperiences;
    }
  }
  // Fallback to static data
  const staticExperiences = getStaticExperiences(language);
  return staticExperiences.map((exp) => ({
    _id: exp.id,
    id: exp.id,
    title: exp.title,
    slug: exp.id,
    company: exp.company,
    companyLogo: exp.companyLogo,
    companyUrl: exp.companyUrl,
    period: exp.period,
    location: exp.location,
    description: exp.description,
    longDescription: exp.longDescription,
    technologies: exp.technologies,
    color: exp.color,
    highlights: exp.highlights,
    achievements: exp.achievements,
    responsibilities: exp.responsibilities,
    teamSize: exp.teamSize,
    impact: exp.impact,
    language,
  }));
}

export async function getExperienceBySlug(
  slug: string,
  language: Language = "en",
): Promise<Experience | null> {
  if (USE_SANITY) {
    const sanityExperience = await getSanityExperienceBySlug(slug, language);
    if (sanityExperience) {
      return sanityExperience;
    }
  }
  // Fallback to static data
  const staticExperience = getStaticExperienceById(slug, language);
  if (!staticExperience) return null;
  return {
    _id: staticExperience.id,
    id: staticExperience.id,
    title: staticExperience.title,
    slug: staticExperience.id,
    company: staticExperience.company,
    companyLogo: staticExperience.companyLogo,
    companyUrl: staticExperience.companyUrl,
    period: staticExperience.period,
    location: staticExperience.location,
    description: staticExperience.description,
    longDescription: staticExperience.longDescription,
    technologies: staticExperience.technologies,
    color: staticExperience.color,
    highlights: staticExperience.highlights,
    achievements: staticExperience.achievements,
    responsibilities: staticExperience.responsibilities,
    teamSize: staticExperience.teamSize,
    impact: staticExperience.impact,
    language,
  };
}
