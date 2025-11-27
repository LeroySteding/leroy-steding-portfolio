import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import LayoutContainer from "@/components/ui/LayoutContainer";
import { getTranslations } from "@/lib/translations";
import { client } from "@/sanity/lib/client";
import { postsQuery } from "@/sanity/lib/queries";
import BlogContent from "./BlogContent";
import BlogHero from "./BlogHero";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const isNL = locale === "nl";

  return {
    title: isNL ? "Blog | Leroy Steding" : "Blog | Leroy Steding",
    description: isNL
      ? "Artikelen over webontwikkeling, React, Next.js en best practices voor software engineering."
      : "Articles about web development, React, Next.js, and software engineering best practices.",
    alternates: {
      canonical: isNL
        ? "https://leroysteding.nl/blog"
        : "https://leroysteding.nl/en/blog",
      languages: {
        nl: "https://leroysteding.nl/blog",
        en: "https://leroysteding.nl/en/blog",
        "x-default": "https://leroysteding.nl/blog",
      },
    },
    openGraph: {
      title: isNL ? "Blog | Leroy Steding" : "Blog | Leroy Steding",
      description: isNL
        ? "Artikelen over webontwikkeling, React, Next.js en best practices voor software engineering."
        : "Articles about web development, React, Next.js, and software engineering best practices.",
      locale: isNL ? "nl_NL" : "en_US",
    },
  };
}

export interface SanityBlogPost {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt: string;
  content: string;
  category: "article" | "tutorial" | "research";
  tags: string[];
  author: string;
  publishedAt: string;
  readingTime: string;
  coverImage?: string;
  featured: boolean;
  language: string;
}

// Transform Sanity post to the format expected by BlogContent
function transformPost(post: SanityBlogPost) {
  // Handle slug which can be either string or object with current property
  const slugValue =
    typeof post.slug === "string" ? post.slug : post.slug?.current || "";

  return {
    id: post._id,
    title: post.title,
    slug: slugValue,
    excerpt: post.excerpt || "",
    content: post.content || "",
    category: post.category || "article",
    tags: post.tags || [],
    author: post.author || "Leroy Steding",
    publishedAt: post.publishedAt || new Date().toISOString(),
    readingTime: post.readingTime || "5 min read",
    coverImage: post.coverImage,
    featured: post.featured || false,
  };
}

export default async function BlogPage() {
  const locale = await getLocale();
  const t = getTranslations(locale);

  // Fetch posts from Sanity
  const sanityPosts: SanityBlogPost[] = await client.fetch(postsQuery, {
    language: locale,
  });

  // Transform posts to the expected format
  const posts = sanityPosts.map(transformPost);

  return (
    <main className="min-h-screen bg-primary-bg">
      {/* Hero Section */}
      <BlogHero
        title={t.blog.page.title}
        titleHighlight={t.blog.page.titleHighlight}
        subtitle={t.blog.page.description}
      />

      <LayoutContainer className="pb-20">
        <BlogContent posts={posts} locale={locale} translations={t} />
      </LayoutContainer>
    </main>
  );
}
