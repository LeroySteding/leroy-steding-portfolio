/**
 * Convex Cron Jobs
 * 
 * Scheduled tasks that run automatically via Convex's cron system.
 */

import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

// ProLinker job scraper - runs every 4 hours
crons.interval(
  "scrape-prolinker-jobs",
  { hours: 4 },
  internal.cron_tasks.scrapeProLinkerJobs
);

// Freep job scraper + auto-match - runs every 6 hours (staggered from ProLinker)
crons.interval(
  "freep-automation",
  { hours: 6 },
  internal.freep_automation.scrapeAndMatch
);

// Archive old scraped jobs - runs daily at 3 AM
crons.daily(
  "archive-old-jobs",
  { hourUTC: 3, minuteUTC: 0 },
  internal.cron_tasks.archiveOldScrapedJobs
);

// Clean up expired job applications - runs daily at 4 AM
crons.daily(
  "cleanup-expired-jobs",
  { hourUTC: 4, minuteUTC: 0 },
  internal.cron_tasks.cleanupExpiredJobApplications
);

// Send daily job digest - runs daily at 8 AM CET (7 AM UTC)
crons.daily(
  "send-daily-job-digest",
  { hourUTC: 7, minuteUTC: 0 },
  internal.cron_tasks.sendDailyJobDigest
);

// Medium job scraper - runs daily at 10 AM UTC
crons.daily(
  "scrape-medium-jobs",
  { hourUTC: 10, minuteUTC: 0 },
  internal.medium_scraper.scrapePublications,
  { keywords: ["hiring", "we're hiring", "join our team", "careers"] }
);

export default crons;
