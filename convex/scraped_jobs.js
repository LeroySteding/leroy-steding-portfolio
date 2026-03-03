/**
 * Scraped Jobs API
 *
 * Queries and mutations for managing scraped job listings from external platforms.
 */
import { v } from "convex/values";
import { mutation, query, action } from "./_generated/server";
// List scraped jobs with optional filters
export const list = query({
    args: {
        source: v.optional(v.string()),
        archived: v.optional(v.boolean()),
        limit: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        let jobs = await ctx.db
            .query("scraped_jobs")
            .order("desc")
            .collect();
        if (args.source) {
            jobs = jobs.filter((j) => j.source === args.source);
        }
        if (args.archived !== undefined) {
            jobs = jobs.filter((j) => !!j.archived === args.archived);
        }
        if (args.limit) {
            jobs = jobs.slice(0, args.limit);
        }
        return jobs;
    },
});
// Get single job by ID
export const get = query({
    args: { id: v.id("scraped_jobs") },
    handler: async (ctx, args) => ctx.db.get(args.id),
});
// Get job by URL and source (for deduplication)
export const getByUrl = query({
    args: { url: v.string(), source: v.string() },
    handler: async (ctx, args) => {
        const jobs = await ctx.db
            .query("scraped_jobs")
            .withIndex("by_url_source", (q) => q.eq("url", args.url).eq("source", args.source))
            .collect();
        return jobs.length > 0 ? jobs[0] : null;
    },
});
// Create new scraped job
export const create = mutation({
    args: {
        title: v.string(),
        company: v.string(),
        location: v.optional(v.string()),
        description: v.string(),
        salary: v.optional(v.string()),
        url: v.string(),
        technologies: v.array(v.string()),
        postedAt: v.optional(v.number()),
        source: v.string(),
        remote: v.optional(v.boolean()),
        employmentType: v.optional(v.string()),
        experienceLevel: v.optional(v.string()),
        scrapedAt: v.number(),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("scraped_jobs", {
            ...args,
            archived: false,
        });
    },
});
// Update job's scrapedAt (acts as "lastSeen")
export const updateScrapedAt = mutation({
    args: { id: v.id("scraped_jobs"), scrapedAt: v.number() },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.id, { scrapedAt: args.scrapedAt });
    },
});
// Archive job
export const archive = mutation({
    args: { id: v.id("scraped_jobs") },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.id, { archived: true });
    },
});
// Archive old jobs (batch)
export const archiveOldJobs = mutation({
    args: { cutoffDate: v.number() },
    handler: async (ctx, args) => {
        const oldJobs = await ctx.db
            .query("scraped_jobs")
            .filter((q) => q.lt(q.field("scrapedAt"), args.cutoffDate))
            .filter((q) => q.neq(q.field("archived"), true))
            .collect();
        for (const job of oldJobs) {
            await ctx.db.patch(job._id, { archived: true });
        }
        return oldJobs.length;
    },
});
// Get statistics
export const stats = query({
    args: { source: v.optional(v.string()) },
    handler: async (ctx, args) => {
        let jobs = await ctx.db.query("scraped_jobs").collect();
        if (args.source) {
            jobs = jobs.filter((j) => j.source === args.source);
        }
        const now = Date.now();
        const last24h = now - 24 * 60 * 60 * 1000;
        const last7days = now - 7 * 24 * 60 * 60 * 1000;
        return {
            total: jobs.length,
            active: jobs.filter((j) => !j.archived).length,
            archived: jobs.filter((j) => j.archived).length,
            scrapedLast24h: jobs.filter((j) => j.scrapedAt >= last24h).length,
            scrapedLast7days: jobs.filter((j) => j.scrapedAt >= last7days).length,
            bySource: jobs.reduce((acc, j) => {
                acc[j.source] = (acc[j.source] || 0) + 1;
                return acc;
            }, {}),
        };
    },
});
// Action: Save scraped job with deduplication
export const saveScrapedJob = action({
    args: {
        title: v.string(),
        company: v.string(),
        location: v.optional(v.string()),
        description: v.string(),
        salary: v.optional(v.string()),
        url: v.string(),
        technologies: v.array(v.string()),
        postedAt: v.optional(v.number()),
        source: v.string(),
        remote: v.optional(v.boolean()),
        employmentType: v.optional(v.string()),
        experienceLevel: v.optional(v.string()),
        scrapedAt: v.number(),
    },
    handler: async (ctx, args) => {
        // Check if job already exists
        const existing = await ctx.runQuery(api.scraped_jobs.getByUrl, {
            url: args.url,
            source: args.source,
        });
        if (existing) {
            // Update scrapedAt (acts as "lastSeen")
            await ctx.runMutation(api.scraped_jobs.updateScrapedAt, {
                id: existing._id,
                scrapedAt: args.scrapedAt,
            });
            return {
                created: false,
                jobId: existing._id,
                message: "Job already exists, updated lastSeen",
            };
        }
        // Create new job
        const jobId = await ctx.runMutation(api.scraped_jobs.create, args);
        return {
            created: true,
            jobId,
            message: "New job created",
        };
    },
});
/**
 * Public push mutation for scrapers (no auth required)
 * Deduplicates by URL + source
 */
export const push = mutation({
    args: {
        title: v.string(),
        company: v.string(),
        location: v.optional(v.string()),
        description: v.string(),
        salary: v.optional(v.string()),
        url: v.string(),
        technologies: v.array(v.string()),
        postedAt: v.optional(v.number()),
        source: v.string(),
        remote: v.optional(v.boolean()),
        employmentType: v.optional(v.string()),
        experienceLevel: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const existing = await ctx.db
            .query("scraped_jobs")
            .withIndex("by_url_source", (q) => q.eq("url", args.url).eq("source", args.source))
            .first();
        const scrapedAt = Date.now();
        if (existing) {
            await ctx.db.patch(existing._id, { ...args, scrapedAt, archived: existing.archived });
            return existing._id;
        }
        return await ctx.db.insert("scraped_jobs", { ...args, scrapedAt, archived: false });
    },
});
/**
 * Batch push for efficient bulk inserts with deduplication
 */
export const pushBatch = mutation({
    args: {
        jobs: v.array(v.object({
            title: v.string(),
            company: v.string(),
            location: v.optional(v.string()),
            description: v.string(),
            salary: v.optional(v.string()),
            url: v.string(),
            technologies: v.array(v.string()),
            postedAt: v.optional(v.number()),
            source: v.string(),
            remote: v.optional(v.boolean()),
            employmentType: v.optional(v.string()),
            experienceLevel: v.optional(v.string()),
        })),
    },
    handler: async (ctx, args) => {
        const results = { created: 0, updated: 0, errors: [] };
        const scrapedAt = Date.now();
        for (const job of args.jobs) {
            try {
                const existing = await ctx.db
                    .query("scraped_jobs")
                    .withIndex("by_url_source", (q) => q.eq("url", job.url).eq("source", job.source))
                    .first();
                if (existing) {
                    await ctx.db.patch(existing._id, { ...job, scrapedAt, archived: existing.archived });
                    results.updated++;
                }
                else {
                    await ctx.db.insert("scraped_jobs", { ...job, scrapedAt, archived: false });
                    results.created++;
                }
            }
            catch (error) {
                results.errors.push(`Failed: ${job.title} - ${error}`);
            }
        }
        return results;
    },
});
// Import api for self-reference
import { api } from "./_generated/api";
