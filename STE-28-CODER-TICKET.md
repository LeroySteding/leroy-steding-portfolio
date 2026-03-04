# 🎫 STE-28: CODER IMPLEMENTATION TICKET

**Type**: SEO Configuration  
**Priority**: 🔴 URGENT  
**Assigned To**: @steding_coder_bot  
**Reporter**: @steding_researcher_bot  
**Date**: March 4, 2026, 11:03 GMT+1  
**Deadline**: Within 24 hours  
**Estimated Effort**: 10 minutes  

---

## 📋 TASK DESCRIPTION

Add Google Search Console verification meta tag to leroysteding.nl to enable SEO monitoring and indexing verification in Google Search Console.

---

## 🎯 ACCEPTANCE CRITERIA

- [ ] Verification code added to `apps/portfolio/app/layout.tsx`
- [ ] Code is NOT the placeholder text
- [ ] Changes committed to git with proper message
- [ ] Deployed to Vercel (✓ Ready status)
- [ ] Meta tag is visible in live HTML
- [ ] Notification sent to Leroy that meta tag is live

---

## 📝 TECHNICAL DETAILS

### File to Modify
```
~/Projects/personal/leroy-steding-portfolio/apps/portfolio/app/layout.tsx
```

### Line to Change
Around **line 39**

### Current Code
```typescript
verification: {
  google: "PASTE_YOUR_VERIFICATION_CODE_HERE",
},
```

### What to Change
Replace `PASTE_YOUR_VERIFICATION_CODE_HERE` with the actual verification code from Google Search Console.

### Example (FAKE CODE)
```typescript
verification: {
  google: "dGVzdC1jb2RlLWZvcmsuYmFzZTY0LWVuY29kZWQ=",
},
```

### Real Code Source
The real code will be provided by Leroy after they:
1. Go to Google Search Console: https://search.google.com/search-console
2. Add Property → Domain → `leroysteding.nl`
3. Select "HTML tag" verification method
4. Copy the provided code

**Code will be 40-50+ characters**, format like: `abc123def456ghi789jkl0mnopqrs`

---

## ⚙️ IMPLEMENTATION STEPS

### Step 1: Get Verification Code from Leroy
Wait for Leroy to provide the verification code from Google Search Console.

### Step 2: Navigate to Project
```bash
cd ~/Projects/personal/leroy-steding-portfolio
```

### Step 3: Edit the File
```bash
# Option A: VS Code (recommended)
code apps/portfolio/app/layout.tsx

# Option B: Nano
nano apps/portfolio/app/layout.tsx

# Option C: Vim
vim apps/portfolio/app/layout.tsx
```

### Step 4: Find and Replace
**Find** (around line 39):
```typescript
verification: {
  google: "PASTE_YOUR_VERIFICATION_CODE_HERE",
},
```

**Replace with**:
```typescript
verification: {
  google: "ACTUAL_CODE_FROM_GSC_HERE",
},
```

**Example**:
```typescript
verification: {
  google: "dGVzdC1jb2RlLWZvcmsuYmFzZTY0LWVuY29kZWQ=",
},
```

### Step 5: Verify Changes
```bash
# Check the code was updated correctly
grep -A 1 "verification:" apps/portfolio/app/layout.tsx

# Should output something like:
# verification: {
#   google: "dGVzdC1jb2RlLWZvcmsuYmFzZTY0LWVuY29kZWQ=",
```

**IMPORTANT**: Verify the output does NOT show the placeholder text.

### Step 6: Commit Changes
```bash
# Stage the file
git add apps/portfolio/app/layout.tsx

# Commit with message (copy-paste this)
git commit -m "feat(seo): Add Google Search Console verification meta tag

- Add google-site-verification code from GSC to Next.js metadata
- Enables Google Search Console property registration
- Required for SEO monitoring and indexing verification
- Resolves STE-28"

# Push to main (Vercel auto-deploys)
git push origin main
```

### Step 7: Monitor Deployment
```bash
# Watch Vercel deployment
# https://vercel.com/leroysteding/portfolio
# Wait for: ✓ Production Deployment Ready

# Or check via command line
watch -n 5 curl -I https://www.leroysteding.nl | head -1

# Wait for: HTTP/1.1 200 OK
# Takes typically 3-5 minutes
```

### Step 8: Verify Meta Tag is Live
```bash
# Check that meta tag is in the live HTML
curl -s https://www.leroysteding.nl | grep google-site-verification

# Should output:
# <meta name="google-site-verification" content="dGVzdC1jb2RlLWZvcmsuYmFzZTY0LWVuY29kZWQ=" />
```

**✅ If you see the tag with your code**: SUCCESS!  
**❌ If you don't see it or see placeholder**: Check that Vercel deployment is complete

### Step 9: Notify Leroy
Send message to Leroy:
```
✅ GSC verification meta tag is live on leroysteding.nl

The HTML meta tag has been deployed:
<meta name="google-site-verification" content="[code]" />

Ready for GSC verification step.
```

---

## 🧪 VERIFICATION COMMANDS

Run these to verify your work:

```bash
# 1. Check file is updated
grep "google:" apps/portfolio/app/layout.tsx

# 2. Verify meta tag on live site
curl -s https://www.leroysteding.nl | grep google-site-verification

# 3. Extract just the code
curl -s https://www.leroysteding.nl | \
  grep google-site-verification | \
  sed 's/.*content="\([^"]*\)".*/\1/'

# All three commands should show your code, NOT the placeholder
```

---

## ✅ QUALITY ASSURANCE

Before marking as done, verify:

- [ ] File `layout.tsx` contains real code (not placeholder)
- [ ] Real code is the one provided by Leroy
- [ ] Git commit message is descriptive
- [ ] Changes are on `main` branch
- [ ] Vercel deployment shows ✓ Ready
- [ ] `curl` command shows meta tag in live HTML
- [ ] Meta tag code matches Leroy's code

---

## 🆘 TROUBLESHOOTING

### Issue: "Vercel Deployment Taking Too Long"
**Solution**:
- Check Vercel dashboard: https://vercel.com/leroysteding/portfolio
- Look for build status
- Wait 5+ minutes (can take up to 10 minutes)
- Check build logs if failed

### Issue: "I Can't Find the Line"
**Solution**:
- Search for: `PASTE_YOUR_VERIFICATION_CODE_HERE`
- Should be around line 39
- It's in the `verification` object

### Issue: "curl Shows Placeholder Text, Not Real Code"
**Solution**:
- Verify Vercel deployment is ✓ Ready
- File was saved correctly
- Code doesn't have typos
- Wait 5 minutes for cache to clear
- Hard refresh in browser or use `-I` flag with curl

### Issue: "Commit Failed"
**Solution**:
- Ensure you're in the project root
- Run `git status` to see what's staged
- Make sure you ran `git add apps/portfolio/app/layout.tsx`
- Check for merge conflicts

---

## 📚 REFERENCE DOCUMENTATION

**Full Technical Guide**: `docs/STE-28-GSC-VERIFICATION-GUIDE.md`
- Complete meta tag audit
- SEO best practices
- GSC verification details
- Deployment verification steps

**Quick Reference**: `STE-28-QUICK-START.txt`
- One-page summary
- Phase overview

**Status Report**: `docs/STE-28-STATUS-REPORT.md`
- Current progress
- Timeline
- Team assignments

---

## 🔗 RELATED LINKS

- **Live Site**: https://www.leroysteding.nl
- **Vercel Dashboard**: https://vercel.com/leroysteding/portfolio
- **Google Search Console**: https://search.google.com/search-console
- **Next.js Metadata Docs**: https://nextjs.org/docs/app/api-reference/functions/generate-metadata
- **GSC Verification Help**: https://support.google.com/webmasters/answer/9008080

---

## 📋 DEPENDENCY CHAIN

```
Leroy gets GSC code (5 min)
         ↓
    Coder receives code
         ↓
Coder edits & commits (5 min)
         ↓
    Vercel auto-deploys (5 min)
         ↓
  Coder verifies live (2 min)
         ↓
  Leroy completes GSC (10 min)
```

**Total Time**: ~30 minutes

---

## 🎯 SUCCESS CRITERIA

✅ **Task is complete when**:

1. **Code**: `layout.tsx` has real verification code (not placeholder)
2. **Deployed**: Vercel shows ✓ Production Deployment Ready
3. **Live**: `curl` shows meta tag in live HTML
4. **Verified**: You've confirmed the tag is present
5. **Notified**: Leroy has been told it's ready

---

## 📞 SUPPORT

Need help? Check:
1. Troubleshooting section above
2. Reference documentation files
3. Verification commands to debug

---

## ⏱️ TIME ESTIMATE

- Reading this ticket: 5 min
- Waiting for code from Leroy: variable
- Making code change: 2 min
- Committing & pushing: 2 min
- Waiting for Vercel: 5 min
- Verifying: 2 min
- **Total active time**: ~10 minutes
- **Total with waits**: ~15 minutes

---

## 📝 SIGN-OFF

**Ticket Created**: March 4, 2026, 11:03 GMT+1  
**Priority**: 🔴 URGENT  
**Status**: Ready for assignment  
**Blocker**: Waiting for verification code from Leroy  

---

**Task**: STE-28 - Add Google Search Console Verification  
**Your Job**: Implement the meta tag and deploy  
**Deadline**: ASAP (within 24 hours)

Let me know when you're ready or if you need anything clarified!

---
