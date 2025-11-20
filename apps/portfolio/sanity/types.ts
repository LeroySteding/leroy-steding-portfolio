export interface SanityPost {
  _id: string
  title: string
  slug: {
    current: string
  }
  excerpt: string
  coverImage?: string
  content: string
  category: 'article' | 'tutorial' | 'research'
  tags: string[]
  author: string
  publishedAt: string
  readingTime: string
  featured: boolean
  language: 'en' | 'nl'
}

// Transform Sanity post to match our existing BlogPost interface
export function transformSanityPost(sanityPost: SanityPost) {
  return {
    id: sanityPost._id,
    title: sanityPost.title,
    slug: sanityPost.slug.current,
    excerpt: sanityPost.excerpt,
    content: sanityPost.content,
    category: sanityPost.category,
    tags: sanityPost.tags,
    author: sanityPost.author,
    publishedAt: sanityPost.publishedAt,
    readingTime: sanityPost.readingTime,
    coverImage: sanityPost.coverImage,
    featured: sanityPost.featured,
  }
}
