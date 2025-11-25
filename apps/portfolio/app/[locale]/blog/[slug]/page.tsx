import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug } from "@/data/blog";
import { getAllPostsNL, getPostBySlugNL } from "@/data/blog-nl";
import { locales } from "@/i18n/config";
import BlogPostClient from "./BlogPostClient";

interface PageProps {
  params: Promise<{ slug: string; locale: string }>;
}

export async function generateStaticParams() {
  const enPosts = getAllPosts();
  const nlPosts = getAllPostsNL();

  const params: { locale: string; slug: string }[] = [];

  // Generate params for all locales
  for (const locale of locales) {
    const posts = locale === "nl" ? nlPosts : enPosts;
    for (const post of posts) {
      params.push({ locale, slug: post.slug });
    }
  }

  return params;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug, locale } = await params;
  const post = locale === "nl" ? getPostBySlugNL(slug) : getPostBySlug(slug);

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
  const post = locale === "nl" ? getPostBySlugNL(slug) : getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return <BlogPostClient post={post} language={locale as "en" | "nl"} />;
}
