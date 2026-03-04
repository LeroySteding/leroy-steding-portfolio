# STE-28: Google Search Console Implementation — Live Checklist

**Status**: 🔴 IN PROGRESS  
**Task**: Add GSC verification to leroysteding.nl  
**Started**: March 4, 2026, 09:31 GMT+1  
**Timeline**: 15 minutes total

---

## 📋 STEP-BY-STEP CHECKLIST

### ✅ PART 1: GET VERIFICATION CODE FROM GOOGLE SEARCH CONSOLE (5 min)

#### Step 1: Open GSC
- [ ] Open: https://search.google.com/search-console
- [ ] Sign in with Google account (leroysteding@gmail.com)

#### Step 2: Create Property
- [ ] Click **"Add Property"** button (top-left)
- [ ] Two options appear:
  - [ ] Click on **"Domain"** tab (not URL prefix)
  - [ ] Enter: `leroysteding.nl` (no http, https, or www)
  - [ ] Click **"Continue"**

#### Step 3: Choose Verification Method
- [ ] GSC shows verification options
- [ ] Look for tabs at top: "DNS", "HTML tag", etc.
- [ ] Click **"HTML tag"** tab (preferred for Next.js)

#### Step 4: Copy Verification Code
- [ ] You'll see:
  ```html
  <meta name="google-site-verification" content="abc123def456..." />
  ```
- [ ] **Copy the content value** (between quotes after `content="`)
  - Example: `abc123def456ghi789jkl0mnopqrs`
- [ ] **Save this code** — you need it in Part 2

#### Step 5: Keep GSC Window Open
- [ ] Don't close this window
- [ ] You'll click "Verify" here after deployment (Step 3)

---

### ⏳ PART 2: ADD CODE TO WEBSITE (5 min)

**File already updated**: `apps/portfolio/app/layout.tsx`

#### Step 1: Open Terminal
```bash
cd ~/Projects/personal/leroy-steding-portfolio
```

#### Step 2: Replace Placeholder with Your Code
**Current** (lines 37-39):
```typescript
verification: {
  google: "PASTE_YOUR_VERIFICATION_CODE_HERE",
},
```

**Edit the file**:
```bash
# Option A: Use nano (simple)
nano apps/portfolio/app/layout.tsx

# Option B: Use your editor
# Open in VS Code and find the verification section
```

**Replace**: `PASTE_YOUR_VERIFICATION_CODE_HERE`  
**With**: Your actual verification code (from Part 1, Step 4)

**Example**:
```typescript
verification: {
  google: "abc123def456ghi789jkl0mnopqrs",
},
```

#### Step 3: Save File
- [ ] Save changes (Ctrl+S / Cmd+S)
- [ ] Verify code looks correct

#### Step 4: Commit to Git
```bash
# Check what changed
git status

# Stage the file
git add apps/portfolio/app/layout.tsx

# Commit with message
git commit -m "feat(seo): Add Google Search Console verification - STE-28"

# Push to main branch
git push origin main
```

#### Step 5: Wait for Deployment
- [ ] Open Vercel dashboard: https://vercel.com
- [ ] Go to "Portfolio" project
- [ ] Look for deployment status:
  ```
  ✓ Production Deployment
  Deployed to leroysteding.nl
  Status: Ready
  Duration: ~3-5 minutes
  ```
- [ ] Wait for green checkmark (✓ Ready)

#### Step 6: Verify Meta Tag in Browser
- [ ] Open: https://www.leroysteding.nl
- [ ] Right-click → "View Page Source" (or Cmd+U / Ctrl+U)
- [ ] Search: Ctrl+F / Cmd+F for `google-site-verification`
- [ ] Should see:
  ```html
  <meta name="google-site-verification" content="abc123def456ghi789jkl0mnopqrs" />
  ```

---

### ✅ PART 3: VERIFY IN GOOGLE SEARCH CONSOLE (2 min)

#### Step 1: Return to GSC
- [ ] Go back to the GSC window you left open
- [ ] You should still see the verification screen
- [ ] **Click "Verify" button**

#### Step 2: Wait for Confirmation
- [ ] GSC checks if meta tag is present on site
- [ ] Usually takes 10-30 seconds
- [ ] You should see:
  ```
  ✓ Verification successful
  You're now an owner of leroysteding.nl
  ```

#### Step 3: Access GSC Dashboard
- [ ] Click to go to property
- [ ] You now have access to:
  - 📊 Coverage (indexed pages)
  - 📈 Performance (clicks, impressions, rankings)
  - 🔍 Mobile usability
  - ⚡ Core Web Vitals
  - 🗂️ Sitemaps

---

### ✅ PART 4: SUBMIT SITEMAP (3 min)

#### Step 1: In GSC Dashboard
- [ ] Left sidebar → Find **"Sitemaps"**
- [ ] Click on "Sitemaps"

#### Step 2: Submit Sitemap
- [ ] Click **"Add a sitemap"** button
- [ ] Enter: `sitemap.xml`
- [ ] Click **"Submit"**

#### Step 3: Verify Submission
- [ ] You should see:
  ```
  Sitemap: https://www.leroysteding.nl/sitemap.xml
  Status: Success
  ```
- [ ] If not found, try:
  - [ ] Full URL: `https://www.leroysteding.nl/sitemap.xml`
  - [ ] Check robots.txt includes sitemap reference

#### Step 4: Check Coverage
- [ ] Go to **"Coverage"** in left sidebar
- [ ] Should show status like:
  ```
  Valid: 20-50 pages
  Excluded: /api/, /_next/
  ```

---

## 🎯 SUCCESS CRITERIA

You'll know it's complete when:

✅ **Code Level**
- [ ] Meta tag added to `app/layout.tsx`
- [ ] Code committed to git
- [ ] Deployed to Vercel (green ✓)

✅ **Browser Level**
- [ ] Meta tag visible in page source
- [ ] Verification code appears in HTML `<head>`

✅ **GSC Level**
- [ ] Property verified
- [ ] Owner permissions granted
- [ ] Sitemap submitted successfully
- [ ] Coverage shows indexed pages

---

## 🚨 TROUBLESHOOTING

### Issue: "Verification Failed"

**Cause**: Meta tag not found in HTML

**Fix**:
1. Check deployment completed (Vercel shows ✓ Ready)
2. Clear browser cache: Ctrl+Shift+Delete
3. View page source again
4. Wait 5 minutes and retry
5. Check code for typos

### Issue: "Verification Code Not Found"

**Cause**: Code not properly deployed

**Check**:
```bash
# In terminal, curl the website
curl https://www.leroysteding.nl | grep google-site-verification

# Should return the meta tag
```

### Issue: "Sitemap Already Submitted"

**Cause**: GSC auto-discovered from robots.txt

**Solution**: This is fine! Just verify status is "Success"

### Issue: "Property Already Exists"

**Cause**: Domain already in another GSC account

**Solution**:
- Check personal Google account for leroysteding.nl
- Transfer ownership if needed
- Contact Google Support if unsure

---

## 📊 PROGRESS TRACKING

| Phase | Task | Status | Owner | Time |
|-------|------|--------|-------|------|
| **Part 1** | Get GSC code | Ready | Leroy | 5 min |
| **Part 2** | Add to code | ✅ Done | Coder | 5 min |
| **Part 2** | Deploy | ⏳ In Progress | Vercel | 5 min |
| **Part 3** | Verify in GSC | Ready | Leroy | 2 min |
| **Part 4** | Submit sitemap | Ready | Leroy | 3 min |
| **Part 4** | Check coverage | Ready | Leroy | 2 min |
| **TOTAL** | | ⏳ In Progress | — | ~22 min |

---

## 📝 WHAT TO PASTE

**When you get your verification code from GSC:**

### Code format will be:
```
abc123def456ghi789jkl0mnopqrs
```

### Paste it here (replace placeholder):
```typescript
// File: apps/portfolio/app/layout.tsx
verification: {
  google: "abc123def456ghi789jkl0mnopqrs",  // ← YOUR CODE HERE
},
```

---

## 🔗 RESOURCES

- **Google Search Console**: https://search.google.com/search-console
- **Vercel Dashboard**: https://vercel.com/dashboard
- **GSC Help**: https://support.google.com/webmasters/answer/9008080
- **Next.js Metadata**: https://nextjs.org/docs/app/api-reference/functions/generate-metadata

---

## ⏱️ TIMELINE

- **Start Time**: March 4, 2026, 09:31 GMT+1
- **Expected Completion**: March 4, 2026, 09:50 GMT+1
- **Critical Path**: Get code → Add to code → Deploy → Verify

---

## ✅ FINAL VERIFICATION

Once complete, you'll see:

**In Google Search Console**:
- ✓ Property verified
- ✓ Sitemap submitted (Success)
- ✓ Coverage status shows indexed pages
- ✓ Can view performance data

**On Website**:
- ✓ Meta tag in page source
- ✓ GSC property active
- ✓ Ready for SEO monitoring

---

**Task**: STE-28 - Add leroysteding.nl to Google Search Console  
**Status**: 🔴 In Progress (code updated, awaiting GSC verification)  
**Next Step**: Get verification code and deploy
