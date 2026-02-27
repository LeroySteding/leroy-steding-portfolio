#!/usr/bin/env tsx
/**
 * ProLinker Job Scraper
 * 
 * Scrapes job listings from ProLinker platform and stores them in Convex.
 * Runs via cron every 4 hours or can be triggered manually.
 * 
 * Usage:
 *   tsx scripts/scrape-prolinker.ts [--dry-run] [--limit=10]
 */

import puppeteer, { type Browser, type Page } from "puppeteer";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";

// Configuration
const PROLINKER_BASE_URL = process.env.PROLINKER_URL || "https://www.prolinker.nl/jobs";
const CONVEX_URL = process.env.CONVEX_URL || process.env.NEXT_PUBLIC_CONVEX_URL;
const MAX_PAGES = parseInt(process.env.PROLINKER_MAX_PAGES || "5", 10);
const RATE_LIMIT_MS = parseInt(process.env.PROLINKER_RATE_LIMIT_MS || "2000", 10);

// Parse CLI args
const args = process.argv.slice(2);
const isDryRun = args.includes("--dry-run");
const limitArg = args.find((arg) => arg.startsWith("--limit="));
const limit = limitArg ? parseInt(limitArg.split("=")[1], 10) : undefined;

interface ScrapedJob {
  title: string;
  company: string;
  location?: string;
  description: string;
  salary?: string;
  url: string;
  technologies: string[];
  postedAt?: number;
  remote?: boolean;
  employmentType?: string;
  experienceLevel?: string;
}

class ProLinkerScraper {
  private browser: Browser | null = null;
  private page: Page | null = null;
  private convexClient: ConvexHttpClient | null = null;
  private scrapedCount = 0;
  private errorCount = 0;
  private duplicateCount = 0;

  async initialize() {
    console.log("🚀 Initializing ProLinker scraper...");
    
    // Initialize Convex client
    if (!CONVEX_URL) {
      throw new Error("CONVEX_URL environment variable not set");
    }
    this.convexClient = new ConvexHttpClient(CONVEX_URL);
    
    // Launch browser
    this.browser = await puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-accelerated-2d-canvas",
        "--no-first-run",
        "--no-zygote",
        "--disable-gpu",
      ],
    });
    
    this.page = await this.browser.newPage();
    
    // Set realistic viewport and user agent
    await this.page.setViewport({ width: 1920, height: 1080 });
    await this.page.setUserAgent(
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    );
    
    console.log("✅ Browser initialized");
  }

  async scrapeListingPage(pageNum: number): Promise<string[]> {
    if (!this.page) throw new Error("Page not initialized");
    
    const url = `${PROLINKER_BASE_URL}?page=${pageNum}`;
    console.log(`📄 Scraping page ${pageNum}: ${url}`);
    
    try {
      await this.page.goto(url, { waitUntil: "networkidle2", timeout: 30000 });
      
      // Wait for job listings to load
      await this.page.waitForSelector(".job-listing, .job-card, [data-job-id]", {
        timeout: 10000,
      }).catch(() => {
        console.warn("⚠️  No job listings found on page");
        return null;
      });
      
      // Extract job URLs
      const jobUrls = await this.page.evaluate(() => {
        // Adapt selectors based on actual ProLinker HTML structure
        const jobLinks = Array.from(
          document.querySelectorAll("a[href*='/job/'], a.job-link, a[data-job-url]")
        );
        
        return jobLinks
          .map((link) => (link as HTMLAnchorElement).href)
          .filter((href) => href && href.includes("/job"));
      });
      
      console.log(`  Found ${jobUrls.length} job URLs`);
      return jobUrls;
    } catch (error) {
      console.error(`❌ Error scraping page ${pageNum}:`, error);
      this.errorCount++;
      return [];
    }
  }

  async scrapeJobDetail(url: string): Promise<ScrapedJob | null> {
    if (!this.page) throw new Error("Page not initialized");
    
    try {
      console.log(`  🔍 Scraping job: ${url}`);
      
      await this.page.goto(url, { waitUntil: "networkidle2", timeout: 30000 });
      
      // Extract job details
      const jobData = await this.page.evaluate(() => {
        // Helper to safely extract text
        const getText = (selector: string): string | undefined => {
          const el = document.querySelector(selector);
          return el?.textContent?.trim() || undefined;
        };
        
        const getTexts = (selector: string): string[] => {
          return Array.from(document.querySelectorAll(selector))
            .map((el) => el.textContent?.trim())
            .filter(Boolean) as string[];
        };
        
        // Adapt selectors based on actual ProLinker HTML structure
        const title = getText("h1.job-title, .job-header h1, [data-job-title]") || "Unknown Title";
        const company = getText(".company-name, .employer, [data-company]") || "Unknown Company";
        const location = getText(".job-location, .location, [data-location]");
        const salary = getText(".salary-range, .compensation, [data-salary]");
        const description = getText(".job-description, .description, [data-description]") || "";
        
        // Extract skills/technologies
        const techElements = getTexts(".skill-tag, .tech-stack span, .technology");
        
        // Extract employment type
        const employmentType = getText(".employment-type, .job-type, [data-employment-type]");
        
        // Check for remote/hybrid
        const fullText = document.body.innerText.toLowerCase();
        const remote = fullText.includes("remote") || fullText.includes("werken op afstand");
        const hybrid = fullText.includes("hybrid") || fullText.includes("hybride");
        
        // Extract experience level
        const experienceLevel = getText(".experience-level, .seniority, [data-level]");
        
        return {
          title,
          company,
          location,
          description,
          salary,
          technologies: techElements,
          employmentType,
          experienceLevel,
          remote,
          hybrid,
        };
      });
      
      // Parse posted date from page (if available)
      const postedAt = await this.extractPostedDate();
      
      const job: ScrapedJob = {
        ...jobData,
        url,
        postedAt,
        remote: jobData.remote || jobData.hybrid || false,
      };
      
      console.log(`    ✅ Scraped: ${job.title} at ${job.company}`);
      return job;
    } catch (error) {
      console.error(`    ❌ Error scraping job ${url}:`, error);
      this.errorCount++;
      return null;
    }
  }

  private async extractPostedDate(): Promise<number | undefined> {
    if (!this.page) return undefined;
    
    try {
      const dateText = await this.page.evaluate(() => {
        const dateEl = document.querySelector(".posted-date, .publish-date, time[datetime]");
        if (dateEl) {
          const datetime = dateEl.getAttribute("datetime");
          if (datetime) return datetime;
          return dateEl.textContent?.trim();
        }
        return null;
      });
      
      if (!dateText) return undefined;
      
      // Try to parse date
      const date = new Date(dateText);
      if (!isNaN(date.getTime())) {
        return date.getTime();
      }
      
      // Handle relative dates like "2 days ago"
      const daysAgoMatch = dateText.match(/(\d+)\s+(day|dag)/i);
      if (daysAgoMatch) {
        const days = parseInt(daysAgoMatch[1], 10);
        return Date.now() - days * 24 * 60 * 60 * 1000;
      }
      
      return undefined;
    } catch {
      return undefined;
    }
  }

  async saveJob(job: ScrapedJob): Promise<boolean> {
    if (!this.convexClient) throw new Error("Convex client not initialized");
    
    if (isDryRun) {
      console.log(`    [DRY RUN] Would save job: ${job.title}`);
      return true;
    }
    
    try {
      const result = await this.convexClient.action(api.scraped_jobs.saveScrapedJob, {
        ...job,
        source: "prolinker",
        scrapedAt: Date.now(),
      });
      
      if (result.created) {
        this.scrapedCount++;
        console.log(`    💾 Saved new job to Convex`);
      } else {
        this.duplicateCount++;
        console.log(`    ⚪ Job already exists (updated lastSeen)`);
      }
      
      return true;
    } catch (error) {
      console.error(`    ❌ Error saving job:`, error);
      this.errorCount++;
      return false;
    }
  }

  async scrape() {
    console.log("\n🔍 Starting ProLinker scrape...");
    console.log(`   Max pages: ${MAX_PAGES}`);
    console.log(`   Rate limit: ${RATE_LIMIT_MS}ms`);
    console.log(`   Dry run: ${isDryRun}`);
    if (limit) console.log(`   Job limit: ${limit}`);
    
    let totalJobsProcessed = 0;
    
    // Scrape listing pages
    for (let pageNum = 1; pageNum <= MAX_PAGES; pageNum++) {
      const jobUrls = await this.scrapeListingPage(pageNum);
      
      if (jobUrls.length === 0) {
        console.log(`   No more jobs found, stopping at page ${pageNum}`);
        break;
      }
      
      // Scrape each job detail
      for (const url of jobUrls) {
        if (limit && totalJobsProcessed >= limit) {
          console.log(`   Reached job limit (${limit}), stopping`);
          break;
        }
        
        const job = await this.scrapeJobDetail(url);
        if (job) {
          await this.saveJob(job);
          totalJobsProcessed++;
        }
        
        // Rate limiting
        await this.sleep(RATE_LIMIT_MS);
      }
      
      if (limit && totalJobsProcessed >= limit) break;
      
      // Rate limit between pages
      await this.sleep(RATE_LIMIT_MS * 2);
    }
    
    console.log("\n✨ Scrape complete!");
    console.log(`   Total processed: ${totalJobsProcessed}`);
    console.log(`   New jobs: ${this.scrapedCount}`);
    console.log(`   Duplicates: ${this.duplicateCount}`);
    console.log(`   Errors: ${this.errorCount}`);
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async cleanup() {
    console.log("\n🧹 Cleaning up...");
    if (this.browser) {
      await this.browser.close();
    }
    console.log("✅ Done");
  }
}

// Main execution
async function main() {
  const scraper = new ProLinkerScraper();
  
  try {
    await scraper.initialize();
    await scraper.scrape();
  } catch (error) {
    console.error("💥 Fatal error:", error);
    process.exit(1);
  } finally {
    await scraper.cleanup();
  }
}

// Handle signals
process.on("SIGINT", async () => {
  console.log("\n⚠️  Received SIGINT, cleaning up...");
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("\n⚠️  Received SIGTERM, cleaning up...");
  process.exit(0);
});

// Run if called directly
if (require.main === module) {
  main();
}

export { ProLinkerScraper };
