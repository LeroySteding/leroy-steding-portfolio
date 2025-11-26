import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@sanity/client";
import { config } from "dotenv";
import { blogPosts } from "../data/blog.js";
import { blogPostsNL } from "../data/blog-nl.js";

// Load environment variables FIRST
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config({ path: resolve(__dirname, "../../../.env") });

// Verify env vars are loaded
if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
  console.error(
    "❌ Missing NEXT_PUBLIC_SANITY_PROJECT_ID environment variable",
  );
  process.exit(1);
}

// Create client with env vars
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-01-01",
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

/**
 * Migration script to import blog posts from TypeScript files to Sanity CMS
 *
 * Run with: pnpm run migrate:blog
 */

async function migrateBlogPosts() {
  console.log("🚀 Starting blog post migration...\n");
  console.log("📋 Configuration:");
  console.log(`   Project ID: ${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}`);
  console.log(`   Dataset: ${process.env.NEXT_PUBLIC_SANITY_DATASET}`);
  console.log(
    `   API Version: ${process.env.NEXT_PUBLIC_SANITY_API_VERSION}\n`,
  );

  try {
    // Migrate English posts
    console.log("📝 Migrating English blog posts...");
    for (const post of blogPosts) {
      const sanityPost = {
        _type: "post",
        _id: `post-en-${post.id}`,
        title: post.title,
        slug: {
          _type: "slug",
          current: post.slug,
        },
        excerpt: post.excerpt,
        content: post.content,
        category: post.category,
        tags: post.tags,
        author: post.author,
        publishedAt: new Date(post.publishedAt).toISOString(),
        readingTime: post.readingTime,
        featured: post.featured,
        language: "en",
      };

      const result = await client.createOrReplace(sanityPost);
      console.log(`✅ Migrated: ${post.title} (${result._id})`);
    }

    // Migrate Dutch posts
    console.log("\n📝 Migrating Dutch blog posts...");
    for (const post of blogPostsNL) {
      const sanityPost = {
        _type: "post",
        _id: `post-nl-${post.id}`,
        title: post.title,
        slug: {
          _type: "slug",
          current: post.slug,
        },
        excerpt: post.excerpt,
        content: post.content,
        category: post.category,
        tags: post.tags,
        author: post.author,
        publishedAt: new Date(post.publishedAt).toISOString(),
        readingTime: post.readingTime,
        featured: post.featured,
        language: "nl",
      };

      const result = await client.createOrReplace(sanityPost);
      console.log(`✅ Migrated: ${post.title} (${result._id})`);
    }

    console.log("\n🎉 Migration completed successfully!");
    console.log(
      `📊 Total posts migrated: ${blogPosts.length + blogPostsNL.length}`,
    );
    console.log(`   - English: ${blogPosts.length}`);
    console.log(`   - Dutch: ${blogPostsNL.length}`);
    console.log("\n✨ Next steps:");
    console.log("   1. Visit http://localhost:3000/studio");
    console.log('   2. Check the "Blog Post" section');
    console.log("   3. Verify all posts are there!");
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
}

// Run migration
migrateBlogPosts();
