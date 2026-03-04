/**
 * Freep Automation - Connect scraper to autonomous workflows
 * 
 * Flow:
 * 1. Cron runs scraper every 6 hours
 * 2. New jobs get matched against preferences
 * 3. High-score matches → auto-create job_applications with status "discovered"
 * 4. Status "discovered" → triggers workflow → researcher agent
 * 5. Fully autonomous from there!
 */

import { internalAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";

/**
 * Run Freep scraper and auto-create applications for matches
 */
export const scrapeAndMatch = internalAction({
  args: {},
  handler: async (ctx): Promise<any> => {
    console.log("[freep-automation] Starting scrape and match...");

    // 1. Run the scraper (you'll need to call your script)
    // For now, we'll just get existing scraped jobs
    const scrapedJobs = await ctx.runQuery(internal.scraped_jobs.list, {
      source: "freep",
      limit: 50,
    });

    console.log(`[freep-automation] Found ${scrapedJobs.length} Freep jobs`);

    // 2. Get matched jobs (using existing matching system)
    const matches = await ctx.runQuery(internal.job_matching.getMatchedJobs, {
      minScore: 70, // Only high-quality matches
      limit: 10,
      source: "freep",
    });

    console.log(`[freep-automation] Found ${matches.length} high-score matches`);

    let created = 0;

    // 3. Create job applications for top matches
    for (const match of matches) {
      try {
        // Check if we already have an application for this job
        const existing = await ctx.runQuery(internal.job_applications.list, {
          limit: 1000, // Get all to search
        });

        const alreadyExists = existing.some(
          (app: any) => app.externalUrl === match.job.url
        );

        if (alreadyExists) {
          console.log(`[freep-automation] Skipping ${match.job.title} - already applied`);
          continue;
        }

        // Create new application with status "discovered"
        // This will trigger the workflow!
        await ctx.runMutation(internal.job_applications.create, {
          company: match.job.company,
          position: match.job.title,
          location: match.job.location || "Netherlands",
          status: "discovered", // 👈 This triggers the workflow!
          source: "freep-auto",
          externalUrl: match.job.url,
          salary: match.job.salary,
          notes: `Auto-discovered via Freep scraper. Match score: ${match.matchScore}%. Technologies: ${match.job.technologies.join(", ")}`,
          applicationDate: Date.now(),
        });

        created++;
        console.log(`[freep-automation] ✅ Created application for ${match.job.title} at ${match.job.company}`);

      } catch (error) {
        console.error(`[freep-automation] Error creating application:`, error);
      }
    }

    console.log(`[freep-automation] ✅ Created ${created} new applications`);

    // 4. Log to analytics
    await ctx.runMutation(internal.analytics_log.push, {
      event: "freep_automation_completed",
      agent: "orchestrator",
      metadata: {
        scrapedJobsFound: scrapedJobs.length,
        matchesFound: matches.length,
        applicationsCreated: created,
      },
    });

    return {
      scrapedJobsFound: scrapedJobs.length,
      matchesFound: matches.length,
      applicationsCreated: created,
    };
  },
});

/**
 * Manual trigger for testing
 */
export const runNow = internalAction({
  args: {},
  handler: async (ctx): Promise<any> => {
    return await ctx.runAction(internal.freep_automation.scrapeAndMatch, {});
  },
});
