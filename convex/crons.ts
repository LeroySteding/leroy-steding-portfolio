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
// DISABLED 2026-03-05: Data loss incident - investigate before re-enabling
// crons.daily(
//   "archive-old-jobs",
//   { hourUTC: 3, minuteUTC: 0 },
//   internal.cron_tasks.archiveOldScrapedJobs
// );

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

// Medium job scraper - DISABLED 2026-03-06
// Reason: Stub implementation, no real scraping logic
// Medium is not a good job source (informal posts, no API)
// Use RemoteOK/Adzuna instead for quality job listings
// crons.daily(
//   "scrape-medium-jobs",
//   { hourUTC: 10, minuteUTC: 0 },
//   internal.medium_scraper.scrapePublications,
//   { keywords: ["hiring", "we're hiring", "join our team", "careers"] }
// );

// Freelance.nl scraper - runs every 6 hours (Dutch focus)
crons.interval(
  "freelance-nl-scraper",
  { hours: 6 },
  internal.cron_tasks.scrapeFreelanceNLJobs
);

// RemoteOK job scraper - runs every 6 hours
// Uses clean JSON API, no scraping needed
crons.interval(
  "fetch-remoteok-jobs",
  { hours: 6 },
  internal.cron_tasks.fetchRemoteOKJobs
);

// GitHub intelligence - scan open issues daily at 2 AM UTC
crons.daily(
  "github-scan-issues",
  { hourUTC: 2, minuteUTC: 0 },
  internal.github_intelligence.scanOpenIssues
);

// Daily standup digest - runs every morning at 8 AM CET (7 AM UTC)
crons.daily(
  "daily-standup-digest",
  { hourUTC: 7, minuteUTC: 0 },
  internal.daily_digest_simple.generateDailyDigest
);

export default crons;
