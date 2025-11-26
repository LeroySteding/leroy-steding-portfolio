import { createClient } from "@sanity/client";
import { config } from "dotenv";
import { resolve } from "path";

// Load .env.local
config({ path: resolve(process.cwd(), ".env.local") });

const token = process.env.SANITY_API_TOKEN;

if (!token) {
  console.error("ERROR: SANITY_API_TOKEN not found in .env.local");
  process.exit(1);
}

console.log("Token prefix:", token.slice(0, 10) + "...");

const client = createClient({
  projectId: "p6hg7krm",
  dataset: "production",
  apiVersion: "2025-01-01",
  useCdn: false,
  token,
});

async function fixLanguageFields() {
  console.log("\n=== Fixing Language Fields ===\n");

  // Fix projects without language
  const projects = await client.fetch(
    '*[_type == "project" && !defined(language)]{_id, title}',
  );
  console.log(`Found ${projects.length} projects without language field`);

  for (const project of projects) {
    try {
      await client.patch(project._id).set({ language: "en" }).commit();
      console.log(`  ✓ Fixed: ${project.title || project._id}`);
    } catch (err: any) {
      console.log(
        `  ✗ Failed: ${project.title || project._id} - ${err.message}`,
      );
    }
  }

  // Fix experiences without language
  const experiences = await client.fetch(
    '*[_type == "experience" && !defined(language)]{_id, title, company}',
  );
  console.log(
    `\nFound ${experiences.length} experiences without language field`,
  );

  for (const exp of experiences) {
    try {
      await client.patch(exp._id).set({ language: "en" }).commit();
      console.log(`  ✓ Fixed: ${exp.title || exp.company || exp._id}`);
    } catch (err: any) {
      console.log(
        `  ✗ Failed: ${exp.title || exp.company || exp._id} - ${err.message}`,
      );
    }
  }

  // Check for posts without language
  const posts = await client.fetch(
    '*[_type == "post" && !defined(language)]{_id, title}',
  );
  console.log(`\nFound ${posts.length} posts without language field`);

  for (const post of posts) {
    try {
      await client.patch(post._id).set({ language: "en" }).commit();
      console.log(`  ✓ Fixed: ${post.title || post._id}`);
    } catch (err: any) {
      console.log(`  ✗ Failed: ${post.title || post._id} - ${err.message}`);
    }
  }

  console.log("\n=== Done ===");
}

fixLanguageFields().catch(console.error);
