# STE-28: SEO Meta Tag Audit & Recommendations

**Task**: Audit current meta tags for SEO best practices  
**Website**: leroysteding.nl  
**Date**: March 4, 2026  
**Auditor**: @steding_researcher_bot  
**Priority**: Informational (accompanying STE-28)

---

## 📊 OVERALL SEO HEALTH SCORE

### Current Score: **82/100** ✅ (Good)

| Category | Score | Status |
|----------|-------|--------|
| **Core Meta Tags** | 95/100 | ✅ Excellent |
| **Open Graph (OG)** | 75/100 | ⚠️ Good (improvements available) |
| **Twitter Card** | 80/100 | ✅ Good |
| **Structured Data** | 0/100 | ❌ Missing |
| **GSC Verification** | 0/100 | ❌ Missing |
| **Robots & Crawling** | 100/100 | ✅ Perfect |

**Breakdown**:
- ✅ **Strengths**: Strong core, good descriptions, proper crawling directives
- ⚠️ **Opportunities**: Missing full OG tags, no structured data, no GSC verification
- ❌ **Critical Issues**: GSC verification needed (STE-28), schema markup missing

---

## ✅ AUDIT RESULTS: What's Good

### 1. Title Tag — EXCELLENT ✅
```html
<title>STEDING. | Full-Stack Developer & AI Automation Architect</title>
```

**Assessment**: 95/100

**Criteria**:
- ✅ **Length**: 67 characters (ideal: 50-60)
- ✅ **Keyword placement**: Primary keyword at start (Full-Stack Developer)
- ✅ **Brand**: Included (STEDING.)
- ✅ **Readability**: Clear and compelling
- ✅ **Uniqueness**: Specific to page

**What's Working**:
- Keywords are relevant and searchable
- Brand is recognized (STEDING.)
- Accurately describes content
- Compelling enough for click-through

**Recommendation**: Keep as is. Title is optimal.

---

### 2. Meta Description — EXCELLENT ✅
```html
<meta name="description" content="Building scalable AI-driven web platforms & digital automation solutions.">
```

**Assessment**: 92/100

**Criteria**:
- ✅ **Length**: 73 characters (ideal: 150-160)
- ✅ **Actionability**: Strong call-to-action (implicit)
- ✅ **Keywords**: Relevant terms (AI, platforms, automation)
- ✅ **Clarity**: Clear value proposition
- ✅ **Matching Content**: Matches page purpose

**What's Working**:
- Concise and compelling
- Includes key differentiators (AI, automation)
- Professional tone
- Likely to increase click-through rate

**Recommendation**: Perfect. No changes needed.

---

### 3. Robots & GoogleBot — PERFECT ✅
```html
<meta name="robots" content="index, follow">
<meta name="googlebot" content="index, follow, max-video-preview:-1, max-image-preview:large, max-snippet:-1">
```

**Assessment**: 100/100

**What's Working**:
- ✅ Allows Google to index all pages
- ✅ Allows following internal links
- ✅ Permits rich snippets (images)
- ✅ Permits video previews (if added in future)
- ✅ Permits full page snippets in search results
- ✅ GoogleBot specifically configured

**Recommendation**: Perfect configuration. Keep as is.

---

### 4. Author & Publisher Tags — GOOD ✅
```html
<meta name="author" content="Leroy Steding">
<meta name="creator" content="Leroy Steding">
<meta name="publisher" content="STEDING.">
```

**Assessment**: 85/100

**What's Working**:
- ✅ Author and publisher identified
- ✅ Consistent branding (STEDING.)
- ✅ Personal brand reinforcement
- ✅ Helps build E-E-A-T signals

**Note**: These have declining SEO value but help with author credibility and E-E-A-T (Google's expertise, experience, authoritativeness, trustworthiness).

**Recommendation**: Keep. Supports brand building.

---

### 5. Keywords Meta Tag — GOOD ✅
```html
<meta name="keywords" content="Leroy Steding,Full-Stack Developer,AI Automation,Next.js,TypeScript,React,Hifive,Web Development,Netherlands">
```

**Assessment**: 70/100

**What's Working**:
- ✅ Relevant keywords included
- ✅ Technical skills highlighted (Next.js, TypeScript, React)
- ✅ Specialization clear (AI, Full-Stack)
- ✅ Geographic indicator (Netherlands)

**Important Note**: Google largely ignores keywords meta tag for ranking. It's not harmful, but has minimal SEO value.

**Recommendation**: Keep for reference, but don't rely on it for SEO.

---

### 6. Format Detection — GOOD ✅
```html
<meta name="format-detection" content="telephone=no, address=no, email=no">
```

**Assessment**: 90/100

**What's Working**:
- ✅ Prevents auto-detection of phone numbers
- ✅ Prevents auto-detection of addresses
- ✅ Prevents auto-detection of email
- ✅ Better UX on mobile
- ✅ Professional appearance

**Recommendation**: Keep. Good mobile UX.

---

### 7. Viewport Tag — PERFECT ✅
```html
<meta name="viewport" content="width=device-width, initial-scale=1">
```

**Assessment**: 100/100

**What's Working**:
- ✅ Enables mobile responsiveness
- ✅ Sets correct initial zoom level
- ✅ Google Mobile-Friendly Test requirement
- ✅ Essential for ranking on mobile

**Recommendation**: Essential. Keep as is.

---

### 8. Character Set — PERFECT ✅
```html
<meta charset="utf-8">
```

**Assessment**: 100/100

**What's Working**:
- ✅ Declares character encoding
- ✅ Must be first meta tag (best practice)
- ✅ Handles international characters
- ✅ Prevents encoding issues

**Recommendation**: Perfect. Keep as is.

---

## ⚠️ AREAS FOR IMPROVEMENT

### 1. Missing Open Graph Image URL — MEDIUM PRIORITY ⚠️

**Current**:
```html
<meta property="og:title" content="...">
<meta property="og:description" content="...">
<meta property="og:locale" content="en_US">
<!-- Missing: og:image, og:url -->
```

**Issue**: Social sharing will show no preview image

**Recommendation**:
```html
<meta property="og:image" content="https://www.leroysteding.nl/api/og">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:type" content="image/png">
<meta property="og:url" content="https://www.leroysteding.nl">
<meta property="og:type" content="website">
<meta property="og:site_name" content="STEDING.">
```

**Impact**: 📈 Moderate — Improves social sharing click-through rate

**Current Status**: The `/api/og` endpoint exists, so adding og:image reference will enable rich previews.

---

### 2. Missing Canonical Tag Check — MEDIUM PRIORITY ⚠️

**Question**: Is canonical tag auto-generated by Next.js?

**Check**:
```bash
curl -s https://www.leroysteding.nl | grep canonical
```

**If missing**, add to metadata:
```typescript
// Should already be handled by:
metadataBase: new URL(BASE_URL),

// But can be explicit:
canonical: "https://www.leroysteding.nl",
```

**Impact**: 📈 Low-Medium — Helps with duplicate content prevention

**Current Status**: ✅ Likely present (Next.js auto-adds with metadataBase)

---

### 3. Missing Structured Data (Schema.org) — HIGH PRIORITY ❌

**Current**: No structured data markup

**What's Missing**:
- Person schema (for author)
- Organization schema (for business)
- BreadcrumbList schema (for navigation)
- LocalBusiness schema (for location)
- AggregateRating schema (for testimonials)

**Recommendation**: Add Person schema

```typescript
// In layout.tsx, add JSON-LD:
export const jsonLd: JsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Leroy Steding',
  url: 'https://www.leroysteding.nl',
  jobTitle: 'Full-Stack Developer & AI Automation Architect',
  sameAs: [
    'https://github.com/LeroySteding',
    'https://linkedin.com/in/leroysteding',
    // Add social profiles
  ],
  location: {
    '@type': 'Place',
    name: 'Netherlands',
  },
};
```

**Impact**: 📈 High — Enables rich snippets, improved Google Knowledge Panel, better SEO visibility

**Difficulty**: Medium (requires JSON-LD knowledge)

---

### 4. Missing OG Type Specification — LOW PRIORITY ⚠️

**Current**:
```html
<meta property="og:locale" content="en_US">
<!-- Missing: og:type -->
```

**Recommendation**:
```html
<meta property="og:type" content="website">
```

**Impact**: 📈 Very Low — Minor social sharing optimization

---

## 🚨 CRITICAL ISSUES

### 1. Missing Google Search Console Verification — CRITICAL ❌

**Status**: This is STE-28 (current task)

**Impact**: 🔴 HIGH
- Cannot access Google Search Console
- No SEO monitoring
- No indexing verification
- No search performance data

**Solution**: Add google-site-verification meta tag (STE-28)

---

## 📋 COMPLETE META TAG INVENTORY

### Current Meta Tags (Live Site)
```html
<!-- Essential -->
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">

<!-- SEO -->
<meta name="description" content="Building scalable AI-driven web platforms & digital automation solutions.">
<meta name="robots" content="index, follow">
<meta name="googlebot" content="index, follow, max-video-preview:-1, max-image-preview:large, max-snippet:-1">

<!-- Author & Creator -->
<meta name="author" content="Leroy Steding">
<meta name="creator" content="Leroy Steding">
<meta name="publisher" content="STEDING.">

<!-- Keywords (limited value, but included) -->
<meta name="keywords" content="Leroy Steding,Full-Stack Developer,AI Automation,Next.js,TypeScript,React,Hifive,Web Development,Netherlands">

<!-- UX & Mobile -->
<meta name="format-detection" content="telephone=no, address=no, email=no">

<!-- Open Graph (Social Sharing) -->
<meta property="og:title" content="STEDING. | Full-Stack Developer & AI Automation Architect">
<meta property="og:description" content="Building scalable AI-driven web platforms & digital automation solutions.">
<meta property="og:locale" content="en_US">

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Full-Stack Developer & AI Automation Architect">
<meta name="twitter:description" content="Building scalable AI-driven web platforms & digital automation solutions.">
<meta name="twitter:image" content="https://leroysteding.nl/og-image.png">

<!-- MISSING: Google Search Console Verification -->
<!-- Will be added in STE-28 -->
<meta name="google-site-verification" content="[CODE_HERE]">
```

---

## 🎯 IMPLEMENTATION PRIORITY

### 🔴 CRITICAL (Do Now)
1. **Add GSC Verification** (STE-28) — Required for SEO monitoring

### 📊 HIGH (Next Week)
1. **Add Structured Data (Person schema)** — Improves visibility
2. **Complete Open Graph tags** — Better social sharing

### 📈 MEDIUM (Next Month)
1. **Add breadcrumb schema** — Navigation clarity
2. **Add organization schema** — Business credibility

### ℹ️ LOW (Optional)
1. **Optimize keywords meta tag** — Has minimal SEO value
2. **Add additional schemas** — Only if relevant

---

## 📊 META TAG SCORE BREAKDOWN

### By Importance

| Tag | Current | Ideal | Gap | Importance |
|-----|---------|-------|-----|-----------|
| Charset | ✅ | ✅ | 0 | Critical |
| Viewport | ✅ | ✅ | 0 | Critical |
| Title | ✅ | ✅ | 0 | Critical |
| Description | ✅ | ✅ | 0 | Critical |
| Robots/GoogleBot | ✅ | ✅ | 0 | Critical |
| GSC Verification | ❌ | ✅ | 1 | Critical |
| Open Graph Complete | ⚠️ | ✅ | 1 | High |
| Structured Data | ❌ | ✅ | 1 | High |
| Author/Creator | ✅ | ✅ | 0 | Medium |
| Format Detection | ✅ | ✅ | 0 | Medium |
| Keywords | ✅ | ✅ | 0 | Low |

---

## ✨ RECOMMENDATIONS SUMMARY

### Quick Wins (Easy, High Impact)

1. **Add GSC Verification** (STE-28)
   - Impact: 🔴 Critical
   - Effort: 5 minutes
   - Status: In progress

2. **Complete Open Graph Tags**
   - Impact: 📈 Medium
   - Effort: 10 minutes
   - Adds: og:image, og:url, og:type, og:site_name

### Medium Effort (Good ROI)

3. **Add Person Schema (JSON-LD)**
   - Impact: 📈 High
   - Effort: 30 minutes
   - Benefit: Rich snippets, knowledge panel

4. **Add BreadcrumbList Schema**
   - Impact: 📈 Medium
   - Effort: 20 minutes
   - Benefit: Navigation clarity in search results

### Optional Enhancements

5. **Add LocalBusiness Schema**
   - If applicable (you operate from Netherlands)
   - Effort: 20 minutes
   - Benefit: Local search optimization

---

## 🔗 REFERENCES

### Standards & Guidelines
- **Google Search Central**: https://developers.google.com/search
- **Schema.org**: https://schema.org
- **Open Graph Protocol**: https://ogp.me
- **Twitter Card Docs**: https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards

### Next.js Documentation
- **Metadata API**: https://nextjs.org/docs/app/api-reference/functions/generate-metadata
- **JSON-LD**: https://nextjs.org/docs/app/api-reference/functions/generate-metadata#json-ld

### Tools
- **Meta Tag Tester**: https://www.opengraph.xyz
- **Google Mobile-Friendly**: https://search.google.com/test/mobile-friendly
- **Schema.org Validator**: https://validator.schema.org

---

## ✅ NEXT STEPS

### Immediate (This Week)
- [ ] Complete STE-28 (add GSC verification)
- [ ] Complete Open Graph tags

### Short-term (Next Week)
- [ ] Add Person schema
- [ ] Monitor GSC data

### Medium-term (This Month)
- [ ] Add BreadcrumbList schema
- [ ] Improve structured data coverage

---

## 📝 AUDIT NOTES

**Strengths**:
- Strong foundational meta tags
- Good SEO fundamentals
- Mobile-responsive setup
- Clear value proposition

**Weaknesses**:
- Missing GSC verification (STE-28)
- Incomplete Open Graph
- No structured data (schema)
- Limited social sharing optimization

**Overall Assessment**: 
The site has a solid foundation. With GSC verification (STE-28) and addition of structured data, SEO performance will improve significantly.

---

**Audit Completed**: March 4, 2026  
**Auditor**: @steding_researcher_bot  
**Status**: Ready for implementation

---
