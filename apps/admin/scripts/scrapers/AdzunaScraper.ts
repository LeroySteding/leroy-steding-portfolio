/**
 * Adzuna Job API Fetcher
 * 
 * Fetches jobs from Adzuna API for Netherlands.
 * Focuses on fullstack, React, and TypeScript positions.
 * 
 * API Docs: https://developer.adzuna.com/overview
 */

import { BaseScraper } from "./BaseScraper";
import type { Job } from "./types";

interface AdzunaJob {
  id: string;
  title: string;
  company: {
    display_name: string;
  };
  location: {
    display_name: string;
    area?: string[];
  };
  description: string;
  salary_min?: number;
  salary_max?: number;
  salary_is_predicted?: string;
  redirect_url: string;
  created: string;
  category?: {
    label?: string;
  };
  contract_type?: string;
  contract_time?: string;
}

interface AdzunaResponse {
  results: AdzunaJob[];
  count: number;
  mean?: number;
}

export class AdzunaScraper extends BaseScraper {
  private readonly apiId: string;
  private readonly apiKey: string;
  private readonly country = "nl"; // Netherlands

  constructor() {
    super({
      source: "adzuna",
      baseUrl: "https://api.adzuna.com/v1/api/jobs",
      requestDelay: 1000, // API can handle faster requests
      maxRetries: 3,
    });

    // Get API credentials from environment
    this.apiId = process.env.ADZUNA_APP_ID || "";
    this.apiKey = process.env.ADZUNA_API_KEY || "";

    if (!this.apiId || !this.apiKey) {
      console.warn("⚠️  ADZUNA_APP_ID and ADZUNA_API_KEY not set");
      console.warn("   Get free API key at: https://developer.adzuna.com/");
    }
  }

  async scrape(): Promise<Job[]> {
    this.stats.status = "running";
    this.stats.startTime = Date.now();
    const jobs: Job[] = [];

    if (!this.apiId || !this.apiKey) {
      this.stats.status = "failed";
      this.stats.lastError = "Missing API credentials";
      throw new Error("ADZUNA_APP_ID and ADZUNA_API_KEY required");
    }

    try {
      console.log(`🔍 Starting Adzuna NL API fetch...`);

      // Search queries for relevant tech jobs
      const searchQueries = [
        "fullstack developer",
        "react developer",
        "typescript developer",
        "frontend developer react",
        "backend developer typescript",
        "full stack engineer",
      ];

      for (const query of searchQueries) {
        console.log(`  📋 Searching: "${query}"...`);

        try {
          const queryJobs = await this.fetchJobsForQuery(query);
          jobs.push(...queryJobs);
          
          console.log(`    Found ${queryJobs.length} jobs`);
          
          // Rate limiting between queries
          await this.sleep(this.config.requestDelay!);
        } catch (error) {
          console.error(`    ❌ Error fetching "${query}":`, error);
          this.stats.errors++;
        }
      }

      // Deduplicate by URL (same job may appear in multiple queries)
      const uniqueJobs = this.deduplicateJobs(jobs);

      this.stats.jobsFound = uniqueJobs.length;
      this.stats.status = "success";
      this.stats.endTime = Date.now();
      
      console.log(`✨ Adzuna NL fetch complete!`);
      console.log(`   Total jobs found: ${jobs.length}`);
      console.log(`   Unique jobs: ${uniqueJobs.length}`);
      console.log(`   Errors: ${this.stats.errors}`);

      return uniqueJobs;
    } catch (error) {
      this.stats.status = "failed";
      this.stats.endTime = Date.now();
      this.stats.lastError = error instanceof Error ? error.message : "Unknown error";
      
      console.error(`❌ Adzuna NL fetch failed:`, error);
      throw error;
    }
  }

  private async fetchJobsForQuery(query: string, page = 1): Promise<Job[]> {
    const jobs: Job[] = [];

    // Build API URL
    const params = new URLSearchParams({
      app_id: this.apiId,
      app_key: this.apiKey,
      results_per_page: "50", // Max results per request
      what: query,
      where: "nederland", // Netherlands
    });

    const url = `${this.config.baseUrl}/${this.country}/search/${page}?${params.toString()}`;

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = (await response.json()) as AdzunaResponse;

      if (!data.results || data.results.length === 0) {
        return jobs;
      }

      // Transform Adzuna jobs to our Job interface
      for (const adzunaJob of data.results) {
        const job = this.transformJob(adzunaJob);
        if (job) {
          jobs.push(job);
        }
      }

      return jobs;
    } catch (error) {
      console.error(`  ⚠️  Error fetching page ${page}:`, error);
      throw error;
    }
  }

  private transformJob(adzunaJob: AdzunaJob): Job | null {
    // Validate required fields
    if (!adzunaJob.title || !adzunaJob.company?.display_name || !adzunaJob.redirect_url) {
      return null;
    }

    // Extract technologies from title and description
    const technologies = new Set<string>();
    
    // From title
    const titleTech = this.extractTechnologies(adzunaJob.title);
    for (const tech of titleTech) {
      technologies.add(tech);
    }

    // From description
    const descTech = this.extractTechnologies(adzunaJob.description);
    for (const tech of descTech) {
      technologies.add(tech);
    }

    // Format salary
    let salary: string | undefined;
    if (adzunaJob.salary_min || adzunaJob.salary_max) {
      const min = adzunaJob.salary_min 
        ? `€${Math.round(adzunaJob.salary_min).toLocaleString()}`
        : "";
      const max = adzunaJob.salary_max 
        ? `€${Math.round(adzunaJob.salary_max).toLocaleString()}`
        : "";
      
      if (min && max) {
        salary = `${min} - ${max}`;
      } else {
        salary = min || max;
      }

      if (adzunaJob.salary_is_predicted === "1") {
        salary += " (estimated)";
      }
    }

    // Parse posted date
    let postedAt: number | undefined;
    try {
      postedAt = new Date(adzunaJob.created).getTime();
    } catch {
      postedAt = undefined;
    }

    // Determine if remote
    const locationText = adzunaJob.location.display_name.toLowerCase();
    const descLower = adzunaJob.description.toLowerCase();
    const remote = 
      locationText.includes("remote") || 
      locationText.includes("thuiswerk") ||
      descLower.includes("remote") ||
      descLower.includes("work from home") ||
      descLower.includes("thuiswerken");

    // Determine employment type
    let employmentType: string | undefined;
    if (adzunaJob.contract_type) {
      employmentType = adzunaJob.contract_type;
    } else if (adzunaJob.contract_time) {
      employmentType = adzunaJob.contract_time;
    } else {
      // Try to extract from description
      const desc = adzunaJob.description.toLowerCase();
      if (desc.includes("full-time") || desc.includes("fulltime")) {
        employmentType = "Full-time";
      } else if (desc.includes("part-time") || desc.includes("parttime")) {
        employmentType = "Part-time";
      } else if (desc.includes("contract")) {
        employmentType = "Contract";
      }
    }

    return {
      title: adzunaJob.title,
      company: adzunaJob.company.display_name,
      location: adzunaJob.location.display_name,
      description: adzunaJob.description,
      salary,
      url: adzunaJob.redirect_url,
      technologies: Array.from(technologies),
      postedAt,
      source: "adzuna",
      remote,
      employmentType,
      scrapedAt: Date.now(),
    };
  }

  private deduplicateJobs(jobs: Job[]): Job[] {
    const seen = new Set<string>();
    const unique: Job[] = [];

    for (const job of jobs) {
      if (!seen.has(job.url)) {
        seen.add(job.url);
        unique.push(job);
      }
    }

    return unique;
  }

  // Override initialize - we don't need a browser for API access
  async initialize(): Promise<void> {
    console.log(`🚀 Initializing Adzuna NL scraper (API mode)...`);
    
    if (!this.apiId || !this.apiKey) {
      console.warn("⚠️  Missing API credentials");
    }
    
    this.stats.status = "idle";
    console.log(`✅ Adzuna NL scraper ready`);
  }

  // Override cleanup - no browser to close
  async cleanup(): Promise<void> {
    console.log(`🧹 Adzuna NL scraper cleanup complete`);
  }
}
