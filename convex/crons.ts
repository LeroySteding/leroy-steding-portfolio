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

export default crons;
