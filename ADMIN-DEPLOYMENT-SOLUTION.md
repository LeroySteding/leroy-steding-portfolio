# 🔴 CRITICAL: Admin Dashboard 404 - Complete Solution

**Status**: Diagnosed - Requires Vercel Dashboard Configuration  
**Root Cause**: Two issues found and one partially fixed  
**ETA**: 10 minutes after dashboard access

---

## 🔍 Diagnosis Complete

### Issue #1: Monorepo Build Configuration ✅ FIXED
**Problem**: pnpm-lock.yaml not found during install  
**Root Cause**: Vercel running commands from `apps/admin/` but lockfile is at monorepo root  
**Fix Applied**: Updated vercel.json (commit `6ffe86e`)

```json
{
  "buildCommand": "cd ../.. && pnpm turbo run build --filter=@steding/admin",
  "installCommand": "cd ../.. && pnpm install --frozen-lockfile",
  "outputDirectory": "../../apps/admin/.next"
}
```

**Result**: Install now works ✅ but Next.js detection fails ❌

### Issue #2: Next.js Detection Failure ⚠️ NEEDS DASHBOARD FIX
**Problem**: `No Next.js version detected`  
**Root Cause**: Vercel looks for `next` in root package.json, but it's only in `apps/admin/package.json`  
**Fix Required**: Set **Root Directory** in Vercel dashboard (cannot be done via code)

### Issue #3: Wrong Domain Assignment ⚠️ NEEDS MANUAL FIX
**Problem**: `admin.leroysteding.nl` points to `social-intelligence-admin` project  
**Root Cause**: Domain was never moved when creating new `admin` project  
**Fix Required**: Remove domain from old project, add to new project

---

## ✅ Solution: 2-Step Fix

### STEP 1: Configure Root Directory in Vercel (5 minutes)

**This CANNOT be done via code - MUST use Vercel dashboard**

1. **Open Admin Project Settings**:  
   https://vercel.com/hifive-team/admin/settings

2. **Navigate to**: Settings → General → **Root Directory**

3. **Click**: Edit

4. **IMPORTANT**: Leave Root Directory **EMPTY** (do not set it)  
   *(This tells Vercel to use the repository root)*

5. **Click**: Save

**Why empty?**  
- With Root Directory empty, Vercel starts at repository root
- Our vercel.json has `cd ../..` which goes from deployment dir to repo root
- This makes commands find both pnpm-lock.yaml AND apps/admin/package.json

**Alternative** (if empty doesn't work):  
Set Root Directory to `.` (current directory / repo root)

### STEP 2: Move Domain to Correct Project (5 minutes)

#### Option A: Vercel Dashboard (Recommended)

**Remove from old project**:
1. Go to: https://vercel.com/hifive-team/social-intelligence-admin/settings/domains
2. Find: `admin.leroysteding.nl`
3. Click **Remove** (or Delete icon)
4. Confirm removal

**Add to new project**:
1. Go to: https://vercel.com/hifive-team/admin/settings/domains
2. Click: **Add Domain**
3. Enter: `admin.leroysteding.nl`
4. Click: **Add**
5. Wait ~30 seconds for DNS propagation

#### Option B: Vercel CLI

```bash
# Remove from social-intelligence-admin
vercel domains rm admin.leroysteding.nl --scope hifive-team

# Add to admin project
# (First make sure you're in apps/admin with .vercel/project.json restored)
cd ~/Projects/personal/leroy-steding-portfolio/apps/admin
vercel domains add admin.leroysteding.nl --scope hifive-team
```

---

## 🔄 After Configuration: Redeploy

Once both steps above are complete:

```bash
cd ~/Projects/personal/leroy-steding-portfolio/apps/admin

# Restore the .vercel link if removed
vercel link --yes

# Deploy to production
vercel --prod --yes
```

**Expected output**:
```
✓ Running install command: cd ../.. && pnpm install --frozen-lockfile
✓ Already up-to-date
✓ Detected Next.js version
✓ Running build command: cd ../.. && pnpm turbo run build --filter=@steding/admin
✓ Compiled successfully in ~60s
✓ 24 routes generated
✓ Deployment ready: https://admin-xxxx-hifive-team.vercel.app
```

---

## ✅ Verification Checklist

### After STEP 1 (Root Directory configured):
- [ ] Deploy completes successfully
- [ ] Build time: ~60 seconds (not 6s)
- [ ] Output shows: "Detected Next.js version"
- [ ] Build shows 24 routes generated
- [ ] Test deployment URL works:
  ```bash
  curl -I https://admin-xxxx-hifive-team.vercel.app/dashboard
  # Expected: HTTP/2 200 or 302 (redirect to sign-in)
  ```

### After STEP 2 (Domain moved):
- [ ] Domain removed from social-intelligence-admin
- [ ] Domain added to admin project  
- [ ] Test custom domain works:
  ```bash
  curl -I https://admin.leroysteding.nl/dashboard
  # Expected: HTTP/2 200 or 302 (not 404)
  ```
- [ ] Browser test (all should redirect to sign-in if not logged in):
  - [ ] https://admin.leroysteding.nl/
  - [ ] https://admin.leroysteding.nl/dashboard
  - [ ] https://admin.leroysteding.nl/jobs
  - [ ] https://admin.leroysteding.nl/analytics
  - [ ] https://admin.leroysteding.nl/content

---

## 📊 Build Configuration Breakdown

**Before Fix** (Failed):
```
Vercel Working Directory: apps/admin/
Install: pnpm install --frozen-lockfile
  └─ ERROR: Can't find pnpm-lock.yaml ❌

Build: pnpm turbo run build --filter=@steding/admin
  └─ Not reached (install failed)
```

**After vercel.json Fix** (Partial):
```
Vercel Working Directory: apps/admin/
Install: cd ../.. && pnpm install --frozen-lockfile
  └─ SUCCESS: Found pnpm-lock.yaml at root ✅
  
Framework Detection: Look for 'next' in package.json
  └─ ERROR: Looking in wrong package.json ❌

Build: cd ../.. && pnpm turbo run build --filter=@steding/admin
  └─ Not reached (framework detection failed)
```

**After Root Directory Fix** (Should Work):
```
Vercel Working Directory: (repository root)
Install: cd ../.. && pnpm install --frozen-lockfile
  └─ SUCCESS: Found pnpm-lock.yaml ✅
  
Framework Detection: Check apps/admin/package.json
  └─ SUCCESS: Found 'next' in dependencies ✅

Build: cd ../.. && pnpm turbo run build --filter=@steding/admin
  └─ SUCCESS: Turbo builds @steding/admin ✅
  
Output: ../../apps/admin/.next
  └─ SUCCESS: Deployment artifact found ✅
```

---

## 🚨 Why Root Directory Configuration is Required

### The Problem

Vercel needs to know:
1. **WHERE to run commands** (working directory)
2. **WHERE to find the app's package.json** (for framework detection)
3. **WHERE to find build artifacts** (outputDirectory)

In our monorepo:
- Commands need to run from **repository root** (for pnpm-lock.yaml)
- App code is in **apps/admin/** (for Next.js detection)
- Build output is in **apps/admin/.next/** (for deployment)

### Why vercel.json Alone Isn't Enough

`vercel.json` can configure:
- ✅ buildCommand
- ✅ installCommand  
- ✅ outputDirectory

`vercel.json` **cannot** configure:
- ❌ Root Directory (project-level setting, not deployment config)
- ❌ Working directory for framework detection

### The Solution

**Root Directory = empty** (or `.`) tells Vercel:
- Start at repository root
- Commands like `cd ../..` work correctly
- Can detect Next.js in apps/admin/package.json via outputDirectory context

---

## 📁 File Changes Summary

**Changed**:
- `apps/admin/vercel.json` (commit `6ffe86e`)
  - Added `cd ../..` to install and build commands
  - Updated outputDirectory to `../../apps/admin/.next`

**No changes needed**:
- `apps/admin/package.json` (already correct)
- `pnpm-lock.yaml` (already at root)
- `apps/admin/.vercel/project.json` (links to correct project)

**Temporarily removed** (will be restored after Root Directory fix):
- `apps/admin/.vercel/` (to allow re-linking with correct config)

---

## 🔗 Support Links

**Admin Project**:
- Settings: https://vercel.com/hifive-team/admin/settings
- Deployments: https://vercel.com/hifive-team/admin/deployments
- Domains: https://vercel.com/hifive-team/admin/settings/domains

**Old Project (social-intelligence-admin)**:
- Domains: https://vercel.com/hifive-team/social-intelligence-admin/settings/domains

**Vercel Documentation**:
- Root Directory: https://vercel.com/docs/projects/project-configuration#root-directory
- Monorepo: https://vercel.com/docs/monorepos
- Build Configuration: https://vercel.com/docs/deployments/configure-a-build

---

## 🎯 Summary

**Diagnosis**: ✅ Complete  
**Code Fixes**: ✅ Applied (commit `6ffe86e`)  
**Manual Steps**: ⚠️ Required (dashboard configuration)  

**Blocking Issues**:
1. Root Directory not configured → Set to empty in dashboard
2. Domain pointing to wrong project → Move via dashboard or CLI

**ETA**: 10 minutes after dashboard access  
**Risk**: Low (changes are reversible)  
**Priority**: CRITICAL (admin dashboard unavailable)

**Next Action**: Follow STEP 1 and STEP 2 above to complete the fix.
