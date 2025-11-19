import { getBlogPosts, getBlogPostBySlug } from "@/utils/getLocalizedData";
import BlogPostClient from "@/app/blog/[slug]/BlogPostClient";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const posts = getBlogPosts('nl');
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const post = getBlogPostBySlug(params.slug, 'nl');

  if (!post) {
    return {
      title: "Artikel niet gevonden",
    };
  }

  return {
    title: `${post.title} | STEDING. Blog`,
    description: post.excerpt,
    keywords: post.tags,
    authors: [{ name: post.author }],
    openGraph: {
      type: "article",
      locale: "nl_NL",
      url: `https://leroysteding.nl/nl/blog/${post.slug}`,
      title: post.title,
      description: post.excerpt,
      images: post.coverImage ? [{ url: post.coverImage }] : [],
      publishedTime: post.publishedAt,
      authors: [post.author],
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: post.coverImage ? [post.coverImage] : [],
    },
  };
}

export default function BlogPostPageNL({ params }: PageProps) {
  const post = getBlogPostBySlug(params.slug, 'nl');

  if (!post) {
    notFound();
  }

  return <BlogPostClient post={post} language="nl" />;
}
