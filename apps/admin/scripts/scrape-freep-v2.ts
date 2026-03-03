#!/usr/bin/env tsx
/**
 * Freep Job Scraper v2
 * 
 * Freep.nl uses Nuxt/React with data embedded in window.__NUXT__
 * This version extracts the data directly from the JavaScript
 */

import puppeteer, { Browser, Page } from "puppeteer";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../convex/_generated/api";

// Configuration
const CONFIG = {
  baseUrl: process.env.FREEP_URL || "https://www.freep.nl/opdrachten",
  maxPages: parseInt(process.env.MAX_PAGES || "5"),
  headless: process.env.HEADLESS !== "false",
  requestDelay: 3000, // 3 seconds between pages
  maxRetries: 3,
  retryDelay: 5000,
  navigationTimeout: 30000,
};

// Initialize Convex client
const convexUrl = process.env.CONVEX_URL;
if (!convexUrl) {
  console.error("❌ CONVEX_URL environment variable is required");
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
  experienceLevel?: string;
}

interface ScrapeStats {
  pagesScraped: number;
  jobsFound: number;
  jobsSaved: number;
  jobsUpdated: number;
  errors: number;
  governmentContracts: number;
  startTime: number;
  endTime?: number;
}

async function scrapeFreep(): Promise<ScrapeStats> {
  const stats: ScrapeStats = {
    pagesScraped: 0,
    jobsFound: 0,
    jobsSaved: 0,
    jobsUpdated: 0,
    errors: 0,
    governmentContracts: 0,
    startTime: Date.now(),
  };

  console.log("🏛️  Starting Freep government contracts scraper v2...");
  console.log(`📍 Base URL: ${CONFIG.baseUrl}`);

  let browser: Browser | null = null;

  try {
    browser = await puppeteer.launch({
      headless: CONFIG.headless,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.setUserAgent(
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    );
    await page.setViewport({ width: 1920, height: 1080 });

    // Scrape first page
    console.log(`\n📄 Scraping page 1...`);
    await page.goto(CONFIG.baseUrl, {
      waitUntil: "networkidle2",
      timeout: CONFIG.navigationTimeout,
    });

    console.log("⏳ Waiting for data to load...");
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Extract data from window.__NUXT__
    const jobs = await extractJobsFromNuxt(page);
    
    stats.pagesScraped++;
    stats.jobsFound += jobs.length;

    console.log(`✅ Found ${jobs.length} jobs`);

    // Count government contracts
    jobs.forEach(job => {
      if (isGovernmentContract(job)) {
        stats.governmentContracts++;
      }
    });

    // Save jobs to Convex
    if (jobs.length > 0) {
      console.log(`💾 Saving ${jobs.length} jobs to Convex...`);
      const result = await saveJobs(jobs);
      stats.jobsSaved += result.created;
      stats.jobsUpdated += result.updated;
      
      console.log(`✅ Saved: ${result.created} new, ${result.updated} updated`);
      
      if (result.errors.length > 0) {
        console.error(`⚠️  ${result.errors.length} errors:`);
        result.errors.forEach((err) => console.error(`  - ${err}`));
        stats.errors += result.errors.length;
      }
    }

    stats.endTime = Date.now();
    const duration = ((stats.endTime - stats.startTime) / 1000).toFixed(2);

    console.log("\n" + "=".repeat(60));
    console.log("📊 Scraping completed!");
    console.log("=".repeat(60));
    console.log(`⏱️  Duration: ${duration}s`);
    console.log(`📄 Pages scraped: ${stats.pagesScraped}`);
    console.log(`🔍 Jobs found: ${stats.jobsFound}`);
    console.log(`🏛️  Government contracts: ${stats.governmentContracts}`);
    console.log(`💾 Jobs saved: ${stats.jobsSaved} new, ${stats.jobsUpdated} updated`);
    console.log(`❌ Errors: ${stats.errors}`);
    console.log("=".repeat(60));

    // Log stats to Convex
    await logStats(stats);

  } catch (error) {
    console.error("❌ Fatal error:", error);
    stats.errors++;
    await logError("fatal_error", { error: String(error) });
  } finally {
    if (browser) {
      await browser.close();
    }
  }

  return stats;
}

/**
 * Extract jobs from window.__NUXT__ data
 */
async function extractJobsFromNuxt(page: Page): Promise<ScrapedJob[]> {
  const jobs: ScrapedJob[] = [];

  try {
    // Extract the __NUXT__ data from the page
    const nuxtData = await page.evaluate(() => {
      return (window as any).__NUXT__;
    });

    console.log("📦 Extracted __NUXT__ data");

    // Navigate through the data structure to find assignments
    // Based on the grep output, assignments are in: data.assignments.assignments
    const assignments = nuxtData?.data?.assignments?.assignments || [];
    
    console.log(`🔍 Found ${assignments.length} assignments in __NUXT__ data`);

    for (const assignment of assignments) {
      try {
        const job = parseAssignment(assignment);
        if (job) {
          jobs.push(job);
        }
      } catch (error) {
        console.error("⚠️  Error parsing assignment:", error);
      }
    }

  } catch (error) {
    console.error("❌ Error extracting __NUXT__ data:", error);
  }

  return jobs;
}

/**
 * Parse a single assignment from Freep data
 */
function parseAssignment(assignment: any): ScrapedJob | null {
  try {
    const title = assignment.title || "";
    const company = assignment.company_name || "Government Entity";
    const slug = assignment.slug || "";
    
    if (!title || !slug) {
      return null;
    }

    // Build job URL
    const url = `https://www.freep.nl/opdracht/${slug}`;

    // Extract location (province)
    const province = assignment.location_province || "";
    const location = getProvinceName(province);

    // Extract rate (salary)
    const rateMax = assignment.rate_max;
    const hours = assignment.hours;
    let salary = undefined;
    if (rateMax) {
      salary = `€${rateMax}/hour`;
      if (hours) {
        salary += ` (${hours} hours)`;
      }
    }

    // Extract segment (job category)
    const segment = assignment.segment || "";
    const segmentName = getSegmentName(segment);

    // Description is the title for now (would need to fetch full job details)
    const description = `${title} - ${segmentName}`;

    // Determine posted date
    const createdDate = assignment.created_date;
    let postedAt = undefined;
    if (createdDate) {
      postedAt = new Date(createdDate).getTime();
    }

    // Extract technologies from title and segment
    const technologies = extractTechnologies(title + " " + segmentName);

    // Remote work detection
    const fullText = (title + " " + description).toLowerCase();
    const remote = fullText.includes("remote") || 
                   fullText.includes("thuiswerken") ||
                   fullText.includes("op afstand");

    return {
      title,
      company,
      location,
      description,
      salary,
      url,
      technologies,
      source: "freep",
      remote,
      employmentType: "contract", // Freep is primarily contracts/freelance
      postedAt,
    };
  } catch (error) {
    console.error("Error parsing assignment:", error);
    return null;
  }
}

/**
 * Get province name from code
 */
function getProvinceName(code: number | string): string | undefined {
  const provinces: Record<string, string> = {
    "12": "Noord-Brabant",
    "34": "Zuid-Holland",
    "52": "Noord-Holland",
    "62": "Gelderland",
    "72": "Utrecht",
    "93": "Overijssel",
    "101": "Limburg",
    "120": "Groningen",
    "198": "Friesland",
    "331": "Zeeland",
    "567": "Flevoland",
    "768": "Drenthe",
  };
  return provinces[String(code)];
}

/**
 * Get segment name (would need to map from the data)
 */
function getSegmentName(segment: string): string {
  // This is a simplified version - you'd need to build a full mapping
  const segments: Record<string, string> = {
    "ICT Informatievoorziening": "ICT",
    "Algemeen-projectmanagement": "Project Management",
    "Juridisch": "Legal",
    "Beleid- en adviesdiensten": "Policy & Advisory",
    // ... add more mappings as needed
  };
  return segments[segment] || segment;
}

/**
 * Check if a job is a government contract
 */
function isGovernmentContract(job: ScrapedJob): boolean {
  const text = (job.title + " " + job.description + " " + job.company).toLowerCase();
  
  const governmentKeywords = [
    "gemeente", "municipal", "ministerie", "ministry",
    "provincie", "provincial", "waterschappen", "water board",
    "rijksoverheid", "government", "overheid", "publieke sector",
  ];
  
  return governmentKeywords.some(keyword => text.includes(keyword));
}

/**
 * Extract technology keywords from text
 */
function extractTechnologies(text: string): string[] {
  const techKeywords = [
    "JavaScript", "TypeScript", "Python", "Java", "C#", "PHP", "React", 
    "Vue", "Angular", "Node.js", "PostgreSQL", "MySQL", "MongoDB",
    "AWS", "Azure", "Docker", "Kubernetes", "SAP", "ServiceNow",
  ];

  const found = new Set<string>();
  const lowerText = text.toLowerCase();

  techKeywords.forEach((tech) => {
    if (lowerText.includes(tech.toLowerCase())) {
      found.add(tech);
    }
  });

  return Array.from(found);
}

async function saveJobs(jobs: ScrapedJob[]) {
  try {
    const result = await convex.mutation(api.scraped_jobs.pushBatch, { jobs });
    return result;
  } catch (error) {
    console.error("Error saving jobs to Convex:", error);
    return { created: 0, updated: 0, errors: [String(error)] };
  }
}

async function logError(event: string, metadata: any) {
  try {
    await convex.mutation(api.analytics_log.push, {
      event: `freep_scraper_${event}`,
      agent: "scraper",
      metadata,
    });
  } catch (error) {
    console.error("Failed to log error to Convex:", error);
  }
}

async function logStats(stats: ScrapeStats) {
  try {
    await convex.mutation(api.analytics_log.push, {
      event: "freep_scraper_completed",
      agent: "scraper",
      metadata: stats,
      durationMs: stats.endTime ? stats.endTime - stats.startTime : 0,
    });
  } catch (error) {
    console.error("Failed to log stats to Convex:", error);
  }
}

// Run scraper if executed directly
if (require.main === module) {
  scrapeFreep()
    .then(() => {
      console.log("✅ Scraper finished successfully");
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Scraper failed:", error);
      process.exit(1);
    });
}

export { scrapeFreep, CONFIG };
