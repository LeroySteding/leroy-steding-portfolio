/**
 * Indeed Netherlands Job Scraper
 * 
 * Scrapes job listings from indeed.nl
 */

import { BaseScraper } from "./BaseScraper";
import type { Job } from "./types";

export class IndeedScraper extends BaseScraper {
  constructor() {
    super({
      source: "indeed",
      baseUrl: "https://nl.indeed.com/jobs",
      maxPages: 5,
      requestDelay: 3000, // Be respectful
      maxRetries: 3,
      navigationTimeout: 60000,
      selectorTimeout: 15000,
      headless: true,
    });
  }

  async scrape(): Promise<Job[]> {
    this.stats.status = "running";
    this.stats.startTime = Date.now();
    const jobs: Job[] = [];

    try {
      console.log(`🔍 Starting Indeed NL scrape...`);

      // Build search URL (search for tech jobs in Netherlands)
      const searchParams = new URLSearchParams({
        q: "developer OR engineer OR programmer", // Tech-focused
        l: "Nederland", // Netherlands
        sort: "date", // Most recent first
      });

      for (let page = 0; page < this.config.maxPages!; page++) {
        const pageParams = new URLSearchParams(searchParams);
        pageParams.set("start", (page * 10).toString()); // Indeed uses pagination by 10s
        
        const url = `${this.config.baseUrl}?${pageParams.toString()}`;
        console.log(`📄 Scraping page ${page + 1}: ${url}`);

        try {
          await this.navigateWithRetry(url);

          // Wait for job cards to load
          await this.waitForSelector(".job_seen_beacon, .jobsearch-ResultsList", {
            timeout: this.config.selectorTimeout,
          });

          const pageJobs = await this.scrapeJobsFromPage();
          jobs.push(...pageJobs);

          console.log(`  ✅ Found ${pageJobs.length} jobs on page ${page + 1}`);

          // Check if there are more pages
          const hasNextPage = await this.page!.evaluate(() => {
            const nextButton = document.querySelector('a[data-testid="pagination-page-next"]');
            return nextButton !== null;
          });

          if (!hasNextPage) {
            console.log("  ℹ️  No more pages, stopping");
            break;
          }
        } catch (error) {
          console.error(`❌ Error on page ${page + 1}:`, error);
          this.stats.errors++;
          
          // Continue to next page instead of failing completely
          continue;
        }
      }

      this.stats.status = "success";
      this.stats.endTime = Date.now();
      
      console.log(`✨ Indeed NL scrape complete!`);
      console.log(`   Jobs found: ${this.stats.jobsFound}`);
      console.log(`   Errors: ${this.stats.errors}`);

      return jobs;
    } catch (error) {
      this.stats.status = "failed";
      this.stats.endTime = Date.now();
      this.stats.lastError = error instanceof Error ? error.message : "Unknown error";
      
      console.error(`❌ Indeed NL scrape failed:`, error);
      throw error;
    }
  }

  private async scrapeJobsFromPage(): Promise<Job[]> {
    if (!this.page) return [];

    const jobs: Job[] = [];

    // Get all job cards on the page
    const jobCards = await this.page.$$(".job_seen_beacon, .jobsearch-ResultsList > li");

    console.log(`  🔍 Processing ${jobCards.length} job cards...`);

    for (const card of jobCards) {
      try {
        const job = await this.extractJobFromCard(card);
        if (job) {
          jobs.push(job);
          this.stats.jobsFound++;
        }
      } catch (error) {
        // Skip individual job errors, continue with others
        this.stats.errors++;
      }
    }

    return jobs;
  }

  private async extractJobFromCard(card: any): Promise<Job | null> {
    if (!this.page) return null;

    try {
      const data = await this.page.evaluate((element) => {
        // Helper to get text safely
        const getText = (selector: string): string | undefined => {
          const el = element.querySelector(selector);
          return el?.textContent?.trim() || undefined;
        };

        // Helper to get attribute safely
        const getAttr = (selector: string, attr: string): string | undefined => {
          const el = element.querySelector(selector);
          return el?.getAttribute(attr) || undefined;
        };

        // Extract job data
        const title = getText("h2.jobTitle span") || getText("h2.jobTitle");
        const company = getText(".companyName");
        const location = getText(".companyLocation");
        const salary = getText(".salary-snippet");
        
        // Get job URL
        const jobKey = getAttr("h2.jobTitle a", "data-jk") || getAttr("a.jcs-JobTitle", "data-jk");
        const url = jobKey ? `https://nl.indeed.com/viewjob?jk=${jobKey}` : undefined;

        // Get snippet (short description)
        const snippet = getText(".job-snippet");

        // Get posted date
        const dateText = getText(".date");

        return {
          title,
          company,
          location,
          salary,
          url,
          snippet,
          dateText,
        };
      }, card);

      // Validate required fields
      if (!data.title || !data.company || !data.url) {
        return null;
      }

      // Extract technologies from snippet
      const technologies = data.snippet 
        ? this.extractTechnologies(data.snippet)
        : [];

      // Parse date
      let postedAt: number | undefined;
      if (data.dateText) {
        postedAt = this.parseIndeedDate(data.dateText);
      }

      return {
        title: data.title,
        company: data.company,
        location: data.location,
        description: data.snippet || `${data.title} at ${data.company}`,
        salary: data.salary,
        url: data.url,
        technologies,
        postedAt,
        source: "indeed",
        remote: data.location?.toLowerCase().includes("remote"),
        scrapedAt: Date.now(),
      };
    } catch (error) {
      return null;
    }
  }

  private parseIndeedDate(dateText: string): number | undefined {
    const now = Date.now();
    const lowerDate = dateText.toLowerCase();

    // "Posted today" or "Vandaag geplaatst"
    if (lowerDate.includes("today") || lowerDate.includes("vandaag")) {
      return now;
    }

    // "Posted X days ago" or "X dagen geleden"
    const daysMatch = lowerDate.match(/(\d+)\s*(day|dagen)/);
    if (daysMatch) {
      const days = parseInt(daysMatch[1]);
      return now - days * 24 * 60 * 60 * 1000;
    }

    // "Posted X hours ago" or "X uur geleden"
    const hoursMatch = lowerDate.match(/(\d+)\s*(hour|uur)/);
    if (hoursMatch) {
      const hours = parseInt(hoursMatch[1]);
      return now - hours * 60 * 60 * 1000;
    }

    // Default to now if we can't parse
    return now;
  }
}
