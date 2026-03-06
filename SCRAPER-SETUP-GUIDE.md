# 🚀 Job Scraper Setup Guide (STE-32)

**Date**: 2026-03-06 10:15 CET  
**Status**: Ready to activate  
**ETA**: 5 minutes

---

## ✅ COMPLETED

- [x] Created GitHub Actions workflow (`.github/workflows/scrape-jobs.yml`)
- [x] Disabled broken Convex crons
- [x] Committed and pushed to main
- [x] Tests passing (47/47)

---

## 🔐 REQUIRED: Add GitHub Secret (2 min)

### Step 1: Open GitHub Secrets Page
Go to: https://github.com/LeroySteding/leroy-steding-portfolio/settings/secrets/actions

### Step 2: Add New Secret
1. Click **"New repository secret"**
2. **Name**: `CONVEX_URL`
3. **Value**: `https://honorable-elk-818.eu-west-1.convex.cloud`
4. Click **"Add secret"**

---

## 🧪 TEST: Run Workflow Manually (3 min)

### Step 1: Open Actions Tab
Go to: https://github.com/LeroySteding/leroy-steding-portfolio/actions

### Step 2: Select Workflow
1. Click **"Scrape Jobs"** in the left sidebar
2. Click **"Run workflow"** (top right)
3. Leave source as `remoteok` (default)
4. Click **"Run workflow"** (green button)

### Step 3: Monitor Execution
1. Click on the running workflow (yellow dot)
2. Click **"scrape-jobs"** to see logs
3. Wait ~2 minutes for completion

### Step 4: Verify Success
Expected output in logs:
```
🚀 Multi-Source Job Scraper
   Sources: remoteok
   
📦 Running remoteok scraper...
🔍 Starting RemoteOK scrape...
📄 Found 100+ jobs from RemoteOK API
✨ RemoteOK scrape complete!
   Jobs found: 96
   Jobs saved: 0-96 (depends on duplicates)
   
✅ remoteok scraper complete!
```

---

## ✅ VERIFY: Check Database (1 min)

### After workflow completes, run:
```bash
cd ~/Projects/personal/leroy-steding-portfolio
npx convex run scraped_jobs:stats '{}' --prod
```

**Expected**:
```json
{
  "active": 96+,
  "scrapedLast24h": 96+,
  "bySource": {
    "remoteok": 96+
  }
}
```

---

## 📅 AUTOMATIC SCHEDULE

Once the secret is added, the workflow will run **automatically every 6 hours**:
- 00:00 UTC (01:00 CET)
- 06:00 UTC (07:00 CET)
- 12:00 UTC (13:00 CET)
- 18:00 UTC (19:00 CET)

**Next automatic run**: ~6 hours from now

---

## 🚨 TROUBLESHOOTING

### Issue: Workflow fails with "Unauthorized"
**Cause**: GitHub secret not set or wrong value  
**Fix**: Double-check secret name is `CONVEX_URL` (exact case)

### Issue: Workflow fails with "403 Forbidden"
**Cause**: RemoteOK blocking GitHub Actions IPs (unlikely)  
**Fix**: Add residential proxy or use different scraper source

### Issue: No new jobs saved
**Cause**: All jobs are duplicates (already in database)  
**Fix**: This is normal! Check `scrapedAt` timestamps to verify updates

### Issue: Workflow doesn't trigger automatically
**Cause**: GitHub Actions cron can have up to 15 min delay  
**Fix**: Wait 15 minutes past scheduled time, or trigger manually

---

## 📊 MONITORING

### Check Workflow Status
https://github.com/LeroySteding/leroy-steding-portfolio/actions/workflows/scrape-jobs.yml

### Check Latest Run
https://github.com/LeroySteding/leroy-steding-portfolio/actions

### Check Database Stats
```bash
npx convex run scraped_jobs:stats '{}' --prod
```

### View Recent Jobs
```bash
npx convex run scraped_jobs:list '{"source": "remoteok", "limit": 5}' --prod
```

---

## 🎉 SUCCESS CRITERIA

✅ GitHub secret added  
✅ Manual workflow run succeeds  
✅ Database shows new jobs (or updated timestamps)  
✅ Workflow scheduled for every 6 hours  
✅ No errors in logs

**Once all checkboxes are complete, the scraper infrastructure is OPERATIONAL!**

---

## 🔮 NEXT STEPS (Optional)

### Short-term Improvements
1. **Add Adzuna scraper** (higher quality jobs)
   - Get API credentials from https://developer.adzuna.com/
   - Add to GitHub secrets
   - Update workflow to include Adzuna

2. **Add monitoring alerts**
   - Slack/Discord webhook on failure
   - Email notifications
   - Database health checks

### Long-term Enhancements
3. **Multi-source strategy**
   - Indeed scraper (Puppeteer)
   - LinkedIn API (when available)
   - AngelList jobs

4. **Advanced features**
   - Job deduplication across sources
   - Smart scheduling (scrape more during business hours)
   - Quality scoring (filter low-quality postings)

---

## 📞 SUPPORT

**If you encounter issues**:
1. Check GitHub Actions logs for errors
2. Verify Convex URL is correct
3. Test manual scraper locally: `npx tsx scripts/scrape-jobs.ts --source=remoteok`
4. Check database state: `npx convex run scraped_jobs:stats '{}' --prod`

**Documentation**:
- Full architecture: `docs/SCRAPER-INFRASTRUCTURE-FIX.md`
- This setup guide: `SCRAPER-SETUP-GUIDE.md`

---

**Status**: ⏳ Awaiting GitHub secret setup  
**Time to complete**: 5 minutes  
**Impact**: Restores job scraping after 4-day outage
