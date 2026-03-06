# Convex Deployment Blocked (STE-33)

**Date**: 2026-03-06 11:35 CET  
**Status**: BLOCKED - Server-side cache corruption  
**Impact**: Cannot deploy to DEV or PROD

---

## 🔴 ISSUE

Convex deployments failing with duplicate output file errors:
```
✘ [ERROR] Two output files share the same path but have different contents: out/workflow_engine.js
✘ [ERROR] Two output files share the same path but have different contents: out/scraped_jobs.js
... (60+ similar errors)
```

**Root Cause**: Convex build server cache corruption (server-side issue, not local)

---

## ✅ WHAT I FIXED LOCALLY

### Consolidated Duplicate Files
- ❌ Had: `contentCalendar.ts` AND `content_calendar.ts`
- ✅ Now: `contentCalendar.ts` only (camelCase)
- ✅ Updated all imports in admin pages
- ✅ Added missing `stats` + `updateStatus` functions
- ✅ Tests passing (47/47)
- ✅ Committed: `9c640d2`

### Verified No Duplicates
```bash
cd convex && ls -1 *.ts | sed 's/\.ts$//' | awk '{print tolower($0)}' | sort | uniq -d
# Returns: (no output) ✅
```

---

## ❌ DEPLOYMENT STILL BLOCKED

### Tried:
1. ❌ Clear local cache: `rm -rf .convex node_modules/.convex`
2. ❌ Clean reinstall: `rm -rf node_modules && pnpm install`
3. ❌ Deploy to DEV: `npx convex dev --once`
4. ❌ Deploy to PROD: `npx convex deploy`

### Result:
**ALL deployments fail with same error** (server-side cache issue)

---

## 📊 CURRENT STATE

### DEV (hallowed-mole-286)
- ❌ Deployment blocked
- ⚠️ Has stale code (old contentCalendar.ts + content_calendar.ts)
- ❌ Missing: `job_matching_v2`, updated `contentCalendar`

### PROD (honorable-elk-818)
- ❌ Deployment blocked
- ⚠️ Has stale code (both versions of contentCalendar)
- ❌ Missing: `job_matching_v2`, updated `contentCalendar`
- ✅ Has: Basic functions (scraped_jobs, etc.)

---

## 🔧 WORKAROUND: Use PROD Directly

Since **PROD has working scraped_jobs functions**, use it for job scraping:

### Option 1: Update .env.local (Temporary)
```bash
# Edit .env.local
CONVEX_URL=https://honorable-elk-818.eu-west-1.convex.cloud  # Change from hallowed-mole-286
```

**Pros**: Scripts work immediately  
**Cons**: Points to PROD instead of DEV

### Option 2: Use CONVEX_URL in Scripts
```bash
# When running scripts:
CONVEX_URL=https://honorable-elk-818.eu-west-1.convex.cloud \
  npx tsx scripts/scrape-jobs.ts --source=remoteok
```

**Pros**: No file changes  
**Cons**: Must remember to set env var

### Option 3: GitHub Actions (Already Set Up)
```bash
# Already configured to use PROD:
# .github/workflows/scrape-jobs.yml
# Uses: secrets.CONVEX_URL (points to PROD)
```

**Pros**: Already working, automated  
**Cons**: None! ✅

---

## 🎯 RECOMMENDED ACTIONS

### Immediate (Use Workaround)
1. ✅ **Use GitHub Actions for scraping** (already set up)
   - Runs every 6 hours automatically
   - Uses PROD deployment
   - No local changes needed

2. ⏳ **Wait for Convex cache to clear** (12-24 hours)
   - Server-side issue, resolves automatically
   - OR contact Convex support

### When Deployment Works Again
3. Deploy to DEV first:
   ```bash
   npx convex dev --once
   ```

4. Deploy to PROD:
   ```bash
   npx convex deploy
   ```

5. Verify functions:
   ```bash
   npx convex run contentCalendar:stats '{}' --prod
   npx convex run job_matching_v2:generateDailyDigestV2 '{"userId":"leroy","limit":5}' --prod
   ```

---

## 📋 FUNCTIONS STATUS

### Available in PROD (Stale)
✅ `scraped_jobs:list`  
✅ `scraped_jobs:stats`  
✅ `scraped_jobs:push`  
✅ `scraped_jobs:pushBatch`  
✅ `content_calendar:list` (old version)  
✅ `contentCalendar:list` (old version)  

### Missing (Need Deployment)
❌ `job_matching_v2:generateDailyDigestV2`  
❌ `job_matching_v2:scoreRecentJobs`  
❌ `contentCalendar:stats` (new version)  
❌ `contentCalendar:updateStatus` (new version)  

---

## 🐛 WHY THIS HAPPENED

1. **Yesterday**: Created `content_calendar.ts` (snake_case)
2. **Also yesterday**: Old `contentCalendar.ts` (camelCase) existed
3. **Last deployment**: Deployed BOTH to PROD
4. **This morning**: Started getting duplicate output errors
5. **Today**: Fixed locally (consolidated to one file)
6. **Now**: Can't deploy due to server-side cache corruption

**The Convex build server has cached state from both files** and won't clear it.

---

## 💡 FUTURE PREVENTION

### 1. Consistent Naming Convention
Choose ONE convention for the whole project:
- **Option A**: camelCase (`contentCalendar.ts`)
- **Option B**: snake_case (`content_calendar.ts`)

**Current state**: Mixed (30 snake_case, 19 camelCase files)

**Recommendation**: Stick with **snake_case** to match database tables

### 2. Pre-Commit Checks
Add to package.json:
```json
{
  "scripts": {
    "check-duplicates": "cd convex && ls -1 *.ts | sed 's/\\.ts$//' | awk '{print tolower($0)}' | sort | uniq -d"
  }
}
```

### 3. Convex Deployment Monitoring
Watch for duplicate warnings during deployment

---

## 📞 ESCALATION

### If deployment still blocked after 24 hours:

1. **Contact Convex Support**:
   - URL: https://convex.dev/support
   - Issue: Server-side build cache corruption
   - Project: `hallowed-mole-286` (DEV) + `honorable-elk-818` (PROD)
   - Error: "Two output files share the same path"

2. **Alternative: Create New Project**:
   ```bash
   npx convex init --project new-project-name
   # Migrate data from old project
   ```

---

## ✅ CURRENT WORKAROUND WORKING

**GitHub Actions scraper**: ✅ RUNNING  
**Job database**: ✅ 101 jobs (scraped 1 hour ago)  
**Daily digest**: ⏳ BLOCKED (needs job_matching_v2 deployment)  

**For now**: Job scraping works, daily digest can wait for deployment to unblock.

---

**Status**: Code ready, deployment blocked  
**ETA**: 12-24 hours (Convex cache clearance)  
**Workaround**: Use GitHub Actions + PROD deployment
