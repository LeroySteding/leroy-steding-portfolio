#!/usr/bin/env tsx
/**
 * RemoteOK Jobs Fetcher - DEBUG VERSION
 * 
 * Tests pushBatch behavior and prints detailed return values
 */

import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../convex/_generated/api";

const convexUrl = process.env.CONVEX_URL || process.env.NEXT_PUBLIC_CONVEX_URL;
if (!convexUrl) {
  console.error("❌ CONVEX_URL or NEXT_PUBLIC_CONVEX_URL required");
  process.exit(1);
}

const convex = new ConvexHttpClient(convexUrl);

async function testFetchRemoteOKJobs(): Promise<void> {
  console.log("🚀 DEBUG: Fetching jobs from RemoteOK API...\n");

  try {
    const response = await fetch("https://remoteok.com/api", {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; JobBot/1.0)",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    const jobs = data.slice(1); // Skip metadata
    
    console.log(`✅ Fetched ${jobs.length} total jobs from RemoteOK`);

    // Filter for relevant jobs
    const relevantJobs = jobs.filter((job: any) => {
      const tags = job.tags?.map((t: string) => t.toLowerCase()) || [];
      const position = (job.position || "").toLowerCase();
      
      return (
        tags.includes("react") ||
        tags.includes("typescript") ||
        tags.includes("nextjs") ||
        tags.includes("fullstack") ||
        tags.includes("full-stack") ||
        position.includes("full stack") ||
        position.includes("fullstack") ||
        position.includes("react") ||
        position.includes("typescript")
      );
    });

    console.log(`📊 Found ${relevantJobs.length} relevant jobs\n`);

    if (relevantJobs.length === 0) {
      console.log("⚠️  No relevant jobs found. Exiting.");
      return;
    }

    // Map to scraped job format
    const scrapedJobs = relevantJobs.map((job: any) => ({
      title: job.position,
      company: job.company,
      location: job.location || "Remote",
      description: job.description || job.position,
      salary: job.salary_min && job.salary_max 
        ? `$${job.salary_min}-${job.salary_max}`
        : undefined,
      url: job.url,
      technologies: job.tags || [],
      postedAt: job.date ? new Date(job.date).getTime() : Date.now(),
      source: "remoteok",
      remote: true,
    }));

    console.log("📋 Jobs to save:");
    scrapedJobs.forEach((job, i) => {
      console.log(`  ${i + 1}. ${job.title} at ${job.company}`);
      console.log(`     URL: ${job.url}`);
    });
    console.log("");

    // Test pushBatch
    console.log("💾 Calling pushBatch mutation...\n");
    
    const result = await convex.mutation(api.scraped_jobs.pushBatch, {
      jobs: scrapedJobs,
    });

    console.log("✅ pushBatch returned:");
    console.log(`   Created: ${result.created}`);
    console.log(`   Updated: ${result.updated}`);
    console.log(`   Errors: ${result.errors.length}`);
    
    if (result.errors.length > 0) {
      console.log("\n❌ Errors:");
      result.errors.forEach((err) => console.log(`   ${err}`));
    }

    console.log("");

    // Verify jobs in database
    console.log("🔍 Verifying jobs in database...\n");
    
    const dbJobs = await convex.query(api.scraped_jobs.list, {
      source: "remoteok",
      limit: 100,
    });

    console.log(`📊 RemoteOK jobs in database: ${dbJobs.length}`);
    
    if (dbJobs.length > 0) {
      console.log("\n📋 Jobs found in DB:");
      dbJobs.forEach((job, i) => {
        console.log(`  ${i + 1}. ${job.title} at ${job.company}`);
        console.log(`     Scraped: ${new Date(job.scrapedAt).toLocaleString()}`);
      });
    } else {
      console.log("\n⚠️  WARNING: No RemoteOK jobs found in database!");
      console.log("   pushBatch returned success but jobs aren't in DB");
    }

    // Get overall stats
    console.log("\n📊 Overall database stats:");
    const stats = await convex.query(api.scraped_jobs.stats, {});
    console.log(`   Total jobs: ${stats.total}`);
    console.log(`   Active: ${stats.active}`);
    console.log(`   Scraped last 24h: ${stats.scrapedLast24h}`);
    console.log(`   By source:`, stats.bySource);

  } catch (error) {
    console.error("\n❌ Failed:", error);
    throw error;
  }
}

// Run
if (require.main === module) {
  testFetchRemoteOKJobs()
    .then(() => {
      console.log("\n✅ Test complete!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("\n❌ Test failed:", error);
      process.exit(1);
    });
}

export { testFetchRemoteOKJobs };
