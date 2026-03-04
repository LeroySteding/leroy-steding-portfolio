# STE-28: Google Search Console Setup — Complete Implementation Guide

**Priority**: 🔴 URGENT  
**Task**: Register leroysteding.nl in GSC and enable SEO tracking  
**Timeline**: 24 hours  
**Status**: 🔴 IN PROGRESS  
**Start Time**: March 4, 2026, 10:34 GMT+1  

---

## 📋 EXECUTIVE SUMMARY

**What needs to happen**:
1. ✅ Register `leroysteding.nl` in Google Search Console
2. ✅ Generate verification meta tag from GSC
3. ✅ Add verification tag to Next.js metadata
4. ✅ Deploy to Vercel
5. ✅ Verify ownership in GSC
6. ✅ Submit sitemap
7. ✅ Enable indexing & performance reports

**Current Status**: Code template ready, awaiting verification code

---

## 🎯 PHASE 1: GET VERIFICATION CODE FROM GSC (5 minutes)

### Prerequisites
- Google account (leroysteding@gmail.com)
- Access to Google Search Console

### Steps 1.1-1.10: Get Your Verification Code

**1.1** Open Google Search Console
```
https://search.google.com/search-console
```

**1.2** Click **"Add Property"** (top-left, blue button)

**1.3** You'll see two options:
```
📌 Domain property
📌 URL prefix property
```

**1.4** ✅ Select **Domain property** (better for comprehensive tracking)

**1.5** Enter your domain:
```
leroysteding.nl
```
(WITHOUT http://, https://, or www)

**1.6** Click **"Continue"**

**1.7** GSC will show verification methods
- DNS (TXT record)
- HTML file
- HTML tag  ← **CHOOSE THIS ONE**
- Google Analytics
- Google Tag Manager

**1.8** ✅ Click the **"HTML tag"** tab or option

**1.9** You'll see:
```html
<meta name="google-site-verification" content="YOUR_CODE_HERE_LIKE_abc123def456" />
```

**1.10** 📋 **COPY your verification code** (the part in quotes)
- Example: `abc123def456ghi789jkl0mnopqrs`
- This is just the code part, NOT the full meta tag

### ⚠️ IMPORTANT
- **KEEP THIS GSC WINDOW OPEN** — you'll need it after deployment
- Don't click "Verify" yet (do it after deployment)

---

## 🔧 PHASE 2: ADD CODE TO WEBSITE (5 minutes)

### File to Update
```
~/Projects/personal/leroy-steding-portfolio/apps/portfolio/app/layout.tsx
```

### Current Code (Lines 37-40)
```typescript
verification: {
  google: "PASTE_YOUR_VERIFICATION_CODE_HERE",
},
```

### What You'll Do
Replace the placeholder with your actual verification code from Phase 1

### Option A: Command Line (Recommended)

#### Step 2.1: Navigate to project
```bash
cd ~/Projects/personal/leroy-steding-portfolio
```

#### Step 2.2: Edit the file
```bash
# Open in nano (simple text editor)
nano apps/portfolio/app/layout.tsx
```

Or open in your favorite editor:
```bash
# VS Code
code apps/portfolio/app/layout.tsx

# Vim
vim apps/portfolio/app/layout.tsx

# Sublime
subl apps/portfolio/app/layout.tsx
```

#### Step 2.3: Find and Replace
Find this line (around line 39):
```typescript
google: "PASTE_YOUR_VERIFICATION_CODE_HERE",
```

Replace with (paste YOUR code from Phase 1, Step 1.10):
```typescript
google: "abc123def456ghi789jkl0mnopqrs",
```

**EXAMPLE of what it should look like after**:
```typescript
verification: {
  google: "abc123def456ghi789jkl0mnopqrs",
},
```

#### Step 2.4: Save and Exit
- **Nano**: Press `Ctrl+O`, then `Enter`, then `Ctrl+X`
- **VS Code**: Ctrl+S
- **Vim**: `:wq` then `Enter`

---

### Option B: Direct String Replacement Script

If you want to automate this, paste your code as the environment variable:

```bash
cd ~/Projects/personal/leroy-steding-portfolio

# Set your verification code
VERIFICATION_CODE="your_code_here"  # Replace with your actual code

# Replace in the file
sed -i '' "s/PASTE_YOUR_VERIFICATION_CODE_HERE/$VERIFICATION_CODE/g" \
  apps/portfolio/app/layout.tsx

# Verify it worked
grep -A 2 "verification:" apps/portfolio/app/layout.tsx
```

**You should see**:
```typescript
verification: {
  google: "your_code_here",
},
```

---

## 📤 PHASE 3: DEPLOY TO VERCEL (5-10 minutes)

### Step 3.1: Verify changes locally
```bash
cd ~/Projects/personal/leroy-steding-portfolio

# Check git status
git status

# You should see: modified apps/portfolio/app/layout.tsx
```

### Step 3.2: Commit changes
```bash
# Stage the file
git add apps/portfolio/app/layout.tsx

# Commit with descriptive message
git commit -m "feat(seo): Add Google Search Console verification meta tag

- Add google-site-verification code to Next.js metadata
- Enables GSC tracking and indexing monitoring
- Closes STE-28"

# Push to main branch
git push origin main
```

### Step 3.3: Wait for Vercel Deployment

**Monitor deployment**:
- Option A: Watch Vercel dashboard
  ```
  https://vercel.com/leroysteding/portfolio
  ```
  Look for status: `✓ Ready`

- Option B: Check via terminal
  ```bash
  # In a new terminal
  watch -n 5 curl -I https://www.leroysteding.nl
  ```
  Wait for `200 OK` response

**Deployment typically takes**: 3-5 minutes

### Step 3.4: Verify Deployment Complete
```bash
# Should show: 200 OK or 301 Redirect
curl -I https://www.leroysteding.nl

# Output should include:
# HTTP/1.1 200 OK
# or
# HTTP/1.1 307 Temporary Redirect
```

---

## ✅ PHASE 4: VERIFY META TAG IS LIVE (2 minutes)

### Method A: Check Page Source

1. Open browser: https://www.leroysteding.nl
2. Right-click → **"View Page Source"** (or Ctrl+U / Cmd+U)
3. Search for: `google-site-verification`
4. You should see:
   ```html
   <meta name="google-site-verification" content="abc123def456ghi789jkl0mnopqrs" />
   ```

### Method B: Command Line Check

```bash
# Fetch the page and search for verification tag
curl https://www.leroysteding.nl | grep "google-site-verification"

# Should output:
# <meta name="google-site-verification" content="abc123def456ghi789jkl0mnopqrs" />
```

### Method C: Advanced Check (Extract Just the Code)

```bash
curl -s https://www.leroysteding.nl | \
  grep -o 'google-site-verification[^"]*"[^"]*"' | \
  sed 's/.*content="\([^"]*\)".*/\1/'

# Should output just the code:
# abc123def456ghi789jkl0mnopqrs
```

**✅ If you see your verification code**: Move to Phase 5

**❌ If you don't see it**: 
- [ ] Wait 5 minutes (caching)
- [ ] Clear browser cache (Ctrl+Shift+Delete)
- [ ] Check Vercel deployment is complete (green ✓)
- [ ] Verify code was added correctly in Step 2.3

---

## 🔐 PHASE 5: VERIFY OWNERSHIP IN GSC (2 minutes)

### Step 5.1: Return to GSC Window
- Go back to the Google Search Console window you left open in Phase 1
- You should still see the verification screen

### Step 5.2: Click "Verify"
- Click the blue **"Verify"** button
- GSC will check if the meta tag is present on your live site

### Step 5.3: Wait for Confirmation
- Processing takes 10-30 seconds
- You should see:
  ```
  ✓ Verification successful
  You are now an owner of leroysteding.nl
  ```

### ⚠️ If Verification Fails

**Cause**: Meta tag not found on site

**Troubleshooting**:
1. [ ] Refresh the page: https://www.leroysteding.nl
2. [ ] Clear your browser cache (Ctrl+Shift+Delete)
3. [ ] Verify meta tag is live (Phase 4, Method A)
4. [ ] Wait 5 minutes for GSC to recheck
5. [ ] Click "Verify" again

---

## 📍 PHASE 6: SUBMIT SITEMAP (3 minutes)

### Prerequisites
- ✅ Ownership verified in GSC (Phase 5)
- ✅ `sitemap.xml` exists at: https://www.leroysteding.nl/sitemap.xml

### Step 6.1: Check Sitemap Exists
```bash
curl -I https://www.leroysteding.nl/sitemap.xml

# Should show: 200 OK
```

### Step 6.2: In GSC Dashboard
1. Go to your verified property: https://search.google.com/search-console
2. Left sidebar → Find **"Sitemaps"**
3. Click on it

### Step 6.3: Add Sitemap
1. Click **"Add a sitemap"** (top-right button)
2. Enter either:
   - Option A: `sitemap.xml` (relative path)
   - Option B: `https://www.leroysteding.nl/sitemap.xml` (full URL)
3. Click **"Submit"**

### Step 6.4: Verify Submission
- You should see:
  ```
  Sitemap: https://www.leroysteding.nl/sitemap.xml
  Status: ✓ Success
  ```
- Shows number of URLs found (e.g., "22 URLs")

### What Happens Next
- ✓ GSC crawls the sitemap
- ✓ Discovers and indexes all URLs
- ✓ Data collection begins

---

## 📊 PHASE 7: ENABLE REPORTS (2 minutes)

### Available Reports After Verification

#### 7.1: Overview Dashboard
- Overview of overall site health
- Key metrics and issues

#### 7.2: Coverage Report
1. Left sidebar → **"Coverage"**
2. Shows:
   - ✓ Valid (indexed pages)
   - ⚠️ Warning (found but not indexed)
   - ❌ Error (crawl/indexing issues)
   - ⊘ Excluded (intentionally excluded)

**Expected for leroysteding.nl**:
- Valid: ~20-50 pages
- Excluded: /api/, /_next/ (by design)

#### 7.3: Performance Report
1. Left sidebar → **"Performance"**
2. Shows (after first week):
   - 📊 Total clicks
   - 📊 Total impressions
   - 📍 Average position
   - 📱 Click-through rate (CTR)

**Note**: May take 7-14 days to show data

#### 7.4: Mobile Usability
1. Left sidebar → **"Mobile usability"**
2. Shows:
   - Mobile-friendly issues
   - Expected: ✓ No issues

#### 7.5: Core Web Vitals
1. Left sidebar → **"Core Web Vitals"**
2. Shows (after sufficient traffic):
   - LCP (Largest Contentful Paint)
   - FID (First Input Delay)
   - CLS (Cumulative Layout Shift)

---

## ✅ COMPLETION CHECKLIST

### Before Starting
- [ ] Have Google account ready (leroysteding@gmail.com)
- [ ] Have access to website code
- [ ] Have git access for deployment

### Phase 1: Get Code from GSC
- [ ] Opened Google Search Console
- [ ] Created domain property for `leroysteding.nl`
- [ ] Selected HTML tag verification method
- [ ] Copied verification code
- [ ] Kept GSC window open

### Phase 2: Add Code to Website
- [ ] Updated `apps/portfolio/app/layout.tsx`
- [ ] Replaced placeholder with actual code
- [ ] Code looks correct (no typos)
- [ ] File saved

### Phase 3: Deploy to Vercel
- [ ] Committed changes with git
- [ ] Pushed to main branch
- [ ] Verified Vercel deployment completed (✓ Ready)
- [ ] Deployment took ~3-5 minutes

### Phase 4: Verify Meta Tag
- [ ] Opened https://www.leroysteding.nl
- [ ] Checked page source for verification tag
- [ ] Confirmed code is present and correct
- [ ] OR ran curl command and saw code

### Phase 5: Verify in GSC
- [ ] Clicked "Verify" button in GSC
- [ ] Received success message
- [ ] Now owner of leroysteding.nl property

### Phase 6: Submit Sitemap
- [ ] Verified sitemap.xml exists
- [ ] Added to GSC
- [ ] Saw "Success" status
- [ ] GSC shows URL count

### Phase 7: Check Reports
- [ ] Coverage report shows indexed pages
- [ ] Mobile usability shows no issues
- [ ] Can access Performance report (data incoming)
- [ ] Can access Core Web Vitals (data incoming)

---

## 🎯 SUCCESS INDICATORS

You'll know it's complete when:

**In Code**:
- ✅ `layout.tsx` has real verification code (not placeholder)
- ✅ Code committed and deployed to Vercel

**In Browser**:
- ✅ Visit https://www.leroysteding.nl
- ✅ View page source
- ✅ See: `<meta name="google-site-verification" content="your_code" />`

**In Google Search Console**:
- ✅ Property shows: "Verified"
- ✅ Owner permissions granted
- ✅ Sitemap shows: "Success"
- ✅ Coverage report shows indexed pages
- ✅ Can access all reports

---

## 🔍 VERIFICATION COMMAND REFERENCE

Quick commands to verify each phase:

```bash
# Phase 2: Check code was added
grep "google:" ~/Projects/personal/leroy-steding-portfolio/apps/portfolio/app/layout.tsx

# Phase 3: Check deployment status
curl -I https://www.leroysteding.nl | head -1

# Phase 4: Verify meta tag is live
curl -s https://www.leroysteding.nl | grep google-site-verification

# Phase 6: Verify sitemap exists
curl -I https://www.leroysteding.nl/sitemap.xml
```

---

## 🚨 COMMON ISSUES & SOLUTIONS

### Issue 1: "Verification Failed - Meta Tag Not Found"

**Cause**: Meta tag not deployed or cache issues

**Solutions**:
```bash
# 1. Check if deployed
curl -s https://www.leroysteding.nl | grep google-site-verification

# 2. If not found, check Vercel deployment
# Go to: https://vercel.com/leroysteding/portfolio
# Look for: ✓ Ready status

# 3. If deployed, clear cache and try again
# Browser: Ctrl+Shift+Delete
# Then retry GSC verification in 5 minutes
```

### Issue 2: "Code Looks Different Than Expected"

**Cause**: Placeholder not replaced correctly

**Solution**:
```bash
# View the current code
cat ~/Projects/personal/leroy-steding-portfolio/apps/portfolio/app/layout.tsx | \
  grep -A 2 "verification:"

# Should show:
# verification: {
#   google: "your_actual_code_here",

# If it shows the placeholder, edit again and save
```

### Issue 3: "Sitemap Shows as Error"

**Cause**: Sitemap not found or invalid XML

**Solution**:
```bash
# Check if sitemap exists
curl -I https://www.leroysteding.nl/sitemap.xml

# Should show: 200 OK

# Check XML validity
curl https://www.leroysteding.nl/sitemap.xml | head -20

# Should show valid XML starting with: <?xml version="1.0"...
```

---

## 📅 TIMELINE BREAKDOWN

| Phase | Task | Time | Cumulative |
|-------|------|------|-----------|
| **1** | Get GSC code | 5 min | 5 min |
| **2** | Add to code | 5 min | 10 min |
| **3** | Deploy | 5-10 min | 15-20 min |
| **4** | Verify tag | 2 min | 17-22 min |
| **5** | Verify in GSC | 2 min | 19-24 min |
| **6** | Submit sitemap | 3 min | 22-27 min |
| **7** | Check reports | 2 min | 24-29 min |
| **TOTAL** | | | ~25-30 min |

**Buffer for delays**: Add 10-15 minutes for waiting on deployments

---

## 👥 TEAM COORDINATION

### If You're Implementing (Leroy/Coder)
1. Get verification code from GSC (Phase 1)
2. Add code to website (Phase 2)
3. Deploy (Phase 3)
4. Verify meta tag (Phase 4)
5. Complete verification in GSC (Phase 5)
6. Submit sitemap (Phase 6)

### If Coordinating with Coder
1. **You (Leroy)**: Get code from GSC (Phase 1)
2. **You → Coder**: Share verification code
3. **Coder**: Add code and deploy (Phase 2-3)
4. **You**: Verify in GSC (Phase 4-5)
5. **You**: Submit sitemap (Phase 6)

---

## 📚 REFERENCE RESOURCES

- **Google Search Console**: https://search.google.com/search-console
- **GSC Help**: https://support.google.com/webmasters/answer/9008080
- **Next.js Metadata**: https://nextjs.org/docs/app/api-reference/functions/generate-metadata
- **Vercel Dashboard**: https://vercel.com/dashboard
- **leroysteding.nl Sitemap**: https://www.leroysteding.nl/sitemap.xml

---

## 📞 SUPPORT

If you get stuck:
1. Check the **Troubleshooting** section above
2. Verify your code matches the examples
3. Run the verification commands
4. Wait 5-10 minutes and try again (caching)
5. Contact @steding_orchestrator_bot for help

---

## ✍️ NOTES

**Code Changes**: 
- File: `apps/portfolio/app/layout.tsx`
- Line: ~39
- Change: Replace placeholder with actual GSC code

**No Breaking Changes**:
- This is a metadata addition only
- No functional changes to website
- Safe to deploy

**Data Collection**:
- Begins immediately after verification
- Some metrics take 7-14 days to populate
- Performance/rankings visible after traffic

---

**Task**: STE-28 - Google Search Console Setup  
**Status**: 🔴 IN PROGRESS  
**Next Step**: Execute Phase 1-7 in order  
**Deadline**: March 5, 2026, 10:34 GMT+1 (24 hours)

---
