#!/usr/bin/env tsx
/**
 * Freep Job Scraper - Final Version
 * Extracts job data from server-rendered HTML
 */

import puppeteer, { Browser } from "puppeteer";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../convex/_generated/api";

const CONFIG = {
  baseUrl: "https://www.freep.nl/opdrachten",
  maxPages: 1, // Start with 1 page to test
  headless: false,
  requestDelay: 3000,
  navigationTimeout: 30000,
};

const convexUrl = process.env.CONVEX_URL;
if (!convexUrl) {
  console.error("❌ CONVEX_URL required");
  process.exit(1);
}

const convex = new ConvexHttpClient(convexUrl);

interface ScrapedJob {
  title: string;
  company: string;
  location?: string;
  description: string;
  salary?: string;
  url: string;
  technologies: string[];
  postedAt?: number;
  source: string;
  remote?: boolean;
  employmentType?: string;
}

async function scrapeFreep() {
  const stats = {
    pagesScraped: 0,
    jobsFound: 0,
    jobsSaved: 0,
    jobsUpdated: 0,
    errors: 0,
    governmentContracts: 0,
    startTime: Date.now(),
  };

  console.log("🏛️  Starting Freep scraper (HTML parsing version)...");

  let browser: Browser | null = null;

  try {
    browser = await puppeteer.launch({
      headless: CONFIG.headless,
      args: ["--no-sandbox"],
    });

    const page = await browser.newPage();
    await page.goto(CONFIG.baseUrl, { waitUntil: "networkidle2" });
    
    console.log("⏳ Waiting for page to render...");
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Extract the raw HTML
    const html = await page.content();
    
    console.log("📄 Parsing HTML for job data...");
    
    // Parse the server-rendered data from script tag
    const jobs = parseJobsFromHTML(html);
    
    stats.jobsFound = jobs.length;
    stats.pagesScraped = 1;

    console.log(`✅ Found ${jobs.length} jobs`);

    // Count government contracts
    jobs.forEach(job => {
      const text = (job.title + " " + job.company).toLowerCase();
      if (text.includes("gemeente") || text.includes("ministerie") || 
          text.includes("provincie") || text.includes("overheid")) {
        stats.governmentContracts++;
      }
    });

    // Save to Convex
    if (jobs.length > 0) {
      console.log(`💾 Saving jobs...`);
      const result = await saveJobs(jobs);
      stats.jobsSaved = result.created;
      stats.jobsUpdated = result.updated;
      console.log(`✅ ${result.created} new, ${result.updated} updated`);
    }

    const duration = ((Date.now() - stats.startTime) / 1000).toFixed(2);
    console.log("\n" + "=".repeat(60));
    console.log(`⏱️  Duration: ${duration}s`);
    console.log(`🔍 Jobs found: ${stats.jobsFound}`);
    console.log(`🏛️  Government: ${stats.governmentContracts}`);
    console.log(`💾 Saved: ${stats.jobsSaved} new`);
    console.log("=".repeat(60));

    await logStats(stats);

  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    if (browser) await browser.close();
  }
}

/**
 * Parse jobs from the HTML source
 */
function parseJobsFromHTML(html: string): ScrapedJob[] {
  const jobs: ScrapedJob[] = [];
  
  try {
    // Find the window.__NUXT__ script section
    const nuxtMatch = html.match(/window\.__NUXT__\s*=\s*(\{[^<]+\})/);
    
    if (!nuxtMatch) {
      console.log("⚠️  Could not find __NUXT__ data in HTML");
      return jobs;
    }

    // Parse the JavaScript object
    const nuxtDataStr = nuxtMatch[1];
    const nuxtData = eval(`(${nuxtDataStr})`);

    console.log("📦 Parsed __NUXT__ from HTML");
    console.log("Data keys:", Object.keys(nuxtData));

    // TODO: Navigate to actual assignments
    // Based on earlier analysis, we need to find the assignments array
    
  } catch (error) {
    console.error("Error parsing HTML:", error);
  }

  return jobs;
}

async function saveJobs(jobs: ScrapedJob[]) {
  try {
    return await convex.mutation(api.scraped_jobs.pushBatch, { jobs });
  } catch (error) {
    return { created: 0, updated: 0, errors: [String(error)] };
  }
}

async function logStats(stats: any) {
  try {
    await convex.mutation(api.analytics_log.push, {
      event: "freep_scraper_completed",
      agent: "scraper",
      metadata: stats,
      durationMs: Date.now() - stats.startTime,
    });
  } catch (error) {
    console.error("Failed to log stats:", error);
  }
}

if (require.main === module) {
  scrapeFreep()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export { scrapeFreep };
