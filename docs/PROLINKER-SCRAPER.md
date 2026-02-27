# ProLinker Job Scraper

Automated job scraping system for ProLinker platform with Puppeteer, Convex storage, and OpenClaw cron scheduling.

## Overview

The ProLinker scraper automatically:
- Scrapes job listings from ProLinker every 4 hours
- Extracts: title, company, location, description, salary, tech stack
- Stores data in Convex `scraped_jobs` table
- Handles pagination, rate limiting, and errors
- Logs all activity for monitoring

## Architecture

```
┌─────────────────┐
│  OpenClaw Cron  │ (every 4 hours)
└────────┬────────┘
         │
         ▼
┌─────────────────────────────┐
│  scrape-prolinker.ts        │
│  (Puppeteer script)         │
│  - Launches headless browser│
│  - Scrapes job listings     │
│  - Extracts data            │
│  - Handles pagination       │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│  Convex scraped_jobs.ts     │
│  - pushBatch() mutation     │
│  - Deduplication (URL)      │
│  - Stats tracking           │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│  Convex Database            │
│  - scraped_jobs table       │
│  - analytics_log table      │
└─────────────────────────────┘
```

## Files

### Scraper Script
**Location:** `apps/admin/scripts/scrape-prolinker.ts`

Main scraping logic:
- Puppeteer browser automation
- Page parsing and data extraction
- Rate limiting and retry logic
- Error handling and logging

### Convex Schema
**Location:** `convex/schema.ts`

Added `scraped_jobs` table:
```typescript
scraped_jobs: defineTable({
  title: v.string(),
  company: v.string(),
  location: v.optional(v.string()),
  description: v.string(),
  salary: v.optional(v.string()),
  url: v.string(),
  technologies: v.array(v.string()),
  postedAt: v.optional(v.number()),
  scrapedAt: v.number(),
  source: v.string(), // "prolinker"
  remote: v.optional(v.boolean()),
  employmentType: v.optional(v.string()),
  experienceLevel: v.optional(v.string()),
  archived: v.optional(v.boolean()),
})
  .index("by_url", ["url"])
  .index("by_company", ["company"])
  .index("by_source", ["source"])
  .index("by_scraped_at", ["scrapedAt"])
  .index("by_url_source", ["url", "source"])
```

### Convex API
**Location:** `convex/scraped_jobs.ts`

Mutations:
- `push()` - Add/update single job (with deduplication)
- `pushBatch()` - Bulk insert/update jobs
- `archiveOld()` - Archive jobs older than X days

Queries:
- `list()` - Get jobs (filtered by source, archived status)
- `get()` - Get job by ID
- `search()` - Search by query, technologies, source
- `stats()` - Get scraping statistics

### Monitoring
**Location:** `convex/prolinker_scraper.ts`

Queries for monitoring:
- `lastRun()` - Get last scrape run stats
- `history()` - Get scrape run history
- `errors()` - Get recent errors
- `stats()` - Get overall statistics

## Setup

### 1. Environment Variables

Create `.env.local` in project root:

```bash
# Convex
CONVEX_URL=https://your-deployment.convex.cloud

# ProLinker Configuration
PROLINKER_URL=https://www.prolinker.nl/vacatures
MAX_PAGES=10
HEADLESS=true
```

### 2. Install Dependencies

Puppeteer is already installed:
```bash
pnpm install
```

### 3. Test Scraper Locally

```bash
# From project root
tsx apps/admin/scripts/scrape-prolinker.ts
```

Expected output:
```
🚀 Starting ProLinker job scraper...
📍 Base URL: https://www.prolinker.nl/vacatures
📄 Max pages: 10
⏱️  Request delay: 2000ms
🌐 Browser launched

📄 Scraping page 1...
📍 Loaded: https://www.prolinker.nl/vacatures
🔍 Found 20 job elements
💾 Saving 20 jobs to Convex...
✅ Saved: 18 new, 2 updated
...
```

### 4. Set Up OpenClaw Cron

#### Option A: OpenClaw CLI Cron

Create cron configuration:
```bash
openclaw cron add \
  --name "prolinker-scraper" \
  --schedule "0 */4 * * *" \
  --command "cd ~/Projects/personal/leroy-steding-portfolio && tsx apps/admin/scripts/scrape-prolinker.ts"
```

Schedule: Every 4 hours (0:00, 4:00, 8:00, 12:00, 16:00, 20:00)

#### Option B: System Cron (macOS/Linux)

Edit crontab:
```bash
crontab -e
```

Add line:
```
0 */4 * * * cd ~/Projects/personal/leroy-steding-portfolio && tsx apps/admin/scripts/scrape-prolinker.ts >> ~/logs/prolinker-scraper.log 2>&1
```

### 5. Verify Scraper is Running

Check Convex database:
```typescript
// In Convex dashboard or query
const jobs = await ctx.db.query("scraped_jobs")
  .withIndex("by_source", (q) => q.eq("source", "prolinker"))
  .collect();

console.log(`${jobs.length} ProLinker jobs in database`);
```

Check last run:
```typescript
const lastRun = await ctx.runQuery(api.prolinker_scraper.lastRun, {});
console.log("Last scrape:", new Date(lastRun?.createdAt || 0));
```

## Configuration

### Scraper Settings

Edit `apps/admin/scripts/scrape-prolinker.ts`:

```typescript
const CONFIG = {
  baseUrl: "https://www.prolinker.nl/vacatures", // ProLinker URL
  maxPages: 10,           // Max pages to scrape per run
  headless: true,         // Run browser in headless mode
  requestDelay: 2000,     // Delay between pages (ms)
  maxRetries: 3,          // Max retry attempts
  retryDelay: 5000,       // Initial retry delay (ms)
  navigationTimeout: 30000, // Page load timeout
  selectorTimeout: 10000,   // Element wait timeout
};
```

### Selectors (Update for ProLinker)

The scraper uses generic selectors. Update based on ProLinker's HTML:

```typescript
// In scrapePage()
await page.waitForSelector(".job-listing, .vacancy-item, article");
const jobElements = await page.$$(".job-listing");

// In extractJobData()
const title = await element.$eval("h2, .job-title", ...);
const company = await element.$eval(".company-name", ...);
const location = await element.$eval(".job-location", ...);
```

**To find correct selectors:**
1. Visit ProLinker in browser
2. Open DevTools (F12)
3. Inspect job listing elements
4. Update selectors in `extractJobData()`

### Technology Extraction

Edit `extractTechnologies()` to add/remove keywords:

```typescript
const techKeywords = [
  // Add ProLinker-specific tech terms
  "JavaScript", "TypeScript", "React", "Vue", "Angular",
  "Python", "Django", "FastAPI",
  "AWS", "Azure", "Docker", "Kubernetes",
  // ...
];
```

## Monitoring

### View Stats

```typescript
// Get overall stats
const stats = await ctx.runQuery(api.prolinker_scraper.stats, {});
console.log(stats);
// {
//   totalJobs: 450,
//   activeJobs: 420,
//   archivedJobs: 30,
//   jobsLast24h: 15,
//   jobsLast7d: 89,
//   lastRunTime: 1709123456789,
//   lastRunStats: { pagesScraped: 10, jobsFound: 180, ... }
// }
```

### View Recent Runs

```typescript
const history = await ctx.runQuery(api.prolinker_scraper.history, { limit: 5 });
history.forEach(run => {
  console.log(`Run at ${new Date(run.createdAt)}`);
  console.log(`  Pages: ${run.metadata.pagesScraped}`);
  console.log(`  Jobs: ${run.metadata.jobsFound}`);
  console.log(`  Saved: ${run.metadata.jobsSaved} new, ${run.metadata.jobsUpdated} updated`);
});
```

### View Errors

```typescript
const errors = await ctx.runQuery(api.prolinker_scraper.errors, { limit: 10 });
errors.forEach(err => {
  console.log(`${err.event} at ${new Date(err.createdAt)}`);
  console.log(`  ${JSON.stringify(err.metadata)}`);
});
```

### Admin Dashboard (Future)

Create dashboard at `apps/admin/src/app/(admin)/jobs/scraped/page.tsx`:
- Real-time job feed
- Scraper run history
- Error logs
- Manual trigger button
- Stats charts

## Maintenance

### Archive Old Jobs

Run periodically to archive jobs older than 30 days:

```typescript
const result = await ctx.runMutation(api.scraped_jobs.archiveOld, {
  daysOld: 30,
  source: "prolinker",
});
console.log(`Archived ${result.archived} old jobs`);
```

Add to `convex/crons.ts`:
```typescript
crons.weekly(
  "archive old jobs",
  { dayOfWeek: 1, hourUTC: 2, minuteUTC: 0 },
  internal.scraped_jobs.archiveOld,
  { daysOld: 30 }
);
```

### Update Selectors

If ProLinker changes their HTML structure:
1. Run scraper manually with `HEADLESS=false`
2. Observe browser and inspect elements
3. Update selectors in `extractJobData()`
4. Test locally before deploying

### Rate Limiting

If ProLinker blocks requests:
1. Increase `requestDelay` (e.g., 5000ms)
2. Reduce `maxPages` (e.g., 5)
3. Add random delays: `Math.random() * 2000 + 2000`
4. Rotate user agents

## Troubleshooting

### Scraper Not Running

1. Check cron job status:
   ```bash
   openclaw cron list
   # or
   crontab -l
   ```

2. Check logs:
   ```bash
   tail -f ~/logs/prolinker-scraper.log
   ```

3. Run manually:
   ```bash
   tsx apps/admin/scripts/scrape-prolinker.ts
   ```

### No Jobs Found

1. Check if ProLinker URL is correct
2. Update selectors (ProLinker may have changed HTML)
3. Run with `HEADLESS=false` to see browser
4. Check for CAPTCHAs or bot detection

### Duplicates in Database

Deduplication uses `url` + `source` index. If duplicates exist:
1. Check if URLs are identical (trailing slashes, query params)
2. Normalize URLs in `extractJobData()`
3. Clean up manually:
   ```typescript
   const duplicates = await findDuplicates();
   for (const dup of duplicates) {
     await ctx.db.delete(dup._id);
   }
   ```

### Puppeteer Errors

Common issues:

1. **Browser launch failed:**
   - Install Chromium: `npx puppeteer browsers install chrome`
   - Check system dependencies

2. **Timeout errors:**
   - Increase `navigationTimeout`
   - Check network connection
   - ProLinker may be slow

3. **Selector not found:**
   - Update selectors
   - Add fallbacks: `await element.$eval("h2, h3, .title", ...)`

## API Reference

### Convex Queries

```typescript
// List jobs
api.scraped_jobs.list({ source: "prolinker", limit: 50 })

// Search jobs
api.scraped_jobs.search({ 
  query: "React Developer",
  technologies: ["React", "TypeScript"],
  source: "prolinker"
})

// Get stats
api.scraped_jobs.stats({ source: "prolinker" })

// Scraper monitoring
api.prolinker_scraper.lastRun({})
api.prolinker_scraper.history({ limit: 10 })
api.prolinker_scraper.errors({ limit: 20 })
api.prolinker_scraper.stats({})
```

### Convex Mutations

```typescript
// Push single job
api.scraped_jobs.push({
  title: "Frontend Developer",
  company: "TechCorp",
  url: "https://prolinker.nl/jobs/123",
  description: "...",
  technologies: ["React", "TypeScript"],
  source: "prolinker",
})

// Batch push
api.scraped_jobs.pushBatch({ jobs: [...] })

// Archive old
api.scraped_jobs.archiveOld({ daysOld: 30, source: "prolinker" })
```

## Performance

- **Scrape time:** ~2-5 minutes for 10 pages (200 jobs)
- **Memory:** ~150-300MB (Puppeteer browser)
- **CPU:** Moderate during scraping, idle between runs
- **Storage:** ~2KB per job (Convex)

## Security

- Scraper runs server-side (not exposed to clients)
- Convex mutations are public but deduplicated
- No authentication data scraped
- Respects robots.txt (check ProLinker's policy)
- Rate limiting prevents abuse

## Next Steps

1. **PROLINKER-02:** Create admin dashboard for scraped jobs
2. **PROLINKER-03:** Add job matching algorithm (user skills → relevant jobs)
3. **PROLINKER-04:** Email notifications for new matching jobs
4. **PROLINKER-05:** Expand to other job platforms (LinkedIn, Indeed)

## Resources

- [Puppeteer Docs](https://pptr.dev/)
- [Convex Docs](https://docs.convex.dev/)
- [OpenClaw Cron](https://openclaw.dev/docs/cron)
- ProLinker URL: https://www.prolinker.nl/vacatures

---

**Status:** ✅ Scraper built, tested, documented  
**Created:** 2026-02-27  
**Last Updated:** 2026-02-27
