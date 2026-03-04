/**
 * Cron Task Implementations
 * 
 * Internal actions triggered by cron jobs with robust error handling.
 */

import { internalAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { ScraperExecutor } from "./_scraper_utils";

/**
 * Scrape ProLinker jobs
 * Triggered every 4 hours by cron
 */
export const scrapeProLinkerJobs = internalAction({
  args: {},
  handler: async (ctx): Promise<any> => {
    const executor = new ScraperExecutor(ctx, "ProLinker");
    
    return await executor.execute(async () => {
      // In production, this would trigger the actual scraper
      // For now, get current stats to verify system is working
      const stats = await ctx.runQuery(internal.scraped_jobs.stats, {
        source: "prolinker",
      });
      
      console.log("[ProLinker] Current job count:", stats.total);
      
      // TODO: Trigger actual scraping via:
      // 1. External API call to scraper service
      // 2. Serverless function (Vercel/AWS Lambda)
      // 3. GitHub Actions workflow
      // Command: tsx scripts/scrape-prolinker.ts
      
      return stats;
    });
  },
});

/**
 * Scrape Freelance.nl jobs
 * Triggered every 6 hours by cron
 */
export const scrapeFreelanceNLJobs = internalAction({
  args: {},
  handler: async (ctx): Promise<any> => {
    const executor = new ScraperExecutor(ctx, "Freelance.nl");
    
    return await executor.execute(async () => {
      // Get current stats
      const stats = await ctx.runQuery(internal.scraped_jobs.stats, {
        source: "freelance_nl",
      });
      
      console.log("[Freelance.nl] Current job count:", stats.total);
      
      // TODO: Trigger actual scraping via:
      // 1. External API call to scraper service
      // 2. Serverless function (Vercel/AWS Lambda)
      // 3. GitHub Actions workflow
      // Command: tsx scripts/scrape-freelance-nl.ts
      
      return stats;
    });
  },
});

/**
 * Fetch RemoteOK jobs via JSON API
 * Triggered every 6 hours by cron
 * Uses clean public API - no scraping needed
 */
export const fetchRemoteOKJobs = internalAction({
  args: {},
  handler: async (ctx): Promise<any> => {
    const executor = new ScraperExecutor(ctx, "RemoteOK");
    
    return await executor.execute(async () => {
      console.log("[RemoteOK] Fetching jobs from API...");
      
      // Fetch from RemoteOK public API
      const response = await fetch("https://remoteok.com/api", {
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; JobBot/1.0)",
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json() as any[];
      
      // First item is metadata, skip it
      const jobs = data.slice(1);
      
      console.log(`[RemoteOK] Fetched ${jobs.length} total jobs`);
      
      // Filter for relevant jobs (React, TypeScript, Next.js, Full-stack)
      const relevantJobs = jobs.filter((job: any) => {
        const tags = job.tags?.map((t: string) => t.toLowerCase()) || [];
        const position = (job.position || "").toLowerCase();
        
        return (
          tags.includes("react") ||
          tags.includes("typescript") ||
          tags.includes("nextjs") ||
          tags.includes("next.js") ||
          tags.includes("fullstack") ||
          tags.includes("full-stack") ||
          tags.includes("frontend") ||
          tags.includes("full stack") ||
          position.includes("full stack") ||
          position.includes("fullstack") ||
          position.includes("react") ||
          position.includes("typescript") ||
          position.includes("next.js")
        );
      });
      
      console.log(`[RemoteOK] Found ${relevantJobs.length} relevant jobs`);
      
      // Map to scraped job format
      const scrapedJobs = relevantJobs.map((job: any) => ({
        title: job.position,
        company: job.company,
        location: job.location || "Remote",
        description: job.description || job.position,
        salary: job.salary_min && job.salary_max 
          ? `$${job.salary_min}-${job.salary_max}`
          : undefined,
        url: job.url,
        technologies: job.tags || [],
        postedAt: job.date ? new Date(job.date).getTime() : Date.now(),
        source: "remoteok",
        remote: true, // RemoteOK is all remote jobs
      }));
      
      // Save to Convex using batch push
      const result = await ctx.runMutation(internal.scraped_jobs.pushBatch, {
        jobs: scrapedJobs,
      });
      
      console.log(`[RemoteOK] Saved ${result.created} new jobs, updated ${result.updated}`);
      
      return {
        total: jobs.length,
        relevant: relevantJobs.length,
        created: result.created,
        updated: result.updated,
      };
    });
  },
});

/**
 * Archive old scraped jobs
 * Triggered daily at 3 AM UTC
 */
export const archiveOldScrapedJobs = internalAction({
  args: {},
  handler: async (ctx): Promise<any> => {
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
  handler: async (ctx): Promise<any> => {
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

/**
 * Send daily job digest
 * Triggered daily at 8 AM CET (7 AM UTC)
 */
export const sendDailyJobDigest = internalAction({
  args: {},
  handler: async (ctx): Promise<any> => {
    console.log("[CRON] Generating daily job digest...");
    
    try {
      const userId = "leroy";
      
      // Generate digest
      const digest = await ctx.runQuery(internal.job_matching.generateDailyDigest, {
        userId,
        limit: 10,
      });
      
      console.log(`[CRON] Generated digest: ${digest.message}`);
      
      // Format digest for Telegram
      if (digest.jobs.length === 0) {
        console.log("[CRON] No new matches found, skipping notification");
        return {
          success: true,
          message: "No new matches, no notification sent",
        };
      }
      
      // Format message
      let message = `🎯 *Daily Job Digest*\n\n`;
      message += `Found *${digest.jobs.length} new matches* from ${digest.totalScraped} jobs scraped in the last 24h\n\n`;
      message += `Top ${Math.min(10, digest.jobs.length)} matches:\n\n`;
      
      for (let i = 0; i < Math.min(10, digest.jobs.length); i++) {
        const job = digest.jobs[i];
        const score = Math.round(job.matchScore);
        const scoreEmoji = score >= 80 ? "🔥" : score >= 70 ? "⭐" : "✅";
        
        message += `${scoreEmoji} *${job.title}* (${score}%)\n`;
        message += `   ${job.company}`;
        if (job.location) message += ` • ${job.location}`;
        if (job.remote) message += ` • 🏠 Remote`;
        message += `\n`;
        
        // Show top matched tech
        const topTech = job.matchDetails?.matchedTechnologies?.slice(0, 3).join(", ");
        if (topTech) message += `   💻 ${topTech}\n`;
        
        if (job.salary) message += `   💰 ${job.salary}\n`;
        message += `   🔗 [View Job](${job.url})\n\n`;
      }
      
      message += `\n_View all matches at admin.leroysteding.nl/jobs_`;
      
      // Log the message (in production, this would send via Telegram)
      console.log("[CRON] Digest message:", message);
      console.log("[CRON] Note: Telegram sending should be done via OpenClaw cron job");
      console.log("[CRON] Add to OpenClaw: openclaw cron add --name prolinker-digest --schedule '0 8 * * *' --command 'node send-digest.js'");
      
      return {
        success: true,
        message: digest.message,
        matchCount: digest.jobs.length,
        telegramMessage: message,
      };
    } catch (error) {
      console.error("[CRON] Error generating digest:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },
});

/**
 * Manual trigger for scrapers (from admin dashboard)
 */
export const manualTrigger = internalAction({
  args: {
    scraperId: v.string(),
  },
  handler: async (ctx, args): Promise<any> => {
    console.log(`[MANUAL] Triggering ${args.scraperId} scraper...`);
    
    try {
      switch (args.scraperId) {
        case "prolinker":
          return await ctx.runAction(internal.cron_tasks.scrapeProLinkerJobs, {});
          
        case "freep":
          console.log("[MANUAL] Freep scraper would run here");
          // In production: trigger freep scraper
          return {
            success: true,
            message: "Freep scraper triggered (placeholder)",
          };
          
        case "medium":
          console.log("[MANUAL] Medium scraper would run here");
          return {
            success: true,
            message: "Medium scraper triggered (placeholder)",
          };
          
        case "reddit":
          console.log("[MANUAL] Reddit scraper would run here");
          return {
            success: true,
            message: "Reddit scraper triggered (placeholder)",
          };
          
        default:
          throw new Error(`Unknown scraper: ${args.scraperId}`);
      }
    } catch (error) {
      console.error(`[MANUAL] Error triggering ${args.scraperId}:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },
});

// Import internal API
import { api } from "./_generated/api";
import { v } from "convex/values";
