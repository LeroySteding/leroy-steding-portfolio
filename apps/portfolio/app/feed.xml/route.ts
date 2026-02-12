/**
 * RSS Feed Route Handler
 *
 * Generates an RSS 2.0 feed for blog posts.
 * Accessible at /feed.xml
 */

import { getPosts as getConvexPosts } from "@/lib/convex-content";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.leroysteding.nl";
const SITE_TITLE = "Leroy Steding - Blog";
const SITE_DESCRIPTION =
  "Articles about web development, React, Next.js, and software engineering best practices.";
const AUTHOR_NAME = "Leroy Steding";
const AUTHOR_EMAIL = "hello@leroysteding.nl";

interface SanityPost {
  _id: string;
  title: string;
  slug: { current: string } | string;
  excerpt: string;
  category: string;
  tags: string[];
  author: string;
  publishedAt: string;
  coverImage?: string;
}

function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function getSlugValue(slug: { current: string } | string): string {
  return typeof slug === "string" ? slug : slug?.current || "";
}

function formatRFC822Date(dateString: string): string {
  const date = new Date(dateString);
  return date.toUTCString();
}

function generateRssItem(post: SanityPost): string {
  const slug = getSlugValue(post.slug);
  const postUrl = `${SITE_URL}/en/blog/${slug}`;
  const pubDate = formatRFC822Date(post.publishedAt);

  const categories = post.tags
    .map((tag) => `<category>${escapeXml(tag)}</category>`)
    .join("\n      ");

  return `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <description>${escapeXml(post.excerpt || "")}</description>
      <pubDate>${pubDate}</pubDate>
      <author>${AUTHOR_EMAIL} (${AUTHOR_NAME})</author>
      ${categories}
    </item>`;
}

function generateRssFeed(posts: SanityPost[]): string {
  const lastBuildDate = formatRFC822Date(new Date().toISOString());

  const items = posts.map(generateRssItem).join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${escapeXml(SITE_TITLE)}</title>
    <link>${SITE_URL}/en/blog</link>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <language>en</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
    <generator>Next.js</generator>
    <managingEditor>${AUTHOR_EMAIL} (${AUTHOR_NAME})</managingEditor>
    <webMaster>${AUTHOR_EMAIL} (${AUTHOR_NAME})</webMaster>
    <ttl>60</ttl>
    ${items}
  </channel>
</rss>`;
}

export async function GET() {
  try {
    // Fetch posts from Convex (English only for RSS feed)
    const convexPosts = await getConvexPosts("en");
    const posts: SanityPost[] = convexPosts.map((p) => ({
      _id: p._id,
      title: p.title,
      slug: p.slug,
      excerpt: p.excerpt,
      category: p.category,
      tags: p.tags,
      author: p.author,
      publishedAt: p.publishedAt,
      coverImage: p.coverImage,
    }));

    // Sort by date descending and take latest 20
    const sortedPosts = posts
      .sort(
        (a, b) =>
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
      )
      .slice(0, 20);

    const feed = generateRssFeed(sortedPosts);

    return new Response(feed, {
      status: 200,
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    });
  } catch (error) {
    console.error("Error generating RSS feed:", error);

    // Return empty feed on error
    const emptyFeed = generateRssFeed([]);
    return new Response(emptyFeed, {
      status: 200,
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=300",
      },
    });
  }
}
