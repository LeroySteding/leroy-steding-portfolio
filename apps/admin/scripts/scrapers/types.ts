/**
 * Unified Job Scraper Types
 * 
 * Common interfaces for multi-source job scrapers.
 */

export interface Job {
  title: string;
  company: string;
  location?: string;
  description: string;
  salary?: string;
  url: string;
  technologies: string[];
  postedAt?: number;
  source: JobSource;
  remote?: boolean;
  employmentType?: string;
  experienceLevel?: string;
  scrapedAt: number;
}

export type JobSource = 
  | "indeed"
  | "linkedin"
  | "glassdoor"
  | "remoteok"
  | "weworkremotely"
  | "adzuna"
  | "prolinker";

export interface ScraperConfig {
  source: JobSource;
  baseUrl: string;
  maxPages?: number;
  requestDelay?: number;
  maxRetries?: number;
  retryDelay?: number;
  navigationTimeout?: number;
  selectorTimeout?: number;
  headless?: boolean;
}

export interface ScraperStats {
  source: JobSource;
  startTime: number;
  endTime?: number;
  jobsFound: number;
  jobsSaved: number;
  jobsUpdated: number;
  errors: number;
  status: "idle" | "running" | "success" | "failed";
  lastError?: string;
}

export interface ScraperHealth {
  source: JobSource;
  healthy: boolean;
  lastRun?: number;
  lastSuccess?: number;
  consecutiveFailures: number;
  totalRuns: number;
  successRate: number;
  averageJobsPerRun: number;
}

export interface BaseScraper {
  config: ScraperConfig;
  stats: ScraperStats;
  
  // Core methods
  initialize(): Promise<void>;
  scrape(): Promise<Job[]>;
  cleanup(): Promise<void>;
  
  // Health check
  healthCheck(): Promise<ScraperHealth>;
}
