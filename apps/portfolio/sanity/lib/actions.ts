import { client } from './client'
import {
  postsQuery,
  postBySlugQuery,
  featuredPostsQuery,
  postsByCategoryQuery,
  postsByTagQuery,
  categoriesQuery,
  tagsQuery,
} from './queries'
import { SanityPost, transformSanityPost } from '../types'
import type { BlogPost } from '@/data/blog'

/**
 * Server-side data fetching functions for Sanity CMS
 * These replace the static data imports from data/blog.ts
 */

export async function getAllPosts(language: 'en' | 'nl' = 'en'): Promise<BlogPost[]> {
  try {
    const posts = await client.fetch<SanityPost[]>(postsQuery, { language })
    return posts.map(transformSanityPost)
  } catch (error) {
    console.error('Error fetching posts:', error)
    return []
  }
}

export async function getPostBySlug(
  slug: string,
  language: 'en' | 'nl' = 'en'
): Promise<BlogPost | null> {
  try {
    const post = await client.fetch<SanityPost | null>(postBySlugQuery, { slug, language })
    return post ? transformSanityPost(post) : null
  } catch (error) {
    console.error('Error fetching post:', error)
    return null
  }
}

export async function getFeaturedPosts(language: 'en' | 'nl' = 'en'): Promise<BlogPost[]> {
  try {
    const posts = await client.fetch<SanityPost[]>(featuredPostsQuery, { language })
    return posts.map(transformSanityPost)
  } catch (error) {
    console.error('Error fetching featured posts:', error)
    return []
  }
}

export async function getPostsByCategory(
  category: string,
  language: 'en' | 'nl' = 'en'
): Promise<BlogPost[]> {
  try {
    const posts = await client.fetch<SanityPost[]>(postsByCategoryQuery, { category, language })
    return posts.map(transformSanityPost)
  } catch (error) {
    console.error('Error fetching posts by category:', error)
    return []
  }
}

export async function getPostsByTag(
  tag: string,
  language: 'en' | 'nl' = 'en'
): Promise<BlogPost[]> {
  try {
    const posts = await client.fetch<SanityPost[]>(postsByTagQuery, { tag, language } as any)
    return posts.map(transformSanityPost)
  } catch (error) {
    console.error('Error fetching posts by tag:', error)
    return []
  }
}

export async function getAllCategories(language: 'en' | 'nl' = 'en'): Promise<string[]> {
  try {
    return await client.fetch<string[]>(categoriesQuery, { language })
  } catch (error) {
    console.error('Error fetching categories:', error)
    return []
  }
}

export async function getAllTags(language: 'en' | 'nl' = 'en'): Promise<string[]> {
  try {
    return await client.fetch<string[]>(tagsQuery, { language })
  } catch (error) {
    console.error('Error fetching tags:', error)
    return []
  }
}
