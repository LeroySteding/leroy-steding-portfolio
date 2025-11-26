import { notFound } from "next/navigation";
import JsonLd from "@/components/JsonLd";
import { locales } from "@/i18n/config";
import { getBlogPostSchema, getBreadcrumbSchema } from "@/lib/structured-data";
import { client } from "@/sanity/lib/client";
import { postBySlugQuery, postsQuery } from "@/sanity/lib/queries";
import BlogPostClient from "./BlogPostClient";

interface SanityPost {
  _id: string;
  title: string;
  slug: { current: string } | string;
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

interface PageProps {
  params: Promise<{ slug: string; locale: string }>;
}

// Transform Sanity post to the format expected by BlogPostClient
function transformPost(post: SanityPost) {
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

export async function generateStaticParams() {
  const params: { locale: string; slug: string }[] = [];

  // Generate params for all locales
  for (const locale of locales) {
    const posts: SanityPost[] = await client.fetch(postsQuery, {
      language: locale,
    });
    for (const post of posts) {
      const slugValue =
        typeof post.slug === "string" ? post.slug : post.slug?.current || "";
      if (slugValue) {
        params.push({ locale, slug: slugValue });
      }
    }
  }

  return params;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug, locale } = await params;
  const post: SanityPost | null = await client.fetch(postBySlugQuery, {
    slug,
    language: locale,
  });

  if (!post) {
    return {
      title: locale === "nl" ? "Bericht Niet Gevonden" : "Post Not Found",
    };
  }

  return {
    title: `${post.title} | Leroy Steding`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug, locale } = await params;
  const sanityPost: SanityPost | null = await client.fetch(postBySlugQuery, {
    slug,
    language: locale,
  });

  if (!sanityPost) {
    notFound();
  }

  const post = transformPost(sanityPost);

  // Generate structured data for SEO
  const blogPostSchema = getBlogPostSchema({
    title: post.title,
    description: post.excerpt,
    slug: post.slug,
    publishedAt: post.publishedAt,
    image: post.coverImage,
    author: post.author,
    locale,
  });

  const breadcrumbSchema = getBreadcrumbSchema([
    {
      name: locale === "nl" ? "Home" : "Home",
      url: locale === "nl" ? "/" : "/en",
    },
    { name: "Blog", url: locale === "nl" ? "/blog" : "/en/blog" },
    {
      name: post.title,
      url: locale === "nl" ? `/blog/${post.slug}` : `/en/blog/${post.slug}`,
    },
  ]);

  return (
    <>
      <JsonLd data={[blogPostSchema, breadcrumbSchema]} />
      <BlogPostClient post={post} language={locale as "en" | "nl"} />
    </>
  );
}
