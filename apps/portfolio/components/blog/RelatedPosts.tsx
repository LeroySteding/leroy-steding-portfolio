"use client";

import { Calendar, ChevronRight, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  category: string;
  tags: string[];
  publishedAt: string;
  readingTime: string;
  coverImage?: string;
  featured?: boolean;
}

interface RelatedPostsProps {
  currentPost: BlogPost;
  allPosts: BlogPost[];
  language?: "en" | "nl";
  maxPosts?: number;
}

/**
 * Calculate relevance score for a post based on shared tags and category
 * 
 * Scoring algorithm:
 * - Same category: +3 points
 * - Each shared tag: +2 points
 * - Featured posts: +1 bonus point
 * 
 * @param post - Post to score
 * @param currentPost - Current post for comparison
 * @returns Relevance score (higher is more relevant)
 */
function calculateRelevanceScore(post: BlogPost, currentPost: BlogPost): number {
  let score = 0;

  // Same category bonus
  if (post.category === currentPost.category) {
    score += 3;
  }

  // Shared tags bonus (2 points per shared tag)
  const sharedTags = post.tags.filter((tag) => 
    currentPost.tags.includes(tag)
  );
  score += sharedTags.length * 2;

  // Featured post bonus
  if (post.featured) {
    score += 1;
  }

  return score;
}

/**
 * Get related posts based on tags and category similarity
 * Falls back to most recent posts if no tag matches found
 */
function getRelatedPosts(
  currentPost: BlogPost,
  allPosts: BlogPost[],
  maxPosts: number
): BlogPost[] {
  // Filter out current post
  const otherPosts = allPosts.filter((p) => p.id !== currentPost.id);

  // Score all posts
  const scoredPosts = otherPosts.map((post) => ({
    post,
    score: calculateRelevanceScore(post, currentPost),
  }));

  // Sort by score (highest first)
  scoredPosts.sort((a, b) => b.score - a.score);

  // If top posts have score > 0, use them (they have some relevance)
  const relevantPosts = scoredPosts.filter((item) => item.score > 0);

  if (relevantPosts.length >= maxPosts) {
    return relevantPosts.slice(0, maxPosts).map((item) => item.post);
  }

  // Fallback: if not enough relevant posts, add recent posts
  const recentPosts = otherPosts
    .sort((a, b) => 
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    )
    .slice(0, maxPosts);

  // Combine relevant and recent, removing duplicates
  const relatedPostIds = new Set(relevantPosts.map((item) => item.post.id));
  const combined = [
    ...relevantPosts.map((item) => item.post),
    ...recentPosts.filter((post) => !relatedPostIds.has(post.id)),
  ];

  return combined.slice(0, maxPosts);
}

export default function RelatedPosts({
  currentPost,
  allPosts,
  language = "en",
  maxPosts = 3,
}: RelatedPostsProps) {
  const relatedPosts = useMemo(
    () => getRelatedPosts(currentPost, allPosts, maxPosts),
    [currentPost, allPosts, maxPosts]
  );

  if (relatedPosts.length === 0) {
    return null;
  }

  const t = {
    title: language === "nl" ? "Je vindt dit misschien ook leuk" : "You might also like",
    readMore: language === "nl" ? "Lees artikel" : "Read article",
  };

  return (
    <div className="mb-16">
      <div className="flex items-center gap-3 mb-8">
        <h3 className="text-3xl font-display font-bold text-text-primary">
          {t.title}
        </h3>
        <ChevronRight className="w-6 h-6 text-accent-primary" />
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {relatedPosts.map((post) => (
          <Link
            key={post.id}
            href={language === "nl" ? `/nl/blog/${post.slug}` : `/blog/${post.slug}`}
            className="group block"
          >
            <article className="card overflow-hidden h-full hover:scale-[1.02] transition-transform duration-300">
              {/* Thumbnail Image */}
              <div className="relative h-48 overflow-hidden bg-surface">
                {post.coverImage ? (
                  <>
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent" />
                  </>
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-accent-primary/10 to-accent-secondary/10 flex items-center justify-center">
                    <div className="text-4xl font-display font-bold text-accent-primary/30">
                      {post.title.charAt(0)}
                    </div>
                  </div>
                )}

                {/* Category Badge */}
                <div className="absolute top-3 right-3 px-3 py-1.5 rounded-lg bg-accent-primary/90 backdrop-blur-sm text-primary-bg text-xs font-bold capitalize">
                  {post.category}
                </div>
              </div>

              {/* Content */}
              <div className="p-5 space-y-3">
                {/* Meta Information */}
                <div className="flex items-center gap-4 text-xs text-text-muted">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <time dateTime={post.publishedAt}>
                      {new Date(post.publishedAt).toLocaleDateString(
                        language === "nl" ? "nl-NL" : "en-US",
                        { 
                          month: "short", 
                          day: "numeric",
                          year: "numeric"
                        }
                      )}
                    </time>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{post.readingTime}</span>
                  </div>
                </div>

                {/* Title */}
                <h4 className="text-lg font-display font-bold text-text-primary group-hover:text-accent-primary transition-colors line-clamp-2 leading-tight">
                  {post.title}
                </h4>

                {/* Excerpt (if available) */}
                {post.excerpt && (
                  <p className="text-sm text-text-secondary leading-relaxed line-clamp-2">
                    {post.excerpt}
                  </p>
                )}

                {/* Read More Link */}
                <div className="flex items-center gap-2 text-accent-primary text-sm font-bold pt-2">
                  <span>{t.readMore}</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </div>
  );
}
