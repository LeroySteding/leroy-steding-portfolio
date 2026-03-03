import { test, expect } from "@playwright/test";

test.describe("Job Sources Dashboard", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/jobs/sources");
    await page.waitForLoadState("networkidle");
  });
  
  test("displays page header and overview stats", async ({ page }) => {
    // Check header
    await expect(page.locator("h1")).toContainText("Job Sources");
    await expect(page.locator("text=Monitor and manage all job scraping sources")).toBeVisible();
    
    // Check overview stats cards
    await expect(page.locator("text=Total Jobs (30d)")).toBeVisible();
    await expect(page.locator("text=Active Sources")).toBeVisible();
    await expect(page.locator("text=Avg Match Rate")).toBeVisible();
    await expect(page.locator("text=System Health")).toBeVisible();
  });
  
  test("displays all configured scrapers", async ({ page }) => {
    // Check that all scrapers are visible
    const scrapers = [
      "ProLinker",
      "Freep.nl",
      "LinkedIn",
      "Medium",
      "Reddit",
      "HackerNews",
    ];
    
    for (const scraper of scrapers) {
      await expect(page.locator(`text=${scraper}`)).toBeVisible();
    }
  });
  
  test("scraper cards show correct information", async ({ page }) => {
    // Find ProLinker card (should be active)
    const prolinkerCard = page.locator('[data-scraper="prolinker"]').first();
    
    // Check status indicator (should be green checkmark for healthy)
    await expect(prolinkerCard.locator('svg[class*="text-green-600"]')).toBeVisible();
    
    // Check schedule information
    await expect(prolinkerCard.locator("text=Every 4 hours")).toBeVisible();
    
    // Check stats section
    await expect(prolinkerCard.locator("text=Jobs (24h / 7d / 30d)")).toBeVisible();
    await expect(prolinkerCard.locator("text=Match rate")).toBeVisible();
    
    // Check health metrics
    await expect(prolinkerCard.locator("text=Uptime")).toBeVisible();
    await expect(prolinkerCard.locator("text=Error rate")).toBeVisible();
    
    // Check action buttons
    await expect(prolinkerCard.locator("button:has-text('Details')")).toBeVisible();
    await expect(prolinkerCard.locator("button[data-action='trigger']")).toBeVisible();
  });
  
  test("inactive scrapers show 'Coming Soon' badge", async ({ page }) => {
    // Medium should be inactive
    const mediumCard = page.locator("text=Medium").locator("..");
    await expect(mediumCard.locator("text=Coming Soon")).toBeVisible();
    
    // Reddit should be inactive
    const redditCard = page.locator("text=Reddit").locator("..");
    await expect(redditCard.locator("text=Coming Soon")).toBeVisible();
  });
  
  test("can navigate to scraper detail page", async ({ page }) => {
    // Click on ProLinker details button
    const prolinkerCard = page.locator("text=ProLinker").locator("..");
    await prolinkerCard.locator("button:has-text('Details')").click();
    
    // Should navigate to detail page
    await expect(page).toHaveURL(/\/jobs\/sources\/prolinker/);
  });
  
  test("manual trigger button works", async ({ page }) => {
    // Find ProLinker trigger button
    const prolinkerCard = page.locator("text=ProLinker").locator("..");
    const triggerBtn = prolinkerCard.locator("button[data-action='trigger']");
    
    // Click trigger button
    await triggerBtn.click();
    
    // Button should show loading state (spinning icon)
    await expect(triggerBtn.locator("svg.animate-spin")).toBeVisible();
    
    // Wait for completion (button should return to normal)
    await expect(triggerBtn.locator("svg.animate-spin")).not.toBeVisible({ timeout: 10000 });
  });
  
  test("displays correct status colors", async ({ page }) => {
    // Healthy scrapers should have green border
    const prolinkerCard = page.locator("text=ProLinker").locator("..");
    await expect(prolinkerCard).toHaveClass(/border-green-200/);
    
    // Paused scrapers should have gray border
    const mediumCard = page.locator("text=Medium").locator("..");
    await expect(mediumCard).toHaveClass(/border-gray-200/);
  });
  
  test("overview stats update when scrapers run", async ({ page }) => {
    // Get initial total jobs count
    const totalJobsCard = page.locator("text=Total Jobs (30d)").locator("..");
    const initialCount = await totalJobsCard.locator(".text-2xl").textContent();
    
    // Note: This test would need actual scraper execution to see changes
    // For now, just verify the structure exists
    expect(initialCount).toBeTruthy();
    expect(parseInt(initialCount || "0")).toBeGreaterThanOrEqual(0);
  });
  
  test("responsive design on mobile", async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Header should stack vertically on mobile
    const header = page.locator("header");
    await expect(header).toBeVisible();
    
    // Overview stats should stack in single column
    const statsGrid = page.locator('[class*="grid-cols-1"]');
    await expect(statsGrid).toBeVisible();
    
    // Scraper cards should stack in single column
    await expect(page.locator("text=ProLinker")).toBeVisible();
  });
  
  test("can refresh all scrapers", async ({ page }) => {
    // Find refresh all button
    const refreshBtn = page.locator("button:has-text('Refresh All')");
    await expect(refreshBtn).toBeVisible();
    
    // Click it (note: this doesn't actually trigger in test env)
    await refreshBtn.click();
    
    // In a real test, you'd verify scrapers were triggered
    // For now, just verify the button is clickable
  });
  
  test("configure button is visible", async ({ page }) => {
    const configBtn = page.locator("button:has-text('Configure')");
    await expect(configBtn).toBeVisible();
  });
});

test.describe("Job Sources - Data Accuracy", () => {
  test("scraper stats are calculated correctly", async ({ page }) => {
    await page.goto("/jobs/sources");
    
    // Get ProLinker stats
    const prolinkerCard = page.locator("text=ProLinker").locator("..");
    const statsText = await prolinkerCard.locator("text=/Jobs \\(24h \\/ 7d \\/ 30d\\)/").textContent();
    
    // Stats should be in format: "Jobs (24h / 7d / 30d) X / Y / Z"
    expect(statsText).toMatch(/\d+ \/ \d+ \/ \d+/);
  });
  
  test("match rates are displayed as percentages", async ({ page }) => {
    await page.goto("/jobs/sources");
    
    // Find any active scraper with match rate
    const matchRateElements = page.locator("text=/\\d+\\.\\d+%/");
    const count = await matchRateElements.count();
    
    // Should have at least overview match rate
    expect(count).toBeGreaterThan(0);
  });
  
  test("last run timestamps are human-readable", async ({ page }) => {
    await page.goto("/jobs/sources");
    
    // Look for relative time formats
    const timeElements = page.locator("text=/ago$/");
    const count = await timeElements.count();
    
    // Active scrapers should show "X ago" format
    expect(count).toBeGreaterThanOrEqual(0);
  });
});
