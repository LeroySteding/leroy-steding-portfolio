import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@sanity/client";
import { config } from "dotenv";

// Load environment variables
config({ path: resolve(__dirname, "../../../.env.local") });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
  apiVersion: "2024-01-01",
});

interface BlogPost {
  _type: "post";
  _id: string;
  title: string;
  slug: { _type: "slug"; current: string };
  excerpt: string;
  content: string;
  category: "tutorial";
  tags: string[];
  author: string;
  publishedAt: string;
  readingTime: string;
  featured: boolean;
  language: string;
}

// Read markdown files from content/blog-drafts
function readMarkdownFile(filename: string): string {
  const filePath = resolve(__dirname, "../content/blog-drafts", filename);
  return readFileSync(filePath, "utf-8");
}

// Extract title from markdown (first # heading)
function extractTitle(content: string): string {
  const match = content.match(/^#\s+(.+)$/m);
  return match ? match[1] : "Untitled";
}

// Generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

async function createBlogTutorials() {
  console.log("📚 Creating blog tutorials in Sanity...\n");

  const tutorials: BlogPost[] = [
    // 1. Next.js 16 Migration Guide
    {
      _type: "post",
      _id: "tutorial-nextjs-16-migration-en",
      title: "Complete Guide to Migrating to Next.js 16",
      slug: { _type: "slug", current: "nextjs-16-migration-guide" },
      excerpt:
        "A comprehensive guide to upgrading your Next.js application to version 16, covering Turbopack, breaking changes, and best practices.",
      content: readMarkdownFile("01-nextjs-16-migration-en.md"),
      category: "tutorial",
      tags: ["Next.js", "React", "Turbopack", "Migration", "TypeScript"],
      author: "Leroy Steding",
      publishedAt: new Date().toISOString(),
      readingTime: "15 min read",
      featured: true,
      language: "en",
    },
    {
      _type: "post",
      _id: "tutorial-nextjs-16-migration-nl",
      title: "Complete Handleiding voor Migratie naar Next.js 16",
      slug: { _type: "slug", current: "nextjs-16-migratie-handleiding" },
      excerpt:
        "Een uitgebreide handleiding voor het upgraden van je Next.js applicatie naar versie 16, inclusief Turbopack, breaking changes en best practices.",
      content: readMarkdownFile("01-nextjs-16-migration-nl.md"),
      category: "tutorial",
      tags: ["Next.js", "React", "Turbopack", "Migratie", "TypeScript"],
      author: "Leroy Steding",
      publishedAt: new Date().toISOString(),
      readingTime: "15 min lezen",
      featured: true,
      language: "nl",
    },

    // 2. Sanity CMS + Next.js Integration
    {
      _type: "post",
      _id: "tutorial-sanity-nextjs-en",
      title: "Integrating Sanity CMS with Next.js: A Complete Guide",
      slug: { _type: "slug", current: "sanity-cms-nextjs-integration" },
      excerpt:
        "Learn how to integrate Sanity CMS with Next.js, including schema design, GROQ queries, preview mode, and image optimization.",
      content: readMarkdownFile("02-sanity-nextjs-integration-en.md"),
      category: "tutorial",
      tags: ["Sanity", "CMS", "Next.js", "GROQ", "TypeScript"],
      author: "Leroy Steding",
      publishedAt: new Date().toISOString(),
      readingTime: "20 min read",
      featured: true,
      language: "en",
    },
    {
      _type: "post",
      _id: "tutorial-sanity-nextjs-nl",
      title: "Sanity CMS Integreren met Next.js: Een Complete Handleiding",
      slug: { _type: "slug", current: "sanity-cms-nextjs-integratie" },
      excerpt:
        "Leer hoe je Sanity CMS integreert met Next.js, inclusief schema-ontwerp, GROQ queries, preview mode en afbeeldingsoptimalisatie.",
      content: readMarkdownFile("02-sanity-nextjs-integration-nl.md"),
      category: "tutorial",
      tags: ["Sanity", "CMS", "Next.js", "GROQ", "TypeScript"],
      author: "Leroy Steding",
      publishedAt: new Date().toISOString(),
      readingTime: "20 min lezen",
      featured: true,
      language: "nl",
    },

    // 3. Building a Multilingual Portfolio
    {
      _type: "post",
      _id: "tutorial-multilingual-portfolio-en",
      title: "Building a Multilingual Portfolio with Next.js and next-intl",
      slug: { _type: "slug", current: "multilingual-portfolio-nextjs" },
      excerpt:
        "A comprehensive guide to implementing internationalization in Next.js with next-intl, including routing, translations, and SEO.",
      content: readMarkdownFile("03-multilingual-portfolio-en.md"),
      category: "tutorial",
      tags: ["Next.js", "i18n", "next-intl", "SEO", "TypeScript"],
      author: "Leroy Steding",
      publishedAt: new Date().toISOString(),
      readingTime: "18 min read",
      featured: true,
      language: "en",
    },
    {
      _type: "post",
      _id: "tutorial-multilingual-portfolio-nl",
      title: "Een Meertalige Portfolio Bouwen met Next.js en next-intl",
      slug: { _type: "slug", current: "meertalige-portfolio-nextjs" },
      excerpt:
        "Een uitgebreide handleiding voor het implementeren van internationalisatie in Next.js met next-intl, inclusief routing, vertalingen en SEO.",
      content: readMarkdownFile("03-multilingual-portfolio-nl.md"),
      category: "tutorial",
      tags: ["Next.js", "i18n", "next-intl", "SEO", "TypeScript"],
      author: "Leroy Steding",
      publishedAt: new Date().toISOString(),
      readingTime: "18 min lezen",
      featured: true,
      language: "nl",
    },

    // 4. AI Chat Integration Tutorial
    {
      _type: "post",
      _id: "tutorial-ai-chat-integration-en",
      title: "Building an AI Chat Widget with OpenAI and Next.js",
      slug: { _type: "slug", current: "ai-chat-widget-openai-nextjs" },
      excerpt:
        "Learn how to build a real-time AI chat widget using OpenAI's GPT API, streaming responses, and modern React patterns.",
      content: readMarkdownFile("04-ai-chat-integration-en.md"),
      category: "tutorial",
      tags: ["AI", "OpenAI", "ChatGPT", "Next.js", "React", "TypeScript"],
      author: "Leroy Steding",
      publishedAt: new Date().toISOString(),
      readingTime: "22 min read",
      featured: true,
      language: "en",
    },
    {
      _type: "post",
      _id: "tutorial-ai-chat-integration-nl",
      title: "Een AI Chat Widget Bouwen met OpenAI en Next.js",
      slug: { _type: "slug", current: "ai-chat-widget-openai-nextjs-nl" },
      excerpt:
        "Leer hoe je een real-time AI chat widget bouwt met OpenAI's GPT API, streaming responses en moderne React patterns.",
      content: readMarkdownFile("04-ai-chat-integration-nl.md"),
      category: "tutorial",
      tags: ["AI", "OpenAI", "ChatGPT", "Next.js", "React", "TypeScript"],
      author: "Leroy Steding",
      publishedAt: new Date().toISOString(),
      readingTime: "22 min lezen",
      featured: true,
      language: "nl",
    },

    // 5. Cal.com/Calendly Booking Integration
    {
      _type: "post",
      _id: "tutorial-booking-integration-en",
      title: "Building a Professional Booking System with Cal.com and Calendly",
      slug: { _type: "slug", current: "booking-system-calcom-calendly" },
      excerpt:
        "A comprehensive guide to integrating Cal.com and Calendly into your Next.js portfolio for professional appointment scheduling.",
      content: readMarkdownFile("05-booking-integration-en.md"),
      category: "tutorial",
      tags: ["Cal.com", "Calendly", "Next.js", "React", "Scheduling"],
      author: "Leroy Steding",
      publishedAt: new Date().toISOString(),
      readingTime: "20 min read",
      featured: true,
      language: "en",
    },
    {
      _type: "post",
      _id: "tutorial-booking-integration-nl",
      title: "Een Professioneel Boekingssysteem Bouwen met Cal.com en Calendly",
      slug: { _type: "slug", current: "boekingssysteem-calcom-calendly" },
      excerpt:
        "Een uitgebreide handleiding voor het integreren van Cal.com en Calendly in je Next.js portfolio voor professionele afspraakplanning.",
      content: readMarkdownFile("05-booking-integration-nl.md"),
      category: "tutorial",
      tags: ["Cal.com", "Calendly", "Next.js", "React", "Planning"],
      author: "Leroy Steding",
      publishedAt: new Date().toISOString(),
      readingTime: "20 min lezen",
      featured: true,
      language: "nl",
    },
  ];

  try {
    for (const tutorial of tutorials) {
      console.log(`📝 Creating: ${tutorial.title}`);
      await client.createOrReplace(tutorial);
      console.log(`   ✅ Created: ${tutorial.slug.current}\n`);
    }

    console.log("🎉 All tutorials created successfully!");
    console.log(`\n📊 Summary:`);
    console.log(`   - Total tutorials: ${tutorials.length}`);
    console.log(
      `   - English: ${tutorials.filter((t) => t.language === "en").length}`,
    );
    console.log(
      `   - Dutch: ${tutorials.filter((t) => t.language === "nl").length}`,
    );
    console.log(`\n🔗 View in Sanity Studio: /studio`);
  } catch (error) {
    console.error("❌ Error creating tutorials:", error);
    process.exit(1);
  }
}

createBlogTutorials();
