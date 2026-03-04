/**
 * Freelance.nl Job Scraper
 * 
 * Scrapes Dutch freelance opportunities from freelance.nl
 * Platform: ~500+ freelance jobs/month (IT, marketing, design, consulting)
 */

import { v } from "convex/values";
import { internalAction, internalMutation, query } from "./_generated/server";
import { internal } from "./_generated/api";

// ==================== SCRAPER TRACKING ====================

export const logTrigger = internalMutation({
  args: {
    success: v.boolean(),
    jobsFound: v.number(),
    duration: v.number(),
    error: v.optional(v.string()),
    timestamp: v.number(),
  },
  handler: async (ctx, args): Promise<any> => {
    // Store scraper run log in analytics_log
    await ctx.db.insert("analytics_log", {
      event: "scraper_run",
      agent: "freelance_nl_scraper",
      durationMs: args.duration,
      metadata: {
        success: args.success,
        jobsFound: args.jobsFound,
        error: args.error,
        scraper: "freelance_nl",
      },
      createdAt: args.timestamp,
    });
  },
});

export const lastRun: any = query({
  handler: async (ctx): Promise<any> => {
    const logs = await ctx.db
      .query("analytics_log")
      .withIndex("by_agent", (q) => q.eq("agent", "freelance_nl_scraper"))
      .order("desc")
      .take(1);
    
    return logs[0] ? {
      scraper: "freelance_nl",
      success: logs[0].metadata?.success,
      jobsFound: logs[0].metadata?.jobsFound,
      duration: logs[0].durationMs,
      error: logs[0].metadata?.error,
      timestamp: logs[0].createdAt,
    } : null;
  },
});

export const history: any = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args): Promise<any> => {
    const limit = args.limit || 10;
    
    const logs = await ctx.db
      .query("analytics_log")
      .withIndex("by_agent", (q) => q.eq("agent", "freelance_nl_scraper"))
      .order("desc")
      .take(limit);
    
    return logs.map((log) => ({
      scraper: "freelance_nl",
      success: log.metadata?.success,
      jobsFound: log.metadata?.jobsFound,
      duration: log.durationMs,
      error: log.metadata?.error,
      timestamp: log.createdAt,
    }));
  },
});

export const stats: any = query({
  handler: async (ctx): Promise<any> => {
    const logs = await ctx.db
      .query("analytics_log")
      .withIndex("by_agent", (q) => q.eq("agent", "freelance_nl_scraper"))
      .order("desc")
      .take(30);
    
    const successCount = logs.filter((l) => l.metadata?.success).length;
    const totalJobs = logs.reduce((sum, l) => sum + (l.metadata?.jobsFound || 0), 0);
    const avgJobs = logs.length > 0 ? Math.round(totalJobs / logs.length) : 0;
    
    return {
      totalRuns: logs.length,
      successRate: logs.length > 0 ? successCount / logs.length : 0,
      avgJobsPerRun: avgJobs,
      totalJobsScraped: totalJobs,
      lastRun: logs[0]?.createdAt || null,
    };
  },
});

// ==================== JOB STORAGE ====================

/**
 * Store scraped job from freelance.nl
 */
export const storeJob = internalMutation({
  args: {
    title: v.string(),
    company: v.string(),
    location: v.string(),
    url: v.string(),
    description: v.string(),
    technologies: v.optional(v.array(v.string())),
    budget: v.optional(v.string()),
    startDate: v.optional(v.string()),
    duration: v.optional(v.string()),
    postedDate: v.optional(v.string()),
    category: v.optional(v.string()),
  },
  handler: async (ctx, args): Promise<any> => {
    // Check if already exists
    const existing = await ctx.db
      .query("scraped_jobs")
      .withIndex("by_url", (q) => q.eq("url", args.url))
      .first();
    
    if (existing) {
      // Update scraped timestamp
      await ctx.db.patch(existing._id, {
        scrapedAt: Date.now(),
      });
      return existing._id;
    }
    
    // Create new job
    return await ctx.db.insert("scraped_jobs", {
      source: "freelance_nl",
      title: args.title,
      company: args.company,
      location: args.location,
      url: args.url,
      description: args.description,
      technologies: args.technologies || [],
      salary: args.budget, // Use budget as salary field
      remote: args.location?.toLowerCase().includes("remote") || 
              args.location?.toLowerCase().includes("thuiswerk"),
      scrapedAt: Date.now(),
      archived: false,
      metadata: {
        startDate: args.startDate,
        duration: args.duration,
        postedDate: args.postedDate,
        category: args.category,
      },
    });
  },
});

// ==================== SCRAPER ACTION ====================

/**
 * Main scraper action (called by external scraper service)
 * 
 * This receives job data from the actual scraper script
 * and stores it in the database with proper tracking.
 */
export const receiveScrapedJobs = internalAction({
  args: {
    jobs: v.array(v.object({
      title: v.string(),
      company: v.string(),
      location: v.string(),
      url: v.string(),
      description: v.string(),
      technologies: v.optional(v.array(v.string())),
      budget: v.optional(v.string()),
      startDate: v.optional(v.string()),
      duration: v.optional(v.string()),
      postedDate: v.optional(v.string()),
      category: v.optional(v.string()),
    })),
  },
  handler: async (ctx, args): Promise<any> => {
    const stored: string[] = [];
    
    for (const job of args.jobs) {
      const jobId = await ctx.runMutation(
        internal.freelance_nl_scraper.storeJob,
        job
      );
      stored.push(jobId);
    }
    
    return {
      success: true,
      jobsStored: stored.length,
      jobIds: stored,
    };
  },
});

// ==================== INSIGHTS ====================

/**
 * Get insights about freelance.nl jobs
 */
export const getInsights: any = query({
  handler: async (ctx): Promise<any> => {
    const jobs = await ctx.db
      .query("scraped_jobs")
      .filter((q) => q.eq(q.field("source"), "freelance_nl"))
      .filter((q) => q.eq(q.field("archived"), false))
      .collect();
    
    // Top technologies
    const techCount = new Map<string, number>();
    for (const job of jobs) {
      for (const tech of job.technologies || []) {
        techCount.set(tech, (techCount.get(tech) || 0) + 1);
      }
    }
    
    const topTechnologies = Array.from(techCount.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([tech, count]) => ({ technology: tech, count }));
    
    // Top categories
    const categoryCount = new Map<string, number>();
    for (const job of jobs) {
      const category = job.metadata?.category || "Unknown";
      categoryCount.set(category, (categoryCount.get(category) || 0) + 1);
    }
    
    const topCategories = Array.from(categoryCount.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([category, count]) => ({ category, count }));
    
    return {
      totalJobs: jobs.length,
      topTechnologies,
      topCategories,
      remoteJobs: jobs.filter((j) => j.remote).length,
      recentJobs: jobs.filter(
        (j) => j.scrapedAt > Date.now() - 7 * 24 * 60 * 60 * 1000
      ).length,
    };
  },
});

export default {
  logTrigger,
  storeJob,
  receiveScrapedJobs,
  lastRun,
  history,
  stats,
  getInsights,
};
