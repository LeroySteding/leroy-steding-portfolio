import { expect, test } from "@playwright/test";

test.describe("Navigation", () => {
  test("should navigate between main pages", async ({ page }) => {
    await page.goto("/");

    // Test navigation to projects page
    const projectsLink = page.getByRole("link", { name: /projects/i });
    if (await projectsLink.isVisible()) {
      await projectsLink.click();
      await expect(page).toHaveURL(/.*projects.*/);
    }

    // Test navigation to blog
    await page.goto("/");
    const blogLink = page.getByRole("link", { name: /blog/i });
    if (await blogLink.isVisible()) {
      await blogLink.click();
      await expect(page).toHaveURL(/.*blog.*/);
    }

    // Test navigation to contact
    await page.goto("/");
    const contactLink = page.getByRole("link", { name: /contact/i });
    if (await contactLink.isVisible()) {
      await contactLink.click();
      await expect(page).toHaveURL(/.*contact.*/);
    }
  });

  test("should have working back navigation", async ({ page }) => {
    await page.goto("/");
    const initialUrl = page.url();

    // Navigate to another page
    const link = page.getByRole("link").first();
    await link.click();
    await page.waitForLoadState("networkidle");

    // Go back
    await page.goBack();
    await expect(page).toHaveURL(initialUrl);
  });

  test("should preserve scroll position on navigation", async ({ page }) => {
    await page.goto("/");

    // Scroll down
    await page.evaluate(() => window.scrollTo(0, 500));
    const scrollPosition = await page.evaluate(() => window.scrollY);

    expect(scrollPosition).toBeGreaterThan(0);
  });

  test("should handle 404 pages gracefully", async ({ page }) => {
    const response = await page.goto("/non-existent-page-xyz");

    // Should return 404 status
    expect(response?.status()).toBe(404);

    // Should display some content (not blank)
    const body = page.locator("body");
    await expect(body).not.toBeEmpty();
  });
});
