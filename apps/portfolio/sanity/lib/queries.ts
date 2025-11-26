import { groq } from "next-sanity";

// Get all blog posts with optional language filter
// coverImage can be either a Sanity image reference or a direct URL string
export const postsQuery = groq`
  *[_type == "post" && language == $language] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    "coverImage": coalesce(coverImage.asset->url, coverImage),
    content,
    category,
    tags,
    author,
    publishedAt,
    readingTime,
    featured,
    language
  }
`;

// Get a single blog post by slug and language
export const postBySlugQuery = groq`
  *[_type == "post" && slug.current == $slug && language == $language][0] {
    _id,
    title,
    slug,
    excerpt,
    "coverImage": coalesce(coverImage.asset->url, coverImage),
    content,
    category,
    tags,
    author,
    publishedAt,
    readingTime,
    featured,
    language
  }
`;

// Get featured blog posts
export const featuredPostsQuery = groq`
  *[_type == "post" && featured == true && language == $language] | order(publishedAt desc) [0...6] {
    _id,
    title,
    slug,
    excerpt,
    "coverImage": coalesce(coverImage.asset->url, coverImage),
    content,
    category,
    tags,
    author,
    publishedAt,
    readingTime,
    featured,
    language
  }
`;

// Get posts by category
export const postsByCategoryQuery = groq`
  *[_type == "post" && category == $category && language == $language] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    "coverImage": coalesce(coverImage.asset->url, coverImage),
    content,
    category,
    tags,
    author,
    publishedAt,
    readingTime,
    featured,
    language
  }
`;

// Get posts by tag
export const postsByTagQuery = groq`
  *[_type == "post" && $tagName in tags && language == $language] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    "coverImage": coalesce(coverImage.asset->url, coverImage),
    content,
    category,
    tags,
    author,
    publishedAt,
    readingTime,
    featured,
    language
  }
`;

// Get all unique categories
export const categoriesQuery = groq`
  array::unique(*[_type == "post" && language == $language].category)
`;

// Get all unique tags
export const tagsQuery = groq`
  array::unique(*[_type == "post" && language == $language].tags[])
`;

// ==================== PROJECT QUERIES ====================

// Get all projects with language filter
export const projectsQuery = groq`
  *[_type == "project" && language == $language] | order(year desc) {
    _id,
    title,
    "slug": slug.current,
    description,
    longDescription,
    "image": coalesce(image.asset->url, image),
    technologies,
    liveUrl,
    githubUrl,
    featured,
    category,
    year,
    challenges,
    solutions,
    impact,
    testimonial,
    achievements,
    showOnCV,
    language
  }
`;

// Get a single project by slug and language
export const projectBySlugQuery = groq`
  *[_type == "project" && slug.current == $slug && language == $language][0] {
    _id,
    title,
    "slug": slug.current,
    description,
    longDescription,
    "image": coalesce(image.asset->url, image),
    technologies,
    liveUrl,
    githubUrl,
    featured,
    category,
    year,
    challenges,
    solutions,
    impact,
    testimonial,
    achievements,
    showOnCV,
    language
  }
`;

// Get featured projects
export const featuredProjectsQuery = groq`
  *[_type == "project" && featured == true && language == $language] | order(year desc) {
    _id,
    title,
    "slug": slug.current,
    description,
    "image": coalesce(image.asset->url, image),
    technologies,
    category,
    year,
    language
  }
`;

// Get projects for CV
export const cvProjectsQuery = groq`
  *[_type == "project" && showOnCV == true && language == $language] | order(year desc) {
    _id,
    title,
    "slug": slug.current,
    description,
    technologies,
    category,
    year,
    language
  }
`;

// ==================== EXPERIENCE QUERIES ====================

// Get all experiences with language filter
export const experiencesQuery = groq`
  *[_type == "experience" && language == $language] | order(period desc) {
    _id,
    title,
    "slug": slug.current,
    company,
    "companyLogo": coalesce(companyLogo.asset->url, companyLogo),
    companyUrl,
    period,
    location,
    description,
    longDescription,
    technologies,
    color,
    highlights,
    achievements,
    responsibilities,
    teamSize,
    impact,
    language
  }
`;

// Get a single experience by slug and language
export const experienceBySlugQuery = groq`
  *[_type == "experience" && slug.current == $slug && language == $language][0] {
    _id,
    title,
    "slug": slug.current,
    company,
    "companyLogo": coalesce(companyLogo.asset->url, companyLogo),
    companyUrl,
    period,
    location,
    description,
    longDescription,
    technologies,
    color,
    highlights,
    achievements,
    responsibilities,
    teamSize,
    impact,
    language
  }
`;
