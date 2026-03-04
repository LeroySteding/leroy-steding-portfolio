/**
 * Freep.nl Scraper - Convex Functions
 * 
 * Dutch government contract platform
 */

import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// ==================== JOB STORAGE ====================

export const storeJob = mutation({
  args: {
    title: v.string(),
    company: v.string(),
    location: v.string(),
    url: v.string(),
    description: v.string(),
    budget: v.optional(v.string()),
    duration: v.optional(v.string()),
    startDate: v.optional(v.string()),
    postedDate: v.optional(v.string()),
    isGovernment: v.boolean(),
  },
  handler: async (ctx, args) => {
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
      source: "freep",
      title: args.title,
      company: args.company,
      location: args.location,
      url: args.url,
      description: args.description,
      technologies: [], // Extract later if needed
      salary: args.budget,
      remote: args.location?.toLowerCase().includes("remote") || 
              args.location?.toLowerCase().includes("thuiswerk"),
      scrapedAt: Date.now(),
      archived: false,
      metadata: {
        duration: args.duration,
        startDate: args.startDate,
        postedDate: args.postedDate,
        isGovernment: args.isGovernment,
      },
    });
  },
});

// ==================== STATS & TRACKING ====================

export const lastRun: any = query({
  handler: async (ctx) => {
    const logs = await ctx.db
      .query("analytics_log")
      .withIndex("by_agent", (q) => q.eq("agent", "freep_scraper"))
      .order("desc")
      .take(1);
    
    return logs[0] ? {
      scraper: "freep",
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
  handler: async (ctx, args) => {
    const logs = await ctx.db
      .query("analytics_log")
      .withIndex("by_agent", (q) => q.eq("agent", "freep_scraper"))
      .order("desc")
      .take(args.limit || 10);
    
    return logs.map((log) => ({
      scraper: "freep",
      success: log.metadata?.success,
      jobsFound: log.metadata?.jobsFound,
      duration: log.durationMs,
      error: log.metadata?.error,
      timestamp: log.createdAt,
    }));
  },
});

export const stats: any = query({
  handler: async (ctx) => {
    const logs = await ctx.db
      .query("analytics_log")
      .withIndex("by_agent", (q) => q.eq("agent", "freep_scraper"))
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

export const governmentInsights = query({
  handler: async (ctx) => {
    const jobs = await ctx.db
      .query("scraped_jobs")
      .filter((q) => q.eq(q.field("source"), "freep"))
      .filter((q) => q.eq(q.field("archived"), false))
      .collect();
    
    const governmentJobs = jobs.filter(
      (j) => j.metadata?.isGovernment === true
    );
    
    return {
      totalJobs: jobs.length,
      governmentJobs: governmentJobs.length,
      governmentPercentage: jobs.length > 0 
        ? (governmentJobs.length / jobs.length) * 100 
        : 0,
      recentJobs: jobs.filter(
        (j) => j.scrapedAt > Date.now() - 7 * 24 * 60 * 60 * 1000
      ).length,
    };
  },
});
