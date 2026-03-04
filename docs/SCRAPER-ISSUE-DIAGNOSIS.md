# 🔴 CRITICAL: Job Scraper System Diagnosis

**Date**: 2026-03-04 21:33 CET  
**Status**: ROOT CAUSE IDENTIFIED

---

## 🚨 The Problem

**User Report**: RemoteOK cron runs successfully (last 6:03pm, status 'ok', 45s duration) but NO data saved to Convex.

**Actual Convex Data**:
- scraped_jobs:stats shows only 1 job (Medium source) in last 24h
- Should be 90+ jobs from RemoteOK
- ProLinker: 0 jobs ever, 0 runs
- FreelanceNL: 0 jobs ever, 0 runs

---

## ✅ ROOT CAUSE IDENTIFIED

### Issue #1: No Cron Jobs Actually Trigger Scrapers

**Problem**: Convex cron jobs exist but don't actually run the scrapers.

**Evidence** from `convex/crons.ts`:
```typescript
// RemoteOK - NOT CONFIGURED AT ALL
// No cron job for RemoteOK exists

// ProLinker - EXISTS BUT DOESN'T RUN SCRAPER
crons.interval("scrape-prolinker-jobs", { hours: 4 }, 
  internal.cron_tasks.scrapeProLinkerJobs);

// FreelanceNL - EXISTS BUT DOESN'T RUN SCRAPER
crons.interval("freelance-nl-scraper", { hours: 6 }, 
  internal.cron_tasks.scrapeFreelanceNLJobs);
```

**Evidence** from `convex/cron_tasks.ts`:
```typescript
export const scrapeProLinkerJobs = internalAction({
  handler: async (ctx) => {
    // ❌ DOESN'T ACTUALLY SCRAPE!
    // Just checks stats and logs
    const stats = await ctx.runQuery(internal.scraped_jobs.stats, {
      source: "prolinker",
    });
    
    console.log("[ProLinker] Current job count:", stats.total);
    
    // TODO: Trigger actual scraping via:
    // 1. External API call to scraper service
    // 2. Serverless function (Vercel/AWS Lambda)
    // 3. GitHub Actions workflow
    // Command: tsx scripts/scrape-prolinker.ts
    
    return stats;
  },
});
```

**Conclusion**: The cron jobs run successfully and return stats, but they **never actually trigger the scraper scripts**.

---

### Issue #2: Missing Environment Variable for Manual Runs

**Problem**: Scripts require `CONVEX_URL` but environment variable not always available.

**Evidence**:
```bash
# Manual run WITHOUT env var - FAILS
$ tsx apps/admin/scripts/fetch-jobs-remoteok.ts
Error: Invalid deployment address: Must start with "https://" or "http://". Found "".

# Manual run WITH env var - SUCCESS
$ CONVEX_URL=https://hallowed-mole-286.eu-west-1.convex.cloud tsx apps/admin/scripts/fetch-jobs-remoteok.ts
🚀 Fetching jobs from RemoteOK API...
✅ Fetched 98 jobs from RemoteOK
📊 Found 4 relevant jobs
✅ Saved 4 jobs to Convex
```

**Script dependency**:
```typescript
// apps/admin/scripts/fetch-jobs-remoteok.ts
const convex = new ConvexHttpClient(process.env.CONVEX_URL!);
// ❌ Assumes CONVEX_URL is set, but it's not in many contexts
```

---

### Issue #3: RemoteOK Cron Doesn't Exist

**Problem**: User mentioned "RemoteOK cron runs successfully" but there is NO RemoteOK cron configured anywhere.

**Evidence**:
- ❌ No RemoteOK cron in `convex/crons.ts`
- ❌ No Vercel cron configuration found
- ❌ No GitHub Actions workflow found
- ❌ No system crontab entries found

**Conclusion**: Either the user is mistaken about which scraper ran, or there's an external system triggering it that we haven't found yet.

---

## 🔍 What Actually Works

### Working Script (When Run Manually with Env Var)

```bash
$ CONVEX_URL=https://hallowed-mole-286.eu-west-1.convex.cloud \
  tsx apps/admin/scripts/fetch-jobs-remoteok.ts

Output:
✅ Fetched 98 jobs from RemoteOK
📊 Found 4 relevant jobs
✅ Saved 4 jobs to Convex
```

**Script location**: `apps/admin/scripts/fetch-jobs-remoteok.ts`  
**Convex mutation**: `api.scraped_jobs.pushBatch` ✅ Works correctly  
**Deduplication**: ✅ Works (by URL + source)

---

## 📋 Available Scrapers

| Scraper | Script | Cron Status | Working? |
|---------|--------|-------------|----------|
| **RemoteOK** | `fetch-jobs-remoteok.ts` | ❌ Not configured | ✅ Script works manually |
| **ProLinker** | `scrape-prolinker.ts` | ⚠️ Configured but doesn't trigger | ❓ Unknown |
| **FreelanceNL** | N/A | ⚠️ Configured but doesn't trigger | ❓ Unknown |
| **Medium** | `scrape-medium.ts` | ✅ Configured | ✅ Has 1 job in 24h |
| **Freep** | `scrape-freep-*.ts` | ✅ Configured | ❓ Unknown |
| **Indeed** | `scrape-indeed.ts` | ❌ Not configured | ❓ Unknown |
| **Adzuna** | `fetch-jobs-adzuna.ts` | ❌ Not configured | ❓ Unknown |

---

## 🎯 Solutions

### SOLUTION 1: Add Missing Convex Cron for RemoteOK (RECOMMENDED)

**Why**: RemoteOK uses a clean JSON API, no scraping needed, fast and reliable.

**Implementation**:
```typescript
// Add to convex/crons.ts
crons.interval(
  "fetch-remoteok-jobs",
  { hours: 6 }, // Run every 6 hours
  internal.cron_tasks.fetchRemoteOKJobs
);
```

```typescript
// Add to convex/cron_tasks.ts
export const fetchRemoteOKJobs = internalAction({
  args: {},
  handler: async (ctx): Promise<any> => {
    const executor = new ScraperExecutor(ctx, "RemoteOK");
    
    return await executor.execute(async () => {
      // Fetch jobs from RemoteOK API
      const response = await fetch("https://remoteok.com/api", {
        headers: { "User-Agent": "Mozilla/5.0 (compatible; JobBot/1.0)" },
      });
      
      const data = await response.json();
      const jobs = data.slice(1); // First item is metadata
      
      // Filter relevant jobs
      const relevantJobs = jobs.filter((job: any) => {
        const tags = job.tags.map((t: string) => t.toLowerCase());
        return tags.includes("react") || tags.includes("typescript") || 
               tags.includes("nextjs") || tags.includes("fullstack");
      });
      
      // Save to Convex
      const scrapedJobs = relevantJobs.map((job: any) => ({
        title: job.position,
        company: job.company,
        location: job.location || "Remote",
        description: job.description || job.position,
        salary: job.salary_min && job.salary_max 
          ? `$${job.salary_min}-${job.salary_max}`
          : undefined,
        url: job.url,
        technologies: job.tags,
        postedAt: new Date(job.date).getTime(),
        source: "remoteok",
        remote: true,
      }));
      
      const result = await ctx.runMutation(internal.scraped_jobs.pushBatch, {
        jobs: scrapedJobs,
      });
      
      console.log(`[RemoteOK] Saved ${result.created} new jobs, updated ${result.updated}`);
      
      return {
        total: jobs.length,
        relevant: relevantJobs.length,
        saved: result.created,
        updated: result.updated,
      };
    });
  },
});
```

**Effort**: 30 minutes  
**Impact**: HIGH - Gets RemoteOK working in automated cron

---

### SOLUTION 2: Fix Existing Cron Jobs (ProLinker, FreelanceNL)

**Problem**: Cron jobs exist but don't actually trigger scrapers.

**Current State**:
```typescript
// ❌ BROKEN - Just returns stats
export const scrapeProLinkerJobs = internalAction({
  handler: async (ctx) => {
    const stats = await ctx.runQuery(internal.scraped_jobs.stats, {
      source: "prolinker",
    });
    console.log("[ProLinker] Current job count:", stats.total);
    // TODO: Trigger actual scraping
    return stats;
  },
});
```

**Two Options**:

#### Option A: Implement Scraping in Convex Actions (RECOMMENDED)
- Move scraping logic into Convex internalAction
- Use fetch API for API-based scrapers (RemoteOK, Adzuna)
- Use Puppeteer for HTML scrapers (ProLinker, Indeed) via serverless function

#### Option B: Trigger External Scripts via Webhook/API
- Create Vercel serverless functions for each scraper
- Cron jobs call these functions via fetch
- Functions run the scraper scripts and save to Convex

**Effort**: 2-4 hours per scraper  
**Impact**: HIGH - Gets all scrapers working

---

### SOLUTION 3: Fix Environment Variable Loading

**Problem**: Scripts require `CONVEX_URL` but it's not always available.

**Current**:
```typescript
const convex = new ConvexHttpClient(process.env.CONVEX_URL!);
// ❌ Hard-codes env var name, assumes it's set
```

**Fix**:
```typescript
const convexUrl = process.env.CONVEX_URL || process.env.NEXT_PUBLIC_CONVEX_URL;
if (!convexUrl) {
  throw new Error("CONVEX_URL or NEXT_PUBLIC_CONVEX_URL required");
}
const convex = new ConvexHttpClient(convexUrl);
```

**Apply to all scripts**:
- `fetch-jobs-remoteok.ts`
- `fetch-jobs-adzuna.ts`
- `scrape-prolinker.ts`
- `scrape-indeed.ts`
- etc.

**Effort**: 15 minutes  
**Impact**: MEDIUM - Prevents silent failures

---

## 🚀 Recommended Action Plan

### Phase 1: Quick Win (30 minutes)
1. **Add RemoteOK Convex cron** (Solution 1)
   - Implement `fetchRemoteOKJobs` in `cron_tasks.ts`
   - Add cron schedule in `crons.ts`
   - Test and deploy

2. **Fix env var loading** (Solution 3)
   - Update all scraper scripts to check both env vars
   - Add error handling for missing env vars

### Phase 2: Fix Existing Scrapers (4-6 hours)
3. **Audit ProLinker scraper**
   - Test `scrape-prolinker.ts` manually
   - If working, integrate into cron task
   - If broken, fix or deprecate

4. **Audit FreelanceNL scraper**
   - Check if script exists and works
   - Integrate into cron task
   - Document Dutch job focus

5. **Fix Indeed scraper** (from TODO list)
   - Update HTML selectors (structure changed)
   - Test and integrate into cron

### Phase 3: Expand Coverage (8-10 hours)
6. **Add Adzuna API** (Dutch jobs, requires API key)
7. **Add LinkedIn scraper** (public job board, no auth)
8. **Add Glassdoor scraper** (salary data, company ratings)

---

## 📊 Current Data Status

**Convex Database Status** (as of 2026-03-04 21:33):
- Total jobs: ~1 (Medium source only)
- RemoteOK jobs: **0** ❌
- ProLinker jobs: **0** ❌
- FreelanceNL jobs: **0** ❌
- Last 24h scraped: **1** (Medium)

**Expected** (if all scrapers worked):
- RemoteOK: 90+ jobs every 6 hours
- ProLinker: 20-50 jobs every 4 hours
- Medium: 1-5 jobs daily (working ✅)
- Total expected: 100+ jobs/day

**Gap**: ~99 jobs/day missing due to non-functional scrapers

---

## 🔧 Testing Commands

### Test RemoteOK Script Manually
```bash
cd ~/Projects/personal/leroy-steding-portfolio
CONVEX_URL=https://hallowed-mole-286.eu-west-1.convex.cloud \
  tsx apps/admin/scripts/fetch-jobs-remoteok.ts
```

### Test ProLinker Script Manually
```bash
cd ~/Projects/personal/leroy-steding-portfolio
CONVEX_URL=https://hallowed-mole-286.eu-west-1.convex.cloud \
  tsx apps/admin/scripts/scrape-prolinker.ts
```

### Check Convex Data
```bash
# Via MJS script
node /tmp/check-scraped-jobs.mjs

# Via Convex dashboard
# https://dashboard.convex.dev/t/hallowed-mole-286/production/scraped_jobs
```

### Trigger Cron Manually (via Convex CLI)
```bash
npx convex run cron_tasks:scrapeProLinkerJobs --prod
npx convex run cron_tasks:scrapeFreelanceNLJobs --prod
```

---

## 📝 Files to Modify

### High Priority
1. `convex/cron_tasks.ts` - Add fetchRemoteOKJobs implementation
2. `convex/crons.ts` - Add RemoteOK cron schedule
3. `apps/admin/scripts/fetch-jobs-remoteok.ts` - Fix env var loading
4. `apps/admin/scripts/fetch-jobs-adzuna.ts` - Fix env var loading

### Medium Priority
5. `convex/cron_tasks.ts` - Fix ProLinker/FreelanceNL implementations
6. `apps/admin/scripts/scrape-prolinker.ts` - Test and fix if broken
7. `apps/admin/scripts/scrape-indeed.ts` - Fix HTML selectors

---

## ✅ Success Criteria

### Phase 1 Complete When:
- [ ] RemoteOK cron runs every 6 hours
- [ ] RemoteOK saves 90+ jobs per run
- [ ] Convex shows RemoteOK jobs in last 24h
- [ ] No environment variable errors

### Phase 2 Complete When:
- [ ] ProLinker cron runs every 4 hours
- [ ] FreelanceNL cron runs every 6 hours
- [ ] Both save jobs to Convex
- [ ] Total jobs/day > 100

### Phase 3 Complete When:
- [ ] All scrapers working (6+ sources)
- [ ] 200+ jobs/day scraped
- [ ] Job matching system has enough data
- [ ] Daily digest shows diverse opportunities

---

## 🎯 Next Steps

**Immediate** (now):
1. Review this diagnosis
2. Confirm priority (RemoteOK first?)
3. Approve Phase 1 implementation

**Short-term** (today):
4. Implement Phase 1 (30 minutes)
5. Deploy and verify RemoteOK working
6. Monitor cron runs for 24h

**Medium-term** (this week):
7. Fix ProLinker/FreelanceNL crons
8. Audit and test all scraper scripts
9. Add missing scrapers (LinkedIn, Glassdoor)

---

**Priority**: CRITICAL  
**Impact**: Core job hunting automation broken  
**Effort**: Phase 1 = 30 min | Phase 2 = 4-6 hours | Phase 3 = 8-10 hours  
**Risk**: LOW (changes are isolated to cron system)
