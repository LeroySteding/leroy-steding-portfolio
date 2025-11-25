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
