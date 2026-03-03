import { test, expect } from "@playwright/test";

/**
 * E2E Tests for All Admin Pages
 * 
 * This suite tests every page in the admin dashboard to ensure:
 * - Pages load without errors
 * - No console errors (except warnings)
 * - Critical elements are visible
 * - Data loads from Convex
 */

test.describe("Admin Dashboard - All Pages", () => {
  
  test("dashboard page loads", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page.locator("h1, h2").first()).toBeVisible({ timeout: 10000 });
    
    // Check for critical console errors
    const errors: string[] = [];
    page.on("console", msg => {
      if (msg.type() === "error") {
        errors.push(msg.text());
      }
    });
    
    await page.waitForTimeout(2000);
    expect(errors.filter(e => !e.includes("Warning"))).toHaveLength(0);
  });

  test("jobs page loads and displays data", async ({ page }) => {
    await page.goto("/jobs");
    
    // Wait for page to load
    await expect(page.locator("h1")).toContainText("Job Applications");
    
    // Check for Kanban columns
    await expect(page.locator("text=Applied")).toBeVisible();
    await expect(page.locator("text=Interviewing")).toBeVisible();
    await expect(page.locator("text=Offer")).toBeVisible();
    await expect(page.locator("text=Rejected")).toBeVisible();
    
    // Check analytics panel
    await expect(page.locator("text=Total Applications")).toBeVisible();
  });

  test("jobs sources page loads", async ({ page }) => {
    await page.goto("/jobs/sources");
    
    await expect(page.locator("h1")).toContainText("Job Sources");
    
    // Check for scrapers
    await expect(page.locator("text=ProLinker")).toBeVisible();
    await expect(page.locator("text=Freep.nl")).toBeVisible();
    await expect(page.locator("text=Medium")).toBeVisible();
  });

  test("jobs prolinker page loads", async ({ page }) => {
    await page.goto("/jobs/prolinker");
    
    // Should have some heading
    await expect(page.locator("h1, h2").first()).toBeVisible();
  });

  test("blog page loads", async ({ page }) => {
    await page.goto("/blog");
    
    await expect(page.locator("h1, h2").first()).toBeVisible();
  });

  test("projects page loads", async ({ page }) => {
    await page.goto("/projects");
    
    await expect(page.locator("h1, h2").first()).toBeVisible();
  });

  test("experience page loads", async ({ page }) => {
    await page.goto("/experience");
    
    await expect(page.locator("h1, h2").first()).toBeVisible();
  });

  test("skills page loads", async ({ page }) => {
    await page.goto("/skills");
    
    await expect(page.locator("h1, h2").first()).toBeVisible();
  });

  test("content page loads", async ({ page }) => {
    await page.goto("/content");
    
    await expect(page.locator("h1, h2").first()).toBeVisible();
  });

  test("feed page loads", async ({ page }) => {
    await page.goto("/feed");
    
    await expect(page.locator("h1, h2").first()).toBeVisible();
  });

  test("intelligence page loads", async ({ page }) => {
    await page.goto("/intelligence");
    
    await expect(page.locator("h1, h2").first()).toBeVisible();
  });

  test("tasks page loads", async ({ page }) => {
    await page.goto("/tasks");
    
    await expect(page.locator("h1, h2").first()).toBeVisible();
  });

  test("agents page loads", async ({ page }) => {
    await page.goto("/agents");
    
    await expect(page.locator("h1, h2").first()).toBeVisible();
  });

  test("analytics page loads", async ({ page }) => {
    await page.goto("/analytics");
    
    await expect(page.locator("h1, h2").first()).toBeVisible();
  });

  test("seo page loads", async ({ page }) => {
    await page.goto("/seo");
    
    await expect(page.locator("h1, h2").first()).toBeVisible();
  });

  test("media page loads", async ({ page }) => {
    await page.goto("/media");
    
    await expect(page.locator("h1, h2").first()).toBeVisible();
  });

  test("settings page loads", async ({ page }) => {
    await page.goto("/settings");
    
    await expect(page.locator("h1, h2").first()).toBeVisible();
  });
});

test.describe("Admin Dashboard - Console Error Detection", () => {
  
  const pagesToTest = [
    "/dashboard",
    "/jobs",
    "/jobs/sources",
    "/blog",
    "/projects",
    "/content",
    "/intelligence",
  ];

  for (const path of pagesToTest) {
    test(`${path} has no critical console errors`, async ({ page }) => {
      const errors: string[] = [];
      const warnings: string[] = [];

      page.on("console", msg => {
        if (msg.type() === "error") {
          // Filter out known warnings from dependencies
          const text = msg.text();
          if (text.includes("Clerk:") || 
              text.includes("development keys") ||
              text.includes("Warning:")) {
            warnings.push(text);
          } else {
            errors.push(text);
          }
        }
      });

      await page.goto(path);
      await page.waitForTimeout(3000); // Let page fully load

      // Report errors if any
      if (errors.length > 0) {
        console.log(`❌ Console errors on ${path}:`);
        errors.forEach(e => console.log(`  - ${e}`));
      }

      if (warnings.length > 0) {
        console.log(`⚠️  Warnings on ${path} (non-critical):`);
        warnings.forEach(w => console.log(`  - ${w.substring(0, 100)}...`));
      }

      // Fail if we have actual errors (not warnings)
      expect(errors).toHaveLength(0);
    });
  }
});

test.describe("Admin Dashboard - Data Loading", () => {
  
  test("jobs page loads job data from Convex", async ({ page }) => {
    await page.goto("/jobs");
    
    // Wait for Convex to load
    await page.waitForTimeout(2000);
    
    // Check if loading state is gone (should show either jobs or empty state)
    const hasLoadingSpinner = await page.locator(".animate-pulse").isVisible().catch(() => false);
    
    if (!hasLoadingSpinner) {
      // Either we have jobs or "No applications"
      const hasJobs = await page.locator(".cursor-pointer").count() > 0;
      const hasEmptyState = await page.locator("text=No applications").isVisible().catch(() => false);
      
      expect(hasJobs || hasEmptyState).toBe(true);
    }
  });

  test("jobs sources shows scraper stats", async ({ page }) => {
    await page.goto("/jobs/sources");
    
    // Wait for data to load
    await page.waitForTimeout(2000);
    
    // Should show job counts
    const statsVisible = await page.locator("text=/Jobs.*24h/").isVisible().catch(() => false) ||
                         await page.locator("text=/Total Jobs/").isVisible().catch(() => false);
    
    expect(statsVisible).toBe(true);
  });

  test("intelligence page loads agent feed", async ({ page }) => {
    await page.goto("/intelligence");
    
    // Wait for data
    await page.waitForTimeout(2000);
    
    // Should have loaded (either showing data or empty state)
    const isLoaded = await page.locator(".animate-pulse").isVisible()
      .then(visible => !visible)
      .catch(() => true);
    
    expect(isLoaded).toBe(true);
  });
});

test.describe("Admin Dashboard - Navigation", () => {
  
  test("can navigate between main pages", async ({ page }) => {
    await page.goto("/dashboard");
    
    // Navigate to Jobs
    await page.click("text=Jobs, a[href='/jobs']").catch(async () => {
      // If sidebar link fails, try header
      await page.goto("/jobs");
    });
    
    await expect(page).toHaveURL(/\/jobs/);
    await expect(page.locator("h1")).toContainText("Job Applications");
    
    // Navigate to Projects
    await page.goto("/projects");
    await expect(page.locator("h1, h2").first()).toBeVisible();
    
    // Navigate to Content
    await page.goto("/content");
    await expect(page.locator("h1, h2").first()).toBeVisible();
  });

  test("can access job detail page", async ({ page }) => {
    await page.goto("/jobs");
    
    // Wait for jobs to load
    await page.waitForTimeout(2000);
    
    // Check if any jobs exist
    const jobCards = await page.locator(".cursor-pointer").count();
    
    if (jobCards > 0) {
      // Click first job
      await page.locator(".cursor-pointer").first().click();
      
      // Dialog should open
      await expect(page.locator("role=dialog, .modal, [class*='dialog']").first()).toBeVisible();
    }
  });
});

test.describe("Admin Dashboard - Critical Functionality", () => {
  
  test("can toggle analytics panel on jobs page", async ({ page }) => {
    await page.goto("/jobs");
    
    // Find analytics panel
    const analyticsPanel = page.locator("text=Total Applications").locator("..");
    
    // Should be visible by default
    await expect(analyticsPanel).toBeVisible();
    
    // Find toggle button (if it exists)
    const toggleBtn = page.locator("button[aria-label='Toggle analytics'], button:has-text('BarChart')").first();
    
    if (await toggleBtn.isVisible().catch(() => false)) {
      await toggleBtn.click();
      await expect(analyticsPanel).not.toBeVisible();
    }
  });

  test("can filter jobs by date range", async ({ page }) => {
    await page.goto("/jobs");
    
    // Wait for page to load
    await page.waitForTimeout(2000);
    
    // Find date range selector
    const dateSelector = page.locator("select, [role='combobox']").filter({ hasText: /7d|30d|90d/ }).first();
    
    if (await dateSelector.isVisible().catch(() => false)) {
      await dateSelector.click();
      
      // Select different range
      await page.locator("text=Last 7 days, [value='7d']").first().click().catch(() => {});
      
      await page.waitForTimeout(1000);
      // Jobs should update (we just verify no crash)
    }
  });

  test("manual scraper trigger button exists", async ({ page }) => {
    await page.goto("/jobs/sources");
    
    // Find ProLinker card
    const prolinkerCard = page.locator("text=ProLinker").locator("..");
    
    // Should have a trigger button
    await expect(prolinkerCard.locator("button").last()).toBeVisible();
  });
});
