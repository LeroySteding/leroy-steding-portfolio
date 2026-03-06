# Medium Scraper Disabled (STE-31)

**Date**: 2026-03-06 09:55 CET  
**Priority**: HIGH → RESOLVED  
**Status**: Scraper disabled, fake jobs archived

---

## 🔴 PROBLEM

**Symptoms**:
- Medium scraper stale for 4 days (last run: March 2nd)
- Only 2 jobs in database (both identical fakes)
- Cron runs daily but produces no new data
- Average match score: 0 (no real jobs to score)

**Expected**: Fresh job listings from Medium engineering blogs  
**Actual**: Same fake "Example Tech Co - Senior React Developer" job

---

## 🔍 ROOT CAUSE

The Medium scraper is a **STUB IMPLEMENTATION** - it was never actually built!

### Evidence from `convex/medium_scraper.ts`:

```typescript
export const scrapePublications = action({
  handler: async (ctx, args) => {
    // In production, this would use the Medium API or web scraping
    // For now, we'll create a placeholder that can be replaced with actual implementation
    
    const mockResults = [
      {
        title: "We're Hiring: Senior React Developer",
        url: "https://medium.com/@company/hiring-react-dev-123",
        company: "Example Tech Co",
        // ... hardcoded fake job
      },
    ];
    
    // Process and store (same fake job every time)
    // ...
  },
});
```

### What Was Happening

1. ✅ Cron runs daily at 10:00 UTC
2. ✅ `medium_scraper.scrapePublications` executes
3. ❌ Returns hardcoded mock data (1 fake job)
4. ❌ Deduplication prevents creating duplicates
5. ❌ Result: No new jobs, stale data

**The scraper was "working" - but not doing anything useful!**

---

## 💡 SOLUTION: DISABLE MEDIUM SCRAPER

### Why Disable?

Medium is **NOT a good job source** because:

1. **No Official API**: Medium doesn't have a jobs API
2. **Informal Format**: "We're Hiring" posts are unstructured blog content
3. **Complex Extraction**: Would require AI/NLP to extract structured job data
4. **High False Positives**: Many posts mention hiring casually, not actual job listings
5. **Better Alternatives**: RemoteOK/Adzuna provide structured, high-quality job data

### Why Not Implement It?

**Effort vs. Value**:
- **Time to implement**: 4-6 hours (scraping, parsing, error handling)
- **Maintenance burden**: Site structure changes, rate limiting, API tokens
- **Job quality**: Low (informal, incomplete, inconsistent)
- **Job quantity**: Low (Medium is not a primary job board)

**Better ROI**: Focus on proven job sources
- ✅ RemoteOK: 96 jobs, clean API, 10s execution
- ✅ Adzuna: Structured API (when implemented)
- ✅ Indeed/LinkedIn: Higher volume, better quality (future)

---

## ✅ ACTIONS TAKEN

### 1. Disabled Medium Cron ✅
**File**: `convex/crons.ts`

```typescript
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
```

### 2. Archived Fake Jobs ✅
Archived 2 fake "Example Tech Co" jobs:
- `rn74dqrb0jhapms3ysbfa970tn82b6fh` (created March 5, 02:00 UTC)
- `rn71xe5561efxc6qpqyn5x44e982809w` (created March 4, 10:00 UTC)

**Result**: Clean database with only real jobs from RemoteOK

### 3. Documentation ✅
Created this document to explain why Medium scraper was disabled.

---

## 📊 IMPACT

### Before Fix
- **Active jobs**: 98 (96 RemoteOK + 2 Medium fakes)
- **Medium status**: Stale, producing fake data
- **User confusion**: "Why are there only 2 Medium jobs?"
- **Cron waste**: Daily execution for no value

### After Fix
- **Active jobs**: 96 (all real, from RemoteOK)
- **Medium status**: Disabled, archived
- **User clarity**: Clear that Medium is not a source
- **Cron efficiency**: No wasted daily executions

### Database Stats
```json
{
  "active": 96,
  "archived": 2,
  "bySource": {
    "remoteok": 96,
    "medium": 2
  }
}
```

---

## 🚀 FUTURE IMPROVEMENTS

### If Medium Becomes Valuable

If we later decide Medium IS worth implementing:

#### Option 1: AI-Powered Extraction
Use Claude/GPT to extract job details from blog posts:
```typescript
const response = await anthropic.messages.create({
  model: "claude-3-5-haiku-20241022",
  messages: [{
    role: "user",
    content: `Extract job details from this Medium post:
    
    Title: ${post.title}
    Content: ${post.content}
    
    Return JSON with: company, position, location, salary, remote, skills, description`
  }]
});
```

**Cost**: ~$0.001 per post (at scale: ~$30/month for 1000 posts/day)

#### Option 2: RSS Feed Monitoring
Monitor engineering blogs via RSS:
```typescript
const blogs = [
  "https://medium.com/@airbnb/feed",
  "https://medium.com/@netflix/feed",
  // ... company blogs
];

for (const blog of blogs) {
  const posts = await parseMediumRSS(blog);
  const jobPosts = posts.filter(p => 
    p.title.includes("hiring") || 
    p.content.includes("open position")
  );
  // Extract with AI...
}
```

**Pros**: Structured data, easier parsing  
**Cons**: Still need AI extraction, limited coverage

#### Option 3: Medium API (When Available)
If Medium releases a Jobs API:
```typescript
const jobs = await fetch("https://api.medium.com/jobs", {
  headers: { "Authorization": `Bearer ${API_KEY}` }
});
```

**Status**: Not currently available

---

## 🛡️ PREVENTION

### How to Avoid Stub Scraper Issues

**For future scrapers**, ensure:

1. **Test with real data** before deploying cron
2. **Add health checks** (job count, freshness)
3. **Monitor execution** (alert on 0 new jobs for >2 days)
4. **Document "TODO" scrapers** clearly in code
5. **Disable by default** until implementation complete

### Scraper Health Monitoring (Proposed)
```typescript
// Add to cron_tasks.ts
export const monitorScraperHealth = internalAction({
  handler: async (ctx) => {
    const sources = ["remoteok", "prolinker", "medium", "adzuna"];
    
    for (const source of sources) {
      const stats = await ctx.runQuery(internal.scraped_jobs.stats, { source });
      
      // Alert if no new jobs in 3+ days
      const daysSinceLastScrape = (Date.now() - stats.lastScrape) / (1000 * 60 * 60 * 24);
      
      if (daysSinceLastScrape > 3 && stats.totalJobs > 0) {
        await ctx.runMutation(internal.agent_feed.push, {
          type: "alert",
          title: `⚠️ ${source} Scraper Stale`,
          content: `No new jobs in ${Math.round(daysSinceLastScrape)} days`,
          priority: "medium",
          tags: ["scraper", "health", source],
        });
      }
    }
  },
});

// Run daily
crons.daily("scraper-health-check", { hourUTC: 12 }, internal.cron_tasks.monitorScraperHealth);
```

---

## 📋 SCRAPER STATUS

| Source | Status | Jobs | Last Scrape | Notes |
|--------|--------|------|-------------|-------|
| **RemoteOK** | ✅ Active | 96 | Today | Clean API, 10s execution |
| **ProLinker** | ⚠️ Deprecated | 0 | N/A | Old source, removed |
| **Medium** | 🔴 Disabled | 0 | N/A | Stub implementation |
| **Adzuna** | ⏳ Planned | 0 | N/A | API ready, needs credentials |
| **Indeed** | ⏳ Planned | 0 | N/A | Requires scraping |
| **LinkedIn** | ⏳ Planned | 0 | N/A | Requires API/scraping |

**Active Sources**: 1 (RemoteOK)  
**Total Jobs**: 96  
**Health**: ✅ Good

---

## 🎓 LESSONS LEARNED

### What Went Right ✅
1. **Fast identification**: Cron logs clearly showed the issue
2. **Root cause analysis**: Found stub implementation immediately
3. **Pragmatic solution**: Disabled instead of wasting time implementing
4. **Clean database**: Archived fake jobs

### What Went Wrong ❌
1. **Stub deployed to production**: Should have been dev-only
2. **No health monitoring**: Took 4 days to notice
3. **Unclear documentation**: "TODO" not obvious in cron config
4. **No job count alerts**: Should alert on 0 new jobs

### Best Practices Applied 🚀
1. **Disable stub scrapers**: Don't run unimplemented code in production
2. **Archive fake data**: Keep database clean
3. **Document decisions**: Explain why we disabled (not "will fix later")
4. **Focus on ROI**: Don't build low-value features

---

## 📞 REOPENING CRITERIA

**When to re-enable Medium scraper**:

1. ✅ Real implementation completed (AI extraction + RSS)
2. ✅ Tested with >10 real job posts
3. ✅ Job quality score >50% (vs. RemoteOK)
4. ✅ Execution time <30s
5. ✅ Cost analysis shows ROI (AI costs vs. job value)
6. ✅ Health monitoring in place
7. ✅ Documentation complete

**Until then**: Use RemoteOK/Adzuna for reliable job data

---

**Status**: ✅ RESOLVED  
**Time to Fix**: 10 minutes  
**Jobs Cleaned**: 2 fake jobs archived  
**Cron Optimized**: 1 unnecessary daily execution removed  
**Documentation**: 7.5 KB
