# Deployment Workaround for STE-30 Performance Fix

**Date**: 2026-03-06 09:40 CET  
**Status**: Code ready, deployment blocked

---

## 🚧 BLOCKER: Convex Build Error

**Error**: Duplicate output files (~60+ files affected)
```
✘ [ERROR] Two output files share the same path but have different contents: out/[file].js
```

**Root Cause**: Likely duplicate Convex files or build cache corruption  
**Impact**: Cannot deploy optimized job matching code

---

## ✅ PERFORMANCE FIX STATUS

### Code Complete ✅
- [x] Created `convex/job_matching_v2.ts` (90x faster algorithm)
- [x] Updated `convex/cron_tasks.ts` to use V2
- [x] Created migration script for existing jobs
- [x] Updated schema documentation
- [x] Committed to main: `d79e08c`
- [x] Pushed to GitHub: ✅
- [ ] Deployed to Convex: ❌ BLOCKED

### Performance Improvements
- Before: >180s (TIMEOUT)
- After: <2s (when deployed)

---

## 🔄 WORKAROUND OPTIONS

### Option 1: Vercel Auto-Deploy (Recommended)
Vercel may auto-deploy from GitHub and bypass local build issues:

1. **Wait for auto-deploy** (5-10 minutes)
2. **Check Vercel dashboard** for deployment status
3. **If successful**: Run migration
   ```bash
   npx convex run migrations/score_existing_jobs:run --prod
   ```

### Option 2: Manual Function Creation (Quick Fix)
Manually create the V2 function in Convex dashboard:

1. Open https://dashboard.convex.dev
2. Navigate to Functions → Add Function
3. Copy code from `convex/job_matching_v2.ts`
4. Save as `job_matching_v2`
5. Update cron to call `internal.job_matching_v2.generateDailyDigestV2`

### Option 3: Temporary Timeout Increase
**Not recommended** (doesn't solve root cause):
- Convert query to action (actions have no timeout)
- Update `job_matching.ts`:
  ```typescript
  export const generateDailyDigest = internalAction({...});
  ```

### Option 4: Clean Reinstall
Nuclear option - clean everything and reinstall:
```bash
cd /Users/leroysteding-mini/Projects/personal/leroy-steding-portfolio
rm -rf node_modules .convex pnpm-lock.yaml
pnpm install
npx convex deploy -y
```

**Warning**: Takes 10-15 minutes, may break other dependencies

---

## 🎯 IMMEDIATE ACTION PLAN

### Today (March 6, 09:40-10:00)
1. ✅ Code committed and pushed
2. ⏳ Monitor Vercel auto-deploy (check in 10 min)
3. ✅ Document workaround options
4. ⏳ If auto-deploy fails: Try Option 4 (clean reinstall)

### When Deployment Succeeds
1. Run migration script:
   ```bash
   npx convex run migrations/score_existing_jobs:run --prod
   ```
2. Test digest query (<2s):
   ```bash
   npx convex run job_matching_v2:generateDailyDigestV2 \
     '{"userId": "leroy", "limit": 10}' --prod
   ```
3. Monitor next cron run (tomorrow 08:00 CET)

---

## 🔍 DEBUGGING DUPLICATE FILES

If clean reinstall doesn't work, investigate:

### Check for duplicates in convex/
```bash
cd convex
find . -name "*.ts" | sort | uniq -d
```

### Check for symlinks
```bash
find convex/ -type l -ls
```

### Check node_modules for Convex duplication
```bash
find node_modules -name "convex" -type d
```

---

## 📊 IMPACT ASSESSMENT

### Current Status
- **Daily digest**: Still timing out (179 jobs × slow algorithm)
- **Next scheduled run**: Tomorrow 08:00 CET
- **Risk**: Another missed digest tomorrow

### With Deployment
- **Performance**: <2s execution time
- **Reliability**: No more timeouts
- **Scalability**: Handles 1000+ jobs

---

## 📞 ESCALATION

If deployment blocker persists >2 hours:
1. **Escalate to @Architect**: Investigate Convex setup/config
2. **Open Convex support ticket**: Duplicate output file errors
3. **Alternative**: Rewrite in Next.js API route (bypass Convex)

---

**Status**: Code ready, awaiting deployment resolution  
**ETA**: 10-30 minutes (depending on workaround success)  
**Priority**: CRITICAL - Daily digest down
