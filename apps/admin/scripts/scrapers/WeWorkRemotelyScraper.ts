/**
 * WeWorkRemotely Job Scraper
 * 
 * Scrapes remote jobs from weworkremotely.com
 */

import { BaseScraper } from "./BaseScraper";
import type { Job } from "./types";

export class WeWorkRemotelyScraper extends BaseScraper {
  constructor() {
    super({
      source: "weworkremotely",
      baseUrl: "https://weworkremotely.com/categories/remote-programming-jobs",
      maxPages: 3, // They have fewer jobs per page
      requestDelay: 2000,
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
      console.log(`🔍 Starting WeWorkRemotely scrape...`);

      for (let page = 1; page <= this.config.maxPages!; page++) {
        const url = page === 1 
          ? this.config.baseUrl
          : `${this.config.baseUrl}?page=${page}`;
        
        console.log(`📄 Scraping page ${page}: ${url}`);

        try {
          await this.navigateWithRetry(url);

          // Wait for job listings
          await this.waitForSelector("section.jobs", {
            timeout: this.config.selectorTimeout,
          });

          const pageJobs = await this.scrapeJobsFromPage();
          jobs.push(...pageJobs);

          console.log(`  ✅ Found ${pageJobs.length} jobs on page ${page}`);

          // Check if there's a next page
          const hasNextPage = await this.page!.evaluate(() => {
            const nextLink = document.querySelector('a[rel="next"]');
            return nextLink !== null;
          });

          if (!hasNextPage) {
            console.log("  ℹ️  No more pages, stopping");
            break;
          }
        } catch (error) {
          console.error(`❌ Error on page ${page}:`, error);
          this.stats.errors++;
          
          // Continue to next page
          continue;
        }
      }

      this.stats.status = "success";
      this.stats.endTime = Date.now();
      
      console.log(`✨ WeWorkRemotely scrape complete!`);
      console.log(`   Jobs found: ${this.stats.jobsFound}`);
      console.log(`   Errors: ${this.stats.errors}`);

      return jobs;
    } catch (error) {
      this.stats.status = "failed";
      this.stats.endTime = Date.now();
      this.stats.lastError = error instanceof Error ? error.message : "Unknown error";
      
      console.error(`❌ WeWorkRemotely scrape failed:`, error);
      throw error;
    }
  }

  private async scrapeJobsFromPage(): Promise<Job[]> {
    if (!this.page) return [];

    const jobs: Job[] = [];

    // Get all job listings
    const jobElements = await this.page.$$("li.feature, section.jobs li");

    console.log(`  🔍 Processing ${jobElements.length} job listings...`);

    for (const element of jobElements) {
      try {
        const job = await this.extractJobFromElement(element);
        if (job) {
          jobs.push(job);
          this.stats.jobsFound++;
        }
      } catch (error) {
        // Skip individual job errors
        this.stats.errors++;
      }
    }

    return jobs;
  }

  private async extractJobFromElement(element: any): Promise<Job | null> {
    if (!this.page) return null;

    try {
      const data = await this.page.evaluate((el) => {
        const getText = (selector: string): string | undefined => {
          const elem = el.querySelector(selector);
          return elem?.textContent?.trim() || undefined;
        };

        const getAttr = (selector: string, attr: string): string | undefined => {
          const elem = el.querySelector(selector);
          return elem?.getAttribute(attr) || undefined;
        };

        // WeWorkRemotely structure
        const title = getText(".title");
        const company = getText(".company");
        const region = getText(".region");
        
        // Get job URL
        const link = el.querySelector("a");
        const href = link?.getAttribute("href");
        const url = href ? `https://weworkremotely.com${href}` : undefined;

        return {
          title,
          company,
          region,
          url,
        };
      }, element);

      // Validate required fields
      if (!data.title || !data.company || !data.url) {
        return null;
      }

      // Extract technologies from title (WeWorkRemotely puts tech in title often)
      const technologies = this.extractTechnologies(data.title);

      return {
        title: data.title,
        company: data.company,
        location: data.region || "Remote",
        description: `${data.title} at ${data.company}`,
        url: data.url,
        technologies,
        source: "weworkremotely",
        remote: true,
        employmentType: "Full-time",
        scrapedAt: Date.now(),
      };
    } catch (error) {
      return null;
    }
  }
}
