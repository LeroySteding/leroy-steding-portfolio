/**
 * RemoteOK Job Scraper
 * 
 * Scrapes remote jobs from remoteok.io
 * Uses their JSON API endpoint for reliable data.
 */

import { BaseScraper } from "./BaseScraper";
import type { Job } from "./types";

interface RemoteOKJob {
  id: string;
  slug: string;
  position: string;
  company: string;
  company_logo?: string;
  location?: string;
  tags?: string[];
  description?: string;
  salary_min?: number;
  salary_max?: number;
  url: string;
  date: string;
}

export class RemoteOKScraper extends BaseScraper {
  constructor() {
    super({
      source: "remoteok",
      baseUrl: "https://remoteok.io/api",
      requestDelay: 1000, // API, so can be faster
      maxRetries: 3,
    });
  }

  async scrape(): Promise<Job[]> {
    this.stats.status = "running";
    this.stats.startTime = Date.now();
    const jobs: Job[] = [];

    try {
      console.log(`🔍 Starting RemoteOK scrape...`);

      // RemoteOK has a public JSON API
      const response = await fetch(this.config.baseUrl);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = (await response.json()) as RemoteOKJob[];
      
      // First item is metadata, skip it
      const jobListings = data.slice(1);
      
      console.log(`📄 Found ${jobListings.length} jobs from RemoteOK API`);

      for (const remoteJob of jobListings) {
        try {
          const job = this.transformJob(remoteJob);
          if (job) {
            jobs.push(job);
            this.stats.jobsFound++;
          }
        } catch (error) {
          console.warn(`⚠️  Error transforming job ${remoteJob.slug}:`, error);
          this.stats.errors++;
        }
      }

      this.stats.status = "success";
      this.stats.endTime = Date.now();
      
      console.log(`✨ RemoteOK scrape complete!`);
      console.log(`   Jobs found: ${this.stats.jobsFound}`);
      console.log(`   Errors: ${this.stats.errors}`);

      return jobs;
    } catch (error) {
      this.stats.status = "failed";
      this.stats.endTime = Date.now();
      this.stats.lastError = error instanceof Error ? error.message : "Unknown error";
      
      console.error(`❌ RemoteOK scrape failed:`, error);
      throw error;
    }
  }

  private transformJob(remoteJob: RemoteOKJob): Job | null {
    if (!remoteJob.position || !remoteJob.company || !remoteJob.url) {
      return null;
    }

    // Extract technologies from tags and description
    const technologies = new Set<string>();
    
    if (remoteJob.tags) {
      // RemoteOK tags are already tech-focused
      for (const tag of remoteJob.tags) {
        technologies.add(tag);
      }
    }

    // Also extract from description if available
    if (remoteJob.description) {
      const extracted = this.extractTechnologies(remoteJob.description);
      for (const tech of extracted) {
        technologies.add(tech);
      }
    }

    // Salary formatting
    let salary: string | undefined;
    if (remoteJob.salary_min || remoteJob.salary_max) {
      const min = remoteJob.salary_min 
        ? `$${remoteJob.salary_min.toLocaleString()}`
        : "";
      const max = remoteJob.salary_max 
        ? `$${remoteJob.salary_max.toLocaleString()}`
        : "";
      
      if (min && max) {
        salary = `${min} - ${max}`;
      } else {
        salary = min || max;
      }
    }

    // Parse date
    let postedAt: number | undefined;
    try {
      postedAt = new Date(remoteJob.date).getTime();
    } catch {
      postedAt = undefined;
    }

    return {
      title: remoteJob.position,
      company: remoteJob.company,
      location: remoteJob.location || "Remote",
      description: remoteJob.description || `Position: ${remoteJob.position} at ${remoteJob.company}`,
      salary,
      url: remoteJob.url,
      technologies: Array.from(technologies),
      postedAt,
      source: "remoteok",
      remote: true, // RemoteOK is remote-only
      employmentType: "Full-time", // Default
      scrapedAt: Date.now(),
    };
  }

  // Override initialize - we don't need a browser for API access
  async initialize(): Promise<void> {
    console.log(`🚀 Initializing RemoteOK scraper (API mode)...`);
    this.stats.status = "idle";
    console.log(`✅ RemoteOK scraper ready`);
  }

  // Override cleanup - no browser to close
  async cleanup(): Promise<void> {
    console.log(`🧹 RemoteOK scraper cleanup complete`);
  }
}
