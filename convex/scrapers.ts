/**
 * Job Scraper Actions
 * 
 * Convex actions for storing scraped job data from external platforms.
 * Handles deduplication and status tracking.
 */

import { v } from "convex/values";
import { action, internalAction } from "./_generated/server";
import { internal } from "./_generated/api";

const scrapedJobSchema = v.object({
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
});

/**
 * Save a scraped job to the database
 * Deduplicates by URL and source
 */
export const saveScrapedJob = action({
  args: { job: scrapedJobSchema },
  handler: async (ctx, args) => {
    // Check if job already exists (by URL and source)
    const existing = await ctx.runQuery(internal.scrapers.checkExistingJob, {
      url: args.job.url,
      source: args.job.source,
    });

    if (existing) {
      // Update lastSeen timestamp
      await ctx.runMutation(internal.scrapers.updateJobLastSeen, {
        id: existing._id,
        scrapedAt: args.job.scrapedAt,
      });

      return {
        created: false,
        jobId: existing._id,
        message: "Job already exists, updated lastSeen",
      };
    }

    // Create new job
    const jobId = await ctx.runMutation(internal.scrapers.createScrapedJob, {
      job: args.job,
    });

    return {
      created: true,
      jobId,
      message: "New job created",
    };
  },
});

/**
 * Batch save multiple scraped jobs
 */
export const saveScrapedJobsBatch = action({
  args: { jobs: v.array(scrapedJobSchema) },
  handler: async (ctx, args) => {
    const results = {
      created: 0,
      updated: 0,
      errors: 0,
    };

    for (const job of args.jobs) {
      try {
        const result = await ctx.runAction(internal.scrapers.saveScrapedJob, { job });
        if (result.created) {
          results.created++;
        } else {
          results.updated++;
        }
      } catch (error) {
        console.error("Error saving job:", error);
        results.errors++;
      }
    }

    return results;
  },
});

/**
 * Check if a job already exists
 * Internal query used by saveScrapedJob
 */
export const checkExistingJob = internalAction({
  args: { url: v.string(), source: v.string() },
  handler: async (ctx, args) => {
    const jobs = await ctx.runQuery(internal.scrapers.getJobByUrl, {
      url: args.url,
      source: args.source,
    });
    return jobs.length > 0 ? jobs[0] : null;
  },
});

/**
 * Get job by URL and source
 */
export const getJobByUrl = internalAction({
  args: { url: v.string(), source: v.string() },
  handler: async (ctx, args) => {
    const result = await ctx.runQuery(internal.scrapers.queryJobByUrl, {
      url: args.url,
      source: args.source,
    });
    return result;
  },
});

/**
 * Query job by URL (internal)
 */
export const queryJobByUrl = internalAction({
  args: { url: v.string(), source: v.string() },
  handler: async (ctx) => {
    // This would be replaced with actual Convex query
    // For now, return empty array as placeholder
    return [];
  },
});

/**
 * Update job's lastSeen timestamp
 */
export const updateJobLastSeen = internalAction({
  args: { id: v.string(), scrapedAt: v.number() },
  handler: async (ctx, args) => {
    // Update logic would go here
    // This is a placeholder that would be implemented with proper Convex mutations
    return args.id;
  },
});

/**
 * Create new scraped job
 */
export const createScrapedJob = internalAction({
  args: { job: scrapedJobSchema },
  handler: async (ctx, args) => {
    // Insert logic would go here
    // This is a placeholder that would be implemented with proper Convex mutations
    return "new-job-id";
  },
});

/**
 * Mark old jobs as archived
 * Should be run periodically to clean up expired listings
 */
export const archiveExpiredJobs = action({
  args: { daysOld: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const daysOld = args.daysOld || 30;
    const cutoffDate = Date.now() - daysOld * 24 * 60 * 60 * 1000;

    const archived = await ctx.runMutation(internal.scrapers.markJobsAsArchived, {
      cutoffDate,
    });

    return {
      archived,
      message: `Archived ${archived} jobs older than ${daysOld} days`,
    };
  },
});

/**
 * Mark jobs as archived (internal)
 */
export const markJobsAsArchived = internalAction({
  args: { cutoffDate: v.number() },
  handler: async (ctx, args) => {
    // Archive logic would go here
    return 0;
  },
});

/**
 * Get scraping statistics
 */
export const getScrapingStats = action({
  args: { source: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const stats = await ctx.runQuery(internal.scrapers.queryScrapingStats, {
      source: args.source,
    });

    return stats;
  },
});

/**
 * Query scraping stats (internal)
 */
export const queryScrapingStats = internalAction({
  args: { source: v.optional(v.string()) },
  handler: async (ctx) => {
    // Stats query would go here
    return {
      total: 0,
      active: 0,
      archived: 0,
      recentlyScraped: 0,
    };
  },
});
