"use client";

import { notFound } from "next/navigation";
import { Calendar, Clock, Tag, ArrowLeft, Share2, Twitter, Linkedin, Facebook, Link as LinkIcon, Mail, ChevronRight } from "lucide-react";
import Link from "next/link";
import { getBlogPosts } from "@/utils/getLocalizedData";
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import NewsletterSubscribe from "@/components/ui/NewsletterSubscribe";
import CTA from "@/components/ui/CTA";

interface BlogPostClientProps {
  post: any;
  language?: 'en' | 'nl';
}

export default function BlogPostClient({ post, language = 'en' }: BlogPostClientProps) {
  const [readingProgress, setReadingProgress] = useState(0);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [activeHeading, setActiveHeading] = useState<string>("");
  const [copied, setCopied] = useState(false);

  if (!post) {
    notFound();
  }

  // Get related posts (same category or shared tags)
  const relatedPosts = useMemo(() => {
    const allPosts = getBlogPosts(language).filter(p => p.id !== post.id);
    
    return allPosts
      .map(p => ({
        post: p,
        score: 
          (p.category === post.category ? 3 : 0) +
          p.tags.filter(tag => post.tags.includes(tag)).length
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map(item => item.post);
  }, [post, language]);

  // Extract headings for table of contents
  const headings = useMemo(() => {
    const matches = post.content.match(/^##\s+(.+)$/gm);
    if (!matches) return [];
    return matches.map(match => {
      const text = match.replace(/^##\s+/, '');
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      return { text, id };
    });
  }, [post.content]);

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
      const headingElements = headings.map(h => document.getElementById(h.id)).filter(Boolean);
      for (let i = headingElements.length - 1; i >= 0; i--) {
        const element = headingElements[i];
        if (element && element.getBoundingClientRect().top <= 150) {
          setActiveHeading(headings[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', updateProgress);
    updateProgress();
    return () => window.removeEventListener('scroll', updateProgress);
  }, [headings]);

  // Share functions
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareTitle = post.title;

  const shareToTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
  };

  const shareToLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, '_blank');
  };

  const shareToFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const shareViaEmail = () => {
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
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-primary-bg/60 via-primary-bg/80 to-primary-bg" />
            <div className="absolute inset-0 bg-gradient-to-r from-primary-bg/40 to-transparent" />
          </div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20" />
        )}

        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-accent-primary to-transparent" />

        <div className="container relative z-10 mx-auto px-8 lg:px-16 pb-16 pt-32">
          <Link
            href={language === 'nl' ? '/nl/blog' : '/blog'}
            className="inline-flex items-center gap-2 text-text-secondary hover:text-accent-primary transition-colors mb-8 group font-bold backdrop-blur-sm bg-primary-bg/50 px-4 py-2 rounded-xl"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span>{language === 'nl' ? 'Terug naar Blog' : 'Back to Journal'}</span>
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
                <div className="text-xs text-text-muted font-bold uppercase tracking-wider">Written by</div>
                <span className="font-bold text-text-primary">{post.author}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 backdrop-blur-sm bg-primary-bg/50 px-4 py-3 rounded-xl">
              <Calendar className="w-4 h-4 text-accent-primary" />
              <span className="font-bold text-text-primary">{new Date(post.publishedAt).toLocaleDateString(language === 'nl' ? 'nl-NL' : 'en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            </div>
            <div className="flex items-center gap-2 backdrop-blur-sm bg-primary-bg/50 px-4 py-3 rounded-xl">
              <Clock className="w-4 h-4 text-accent-primary" />
              <span className="font-bold text-text-primary">{post.readingTime}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container relative z-10 mx-auto px-8 lg:px-16 py-20">
        <div className="grid lg:grid-cols-[1fr_300px] gap-16">
          {/* Article Content */}
          <article>
            <div className="prose prose-invert prose-xl max-w-none mb-16">
              <ReactMarkdown
                components={{
                  code({ node, className, children }) {
                    const match = /language-(\w+)/.exec(className || '');
                    return match ? (
                      <div className="my-8 rounded-xl overflow-hidden">
                        <SyntaxHighlighter
                          style={vscDarkPlus as any}
                          language={match[1]}
                          PreTag="div"
                          customStyle={{
                            margin: 0,
                            padding: '1.5rem',
                            fontSize: '0.95rem',
                            lineHeight: '1.7',
                          }}
                        >
                          {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                      </div>
                    ) : (
                      <code className="px-2 py-1 rounded-lg bg-surface text-accent-primary font-mono text-base">
                        {children}
                      </code>
                    );
                  },
                  h1: ({ children }) => <h1 className="text-5xl font-display font-black mb-8 mt-12 text-text-primary">{children}</h1>,
                  h2: ({ children }) => {
                    const text = String(children);
                    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                    return <h2 id={id} className="text-4xl font-display font-bold mb-6 mt-12 text-text-primary border-l-4 border-accent-primary pl-6 scroll-mt-24">{children}</h2>;
                  },
                  h3: ({ children }) => <h3 className="text-3xl font-display font-bold mb-4 mt-10 text-text-primary">{children}</h3>,
                  p: ({ children }) => <p className="text-text-secondary mb-6 leading-relaxed text-xl">{children}</p>,
                  ul: ({ children }) => <ul className="list-none mb-8 space-y-3">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal list-inside mb-8 space-y-3 text-text-secondary">{children}</ol>,
                  li: ({ children }) => <li className="ml-0 pl-8 relative before:content-['→'] before:absolute before:left-0 before:text-accent-primary before:font-bold text-text-secondary text-xl">{children}</li>,
                  a: ({ children, href }) => <a href={href} className="text-accent-primary hover:text-accent-secondary transition-colors underline decoration-2 underline-offset-4 font-bold">{children}</a>,
                  blockquote: ({ children }) => <blockquote className="border-l-4 border-accent-primary pl-8 py-4 my-8 bg-surface rounded-r-xl text-text-secondary italic text-xl">{children}</blockquote>,
                  strong: ({ children }) => <strong className="text-text-primary font-bold">{children}</strong>,
                  em: ({ children }) => <em className="text-accent-primary">{children}</em>,
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
                <span className="text-text-primary font-bold text-xl">Tags</span>
              </div>
              <div className="flex flex-wrap gap-3">
                {post.tags.map((tag) => (
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
                      href={language === 'nl' ? `/nl/blog/${relatedPost.slug}` : `/blog/${relatedPost.slug}`}
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
                href={language === 'nl' ? '/nl/blog' : '/blog'}
                className="flex items-center gap-3 text-accent-primary hover:text-accent-secondary transition-colors group font-bold text-lg"
              >
                <ArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
                <span>{language === 'nl' ? 'Terug naar alle artikelen' : 'Back to all posts'}</span>
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
                    onClick={shareToTwitter}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-surface hover:bg-surface-light text-text-secondary hover:text-accent-primary transition-all font-bold"
                  >
                    <Twitter className="w-5 h-5" />
                    <span>Twitter</span>
                  </button>
                  <button
                    onClick={shareToLinkedIn}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-surface hover:bg-surface-light text-text-secondary hover:text-accent-primary transition-all font-bold"
                  >
                    <Linkedin className="w-5 h-5" />
                    <span>LinkedIn</span>
                  </button>
                  <button
                    onClick={shareToFacebook}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-surface hover:bg-surface-light text-text-secondary hover:text-accent-primary transition-all font-bold"
                  >
                    <Facebook className="w-5 h-5" />
                    <span>Facebook</span>
                  </button>
                  <button
                    onClick={copyLink}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-surface hover:bg-surface-light text-text-secondary hover:text-accent-primary transition-all font-bold"
                  >
                    <LinkIcon className="w-5 h-5" />
                    <span>{copied ? 'Copied!' : 'Copy Link'}</span>
                  </button>
                </div>
              </div>

              {/* Table of Contents */}
              {headings.length > 0 && (
                <div className="card p-6">
                  <h4 className="font-bold text-text-primary mb-4">Table of Contents</h4>
                  <nav className="space-y-2">
                    {headings.map((heading) => (
                      <a
                        key={heading.id}
                        href={`#${heading.id}`}
                        className={`block text-sm py-2 px-3 rounded-lg transition-all ${
                          activeHeading === heading.id
                            ? 'bg-accent-primary/20 text-accent-primary font-bold'
                            : 'text-text-secondary hover:text-accent-primary hover:bg-surface'
                        }`}
                        onClick={(e) => {
                          e.preventDefault();
                          document.getElementById(heading.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }}
                      >
                        {heading.text}
                      </a>
                    ))}
                  </nav>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
