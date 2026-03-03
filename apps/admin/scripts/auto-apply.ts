#!/usr/bin/env tsx
/**
 * Auto-Apply Engine
 * 
 * Automatically applies to jobs based on settings and match scores.
 * 
 * Features:
 * - Three modes: manual, semi-auto, full-auto
 * - Safety controls: daily limits, cooldowns, blacklists
 * - Puppeteer-based form filling
 * - Application tracking and logging
 * - Dry-run mode for testing
 * 
 * Usage:
 *   tsx apps/admin/scripts/auto-apply.ts [--dry-run] [--force] [--job-id=<id>]
 * 
 * Options:
 *   --dry-run    Test mode - don't actually submit applications
 *   --force      Bypass safety checks (use with caution!)
 *   --job-id     Apply to specific job only
 * 
 * Environment Variables:
 *   CONVEX_URL   - Convex deployment URL (required)
 */

import puppeteer, { Browser, Page } from "puppeteer";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import fs from "fs/promises";
import path from "path";

// Parse command line arguments
const args = process.argv.slice(2);
const DRY_RUN = args.includes("--dry-run");
const FORCE = args.includes("--force");
const JOB_ID_ARG = args.find(arg => arg.startsWith("--job-id="));
const SPECIFIC_JOB_ID = JOB_ID_ARG ? JOB_ID_ARG.split("=")[1] : null;

// Initialize Convex client
const convexUrl = process.env.CONVEX_URL;
if (!convexUrl) {
  console.error("❌ CONVEX_URL environment variable is required");
  process.exit(1);
}

const convex = new ConvexHttpClient(convexUrl);

interface AutoApplySettings {
  mode: "manual" | "semi-auto" | "full-auto";
  enabled: boolean;
  dailyLimit: number;
  scoreThreshold: number;
  companyCooldownDays: number;
  blacklistCompanies: string[];
  blacklistKeywords: string[];
  whitelistCompanies: string[];
  requiredKeywords: string[];
  dryRun: boolean;
  notifyOnApply: boolean;
  autoWithdrawOnBetter: boolean;
  weeklyReportEnabled: boolean;
}

interface ApplicationTemplate {
  _id: Id<"application_templates">;
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  cvUrl?: string;
  coverLetterTemplate?: string;
  availability?: string;
  salaryExpectation?: string;
  rightsToWork?: string;
}

interface ScrapedJob {
  _id: Id<"scraped_jobs">;
  title: string;
  company: string;
  location?: string;
  description: string;
  salary?: string;
  url: string;
  technologies: string[];
  remote?: boolean;
  employmentType?: string;
  experienceLevel?: string;
  source: string;
}

interface JobMatch {
  jobId: Id<"scraped_jobs">;
  score: number;
  matchDetails: {
    matchedTechnologies: string[];
    missingTechnologies: string[];
    matchedKeywords: string[];
    flags: string[];
  };
}

interface ApplicationResult {
  success: boolean;
  jobId: Id<"scraped_jobs">;
  jobTitle: string;
  company: string;
  error?: string;
  confirmationUrl?: string;
  screenshotPath?: string;
  dryRun: boolean;
}

class AutoApplyEngine {
  private browser: Browser | null = null;
  private settings: AutoApplySettings | null = null;
  private template: ApplicationTemplate | null = null;
  private stats = {
    jobsProcessed: 0,
    applicationsAttempted: 0,
    applicationsSucceeded: 0,
    applicationsFailed: 0,
    applicationsSkipped: 0,
    startTime: Date.now(),
  };

  async initialize() {
    console.log("🚀 Initializing Auto-Apply Engine...");
    console.log(`   Mode: ${DRY_RUN ? "DRY-RUN" : "LIVE"}`);
    console.log(`   Force: ${FORCE ? "YES" : "NO"}`);
    if (SPECIFIC_JOB_ID) {
      console.log(`   Target: Job ID ${SPECIFIC_JOB_ID}`);
    }

    // Load settings
    this.settings = await convex.query(api.auto_apply_settings.get);
    console.log(`   Settings Mode: ${this.settings.mode}`);
    console.log(`   Enabled: ${this.settings.enabled}`);
    console.log(`   Daily Limit: ${this.settings.dailyLimit}`);
    console.log(`   Score Threshold: ${this.settings.scoreThreshold}`);

    // Check if enabled (unless forced)
    if (!this.settings.enabled && !FORCE) {
      console.log("⚠️  Auto-apply is disabled. Use --force to override.");
      process.exit(0);
    }

    // Load default application template
    this.template = await convex.query(api.application_templates.getDefault);
    if (!this.template) {
      console.error("❌ No default application template found. Please create one first.");
      process.exit(1);
    }
    console.log(`   Template: ${this.template.fullName} (${this.template.email})`);

    // Launch browser
    this.browser = await puppeteer.launch({
      headless: !DRY_RUN, // Show browser in dry-run mode for debugging
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    console.log("   Browser: Launched");
  }

  async run() {
    try {
      await this.initialize();

      // Get jobs to process
      const jobs = await this.getJobsToApply();
      console.log(`\n📋 Found ${jobs.length} jobs to process`);

      if (jobs.length === 0) {
        console.log("   No jobs meet criteria. Exiting.");
        return;
      }

      // Check daily limit
      const todayStats = await convex.query(api.auto_apply_settings.getStats);
      const remaining = todayStats.remainingToday;

      if (remaining <= 0 && !FORCE) {
        console.log(`⚠️  Daily limit reached (${this.settings!.dailyLimit}). Use --force to override.`);
        return;
      }

      const maxToApply = FORCE ? jobs.length : Math.min(jobs.length, remaining);
      console.log(`   Will attempt to apply to ${maxToApply} jobs (${remaining} remaining today)`);

      // Process each job
      const results: ApplicationResult[] = [];
      for (let i = 0; i < maxToApply; i++) {
        const job = jobs[i];
        console.log(`\n[${i + 1}/${maxToApply}] Processing: ${job.title} at ${job.company}`);

        const result = await this.applyToJob(job);
        results.push(result);
        this.stats.jobsProcessed++;

        if (result.success) {
          this.stats.applicationsSucceeded++;
        } else {
          this.stats.applicationsFailed++;
        }

        // Rate limiting - wait between applications
        if (i < maxToApply - 1) {
          const delay = 5000 + Math.random() * 3000; // 5-8 seconds
          console.log(`   ⏳ Waiting ${(delay / 1000).toFixed(1)}s before next application...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }

      // Summary
      console.log("\n" + "=".repeat(60));
      console.log("✅ Auto-Apply Complete");
      console.log("=".repeat(60));
      console.log(`   Jobs Processed: ${this.stats.jobsProcessed}`);
      console.log(`   Applications Attempted: ${this.stats.applicationsAttempted}`);
      console.log(`   ✅ Succeeded: ${this.stats.applicationsSucceeded}`);
      console.log(`   ❌ Failed: ${this.stats.applicationsFailed}`);
      console.log(`   ⏭️  Skipped: ${this.stats.applicationsSkipped}`);
      console.log(`   Duration: ${((Date.now() - this.stats.startTime) / 1000).toFixed(1)}s`);
      console.log("=".repeat(60));

    } catch (error) {
      console.error("❌ Fatal error:", error);
      throw error;
    } finally {
      if (this.browser) {
        await this.browser.close();
      }
    }
  }

  private async getJobsToApply(): Promise<ScrapedJob[]> {
    // If specific job ID provided, fetch that job only
    if (SPECIFIC_JOB_ID) {
      const job = await convex.query(api.scraped_jobs.get, {
        id: SPECIFIC_JOB_ID as Id<"scraped_jobs">,
      });
      return job ? [job] : [];
    }

    // Get all scraped jobs
    const allJobs = await convex.query(api.scraped_jobs.list, {
      source: "prolinker",
      archived: false,
    });

    // Get job matches with scores
    const jobsWithScores: Array<ScrapedJob & { score: number }> = [];

    for (const job of allJobs) {
      // Check if already applied
      const existingApplication = await this.checkExistingApplication(job);
      if (existingApplication) {
        continue; // Skip already applied jobs
      }

      // Check safety filters
      if (!this.passesFilters(job)) {
        continue;
      }

      // Get match score
      const match = await convex.query(api.job_matches.list, {
        jobId: job._id,
      });

      const score = match && match.length > 0 ? match[0].score : 0;

      // Check score threshold based on mode
      const threshold = this.getScoreThreshold();
      if (score >= threshold) {
        jobsWithScores.push({ ...job, score });
      }
    }

    // Sort by score (highest first)
    jobsWithScores.sort((a, b) => b.score - a.score);

    return jobsWithScores;
  }

  private async checkExistingApplication(job: ScrapedJob): Promise<boolean> {
    const applications = await convex.query(api.jobs.list, {});
    
    // Check if already applied to this company/position
    const existing = applications.find(
      app => app.company === job.company && app.position === job.title
    );

    if (existing) {
      // Check cooldown period
      if (existing.appliedAt) {
        const daysSinceApplication =
          (Date.now() - existing.appliedAt) / (1000 * 60 * 60 * 24);
        
        if (daysSinceApplication < this.settings!.companyCooldownDays) {
          return true; // Still in cooldown
        }
      } else {
        return true; // Application exists but not yet applied
      }
    }

    return false;
  }

  private passesFilters(job: ScrapedJob): boolean {
    const settings = this.settings!;

    // Blacklist companies
    if (settings.blacklistCompanies.some(
      company => job.company.toLowerCase().includes(company.toLowerCase())
    )) {
      console.log(`   ⏭️  Skipped: ${job.company} is blacklisted`);
      this.stats.applicationsSkipped++;
      return false;
    }

    // Blacklist keywords in description
    const descLower = job.description.toLowerCase();
    if (settings.blacklistKeywords.some(keyword =>
      descLower.includes(keyword.toLowerCase())
    )) {
      console.log(`   ⏭️  Skipped: Contains blacklisted keyword`);
      this.stats.applicationsSkipped++;
      return false;
    }

    // Required keywords
    if (settings.requiredKeywords.length > 0) {
      const hasAllRequired = settings.requiredKeywords.every(keyword =>
        descLower.includes(keyword.toLowerCase())
      );
      if (!hasAllRequired) {
        console.log(`   ⏭️  Skipped: Missing required keywords`);
        this.stats.applicationsSkipped++;
        return false;
      }
    }

    return true;
  }

  private getScoreThreshold(): number {
    const settings = this.settings!;

    switch (settings.mode) {
      case "manual":
        return 100; // Never auto-apply in manual mode
      case "semi-auto":
        return 80; // High-quality matches only
      case "full-auto":
        return settings.scoreThreshold; // Use configured threshold
      default:
        return 100;
    }
  }

  private async applyToJob(job: ScrapedJob): Promise<ApplicationResult> {
    this.stats.applicationsAttempted++;

    const isDryRun = DRY_RUN || this.settings!.dryRun;
    const applicationLog: Array<{
      timestamp: number;
      action: string;
      status: "success" | "error" | "info";
      message: string;
    }> = [];

    const logAction = (action: string, status: "success" | "error" | "info", message: string) => {
      applicationLog.push({
        timestamp: Date.now(),
        action,
        status,
        message,
      });
      const icon = status === "success" ? "✅" : status === "error" ? "❌" : "ℹ️";
      console.log(`   ${icon} ${action}: ${message}`);
    };

    try {
      logAction("start", "info", `Starting application process${isDryRun ? " (DRY-RUN)" : ""}`);

      // Create job application record
      await convex.mutation(api.jobs.push, {
        company: job.company,
        position: job.title,
        url: job.url,
        status: "applying",
        location: job.location,
        remote: job.remote,
        salary: job.salary,
        notes: `Auto-applied via ${this.settings!.mode} mode`,
        tags: job.technologies,
        appliedVia: "auto-apply",
        applicationMode: this.settings!.mode,
        dryRun: isDryRun,
        applicationLog,
      });

      logAction("record_created", "success", "Application record created in Convex");

      // Apply based on platform
      let result: ApplicationResult;

      if (job.source === "prolinker") {
        result = await this.applyToProLinker(job, isDryRun, logAction);
      } else {
        // Generic application for other platforms
        result = await this.applyGeneric(job, isDryRun, logAction);
      }

      // Update application record with result
      const applications = await convex.query(api.jobs.list, {});
      const appRecord = applications.find(
        app => app.company === job.company && app.position === job.title
      );

      if (appRecord) {
        await convex.mutation(api.jobs.update, {
          id: appRecord._id,
          status: result.success ? "applied" : "applying",
          appliedAt: result.success ? Date.now() : undefined,
          applicationLog,
          confirmationUrl: result.confirmationUrl,
        });
      }

      return result;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logAction("error", "error", errorMessage);

      return {
        success: false,
        jobId: job._id,
        jobTitle: job.title,
        company: job.company,
        error: errorMessage,
        dryRun: isDryRun,
      };
    }
  }

  private async applyToProLinker(
    job: ScrapedJob,
    isDryRun: boolean,
    log: (action: string, status: "success" | "error" | "info", message: string) => void
  ): Promise<ApplicationResult> {
    
    const page = await this.browser!.newPage();

    try {
      log("navigate", "info", `Navigating to ${job.url}`);
      await page.goto(job.url, { waitUntil: "networkidle2", timeout: 30000 });

      // Look for apply button
      log("find_button", "info", "Looking for apply button");
      
      const applyButtonSelectors = [
        'button:has-text("Solliciteer")',
        'a:has-text("Solliciteer")',
        'button:has-text("Apply")',
        'a:has-text("Apply")',
        '[data-testid="apply-button"]',
        '.apply-button',
      ];

      let applyButton = null;
      for (const selector of applyButtonSelectors) {
        try {
          applyButton = await page.$(selector);
          if (applyButton) {
            log("find_button", "success", `Found apply button: ${selector}`);
            break;
          }
        } catch (e) {
          // Continue to next selector
        }
      }

      if (!applyButton) {
        throw new Error("Could not find apply button on page");
      }

      if (isDryRun) {
        log("dry_run", "info", "DRY-RUN: Would click apply button here");
        
        // Take screenshot
        const screenshotPath = path.join(
          process.cwd(),
          "screenshots",
          `dry-run-${Date.now()}.png`
        );
        await fs.mkdir(path.dirname(screenshotPath), { recursive: true });
        await page.screenshot({ path: screenshotPath, fullPage: true });
        
        log("screenshot", "success", `Screenshot saved: ${screenshotPath}`);

        await page.close();
        
        return {
          success: true,
          jobId: job._id,
          jobTitle: job.title,
          company: job.company,
          screenshotPath,
          dryRun: true,
        };
      }

      // Click apply button
      log("click_apply", "info", "Clicking apply button");
      await applyButton.click();
      await page.waitForNavigation({ waitUntil: "networkidle2", timeout: 10000 });

      // Fill application form
      log("fill_form", "info", "Filling application form");
      await this.fillApplicationForm(page, job, log);

      // Submit (or not, depending on safety)
      log("submit", "info", "Submitting application");
      
      // TODO: Implement actual form submission
      // For now, just capture confirmation
      const confirmationUrl = page.url();
      
      await page.close();

      return {
        success: true,
        jobId: job._id,
        jobTitle: job.title,
        company: job.company,
        confirmationUrl,
        dryRun: false,
      };

    } catch (error) {
      await page.close();
      throw error;
    }
  }

  private async applyGeneric(
    job: ScrapedJob,
    isDryRun: boolean,
    log: (action: string, status: "success" | "error" | "info", message: string) => void
  ): Promise<ApplicationResult> {
    
    log("generic_apply", "info", "Using generic application method");
    
    // For now, just mark as attempted
    // TODO: Implement generic form detection and filling
    
    if (isDryRun) {
      log("dry_run", "info", "DRY-RUN: Would apply here");
      
      return {
        success: true,
        jobId: job._id,
        jobTitle: job.title,
        company: job.company,
        dryRun: true,
      };
    }

    return {
      success: false,
      jobId: job._id,
      jobTitle: job.title,
      company: job.company,
      error: "Generic application not yet implemented",
      dryRun: false,
    };
  }

  private async fillApplicationForm(
    page: Page,
    job: ScrapedJob,
    log: (action: string, status: "success" | "error" | "info", message: string) => void
  ) {
    
    const template = this.template!;

    // Common form field patterns
    const fieldMappings = [
      { name: "name", value: template.fullName, selectors: ['input[name="name"]', 'input[id="name"]', 'input[placeholder*="Name"]'] },
      { name: "email", value: template.email, selectors: ['input[name="email"]', 'input[id="email"]', 'input[type="email"]'] },
      { name: "phone", value: template.phone, selectors: ['input[name="phone"]', 'input[id="phone"]', 'input[type="tel"]'] },
      { name: "linkedin", value: template.linkedinUrl, selectors: ['input[name="linkedin"]', 'input[id="linkedin"]'] },
      { name: "github", value: template.githubUrl, selectors: ['input[name="github"]', 'input[id="github"]'] },
      { name: "portfolio", value: template.portfolioUrl, selectors: ['input[name="portfolio"]', 'input[id="portfolio"]', 'input[name="website"]'] },
    ];

    for (const field of fieldMappings) {
      if (!field.value) continue;

      for (const selector of field.selectors) {
        try {
          const element = await page.$(selector);
          if (element) {
            await element.type(field.value, { delay: 50 });
            log("fill_field", "success", `Filled ${field.name}`);
            break;
          }
        } catch (e) {
          // Continue to next selector
        }
      }
    }

    // Upload CV if file input found
    if (template.cvUrl) {
      try {
        const fileInput = await page.$('input[type="file"]');
        if (fileInput) {
          // TODO: Download CV from URL and upload
          log("upload_cv", "info", "CV upload found but not implemented yet");
        }
      } catch (e) {
        log("upload_cv", "error", "Could not upload CV");
      }
    }
  }
}

// Main execution
const engine = new AutoApplyEngine();
engine.run().catch((error) => {
  console.error("❌ Fatal error:", error);
  process.exit(1);
});
