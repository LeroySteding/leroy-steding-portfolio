/**
 * Scraper Utilities - DRY error handling for all scrapers
 * Eliminates duplicate error handling code
 */

import { internal } from "./_generated/api";

export interface ScraperResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  duration: number;
  jobsFound: number;
}

export class ScraperExecutor {
  constructor(
    private ctx: any,
    private scraperName: string
  ) {}

  /**
   * Execute scraper with automatic error handling, logging, and alerting
   */
  async execute<T>(
    scraperFn: () => Promise<T>
  ): Promise<ScraperResult<T>> {
    const startTime = Date.now();
    
    try {
      console.log(`[${this.scraperName}] Starting scrape...`);
      
      const data = await scraperFn();
      const duration = Date.now() - startTime;
      const jobsFound = Array.isArray(data) ? data.length : 0;
      
      // Log success
      await this.logSuccess({ jobsFound, duration });
      
      console.log(`[${this.scraperName}] Success: ${jobsFound} jobs in ${duration}ms`);
      
      return {
        success: true,
        data,
        duration,
        jobsFound,
      };
      
    } catch (error: any) {
      const duration = Date.now() - startTime;
      const errorMessage = error?.message || String(error);
      
      // Log failure
      await this.logFailure({ error: errorMessage, duration });
      
      // Alert in feed
      await this.alertFeed({
        title: `⚠️ ${this.scraperName} Scraper Failed`,
        content: `Error: ${errorMessage}\nDuration: ${duration}ms`,
        error: errorMessage,
      });
      
      console.error(`[${this.scraperName}] Failed:`, errorMessage);
      
      return {
        success: false,
        error: errorMessage,
        duration,
        jobsFound: 0,
      };
    }
  }

  private async logSuccess(data: { jobsFound: number; duration: number }) {
    const logFunctionName = `${this.getScraperModule()}:logTrigger`;
    
    try {
      await this.ctx.runMutation(
        internal[this.getScraperModule()].logTrigger,
        {
          success: true,
          jobsFound: data.jobsFound,
          duration: data.duration,
          error: null,
          timestamp: Date.now(),
        }
      );
    } catch (e) {
      console.warn(`[${this.scraperName}] Failed to log success:`, e);
    }
  }

  private async logFailure(data: { error: string; duration: number }) {
    const logFunctionName = `${this.getScraperModule()}:logTrigger`;
    
    try {
      await this.ctx.runMutation(
        internal[this.getScraperModule()].logTrigger,
        {
          success: false,
          jobsFound: 0,
          duration: data.duration,
          error: data.error,
          timestamp: Date.now(),
        }
      );
    } catch (e) {
      console.warn(`[${this.scraperName}] Failed to log failure:`, e);
    }
  }

  private async alertFeed(data: {
    title: string;
    content: string;
    error: string;
  }) {
    try {
      await this.ctx.runMutation(internal.agent_feed.push, {
        title: data.title,
        content: data.content,
        type: "alert",
        source: this.scraperName.toLowerCase().replace(/\s+/g, "-"),
        priority: "high",
        read: false,
        tags: ["scraper", "error", this.scraperName.toLowerCase()],
        createdAt: Date.now(),
        metadata: {
          scraper: this.scraperName,
          error: data.error,
        },
      });
    } catch (e) {
      console.error(`[${this.scraperName}] Failed to post to feed:`, e);
    }
  }

  private getScraperModule(): string {
    // Convert "ProLinker" -> "prolinker_scraper"
    return this.scraperName.toLowerCase().replace(/\s+/g, "") + "_scraper";
  }
}

/**
 * Retry wrapper for network-sensitive operations
 */
export async function withRetry<T>(
  operation: () => Promise<T>,
  options: {
    maxRetries?: number;
    delayMs?: number;
    backoff?: boolean;
  } = {}
): Promise<T> {
  const maxRetries = options.maxRetries || 3;
  const baseDelay = options.delayMs || 1000;
  const useBackoff = options.backoff !== false;
  
  let lastError: Error | undefined;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error: any) {
      lastError = error;
      
      // Don't retry if not a retryable error
      if (!isRetryableError(error)) {
        throw error;
      }
      
      // Don't retry if this was the last attempt
      if (attempt === maxRetries) {
        throw error;
      }
      
      // Calculate delay with exponential backoff
      const delay = useBackoff
        ? baseDelay * Math.pow(2, attempt)
        : baseDelay;
      
      console.log(
        `Retry attempt ${attempt + 1}/${maxRetries} after ${delay}ms...`
      );
      
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
}

function isRetryableError(error: any): boolean {
  const message = error?.message?.toLowerCase() || "";
  
  return (
    message.includes("timeout") ||
    message.includes("econnrefused") ||
    message.includes("enotfound") ||
    message.includes("rate limit") ||
    message.includes("429") ||
    message.includes("503") ||
    message.includes("network")
  );
}
