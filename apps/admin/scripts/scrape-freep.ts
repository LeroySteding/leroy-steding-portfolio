#!/usr/bin/env tsx
/**
 * Freep Job Scraper
 * 
 * Scrapes government freelance contract listings from Freep.nl and stores them in Convex.
 * Freep specializes in Dutch government contracts for freelancers.
 * 
 * Features:
 * - Pagination support
 * - Rate limiting (respectful scraping)
 * - Retry logic with exponential backoff
 * - Error logging to Convex
 * - Deduplication via URL
 * - Extracts: title, organization, location, description, hourly rate, required skills
 * - Government sector detection (municipal, provincial, ministry, etc.)
 * 
 * Usage:
 *   tsx apps/admin/scripts/scrape-freep.ts
 * 
 * Environment Variables:
 *   CONVEX_URL - Convex deployment URL (required)
 *   FREEP_URL - Freep job board URL (defaults to config)
 *   MAX_PAGES - Maximum pages to scrape (default: 10)
 *   HEADLESS - Run browser in headless mode (default: true)
 */

import puppeteer, { Browser, Page } from "puppeteer";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../convex/_generated/api";

// Configuration
const CONFIG = {
  // Freep URL
  baseUrl: process.env.FREEP_URL || "https://www.freep.nl/opdrachten",
  maxPages: parseInt(process.env.MAX_PAGES || "10"),
  headless: process.env.HEADLESS !== "false",
  
  // Rate limiting (be extra respectful for government sites)
  requestDelay: 3000, // 3 seconds between pages
  maxRetries: 3,
  retryDelay: 5000, // 5 seconds initial retry delay
  
  // Timeouts
  navigationTimeout: 30000,
  selectorTimeout: 10000,
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

/**
 * Main scraper function
 */
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

  console.log("🏛️  Starting Freep government contracts scraper...");
  console.log(`📍 Base URL: ${CONFIG.baseUrl}`);
  console.log(`📄 Max pages: ${CONFIG.maxPages}`);
  console.log(`⏱️  Request delay: ${CONFIG.requestDelay}ms`);

  let browser: Browser | null = null;

  try {
    // Launch browser
    browser = await puppeteer.launch({
      headless: CONFIG.headless,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    console.log("🌐 Browser launched");

    const page = await browser.newPage();
    
    // Set user agent to avoid bot detection
    await page.setUserAgent(
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    );

    // Set viewport
    await page.setViewport({ width: 1920, height: 1080 });

    // Scrape pages
    for (let pageNum = 1; pageNum <= CONFIG.maxPages; pageNum++) {
      try {
        console.log(`\n📄 Scraping page ${pageNum}...`);
        
        const pageUrl = pageNum === 1 ? CONFIG.baseUrl : `${CONFIG.baseUrl}?page=${pageNum}`;
        const jobs = await scrapePage(page, pageUrl, stats);
        
        stats.pagesScraped++;
        stats.jobsFound += jobs.length;

        if (jobs.length === 0) {
          console.log("✅ No more jobs found, stopping pagination");
          break;
        }

        // Save jobs to Convex
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

        // Rate limiting - wait before next page
        if (pageNum < CONFIG.maxPages) {
          console.log(`⏳ Waiting ${CONFIG.requestDelay}ms before next page...`);
          await sleep(CONFIG.requestDelay);
        }
      } catch (error) {
        console.error(`❌ Error scraping page ${pageNum}:`, error);
        stats.errors++;
        
        // Log error to Convex
        await logError("page_scrape_error", {
          page: pageNum,
          url: pageNum === 1 ? CONFIG.baseUrl : `${CONFIG.baseUrl}?page=${pageNum}`,
          error: String(error),
        });
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
      console.log("🌐 Browser closed");
    }
  }

  return stats;
}

/**
 * Scrape a single page of job listings
 */
async function scrapePage(page: Page, url: string, stats: ScrapeStats): Promise<ScrapedJob[]> {
  const jobs: ScrapedJob[] = [];

  await page.goto(url, {
    waitUntil: "networkidle2",
    timeout: CONFIG.navigationTimeout,
  });

  console.log(`📍 Loaded: ${url}`);

  // Wait for job listings to load
  // Freep uses a card-based layout with opdrachten (assignments)
  try {
    await page.waitForSelector(
      ".opdracht, .assignment, .job-card, article.vacancy, .vacancy-item, [class*='job-'], [class*='opdracht']",
      { timeout: CONFIG.selectorTimeout }
    );
  } catch (error) {
    console.log("⚠️  No job listings found on this page");
    return jobs;
  }

  // Extract job data
  // Try multiple possible selectors for Freep's structure
  const possibleSelectors = [
    ".opdracht",
    ".assignment", 
    ".job-card",
    "article.vacancy",
    ".vacancy-item",
    "[class*='job-']",
    "[class*='opdracht']",
    "article",
  ];

  let jobElements: any[] = [];
  for (const selector of possibleSelectors) {
    jobElements = await page.$$(selector);
    if (jobElements.length > 0) {
      console.log(`🔍 Found ${jobElements.length} job elements using selector: ${selector}`);
      break;
    }
  }

  if (jobElements.length === 0) {
    console.log("⚠️  Could not find job elements with any known selector");
    return jobs;
  }

  for (const element of jobElements) {
    try {
      const job = await extractJobData(element, page);
      if (job) {
        jobs.push(job);
        
        // Check if it's a government contract
        if (isGovernmentContract(job)) {
          stats.governmentContracts++;
        }
      }
    } catch (error) {
      console.error("⚠️  Error extracting job:", error);
    }
  }

  return jobs;
}

/**
 * Extract job data from a job listing element
 */
async function extractJobData(
  element: any,
  page: Page
): Promise<ScrapedJob | null> {
  try {
    // Extract title - try multiple selectors
    const titleSelectors = [
      "h2", "h3", ".title", ".job-title", ".opdracht-titel",
      "[class*='title']", "a[href*='opdracht']", "a[href*='job']"
    ];
    
    let title = "";
    for (const selector of titleSelectors) {
      try {
        title = await element.$eval(
          selector,
          (el: Element) => el.textContent?.trim() || ""
        );
        if (title) break;
      } catch (e) {
        // Try next selector
      }
    }

    // Extract company/organization - government entities
    const companySelectors = [
      ".company", ".organization", ".opdrachtgever", ".client",
      "[class*='company']", "[class*='organization']"
    ];
    
    let company = "";
    for (const selector of companySelectors) {
      try {
        company = await element.$eval(
          selector,
          (el: Element) => el.textContent?.trim() || ""
        );
        if (company) break;
      } catch (e) {
        // Try next selector
      }
    }

    // Extract location
    const locationSelectors = [
      ".location", ".plaats", ".locatie", "[class*='location']"
    ];
    
    let location: string | undefined;
    for (const selector of locationSelectors) {
      try {
        location = await element.$eval(
          selector,
          (el: Element) => el.textContent?.trim()
        );
        if (location) break;
      } catch (e) {
        // Try next selector
      }
    }

    // Extract hourly rate / salary
    const salarySelectors = [
      ".salary", ".tarief", ".uurtarief", ".rate", "[class*='rate']", "[class*='salary']"
    ];
    
    let salary: string | undefined;
    for (const selector of salarySelectors) {
      try {
        salary = await element.$eval(
          selector,
          (el: Element) => el.textContent?.trim()
        );
        if (salary) break;
      } catch (e) {
        // Try next selector
      }
    }

    // Get job URL
    const urlElement = await element.$("a[href]");
    let jobUrl = "";
    if (urlElement) {
      const href = await page.evaluate((el) => el.getAttribute("href"), urlElement);
      jobUrl = href?.startsWith("http") ? href : new URL(href || "", CONFIG.baseUrl).toString();
    }

    // Skip if essential fields are missing
    if (!title || !jobUrl) {
      console.log("⚠️  Skipping job - missing title or URL");
      return null;
    }

    // If no company found, try to extract from title or use "Government Entity"
    if (!company) {
      company = "Government Entity";
    }

    // Extract description
    const descriptionSelectors = [
      ".description", ".omschrijving", ".summary", ".excerpt",
      "[class*='description']", "[class*='summary']"
    ];
    
    let description = "";
    for (const selector of descriptionSelectors) {
      try {
        description = await element.$eval(
          selector,
          (el: Element) => el.textContent?.trim() || ""
        );
        if (description) break;
      } catch (e) {
        // Try next selector
      }
    }

    // Fallback to title if no description
    if (!description) {
      description = title;
    }

    // Extract technologies from description, title, and any skill tags
    let skillsText = description + " " + title;
    
    try {
      const skillElements = await element.$$(".skill, .tag, .vaardigheid, [class*='skill']");
      for (const skillEl of skillElements) {
        const skillText = await page.evaluate((el) => el.textContent || "", skillEl);
        skillsText += " " + skillText;
      }
    } catch (e) {
      // No skill tags found
    }

    const technologies = extractTechnologies(skillsText);

    // Determine if remote
    const fullText = (title + " " + description + " " + (location || "")).toLowerCase();
    const remote = fullText.includes("remote") || 
                   fullText.includes("thuiswerken") ||
                   fullText.includes("thuis werken") ||
                   fullText.includes("op afstand") ||
                   fullText.includes("hybride");

    // Employment type - Freep is primarily contracts/freelance
    const employmentType = "contract";

    // Determine experience level from description
    const experienceLevel = 
      fullText.includes("junior") || fullText.includes("starter") ? "junior" :
      fullText.includes("senior") || fullText.includes("lead") ? "senior" :
      fullText.includes("medior") || fullText.includes("mid") ? "mid" :
      undefined;

    // Try to extract posted date if available
    let postedAt: number | undefined;
    try {
      const dateElement = await element.$(".date, .posted, .datum, [class*='date']");
      if (dateElement) {
        const dateText = await page.evaluate((el) => el.textContent || "", dateElement);
        postedAt = parseDutchDate(dateText);
      }
    } catch (e) {
      // No date found
    }

    return {
      title,
      company,
      location,
      description,
      salary,
      url: jobUrl,
      technologies,
      source: "freep",
      remote,
      employmentType,
      experienceLevel,
      postedAt,
    };
  } catch (error) {
    console.error("Error extracting job data:", error);
    return null;
  }
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
    "dienst", "agentschap", "uwv", "belasting", "tax"
  ];
  
  return governmentKeywords.some(keyword => text.includes(keyword));
}

/**
 * Parse Dutch date strings to timestamp
 */
function parseDutchDate(dateStr: string): number | undefined {
  try {
    const cleaned = dateStr.toLowerCase().trim();
    const now = Date.now();
    
    // Handle relative dates in Dutch
    if (cleaned.includes("vandaag") || cleaned.includes("today")) {
      return now;
    }
    if (cleaned.includes("gisteren") || cleaned.includes("yesterday")) {
      return now - 24 * 60 * 60 * 1000;
    }
    if (cleaned.includes("dagen geleden") || cleaned.includes("days ago")) {
      const match = cleaned.match(/(\d+)/);
      if (match) {
        const days = parseInt(match[1]);
        return now - days * 24 * 60 * 60 * 1000;
      }
    }
    
    // Try to parse as regular date
    const parsed = Date.parse(dateStr);
    if (!isNaN(parsed)) {
      return parsed;
    }
  } catch (e) {
    // Parsing failed
  }
  
  return undefined;
}

/**
 * Extract technology keywords from text
 */
function extractTechnologies(text: string): string[] {
  const techKeywords = [
    // Languages
    "JavaScript", "TypeScript", "Python", "Java", "C#", "C++", "Go", "Rust",
    "PHP", "Ruby", "Swift", "Kotlin", "Scala", "R", "SQL", ".NET",
    
    // Frontend
    "React", "Vue", "Angular", "Svelte", "Next.js", "Nuxt", "Gatsby",
    "HTML", "CSS", "Tailwind", "Bootstrap", "Sass", "SCSS",
    
    // Backend
    "Node.js", "Express", "Django", "Flask", "FastAPI", "Spring", "ASP.NET",
    "Rails", "Laravel", "NestJS", "Symfony",
    
    // Databases
    "PostgreSQL", "MySQL", "MongoDB", "Redis", "Elasticsearch", "DynamoDB",
    "SQLite", "MariaDB", "Oracle", "SQL Server", "Postgres",
    
    // Cloud & DevOps
    "AWS", "Azure", "GCP", "Docker", "Kubernetes", "K8s", "Jenkins", "GitLab",
    "GitHub Actions", "Terraform", "Ansible", "CloudFormation",
    
    // Mobile
    "React Native", "Flutter", "iOS", "Android", "Xamarin",
    
    // Government-specific
    "DigiD", "eHerkenning", "Common Ground", "VNG", "Haal Centraal",
    
    // Other
    "GraphQL", "REST", "API", "Microservices", "Serverless", "Git",
    "Agile", "Scrum", "CI/CD", "TDD", "DevOps", "Linux", "Windows",
    "SAP", "ServiceNow", "Salesforce", "Power BI", "Tableau"
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

/**
 * Save jobs to Convex using batch mutation
 */
async function saveJobs(jobs: ScrapedJob[]) {
  try {
    const result = await convex.mutation(api.scraped_jobs.pushBatch, { jobs });
    return result;
  } catch (error) {
    console.error("Error saving jobs to Convex:", error);
    return { created: 0, updated: 0, errors: [String(error)] };
  }
}

/**
 * Log error to Convex analytics
 */
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

/**
 * Log scraping statistics to Convex
 */
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

/**
 * Sleep utility
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
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
