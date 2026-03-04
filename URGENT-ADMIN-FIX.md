# 🔴 URGENT: Admin Dashboard Domain Fix

**Time**: 2026-03-04 14:35 GMT+1  
**Status**: CRITICAL - Domain pointing to wrong project  
**Impact**: Admin completely inaccessible except /sign-in

---

## Problem

```
Current (WRONG):
admin.leroysteding.nl → social-intelligence-admin project
  └─ Old/incomplete deployment (missing routes)

Should be:
admin.leroysteding.nl → admin project
  └─ Current codebase with all routes
```

---

## Immediate Fix (2 Steps - 5 Minutes)

### STEP 1: Remove Domain from Old Project

**Via Vercel Dashboard** (fastest):
1. Go to: https://vercel.com/hifive-team/social-intelligence-admin/settings/domains
2. Find: `admin.leroysteding.nl`
3. Click: **Remove** (trash icon)
4. Confirm removal

### STEP 2: Configure Admin Project & Add Domain

**First, set Root Directory**:
1. Go to: https://vercel.com/hifive-team/admin/settings
2. Settings → General → **Root Directory**
3. Click: **Edit**
4. **IMPORTANT**: Set to `apps/admin` (NOT empty!)
5. ✅ Enable: **"Include source files outside of the Root Directory in the Build Step"**
6. Click: **Save**

**Then, add domain**:
1. Stay in admin project settings
2. Go to: **Domains** tab
3. Click: **Add Domain**
4. Enter: `admin.leroysteding.nl`
5. Click: **Add**

**This will trigger automatic deployment!**

---

## Why Root Directory = `apps/admin` Now

Previous guides said "empty" but that was wrong. With monorepo:
- Root Directory: `apps/admin` (where package.json is)
- ✅ Enable "Include source files outside Root Directory"
- This gives access to workspace root for pnpm-lock.yaml

---

## Verification

After domain is added (wait ~2 min for deployment):

```bash
curl -I https://admin.leroysteding.nl
# Expected: HTTP/2 302 (redirect to /sign-in) or 200

curl -I https://admin.leroysteding.nl/dashboard
# Expected: HTTP/2 302 (redirect to /sign-in if not auth'd)
```

---

## If Build Still Fails

The vercel.json has `cd ../..` commands which won't work with Root Directory set to `apps/admin`.

**Quick fix**:
1. Go to: https://vercel.com/hifive-team/admin/settings
2. Click: **Environment Variables**
3. Override build settings:
   - Build Command: `pnpm build` (no cd)
   - Install Command: `cd ../.. && pnpm install`
   - Output Directory: `.next` (relative to apps/admin)

---

## Alternative: CLI Method (Slower)

If you prefer CLI, must be in project root:

```bash
# You cannot remove domain from another project via CLI
# MUST use dashboard to remove from social-intelligence-admin

# After domain is removed from old project:
cd ~/Projects/personal/leroy-steding-portfolio/apps/admin
vercel domains add admin.leroysteding.nl --scope hifive-team
```

---

## Status Check

**Current** (as of 14:35):
- ✅ Code is correct (all routes exist in src/app)
- ✅ Local build works (24 routes generated)
- ❌ Domain on wrong project (social-intelligence-admin)
- ❌ Admin project builds failing (Root Directory not set)

**After fix**:
- ✅ Domain on correct project (admin)
- ✅ Root Directory set (apps/admin)
- ✅ Auto-deployment triggered
- ✅ All routes working

---

## Timeline

- **11:05 CET**: Last known working state (per memory/2026-03-04.md)
- **14:07 CET**: New deployment to social-intelligence-admin (wrong project!)
- **14:31 CET**: Regression reported (only /sign-in works)
- **14:35 CET**: Root cause identified (domain never moved)

**The domain was NEVER moved to the admin project despite previous instructions!**

---

## Support Links

**Remove domain from**:
- https://vercel.com/hifive-team/social-intelligence-admin/settings/domains

**Add domain to**:
- https://vercel.com/hifive-team/admin/settings/domains

**Configure Root Directory**:
- https://vercel.com/hifive-team/admin/settings

---

## Priority: CRITICAL

**ETA**: 5 minutes  
**Action**: Remove domain from old project + Configure Root Directory + Add to new project  
**Risk**: Low (can revert if needed)
