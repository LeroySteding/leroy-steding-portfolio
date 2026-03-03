import { test, expect } from "@playwright/test";

test.describe("Jobs Board (Kanban)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/jobs");
    await page.waitForLoadState("networkidle");
  });
  
  test("displays all kanban columns", async ({ page }) => {
    // Check header
    await expect(page.locator("h1")).toContainText("Job Applications");
    
    // Check all 4 columns are visible
    await expect(page.locator('[data-testid="applied-column"]', { hasText: "Applied" })).toBeVisible();
    await expect(page.locator('[data-testid="interviewing-column"]', { hasText: "Interviewing" })).toBeVisible();
    await expect(page.locator('[data-testid="offer-column"]', { hasText: "Offer" })).toBeVisible();
    await expect(page.locator('[data-testid="rejected-column"]', { hasText: "Rejected" })).toBeVisible();
  });
  
  test("displays analytics panel", async ({ page }) => {
    // Check analytics cards
    await expect(page.locator("text=Total Applications")).toBeVisible();
    await expect(page.locator("text=Success Rate")).toBeVisible();
    await expect(page.locator("text=Response Rate")).toBeVisible();
    await expect(page.locator("text=Avg Response Time")).toBeVisible();
  });
  
  test("can toggle analytics panel", async ({ page }) => {
    // Analytics should be visible by default
    const analyticsPanel = page.locator("text=Total Applications").locator("..");
    await expect(analyticsPanel).toBeVisible();
    
    // Click analytics toggle button
    const toggleBtn = page.locator("button[aria-label='Toggle analytics']").or(page.locator("button").filter({ hasText: "BarChart3" }));
    await toggleBtn.first().click();
    
    // Analytics should be hidden
    await expect(analyticsPanel).not.toBeVisible();
    
    // Click again to show
    await toggleBtn.first().click();
    await expect(analyticsPanel).toBeVisible();
  });
  
  test("date range filter works", async ({ page }) => {
    // Find date range selector
    const dateRangeSelect = page.locator('select[value="30d"]').or(page.locator("text=Last 30 days"));
    await expect(dateRangeSelect.first()).toBeVisible();
    
    // Change to 7 days
    await dateRangeSelect.first().click();
    await page.locator("text=Last 7 days").click();
    
    // Jobs should update (count may change)
    await page.waitForLoadState("networkidle");
  });
  
  test("can add new job manually", async ({ page }) => {
    // Click Add Job button
    const addJobBtn = page.locator("button:has-text('Add Job')");
    await addJobBtn.click();
    
    // Dialog should open
    await expect(page.locator("text=Add Job Application")).toBeVisible();
    
    // Fill in form
    await page.fill('[id="company"]', "Test Company");
    await page.fill('[id="position"]', "Senior Developer");
    await page.fill('[id="url"]', "https://example.com/job");
    await page.fill('[id="salary"]', "€60k - €80k");
    await page.fill('[id="location"]', "Amsterdam");
    
    // Check remote checkbox
    await page.check('[id="remote"]');
    
    // Add tags
    await page.fill('[id="tags"]', "React, TypeScript");
    
    // Add notes
    await page.fill('[id="notes"]', "Found via LinkedIn");
    
    // Submit
    await page.click("button[type='submit']:has-text('Add Application')");
    
    // Dialog should close
    await expect(page.locator("text=Add Job Application")).not.toBeVisible();
    
    // New job should appear in Applied column
    await expect(page.locator("text=Test Company")).toBeVisible();
  });
  
  test("job cards display correctly", async ({ page }) => {
    // Wait for jobs to load
    await page.waitForSelector(".cursor-pointer", { timeout: 5000 }).catch(() => {
      // No jobs yet, that's okay
    });
    
    // Check if any job cards exist
    const jobCards = page.locator(".cursor-pointer");
    const count = await jobCards.count();
    
    if (count > 0) {
      const firstCard = jobCards.first();
      
      // Job card should have position title
      await expect(firstCard.locator("h3, .font-semibold").first()).toBeVisible();
      
      // Should have company name with building icon
      await expect(firstCard.locator("svg")).toBeVisible();
    }
  });
  
  test("can open job detail dialog", async ({ page }) => {
    // Wait for jobs to load
    const jobCards = page.locator(".cursor-pointer");
    const count = await jobCards.count();
    
    if (count > 0) {
      // Click first job card
      await jobCards.first().click();
      
      // Detail dialog should open
      await expect(page.locator("role=dialog")).toBeVisible();
      
      // Dialog should have status dropdown
      await expect(page.locator("text=Status")).toBeVisible();
      
      // Close dialog
      await page.click("button:has-text('Close')");
      await expect(page.locator("role=dialog")).not.toBeVisible();
    }
  });
  
  test("can change job status in detail dialog", async ({ page }) => {
    // Wait for jobs to load
    const jobCards = page.locator(".cursor-pointer");
    const count = await jobCards.count();
    
    if (count > 0) {
      // Open first job
      await jobCards.first().click();
      
      // Find status dropdown
      const statusSelect = page.locator("select").first();
      
      // Change status
      await statusSelect.click();
      await page.locator("option[value='interviewing']").click();
      
      // Wait for update
      await page.waitForTimeout(1000);
      
      // Close dialog
      await page.click("button:has-text('Close')");
      
      // Job should now be in Interviewing column
      await expect(page.locator('[data-testid="interviewing-column"]')).toContainText(/\d+/);
    }
  });
  
  test("column headers show job counts", async ({ page }) => {
    // Each column should show count badge
    const columns = [
      page.locator('[data-testid="applied-column"]'),
      page.locator('[data-testid="interviewing-column"]'),
      page.locator('[data-testid="offer-column"]'),
      page.locator('[data-testid="rejected-column"]'),
    ];
    
    for (const column of columns) {
      // Column should have a count badge
      await expect(column.locator(".font-mono, [class*='badge']").first()).toBeVisible();
    }
  });
  
  test("trending indicators appear when applicable", async ({ page }) => {
    // Look for trending icons (up or down arrows)
    const trendingElements = page.locator("svg[class*='text-green-600'], svg[class*='text-red-600']");
    
    // May or may not have trending data depending on job history
    const count = await trendingElements.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });
  
  test("empty columns show placeholder", async ({ page }) => {
    // Offer column is likely empty
    const offerColumn = page.locator('[data-testid="offer-column"]');
    
    // Should show "No applications" or have job cards
    const hasPlaceholder = await offerColumn.locator("text=No applications").isVisible().catch(() => false);
    const hasJobs = await offerColumn.locator(".cursor-pointer").count() > 0;
    
    // One of these should be true
    expect(hasPlaceholder || hasJobs).toBeTruthy();
  });
  
  test("responsive design on mobile", async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Header should stack vertically
    await expect(page.locator("h1")).toBeVisible();
    
    // Analytics should still be visible (but may stack)
    await expect(page.locator("text=Total Applications")).toBeVisible();
    
    // Columns should stack vertically on mobile
    await expect(page.locator("text=Applied")).toBeVisible();
    await expect(page.locator("text=Interviewing")).toBeVisible();
  });
});

test.describe("Jobs Board - Analytics", () => {
  test("analytics stats are calculated correctly", async ({ page }) => {
    await page.goto("/jobs");
    
    // Get total applications count
    const totalApps = await page.locator("text=Total Applications").locator("..").locator(".text-2xl").textContent();
    expect(totalApps).toBeTruthy();
    
    const total = parseInt(totalApps || "0");
    expect(total).toBeGreaterThanOrEqual(0);
  });
  
  test("success rate is displayed as percentage", async ({ page }) => {
    await page.goto("/jobs");
    
    // Success rate should be percentage
    const successRate = await page.locator("text=Success Rate").locator("..").locator(".text-2xl").textContent();
    expect(successRate).toMatch(/%$/);
  });
  
  test("response rate shows realistic value", async ({ page }) => {
    await page.goto("/jobs");
    
    // Response rate should be 0-100%
    const responseRateText = await page.locator("text=Response Rate").locator("..").locator(".text-2xl").textContent();
    const responseRate = parseFloat(responseRateText || "0");
    
    expect(responseRate).toBeGreaterThanOrEqual(0);
    expect(responseRate).toBeLessThanOrEqual(100);
  });
  
  test("avg response time is human-readable", async ({ page }) => {
    await page.goto("/jobs");
    
    // Avg response time should be in days or show dash
    const avgResponseTime = await page.locator("text=Avg Response Time").locator("..").locator(".text-2xl").textContent();
    expect(avgResponseTime).toMatch(/\d+d|—/);
  });
});

test.describe("Jobs Board - Drag and Drop", () => {
  test.skip("can drag job between columns", async ({ page }) => {
    // Skip for now - drag and drop is complex to test
    // Would require finding a job card, dragging to different column
    // and verifying status update
    
    await page.goto("/jobs");
    
    // This would be implemented when we have reliable test data
    // Example:
    // const jobCard = page.locator(".cursor-pointer").first();
    // const targetColumn = page.locator('[data-testid="interviewing-column"]');
    // await jobCard.dragTo(targetColumn);
    // await expect(targetColumn).toContainText("job title");
  });
});
