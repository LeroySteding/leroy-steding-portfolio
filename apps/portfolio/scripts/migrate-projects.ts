import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@sanity/client";
import { config } from "dotenv";
import { projects as projectsEN } from "../data/projects.js";
import { projectsNL } from "../data/projects-nl.js";

// Load environment variables FIRST
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config({ path: resolve(__dirname, "../../../.env") });
config({ path: resolve(__dirname, "../.env.local") });

// Verify env vars are loaded
if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
  console.error(
    "❌ Missing NEXT_PUBLIC_SANITY_PROJECT_ID environment variable",
  );
  process.exit(1);
}

if (!process.env.SANITY_API_TOKEN) {
  console.error("❌ Missing SANITY_API_TOKEN environment variable");
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
 * Migration script to import projects from TypeScript files to Sanity CMS
 *
 * Run with: npx tsx scripts/migrate-projects.ts
 */

async function migrateProjects() {
  console.log("🚀 Starting project migration...\n");
  console.log("📋 Configuration:");
  console.log(`   Project ID: ${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}`);
  console.log(`   Dataset: ${process.env.NEXT_PUBLIC_SANITY_DATASET}`);
  console.log(
    `   API Version: ${process.env.NEXT_PUBLIC_SANITY_API_VERSION}\n`,
  );

  try {
    // Migrate English projects
    console.log("📝 Migrating English projects...");
    for (const project of projectsEN) {
      const sanityProject = {
        _type: "project",
        _id: `project-en-${project.id}`,
        title: project.title,
        language: "en",
        slug: {
          _type: "slug",
          current: project.id,
        },
        description: project.description,
        longDescription: project.longDescription,
        // Store image URL directly - can be converted to Sanity asset later
        image: project.image,
        technologies: project.technologies,
        liveUrl: project.liveUrl || undefined,
        githubUrl: project.githubUrl || undefined,
        featured: project.featured,
        category: project.category,
        year: project.year,
        challenges: project.challenges || [],
        solutions: project.solutions || [],
        impact: project.impact || [],
        testimonial: project.testimonial || undefined,
        achievements: project.achievements || [],
        showOnCV: project.showOnCV || false,
      };

      const result = await client.createOrReplace(sanityProject);
      console.log(`✅ Migrated: ${project.title} (${result._id})`);
    }

    // Migrate Dutch projects
    console.log("\n📝 Migrating Dutch projects...");
    for (const project of projectsNL) {
      const sanityProject = {
        _type: "project",
        _id: `project-nl-${project.id}`,
        title: project.title,
        language: "nl",
        slug: {
          _type: "slug",
          current: project.id,
        },
        description: project.description,
        longDescription: project.longDescription,
        image: project.image,
        technologies: project.technologies,
        liveUrl: project.liveUrl || undefined,
        githubUrl: project.githubUrl || undefined,
        featured: project.featured,
        category: project.category,
        year: project.year,
        challenges: project.challenges || [],
        solutions: project.solutions || [],
        impact: project.impact || [],
        testimonial: project.testimonial || undefined,
        achievements: project.achievements || [],
        showOnCV: project.showOnCV || false,
      };

      const result = await client.createOrReplace(sanityProject);
      console.log(`✅ Migrated: ${project.title} (${result._id})`);
    }

    console.log("\n🎉 Migration completed successfully!");
    console.log(
      `📊 Total projects migrated: ${projectsEN.length + projectsNL.length}`,
    );
    console.log(`   - English: ${projectsEN.length}`);
    console.log(`   - Dutch: ${projectsNL.length}`);
    console.log("\n✨ Next steps:");
    console.log("   1. Visit http://localhost:3000/studio");
    console.log('   2. Check the "Projects" section');
    console.log("   3. Verify all projects are there!");
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
}

// Run migration
migrateProjects();
