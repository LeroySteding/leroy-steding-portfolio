import { createClient } from "@sanity/client";

const client = createClient({
  projectId: "p6hg7krm",
  dataset: "production",
  apiVersion: "2025-01-01",
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

async function fixLanguageFields() {
  console.log("=== Fixing Language Fields ===\n");

  // Fix projects without language
  const projects = await client.fetch(
    '*[_type == "project" && !defined(language)]{_id, title}',
  );
  console.log(`Found ${projects.length} projects without language field`);

  for (const project of projects) {
    await client.patch(project._id).set({ language: "en" }).commit();
    console.log(`  Fixed: ${project.title || project._id}`);
  }

  // Fix experiences without language
  const experiences = await client.fetch(
    '*[_type == "experience" && !defined(language)]{_id, title, company}',
  );
  console.log(
    `\nFound ${experiences.length} experiences without language field`,
  );

  for (const exp of experiences) {
    await client.patch(exp._id).set({ language: "en" }).commit();
    console.log(`  Fixed: ${exp.title || exp.company || exp._id}`);
  }

  // Check for posts without language
  const posts = await client.fetch(
    '*[_type == "post" && !defined(language)]{_id, title}',
  );
  console.log(`\nFound ${posts.length} posts without language field`);

  for (const post of posts) {
    await client.patch(post._id).set({ language: "en" }).commit();
    console.log(`  Fixed: ${post.title || post._id}`);
  }

  console.log("\n=== Done ===");
}

fixLanguageFields().catch(console.error);
