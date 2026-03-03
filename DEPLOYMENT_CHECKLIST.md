# Deployment Checklist

**⚠️ CRITICAL: Run this checklist after EVERY code change to keep production in sync!**

## 📋 Standard Deployment Flow

### 1. Test Locally ✅
```bash
# Start local dev servers
cd ~/Projects/personal/leroy-steding-portfolio

# Test admin dashboard
cd apps/admin && pnpm dev
# Verify: http://localhost:3001

# Test portfolio site
cd apps/portfolio && pnpm dev  
# Verify: http://localhost:3000
```

**Checklist**:
- [ ] All pages load without errors
- [ ] Console shows no critical errors
- [ ] Data displays correctly

---

### 2. Run Tests ✅
```bash
cd ~/Projects/personal/leroy-steding-portfolio

# Unit tests (run automatically on git push)
cd apps/portfolio && pnpm test

# E2E tests (if available)
cd apps/admin && pnpm test
```

**Checklist**:
- [ ] All unit tests pass
- [ ] E2E tests pass (if implemented)
- [ ] No TypeScript errors

---

### 3. Commit Changes ✅
```bash
cd ~/Projects/personal/leroy-steding-portfolio

# Stage all changes
git add -A

# Commit with descriptive message
git commit -m "feat/fix/chore: clear description of changes"

# Example commit messages:
# git commit -m "feat: add Medium scraper integration"
# git commit -m "fix: handle undefined trending values in analytics"
# git commit -m "chore: update deployment configuration"
```

**Checklist**:
- [ ] All files staged (`git status` shows clean)
- [ ] Commit message is clear and descriptive
- [ ] No sensitive data committed (API keys, secrets)

---

### 4. Deploy Convex Backend ✅
```bash
cd ~/Projects/personal/leroy-steding-portfolio

# Clear cache if needed (only if deployment fails)
rm -rf .convex

# Deploy to Convex
npx convex deploy --yes

# Wait for deployment to complete
# Look for: "✔ Convex deployed successfully"
```

**Checklist**:
- [ ] Deployment completed successfully
- [ ] No TypeScript errors
- [ ] Functions registered in Convex dashboard
- [ ] Check Convex dashboard: https://dashboard.convex.dev/d/hallowed-mole-286

**Common Issues**:
- **Cache conflicts**: Run `rm -rf .convex` and try again
- **TypeScript errors**: Check `convex/tsconfig.json` exists
- **Duplicate .js files**: Remove with `rm convex/*.js` and redeploy

---

### 5. Push to Git ✅
```bash
cd ~/Projects/personal/leroy-steding-portfolio

# Push to main branch
git push origin main

# Wait for push to complete
# Tests will run automatically
```

**Checklist**:
- [ ] Push succeeded (no conflicts)
- [ ] Unit tests passed (shown in output)
- [ ] GitHub Actions succeeded (if configured)

---

### 6. Verify Vercel Deployment ✅
```bash
# Vercel deploys automatically on git push to main

# Check deployment status:
# Visit: https://vercel.com/leroy-steedings-projects

# Or use CLI:
npx vercel --prod
```

**Checklist**:
- [ ] Vercel build started
- [ ] Build completed successfully (check Vercel dashboard)
- [ ] Production URL updated: https://admin.leroysteding.nl
- [ ] No build errors or warnings

**Verify Deployed Sites**:
- [ ] Admin: https://admin.leroysteding.nl - loads correctly
- [ ] Portfolio: https://leroysteding.nl - loads correctly (if updated)

---

### 7. Smoke Test Production ✅
```bash
# Open production URLs in browser
open https://admin.leroysteding.nl
open https://admin.leroysteding.nl/jobs
open https://admin.leroysteding.nl/jobs/sources
```

**Checklist**:
- [ ] Pages load without errors
- [ ] No console errors (F12 → Console)
- [ ] Data displays correctly
- [ ] Authentication works (Clerk)
- [ ] Convex queries succeed

**Common Production Errors**:
- **"Could not find function"**: Convex not deployed → Rerun step 4
- **"Cannot read properties of undefined"**: Code error → Check console, fix, restart from step 3
- **Build failed**: Check Vercel logs → Fix error, restart from step 3

---

## 🚨 Emergency Rollback

If production is broken:

```bash
cd ~/Projects/personal/leroy-steding-portfolio

# 1. Find last working commit
git log --oneline -10

# 2. Revert to working commit
git revert <commit-hash>

# 3. Push revert
git push origin main

# 4. Redeploy Convex
npx convex deploy --yes

# 5. Verify in Vercel dashboard that rollback deployed
```

---

## 🔄 Quick Reference Commands

### Full Deployment (One-liner)
```bash
cd ~/Projects/personal/leroy-steding-portfolio && \
git add -A && \
git commit -m "update: deployment" && \
npx convex deploy --yes && \
git push origin main && \
echo "✅ Deployment complete! Check Vercel dashboard."
```

### Check Status
```bash
# Git status
git status

# Convex functions
npx convex run scraped_jobs:stats

# Recent deployments
git log --oneline -5

# Vercel deployments (requires vercel CLI)
npx vercel list
```

### Clean Slate (When Things Break)
```bash
# Clear all caches
cd ~/Projects/personal/leroy-steding-portfolio
rm -rf .convex node_modules/.cache apps/admin/.next apps/portfolio/.next

# Reinstall if needed
pnpm install

# Redeploy
npx convex deploy --yes
```

---

## 📝 Deployment History Log

Keep track of deployments:

### Template:
```
Date: YYYY-MM-DD HH:MM
Commit: <git-hash>
Changes: Brief description
Convex: ✅/❌
Vercel: ✅/❌
Production: ✅/❌
Notes: Any issues or observations
```

### Example:
```
Date: 2026-03-03 14:15
Commit: 56689ae
Changes: Fixed undefined trending values in jobs page
Convex: ✅ Deployed successfully
Vercel: ✅ Build #142 succeeded
Production: ✅ All pages working
Notes: Had to clear .convex cache due to TypeScript errors
```

---

## ⚠️ REMEMBER

**After EVERY task completion**:
1. Commit changes (`git commit`)
2. Deploy Convex (`npx convex deploy`)
3. Push to Git (`git push`)
4. Verify Vercel build
5. Test production site

**Don't skip steps!** Production breaks when steps are missed.

---

## 🔗 Quick Links

- **Convex Dashboard**: https://dashboard.convex.dev/d/hallowed-mole-286
- **Vercel Dashboard**: https://vercel.com/leroy-stedings-projects
- **Admin Production**: https://admin.leroysteding.nl
- **Portfolio Production**: https://leroysteding.nl
- **GitHub Repo**: https://github.com/LeroySteding/leroy-steding-portfolio

---

Last Updated: 2026-03-03
