/**
 * Cron Task Implementations
 * 
 * Internal actions triggered by cron jobs.
 */

import { internalAction } from "./_generated/server";
import { internal } from "./_generated/api";

/**
 * Scrape ProLinker jobs
 * Triggered every 4 hours by cron
 */
export const scrapeProLinkerJobs = internalAction({
  args: {},
  handler: async (ctx) => {
    console.log("[CRON] Starting ProLinker job scrape...");
    
    try {
      // In production, this would trigger the scraper script
      // For now, we'll just log that it ran
      // The actual scraping can be done via:
      // 1. External service calling the script
      // 2. Serverless function (Vercel/AWS Lambda)
      // 3. GitHub Actions workflow
      
      console.log("[CRON] ProLinker scrape would run here");
      console.log("[CRON] In production, trigger: tsx scripts/scrape-prolinker.ts");
      
      // Get current stats
      const stats = await ctx.runQuery(internal.scraped_jobs.stats, {
        source: "prolinker",
      });
      
      console.log("[CRON] Current ProLinker jobs:", stats);
      
      return {
        success: true,
        message: "Cron job executed (placeholder)",
        stats,
      };
    } catch (error) {
      console.error("[CRON] Error in ProLinker scrape:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },
});

/**
 * Archive old scraped jobs
 * Triggered daily at 3 AM UTC
 */
export const archiveOldScrapedJobs = internalAction({
  args: {},
  handler: async (ctx) => {
    console.log("[CRON] Archiving old scraped jobs...");
    
    try {
      // Archive jobs older than 30 days
      const daysOld = 30;
      const cutoffDate = Date.now() - daysOld * 24 * 60 * 60 * 1000;
      
      const archived = await ctx.runMutation(internal.scraped_jobs.archiveOldJobs, {
        cutoffDate,
      });
      
      console.log(`[CRON] Archived ${archived} jobs older than ${daysOld} days`);
      
      return {
        success: true,
        archived,
        daysOld,
      };
    } catch (error) {
      console.error("[CRON] Error archiving jobs:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },
});

/**
 * Cleanup expired job applications
 * Triggered daily at 4 AM UTC
 */
export const cleanupExpiredJobApplications = internalAction({
  args: {},
  handler: async (ctx) => {
    console.log("[CRON] Cleaning up expired job applications...");
    
    try {
      // Get all job applications
      const applications = await ctx.runQuery(internal.job_applications.list, {});
      
      // Check scraped jobs to see which are still active
      const scrapedJobs = await ctx.runQuery(internal.scraped_jobs.list, {
        archived: false,
      });
      
      const activeJobUrls = new Set(scrapedJobs.map((j: any) => j.url));
      
      // Count applications that could be marked as expired
      let expiredCount = 0;
      for (const app of applications) {
        if (app.url && !activeJobUrls.has(app.url)) {
          // Job no longer exists, could mark as expired
          expiredCount++;
        }
      }
      
      console.log(`[CRON] Found ${expiredCount} potentially expired applications`);
      
      return {
        success: true,
        potentiallyExpired: expiredCount,
        message: "Cleanup check completed",
      };
    } catch (error) {
      console.error("[CRON] Error cleaning up applications:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },
});

// Import internal API
import { api } from "./_generated/api";
