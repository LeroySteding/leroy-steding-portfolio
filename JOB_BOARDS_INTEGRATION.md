# Job Boards Integration Plan
## Expanding Beyond ProLinker

**Date**: March 3, 2026  
**Goal**: Add 15+ job boards for comprehensive job coverage  
**Target**: Dutch + European + Remote freelance/contract work

---

## 🎯 Job Boards by Category

### 🇳🇱 Dutch Freelance Platforms (High Priority)

| Platform | URL | Focus | Scraping Difficulty | Monthly Volume |
|----------|-----|-------|-------------------|----------------|
| **Freep** | freep.nl | Government contracts | Medium | ~200-300 |
| **Freelance.nl** | freelance.nl | General freelance | Medium | ~500+ |
| **Freelancer.nl** | freelancer.nl | Dutch marketplace | Medium | ~300+ |
| **Hoofdkraan** | hoofdkraan.nl | IT/Tech freelance | Medium | ~150-200 |
| **Jellow** | jellow.nl | Professional services | Low | ~100+ |
| **YourSurprise Jobs** | yoursurprise.com/jobs | Creative/Tech | Low | ~50 |
| **Lancebase** | lancebase.io | Developer-focused | Low | ~80-100 |

### 🌍 European Remote (Medium Priority)

| Platform | URL | Focus | Scraping Difficulty | Monthly Volume |
|----------|-----|-------|-------------------|----------------|
| **Remote in Europe** | remoteineurope.com | EU remote jobs | Low | ~200+ |
| **EU Remote Jobs** | euremotejobs.com | EU-based remote | Low | ~150+ |
| **We Work Remotely** | weworkremotely.com | Global remote | Medium | ~500+ |
| **Remotive** | remotive.com | Remote tech jobs | Medium | ~300+ |
| **Remote Rocketship** | remoterocketship.com | Software engineers | Low | ~100+ |
| **NoDesk** | nodesk.co | Digital nomad jobs | Low | ~80+ |

### 🌐 Global Freelance (Lower Priority)

| Platform | URL | Focus | Scraping Difficulty | Monthly Volume |
|----------|-----|-------|-------------------|----------------|
| **Arc** | arc.dev/en-nl | Developer marketplace | High (requires auth) | ~400+ |
| **Upwork** | upwork.com | Global freelance | High (auth) | ~1000+ |
| **Toptal** | toptal.com | Elite freelancers | High (auth) | ~50+ |
| **Workana** | workana.com | Latin America/Europe | Medium | ~200+ |
| **Twine** | twine.net | Creative/Tech | Low | ~150+ |
| **Gun.io** | gun.io | Vetted developers | High | ~30+ |

### 📋 Job Aggregators (Bonus)

| Platform | URL | Focus | Scraping Difficulty | Notes |
|----------|-----|-------|-------------------|-------|
| **Jooble** | jooble.org | Job aggregator | Low | Aggregates from many sources |
| **Indeed** | indeed.nl | All job types | Medium | Huge volume, rate limits |
| **LinkedIn Jobs** | linkedin.com/jobs | Professional network | High | Requires auth |
| **Glassdoor** | glassdoor.com | Jobs + reviews | Medium | Good salary data |

---

## 🏗️ Implementation Architecture

### Phase 1: Multi-Source Scraper (Week 1)

Create `apps/admin/scripts/multi-source-scraper.ts`:

```typescript
interface JobSource {
  id: string;
  name: string;
  url: string;
  scraper: (page: Page) => Promise<Job[]>;
  priority: "high" | "medium" | "low";
  rateLimit: number; // requests per minute
  enabled: boolean;
}

const JOB_SOURCES: JobSource[] = [
  {
    id: "prolinker",
    name: "ProLinker",
    url: "https://www.prolinker.nl",
    scraper: scrapeProLinker,
    priority: "high",
    rateLimit: 10,
    enabled: true,
  },
  {
    id: "freep",
    name: "Freep",
    url: "https://www.freep.nl",
    scraper: scrapeFreep,
    priority: "high",
    rateLimit: 10,
    enabled: true,
  },
  {
    id: "freelance-nl",
    name: "Freelance.nl",
    url: "https://www.freelance.nl",
    scraper: scrapeFreelanceNl,
    priority: "high",
    rateLimit: 10,
    enabled: true,
  },
  {
    id: "remote-in-europe",
    name: "Remote in Europe",
    url: "https://remoteineurope.com",
    scraper: scrapeRemoteInEurope,
    priority: "medium",
    rateLimit: 10,
    enabled: true,
  },
  // ... more sources
];

async function scrapeAllSources(sources: JobSource[]): Promise<Job[]> {
  const allJobs: Job[] = [];
  
  // Sort by priority
  const sortedSources = sources
    .filter(s => s.enabled)
    .sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });

  for (const source of sortedSources) {
    try {
      console.log(`[SCRAPER] Scraping ${source.name}...`);
      
      const jobs = await executeWithRetry(
        () => source.scraper(page),
        {
          maxRetries: 3,
          initialDelay: 5000,
          backoffMultiplier: 2,
        }
      );

      console.log(`[SCRAPER] ${source.name}: Found ${jobs.length} jobs`);
      
      // Tag with source
      const taggedJobs = jobs.map(job => ({
        ...job,
        source: source.id,
      }));

      allJobs.push(...taggedJobs);

      // Rate limiting
      await sleep(60000 / source.rateLimit);
    } catch (error) {
      console.error(`[SCRAPER] ${source.name} failed:`, error);
      // Continue with other sources
    }
  }

  return allJobs;
}
```

### Phase 2: Individual Scrapers (Week 2-3)

Create scraper functions for each platform:

**Freep Scraper** (`scrapers/freep.ts`):
```typescript
async function scrapeFreep(page: Page): Promise<Job[]> {
  await page.goto("https://www.freep.nl/opdrachten");
  
  const jobs: Job[] = [];
  
  const listings = await page.$$(".job-listing");
  
  for (const listing of listings) {
    const title = await listing.$eval(".title", el => el.textContent);
    const company = await listing.$eval(".company", el => el.textContent);
    const url = await listing.$eval("a", el => el.href);
    const description = await listing.$eval(".description", el => el.textContent);
    
    // Extract rate/salary if available
    const rateMatch = description.match(/€(\d+)[.-]?(\d+)?/);
    const rate = rateMatch ? `€${rateMatch[1]}${rateMatch[2] ? '-' + rateMatch[2] : ''}` : undefined;
    
    jobs.push({
      title,
      company,
      url,
      description,
      salary: rate,
      location: "Netherlands", // Freep is Dutch-only
      remote: description.toLowerCase().includes("remote"),
      postedAt: Date.now(),
      source: "freep",
    });
  }
  
  return jobs;
}
```

**Remote in Europe Scraper** (`scrapers/remote-in-europe.ts`):
```typescript
async function scrapeRemoteInEurope(page: Page): Promise<Job[]> {
  await page.goto("https://remoteineurope.com");
  
  const jobs: Job[] = [];
  
  // This site has a clean structure
  const jobCards = await page.$$(".job-card");
  
  for (const card of jobCards) {
    const title = await card.$eval("h2", el => el.textContent);
    const company = await card.$eval(".company-name", el => el.textContent);
    const url = await card.$eval("a", el => el.href);
    const tags = await card.$$eval(".tag", els => els.map(e => e.textContent));
    
    // Filter for React/TypeScript/Full-stack jobs
    const relevantTags = tags.filter(tag =>
      ["React", "TypeScript", "JavaScript", "Full-stack", "Frontend", "Backend"].includes(tag)
    );
    
    if (relevantTags.length === 0) continue; // Skip irrelevant jobs
    
    jobs.push({
      title,
      company,
      url,
      description: tags.join(", "),
      technologies: relevantTags,
      location: "Remote (Europe)",
      remote: true,
      postedAt: Date.now(),
      source: "remote-in-europe",
    });
  }
  
  return jobs;
}
```

### Phase 3: Workflow Integration (Week 4)

Update `convex/workflow_engine_templates.ts` to add multi-source job application workflow:

```typescript
"multi-source-job-hunt": {
  templateId: "multi-source-job-hunt",
  name: "Multi-Source Job Hunt",
  description: "Scrape 10+ job boards, match, and auto-apply",
  category: "automation",
  steps: [
    {
      stepId: "scrape-dutch",
      name: "Scrape Dutch Platforms (Freep, Freelance.nl, etc.)",
      agent: "data-scraper",
      dependencies: [],
      timeoutMs: 900000, // 15 min
      maxRetries: 3,
      canRunInParallel: false,
    },
    {
      stepId: "scrape-europe",
      name: "Scrape European Platforms (Remote in Europe, etc.)",
      agent: "data-scraper",
      dependencies: [],
      timeoutMs: 900000, // 15 min
      maxRetries: 3,
      canRunInParallel: true, // Can run parallel with Dutch scraping
    },
    {
      stepId: "deduplicate",
      name: "Deduplicate Jobs",
      agent: "data-scraper",
      dependencies: ["scrape-dutch", "scrape-europe"],
      timeoutMs: 180000, // 3 min
      maxRetries: 1,
      canRunInParallel: false,
    },
    {
      stepId: "score-all",
      name: "Score All Jobs",
      agent: "researcher",
      dependencies: ["deduplicate"],
      timeoutMs: 600000, // 10 min
      maxRetries: 2,
      canRunInParallel: false,
    },
    {
      stepId: "filter-top-50",
      name: "Filter Top 50 Matches",
      agent: "orchestrator",
      dependencies: ["score-all"],
      timeoutMs: 60000, // 1 min
      maxRetries: 1,
      canRunInParallel: false,
    },
    {
      stepId: "batch-cover-letters",
      name: "Generate Cover Letters (Batch)",
      agent: "business",
      dependencies: ["filter-top-50"],
      timeoutMs: 1800000, // 30 min
      maxRetries: 2,
      canRunInParallel: false,
    },
    {
      stepId: "auto-apply-high-matches",
      name: "Auto-Apply (Score > 85)",
      agent: "coder",
      dependencies: ["batch-cover-letters"],
      timeoutMs: 1800000, // 30 min
      maxRetries: 2,
      canRunInParallel: false,
    },
    {
      stepId: "manual-review-queue",
      name: "Queue Medium Matches (70-85) for Review",
      agent: "orchestrator",
      dependencies: ["batch-cover-letters"],
      timeoutMs: 60000, // 1 min
      maxRetries: 1,
      canRunInParallel: true, // Can run while auto-apply happens
    },
    {
      stepId: "digest-report",
      name: "Send Daily Digest",
      agent: "orchestrator",
      dependencies: ["auto-apply-high-matches", "manual-review-queue"],
      timeoutMs: 180000, // 3 min
      maxRetries: 3,
      canRunInParallel: false,
    },
  ],
  defaultPriority: "high" as const,
  estimatedDurationMs: 5400000, // ~1.5 hours
  requiredContext: ["targetRole", "minSalary", "preferredLocations"],
},
```

### Phase 4: Deduplication Logic (Week 4)

Create `apps/admin/scripts/deduplicate-jobs.ts`:

```typescript
function deduplicateJobs(jobs: Job[]): Job[] {
  const seen = new Map<string, Job>();
  
  for (const job of jobs) {
    // Generate fingerprint
    const fingerprint = generateJobFingerprint(job);
    
    if (seen.has(fingerprint)) {
      // Merge sources
      const existing = seen.get(fingerprint)!;
      existing.sources = [...(existing.sources || [existing.source]), job.source];
    } else {
      seen.set(fingerprint, job);
    }
  }
  
  return Array.from(seen.values());
}

function generateJobFingerprint(job: Job): string {
  // Normalize and create hash
  const normalized = {
    title: normalizeTitle(job.title),
    company: normalizeCompany(job.company),
    location: normalizeLocation(job.location),
  };
  
  return `${normalized.company}:${normalized.title}:${normalized.location}`;
}

function normalizeTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/senior|sr\.|jr\.|junior/gi, "")
    .replace(/developer|dev|engineer/gi, "dev")
    .replace(/react\.?js|reactjs/gi, "react")
    .replace(/type ?script/gi, "typescript")
    .trim();
}
```

---

## 📊 Expected Results

### Volume Increase

| Source Type | Platforms | Daily Jobs | Monthly Jobs |
|-------------|-----------|------------|--------------|
| Dutch Freelance | 7 | ~50 | ~1,500 |
| EU Remote | 6 | ~30 | ~900 |
| Global | 6 | ~40 | ~1,200 |
| **TOTAL** | **19** | **~120** | **~3,600** |

**Current** (ProLinker only): ~10-15 jobs/day  
**After expansion**: ~120 jobs/day (8x increase)

### Match Rate Improvement

- Current: ~5-10 matches/week (score > 70)
- After expansion: ~40-60 matches/week
- **6-8x increase in opportunities**

---

## 🚀 Quick Start Implementation

### Step 1: Add Freep Scraper (Today, 1-2 hours)

```bash
cd ~/Projects/personal/leroy-steding-portfolio/apps/admin/scripts

# Create scraper
cat > scrape-freep.ts << 'EOF'
import puppeteer from "puppeteer";
import { pushToConvex } from "./convex-push";

async function scrapeFreep() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  await page.goto("https://www.freep.nl/opdrachten");
  
  const jobs = await page.$$eval(".job-listing", (listings) => {
    return listings.map((listing) => ({
      title: listing.querySelector(".title")?.textContent || "",
      company: listing.querySelector(".company")?.textContent || "",
      url: listing.querySelector("a")?.href || "",
      description: listing.querySelector(".description")?.textContent || "",
    }));
  });
  
  console.log(`Found ${jobs.length} jobs from Freep`);
  
  // Push to Convex
  for (const job of jobs) {
    await pushToConvex("scraped_jobs:push", {
      ...job,
      source: "freep",
      scrapedAt: Date.now(),
      technologies: extractTechnologies(job.description),
    });
  }
  
  await browser.close();
}

function extractTechnologies(text: string): string[] {
  const techKeywords = [
    "React", "Next.js", "TypeScript", "JavaScript", "Node.js",
    "Python", "Java", "C#", ".NET", "AWS", "Azure", "Docker",
    "Kubernetes", "MongoDB", "PostgreSQL", "GraphQL", "REST API"
  ];
  
  return techKeywords.filter(tech =>
    text.toLowerCase().includes(tech.toLowerCase())
  );
}

scrapeFreep().catch(console.error);
EOF

# Test it
npx tsx scrape-freep.ts
```

### Step 2: Add to Cron (5 min)

Update `.openclaw/cron jobs` or create new cron:

```typescript
{
  "id": "freep-scraper",
  "agentId": "main",
  "name": "Freep Job Scraper",
  "enabled": true,
  "schedule": {
    "kind": "cron",
    "expr": "0 */6 * * *", // Every 6 hours
    "tz": "Europe/Amsterdam"
  },
  "sessionTarget": "isolated",
  "payload": {
    "kind": "agentTurn",
    "message": "Run Freep scraper: bash ~/Projects/personal/leroy-steding-portfolio/apps/admin/scripts/scrape-freep.sh",
    "timeoutSeconds": 300
  },
  "delivery": { "mode": "none" }
}
```

### Step 3: Verify in Dashboard (2 min)

Check `admin.leroysteding.nl/jobs/prolinker` to see new Freep jobs appearing.

---

## 📋 Scraping Best Practices

### Rate Limiting

```typescript
const SCRAPER_CONFIG = {
  requestDelay: 2000, // 2 seconds between requests
  maxConcurrent: 3, // Max 3 sources scraped in parallel
  userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
  timeout: 30000, // 30 second timeout per page
};
```

### Anti-Detection

```typescript
await page.setUserAgent(SCRAPER_CONFIG.userAgent);
await page.setViewport({ width: 1920, height: 1080 });

// Add random delays
await page.waitForTimeout(Math.random() * 2000 + 1000);

// Scroll like a human
await autoScroll(page);
```

### Error Handling

```typescript
try {
  const jobs = await scrapeSource(source);
  await saveToConvex(jobs);
} catch (error) {
  // Log error but don't crash entire workflow
  await logError({
    source: source.id,
    error: error.message,
    timestamp: Date.now(),
  });
  
  // Continue with other sources
  continue;
}
```

---

## 🎯 Success Metrics

Track in `convex/scraper_metrics`:

```typescript
interface ScraperMetrics {
  source: string;
  date: string;
  jobsScraped: number;
  jobsAdded: number; // After deduplication
  jobsDuplicate: number;
  errors: number;
  avgScrapeTime: number;
  successRate: number;
}
```

**Dashboard View:**
- Jobs per source (pie chart)
- Scraping success rate (line chart over time)
- Deduplication rate
- Top sources by quality matches

---

## ⚠️ Legal & Ethical Considerations

### Allowed
✅ Public job listings without login  
✅ Scraping for personal job search  
✅ Reasonable rate limits (< 1 req/sec)  
✅ Respecting robots.txt  

### Not Allowed
❌ Scraping content behind authentication  
❌ Reselling scraped data  
❌ Aggressive scraping (DDoS-like)  
❌ Ignoring cease-and-desist requests  

### robots.txt Check

```bash
curl https://www.freep.nl/robots.txt
curl https://remoteineurope.com/robots.txt
```

If `/opdrachten` or `/jobs` is disallowed, use API or RSS feed instead.

---

## 🔮 Future Enhancements

### Phase 5: API Integrations (Month 2)

Many platforms offer APIs:
- **Remotive** - https://remotive.com/api
- **We Work Remotely** - RSS feed available
- **Jooble** - https://jooble.org/api/about

API benefits:
- No scraping needed
- Faster + more reliable
- Lower ban risk
- Structured data

### Phase 6: ML-Powered Matching (Month 3)

Train a model on historical applications:
```typescript
interface JobMatchModel {
  input: JobFeatures;
  output: { applyProbability: number; successProbability: number };
}

// Features: title embeddings, company reputation, salary range, tech stack match
// Train on: past applications → interview → offer data
```

### Phase 7: Smart Application Timing (Month 4)

Analyze best times to apply:
- Early morning (first applicant advantage)
- Right after posting (within 24h)
- Avoid weekends

---

## 📁 File Structure

```
apps/admin/scripts/
├── multi-source-scraper.ts (main orchestrator)
├── scrapers/
│   ├── prolinker.ts
│   ├── freep.ts
│   ├── freelance-nl.ts
│   ├── hoofdkraan.ts
│   ├── remote-in-europe.ts
│   ├── eu-remote-jobs.ts
│   └── ... (15+ total)
├── deduplicate-jobs.ts
├── extract-technologies.ts
└── scraper-config.ts

convex/
├── scraped_jobs.ts (updated with multi-source support)
├── scraper_metrics.ts (new)
└── job_deduplication.ts (new)
```

---

## ✨ Summary

**What to Add:**
- 🇳🇱 **7 Dutch platforms** (Freep, Freelance.nl, Hoofdkraan, Jellow, etc.)
- 🌍 **6 EU remote platforms** (Remote in Europe, EU Remote Jobs, etc.)
- 🌐 **6 global platforms** (Arc, Upwork, Twine, etc.)

**Benefits:**
- **8x more jobs** (~120/day vs ~15/day)
- **6-8x more matches** (~50/week vs ~8/week)
- **Better coverage** (government, startup, enterprise)
- **Automated deduplication** (no duplicate applications)

**Time to Implement:**
- Quick start (Freep only): 1-2 hours
- Full Dutch platforms: 1 week
- Full EU + Global: 2-3 weeks
- ML matching: 1 month

**Next Steps:**
1. Start with Freep scraper (today, 1-2 hours)
2. Add 2-3 more Dutch platforms this week
3. Integrate with workflow engine next week
4. Monitor results, optimize scoring algorithm

---

🚀 **Ready to 8x your job opportunities!**

---
**Model**: Claude Sonnet 4.5 | **Tokens**: ~125k in / ~16k out
