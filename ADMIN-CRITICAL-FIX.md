# 🔴 CRITICAL: Admin Dashboard 404 - Root Directory Configuration Required

**Status**: BLOCKED - Requires manual Vercel dashboard configuration  
**Issue**: admin.leroysteding.nl returns 404  
**Root Cause**: Vercel Root Directory not configured (cannot be set via vercel.json)

---

## Problem Summary

Admin deployments are **failing to build** (6-7s duration, should be ~60s):

```
Error: No Next.js version detected. Make sure your package.json has "next" 
in either "dependencies" or "devDependencies". Also check your Root Directory 
setting matches the directory of your package.json file.
```

**Why**: Vercel is running the build from **monorepo root** instead of `apps/admin`:
1. Install: `pnpm install` (runs at root ✅)
2. Vercel checks: root `package.json` for `next` ❌  
3. But `next` is only in: `apps/admin/package.json`
4. Build fails immediately (no pages built)

---

## Required Manual Configuration (5 minutes)

### CRITICAL: Set Root Directory in Vercel Dashboard

**This setting CANNOT be configured via vercel.json or code - MUST be done in dashboard:**

1. **Open Vercel Project Settings**:  
   https://vercel.com/hifive-team/admin/settings

2. **Navigate to**: Settings → General

3. **Find section**: Root Directory

4. **Click**: Edit

5. **Set Root Directory to**: `apps/admin`

6. **✅ Enable checkbox**:  
   "Include source files outside of the Root Directory in the Build Step"  
   (This allows access to monorepo root for shared packages)

7. **Click**: Save

### What This Does

```
Before (CURRENT - BROKEN):
├── package.json          ← Vercel looks here (no "next" found ❌)
├── apps/
│   └── admin/
│       └── package.json  ← "next" is actually here

After (CORRECT):
├── package.json          ← Vercel can access for install
├── apps/
│   └── admin/            ← ROOT DIRECTORY SET HERE
│       └── package.json  ← Vercel looks here for "next" ✅
```

---

## After Configuration: Add Custom Domain

Once build succeeds (Step 1 complete):

1. **Go to Domains**:  
   https://vercel.com/hifive-team/admin/settings/domains

2. **Click**: Add Domain

3. **Enter**: `admin.leroysteding.nl`

4. **Click**: Add

**DNS is already configured** ✅:
```bash
$ dig +short admin.leroysteding.nl
e1a6df048cd6e790.vercel-dns-016.com
216.150.16.193
```

---

## Trigger New Deployment

After Root Directory is configured:

```bash
cd ~/Projects/personal/leroy-steding-portfolio/apps/admin
vercel --prod
```

Or wait for auto-deployment from next Git push.

---

## What I've Already Fixed (Code-Side)

✅ **Updated `apps/admin/vercel.json`** (commit `cdd8299`):
```json
{
  "buildCommand": "pnpm turbo run build --filter=@steding/admin",
  "installCommand": "pnpm install --frozen-lockfile",
  "outputDirectory": ".next",
  "framework": "nextjs"
}
```

✅ **Verified local build works**:
```bash
$ pnpm --filter @steding/admin build
# ✓ Compiled successfully in 2.4s
# Route (app) - 24 pages generated
```

✅ **Tests passing**: 47/47 ✅

✅ **Pushed to GitHub**: Commits `cdd8299`, `e466e8b`

**These fixes are correct but INSUFFICIENT without Root Directory setting.**

---

## Expected Result After Fix

### Build Output (should see):
- ✅ Build time: ~60 seconds (not 6s)
- ✅ Status: Ready (not Error)  
- ✅ Pages: 24 routes generated
- ✅ Output: `.next` directory created

### URLs (should work):
- ✅ `https://admin.leroysteding.nl` → Admin dashboard
- ✅ `https://admin-hifive-team.vercel.app` → Auto-alias
- ✅ `https://admin-leroysteding-hifive-team.vercel.app` → Auto-alias

---

## Current Deployment Status

**Admin Project** (https://vercel.com/hifive-team/admin):
- Name: `admin`
- Organization: `hifive-team`
- Latest Deployment: https://admin-2xxhj2bkd-hifive-team.vercel.app
- Status: ● Error
- Error: "No Next.js version detected"
- Build Duration: 6s (should be ~60s)
- Builds: `╶ . [0ms]` ← **NO BUILD HAPPENED**

**Portfolio Project** (https://vercel.com/hifive-team/leroy-steding-portfolio):
- Status: ✅ Working
- URL: https://www.leroysteding.nl (HTTP 200)

---

## Why vercel.json Alone Doesn't Fix This

Common misconception: "Root Directory can be configured in vercel.json"

**Reality**:
- ❌ `vercel.json` cannot set Root Directory
- ✅ `vercel.json` can set buildCommand, installCommand, outputDirectory
- ✅ Root Directory is a **project-level setting** (not deployment config)
- ✅ Must be set in Vercel dashboard under Project Settings

**From Vercel docs**:
> Root Directory: The directory within your repository where your app's package.json is located. This setting is required for monorepos. **This must be configured in Project Settings.**

---

## Alternative: Deploy from Monorepo Root (Not Recommended)

If Root Directory configuration doesn't work:

### Option A: Detect Next.js at Root
Add to root `package.json`:
```json
{
  "devDependencies": {
    "next": "workspace:*"
  }
}
```

**Downside**: Dirty hack, pollutes root dependencies

### Option B: Use Turbo Build from Root
Keep Root Directory empty, use:
```json
{
  "buildCommand": "pnpm turbo run build --filter=@steding/admin",
  "outputDirectory": "apps/admin/.next"
}
```

**Downside**: 
- Uploads entire monorepo (slower)
- Larger deployment size
- Framework detection may fail

**Recommendation**: Use proper Root Directory configuration (primary solution above).

---

## Verification Checklist

After applying the fix:

- [ ] Root Directory set to `apps/admin` in Vercel dashboard
- [ ] "Include source files outside Root Directory" enabled
- [ ] New deployment triggered (manual or auto-deploy)
- [ ] Build succeeds (~60s duration)
- [ ] Build shows: `Route (app)` with 24 pages
- [ ] Auto-aliases work: `admin-hifive-team.vercel.app` (HTTP 200)
- [ ] Custom domain added: `admin.leroysteding.nl`
- [ ] Custom domain returns HTTP 200 (not 404)
- [ ] Admin dashboard loads correctly
- [ ] Can access: Jobs, Content, Analytics pages

---

## Support & Documentation

**Vercel Project URLs**:
- Settings: https://vercel.com/hifive-team/admin/settings
- Deployments: https://vercel.com/hifive-team/admin/deployments
- Domains: https://vercel.com/hifive-team/admin/settings/domains

**Vercel Docs**:
- Root Directory: https://vercel.com/docs/projects/project-configuration#root-directory
- Monorepos: https://vercel.com/docs/monorepos

**Related Files**:
- `apps/admin/vercel.json` (buildCommand, outputDirectory)
- `apps/admin/package.json` (contains "next" dependency)
- `.vercel/project.json` (root - links to portfolio project)
- `apps/admin/.vercel/project.json` (will be created after linking)

---

## Timeline

**2026-03-04 09:05** - Latest deployment attempted  
**2026-03-04 09:06** - Deployment failed (6s)  
**2026-03-04 09:31** - Issue escalated (user report)  
**2026-03-04 09:41** - Root cause identified  

**Next Action**: Configure Root Directory in Vercel dashboard (5 minutes)  
**ETA**: Admin live within 10 minutes of configuration

---

**Priority**: CRITICAL  
**Blocker**: Requires Vercel dashboard access  
**Impact**: Admin features unavailable (Jobs Kanban, Content Calendar, Analytics)  
**Risk**: LOW (portfolio unaffected, safe to configure)
