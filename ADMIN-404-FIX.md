# 🔴 CRITICAL: Admin Dashboard 404 on Protected Routes

**Status**: Domain pointing to wrong Vercel project  
**Issue**: admin.leroysteding.nl serves old deployment missing /dashboard, /jobs, etc.  
**Root Cause**: Domain aliased to `social-intelligence-admin` instead of `admin` project

---

## Problem Diagnosis

### Current Deployment (WRONG)
```
$ vercel inspect https://admin.leroysteding.nl

Project: social-intelligence-admin ❌
Status: Ready (but old/incomplete)
Routes: Only /sign-in works, /dashboard → 404
Builds: . [0ms] ← NO BUILD, serving cached old deployment
```

### Local Build (CORRECT)
```
$ pnpm build
✓ Compiled successfully
✓ 24 routes generated:
  ○ /dashboard ✅
  ○ /jobs ✅
  ○ /analytics ✅
  ... all routes present
```

### Linked Project (CORRECT)
```
$ cat apps/admin/.vercel/project.json
{
  "projectId": "prj_cQCA4VAWtHpcACwnn2c6j7Toa3Nh",
  "projectName": "admin" ✅
}
```

**Conclusion**: Code is correct, local build works, but domain points to wrong project.

---

## Root Cause

The domain `admin.leroysteding.nl` was previously assigned to `social-intelligence-admin` project and was never moved to the new `admin` project.

**Evidence**:
```bash
$ vercel inspect https://admin.leroysteding.nl
name: social-intelligence-admin  # WRONG PROJECT
url: https://social-intelligence-admin-67xeq8spt-hifive-team.vercel.app
aliases:
  - https://admin.leroysteding.nl  # Domain is here!
```

---

## Fix: 3-Step Process (15 minutes)

### Step 1: Configure Root Directory (Required First)

The `admin` project deployments are currently failing. Must fix this first:

1. **Open**: https://vercel.com/hifive-team/admin/settings
2. **Go to**: Settings → General → **Root Directory**
3. **Click**: Edit
4. **Set to**: `apps/admin`
5. **✅ Enable**: "Include source files outside of the Root Directory in the Build Step"
6. **Click**: Save

**Why needed**: Tells Vercel the app is in `apps/admin/` subdirectory for monorepo.

### Step 2: Deploy to Admin Project

Trigger a fresh deployment to the `admin` project:

```bash
cd ~/Projects/personal/leroy-steding-portfolio/apps/admin
vercel --prod
```

**Expected output**:
```
✓ Deploying to production...
✓ Building...
✓ Compiled successfully in 60s
✓ 24 routes generated
✓ Deployment ready: https://admin-xxxx-hifive-team.vercel.app
```

**Verify deployment**:
```bash
curl -I https://admin-xxxx-hifive-team.vercel.app/dashboard
# Should return: HTTP/2 200
```

### Step 3: Move Domain to Admin Project

#### Option A: Remove from old project, add to new (Recommended)

1. **Remove from social-intelligence-admin**:
   - Go to: https://vercel.com/hifive-team/social-intelligence-admin/settings/domains
   - Find: `admin.leroysteding.nl`
   - Click: Remove

2. **Add to admin project**:
   - Go to: https://vercel.com/hifive-team/admin/settings/domains
   - Click: Add Domain
   - Enter: `admin.leroysteding.nl`
   - Click: Add

#### Option B: Reassign via Vercel CLI

```bash
cd ~/Projects/personal/leroy-steding-portfolio/apps/admin

# Remove from old project
vercel domains rm admin.leroysteding.nl --scope hifive-team

# Add to new project
vercel domains add admin.leroysteding.nl --scope hifive-team
```

**DNS**: No changes needed (already points to Vercel)

---

## Verification Checklist

After completing all 3 steps:

- [ ] Root Directory set to `apps/admin` in admin project settings
- [ ] Fresh deployment to admin project succeeds (~60s build time)
- [ ] Deployment shows 24 routes built (not 0ms)
- [ ] Test deployment URL directly:
  ```bash
  curl -I https://admin-xxxx-hifive-team.vercel.app/dashboard
  # Expected: HTTP/2 200
  ```
- [ ] Domain removed from `social-intelligence-admin` project
- [ ] Domain added to `admin` project
- [ ] Test final URL:
  ```bash
  curl -I https://admin.leroysteding.nl/dashboard
  # Expected: HTTP/2 200 (not 404)
  ```
- [ ] Access https://admin.leroysteding.nl/dashboard in browser
- [ ] Verify /jobs, /analytics, /content routes work

---

## Why This Happened

**Timeline**:
1. Originally had `social-intelligence-admin` project with domain
2. Created new `admin` project for monorepo restructure
3. Linked local code to new `admin` project (.vercel/project.json)
4. But forgot to move domain from old project to new project
5. Old project served cached deployment (missing new routes)

**Key insight**: Vercel CLI `vercel link` and `.vercel/project.json` only affect WHERE deployments go, not WHERE domains point. Domains must be moved manually in dashboard or CLI.

---

## Expected Result

After fix:

✅ **https://admin.leroysteding.nl** routes:
- `/` → Homepage (200)
- `/sign-in` → Clerk sign-in (200) ✅ Already works
- `/dashboard` → Main dashboard (200) ← Fixed
- `/jobs` → Job applications Kanban (200) ← Fixed
- `/content` → Content calendar (200) ← Fixed
- `/analytics` → Analytics dashboard (200) ← Fixed
- All 24 routes working

✅ **Build output**:
```
Route (app)
├ ○ /dashboard
├ ○ /jobs
├ ○ /analytics
└ ... (24 total routes)
```

✅ **Deployment status**:
- Project: admin (not social-intelligence-admin)
- Status: Ready (not Error)
- Build time: ~60s (not 0ms)
- Routes: 24 (not cached)

---

## Troubleshooting

### If Step 1 (Root Directory) still fails:

Check build logs:
```bash
cd apps/admin
vercel logs https://admin-xxxx-hifive-team.vercel.app
```

Look for:
- ❌ "No Next.js version detected" → Root Directory not set
- ❌ "Module not found" → Build command incorrect
- ✅ "Compiled successfully" → Root Directory working

### If domain move doesn't propagate:

DNS/CDN cache may take 1-5 minutes. Force refresh:
```bash
# Clear Vercel edge cache
curl -X PURGE https://admin.leroysteding.nl/dashboard

# Or wait 5 minutes for propagation
```

### If /dashboard still 404 after domain move:

1. Verify deployment has the routes:
   ```bash
   vercel inspect https://admin.leroysteding.nl | grep dashboard
   ```

2. Check middleware isn't blocking:
   ```bash
   curl -H "Authorization: Bearer fake" https://admin.leroysteding.nl/dashboard
   # Should redirect to /sign-in, not 404
   ```

3. Try incognito/private window (clear browser cache)

---

## Related Issues

**STE-29**: Original admin deployment issue (Root Directory)  
**Fix applied**: vercel.json updated (commit cdd8299)  
**Status**: Code fixes done, waiting for Root Directory config

**This issue (STE-30)**: Wrong project serving domain  
**Fix needed**: Move domain from social-intelligence-admin → admin

---

## Support Links

**Admin Project**:
- Settings: https://vercel.com/hifive-team/admin/settings
- Domains: https://vercel.com/hifive-team/admin/settings/domains
- Deployments: https://vercel.com/hifive-team/admin/deployments

**Old Project (social-intelligence-admin)**:
- Domains: https://vercel.com/hifive-team/social-intelligence-admin/settings/domains

**Vercel Docs**:
- Domains: https://vercel.com/docs/projects/domains
- Root Directory: https://vercel.com/docs/projects/project-configuration#root-directory

---

## Summary

**Problem**: Domain pointing to old project with incomplete deployment  
**Solution**: Configure Root Directory + Deploy to correct project + Move domain  
**ETA**: 15 minutes (5min per step)  
**Risk**: Low (can revert domain if issues)  
**Impact**: Makes all admin routes accessible

**Next Action**: Follow 3-step fix above in order (Root Directory → Deploy → Move Domain)
