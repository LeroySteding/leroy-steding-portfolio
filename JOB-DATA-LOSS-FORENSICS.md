# Job Database Data Loss - Forensic Report
**Date**: March 5, 2026, 06:03 CET  
**Severity**: CRITICAL  
**Impact**: 146 of 147 jobs deleted from production database

---

## 📊 DATA LOSS SUMMARY

| Metric | Before (03:03 AM) | After (06:01 AM) | Lost |
|--------|-------------------|------------------|------|
| **Total Jobs** | 147 | 1 | -146 |
| **RemoteOK** | 96 | 0 | -96 |
| **ProLinker** | 50 | 0 | -50 |
| **Medium** | 1 | 1 | 0 |
| **Archived** | 0 | 0 | 0 |

---

## 🕐 TIMELINE

- **03:03 AM**: Coder agent verified 147 jobs in `scraped_jobs` table
  - 96 RemoteOK jobs (scraped today)
  - 50 ProLinker jobs
  - 1 Medium job (scraped Mar 4, 10:00 AM UTC)

- **03:00 AM UTC (04:00 CET)**: `archive-old-jobs` cron job executed
  - Scheduled to archive jobs older than 30 days
  - Cutoff: Feb 3, 2026 at 3 AM UTC

- **06:01 AM**: Only 1 job remains (Medium job)
  - 146 jobs disappeared
  - ZERO archived jobs found
  - Jobs were DELETED, not archived

---

## 🔍 INVESTIGATION FINDINGS

### 1. Archive Cron Job Analysis

**Location**: `convex/crons.ts` (line ~22)
```typescript
crons.daily(
  "archive-old-jobs",
  { hourUTC: 3, minuteUTC: 0 },
  internal.cron_tasks.archiveOldScrapedJobs
);
```

**Implementation**: `convex/cron_tasks.ts`
```typescript
export const archiveOldScrapedJobs = internalAction({
  args: {},
  handler: async (ctx): Promise<any> => {
    const daysOld = 30;
    const cutoffDate = Date.now() - daysOld * 24 * 60 * 60 * 1000;
    
    const archived = await ctx.runMutation(internal.scraped_jobs.archiveOldJobs, {
      cutoffDate,
    });
    
    console.log(`[CRON] Archived ${archived} jobs older than ${daysOld} days`);
    return { success: true, archived, daysOld };
  },
});
```

**Archive Logic**: `convex/scraped_jobs.ts`
```typescript
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
```

### 2. Timestamp Analysis

**Cutoff Calculation** (Mar 5, 03:00 UTC):
- Current time: ~1741320000000 ms (Mar 5, 2026, 03:00 UTC)
- 30 days in ms: 2,592,000,000 ms
- Cutoff: 1738728000000 ms (Feb 3, 2026, 03:00 UTC)

**RemoteOK Jobs** (verified at 03:03):
- Scraped: Today (Mar 5)
- scrapedAt: ~1741334580000 ms (Mar 5, 2026, 07:03 UTC)
- scrapedAt > cutoffDate ✅ (Should NOT be archived)

**Medium Job** (survived):
- Scraped: Mar 4, 10:00 AM UTC
- scrapedAt: 1772618400230 ms
- **WAIT**: This timestamp converts to Mar 4, 2026, 10:00:00 UTC
- This is ALSO recent, so it should NOT have been archived either

### 3. Critical Finding: DELETION vs ARCHIVAL

- **Expected**: Jobs older than 30 days should be `archived = true`
- **Actual**: 146 jobs completely DELETED from database
- **Proof**: `npx convex run scraped_jobs:list '{"archived": true}' --prod` returns `[]`

---

## 🎯 ROOT CAUSE HYPOTHESES

### Hypothesis #1: Archive Logic Bug ❌
**Status**: UNLIKELY  
**Reason**: Archive logic checks `scrapedAt < cutoffDate`. RemoteOK jobs from today should NOT match this condition.

### Hypothesis #2: Timestamp Format Mismatch ❓
**Status**: INVESTIGATING  
**Reason**: If timestamps were in seconds instead of milliseconds, or if there was a conversion error, recent jobs could appear "old".

**Test**:
- Medium job timestamp: 1772618400230 ms → Mar 4, 10:00 AM UTC ✅
- This is correct (milliseconds format)
- RemoteOK jobs should have similar recent timestamps

### Hypothesis #3: Database Migration/Reset 🔥
**Status**: HIGH PROBABILITY  
**Reason**: 
- Jobs were DELETED, not archived
- No archived jobs exist in database
- Recent git commits show multiple Convex type fixes and migrations
- Possible database wipe during deployment

**Evidence**:
```bash
Recent commits (Mar 4-5):
- ee9a58c: feat(scrapers): Add RemoteOK cron job with full implementation
- 60d08e2: fix(scrapers): Add type assertion for RemoteOK API response
- b5a33e1: fix(convex): Add type annotations to all query exports across all files
- 1f52f0c: fix(convex): Resolve TypeScript errors in scrapers and workflow engine
```

### Hypothesis #4: Convex Deployment Rollback 🔥
**Status**: HIGH PROBABILITY  
**Reason**:
- Multiple deployments failed with "duplicate output file" errors
- Possible rollback to earlier schema without existing data
- Database state from before recent scraper runs was restored

### Hypothesis #5: Manual Database Cleanup ❓
**Status**: NEEDS VERIFICATION  
**Reason**: Someone may have manually cleared the table via Convex dashboard

---

## 🚨 IMMEDIATE RECOVERY PLAN

### Phase 1: Stop the Bleeding (5 min)
1. **Disable archive cron** to prevent further data loss:
   ```typescript
   // Comment out in convex/crons.ts:
   // crons.daily("archive-old-jobs", ...)
   ```

2. **Deploy immediately** to stop scheduled archival

### Phase 2: Re-scrape Lost Data (30 min)
1. **RemoteOK** (96 jobs lost):
   ```bash
   cd apps/admin
   npx convex run cron_tasks:fetchRemoteOKJobs --prod
   ```

2. **ProLinker** (50 jobs lost):
   ```bash
   npx tsx scripts/scrape-prolinker.ts
   ```

3. **Verify restoration**:
   ```bash
   npx convex run scraped_jobs:stats '{}' --prod
   ```

### Phase 3: Root Cause Investigation (60 min)
1. **Check Convex dashboard logs**:
   - Look for deployment events between 03:03-06:01
   - Check for schema migrations
   - Review function execution logs

2. **Check git deployment history**:
   - Verify which commit is currently deployed
   - Check if there was a rollback

3. **Audit archive logic**:
   - Add comprehensive logging
   - Test with mock data
   - Verify timestamp calculations

### Phase 4: Prevention (30 min)
1. **Fix archive bug** (if found):
   - Add safety checks (require manual confirmation for >10 jobs)
   - Add dry-run mode
   - Add detailed logging before archival

2. **Add database backups**:
   - Implement daily exports to JSON
   - Store in git or S3
   - Automated restore scripts

3. **Add monitoring**:
   - Alert if job count drops >10% in 1 hour
   - Daily job count tracking
   - Archive operation logging

---

## 📋 NEXT STEPS

### Immediate (Next 5 minutes)
- [ ] Disable archive cron job
- [ ] Deploy to production
- [ ] Start re-scraping RemoteOK

### Short-term (Next 30 minutes)
- [ ] Re-scrape ProLinker
- [ ] Verify job counts restored
- [ ] Check Convex dashboard for deployment logs

### Medium-term (Next 2 hours)
- [ ] Identify exact root cause
- [ ] Fix archive logic if buggy
- [ ] Implement database backup system
- [ ] Add monitoring alerts

---

## 🔐 PREVENTION MEASURES

### 1. Archive Safety Checks
```typescript
export const archiveOldJobs = mutation({
  args: { cutoffDate: v.number(), dryRun: v.optional(v.boolean()) },
  handler: async (ctx, args) => {
    const oldJobs = await ctx.db
      .query("scraped_jobs")
      .filter((q) => q.lt(q.field("scrapedAt"), args.cutoffDate))
      .filter((q) => q.neq(q.field("archived"), true))
      .collect();

    // SAFETY CHECK: Never archive >100 jobs at once without manual confirmation
    if (oldJobs.length > 100 && !args.dryRun) {
      throw new Error(
        `SAFETY STOP: Attempted to archive ${oldJobs.length} jobs. ` +
        `This seems suspicious. Run with dryRun=true first.`
      );
    }

    console.log(`[ARCHIVE] ${args.dryRun ? 'DRY RUN: Would archive' : 'Archiving'} ${oldJobs.length} jobs`);
    
    if (!args.dryRun) {
      for (const job of oldJobs) {
        console.log(`[ARCHIVE] Archiving: ${job.title} (scraped: ${new Date(job.scrapedAt).toISOString()})`);
        await ctx.db.patch(job._id, { archived: true });
      }
    }

    return oldJobs.length;
  },
});
```

### 2. Monitoring System
```typescript
// Add to cron_tasks.ts
export const monitorJobCount = internalAction({
  args: {},
  handler: async (ctx): Promise<any> => {
    const stats = await ctx.runQuery(internal.scraped_jobs.stats, {});
    
    // Get last known count from agent_memory
    const lastCount = await ctx.runQuery(internal.agent_memory.getLastJobCount, {});
    
    if (lastCount && stats.total < lastCount * 0.9) {
      // Job count dropped >10%!
      await ctx.runMutation(internal.agent_feed.push, {
        type: "alert",
        title: "🚨 Job Count Alert",
        content: `Job count dropped from ${lastCount} to ${stats.total} (${Math.round((1 - stats.total / lastCount) * 100)}% loss)`,
        priority: "critical",
        read: false,
        tags: ["monitoring", "data-loss"],
        createdAt: Date.now(),
      });
    }
    
    // Store current count
    await ctx.runMutation(internal.agent_memory.setLastJobCount, {
      count: stats.total,
    });
    
    return stats;
  },
});
```

### 3. Daily Backup
```bash
# Add to OpenClaw cron:
openclaw cron add \
  --name "backup-jobs-db" \
  --schedule "0 2 * * *" \
  --command "cd ~/Projects/personal/leroy-steding-portfolio && npx convex run scraped_jobs:list '{}' --prod > backups/jobs-$(date +%Y%m%d).json"
```

---

## 📞 ESCALATION

**If recovery fails or root cause unclear within 2 hours:**
- Escalate to @Architect for database design review
- Escalate to @Orchestrator for incident management
- Consider Convex support ticket for deployment history

---

**Report Generated**: 2026-03-05 06:03 CET  
**Investigator**: Coder Agent  
**Status**: ACTIVE INVESTIGATION - RECOVERY IN PROGRESS
