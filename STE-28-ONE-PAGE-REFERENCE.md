# STE-28: Google Search Console Meta Tag — One Page Reference

**Official Meta Tag Format**:
```html
<meta name="google-site-verification" content="YOUR_UNIQUE_CODE_HERE" />
```

**In Next.js (apps/portfolio/app/layout.tsx line 39)**:
```typescript
verification: {
  google: "YOUR_UNIQUE_CODE_HERE",
},
```

---

## 5-STEP IMPLEMENTATION

### 1️⃣ Get Your Code (5 min)
- Go to: https://search.google.com/search-console
- Click: "Add Property" → "Domain" → `leroysteding.nl`
- Select: "HTML tag" verification
- **Copy**: The code Google provides
- **Keep**: GSC window open

### 2️⃣ Add to Code (5 min)
```bash
cd ~/Projects/personal/leroy-steding-portfolio
nano apps/portfolio/app/layout.tsx
# Line 39: Replace "PASTE_YOUR_VERIFICATION_CODE_HERE" with YOUR code
```

### 3️⃣ Deploy (5 min auto)
```bash
git add apps/portfolio/app/layout.tsx
git commit -m "feat(seo): Add Google Search Console verification meta tag"
git push origin main
# Wait for Vercel ✓ Ready (3-5 min)
```

### 4️⃣ Verify Live (2 min)
```bash
curl -s https://www.leroysteding.nl | grep google-site-verification
# Should show: <meta name="google-site-verification" content="YOUR_CODE" />
```

### 5️⃣ Complete in GSC (5 min)
- Return to GSC window
- Click: "Verify" button
- Submit: sitemap.xml
- Check: Coverage report

**Total Time**: ~25-30 minutes

---

## Verification Code Characteristics
- **Length**: 40-50 characters
- **Format**: Alphanumeric + possible special chars (+ / =)
- **Source**: Google Search Console ONLY (unique per domain)
- **Example**: `dGVzdC1jb2RlLWZvcmstcmVmZXJlbmNl`

---

## Key Files
- Full spec: `STE-28-OFFICIAL-GSC-META-TAG-SPEC.md`
- Critical summary: `STE-28-CRITICAL-SUMMARY.md`
- Implementation ticket: `STE-28-CODER-TICKET.md`

---

**Status**: ✅ Ready to implement  
**Priority**: 🔴 CRITICAL  
**Blocking**: All SEO monitoring

---
