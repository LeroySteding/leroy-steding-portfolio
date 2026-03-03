# Job Board Consolidation & Integration Plan

## Executive Summary

**Goal**: Create a unified job scraping platform that aggregates opportunities from multiple sources (job boards, social media, content platforms) with comprehensive testing, analytics, and detail pages.

**Current State**:
- ✅ ProLinker scraper (cron every 4 hours)
- ✅ Freep automation (cron every 6 hours)
- ✅ LinkedIn integration (existing)
- ✅ Basic Kanban board UI (`/jobs`)
- ✅ ProLinker-specific dashboard (`/jobs/prolinker`)

**Target State**:
- Unified job board aggregator page (`/jobs/sources`)
- Individual scraper status pages (ProLinker, Freep, LinkedIn, Medium, Reddit, etc.)
- Comprehensive testing suite (E2E, integration, unit tests)
- Content platform integrations (Medium, Reddit, HackerNews, etc.)
- Advanced analytics and insights dashboard

---

## Phase 1: Merge & Consolidate (Week 1)

### 1.1 Unified Job Sources Dashboard

**Location**: `/apps/admin/src/app/(admin)/jobs/sources/page.tsx`

**Features**:
- Grid/list view of all active scrapers
- Health status indicators (✅ healthy, ⚠️ warning, ❌ down)
- Last scrape timestamp
- Jobs scraped (24h / 7d / 30d)
- Match rate percentage
- Quick actions (manual trigger, view logs, settings)

**Components**:
```typescript
// ScraperCard.tsx - Reusable card for each scraper
interface ScraperCardProps {
  name: string;
  icon: ReactNode;
  status: "healthy" | "warning" | "error" | "paused";
  lastScrape: number;
  jobsScraped24h: number;
  jobsScraped7d: number;
  matchRate: number;
  nextScrapeIn: number; // minutes
  onTrigger: () => void;
  onViewLogs: () => void;
  detailUrl: string;
}
```

**Data Source**:
```typescript
// convex/scraper_health.ts
export const getScraperHealth = query({
  handler: async (ctx) => {
    const scrapers = [
      {
        id: "prolinker",
        name: "ProLinker",
        schedule: "Every 4 hours",
        // ... health data
      },
      {
        id: "freep",
        name: "Freep.nl",
        schedule: "Every 6 hours",
        // ... health data
      },
      // ... more scrapers
    ];
    return scrapers;
  }
});
```

### 1.2 Individual Scraper Detail Pages

**Structure**:
```
/jobs/sources/prolinker
/jobs/sources/freep
/jobs/sources/linkedin
/jobs/sources/medium
/jobs/sources/reddit
```

**Shared Template** (`/jobs/sources/[scraper]/page.tsx`):
- **Overview Section**: Stats, health, schedule
- **Recent Jobs Table**: Last 100 scraped jobs with filters
- **Match Analysis**: Match score distribution chart
- **Error Log**: Recent failures/warnings
- **Configuration**: Scraper-specific settings (keywords, filters, rate limits)
- **Manual Actions**: Trigger scrape, reset stats, export data

### 1.3 Enhanced Job Detail Pages

**Current**: `/jobs/[id]/page.tsx` (basic details)

**Enhancements Needed**:
```typescript
interface EnhancedJobDetail {
  // Source tracking
  source: "prolinker" | "freep" | "linkedin" | "medium" | "reddit";
  sourceUrl: string;
  sourceMetadata: {
    scrapedAt: number;
    lastUpdated: number;
    originalId: string;
  };
  
  // Match scoring breakdown
  matchScore: number;
  matchBreakdown: {
    titleMatch: number;
    skillsMatch: number[];
    locationMatch: number;
    salaryMatch: number;
    companyMatch: number;
  };
  
  // Research data (from researcher agent)
  companyResearch?: {
    size: string;
    funding: string;
    culture: string;
    technologies: string[];
    reviews: { source: string; rating: number; }[];
  };
  
  // Application timeline
  timeline: {
    timestamp: number;
    event: string;
    agentId?: string;
    notes?: string;
  }[];
}
```

**UI Additions**:
- Source badge (ProLinker logo, Freep logo, etc.)
- Match score visualization (radar chart showing breakdown)
- Company research panel (collapsible)
- Application timeline (vertical stepper)
- Agent activity log (which agents worked on this)

---

## Phase 2: Testing Infrastructure (Week 1-2)

### 2.1 E2E Testing (Playwright)

**Test Suite**: `/apps/admin/e2e/jobs/`

**Coverage**:
```typescript
// jobs-board.spec.ts - Core job board functionality
test.describe("Jobs Board", () => {
  test("displays all job columns", async ({ page }) => {
    await page.goto("/jobs");
    await expect(page.locator('[data-testid="applied-column"]')).toBeVisible();
    await expect(page.locator('[data-testid="interviewing-column"]')).toBeVisible();
    await expect(page.locator('[data-testid="offer-column"]')).toBeVisible();
    await expect(page.locator('[data-testid="rejected-column"]')).toBeVisible();
  });

  test("drag-and-drop updates status", async ({ page }) => {
    // ... drag job card from Applied to Interviewing
    // ... verify status update mutation called
    // ... verify UI updates
  });

  test("filters by date range", async ({ page }) => {
    // ... test 7d, 30d, 90d, all filters
  });
});

// scraper-health.spec.ts - Scraper monitoring
test.describe("Scraper Health Dashboard", () => {
  test("shows all active scrapers", async ({ page }) => {
    await page.goto("/jobs/sources");
    await expect(page.locator('[data-scraper="prolinker"]')).toBeVisible();
    await expect(page.locator('[data-scraper="freep"]')).toBeVisible();
  });

  test("manual trigger works", async ({ page }) => {
    await page.goto("/jobs/sources");
    await page.click('[data-action="trigger-prolinker"]');
    await expect(page.locator('[data-status="running"]')).toBeVisible();
  });
});

// job-detail.spec.ts - Job detail page
test.describe("Job Detail Page", () => {
  test("displays full job information", async ({ page }) => {
    await page.goto("/jobs/[test-job-id]");
    await expect(page.locator('[data-testid="job-title"]')).toBeVisible();
    await expect(page.locator('[data-testid="company-research"]')).toBeVisible();
    await expect(page.locator('[data-testid="match-score"]')).toBeVisible();
  });

  test("timeline shows agent activity", async ({ page }) => {
    // ... verify researcher agent entry
    // ... verify business agent entry
  });
});
```

### 2.2 Integration Testing (Vitest)

**Test Suite**: `/apps/admin/tests/integration/`

**Coverage**:
```typescript
// scraper-workflow.test.ts
describe("Scraper Workflow Integration", () => {
  it("ProLinker scrape → store → match → trigger agent", async () => {
    const convex = setupTestConvex();
    
    // 1. Trigger scrape
    await convex.mutation(api.prolinker_scraper.scrapeJobs);
    
    // 2. Verify jobs stored
    const jobs = await convex.query(api.scraped_jobs.list, { 
      source: "prolinker" 
    });
    expect(jobs.length).toBeGreaterThan(0);
    
    // 3. Verify matching ran
    const preferences = await convex.query(api.job_matching.getUserPreferences, {
      userId: "test-user"
    });
    const matches = jobs.filter(job => 
      calculateMatchScore(job, preferences) >= 70
    );
    expect(matches.length).toBeGreaterThan(0);
    
    // 4. Verify job application created
    const applications = await convex.query(api.job_applications.list);
    expect(applications).toContainEqual(
      expect.objectContaining({
        source: "prolinker",
        status: "discovered"
      })
    );
    
    // 5. Verify workflow triggered (check agent_feed)
    const feed = await convex.query(api.agent_feed.list, { limit: 10 });
    expect(feed).toContainEqual(
      expect.objectContaining({
        agentId: "researcher",
        category: "job_workflow"
      })
    );
  });
});

// freep-automation.test.ts
describe("Freep Automation Integration", () => {
  it("Freep scrape → match → create application → trigger researcher", async () => {
    // ... similar to ProLinker test
  });
  
  it("detects government contracts correctly", async () => {
    const testJob = {
      company: "Rijksoverheid",
      description: "Opdracht voor ministerie..."
    };
    
    const result = await detectGovernmentContract(testJob);
    expect(result.isGovernment).toBe(true);
    expect(result.sector).toBe("government");
  });
});
```

### 2.3 Unit Testing (Vitest)

**Test Suite**: `/apps/admin/tests/unit/`

**Coverage**:
```typescript
// match-scoring.test.ts
describe("Job Match Scoring", () => {
  it("calculates title match correctly", () => {
    const job = { position: "Senior React Developer" };
    const prefs = { desiredTitles: ["React Developer", "Frontend"] };
    
    const score = calculateTitleMatch(job, prefs);
    expect(score).toBeGreaterThan(0.8);
  });
  
  it("handles Dutch dates correctly", () => {
    expect(parseDutchDate("3 dagen geleden")).toBeLessThan(Date.now());
    expect(parseDutchDate("2 weken geleden")).toBeLessThan(Date.now());
    expect(parseDutchDate("1 maand geleden")).toBeLessThan(Date.now());
  });
});

// scraper-validation.test.ts
describe("Scraper Data Validation", () => {
  it("validates required fields", () => {
    const validJob = {
      company: "Acme Corp",
      position: "Developer",
      source: "prolinker",
      url: "https://...",
      scrapedAt: Date.now()
    };
    
    expect(validateScrapedJob(validJob)).toBe(true);
  });
  
  it("rejects invalid jobs", () => {
    const invalidJob = { company: "" }; // missing required fields
    expect(validateScrapedJob(invalidJob)).toBe(false);
  });
});
```

### 2.4 Test Infrastructure Setup

**Files to Create**:
```bash
# E2E setup
apps/admin/playwright.config.ts
apps/admin/e2e/setup/auth.setup.ts
apps/admin/e2e/setup/db.setup.ts

# Integration setup  
apps/admin/tests/integration/setup.ts
apps/admin/tests/integration/convex-mock.ts

# Unit setup
apps/admin/vitest.config.ts
apps/admin/tests/unit/setup.ts

# CI/CD
.github/workflows/test-admin.yml
```

**CI/CD Pipeline** (`.github/workflows/test-admin.yml`):
```yaml
name: Admin Dashboard Tests

on: [push, pull_request]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: pnpm install
      - run: pnpm test:unit
      
  integration-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: pnpm install
      - run: pnpm test:integration
      
  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: pnpm install
      - run: npx playwright install --with-deps
      - run: pnpm test:e2e
```

---

## Phase 3: Content Platform Integrations (Week 2-3)

### 3.1 Medium Integration

**Use Cases**:
1. **Content Scraping**: Find companies/authors hiring developers
2. **Job Posting Detection**: Publications with "We're Hiring" sections
3. **Company Research**: Read engineering blogs for culture insights

**Implementation**:

**Convex Actions** (`convex/medium_scraper.ts`):
```typescript
import { v } from "convex/values";
import { action } from "./_generated/server";

export const scrapePublications = action({
  args: {
    keywords: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    // Search Medium for publications mentioning hiring
    const publications = await searchMediumPublications(args.keywords);
    
    for (const pub of publications) {
      // Check for "Careers" or "We're Hiring" sections
      const jobPostings = await extractJobPostings(pub.url);
      
      if (jobPostings.length > 0) {
        // Store as scraped jobs
        await ctx.runMutation(api.scraped_jobs.create, {
          source: "medium",
          company: pub.name,
          positions: jobPostings,
          url: pub.url,
          metadata: {
            publicationSize: pub.followers,
            lastPost: pub.lastPublished,
            topics: pub.topics
          }
        });
      }
    }
  }
});

export const analyzeEngineeringBlogs = action({
  args: {
    companyName: v.string(),
  },
  handler: async (ctx, args) => {
    // Find engineering blog posts by company
    const posts = await searchMediumByAuthor(`@${args.companyName}`);
    
    // Extract culture/tech stack insights
    const insights = {
      technologies: extractTechnologies(posts),
      culture: analyzeCulture(posts),
      teamSize: estimateTeamSize(posts),
      postFrequency: calculatePostFrequency(posts)
    };
    
    return insights;
  }
});
```

**Scraper Script** (`apps/admin/scripts/scrape-medium.ts`):
```typescript
import { api } from "../../../convex/_generated/api";
import Anthropic from "@anthropic-ai/sdk";

async function scrapeMedium() {
  console.log("🔍 Scraping Medium for job opportunities...");
  
  const keywords = [
    "we're hiring",
    "join our team",
    "software engineer position",
    "remote developer",
    "tech careers"
  ];
  
  // Search Medium API or web scraping
  const searchResults = await searchMediumAPI(keywords);
  
  // Use Claude to analyze posts and extract job opportunities
  const anthropic = new Anthropic();
  
  for (const post of searchResults) {
    const analysis = await anthropic.messages.create({
      model: "claude-3-5-haiku-20241022",
      max_tokens: 1024,
      messages: [{
        role: "user",
        content: `Analyze this Medium post and extract job opportunity details:\n\nTitle: ${post.title}\n\nContent: ${post.content}\n\nExtract: company name, position, location, salary, requirements`
      }]
    });
    
    // Parse Claude's response and store job
    const jobData = parseJobExtraction(analysis.content);
    
    if (jobData) {
      await convex.mutation(api.scraped_jobs.create, {
        source: "medium",
        ...jobData,
        metadata: {
          mediumPostUrl: post.url,
          author: post.author,
          publishedAt: post.publishedAt,
          claps: post.claps
        }
      });
    }
  }
  
  console.log("✅ Medium scraping complete");
}
```

**Cron Schedule** (add to `convex/crons.ts`):
```typescript
// Medium scraper - runs daily at 10 AM
crons.daily(
  "scrape-medium-jobs",
  { hourUTC: 10, minuteUTC: 0 },
  internal.medium_scraper.scrapePublications,
  { keywords: ["hiring", "careers", "join us"] }
);
```

### 3.2 Reddit Integration

**Use Cases**:
1. **Subreddit Monitoring**: r/forhire, r/remotejs, r/hiring, r/dutch
2. **Company Research**: r/cscareerquestions, r/experienceddevs
3. **Salary Insights**: r/cscareerquestions salary threads
4. **Culture Research**: Company-specific subreddits

**Implementation**:

**Convex Actions** (`convex/reddit_scraper.ts`):
```typescript
import { v } from "convex/values";
import { action } from "./_generated/server";
import snoowrap from "snoowrap";

const SUBREDDITS = [
  "forhire",
  "remotejs", 
  "RemoteJobs",
  "jobbit",
  "hiring",
  "digitalnomad",
  "thenetherlands", // Dutch jobs
  "Amsterdam", // Amsterdam jobs
];

export const scrapeSubreddits = action({
  args: {},
  handler: async (ctx) => {
    const reddit = new snoowrap({
      userAgent: process.env.REDDIT_USER_AGENT!,
      clientId: process.env.REDDIT_CLIENT_ID!,
      clientSecret: process.env.REDDIT_CLIENT_SECRET!,
      username: process.env.REDDIT_USERNAME!,
      password: process.env.REDDIT_PASSWORD!,
    });
    
    for (const subreddit of SUBREDDITS) {
      // Get hot posts from last 24h
      const posts = await reddit
        .getSubreddit(subreddit)
        .getNew({ limit: 100 });
      
      const jobPosts = posts.filter(post => 
        isJobPosting(post.title, post.selftext)
      );
      
      for (const post of jobPosts) {
        // Parse job details from post
        const jobData = await parseRedditJobPost(post);
        
        if (jobData) {
          await ctx.runMutation(api.scraped_jobs.create, {
            source: "reddit",
            ...jobData,
            metadata: {
              subreddit: subreddit,
              author: post.author.name,
              score: post.score,
              comments: post.num_comments,
              url: `https://reddit.com${post.permalink}`
            }
          });
        }
      }
    }
  }
});

export const researchCompany = action({
  args: {
    companyName: v.string(),
  },
  handler: async (ctx, args) => {
    const reddit = initReddit();
    
    // Search across relevant subreddits
    const results = await reddit.search({
      query: args.companyName,
      subreddit: "cscareerquestions,experienceddevs",
      time: "year",
      sort: "relevance"
    });
    
    // Analyze sentiment and extract insights
    const insights = {
      mentions: results.length,
      sentiment: calculateSentiment(results),
      commonTopics: extractTopics(results),
      interviewExperiences: results.filter(r => 
        r.title.includes("interview") || r.selftext.includes("interview")
      ),
      salaryData: extractSalaryInfo(results)
    };
    
    return insights;
  }
});
```

**Helper Functions** (`apps/admin/scripts/scrape-reddit.ts`):
```typescript
function isJobPosting(title: string, body: string): boolean {
  const keywords = [
    "[hiring]",
    "[for hire]", 
    "looking for",
    "we're hiring",
    "position available",
    "freelance",
    "contract",
    "remote"
  ];
  
  const text = `${title} ${body}`.toLowerCase();
  return keywords.some(keyword => text.includes(keyword));
}

async function parseRedditJobPost(post: any) {
  // Use Claude to extract structured data
  const anthropic = new Anthropic();
  
  const response = await anthropic.messages.create({
    model: "claude-3-5-haiku-20241022",
    max_tokens: 1024,
    messages: [{
      role: "user",
      content: `Parse this Reddit job post and extract:\n\nTitle: ${post.title}\n\nBody: ${post.selftext}\n\nExtract JSON: { company, position, location, salary, remote, requirements, contactEmail }`
    }]
  });
  
  return JSON.parse(response.content[0].text);
}
```

**Cron Schedule**:
```typescript
// Reddit scraper - runs every 3 hours
crons.interval(
  "scrape-reddit-jobs",
  { hours: 3 },
  internal.reddit_scraper.scrapeSubreddits
);
```

### 3.3 HackerNews Integration

**Use Cases**:
1. **"Who's Hiring" Threads**: Monthly threads with hundreds of jobs
2. **Show HN**: Companies launching (potential early-stage opportunities)
3. **Ask HN**: "Who's Hiring Remote" threads

**Implementation**:

**Convex Actions** (`convex/hackernews_scraper.ts`):
```typescript
import { v } from "convex/values";
import { action } from "./_generated/server";

export const scrapeWhosHiring = action({
  args: {},
  handler: async (ctx) => {
    // Find latest "Ask HN: Who is hiring?" thread
    const hnApi = "https://hacker-news.firebaseio.com/v0";
    
    // Search for latest hiring thread (posted monthly)
    const askHNStories = await fetch(
      `${hnApi}/askstories.json`
    ).then(r => r.json());
    
    for (const storyId of askHNStories.slice(0, 100)) {
      const story = await fetch(
        `${hnApi}/item/${storyId}.json`
      ).then(r => r.json());
      
      if (story.title?.includes("Who is hiring")) {
        // Get all comments (job postings)
        const jobs = await parseHNJobThread(story);
        
        for (const job of jobs) {
          await ctx.runMutation(api.scraped_jobs.create, {
            source: "hackernews",
            ...job,
            metadata: {
              threadId: storyId,
              commentId: job.commentId,
              score: job.score,
              url: `https://news.ycombinator.com/item?id=${job.commentId}`
            }
          });
        }
      }
    }
  }
});

async function parseHNJobThread(story: any) {
  const jobs = [];
  
  // Each top-level comment is a job posting
  for (const commentId of story.kids || []) {
    const comment = await fetch(
      `https://hacker-news.firebaseio.com/v0/item/${commentId}.json`
    ).then(r => r.json());
    
    // Parse comment text (usually follows format: Company | Position | Location | Details)
    const parsed = parseHNComment(comment.text);
    
    if (parsed) {
      jobs.push({
        ...parsed,
        commentId,
        score: comment.score || 0
      });
    }
  }
  
  return jobs;
}
```

**Cron Schedule**:
```typescript
// HackerNews scraper - runs daily (hiring threads are monthly but comments added throughout)
crons.daily(
  "scrape-hackernews-jobs",
  { hourUTC: 12, minuteUTC: 0 },
  internal.hackernews_scraper.scrapeWhosHiring
);
```

### 3.4 Additional Platform Ideas

**More Integrations to Consider**:

1. **Twitter/X**:
   - Monitor #hiring, #remotejobs hashtags
   - Company accounts posting openings
   - Developer influencers sharing opportunities

2. **Discord**:
   - Job boards in developer communities
   - Company-specific Discord servers
   - Freelance communities

3. **Slack Communities**:
   - Developer communities (TechNL, Remote Workers)
   - #jobs channels

4. **Dev.to**:
   - "#hiring" tag posts
   - Company profiles

5. **IndieHackers**:
   - Jobs board
   - "Looking for cofounder" posts

6. **AngelList/Wellfound**:
   - Startup jobs
   - Equity-heavy positions

7. **RemoteOK**:
   - Remote-first jobs
   - Salary transparency

8. **Otta**:
   - Curated startup jobs
   - Culture fit matching

9. **Cord.co** (formerly Gun.io):
   - Freelance developer contracts

10. **Toptal**:
    - High-end freelance

11. **Glassdoor**:
    - Company research (reviews, salaries)
    - Job listings

12. **Blind**:
    - Company culture insights
    - Salary data

---

## Phase 4: Advanced Features (Week 3-4)

### 4.1 Unified Job Deduplication

**Problem**: Same job appears on multiple platforms

**Solution**: Fuzzy matching algorithm

**Implementation** (`convex/job_deduplication.ts`):
```typescript
import { v } from "convex/values";
import { internalMutation } from "./_generated/server";
import Fuse from "fuse.js";

export const deduplicateJobs = internalMutation({
  args: {},
  handler: async (ctx) => {
    const allJobs = await ctx.db.query("scraped_jobs").collect();
    
    // Group by company + position similarity
    const fuse = new Fuse(allJobs, {
      keys: ["company", "position"],
      threshold: 0.3, // 70% similarity
      includeScore: true
    });
    
    const duplicateGroups: Map<string, any[]> = new Map();
    
    for (const job of allJobs) {
      const matches = fuse.search(`${job.company} ${job.position}`);
      
      // Find if job belongs to existing group
      let foundGroup = false;
      
      for (const [groupKey, group] of duplicateGroups) {
        if (matches.some(m => group.includes(m.item))) {
          group.push(job);
          foundGroup = true;
          break;
        }
      }
      
      // Create new group
      if (!foundGroup) {
        const groupKey = `${job.company}-${job.position}`.toLowerCase();
        duplicateGroups.set(groupKey, [job]);
      }
    }
    
    // Mark duplicates
    for (const [groupKey, jobs] of duplicateGroups) {
      if (jobs.length > 1) {
        // Keep newest, mark others as duplicates
        const newest = jobs.sort((a, b) => 
          b.scrapedAt - a.scrapedAt
        )[0];
        
        for (const job of jobs) {
          if (job._id !== newest._id) {
            await ctx.db.patch(job._id, {
              isDuplicate: true,
              canonicalJobId: newest._id,
              duplicateSources: jobs.map(j => j.source)
            });
          } else {
            // Update canonical job with all sources
            await ctx.db.patch(newest._id, {
              sources: jobs.map(j => j.source),
              allUrls: jobs.map(j => j.url)
            });
          }
        }
      }
    }
  }
});
```

**Run After Every Scrape**:
```typescript
// Add to all scrapers
await ctx.runMutation(internal.job_deduplication.deduplicateJobs);
```

### 4.2 Smart Job Aggregation

**Goal**: Combine data from multiple sources for single job

**Example**:
- ProLinker: Basic job details
- LinkedIn: Company insights, mutual connections
- Medium: Engineering blog culture insights
- Reddit: Salary discussions, interview experiences
- Glassdoor: Reviews, ratings

**Implementation** (`convex/job_aggregation.ts`):
```typescript
export const aggregateJobData = internalAction({
  args: {
    jobId: v.id("job_applications"),
  },
  handler: async (ctx, args) => {
    const job = await ctx.runQuery(api.job_applications.get, { 
      id: args.jobId 
    });
    
    // Gather data from all sources
    const [
      linkedinData,
      redditData,
      glassdoorData,
      mediumData
    ] = await Promise.all([
      ctx.runAction(api.linkedin_scraper.getCompanyProfile, { 
        company: job.company 
      }),
      ctx.runAction(api.reddit_scraper.researchCompany, { 
        companyName: job.company 
      }),
      ctx.runAction(api.glassdoor_scraper.getCompanyReviews, { 
        company: job.company 
      }),
      ctx.runAction(api.medium_scraper.analyzeEngineeringBlogs, { 
        companyName: job.company 
      })
    ]);
    
    // Merge all insights
    const aggregatedData = {
      company: {
        size: linkedinData.size || glassdoorData.size,
        rating: glassdoorData.rating,
        culture: mediumData.culture,
        salaryInsights: redditData.salaryData,
        technologies: [
          ...mediumData.technologies,
          ...job.requiredSkills
        ]
      },
      interviewProcess: redditData.interviewExperiences,
      employeeReviews: glassdoorData.reviews,
      engineeringBlog: mediumData.posts
    };
    
    // Update job with aggregated research
    await ctx.runMutation(api.job_applications.update, {
      id: args.jobId,
      companyResearch: aggregatedData
    });
  }
});
```

### 4.3 Analytics Dashboard

**Location**: `/jobs/analytics`

**Visualizations**:
1. **Jobs Over Time**: Line chart showing daily scrapes per source
2. **Source Distribution**: Pie chart of jobs by platform
3. **Match Rate by Source**: Bar chart comparing quality
4. **Geographic Heatmap**: Where jobs are located
5. **Salary Trends**: Box plot of salary ranges over time
6. **Technology Demand**: Bar chart of most requested skills
7. **Response Rate by Source**: Which platforms respond fastest
8. **Success Funnel**: Sankey diagram from discovered → offer

**Data Queries** (`convex/job_analytics.ts`):
```typescript
export const getAnalyticsSummary = query({
  args: {
    startDate: v.number(),
    endDate: v.number(),
  },
  handler: async (ctx, args) => {
    const jobs = await ctx.db
      .query("scraped_jobs")
      .filter(q => 
        q.and(
          q.gte(q.field("scrapedAt"), args.startDate),
          q.lte(q.field("scrapedAt"), args.endDate)
        )
      )
      .collect();
    
    return {
      totalJobs: jobs.length,
      bySource: groupBy(jobs, "source"),
      byLocation: groupBy(jobs, "location"),
      byRemote: groupBy(jobs, "remote"),
      avgMatchScore: average(jobs.map(j => j.matchScore || 0)),
      technologyDemand: extractTopTechnologies(jobs),
      salaryRanges: calculateSalaryRanges(jobs),
      trends: calculateTrends(jobs)
    };
  }
});
```

### 4.4 Smart Notifications

**Triggers**:
1. **High-Quality Match** (score > 85): Instant push notification
2. **Dream Company Posting**: Email + Telegram + push
3. **Salary Above Threshold**: Priority alert
4. **Remote + High Match**: Telegram message
5. **Urgent Posting** ("apply by EOD"): Immediate notification

**Implementation** (`convex/job_notifications.ts`):
```typescript
export const checkNotificationTriggers = internalMutation({
  args: {
    jobId: v.id("scraped_jobs"),
  },
  handler: async (ctx, args) => {
    const job = await ctx.db.get(args.jobId);
    const prefs = await ctx.db
      .query("user_preferences")
      .first();
    
    // High-quality match
    if (job.matchScore >= 85) {
      await ctx.scheduler.runAfter(0, internal.notifications.sendPush, {
        title: `🎯 Exceptional Match: ${job.position}`,
        body: `${job.company} - ${job.matchScore}% match`,
        data: { jobId: args.jobId }
      });
    }
    
    // Dream company
    if (prefs.dreamCompanies.includes(job.company)) {
      await ctx.scheduler.runAfter(0, internal.notifications.sendMultiChannel, {
        channels: ["email", "telegram", "push"],
        message: `🌟 ${job.company} is hiring: ${job.position}`
      });
    }
    
    // Salary threshold
    if (job.salaryMax && job.salaryMax >= prefs.salaryThreshold) {
      await ctx.scheduler.runAfter(0, internal.notifications.sendTelegram, {
        message: `💰 High-paying role: ${job.position} at ${job.company} (€${job.salaryMax}k)`
      });
    }
  }
});
```

---

## Implementation Timeline

### Week 1: Foundation
- [x] Freep scraper merged (already in crons)
- [ ] Create `/jobs/sources` dashboard
- [ ] Individual scraper pages (`/jobs/sources/[scraper]`)
- [ ] Enhanced job detail pages
- [ ] E2E test setup (Playwright)

### Week 2: Testing & Content Platforms
- [ ] Complete E2E test suite
- [ ] Integration tests
- [ ] Unit tests
- [ ] CI/CD pipeline
- [ ] Medium integration
- [ ] Reddit integration

### Week 3: Expansion
- [ ] HackerNews integration
- [ ] Job deduplication system
- [ ] Job data aggregation
- [ ] Analytics dashboard (basic)

### Week 4: Polish & Scale
- [ ] Smart notifications
- [ ] Advanced analytics
- [ ] Twitter/Discord/Slack (optional)
- [ ] Performance optimization
- [ ] Documentation

---

## Success Metrics

### Quantitative
- **Job Volume**: 10x increase (from ~15/day to ~150/day)
- **Match Quality**: Maintain >70% match rate
- **Source Diversity**: At least 7 active sources
- **Uptime**: >99% scraper health
- **Response Time**: <2s page loads
- **Test Coverage**: >80% code coverage

### Qualitative
- **User Experience**: Unified interface, less context switching
- **Confidence**: Rich company research reduces uncertainty
- **Efficiency**: Automated matching saves time
- **Insights**: Analytics reveal patterns

---

## Tech Stack Summary

### Scraping
- **Puppeteer**: Dynamic sites (Freep, LinkedIn)
- **Cheerio**: Static sites (HackerNews, basic scraping)
- **Reddit API (snoowrap)**: Reddit integration
- **Medium API**: Medium integration
- **Anthropic Claude**: Content analysis, job extraction

### Storage
- **Convex**: Primary database
- **Redis**: Caching, rate limiting (optional)

### Testing
- **Playwright**: E2E tests
- **Vitest**: Unit + integration tests
- **MSW**: API mocking

### Analytics
- **Recharts**: Data visualization
- **date-fns**: Date utilities
- **Fuse.js**: Fuzzy matching/deduplication

### Monitoring
- **Sentry**: Error tracking
- **Convex Logs**: Scraper health
- **Custom Dashboard**: Real-time monitoring

---

## Next Steps

1. **Review this plan** - Are priorities correct?
2. **Choose starting point** - Which phase first?
3. **Set up testing** - Foundation for quality
4. **Pick 2-3 platforms** - Don't overcommit initially

**Recommended Start**: Phase 1.1 (Unified dashboard) + Phase 2.1 (E2E tests) in parallel.

Let me know what you'd like to tackle first! 🚀
