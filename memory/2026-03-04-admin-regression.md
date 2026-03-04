# Admin Dashboard Regression - 2026-03-04

## Critical Issue

**Time**: 14:31-14:35 CET  
**Severity**: CRITICAL  
**Status**: Diagnosed, awaiting manual fix

## Problem

Only `/sign-in` works on admin.leroysteding.nl, all other routes return 404.

## Root Cause

Domain `admin.leroysteding.nl` is pointing to the **wrong Vercel project**:

```
Current: admin.leroysteding.nl → social-intelligence-admin ❌
Should be: admin.leroysteding.nl → admin ✅
```

## Investigation Results

```bash
$ vercel inspect admin.leroysteding.nl
Project: social-intelligence-admin
Deployment: 14:07 CET
Build: . [0ms] (cached, no real build)
Routes: Missing /dashboard, /jobs, etc.

$ vercel project ls | grep admin
social-intelligence-admin  https://admin.leroysteding.nl  (WRONG!)
admin                      https://admin-hifive-team.vercel.app
```

## Why It Happened

The domain migration step was **never completed** despite multiple previous fix attempts:
- Previous guides said to move domain via dashboard
- Manual step was not executed
- Domain remained on old project
- New deployments went to wrong project

## Code Fixes Applied

**Commit c0ae2bb**: Created URGENT-ADMIN-FIX.md  
**Commit 4d53baf**: Simplified vercel.json

```json
{
  "buildCommand": "pnpm build",
  "installCommand": "cd ../.. && pnpm install --frozen-lockfile",
  "framework": "nextjs"
}
```

Works when Root Directory = `apps/admin` with "Include source files outside Root Directory" enabled.

## Manual Steps Required (5 Minutes)

**Cannot be automated** - requires Vercel dashboard access:

1. **Remove domain from social-intelligence-admin**:  
   https://vercel.com/hifive-team/social-intelligence-admin/settings/domains

2. **Set Root Directory in admin project**:  
   https://vercel.com/hifive-team/admin/settings  
   → Root Directory: `apps/admin`  
   → ✅ Enable "Include source files outside Root Directory"

3. **Add domain to admin project**:  
   https://vercel.com/hifive-team/admin/settings/domains  
   → Add: `admin.leroysteding.nl`

## Verification

After fix:
```bash
curl -I https://admin.leroysteding.nl
# Expected: HTTP/2 302 (redirect to /sign-in)

curl -I https://admin.leroysteding.nl/dashboard
# Expected: HTTP/2 302 (redirect to /sign-in if not auth'd)
```

Browser test (should all redirect to /sign-in):
- https://admin.leroysteding.nl/
- https://admin.leroysteding.nl/dashboard
- https://admin.leroysteding.nl/jobs

## Related Issues

This is the **same issue** that was diagnosed multiple times:
- ADMIN-DEPLOYMENT-SOLUTION.md
- ADMIN-CRITICAL-FIX.md
- ADMIN-404-FIX.md
- ADMIN-ROUTING-FIX.md

**Key Learning**: Code fixes alone won't work. The domain MUST be moved via Vercel dashboard. This is a **manual configuration step** that cannot be automated via code or CLI in the current setup.

## Action Items

- [ ] Execute manual domain migration (5 min)
- [ ] Verify all routes work after deployment
- [ ] Consider adding monitoring to detect if domain points to wrong project
- [ ] Update deployment process to ensure domain is on correct project

## Timeline

- **11:05 CET**: Last known working state
- **14:07 CET**: New deployment to social-intelligence-admin (wrong project!)
- **14:31 CET**: Regression reported
- **14:35 CET**: Root cause identified, fixes applied, awaiting manual steps

---

**Next Action**: Execute 3-step manual fix in Vercel dashboard
