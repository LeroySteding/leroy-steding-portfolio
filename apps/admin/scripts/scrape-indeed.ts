#!/usr/bin/env tsx
/**
 * Indeed Netherlands Job Scraper
 * 
 * Scrapes job listings from Indeed.nl and stores them in Convex.
 * Indeed uses server-rendered HTML (not SPA), making it reliable to scrape.
 * 
 * Usage:
 *   tsx apps/admin/scripts/scrape-indeed.ts
 */

import puppeteer, { Browser, Page } from "puppeteer";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../convex/_generated/api";

// Configuration
const CONFIG = {
  baseUrl: "https://nl.indeed.com",
  searchQuery: "senior+fullstack+developer",
  location: "Nederland",
  maxPages: 3,
  headless: true,
  requestDelay: 2000, // 2 seconds between pages
  navigationTimeout: 45000, // 45 seconds
};

const convex = new ConvexHttpClient(process.env.CONVEX_URL!);

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

async function scrapeIndeed(): Promise<void> {
  console.log("🚀 Starting Indeed.nl job scraper...");
  
  const browser = await puppeteer.launch({
    headless: CONFIG.headless,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();
    await page.setUserAgent(
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"
    );

    let totalJobs = 0;

    for (let pageNum = 0; pageNum < CONFIG.maxPages; pageNum++) {
      const url = `${CONFIG.baseUrl}/jobs?q=${CONFIG.searchQuery}&l=${CONFIG.location}&start=${pageNum * 10}`;
      
      console.log(`\n📄 Scraping page ${pageNum + 1}...`);
      await page.goto(url, { waitUntil: "networkidle2", timeout: CONFIG.navigationTimeout });

      // Wait for job cards to load
      await page.waitForSelector(".job_seen_beacon, .jobCard", { timeout: 10000 }).catch(() => {
        console.log("⚠️  No job cards found on this page");
      });

      // Extract jobs
      const jobs = await page.evaluate(() => {
        const jobCards = Array.from(document.querySelectorAll(".job_seen_beacon, .jobCard"));
        
        return jobCards.map((card) => {
          const titleEl = card.querySelector("h2.jobTitle a, .jobTitle span");
          const companyEl = card.querySelector(".companyName");
          const locationEl = card.querySelector(".companyLocation");
          const salaryEl = card.querySelector(".salary-snippet");
          const linkEl = card.querySelector("h2.jobTitle a");

          const title = titleEl?.textContent?.trim() || "";
          const company = companyEl?.textContent?.trim() || "";
          const location = locationEl?.textContent?.trim();
          const salary = salaryEl?.textContent?.trim();
          const href = linkEl?.getAttribute("href");
          const url = href ? `https://nl.indeed.com${href}` : "";

          return { title, company, location, salary, url };
        }).filter(job => job.title && job.company && job.url);
      });

      console.log(`✅ Found ${jobs.length} jobs on page ${pageNum + 1}`);
      
      // Process each job
      for (const job of jobs) {
        const fullJob: ScrapedJob = {
          ...job,
          description: job.title, // Will fetch full description in v2
          technologies: extractTechnologies(job.title),
          source: "indeed_nl",
          remote: job.location?.toLowerCase().includes("remote") || job.title.toLowerCase().includes("remote"),
        };

        // Save to Convex
        try {
          await convex.mutation(api.scraped_jobs.pushBatch, {
            jobs: [fullJob],
          });
          totalJobs++;
        } catch (error) {
          console.error(`❌ Error saving job: ${error}`);
        }
      }

      if (jobs.length === 0) break;
      
      // Rate limiting
      if (pageNum < CONFIG.maxPages - 1) {
        await sleep(CONFIG.requestDelay);
      }
    }

    console.log(`\n✅ Scraping complete! Total jobs: ${totalJobs}`);

    // Log to analytics
    await convex.mutation(api.analytics_log.push, {
      event: "indeed_scraper_completed",
      agent: "scraper",
      metadata: { jobsFound: totalJobs, source: "indeed_nl" },
      durationMs: 0,
    });

  } finally {
    await browser.close();
  }
}

function extractTechnologies(text: string): string[] {
  const techKeywords = [
    "JavaScript", "TypeScript", "Python", "Java", "C#", "React", "Vue", "Angular",
    "Next.js", "Node.js", "Express", "Django", "Flask", "PostgreSQL", "MongoDB",
    "Docker", "Kubernetes", "AWS", "Azure", "GCP"
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

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Run
if (require.main === module) {
  scrapeIndeed()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error("❌ Scraper failed:", error);
      process.exit(1);
    });
}

export { scrapeIndeed, CONFIG };
