# TODO Comments → Linear Tickets Conversion

**Date**: 2026-03-04  
**Total TODOs**: 13  
**Categorized by**: Project, Priority, Component

---

## 📋 Summary by Category

| Category | Count | Priority |
|----------|-------|----------|
| Auto-Apply Engine | 3 | HIGH |
| Job Scrapers | 3 | MEDIUM |
| Intelligence/Content | 2 | MEDIUM |
| Error Tracking | 2 | MEDIUM |
| Dashboard UI | 3 | LOW |

---

## 🔴 HIGH PRIORITY (3 tickets)

### ADMIN-03: Implement Auto-Apply Form Submission
**Project**: Admin Dashboard  
**Component**: `apps/admin/scripts/auto-apply.ts`  
**Priority**: HIGH  
**Effort**: 8 hours  
**Blockers**: None

**Context**:
The auto-apply engine successfully navigates to job pages and clicks apply buttons, but stops before actually submitting forms. This is the final critical piece needed for full automation.

**Current State**:
```typescript
// Line 488: TODO: Implement actual form submission
// For now, just capture confirmation
const confirmationUrl = page.url();
```

**Requirements**:
1. Detect form submit buttons (various patterns: "Submit", "Send", "Apply", etc.)
2. Add safety confirmation before submission (dry-run check)
3. Wait for confirmation page/message after submission
4. Capture confirmation screenshot or URL as proof
5. Handle submission errors gracefully (rate limits, validation errors)
6. Update application record with submission status

**Technical Considerations**:
- Use Puppeteer's `page.waitForNavigation()` after click
- Look for confirmation indicators: URL change, success message, thank-you page
- Add 3-5 second delay before submission to allow form validation
- Store submission screenshots in `screenshots/submissions/`
- Handle multi-step submission flows (some forms have review pages)

**Acceptance Criteria**:
- [ ] Forms are successfully submitted in live mode (not dry-run)
- [ ] Confirmation is captured (URL or screenshot)
- [ ] Application record shows `submitted: true` and `submittedAt` timestamp
- [ ] Submission errors are logged and don't crash the engine
- [ ] Dry-run mode still skips actual submission

**Related**:
- Links to ADMIN-04 (generic form filling)
- Links to ADMIN-05 (CV upload)

---

### ADMIN-04: Implement Generic Form Detection and Filling
**Project**: Admin Dashboard  
**Component**: `apps/admin/scripts/auto-apply.ts`  
**Priority**: HIGH  
**Effort**: 12 hours  
**Blockers**: None

**Context**:
Currently, the auto-apply engine has basic form filling for ProLinker, but no generic fallback for other job platforms. Need intelligent form detection that works across different sites.

**Current State**:
```typescript
// Line 512: TODO: Implement generic form detection and filling
private async applyGeneric(job, isDryRun, log) {
  return { success: false, error: "Generic application not yet implemented" };
}
```

**Requirements**:
1. **Form Detection**:
   - Detect form elements automatically (name, email, phone, linkedin, etc.)
   - Support multiple input types: text, textarea, select, radio, checkbox
   - Handle dynamic forms (React, Vue, Angular)
   - Detect required vs optional fields

2. **Field Mapping**:
   - Map template fields to form inputs using:
     - Field `name` attribute
     - Field `id` attribute
     - Field `placeholder` text
     - Label text association
     - ARIA labels
   - Support fuzzy matching ("full-name" matches "fullName", "name")

3. **Smart Filling**:
   - Fill fields in correct order (some forms have dependencies)
   - Trigger validation events (onChange, onBlur)
   - Wait for AJAX validation before proceeding
   - Handle autofill/autocomplete conflicts

4. **Special Cases**:
   - Cover letter: Generate from template + job description
   - Salary expectation: Use template value or leave blank if required
   - Start date: Calculate from template availability
   - Work authorization: Map from template rights-to-work

**Technical Approach**:
```typescript
// Pseudo-code structure
async detectFormFields(page: Page): Promise<FormField[]> {
  const formFields = await page.evaluate(() => {
    // Get all input/select/textarea elements
    // Analyze labels, placeholders, names, ids
    // Return structured field data
  });
  return formFields;
}

async mapTemplateToForm(
  template: ApplicationTemplate, 
  formFields: FormField[]
): Promise<FieldMapping[]> {
  // Use fuzzy matching to map template to detected fields
  // Return mapping with confidence scores
}

async fillForm(page: Page, mappings: FieldMapping[]): Promise<void> {
  // Fill fields in order
  // Trigger validation
  // Wait for dynamic updates
  // Handle errors
}
```

**Acceptance Criteria**:
- [ ] Works on at least 3 different job platforms (Indeed, RemoteOK, LinkedIn)
- [ ] Detects 90%+ of common form fields
- [ ] Successfully maps template data to form fields
- [ ] Fills forms without triggering validation errors
- [ ] Handles dynamic forms (React Select, custom inputs)
- [ ] Logs field detection and mapping results for debugging

**Related**:
- Blocks ADMIN-03 (form submission)
- Links to ADMIN-05 (CV upload)

---

### ADMIN-05: Implement CV Upload from URL
**Project**: Admin Dashboard  
**Component**: `apps/admin/scripts/auto-apply.ts`  
**Priority**: HIGH  
**Effort**: 4 hours  
**Blockers**: None

**Context**:
The auto-apply engine detects file upload inputs but doesn't actually upload CVs. Most job applications require CV upload, so this is critical for success rate.

**Current State**:
```typescript
// Line 560: TODO: Download CV from URL and upload
if (template.cvUrl) {
  const fileInput = await page.$('input[type="file"]');
  if (fileInput) {
    log("upload_cv", "info", "CV upload found but not implemented yet");
  }
}
```

**Requirements**:
1. Download CV from template URL (could be Cloudinary, S3, etc.)
2. Store in temp directory with proper filename
3. Upload to file input using Puppeteer
4. Verify upload succeeded (check for file name in UI)
5. Clean up temp file after upload
6. Handle different CV formats (PDF, DOCX)
7. Support multi-file upload (CV + cover letter)

**Technical Approach**:
```typescript
async downloadFile(url: string, destPath: string): Promise<void> {
  const response = await fetch(url);
  const buffer = await response.arrayBuffer();
  await fs.writeFile(destPath, Buffer.from(buffer));
}

async uploadCV(page: Page, cvUrl: string): Promise<boolean> {
  // Download CV to temp file
  const tempPath = path.join(os.tmpdir(), `cv-${Date.now()}.pdf`);
  await downloadFile(cvUrl, tempPath);
  
  // Upload to file input
  const fileInput = await page.$('input[type="file"]');
  await fileInput.uploadFile(tempPath);
  
  // Wait for upload confirmation in UI
  await page.waitForSelector('.file-uploaded', { timeout: 5000 });
  
  // Clean up
  await fs.unlink(tempPath);
  
  return true;
}
```

**Edge Cases**:
- CV URL requires authentication (signed URLs)
- Multiple file inputs (CV, cover letter, portfolio)
- File size limits (compress if needed)
- Accepted file types (convert DOCX to PDF if only PDF accepted)
- Drag-and-drop upload instead of file input

**Acceptance Criteria**:
- [ ] CVs are successfully downloaded from URL
- [ ] Files are uploaded to form file inputs
- [ ] Upload is verified (check for confirmation in UI)
- [ ] Temp files are cleaned up
- [ ] Works with different CV formats (PDF, DOCX)
- [ ] Handles upload errors gracefully

**Related**:
- Links to ADMIN-03 (form submission)
- Links to ADMIN-04 (generic form filling)

---

## 🟡 MEDIUM PRIORITY (5 tickets)

### ADMIN-06: Send Job Digest via Telegram
**Project**: Admin Dashboard  
**Component**: `apps/admin/scripts/send-job-digest.ts`  
**Priority**: MEDIUM  
**Effort**: 2 hours  
**Blockers**: None

**Context**:
The daily job digest script generates a formatted message but doesn't actually send it. Need to integrate with OpenClaw's `message` tool or Telegram API.

**Current State**:
```typescript
// Line 58: TODO: Actually send via Telegram
console.log("\n📱 Ready to send to Telegram (implement message tool call)");
```

**Requirements**:
1. Use OpenClaw `message` tool to send digest
2. Format message with Telegram markdown (bold, links, emojis)
3. Split message if it exceeds Telegram's character limit (4096)
4. Handle Telegram API errors gracefully
5. Log successful sends to Convex for tracking
6. Support multiple recipients (user + admin channel)

**Technical Approach**:
```typescript
// Option 1: Use OpenClaw message tool (preferred)
import { message } from "@/lib/openclaw";
await message({
  action: "send",
  channel: "telegram",
  target: process.env.TELEGRAM_CHAT_ID,
  message: digest,
});

// Option 2: Direct Telegram API
import TelegramBot from "node-telegram-bot-api";
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN);
await bot.sendMessage(chatId, message, { parse_mode: "Markdown" });
```

**Message Format**:
- Use Telegram markdown formatting
- Include clickable links for job URLs
- Add inline buttons for actions (View, Apply, Archive)
- Use emojis for visual hierarchy
- Split long digests across multiple messages

**Acceptance Criteria**:
- [ ] Digest is successfully sent to Telegram
- [ ] Message formatting is preserved (bold, links, emojis)
- [ ] Long messages are split correctly
- [ ] Errors are logged to Convex
- [ ] Users receive digest daily at configured time

**Related**:
- Uses Convex `job_matching.getDailyDigest` query
- Could link to ADMIN-07 (job scraper fixes) for better matches

---

### ADMIN-07: Fix Indeed Job Scraper
**Project**: Admin Dashboard  
**Component**: `apps/admin/scripts/scrape-jobs.ts`, `apps/admin/scripts/scrapers/IndeedScraper.ts`  
**Priority**: MEDIUM  
**Effort**: 6 hours  
**Blockers**: None

**Context**:
The Indeed scraper is currently broken because their HTML structure changed. It's excluded from `--source=all` runs. Need to reverse-engineer their current page structure.

**Current State**:
```typescript
// Line 38: TODO: Fix Indeed scraper (HTML structure changed)
indeed: () => new IndeedScraper(),
```

**Requirements**:
1. **Reverse-engineer current Indeed structure**:
   - Inspect job listing pages
   - Identify new CSS selectors for job cards
   - Find pagination controls
   - Detect AJAX-loaded content

2. **Update selectors**:
   - Job title selector
   - Company name selector
   - Location selector
   - Salary selector
   - Description selector
   - Apply button/link selector

3. **Handle anti-scraping measures**:
   - User-agent rotation
   - Request rate limiting (2-3s between pages)
   - Cookie handling
   - CAPTCHA detection (stop if detected, don't retry)

4. **Test thoroughly**:
   - Multiple search queries
   - Different locations
   - Remote jobs vs on-site
   - Different job types (contract, full-time, etc.)

**Technical Approach**:
```typescript
// Update IndeedScraper.ts with new selectors
const SELECTORS = {
  jobCard: "div.job_seen_beacon", // Example - inspect live site
  title: "h2.jobTitle",
  company: "span.companyName",
  location: "div.companyLocation",
  salary: "div.salary-snippet",
  description: "div.jobCardShelfContainer",
  applyLink: "a[href*='apply']",
  pagination: "nav[role='navigation'] a[aria-label*='Next']",
};

// Add retry logic with exponential backoff
async scrape(): Promise<Job[]> {
  let retries = 0;
  while (retries < 3) {
    try {
      return await this._scrape();
    } catch (error) {
      if (error.message.includes("CAPTCHA")) {
        throw error; // Don't retry CAPTCHAs
      }
      retries++;
      await this.delay(Math.pow(2, retries) * 1000);
    }
  }
}
```

**Research Phase** (2 hours):
1. Open Indeed.com/nl
2. Search for "React developer Netherlands"
3. Inspect HTML structure with browser DevTools
4. Document all selectors in `docs/INDEED-SELECTORS.md`
5. Test selectors in browser console
6. Check if they use AJAX for pagination

**Implementation Phase** (3 hours):
1. Update `IndeedScraper.ts` with new selectors
2. Update pagination logic if needed
3. Add CAPTCHA detection
4. Test with multiple queries

**Testing Phase** (1 hour):
1. Run `tsx apps/admin/scripts/scrape-jobs.ts --source=indeed --dry-run`
2. Verify job data is extracted correctly
3. Test pagination (multiple pages)
4. Test different search queries
5. Save to Convex and verify data quality

**Acceptance Criteria**:
- [ ] Scraper successfully extracts jobs from Indeed
- [ ] All job fields are correctly mapped (title, company, location, salary, description)
- [ ] Pagination works for multiple pages
- [ ] No CAPTCHA triggers during normal operation
- [ ] Rate limiting prevents IP bans
- [ ] Scraper passes dry-run and live tests

**Related**:
- Could link to ADMIN-08 (LinkedIn scraper implementation)
- Could link to ADMIN-09 (Glassdoor scraper implementation)

---

### ADMIN-08: Implement LinkedIn Job Scraper
**Project**: Admin Dashboard  
**Component**: `apps/admin/scripts/scrape-jobs.ts`, `apps/admin/scripts/scrapers/LinkedInScraper.ts`  
**Priority**: MEDIUM  
**Effort**: 12 hours  
**Blockers**: None

**Context**:
LinkedIn scraper is not yet implemented. LinkedIn has good job data but aggressive anti-scraping measures. May require authentication or API access.

**Current State**:
```typescript
// Line 42: TODO: Implement these
linkedin: () => {
  throw new Error("LinkedIn scraper not yet implemented");
},
```

**Requirements**:
1. **Choose scraping method**:
   - Option A: API access (requires LinkedIn Partner status - difficult)
   - Option B: Authenticated scraping (requires login - ToS violation risk)
   - Option C: Public job board scraping (limited data, no auth needed)
   - **Recommendation**: Start with Option C

2. **Public LinkedIn job board**:
   - URL: `https://www.linkedin.com/jobs/search/?keywords=React+Developer&location=Netherlands`
   - No login required for basic job listings
   - Limited to ~25 results per page
   - Can't see "Easy Apply" status without login

3. **Implement scraper**:
   - Follow `BaseScraper` pattern
   - Use Puppeteer for dynamic content
   - Extract job data from page
   - Handle pagination (limited to ~10 pages)

**Technical Approach**:
```typescript
// New file: apps/admin/scripts/scrapers/LinkedInScraper.ts
import { BaseScraper } from "./BaseScraper";

export class LinkedInScraper extends BaseScraper {
  readonly source = "linkedin" as const;
  readonly baseUrl = "https://www.linkedin.com/jobs/search/";
  
  async scrape(): Promise<Job[]> {
    // Navigate to job search
    // Extract job cards
    // Follow pagination
    // Return jobs
  }
}
```

**Anti-Scraping Considerations**:
- LinkedIn has aggressive bot detection
- Use residential proxies if needed
- Rotate user agents
- Add random delays (3-8s between requests)
- Don't scrape too frequently (max 1x per day)
- Watch for CAPTCHA challenges

**Acceptance Criteria**:
- [ ] Scraper extracts jobs from public LinkedIn job board
- [ ] Job data includes title, company, location, description, URL
- [ ] Works without authentication
- [ ] Doesn't trigger LinkedIn's anti-bot measures
- [ ] Respects rate limits (no IP bans)
- [ ] Falls back gracefully if blocked

**Related**:
- Similar to ADMIN-07 (Indeed scraper fix)
- Could link to ADMIN-09 (Glassdoor scraper)

---

### ADMIN-09: Implement Glassdoor Job Scraper
**Project**: Admin Dashboard  
**Component**: `apps/admin/scripts/scrape-jobs.ts`, `apps/admin/scripts/scrapers/GlassdoorScraper.ts`  
**Priority**: MEDIUM  
**Effort**: 10 hours  
**Blockers**: None

**Context**:
Glassdoor scraper is not yet implemented. Glassdoor has salary data and company reviews, making it valuable for job matching.

**Current State**:
```typescript
// Line 42: TODO: Implement these
glassdoor: () => {
  throw new Error("Glassdoor scraper not yet implemented");
},
```

**Requirements**:
1. Scrape job listings from Glassdoor
2. Extract salary estimates (Glassdoor's key differentiator)
3. Include company rating in job data
4. Handle Glassdoor's paywall (some data requires login)
5. Extract benefits information if available

**Technical Approach**:
```typescript
// New file: apps/admin/scripts/scrapers/GlassdoorScraper.ts
import { BaseScraper } from "./BaseScraper";

export class GlassdoorScraper extends BaseScraper {
  readonly source = "glassdoor" as const;
  readonly baseUrl = "https://www.glassdoor.com/Job/";
  
  async scrape(): Promise<Job[]> {
    // Navigate to job search
    // Extract jobs with salary estimates
    // Include company ratings
    // Return enriched job data
  }
}
```

**Glassdoor-Specific Fields**:
```typescript
interface GlassdoorJob extends Job {
  salaryEstimate?: { min: number; max: number; currency: string };
  companyRating?: number; // 0-5
  benefits?: string[];
  employerType?: "Direct Hire" | "Recruiter";
}
```

**Acceptance Criteria**:
- [ ] Scraper extracts jobs from Glassdoor
- [ ] Salary estimates are included when available
- [ ] Company ratings are included
- [ ] Works without authentication (for public jobs)
- [ ] Handles paywall gracefully (skip paywalled content)

**Related**:
- Similar to ADMIN-07 and ADMIN-08
- Complements RemoteOK/Adzuna for salary data

---

### ADMIN-10: Navigate to Freep Assignments in HTML Parser
**Project**: Admin Dashboard  
**Component**: `apps/admin/scripts/scrape-freep-final.ts`  
**Priority**: MEDIUM  
**Effort**: 4 hours  
**Blockers**: None

**Context**:
The Freep scraper successfully parses the `window.__NUXT__` data from HTML, but doesn't navigate to the actual assignments array. Need to inspect the data structure and extract job listings.

**Current State**:
```typescript
// Line 96: TODO: Navigate to actual assignments
// Based on earlier analysis, we need to find the assignments array
console.log("Data keys:", Object.keys(nuxtData));
```

**Requirements**:
1. Inspect `window.__NUXT__` structure to find assignments
2. Navigate nested object to find job array
3. Extract job fields: title, company, location, description, salary, URL
4. Map Freep-specific fields to unified Job interface
5. Handle government contracts (tag appropriately)

**Technical Approach**:
```typescript
function parseJobsFromHTML(html: string): ScrapedJob[] {
  const nuxtMatch = html.match(/window\.__NUXT__\s*=\s*(\{[^<]+\})/);
  const nuxtData = eval(`(${nuxtMatch[1]})`);
  
  // Navigate to assignments (example path - verify actual structure)
  const assignments = nuxtData?.data?.[0]?.assignments || [];
  
  return assignments.map((assignment: any) => ({
    title: assignment.title,
    company: assignment.client?.name || "Unknown",
    location: assignment.location || "Netherlands",
    description: assignment.description,
    salary: assignment.fee ? `€${assignment.fee}/day` : undefined,
    url: `https://www.freep.nl/opdrachten/${assignment.id}`,
    technologies: extractTechnologies(assignment.description),
    source: "freep",
    employmentType: "contract",
    postedAt: assignment.publishedAt ? new Date(assignment.publishedAt).getTime() : undefined,
  }));
}
```

**Research Phase** (1 hour):
1. Run scraper with console logging
2. Inspect `window.__NUXT__` structure
3. Document path to assignments array
4. Document field mappings

**Implementation Phase** (2 hours):
1. Update `parseJobsFromHTML` function
2. Add field extractors
3. Test with live data

**Testing Phase** (1 hour):
1. Run scraper and verify job extraction
2. Check all fields are correctly mapped
3. Verify government contract detection
4. Test with multiple pages

**Acceptance Criteria**:
- [ ] Assignments are successfully extracted from __NUXT__ data
- [ ] All job fields are correctly mapped
- [ ] Government contracts are tagged appropriately
- [ ] Scraper returns 10+ jobs per run
- [ ] Data is saved to Convex correctly

---

### ADMIN-11: Implement Content Creation Workflow for Intelligence Feed
**Project**: Admin Dashboard  
**Component**: `apps/admin/src/app/(admin)/intelligence/page.tsx`  
**Priority**: MEDIUM  
**Effort**: 8 hours  
**Blockers**: Requires content generation service or agent

**Context**:
The Intelligence Feed displays trends, news, and insights, but the "Create Content" button does nothing. Need to implement a workflow that converts feed items into blog posts or social content.

**Current State**:
```typescript
// Line 71: TODO: Implement content creation workflow
const handleCreateContent = async (feedId: Id<"agent_feed">) => {
  console.log("Create content from feed item:", feedId);
  alert("Content creation workflow coming soon!");
};
```

**Requirements**:
1. **Content Type Selection**:
   - Blog post (long-form)
   - Twitter/X thread (short-form)
   - LinkedIn post (professional)
   - Newsletter section (digest format)

2. **Generation Flow**:
   - User clicks "Create Content" on feed item
   - Modal opens with content type options
   - User selects type and optionally adds notes
   - System generates draft content using AI
   - User reviews and edits in content calendar
   - User schedules or publishes

3. **AI Generation**:
   - Use OpenAI GPT-4 or Claude for content generation
   - Include feed item context in prompt
   - Generate title, body, tags, and featured image suggestion
   - Match user's writing style (analyze previous posts)

4. **Integration Points**:
   - Save to `content_calendar` table in Convex
   - Link to original feed item (source attribution)
   - Add to content calendar view
   - Trigger notification when draft is ready

**Technical Approach**:
```typescript
// New mutation: convex/content_calendar.ts
export const createFromFeedItem = mutation({
  args: {
    feedId: v.id("agent_feed"),
    contentType: v.union(
      v.literal("blog"),
      v.literal("twitter"),
      v.literal("linkedin"),
      v.literal("newsletter")
    ),
    userNotes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // 1. Fetch feed item
    const feedItem = await ctx.db.get(args.feedId);
    
    // 2. Generate content with AI
    const draft = await generateContent(
      feedItem,
      args.contentType,
      args.userNotes
    );
    
    // 3. Save to content calendar
    const contentId = await ctx.db.insert("content_calendar", {
      title: draft.title,
      content: draft.body,
      type: args.contentType,
      status: "draft",
      sourceFeedItem: args.feedId,
      tags: draft.tags,
      scheduledFor: undefined, // User will schedule later
      createdAt: Date.now(),
    });
    
    // 4. Mark feed item as "actioned"
    await ctx.db.patch(args.feedId, { actioned: true });
    
    return contentId;
  },
});

// Helper function for AI generation
async function generateContent(
  feedItem: any,
  type: string,
  userNotes?: string
): Promise<{ title: string; body: string; tags: string[] }> {
  // Call OpenAI/Claude API
  // Use appropriate prompt template for content type
  // Return generated content
}
```

**UI Flow**:
```typescript
// Update handleCreateContent in page.tsx
const handleCreateContent = async (feedId: Id<"agent_feed">) => {
  setIsCreating(true);
  try {
    const contentId = await createFromFeedItem({
      feedId,
      contentType: selectedType,
      userNotes,
    });
    
    toast.success("Content draft created!");
    router.push(`/content?id=${contentId}`);
  } catch (error) {
    toast.error("Failed to create content");
  } finally {
    setIsCreating(false);
  }
};
```

**Acceptance Criteria**:
- [ ] "Create Content" button opens content type selector
- [ ] AI generates draft content from feed item
- [ ] Draft is saved to content calendar
- [ ] User is redirected to content editor
- [ ] Feed item is marked as "actioned"
- [ ] Works for all content types (blog, twitter, linkedin, newsletter)

**Related**:
- Uses Convex `content_calendar` table
- May integrate with social posting tools

---

## 🟢 LOW PRIORITY (5 tickets)

### ADMIN-12: Implement Job Matching Rescoring Logic
**Project**: Admin Dashboard  
**Component**: `apps/admin/src/app/(admin)/jobs/prolinker/components/MatchingSection.tsx`  
**Priority**: LOW  
**Effort**: 4 hours  
**Blockers**: None

**Context**:
The job matching section has a "Rescore All Jobs" button that does nothing. Need to trigger recalculation of match scores when user updates their profile or preferences.

**Current State**:
```typescript
// Line 12: TODO: Implement rescoring logic
const handleRescore = async () => {
  setIsRescoring(true);
  // TODO: Implement rescoring logic
  setTimeout(() => setIsRescoring(false), 2000);
};
```

**Requirements**:
1. Trigger Convex action to recalculate all job scores
2. Show progress indicator during rescoring
3. Update UI with new scores when complete
4. Log rescoring event to analytics
5. Notify user when rescoring is complete

**Technical Approach**:
```typescript
// Add to convex/job_matching.ts
export const rescoreAllJobs = action({
  args: {},
  handler: async (ctx) => {
    const jobs = await ctx.runQuery(internal.scraped_jobs.listAll);
    const profile = await ctx.runQuery(internal.user_profile.get);
    
    let updated = 0;
    for (const job of jobs) {
      const score = calculateMatchScore(job, profile);
      await ctx.runMutation(internal.job_matches.upsert, {
        jobId: job._id,
        score,
        matchDetails: /* ... */,
      });
      updated++;
    }
    
    return { updated };
  },
});

// Update MatchingSection.tsx
const rescoreAllJobs = useAction(api.job_matching.rescoreAllJobs);

const handleRescore = async () => {
  setIsRescoring(true);
  try {
    const result = await rescoreAllJobs({});
    toast.success(`Rescored ${result.updated} jobs`);
  } catch (error) {
    toast.error("Failed to rescore jobs");
  } finally {
    setIsRescoring(false);
  }
};
```

**Acceptance Criteria**:
- [ ] Button triggers rescoring of all jobs
- [ ] Progress indicator shows during rescoring
- [ ] Job scores are updated in database
- [ ] UI refreshes with new scores
- [ ] Toast notification shows completion

---

### ADMIN-13: Add Success Toast for Scraper Trigger
**Project**: Admin Dashboard  
**Component**: `apps/admin/src/app/(admin)/jobs/prolinker/components/ScraperHealth.tsx`  
**Priority**: LOW  
**Effort**: 30 minutes  
**Blockers**: None

**Context**:
When user triggers scraper manually, there's no success feedback. Need to add toast notification.

**Current State**:
```typescript
// Line 28: TODO: Show success message
await triggerScraper({});
// TODO: Show success message
```

**Requirements**:
1. Show success toast when scraper is triggered
2. Include scraper run ID or timestamp in message
3. Link to scraper health section to view progress

**Technical Approach**:
```typescript
import { toast } from "sonner"; // or your toast library

const handleTriggerScraper = async () => {
  setIsTriggering(true);
  try {
    const result = await triggerScraper({});
    toast.success(`Scraper triggered successfully!`, {
      description: `Run ID: ${result.runId}`,
      action: {
        label: "View Progress",
        onClick: () => router.push("/jobs/prolinker?tab=health"),
      },
    });
  } catch (error) {
    toast.error("Failed to trigger scraper", {
      description: error.message,
    });
  } finally {
    setIsTriggering(false);
  }
};
```

**Acceptance Criteria**:
- [ ] Success toast appears when scraper is triggered
- [ ] Toast includes run ID
- [ ] Toast has "View Progress" action button
- [ ] Error toast appears if trigger fails

---

### ADMIN-14: Add Error Toast for Scraper Trigger
**Project**: Admin Dashboard  
**Component**: `apps/admin/src/app/(admin)/jobs/prolinker/components/ScraperHealth.tsx`  
**Priority**: LOW  
**Effort**: 15 minutes  
**Blockers**: None

**Context**:
When scraper trigger fails, there's no error feedback. Need to add error toast notification.

**Current State**:
```typescript
// Line 31: TODO: Show error message
} catch (error) {
  console.error("Failed to trigger scraper:", error);
  // TODO: Show error message
}
```

**Covered by ADMIN-13** - Error handling is included in the same toast implementation.

**No separate ticket needed** - Merge with ADMIN-13.

---

### PORT-03: Add Sentry Error Tracking to Portfolio
**Project**: Portfolio Frontend  
**Component**: 
- `apps/portfolio/app/(main)/global-error.tsx`
- `apps/portfolio/components/ErrorBoundary.tsx`  
**Priority**: LOW  
**Effort**: 3 hours  
**Blockers**: Requires Sentry account setup

**Context**:
Global error handler and error boundary currently only log to console in development. Need to integrate error tracking service (Sentry recommended) for production error monitoring.

**Current State**:
```typescript
// global-error.tsx Line 20: TODO: Log to error tracking service
// Example: Sentry.captureException(error);

// ErrorBoundary.tsx Line 50: TODO: Log to error tracking service
// Example: Sentry.captureException(error, { contexts: { react: errorInfo } });
```

**Requirements**:
1. Set up Sentry account and project
2. Install `@sentry/nextjs` package
3. Configure Sentry in `next.config.js`
4. Add Sentry initialization to app
5. Update error handlers to send to Sentry
6. Add source maps for production debugging
7. Configure error sampling (don't send all errors to save quota)

**Technical Approach**:
```bash
# Install Sentry
pnpm add @sentry/nextjs --filter @steding/portfolio

# Initialize Sentry (creates sentry.*.config.ts files)
npx @sentry/wizard@latest -i nextjs
```

```typescript
// sentry.client.config.ts
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1, // 10% of transactions
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  integrations: [
    Sentry.replayIntegration({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
});

// Update global-error.tsx
useEffect(() => {
  Sentry.captureException(error, {
    tags: { error_boundary: "global" },
  });
}, [error]);

// Update ErrorBoundary.tsx
componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
  Sentry.captureException(error, {
    contexts: { react: errorInfo },
    tags: { error_boundary: "component" },
  });
  this.props.onError?.(error, errorInfo);
}
```

**Configuration**:
```javascript
// next.config.js
const { withSentryConfig } = require("@sentry/nextjs");

module.exports = withSentryConfig(
  nextConfig,
  {
    silent: true,
    org: "your-org",
    project: "portfolio",
  },
  {
    widenClientFileUpload: true,
    transpileClientSDK: true,
    hideSourceMaps: true,
    disableLogger: true,
  }
);
```

**Environment Variables**:
```bash
# .env.local
NEXT_PUBLIC_SENTRY_DSN=https://[key]@o[org].ingest.sentry.io/[project]
SENTRY_AUTH_TOKEN=[token] # For uploading source maps
```

**Testing**:
```typescript
// Add test error button in dev mode
{process.env.NODE_ENV === "development" && (
  <button onClick={() => { throw new Error("Test Sentry Error"); }}>
    Test Error
  </button>
)}
```

**Acceptance Criteria**:
- [ ] Sentry is properly configured
- [ ] Errors are sent to Sentry in production
- [ ] Source maps are uploaded for debugging
- [ ] Error grouping works correctly
- [ ] User context is included (if available)
- [ ] Performance monitoring is enabled (optional)
- [ ] Replays are recorded for errors (optional)

**Cost Consideration**:
- Free tier: 5,000 errors/month, 50 performance units/month
- Paid: $26/month for 50K errors
- Configure sampling to stay within free tier

**Related**:
- Could add similar tracking to admin dashboard
- Could integrate with OpenClaw error monitoring

---

## 📊 Implementation Priority Matrix

```
High Impact, Quick Wins:
├─ ADMIN-06: Telegram Digest (2h)
├─ ADMIN-13: Success Toast (0.5h)
├─ ADMIN-05: CV Upload (4h)

High Impact, Complex:
├─ ADMIN-03: Form Submission (8h)
├─ ADMIN-04: Generic Form Filling (12h)
├─ ADMIN-11: Content Workflow (8h)

Medium Impact:
├─ ADMIN-07: Fix Indeed (6h)
├─ ADMIN-10: Freep Assignments (4h)
├─ ADMIN-12: Rescoring Logic (4h)

Low Priority (Nice to Have):
├─ ADMIN-08: LinkedIn Scraper (12h)
├─ ADMIN-09: Glassdoor Scraper (10h)
├─ PORT-03: Sentry Integration (3h)
```

**Recommended Sprint 1** (40 hours):
1. ADMIN-06: Telegram Digest (2h) ✅
2. ADMIN-13: Success/Error Toasts (0.5h) ✅
3. ADMIN-05: CV Upload (4h) 
4. ADMIN-03: Form Submission (8h)
5. ADMIN-10: Freep Assignments (4h)
6. ADMIN-07: Fix Indeed (6h)
7. ADMIN-11: Content Workflow (8h)
8. PORT-03: Sentry Integration (3h)
9. Buffer: 4.5h

**Recommended Sprint 2** (40 hours):
1. ADMIN-04: Generic Form Filling (12h)
2. ADMIN-12: Rescoring Logic (4h)
3. ADMIN-08: LinkedIn Scraper (12h)
4. ADMIN-09: Glassdoor Scraper (10h)
5. Buffer: 2h

---

## 🔗 Dependencies & Links

**Cross-Project Dependencies**:
- ADMIN-03 ← ADMIN-04 (form submission needs generic filling)
- ADMIN-03 ← ADMIN-05 (form submission needs CV upload)
- ADMIN-06 → Convex `job_matching.getDailyDigest`
- ADMIN-11 → Convex `content_calendar` table
- PORT-03 → Admin could use same Sentry setup

**External Dependencies**:
- Sentry account (PORT-03)
- LinkedIn Partner API (ADMIN-08, optional)
- OpenAI/Claude API (ADMIN-11)

---

## 📝 Notes

1. **Auto-Apply Safety**: ADMIN-03, ADMIN-04, ADMIN-05 are critical for automation but need thorough testing. Start with extended dry-run testing before enabling live submissions.

2. **Scraper Maintenance**: Job board HTML changes frequently. Plan for quarterly scraper maintenance to keep selectors up-to-date.

3. **Error Tracking ROI**: PORT-03 (Sentry) is low priority now but becomes critical as traffic grows. Implement before public launch.

4. **Content AI Costs**: ADMIN-11 will incur OpenAI API costs. Estimate ~$0.01-0.05 per piece of content generated. Budget accordingly.

5. **Legal Considerations**: 
   - Auto-apply feature should have user consent
   - Job scraping should respect robots.txt
   - LinkedIn ToS prohibits automated scraping

6. **Testing Strategy**:
   - All auto-apply features need extensive dry-run testing
   - Create test job applications in staging environment
   - Monitor success/failure rates in production

---

**Generated**: 2026-03-04  
**Last Updated**: 2026-03-04  
**Total Estimated Effort**: ~92 hours (2-3 sprints)
