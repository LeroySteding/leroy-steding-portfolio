# STE-28: Instructions for Coder Agent

**Task**: Add Google Search Console verification to leroysteding.nl  
**Priority**: 🔴 URGENT  
**Assigned To**: @steding_coder_bot  
**Expected Time**: 10 minutes  
**Blocking**: SEO monitoring and indexing tracking

---

## 📋 YOUR TASK

Add Google Search Console verification meta tag to the website so it can be registered and tracked in GSC.

---

## ✅ WHAT'S ALREADY DONE

- ✅ Code template prepared (`apps/portfolio/app/layout.tsx`)
- ✅ Placeholder inserted (`PASTE_YOUR_VERIFICATION_CODE_HERE`)
- ✅ Sitemap configured and accessible
- ✅ robots.txt properly configured
- ✅ Vercel deployment pipeline ready
- ✅ Complete implementation guide written

---

## 🎯 YOUR EXACT STEPS (10 minutes)

### Step 1: Get Verification Code from Leroy
Leroy will provide the verification code from Google Search Console. It will look like:
```
abc123def456ghi789jkl0mnopqrs
```

### Step 2: Navigate to Project
```bash
cd ~/Projects/personal/leroy-steding-portfolio
```

### Step 3: Open and Edit File
File: `apps/portfolio/app/layout.tsx` (around line 39)

**Current**:
```typescript
verification: {
  google: "PASTE_YOUR_VERIFICATION_CODE_HERE",
},
```

**Replace with** (paste Leroy's code):
```typescript
verification: {
  google: "abc123def456ghi789jkl0mnopqrs",
},
```

**Use your editor**:
```bash
# VS Code
code apps/portfolio/app/layout.tsx

# Nano (simple)
nano apps/portfolio/app/layout.tsx

# Vim
vim apps/portfolio/app/layout.tsx
```

Find line 39, replace the placeholder with the actual code.

### Step 4: Verify Changes Look Correct
```bash
# Check that code is updated
grep -A 2 "verification:" apps/portfolio/app/layout.tsx

# Should show:
# verification: {
#   google: "abc123def456ghi789jkl0mnopqrs",
```

### Step 5: Commit and Deploy
```bash
# Stage the file
git add apps/portfolio/app/layout.tsx

# Commit
git commit -m "feat(seo): Add Google Search Console verification meta tag

- Add google-site-verification code to Next.js metadata
- Enables GSC tracking and indexing monitoring
- Closes STE-28"

# Push to main (Vercel auto-deploys)
git push origin main
```

### Step 6: Monitor Deployment
```bash
# Watch deployment status
watch -n 5 curl -I https://www.leroysteding.nl

# Or check Vercel dashboard
# https://vercel.com/leroysteding/portfolio
# Wait for: ✓ Production Deployment Ready
```

Takes 3-5 minutes.

### Step 7: Verify Meta Tag is Live
```bash
# Check that meta tag is in the live HTML
curl -s https://www.leroysteding.nl | grep google-site-verification

# Should output:
# <meta name="google-site-verification" content="abc123def456ghi789jkl0mnopqrs" />
```

If you see your code: ✅ **YOU'RE DONE**

If not: Check Vercel deployment is complete, wait 5 minutes, try again.

---

## 📝 ACCEPTANCE CRITERIA

Your work is complete when:

- [ ] Code added to `apps/portfolio/app/layout.tsx`
- [ ] Verification code is NOT the placeholder
- [ ] Changes committed and pushed to main
- [ ] Vercel shows ✓ Ready status
- [ ] Meta tag is visible in live HTML (`curl` command confirms)
- [ ] You notify Leroy to proceed with GSC verification

---

## 🔍 QUALITY CHECKS

Before you're done, verify:

```bash
# 1. File was edited correctly
grep "google: \"[a-z0-9]*\"" apps/portfolio/app/layout.tsx

# Should NOT show the placeholder text

# 2. Meta tag is in the live site
curl -s https://www.leroysteding.nl | grep -c "google-site-verification"

# Should output: 1 (found once)

# 3. Full meta tag
curl -s https://www.leroysteding.nl | grep google-site-verification | head -1

# Should show complete tag with code
```

---

## 🆘 TROUBLESHOOTING

### Issue: "I don't know what verification code to use"
**Solution**: Leroy will provide it. Wait for them to go through Phase 1 of the setup and share it.

### Issue: "Vercel deployment is taking too long"
**Solution**: Check https://vercel.com/leroysteding/portfolio
- If still building: Wait 5 more minutes
- If failed: Check build logs for errors
- If succeeded: Meta tag should be live

### Issue: "curl shows meta tag but Leroy says verification fails in GSC"
**Solution**: This is expected. Leroy needs to:
1. Wait 5 minutes for GSC to recheck
2. Clear browser cache
3. Click "Verify" button again

---

## ⏱️ TIME ESTIMATE

- Reading instructions: 2 min
- Making code change: 2 min
- Committing and pushing: 2 min
- Waiting for deployment: 5 min
- Verifying meta tag: 2 min
- **Total**: ~13 minutes (including waits)

---

## 📞 HANDOFF

When you're done:

1. Notify Leroy: "Meta tag is live on leroysteding.nl"
2. Share the output of:
   ```bash
   curl -s https://www.leroysteding.nl | grep google-site-verification
   ```
3. Leroy will complete phases 5-7 in Google Search Console

---

## 📚 REFERENCE

**Full guide**: `docs/STE-28-COMPLETE-IMPLEMENTATION.md`  
**Quick start**: `STE-28-QUICK-START.txt`  
**File to edit**: `apps/portfolio/app/layout.tsx` (line ~39)  
**Verification code**: Will come from Leroy

---

## ✅ CHECKLIST FOR YOU

- [ ] Received verification code from Leroy
- [ ] Opened `apps/portfolio/app/layout.tsx`
- [ ] Replaced placeholder with actual code
- [ ] Verified code looks correct (no placeholder text)
- [ ] Committed: `git add apps/portfolio/app/layout.tsx`
- [ ] Committed: `git commit -m "..."`
- [ ] Pushed: `git push origin main`
- [ ] Waited for Vercel deployment (✓ Ready)
- [ ] Verified meta tag is live
- [ ] Notified Leroy

---

**Task**: STE-28 - Google Search Console Setup  
**Your Role**: Add meta tag and deploy  
**Time**: ~13 minutes  
**Deadline**: ASAP (URGENT)

Let Leroy know when the meta tag is live!
