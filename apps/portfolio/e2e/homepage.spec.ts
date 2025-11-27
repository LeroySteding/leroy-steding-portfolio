import { expect, test } from "@playwright/test";
import { checkA11y, injectAxe } from "axe-playwright";

test.describe("Homepage", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should have correct title", async ({ page }) => {
    await expect(page).toHaveTitle(/Leroy Steding/i);
  });

  test("should display hero section", async ({ page }) => {
    const hero = page.locator("section").first();
    await expect(hero).toBeVisible();
  });

  test("should have navigation menu", async ({ page }) => {
    const nav = page.locator("nav");
    await expect(nav).toBeVisible();
  });

  test("should have working navigation links", async ({ page }) => {
    const aboutLink = page.getByRole("link", { name: /about/i });
    if (await aboutLink.isVisible()) {
      await aboutLink.click();
      await expect(page).toHaveURL(/.*about.*/);
    }
  });

  test("should be responsive on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    const hero = page.locator("section").first();
    await expect(hero).toBeVisible();
  });

  test("should not have accessibility violations", async ({ page }) => {
    await injectAxe(page);
    await checkA11y(page, undefined, {
      axeOptions: {
        runOnly: {
          type: "tag",
          values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"],
        },
      },
      detailedReport: true,
    });
  });

  test("should have proper meta tags for SEO", async ({ page }) => {
    // Check for Open Graph tags
    const ogTitle = page.locator('meta[property="og:title"]');
    await expect(ogTitle).toHaveCount(1);

    const ogDescription = page.locator('meta[property="og:description"]');
    await expect(ogDescription).toHaveCount(1);
  });

  test("should load without console errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        errors.push(msg.text());
      }
    });

    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Filter out known third-party errors if any
    const criticalErrors = errors.filter(
      (error) => !error.includes("third-party-service"),
    );

    expect(criticalErrors).toHaveLength(0);
  });

  test("should have working theme toggle", async ({ page }) => {
    // Look for theme toggle button
    const themeToggle = page.getByRole("button", { name: /theme|dark|light/i });

    if (await themeToggle.isVisible()) {
      await themeToggle.click();

      // Check if theme changed (this depends on your implementation)
      const html = page.locator("html");
      const hasThemeClass = await html.evaluate(
        (el) => el.classList.contains("dark") || el.classList.contains("light"),
      );

      expect(hasThemeClass).toBeTruthy();
    }
  });
});
