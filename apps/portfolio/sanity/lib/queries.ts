import { groq } from "next-sanity";

// Helper: language filter that handles null/undefined language fields
// If document has no language, treat as "en" (default)
const languageFilter = `(language == $language || (!defined(language) && $language == "en"))`;

// Get all blog posts with optional language filter
// coverImage can be either a Sanity image reference or a direct URL string
export const postsQuery = groq`
  *[_type == "post" && ${languageFilter}] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    "coverImage": coalesce(coverImage.asset->url, coverImageUrl, coverImage),
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
  *[_type == "post" && slug.current == $slug && ${languageFilter}][0] {
    _id,
    title,
    slug,
    excerpt,
    "coverImage": coalesce(coverImage.asset->url, coverImageUrl, coverImage),
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
  *[_type == "post" && featured == true && ${languageFilter}] | order(publishedAt desc) [0...6] {
    _id,
    title,
    slug,
    excerpt,
    "coverImage": coalesce(coverImage.asset->url, coverImageUrl, coverImage),
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
  *[_type == "post" && category == $category && ${languageFilter}] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    "coverImage": coalesce(coverImage.asset->url, coverImageUrl, coverImage),
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
  *[_type == "post" && $tagName in tags && ${languageFilter}] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    "coverImage": coalesce(coverImage.asset->url, coverImageUrl, coverImage),
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
  array::unique(*[_type == "post" && ${languageFilter}].category)
`;

// Get all unique tags
export const tagsQuery = groq`
  array::unique(*[_type == "post" && ${languageFilter}].tags[])
`;

// ==================== PROJECT QUERIES ====================

// Get all projects with language filter
export const projectsQuery = groq`
  *[_type == "project" && ${languageFilter}] | order(year desc) {
    _id,
    title,
    "slug": slug.current,
    "id": slug.current,
    description,
    "longDescription": pt::text(longDescription),
    "image": coalesce(image.asset->url, imageUrl, image),
    "technologies": technologies[]->name,
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
  *[_type == "project" && slug.current == $slug && ${languageFilter}][0] {
    _id,
    title,
    "slug": slug.current,
    "id": slug.current,
    description,
    "longDescription": pt::text(longDescription),
    "image": coalesce(image.asset->url, imageUrl, image),
    "technologies": technologies[]->name,
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
  *[_type == "project" && featured == true && ${languageFilter}] | order(year desc) {
    _id,
    title,
    "slug": slug.current,
    "id": slug.current,
    description,
    "image": coalesce(image.asset->url, imageUrl, image),
    "technologies": technologies[]->name,
    category,
    year,
    language
  }
`;

// Get projects for CV
export const cvProjectsQuery = groq`
  *[_type == "project" && showOnCV == true && ${languageFilter}] | order(year desc) {
    _id,
    title,
    "slug": slug.current,
    "id": slug.current,
    description,
    "technologies": technologies[]->name,
    category,
    year,
    language
  }
`;

// ==================== EXPERIENCE QUERIES ====================

// Get all experiences with language filter
export const experiencesQuery = groq`
  *[_type == "experience" && ${languageFilter}] | order(startDate desc) {
    _id,
    title,
    "slug": slug.current,
    "id": slug.current,
    company,
    "companyLogo": coalesce(companyLogo.asset->url, companyLogoUrl, companyLogo),
    companyUrl,
    period,
    startDate,
    endDate,
    location,
    "description": pt::text(description),
    "longDescription": pt::text(longDescription),
    "technologies": technologies[]->name,
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
  *[_type == "experience" && slug.current == $slug && ${languageFilter}][0] {
    _id,
    title,
    "slug": slug.current,
    "id": slug.current,
    company,
    "companyLogo": coalesce(companyLogo.asset->url, companyLogoUrl, companyLogo),
    companyUrl,
    period,
    startDate,
    endDate,
    location,
    "description": pt::text(description),
    "longDescription": pt::text(longDescription),
    "technologies": technologies[]->name,
    color,
    highlights,
    achievements,
    responsibilities,
    teamSize,
    impact,
    language
  }
`;

// ==================== SECTION QUERIES ====================

// Get Hero section by language
export const heroSectionQuery = groq`
  *[_type == "hero" && ${languageFilter}][0] {
    _id,
    name,
    title,
    subtitle,
    tagline,
    ctaButtons,
    stats,
    language
  }
`;

// Get About section by language
export const aboutSectionQuery = groq`
  *[_type == "aboutSection" && ${languageFilter}][0] {
    _id,
    name,
    title,
    "subtitle": titleHighlight,
    "description": pt::text(intro),
    highlights,
    "image": coalesce(image.asset->url, image),
    language
  }
`;

// Get Contact section by language
export const contactSectionQuery = groq`
  *[_type == "contactSection" && ${languageFilter}][0] {
    _id,
    name,
    title,
    subtitle,
    description,
    email,
    phone,
    location,
    socialLinks,
    language
  }
`;

// Get Projects section by language
export const projectsSectionQuery = groq`
  *[_type == "projectsSection" && ${languageFilter}][0] {
    _id,
    name,
    title,
    titleHighlight,
    subtitle,
    language
  }
`;

// Get Experience section by language
export const experienceSectionQuery = groq`
  *[_type == "experienceSection" && ${languageFilter}][0] {
    _id,
    name,
    title,
    titleHighlight,
    subtitle,
    language
  }
`;

// Get Skills section by language
export const skillsSectionQuery = groq`
  *[_type == "skillsSection" && ${languageFilter}][0] {
    _id,
    name,
    title,
    titleHighlight,
    subtitle,
    skills,
    language
  }
`;

// Get Blog section by language
export const blogSectionQuery = groq`
  *[_type == "blogSection" && ${languageFilter}][0] {
    _id,
    name,
    title,
    titleHighlight,
    subtitle,
    language
  }
`;

// Get Tech Stack section by language
export const techStackSectionQuery = groq`
  *[_type == "techStackSection" && ${languageFilter}][0] {
    _id,
    name,
    title,
    titleHighlight,
    subtitle,
    technologies,
    language
  }
`;
