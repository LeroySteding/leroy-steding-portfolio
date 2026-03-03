/**
 * Freep Scraper Convex Actions
 *
 * Freep is a Dutch platform for government freelance contracts
 * Note: The actual scraping happens in apps/admin/scripts/scrape-freep.ts
 * These actions are for triggering and monitoring the scraper.
 */
import { action, query } from "./_generated/server";
import { api } from "./_generated/api";
import { v } from "convex/values";
/**
 * Get the last scrape run stats
 */
export const lastRun = query({
    args: {},
    handler: async (ctx) => {
        const logs = await ctx.db
            .query("analytics_log")
            .withIndex("by_event", (q) => q.eq("event", "freep_scraper_completed"))
            .order("desc")
            .take(1);
        return logs[0] || null;
    },
});
/**
 * Get scraper run history
 */
export const history = query({
    args: { limit: v.optional(v.number()) },
    handler: async (ctx, args) => {
        const logs = await ctx.db
            .query("analytics_log")
            .withIndex("by_event", (q) => q.eq("event", "freep_scraper_completed"))
            .order("desc")
            .take(args.limit || 10);
        return logs;
    },
});
/**
 * Get scraper errors
 */
export const errors = query({
    args: { limit: v.optional(v.number()) },
    handler: async (ctx, args) => {
        const logs = await ctx.db
            .query("analytics_log")
            .withIndex("by_agent", (q) => q.eq("agent", "scraper"))
            .order("desc")
            .collect();
        const errorLogs = logs.filter((log) => log.event.includes("error") &&
            (log.event.includes("freep") || log.metadata?.source === "freep"));
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
            event: "freep_scraper_triggered",
            agent: "scraper",
            metadata: {
                triggeredBy: args.triggeredBy,
                method: args.method || "manual",
                timestamp: Date.now(),
                source: "freep",
            },
            createdAt: Date.now(),
        });
    },
});
/**
 * Get scraper statistics
 */
export const stats = query({
    args: {},
    handler: async (ctx) => {
        const jobs = await ctx.db.query("scraped_jobs").collect();
        const freepJobs = jobs.filter((j) => j.source === "freep");
        const active = freepJobs.filter((j) => !j.archived);
        const lastRun = await ctx.db
            .query("analytics_log")
            .withIndex("by_event", (q) => q.eq("event", "freep_scraper_completed"))
            .order("desc")
            .first();
        const last24h = active.filter((j) => j.scrapedAt > Date.now() - 24 * 60 * 60 * 1000);
        const last7d = active.filter((j) => j.scrapedAt > Date.now() - 7 * 24 * 60 * 60 * 1000);
        return {
            totalJobs: freepJobs.length,
            activeJobs: active.length,
            archivedJobs: freepJobs.length - active.length,
            jobsLast24h: last24h.length,
            jobsLast7d: last7d.length,
            lastRunTime: lastRun?.createdAt || null,
            lastRunStats: lastRun?.metadata || null,
        };
    },
});
/**
 * Get government contract insights
 * Freep specializes in government contracts, so let's add specific analytics
 */
export const governmentInsights = query({
    args: {},
    handler: async (ctx) => {
        const jobs = await ctx.db
            .query("scraped_jobs")
            .filter((q) => q.eq(q.field("source"), "freep"))
            .collect();
        const active = jobs.filter((j) => !j.archived);
        // Analyze by government sector if mentioned in description
        const sectors = new Map();
        const techCounts = new Map();
        active.forEach((job) => {
            const desc = job.description.toLowerCase();
            // Identify government sectors
            if (desc.includes("gemeente") || desc.includes("municipal"))
                sectors.set("Municipal", (sectors.get("Municipal") || 0) + 1);
            if (desc.includes("provincie") || desc.includes("provincial"))
                sectors.set("Provincial", (sectors.get("Provincial") || 0) + 1);
            if (desc.includes("ministerie") || desc.includes("ministry"))
                sectors.set("Ministry", (sectors.get("Ministry") || 0) + 1);
            if (desc.includes("waterschappen") || desc.includes("water board"))
                sectors.set("Water Board", (sectors.get("Water Board") || 0) + 1);
            if (desc.includes("zorg") || desc.includes("healthcare"))
                sectors.set("Healthcare", (sectors.get("Healthcare") || 0) + 1);
            if (desc.includes("onderwijs") || desc.includes("education"))
                sectors.set("Education", (sectors.get("Education") || 0) + 1);
            // Count technologies
            job.technologies.forEach((tech) => {
                techCounts.set(tech, (techCounts.get(tech) || 0) + 1);
            });
        });
        // Convert to sorted arrays
        const sectorStats = Array.from(sectors.entries())
            .map(([sector, count]) => ({ sector, count }))
            .sort((a, b) => b.count - a.count);
        const topTech = Array.from(techCounts.entries())
            .map(([technology, count]) => ({ technology, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 10);
        // Calculate average contract characteristics
        const withSalary = active.filter((j) => j.salary);
        return {
            totalActive: active.length,
            sectorBreakdown: sectorStats,
            topTechnologies: topTech,
            jobsWithSalary: withSalary.length,
            remoteJobs: active.filter((j) => j.remote).length,
            recentJobs: active.filter((j) => j.scrapedAt > Date.now() - 7 * 24 * 60 * 60 * 1000).length,
        };
    },
});
