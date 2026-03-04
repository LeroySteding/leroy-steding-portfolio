/**
 * Base Scraper Class
 * 
 * Common functionality for all job scrapers:
 * - Retry logic with exponential backoff
 * - Rate limiting
 * - Error handling
 * - Stats tracking
 */

import puppeteer, { Browser, Page } from "puppeteer";
import type { ScraperConfig, ScraperStats, Job, ScraperHealth } from "./types";

export abstract class BaseScraper {
  protected browser?: Browser;
  protected page?: Page;
  public config: ScraperConfig;
  public stats: ScraperStats;

  constructor(config: Partial<ScraperConfig> & { source: ScraperConfig["source"] }) {
    this.config = {
      maxPages: 5,
      requestDelay: 2000,
      maxRetries: 3,
      retryDelay: 5000,
      navigationTimeout: 60000,
      selectorTimeout: 15000,
      headless: true,
      ...config,
    };

    this.stats = {
      source: config.source,
      startTime: 0,
      jobsFound: 0,
      jobsSaved: 0,
      jobsUpdated: 0,
      errors: 0,
      status: "idle",
    };
  }

  /**
   * Initialize browser and page
   */
  async initialize(): Promise<void> {
    console.log(`🚀 Initializing ${this.config.source} scraper...`);
    
    this.browser = await puppeteer.launch({
      headless: this.config.headless,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-blink-features=AutomationControlled",
      ],
    });

    this.page = await this.browser.newPage();
    
    // Set viewport and user agent
    await this.page.setViewport({ width: 1920, height: 1080 });
    await this.page.setUserAgent(
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    );

    console.log(`✅ ${this.config.source} browser initialized`);
  }

  /**
   * Cleanup browser resources
   */
  async cleanup(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      console.log(`🧹 ${this.config.source} browser closed`);
    }
  }

  /**
   * Sleep for specified milliseconds
   */
  protected async sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Retry wrapper with exponential backoff
   */
  protected async retry<T>(
    fn: () => Promise<T>,
    context: string,
    maxRetries = this.config.maxRetries
  ): Promise<T> {
    let lastError: Error | undefined;
    
    for (let attempt = 1; attempt <= maxRetries!; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error as Error;
        this.stats.errors++;
        
        if (attempt < maxRetries!) {
          const delay = this.config.retryDelay! * Math.pow(2, attempt - 1);
          console.warn(
            `⚠️  ${context} failed (attempt ${attempt}/${maxRetries}), retrying in ${delay}ms...`
          );
          await this.sleep(delay);
        }
      }
    }
    
    throw new Error(
      `${context} failed after ${maxRetries} attempts: ${lastError?.message}`
    );
  }

  /**
   * Navigate to URL with retry logic
   */
  protected async navigateWithRetry(url: string): Promise<void> {
    if (!this.page) throw new Error("Page not initialized");

    await this.retry(
      async () => {
        await this.page!.goto(url, {
          waitUntil: "networkidle2",
          timeout: this.config.navigationTimeout,
        });
      },
      `Navigation to ${url}`,
      this.config.maxRetries
    );

    // Rate limiting
    await this.sleep(this.config.requestDelay!);
  }

  /**
   * Wait for selector with timeout
   */
  protected async waitForSelector(
    selector: string,
    options?: { timeout?: number }
  ): Promise<void> {
    if (!this.page) throw new Error("Page not initialized");

    await this.page.waitForSelector(selector, {
      timeout: options?.timeout || this.config.selectorTimeout,
    });
  }

  /**
   * Extract text content safely
   */
  protected async getText(selector: string): Promise<string | undefined> {
    if (!this.page) return undefined;

    try {
      const element = await this.page.$(selector);
      if (!element) return undefined;
      
      const text = await this.page.evaluate((el) => el.textContent?.trim(), element);
      return text || undefined;
    } catch {
      return undefined;
    }
  }

  /**
   * Extract multiple text elements
   */
  protected async getTextAll(selector: string): Promise<string[]> {
    if (!this.page) return [];

    try {
      const elements = await this.page.$$(selector);
      const texts = await Promise.all(
        elements.map((el) =>
          this.page!.evaluate((e) => e.textContent?.trim(), el)
        )
      );
      return texts.filter((t): t is string => !!t);
    } catch {
      return [];
    }
  }

  /**
   * Extract technology keywords from text
   */
  protected extractTechnologies(text: string): string[] {
    const techKeywords = [
      // Languages
      "JavaScript", "TypeScript", "Python", "Java", "C#", "C++", "Go", "Rust",
      "Ruby", "PHP", "Swift", "Kotlin", "Scala", "Elixir", "Clojure",
      
      // Frontend
      "React", "Vue", "Angular", "Svelte", "Next.js", "Nuxt", "Gatsby",
      "HTML", "CSS", "Tailwind", "SCSS", "SASS",
      
      // Backend
      "Node.js", "Express", "Django", "Flask", "FastAPI", "Spring", "Laravel",
      "Rails", "ASP.NET", "Nest.js",
      
      // Databases
      "PostgreSQL", "MySQL", "MongoDB", "Redis", "Elasticsearch", "DynamoDB",
      "Cassandra", "Neo4j",
      
      // Cloud/DevOps
      "AWS", "Azure", "GCP", "Docker", "Kubernetes", "Terraform", "Jenkins",
      "CircleCI", "GitHub Actions",
      
      // Mobile
      "React Native", "Flutter", "iOS", "Android",
      
      // Other
      "GraphQL", "REST", "API", "Git", "Linux", "Agile", "Scrum",
    ];

    const found = new Set<string>();
    const lowerText = text.toLowerCase();

    for (const tech of techKeywords) {
      if (lowerText.includes(tech.toLowerCase())) {
        found.add(tech);
      }
    }

    return Array.from(found);
  }

  /**
   * Abstract method - must be implemented by each scraper
   */
  abstract scrape(): Promise<Job[]>;

  /**
   * Health check - can be overridden by specific scrapers
   */
  async healthCheck(): Promise<ScraperHealth> {
    return {
      source: this.config.source,
      healthy: this.stats.status !== "failed",
      lastRun: this.stats.endTime,
      consecutiveFailures: 0,
      totalRuns: 0,
      successRate: 0,
      averageJobsPerRun: 0,
    };
  }
}
