"use client";

import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  ChevronRight,
  Clock,
  Facebook,
  Linkedin,
  Link as LinkIcon,
  Mail,
  Phone,
  Share2,
  Tag,
  Twitter,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import CTA from "@/components/ui/CTA";
import NewsletterSubscribe from "@/components/ui/NewsletterSubscribe";
import { getBlogPosts } from "@/utils/getLocalizedData";

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  category: string;
  tags: string[];
  author: string;
  publishedAt: string;
  readingTime: string;
  featured?: boolean;
}

interface BlogPostClientProps {
  post: BlogPost;
  language?: "en" | "nl";
}

export default function BlogPostClient({
  post,
  language = "en",
}: BlogPostClientProps) {
  const [readingProgress, setReadingProgress] = useState(0);
  const [_showShareMenu, _setShowShareMenu] = useState(false);
  const [activeHeading, setActiveHeading] = useState<string>("");
  const [copied, setCopied] = useState(false);

  if (!post) {
    notFound();
  }

  // Get related posts (same category or shared tags)
  const relatedPosts = useMemo(() => {
    const allPosts = getBlogPosts(language).filter((p) => p.id !== post.id);

    return allPosts
      .map((p) => ({
        post: p,
        score:
          (p.category === post.category ? 3 : 0) +
          p.tags.filter((tag) => post.tags.includes(tag)).length,
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map((item) => item.post);
  }, [post, language]);

  // Extract headings for table of contents
  const headings = useMemo(() => {
    if (!post?.content) return [];
    const matches = post.content.match(/^##\s+(.+)$/gm);
    if (!matches) return [];
    return matches.map((match: string) => {
      const text = match.replace(/^##\s+/, "");
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      return { text, id };
    });
  }, [post]);

  // Reading progress
  useEffect(() => {
    const updateProgress = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const trackLength = documentHeight - windowHeight;
      const progress = (scrollTop / trackLength) * 100;
      setReadingProgress(Math.min(100, Math.max(0, progress)));

      // Update active heading
      const headingElements = headings
        .map((h: { text: string; id: string }) => document.getElementById(h.id))
        .filter(Boolean);
      for (let i = headingElements.length - 1; i >= 0; i--) {
        const element = headingElements[i];
        if (element && element.getBoundingClientRect().top <= 150) {
          setActiveHeading(headings[i].id);
          break;
        }
      }
    };

    window.addEventListener("scroll", updateProgress);
    updateProgress();
    return () => window.removeEventListener("scroll", updateProgress);
  }, [headings]);

  // Share functions
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareTitle = post.title;

  const shareToTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`,
      "_blank",
    );
  };

  const shareToLinkedIn = () => {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      "_blank",
    );
  };

  const shareToFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      "_blank",
    );
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const _shareViaEmail = () => {
    window.location.href = `mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(shareUrl)}`;
  };

  return (
    <main className="min-h-screen bg-primary-bg">
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-surface z-50">
        <motion.div
          className="h-full bg-gradient-to-r from-accent-primary to-accent-secondary"
          style={{ width: `${readingProgress}%` }}
          initial={{ width: 0 }}
          transition={{ duration: 0.1 }}
        />
      </div>

      {/* Hero Section */}
      <div className="relative min-h-[70vh] flex items-end overflow-hidden">
        {post.coverImage ? (
          <div className="absolute inset-0">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-primary-bg/60 via-primary-bg/80 to-primary-bg" />
            <div className="absolute inset-0 bg-gradient-to-r from-primary-bg/40 to-transparent" />
          </div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20" />
        )}

        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-accent-primary to-transparent" />

        <div className="relative z-10 w-full px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 pb-16 pt-32">
          <Link
            href={language === "nl" ? "/nl/blog" : "/blog"}
            className="inline-flex items-center gap-2 text-text-secondary hover:text-accent-primary transition-colors mb-8 group font-bold backdrop-blur-sm bg-primary-bg/50 px-4 py-2 rounded-xl"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span>
              {language === "nl" ? "Terug naar Blog" : "Back to Journal"}
            </span>
          </Link>

          <div className="flex items-center gap-3 mb-6">
            <span className="px-5 py-2.5 text-sm font-bold rounded-xl capitalize bg-accent-primary text-primary-bg shadow-lg backdrop-blur-sm">
              {post.category}
            </span>
            {post.featured && (
              <span className="px-5 py-2.5 text-sm font-bold rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 text-primary-bg shadow-lg backdrop-blur-sm">
                Featured
              </span>
            )}
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-black mb-6 text-gradient leading-tight max-w-5xl">
            {post.title}
          </h1>

          <p className="text-xl md:text-2xl text-text-secondary mb-8 leading-relaxed font-medium max-w-4xl">
            {post.excerpt}
          </p>

          <div className="flex flex-wrap items-center gap-6 text-text-secondary">
            <div className="flex items-center gap-3 backdrop-blur-sm bg-primary-bg/50 px-4 py-3 rounded-xl">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center text-white font-bold text-lg">
                {post.author.charAt(0)}
              </div>
              <div>
                <div className="text-xs text-text-muted font-bold uppercase tracking-wider">
                  Written by
                </div>
                <span className="font-bold text-text-primary">
                  {post.author}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 backdrop-blur-sm bg-primary-bg/50 px-4 py-3 rounded-xl">
              <Calendar className="w-4 h-4 text-accent-primary" />
              <span className="font-bold text-text-primary">
                {new Date(post.publishedAt).toLocaleDateString(
                  language === "nl" ? "nl-NL" : "en-US",
                  { month: "long", day: "numeric", year: "numeric" },
                )}
              </span>
            </div>
            <div className="flex items-center gap-2 backdrop-blur-sm bg-primary-bg/50 px-4 py-3 rounded-xl">
              <Clock className="w-4 h-4 text-accent-primary" />
              <span className="font-bold text-text-primary">
                {post.readingTime}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 w-full px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 py-20">
        <div className="grid lg:grid-cols-[1fr_350px] gap-12 max-w-[1600px] mx-auto">
          {/* Article Content */}
          <article className="min-w-0">
            <div className="prose prose-invert prose-lg max-w-none mb-16 overflow-hidden">
              <ReactMarkdown
                components={{
                  code({ className, children }) {
                    const match = /language-(\w+)/.exec(className || "");
                    return match ? (
                      <div className="my-8 rounded-xl overflow-x-auto">
                        <SyntaxHighlighter
                          style={vscDarkPlus}
                          language={match[1]}
                          PreTag="div"
                          customStyle={{
                            margin: 0,
                            padding: "1.5rem",
                            fontSize: "0.875rem",
                            lineHeight: "1.6",
                            borderRadius: "0.75rem",
                          }}
                          wrapLongLines={true}
                        >
                          {String(children).replace(/\n$/, "")}
                        </SyntaxHighlighter>
                      </div>
                    ) : (
                      <code className="px-2 py-1 rounded-lg bg-surface text-accent-primary font-mono text-sm break-words">
                        {children}
                      </code>
                    );
                  },
                  h1: ({ children }) => (
                    <h1 className="text-5xl font-display font-black mb-8 mt-12 text-text-primary">
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => {
                    const text = String(children);
                    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-");
                    return (
                      <h2
                        id={id}
                        className="text-4xl font-display font-bold mb-6 mt-12 text-text-primary border-l-4 border-accent-primary pl-6 scroll-mt-24"
                      >
                        {children}
                      </h2>
                    );
                  },
                  h3: ({ children }) => (
                    <h3 className="text-3xl font-display font-bold mb-4 mt-10 text-text-primary">
                      {children}
                    </h3>
                  ),
                  p: ({ children }) => (
                    <p className="text-text-secondary mb-6 leading-relaxed text-xl">
                      {children}
                    </p>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-none mb-8 space-y-3">{children}</ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal list-inside mb-8 space-y-3 text-text-secondary">
                      {children}
                    </ol>
                  ),
                  li: ({ children }) => (
                    <li className="ml-0 pl-8 relative before:content-['→'] before:absolute before:left-0 before:text-accent-primary before:font-bold text-text-secondary text-xl">
                      {children}
                    </li>
                  ),
                  a: ({ children, href }) => (
                    <a
                      href={href}
                      className="text-accent-primary hover:text-accent-secondary transition-colors underline decoration-2 underline-offset-4 font-bold"
                    >
                      {children}
                    </a>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-accent-primary pl-8 py-4 my-8 bg-surface rounded-r-xl text-text-secondary italic text-xl">
                      {children}
                    </blockquote>
                  ),
                  strong: ({ children }) => (
                    <strong className="text-text-primary font-bold">
                      {children}
                    </strong>
                  ),
                  em: ({ children }) => (
                    <em className="text-accent-primary">{children}</em>
                  ),
                }}
              >
                {post.content}
              </ReactMarkdown>
            </div>

            {/* Newsletter CTA */}
            <div className="mb-16">
              <NewsletterSubscribe
                variant="compact"
                title="Want more insights like this?"
                description="Subscribe to get notified about new articles, tutorials, and research on web development and AI automation."
              />
            </div>

            {/* Tags */}
            <div className="mb-16 card p-8">
              <div className="flex items-center gap-3 mb-6">
                <Tag className="w-6 h-6 text-accent-primary" />
                <span className="text-text-primary font-bold text-xl">
                  Tags
                </span>
              </div>
              <div className="flex flex-wrap gap-3">
                {post.tags.map((tag: string) => (
                  <Link
                    key={tag}
                    href="/blog"
                    className="px-5 py-3 rounded-xl bg-surface hover:bg-surface-light text-text-secondary hover:text-accent-primary transition-all font-bold border-2 border-transparent hover:border-accent-primary/30"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>

            {/* CTA Section */}
            <div className="mb-16">
              <CTA
                variant="contact"
                title="Have Questions or Ideas?"
                description="If this article sparked any thoughts or if you'd like to discuss these concepts further, I'd love to hear from you."
              />
            </div>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <div className="mb-16">
                <h3 className="text-3xl font-display font-bold mb-8 text-text-primary flex items-center gap-3">
                  <span>Keep Reading</span>
                  <ChevronRight className="w-6 h-6 text-accent-primary" />
                </h3>
                <div className="grid md:grid-cols-3 gap-6">
                  {relatedPosts.map((relatedPost) => (
                    <Link
                      key={relatedPost.id}
                      href={
                        language === "nl"
                          ? `/nl/blog/${relatedPost.slug}`
                          : `/blog/${relatedPost.slug}`
                      }
                      className="card p-6 hover:scale-105 transition-transform group"
                    >
                      <span className="px-3 py-1 text-xs font-bold rounded-full capitalize bg-accent-primary/20 text-accent-primary mb-3 inline-block">
                        {relatedPost.category}
                      </span>
                      <h4 className="text-lg font-bold mb-2 text-text-primary group-hover:text-accent-primary transition-colors line-clamp-2">
                        {relatedPost.title}
                      </h4>
                      <p className="text-sm text-text-secondary line-clamp-2">
                        {relatedPost.excerpt}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-6 pt-12 border-t-2 border-surface">
              <Link
                href={language === "nl" ? "/nl/blog" : "/blog"}
                className="flex items-center gap-3 text-accent-primary hover:text-accent-secondary transition-colors group font-bold text-lg"
              >
                <ArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
                <span>
                  {language === "nl"
                    ? "Terug naar alle artikelen"
                    : "Back to all posts"}
                </span>
              </Link>
              <Link
                href="/#contact"
                className="btn-primary inline-flex items-center gap-3"
              >
                <span>Get in Touch</span>
                <ArrowLeft className="w-5 h-5 rotate-180" />
              </Link>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-32 space-y-8">
              {/* Share Buttons */}
              <div className="card p-6">
                <h4 className="font-bold text-text-primary mb-4 flex items-center gap-2">
                  <Share2 className="w-5 h-5 text-accent-primary" />
                  Share Article
                </h4>
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={shareToTwitter}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-surface hover:bg-surface-light text-text-secondary hover:text-accent-primary transition-all font-bold"
                  >
                    <Twitter className="w-5 h-5" />
                    <span>Twitter</span>
                  </button>
                  <button
                    type="button"
                    onClick={shareToLinkedIn}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-surface hover:bg-surface-light text-text-secondary hover:text-accent-primary transition-all font-bold"
                  >
                    <Linkedin className="w-5 h-5" />
                    <span>LinkedIn</span>
                  </button>
                  <button
                    type="button"
                    onClick={shareToFacebook}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-surface hover:bg-surface-light text-text-secondary hover:text-accent-primary transition-all font-bold"
                  >
                    <Facebook className="w-5 h-5" />
                    <span>Facebook</span>
                  </button>
                  <button
                    type="button"
                    onClick={copyLink}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-surface hover:bg-surface-light text-text-secondary hover:text-accent-primary transition-all font-bold"
                  >
                    <LinkIcon className="w-5 h-5" />
                    <span>{copied ? "Copied!" : "Copy Link"}</span>
                  </button>
                </div>
              </div>

              {/* Table of Contents */}
              {headings.length > 0 && (
                <div className="card p-6">
                  <h4 className="font-bold text-text-primary mb-4">
                    Table of Contents
                  </h4>
                  <nav className="space-y-2">
                    {headings.map((heading: { text: string; id: string }) => (
                      <a
                        key={heading.id}
                        href={`#${heading.id}`}
                        className={`block text-sm py-2 px-3 rounded-lg transition-all ${
                          activeHeading === heading.id
                            ? "bg-accent-primary/20 text-accent-primary font-bold"
                            : "text-text-secondary hover:text-accent-primary hover:bg-surface"
                        }`}
                        onClick={(e) => {
                          e.preventDefault();
                          document.getElementById(heading.id)?.scrollIntoView({
                            behavior: "smooth",
                            block: "start",
                          });
                        }}
                      >
                        {heading.text}
                      </a>
                    ))}
                  </nav>
                </div>
              )}

              {/* Book a Call CTA */}
              <div className="card p-6 bg-gradient-to-br from-accent-primary/10 to-accent-secondary/10 border-2 border-accent-primary/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-accent-primary/20">
                    <Calendar className="w-5 h-5 text-accent-primary" />
                  </div>
                  <h4 className="font-bold text-text-primary">
                    {language === "nl" ? "Laten we Praten" : "Let's Talk"}
                  </h4>
                </div>

                <p className="text-sm text-text-secondary mb-6 leading-relaxed">
                  {language === "nl"
                    ? "Vragen over dit artikel? Of wilt u bespreken hoe deze concepten kunnen helpen bij uw project?"
                    : "Questions about this article? Or want to discuss how these concepts can help your project?"}
                </p>

                <div className="space-y-3">
                  <Link
                    href={language === "nl" ? "/nl/book" : "/book"}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-accent-primary hover:bg-accent-primary/90 text-primary-bg font-bold transition-all shadow-lg hover:shadow-xl hover:scale-105"
                  >
                    <Phone className="w-4 h-4" />
                    <span>
                      {language === "nl"
                        ? "Plan een Gesprek"
                        : "Schedule a Call"}
                    </span>
                  </Link>

                  <Link
                    href={language === "nl" ? "/nl/contact" : "/contact"}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-surface hover:bg-surface-light text-text-primary font-bold transition-all"
                  >
                    <Mail className="w-4 h-4" />
                    <span>
                      {language === "nl"
                        ? "Stuur een Bericht"
                        : "Send a Message"}
                    </span>
                  </Link>
                </div>

                <div className="mt-4 pt-4 border-t border-accent-primary/20 flex items-center justify-center gap-2 text-xs text-text-muted">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span>
                    {language === "nl"
                      ? "Beschikbaar voor nieuwe projecten"
                      : "Available for new projects"}
                  </span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
