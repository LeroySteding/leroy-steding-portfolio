#!/usr/bin/env node

import { ConvexHttpClient } from "convex/browser";

const client = new ConvexHttpClient("https://hallowed-mole-286.eu-west-1.convex.cloud");

const projectId = "jh78gcgxfbp2gk93gbta9317m181112d";

console.log(`\n🔍 Testing the broken URL: /en/projects/${projectId}\n`);

try {
  // Test ID-based lookup (NEW)
  console.log("✅ Testing NEW getProjectById query...");
  try {
    const byId = await client.query("portfolio:getProjectById", {
      id: projectId,
      locale: "en"
    });
    if (byId) {
      console.log(`   ✓ Found project: "${byId.title}"`);
      console.log(`   ✓ Slug: ${byId.slug || '(no slug)'}`);
      console.log(`   ✓ ID: ${byId._id}`);
    } else {
      console.log(`   ✗ Project not found with ID: ${projectId}`);
    }
  } catch (err) {
    console.log(`   ✗ Error: ${err.message}`);
  }

  // List all projects to check what's available
  console.log("\n📋 Listing all published projects...");
  const allProjects = await client.query("portfolio:getPublishedProjects", {
    locale: "en"
  });
  console.log(`   Found ${allProjects.length} projects:`);
  allProjects.slice(0, 3).forEach(p => {
    console.log(`   - "${p.title}"`);
    console.log(`     ID: ${p._id}`);
    console.log(`     Slug: ${p.slug || '(missing!)'}`);
  });
  
  if (allProjects.length > 3) {
    console.log(`   ... and ${allProjects.length - 3} more`);
  }

  console.log("\n💡 Summary:");
  console.log("   - Detail pages now support BOTH ID and slug URLs");
  console.log("   - If slug missing, ID lookup will work");
  console.log("   - Recommend: Add slugs to all projects in Convex");
  
} catch (error) {
  console.error("\n❌ Error:", error.message);
}
