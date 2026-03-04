# 🔴 CRITICAL: Admin Dashboard 404 - Final Solution

**Updated**: 2026-03-04 14:05 GMT+1  
**Status**: App loads but all routes return 404  
**Root Cause**: Wrong deployment serving domain + Build failures on correct project

---

## 🔍 Current Situation

### What's Working ✅
- App loads (title "Portfolio Admin - Leroy Steding" appears)
- Local build works perfectly (all 24 routes in routes-manifest.json)
- Code is correct (src/app structure is fine)
- vercel.json is correctly configured

### What's Broken ❌
- All routes return 404 (x-matched-path: /404)
- Domain points to `social-intelligence-admin` (old project with cached build)
- `admin` project deployments failing with "No Next.js version detected"

---

## 📊 Investigation Results

### Current Domain Status
```bash
$ vercel inspect admin.leroysteding.nl
Project: social-intelligence-admin ❌ WRONG!
Builds: . [0ms] ← NO BUILD, cached deployment
Routes: Only old routes, missing /dashboard, /jobs, etc.
```

### Admin Project Status
```bash
$ vercel ls --yes
Project: admin ✅ CORRECT
Latest: admin-11cvpltwr-hifive-team.vercel.app
Status: ● Error
Duration: 6s (should be ~60s)
Error: No Next.js version detected
```

### Build Error Analysis
```
✓ Install: cd ../.. && pnpm install --frozen-lockfile (works!)
✓ pnpm-lock.yaml found
❌ Framework Detection: Can't find "next" in package.json
❌ Build: Not reached (framework detection failed)
```

**Why**: Vercel looks for `next` at deployment directory level, but our Next.js app is in `apps/admin/package.json`

---

## ✅ SOLUTION: 3-Step Fix (Simplified)

### STEP 1: Set Root Directory to Repository Root

This is a **project setting** that must be configured in Vercel dashboard:

1. **Open**: https://vercel.com/hifive-team/admin/settings
2. **Go to**: Settings → General → **Root Directory**  
3. **Click**: Edit
4. **Set to**: Leave **EMPTY** or set to `.` (dot)
   - ⚠️ **DO NOT** set to `apps/admin`
5. **Click**: Save

**Why this works**:
- Vercel starts at repository root
- Our vercel.json has `cd ../..` which is now redundant but harmless
- Vercel can find Next.js in `apps/admin/package.json` via outputDirectory context
- Install finds pnpm-lock.yaml at root

### STEP 2: Deploy Fresh Build

After Root Directory is configured:

```bash
cd ~/Projects/personal/leroy-steding-portfolio/apps/admin
vercel --prod --yes
```

**Expected output**:
```
✓ Install: cd ../.. && pnpm install --frozen-lockfile
✓ Already up-to-date
✓ Detected Next.js version (now works!)
✓ Build: cd ../.. && pnpm turbo run build --filter=@steding/admin
✓ Compiled successfully in ~60s
✓ 24 routes generated
✓ Deployment ready: https://admin-xxxx-hifive-team.vercel.app
```

**Verify routes work**:
```bash
curl -I https://admin-xxxx-hifive-team.vercel.app/dashboard
# Expected: HTTP/2 200 or 302 (redirect to /sign-in)
```

### STEP 3: Move Domain to Admin Project

Once deployment succeeds:

**Option A - Vercel Dashboard**:
1. Remove from old:  
   https://vercel.com/hifive-team/social-intelligence-admin/settings/domains  
   → Find `admin.leroysteding.nl` → Remove

2. Add to new:  
   https://vercel.com/hifive-team/admin/settings/domains  
   → Add Domain → `admin.leroysteding.nl`

**Option B - Vercel CLI**:
```bash
vercel domains rm admin.leroysteding.nl --scope hifive-team
cd ~/Projects/personal/leroy-steding-portfolio/apps/admin
vercel domains add admin.leroysteding.nl --scope hifive-team
```

---

## ✅ Verification

### Test deployment URL:
```bash
curl -I https://admin-xxxx-hifive-team.vercel.app/dashboard
# Expected: HTTP/2 200 or 302 (redirect to sign-in)
```

### Test custom domain:
```bash
curl -I https://admin.leroysteding.nl/dashboard
# Expected: HTTP/2 200 or 302 (NOT 404)
```

### Browser test (should redirect to /sign-in if not authenticated):
- ✅ https://admin.leroysteding.nl/
- ✅ https://admin.leroysteding.nl/dashboard
- ✅ https://admin.leroysteding.nl/jobs
- ✅ https://admin.leroysteding.nl/analytics
- ✅ https://admin.leroysteding.nl/content

---

## 🔧 Technical Details

### Local Build (Works)
```bash
$ cd ~/Projects/personal/leroy-steding-portfolio/apps/admin
$ pnpm build
✓ Compiled successfully
✓ 24 routes generated:
  ○ / (redirects to /dashboard)
  ○ /dashboard
  ○ /jobs
  ○ /analytics
  ... etc.
```

### Routes Manifest
```json
{
  "staticRoutes": [
    { "page": "/", "regex": "^/(?:/)$" },
    { "page": "/dashboard", "regex": "^/dashboard(?:/)$" },
    { "page": "/jobs", "regex": "^/jobs(?:/)$" },
    ...
  ]
}
```

### App Structure
```
apps/admin/
├── src/
│   ├── app/
│   │   ├── (admin)/          ← Protected routes
│   │   │   ├── dashboard/
│   │   │   ├── jobs/
│   │   │   ├── analytics/
│   │   │   └── ...
│   │   ├── (auth)/            ← Auth routes
│   │   │   ├── sign-in/
│   │   │   └── sign-up/
│   │   ├── layout.tsx
│   │   └── page.tsx           ← Root (redirects to /dashboard)
│   └── middleware.ts          ← Clerk auth protection
├── next.config.ts
└── vercel.json
```

### Current vercel.json
```json
{
  "buildCommand": "cd ../.. && pnpm turbo run build --filter=@steding/admin",
  "installCommand": "cd ../.. && pnpm install --frozen-lockfile",
  "outputDirectory": "../../apps/admin/.next",
  "framework": "nextjs"
}
```

**Note**: The `cd ../..` commands work fine once Root Directory is set to repository root (empty).

---

## 🎯 Why Previous Attempts Failed

1. **First attempt**: Tried to set Root Directory to `apps/admin`  
   ❌ Failed: Commands do `cd ../..` which goes above repo root

2. **Second attempt**: Updated vercel.json with `cd ../..`  
   ✅ Install works  
   ❌ Framework detection still fails (needs Root Directory)

3. **Third attempt** (pending): Set Root Directory to empty/`.`  
   ✅ Should work: Commands run from repo root, can find everything

---

## 📄 Related Documentation

- `ADMIN-DEPLOYMENT-SOLUTION.md` - Complete diagnosis (previous)
- `ADMIN-CRITICAL-FIX.md` - Root Directory issue (original)
- `ADMIN-404-FIX.md` - Domain pointing to wrong project

**Latest commit**: `6ffe86e` - Fixed vercel.json monorepo config

---

## ⏱️ Timeline

**2026-03-04 09:00** - First report (404 on all routes)  
**2026-03-04 11:00** - Fixed vercel.json (commit 6ffe86e)  
**2026-03-04 14:00** - App confirmed loading but routes 404  
**2026-03-04 14:05** - Final diagnosis: Domain + Root Directory issues  

---

## 🚨 CRITICAL NEXT STEPS

1. ✅ **Root Directory**: Set to empty in Vercel dashboard (5 min)
2. ✅ **Deploy**: Trigger fresh deployment (5 min)
3. ✅ **Domain**: Move from social-intelligence-admin → admin (5 min)

**Total ETA**: 15 minutes  
**Blocker**: Requires Vercel dashboard access  
**Risk**: Low (all changes reversible)  
**Priority**: CRITICAL

---

## 📞 Support

**Admin Project**: https://vercel.com/hifive-team/admin  
**Old Project**: https://vercel.com/hifive-team/social-intelligence-admin  
**Vercel Docs**: https://vercel.com/docs/projects/project-configuration#root-directory
