/**
 * ProLinker Scraper Convex Actions
 * 
 * Note: The actual scraping happens in apps/admin/scripts/scrape-prolinker.ts
 * These actions are for triggering and monitoring the scraper.
 */

import { action, query } from "./_generated/server";
import { api } from "./_generated/api";
import { v } from "convex/values";

/**
 * Get the last scrape run stats
 */
export const lastRun: any = query({
  args: {},
  handler: async (ctx) => {
    const logs = await ctx.db
      .query("analytics_log")
      .withIndex("by_event", (q) => q.eq("event", "prolinker_scraper_completed"))
      .order("desc")
      .take(1);
    
    return logs[0] || null;
  },
});

/**
 * Get scraper run history
 */
export const history: any = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const logs = await ctx.db
      .query("analytics_log")
      .withIndex("by_event", (q) => q.eq("event", "prolinker_scraper_completed"))
      .order("desc")
      .take(args.limit || 10);
    
    return logs;
  },
});

/**
 * Get scraper errors
 */
export const errors: any = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const logs = await ctx.db
      .query("analytics_log")
      .withIndex("by_agent", (q) => q.eq("agent", "scraper"))
      .order("desc")
      .collect();
    
    const errorLogs = logs.filter(
      (log) => 
        log.event.includes("error") || 
        log.event === "prolinker_scraper_fatal_error"
    );
    
    return errorLogs.slice(0, args.limit || 20);
  },
});

/**
 * Log manual scraper trigger
 */
export const logTrigger = action({
  args: { 
    triggeredBy: v.string(),
    method: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.runMutation(api.analytics_log.push, {
      event: "prolinker_scraper_triggered",
      agent: "scraper",
      metadata: {
        triggeredBy: args.triggeredBy,
        method: args.method || "manual",
        timestamp: Date.now(),
      },
      createdAt: Date.now(),
    });
  },
});

/**
 * Get scraper statistics
 */
export const stats: any = query({
  args: {},
  handler: async (ctx) => {
    const jobs = await ctx.db.query("scraped_jobs").collect();
    const prolinkerJobs = jobs.filter((j) => j.source === "prolinker");
    
    const active = prolinkerJobs.filter((j) => !j.archived);
    const lastRun = await ctx.db
      .query("analytics_log")
      .withIndex("by_event", (q) => q.eq("event", "prolinker_scraper_completed"))
      .order("desc")
      .first();
    
    const last24h = active.filter(
      (j) => j.scrapedAt > Date.now() - 24 * 60 * 60 * 1000
    );
    
    const last7d = active.filter(
      (j) => j.scrapedAt > Date.now() - 7 * 24 * 60 * 60 * 1000
    );
    
    return {
      totalJobs: prolinkerJobs.length,
      activeJobs: active.length,
      archivedJobs: prolinkerJobs.length - active.length,
      jobsLast24h: last24h.length,
      jobsLast7d: last7d.length,
      lastRunTime: lastRun?.createdAt || null,
      lastRunStats: lastRun?.metadata || null,
    };
  },
});
