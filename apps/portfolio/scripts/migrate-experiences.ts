import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@sanity/client";
import { config } from "dotenv";
import { experiences as experiencesEN } from "../data/experiences.js";
import { experiencesNL } from "../data/experiences-nl.js";

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
 * Migration script to import experiences from TypeScript files to Sanity CMS
 *
 * Run with: npx tsx scripts/migrate-experiences.ts
 */

async function migrateExperiences() {
  console.log("🚀 Starting experience migration...\n");
  console.log("📋 Configuration:");
  console.log(`   Project ID: ${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}`);
  console.log(`   Dataset: ${process.env.NEXT_PUBLIC_SANITY_DATASET}`);
  console.log(
    `   API Version: ${process.env.NEXT_PUBLIC_SANITY_API_VERSION}\n`,
  );

  try {
    // Migrate English experiences
    console.log("📝 Migrating English experiences...");
    for (const exp of experiencesEN) {
      const sanityExperience = {
        _type: "experience",
        _id: `experience-en-${exp.id}`,
        title: exp.title,
        language: "en",
        slug: {
          _type: "slug",
          current: exp.id,
        },
        company: exp.company,
        // Store logo URL directly - can be converted to Sanity asset later
        companyLogo: exp.companyLogo || undefined,
        companyUrl: exp.companyUrl || undefined,
        period: exp.period,
        location: exp.location,
        description: exp.description,
        longDescription: exp.longDescription,
        technologies: exp.technologies,
        color: exp.color,
        highlights: exp.highlights || [],
        achievements: exp.achievements || [],
        responsibilities: exp.responsibilities || [],
        teamSize: exp.teamSize || undefined,
        impact: exp.impact || [],
      };

      const result = await client.createOrReplace(sanityExperience);
      console.log(
        `✅ Migrated: ${exp.title} at ${exp.company} (${result._id})`,
      );
    }

    // Migrate Dutch experiences
    console.log("\n📝 Migrating Dutch experiences...");
    for (const exp of experiencesNL) {
      const sanityExperience = {
        _type: "experience",
        _id: `experience-nl-${exp.id}`,
        title: exp.title,
        language: "nl",
        slug: {
          _type: "slug",
          current: exp.id,
        },
        company: exp.company,
        companyLogo: exp.companyLogo || undefined,
        companyUrl: exp.companyUrl || undefined,
        period: exp.period,
        location: exp.location,
        description: exp.description,
        longDescription: exp.longDescription,
        technologies: exp.technologies,
        color: exp.color,
        highlights: exp.highlights || [],
        achievements: exp.achievements || [],
        responsibilities: exp.responsibilities || [],
        teamSize: exp.teamSize || undefined,
        impact: exp.impact || [],
      };

      const result = await client.createOrReplace(sanityExperience);
      console.log(
        `✅ Migrated: ${exp.title} at ${exp.company} (${result._id})`,
      );
    }

    console.log("\n🎉 Migration completed successfully!");
    console.log(
      `📊 Total experiences migrated: ${experiencesEN.length + experiencesNL.length}`,
    );
    console.log(`   - English: ${experiencesEN.length}`);
    console.log(`   - Dutch: ${experiencesNL.length}`);
    console.log("\n✨ Next steps:");
    console.log("   1. Visit http://localhost:3000/studio");
    console.log('   2. Check the "Work Experience" section');
    console.log("   3. Verify all experiences are there!");
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
}

// Run migration
migrateExperiences();
