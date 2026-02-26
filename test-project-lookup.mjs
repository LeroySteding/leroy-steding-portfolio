#!/usr/bin/env node

import { ConvexHttpClient } from "convex/browser";

const client = new ConvexHttpClient("https://hallowed-mole-286.eu-west-1.convex.cloud");

const projectId = "jh78gcgxfbp2gk93gbta9317m181112d";

console.log(`\nTesting project lookup for ID: ${projectId}\n`);

try {
  // Test 1: Try to get by ID
  console.log("Test 1: Query by ID...");
  const byId = await client.query("portfolio:getProjectById", {
    id: projectId,
    locale: "en"
  });
  console.log("Result:", byId ? `Found: ${byId.title}` : "Not found");
  
  // Test 2: List all projects
  console.log("\nTest 2: List all published projects...");
  const allProjects = await client.query("portfolio:getPublishedProjects", {
    locale: "en"
  });
  console.log(`Found ${allProjects.length} projects:`);
  allProjects.forEach(p => {
    console.log(`  - ${p._id}: ${p.title} (slug: ${p.slug})`);
  });
  
} catch (error) {
  console.error("Error:", error.message);
  console.error(error);
}
