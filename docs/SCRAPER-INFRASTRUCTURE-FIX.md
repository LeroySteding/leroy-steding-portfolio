# Scraper Infrastructure Fix (STE-32)

**Date**: 2026-03-06 10:10 CET  
**Priority**: CRITICAL  
**Status**: In Progress

---

## 🚨 PROBLEM

**Complete job scraper infrastructure failure**:
- RemoteOK cron: Running but getting **HTTP 403 Forbidden**
- ProLinker: Stub implementation (never worked)
- Medium: Stub implementation (disabled in STE-31)
- FreelanceNL: Stub implementation (never worked)
- Freep: Stub implementation (never worked)

**Result**: No new jobs scraped for 4 days (since March 2nd)

---

## 🔍 ROOT CAUSE

### Issue #1: Convex IP Blocking
**Evidence**:
```bash
# From Convex (BLOCKED):
npx convex run cron_tasks:fetchRemoteOKJobs --prod
> [ERROR] 'HTTP 403: Forbidden'

# From local machine (WORKS):
curl -s "https://remoteok.io/api" | jq length
> 100+  # Returns jobs successfully
```

**Cause**: RemoteOK.com blocks Convex's data center IP addresses

### Issue #2: Stub Implementations
All other scrapers are **stub implementations**:

```typescript
// ProLinker, FreelanceNL, Freep:
export const scrapeXXX = internalAction({
  handler: async (ctx) => {
    // TODO: Trigger actual scraping via:
    // 1. External API call
    // 2. Serverless function
    // 3. GitHub Actions workflow
    return { message: "Placeholder" };
  },
});
```

**Status**: These scrapers were never implemented!

---

## 💡 SOLUTION ARCHITECTURE

### Strategy: Hybrid Scraping

**Working approach** (from manual recovery):
```bash
# This WORKS (bypasses Convex IP blocking):
cd ~/Projects/personal/leroy-steding-portfolio/apps/admin
CONVEX_URL=https://honorable-elk-818.eu-west-1.convex.cloud \
  npx tsx scripts/scrape-jobs.ts --source=remoteok
```

**Why it works**:
- ✅ Runs from user's machine (different IP)
- ✅ Saves directly to Convex database
- ✅ Uses working `RemoteOKScraper.ts` implementation
- ✅ Handles rate limiting, retries, error handling

### Implementation Options

#### Option 1: GitHub Actions Cron (Recommended)
**Setup**: Use GitHub Actions to run scraper on schedule

**Pros**:
- ✅ Different IP addresses (GitHub's infrastructure)
- ✅ Free (included in GitHub)
- ✅ Reliable scheduling
- ✅ Built-in logging and error handling

**Cons**:
- ⚠️ Requires GitHub Actions secret for Convex URL
- ⚠️ Limited to 6-hour minimum interval

**Implementation**:
```yaml
# .github/workflows/scrape-jobs.yml
name: Scrape Jobs

on:
  schedule:
    - cron: '0 */6 * * *'  # Every 6 hours
  workflow_dispatch:  # Manual trigger

jobs:
  scrape:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'pnpm'
      
      - run: pnpm install --frozen-lockfile
      
      - name: Scrape RemoteOK
        env:
          CONVEX_URL: ${{ secrets.CONVEX_URL }}
        run: |
          cd apps/admin
          npx tsx scripts/scrape-jobs.ts --source=remoteok
```

#### Option 2: Vercel Cron (API Route)
**Setup**: Create Vercel cron function

**Pros**:
- ✅ Integrated with existing Vercel deployment
- ✅ Flexible scheduling (Vercel Cron)
- ✅ Same infrastructure as app

**Cons**:
- 💰 Requires Vercel Pro ($20/month for cron)
- ⚠️ 10-second timeout on Hobby plan

**Implementation**:
```typescript
// apps/admin/app/api/cron/scrape-jobs/route.ts
export async function GET(request: Request) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  // Run scraper
  const { exec } = await import('child_process');
  const result = await new Promise((resolve) => {
    exec('cd apps/admin && npx tsx scripts/scrape-jobs.ts --source=remoteok', 
      { env: { ...process.env, CONVEX_URL: process.env.CONVEX_URL } },
      (error, stdout, stderr) => {
        resolve({ error, stdout, stderr });
      }
    );
  });

  return Response.json(result);
}
```

**vercel.json**:
```json
{
  "crons": [{
    "path": "/api/cron/scrape-jobs",
    "schedule": "0 */6 * * *"
  }]
}
```

#### Option 3: Local Cron + OpenClaw
**Setup**: Use OpenClaw cron to run scraper locally

**Pros**:
- ✅ Already have OpenClaw installed
- ✅ No external dependencies
- ✅ Works from user's machine (guaranteed working IP)

**Cons**:
- ⚠️ Requires machine to be running
- ⚠️ Not suitable for production (single point of failure)

**Implementation**:
```bash
openclaw cron add \
  --name "scrape-remoteok-jobs" \
  --schedule "0 */6 * * *" \
  --command "cd ~/Projects/personal/leroy-steding-portfolio/apps/admin && CONVEX_URL=https://honorable-elk-818.eu-west-1.convex.cloud npx tsx scripts/scrape-jobs.ts --source=remoteok"
```

---

## ⚡ IMMEDIATE FIX (10 min)

### Use GitHub Actions (Option 1)

**Step 1: Create workflow file**
```bash
cd ~/Projects/personal/leroy-steding-portfolio
mkdir -p .github/workflows
```

**Step 2: Add secret to GitHub**
1. Go to https://github.com/LeroySteding/leroy-steding-portfolio/settings/secrets/actions
2. Click "New repository secret"
3. Name: `CONVEX_URL`
4. Value: `https://honorable-elk-818.eu-west-1.convex.cloud`
5. Click "Add secret"

**Step 3: Create workflow** (see implementation above)

**Step 4: Test**
1. Push to GitHub
2. Go to Actions tab
3. Click "Scrape Jobs" workflow
4. Click "Run workflow" (manual trigger)
5. Verify jobs are saved to database

---

## 📊 SCRAPER STATUS (Current)

| Scraper | Status | Implementation | Cron Status | Jobs |
|---------|--------|----------------|-------------|------|
| **RemoteOK** | 🔴 Blocked | ✅ Working (local) | ❌ Convex 403 | 96 |
| **ProLinker** | ⚠️ Stub | ❌ Never implemented | ⚠️ Placeholder | 0 |
| **Medium** | 🔴 Disabled | ❌ Stub (STE-31) | 🔴 Disabled | 0 |
| **FreelanceNL** | ⚠️ Stub | ❌ Never implemented | ⚠️ Placeholder | 0 |
| **Freep** | ⚠️ Stub | ❌ Never implemented | ⚠️ Placeholder | 0 |

**Working Scrapers**: 0 (all blocked or stubs)  
**Last Successful Scrape**: March 2nd (4 days ago)  
**Impact**: Complete job pipeline failure

---

## 🎯 RECOMMENDED ACTIONS

### Immediate (Today)
1. **Implement GitHub Actions scraper** (30 min)
   - Create `.github/workflows/scrape-jobs.yml`
   - Add `CONVEX_URL` secret
   - Test manual trigger
   - Verify jobs saved

2. **Disable broken Convex crons** (5 min)
   - Comment out RemoteOK cron (blocked)
   - Remove stub crons (ProLinker, FreelanceNL, Freep)
   - Keep only implemented scrapers

### Short-term (This Week)
3. **Implement Adzuna scraper** (2 hours)
   - Use Adzuna API (requires credentials)
   - Add to GitHub Actions workflow
   - Higher quality jobs than RemoteOK

4. **Add scraper monitoring** (1 hour)
   - Alert on 0 new jobs >12 hours
   - Track scraper success rate
   - Log execution times

### Long-term (Next Month)
5. **Multi-source strategy**
   - RemoteOK (GitHub Actions)
   - Adzuna API (GitHub Actions)
   - Indeed (Puppeteer on GitHub Actions)
   - LinkedIn (API when available)

6. **Redundancy**
   - Multiple scrapers for same sources
   - Fallback IPs (residential proxies)
   - Rate limit handling

---

## 🛡️ PREVENTION

### Monitoring
```typescript
// Add to GitHub Actions workflow
- name: Alert on failure
  if: failure()
  uses: actions/github-script@v6
  with:
    script: |
      github.rest.issues.create({
        owner: context.repo.owner,
        repo: context.repo.name,
        title: 'Job scraper failed',
        body: 'RemoteOK scraper failed. Check logs: ${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }}',
        labels: ['scraper', 'critical']
      })
```

### Health Checks
```typescript
// apps/admin/scripts/check-scraper-health.ts
const lastScrape = await getLastScrapedJobTimestamp();
const hoursSinceLastScrape = (Date.now() - lastScrape) / (1000 * 60 * 60);

if (hoursSinceLastScrape > 12) {
  await sendAlert({
    title: "🚨 Scraper Stale",
    message: `No new jobs in ${Math.round(hoursSinceLastScrape)} hours`,
    priority: "critical"
  });
}
```

---

## 📝 NEXT STEPS

- [ ] Create GitHub Actions workflow
- [ ] Add Convex URL secret to GitHub
- [ ] Test workflow (manual trigger)
- [ ] Disable broken Convex crons
- [ ] Verify 6-hour scraping cycle
- [ ] Monitor for 24 hours
- [ ] Implement Adzuna scraper
- [ ] Add health monitoring

**ETA**: 30 minutes for GitHub Actions setup  
**Status**: Ready to implement
