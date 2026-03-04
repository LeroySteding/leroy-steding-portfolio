#!/usr/bin/env tsx
/**
 * Multi-Source Job Scraper CLI
 * 
 * Aggregates job listings from multiple platforms and stores in Convex.
 * 
 * Features:
 * - Multiple job sources (Indeed, RemoteOK, LinkedIn, etc.)
 * - Unified job schema
 * - Health checks per scraper
 * - Retry logic with exponential backoff
 * - Rate limiting per source
 * - Deduplication via URL
 * 
 * Usage:
 *   tsx apps/admin/scripts/scrape-jobs.ts --source=all
 *   tsx apps/admin/scripts/scrape-jobs.ts --source=indeed
 *   tsx apps/admin/scripts/scrape-jobs.ts --source=remoteok
 *   tsx apps/admin/scripts/scrape-jobs.ts --dry-run
 * 
 * Environment Variables:
 *   CONVEX_URL - Convex deployment URL (required)
 */

import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../convex/_generated/api";
import { IndeedScraper } from "./scrapers/IndeedScraper";
import { RemoteOKScraper } from "./scrapers/RemoteOKScraper";
import { WeWorkRemotelyScraper } from "./scrapers/WeWorkRemotelyScraper";
import type { Job, JobSource, BaseScraper as IBaseScraper } from "./scrapers/types";

// Parse CLI arguments
const args = process.argv.slice(2);
const sourceArg = args.find((arg) => arg.startsWith("--source="))?.split("=")[1] || "all";
const isDryRun = args.includes("--dry-run");

// Initialize Convex client
const convexUrl = process.env.CONVEX_URL || process.env.NEXT_PUBLIC_CONVEX_URL;
if (!convexUrl && !isDryRun) {
  console.error("❌ CONVEX_URL or NEXT_PUBLIC_CONVEX_URL environment variable is required");
  console.error("   Set it in .env.local or export it:");
  console.error("   export CONVEX_URL=https://your-project.convex.cloud");
  process.exit(1);
}

const convex = convexUrl ? new ConvexHttpClient(convexUrl) : null;

// Available scrapers
const SCRAPERS: Record<JobSource, () => IBaseScraper> = {
  remoteok: () => new RemoteOKScraper(),
  weworkremotely: () => new WeWorkRemotelyScraper(),
  
  // TODO: Fix Indeed scraper (HTML structure changed)
  indeed: () => new IndeedScraper(),
  
  // TODO: Implement these
  linkedin: () => {
    throw new Error("LinkedIn scraper not yet implemented");
  },
  glassdoor: () => {
    throw new Error("Glassdoor scraper not yet implemented");
  },
  prolinker: () => {
    throw new Error("ProLinker scraper deprecated - use RemoteOK/WeWorkRemotely instead");
  },
};

// Determine which sources to run
let sourcesToRun: JobSource[] = [];

if (sourceArg === "all") {
  // Only run working scrapers
  sourcesToRun = ["remoteok", "weworkremotely"];
} else {
  const source = sourceArg as JobSource;
  if (!SCRAPERS[source]) {
    console.error(`❌ Unknown source: ${source}`);
    console.error(`   Available sources: ${Object.keys(SCRAPERS).join(", ")}`);
    process.exit(1);
  }
  sourcesToRun = [source];
}

console.log(`\n🚀 Multi-Source Job Scraper`);
console.log(`   Sources: ${sourcesToRun.join(", ")}`);
console.log(`   Dry run: ${isDryRun ? "YES" : "NO"}`);
console.log("");

/**
 * Save job to Convex with deduplication
 */
async function saveJob(job: Job): Promise<{ created: boolean; updated: boolean }> {
  if (!convex || isDryRun) {
    console.log(`   [DRY RUN] Would save: ${job.title} at ${job.company}`);
    return { created: false, updated: false };
  }

  try {
    // Check if job already exists
    const existing = await convex.query(api.scraped_jobs.getByUrl, {
      url: job.url,
      source: job.source,
    });

    if (existing) {
      // Update scrapedAt (acts as "lastSeen")
      await convex.mutation(api.scraped_jobs.updateScrapedAt, {
        id: existing._id,
        scrapedAt: job.scrapedAt,
      });
      return { created: false, updated: true };
    } else {
      // Create new job
      await convex.mutation(api.scraped_jobs.create, job);
      return { created: true, updated: false };
    }
  } catch (error) {
    console.error(`   ❌ Error saving job:`, error);
    throw error;
  }
}

/**
 * Run a single scraper
 */
async function runScraper(source: JobSource): Promise<{
  source: JobSource;
  jobsFound: number;
  jobsSaved: number;
  jobsUpdated: number;
  errors: number;
  duration: number;
}> {
  console.log(`\n📦 Running ${source} scraper...`);
  console.log("─".repeat(60));

  const startTime = Date.now();
  let jobsSaved = 0;
  let jobsUpdated = 0;

  try {
    // Create scraper instance
    const scraper = SCRAPERS[source]();

    // Initialize
    await scraper.initialize();

    // Scrape jobs
    const jobs = await scraper.scrape();

    // Save to Convex
    for (const job of jobs) {
      try {
        const result = await saveJob(job);
        if (result.created) jobsSaved++;
        if (result.updated) jobsUpdated++;
      } catch (error) {
        console.error(`   ❌ Failed to save job: ${job.title}`);
        scraper.stats.errors++;
      }
    }

    // Cleanup
    await scraper.cleanup();

    const duration = Date.now() - startTime;

    console.log(`\n✅ ${source} scraper complete!`);
    console.log(`   Jobs found: ${scraper.stats.jobsFound}`);
    console.log(`   Jobs saved: ${jobsSaved}`);
    console.log(`   Jobs updated: ${jobsUpdated}`);
    console.log(`   Errors: ${scraper.stats.errors}`);
    console.log(`   Duration: ${(duration / 1000).toFixed(1)}s`);

    return {
      source,
      jobsFound: scraper.stats.jobsFound,
      jobsSaved,
      jobsUpdated,
      errors: scraper.stats.errors,
      duration,
    };
  } catch (error) {
    const duration = Date.now() - startTime;

    console.error(`\n❌ ${source} scraper failed:`, error);

    return {
      source,
      jobsFound: 0,
      jobsSaved: 0,
      jobsUpdated: 0,
      errors: 1,
      duration,
    };
  }
}

/**
 * Main execution
 */
async function main() {
  const results = [];

  for (const source of sourcesToRun) {
    const result = await runScraper(source);
    results.push(result);

    // Delay between scrapers to be respectful
    if (sourcesToRun.length > 1) {
      console.log("\n⏳ Waiting 5s before next scraper...");
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }

  // Print summary
  console.log("\n" + "═".repeat(60));
  console.log("📊 SUMMARY");
  console.log("═".repeat(60));

  const totals = results.reduce(
    (acc, r) => ({
      jobsFound: acc.jobsFound + r.jobsFound,
      jobsSaved: acc.jobsSaved + r.jobsSaved,
      jobsUpdated: acc.jobsUpdated + r.jobsUpdated,
      errors: acc.errors + r.errors,
      duration: acc.duration + r.duration,
    }),
    { jobsFound: 0, jobsSaved: 0, jobsUpdated: 0, errors: 0, duration: 0 }
  );

  for (const result of results) {
    console.log(`\n${result.source}:`);
    console.log(`  Jobs found: ${result.jobsFound}`);
    console.log(`  Jobs saved: ${result.jobsSaved}`);
    console.log(`  Jobs updated: ${result.jobsUpdated}`);
    console.log(`  Errors: ${result.errors}`);
    console.log(`  Duration: ${(result.duration / 1000).toFixed(1)}s`);
  }

  console.log(`\nTOTAL:`);
  console.log(`  Jobs found: ${totals.jobsFound}`);
  console.log(`  Jobs saved: ${totals.jobsSaved}`);
  console.log(`  Jobs updated: ${totals.jobsUpdated}`);
  console.log(`  Errors: ${totals.errors}`);
  console.log(`  Total duration: ${(totals.duration / 1000).toFixed(1)}s`);

  if (isDryRun) {
    console.log(`\n⚠️  DRY RUN - No jobs were actually saved to Convex`);
  }

  console.log("\n✨ All scrapers complete!\n");

  // Exit with error code if there were errors
  process.exit(totals.errors > 0 ? 1 : 0);
}

// Handle graceful shutdown
process.on("SIGINT", async () => {
  console.log("\n\n⚠️  Received SIGINT, shutting down gracefully...");
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("\n\n⚠️  Received SIGTERM, shutting down gracefully...");
  process.exit(0);
});

// Run
main().catch((error) => {
  console.error("\n❌ Fatal error:", error);
  process.exit(1);
});
