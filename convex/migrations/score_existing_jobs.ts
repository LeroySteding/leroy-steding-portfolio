/**
 * Migration: Score all existing jobs
 * 
 * Run once to add match scores to all jobs in the database
 * Usage: npx convex run migrations/score_existing_jobs:run --prod
 */

import { internalMutation } from "../_generated/server";
import { internal } from "../_generated/api";

export const run = internalMutation({
  args: {},
  handler: async (ctx) => {
    console.log("[MIGRATION] Starting to score all existing jobs...");
    
    // Get all unarchived jobs
    const allJobs = await ctx.db
      .query("scraped_jobs")
      .filter((q) => q.neq(q.field("archived"), true))
      .collect();
    
    console.log(`[MIGRATION] Found ${allJobs.length} jobs to score`);
    
    // Process in batches of 50 to avoid timeout
    const batchSize = 50;
    const batches = Math.ceil(allJobs.length / batchSize);
    
    for (let i = 0; i < batches; i++) {
      const start = i * batchSize;
      const batch = allJobs.slice(start, start + batchSize);
      const jobIds = batch.map((j) => j._id);
      
      console.log(`[MIGRATION] Scheduling batch ${i + 1}/${batches} (${batch.length} jobs)`);
      
      // Schedule async to avoid timeout
      await ctx.scheduler.runAfter(0, internal.job_matching_v2.computeMatchScores, {
        jobIds,
      });
    }
    
    console.log(`[MIGRATION] Scheduled ${batches} batches for scoring`);
    
    return {
      totalJobs: allJobs.length,
      batches,
      message: `Migration scheduled: ${allJobs.length} jobs in ${batches} batches`,
    };
  },
});
