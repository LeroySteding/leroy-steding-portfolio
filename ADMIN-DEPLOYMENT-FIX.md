# CRITICAL: Admin Dashboard Deployment Fix

**Status**: 🔴 **BLOCKED** - Requires manual Vercel configuration  
**Issue**: admin.leroysteding.nl returns 404  
**Root Cause**: Incorrect Root Directory setting in Vercel project

---

## Problem Summary

The `admin` Vercel project exists and is linked correctly, but deployments fail with:

```
Error: No Next.js version detected. Make sure your package.json has "next" 
in either "dependencies" or "devDependencies". Also check your Root Directory 
setting matches the directory of your package.json file.
```

**Why**: Vercel is looking for `next` in the wrong `package.json` because Root Directory is not configured.

---

## Required Manual Steps (5 minutes)

### Step 1: Configure Root Directory in Vercel

1. Go to: https://vercel.com/hifive-team/admin/settings
2. Navigate to **Settings → General**
3. Find **Root Directory** section
4. Click **Edit**
5. Set **Root Directory** to: `apps/admin`
6. ✅ Enable: **"Include source files outside of the Root Directory in the Build Step"**
7. Click **Save**

**What this does**:
- Tells Vercel the app is in `apps/admin/` subdirectory
- Allows access to monorepo root for shared packages (`@repo/*`)
- Uses `apps/admin/package.json` for dependency detection
- Builds with `apps/admin/.next` as output

---

### Step 2: Add Custom Domain

After successful deployment, add the custom domain:

1. Go to: https://vercel.com/hifive-team/admin/settings/domains
2. Click **Add Domain**
3. Enter: `admin.leroysteding.nl`
4. Click **Add**
5. Verify DNS is already pointing to Vercel ✅ (confirmed via `dig`)

**Current DNS** (already configured):
```bash
admin.leroysteding.nl → e1a6df048cd6e790.vercel-dns-016.com
```

---

### Step 3: Trigger New Deployment

After configuring Root Directory:

```bash
cd ~/Projects/personal/leroy-steding-portfolio/apps/admin
vercel --prod
```

Or wait for auto-deployment from Git push (already pushed in commit `cdd8299`).

---

## What I've Already Fixed

✅ **Updated `apps/admin/vercel.json`** (commit `cdd8299`):
- buildCommand: `pnpm turbo run build --filter=@steding/admin`
- installCommand: `pnpm install --frozen-lockfile`
- outputDirectory: `.next` (relative to Root Directory)
- Removed `cd ../..` commands that were breaking the build

✅ **Verified local build works**:
```bash
pnpm --filter @steding/admin build
# ✓ Compiled successfully in 2.4s
# Route (app) - 24 pages generated
```

✅ **Pushed to GitHub**:
- Tests: ✅ 47/47 passing
- Commit: `cdd8299`
- Branch: `main`

---

## Expected Result After Fix

1. **Vercel Build**: Should complete successfully (~60s)
2. **Deployment URL**: `https://admin-hifive-team.vercel.app` (auto-alias)
3. **Custom Domain**: `https://admin.leroysteding.nl` (after Step 2)
4. **HTTP Status**: 200 OK
5. **Content**: Admin dashboard loads correctly

---

## Current Deployment Status

**Admin Project**:
- Name: `admin`
- Organization: `hifive-team`
- Latest Deployment: https://admin-2xxhj2bkd-hifive-team.vercel.app
- Status: ● Error
- Error: "No Next.js version detected"
- Duration: 6-7 seconds (should be ~60s for successful build)

**Auto-Aliases** (will work after fix):
- https://admin-hifive-team.vercel.app
- https://admin-leroysteding-hifive-team.vercel.app

**Custom Domain** (needs to be added):
- admin.leroysteding.nl (DNS ready, not linked in Vercel)

---

## Alternative: Deploy from Monorepo Root (Not Recommended)

If Root Directory configuration doesn't work, we could:

1. Keep Root Directory empty (monorepo root)
2. Use these commands in `vercel.json`:
   ```json
   {
     "buildCommand": "pnpm turbo run build --filter=@steding/admin",
     "installCommand": "pnpm install --frozen-lockfile",
     "outputDirectory": "apps/admin/.next"
   }
   ```

**Downside**: Vercel would upload entire monorepo (slower uploads, larger deployment).

---

## Verification Checklist

After applying the fix:

- [ ] Root Directory set to `apps/admin` in Vercel settings
- [ ] "Include source files outside Root Directory" enabled
- [ ] New deployment triggered
- [ ] Build completes successfully (~60s)
- [ ] Auto-aliases work: `https://admin-hifive-team.vercel.app`
- [ ] Custom domain added: `admin.leroysteding.nl`
- [ ] Domain returns 200 OK
- [ ] Admin dashboard loads correctly
- [ ] Jobs, Content, Analytics pages accessible

---

## Related Files

- `apps/admin/vercel.json` (updated)
- `apps/admin/package.json` (unchanged, contains `next` dependency)
- `.vercel/project.json` (root - linked to portfolio project)
- `apps/admin/.vercel/project.json` (will be created after linking)

---

## Support

**Vercel Project**: https://vercel.com/hifive-team/admin  
**Settings**: https://vercel.com/hifive-team/admin/settings  
**Deployments**: https://vercel.com/hifive-team/admin/deployments

**Next Steps**: Apply manual configuration in Vercel dashboard, then trigger new deployment.

---

**Priority**: CRITICAL  
**Blocker**: Requires Vercel dashboard access  
**ETA**: 5 minutes after dashboard configuration
