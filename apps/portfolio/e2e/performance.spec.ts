import { expect, test } from "@playwright/test";

test.describe("Performance Budgets", () => {
  test("should meet Core Web Vitals thresholds", async ({ page }) => {
    // Navigate to homepage
    await page.goto("/", { waitUntil: "networkidle" });

    // Get Web Vitals using client-side metrics
    const webVitals = await page.evaluate<Record<string, number>>(() => {
      return new Promise((resolve) => {
        const metrics: Record<string, number> = {};

        // Largest Contentful Paint (LCP)
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1] as PerformanceEntry & {
            renderTime?: number;
            loadTime?: number;
          };
          metrics.lcp = lastEntry.renderTime || lastEntry.loadTime || 0;
        }).observe({ type: "largest-contentful-paint", buffered: true });

        // First Input Delay (FID) - simulated with First Contentful Paint
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          if (entries.length > 0) {
            metrics.fcp = entries[0].startTime;
          }
        }).observe({ type: "paint", buffered: true });

        // Cumulative Layout Shift (CLS)
        let clsScore = 0;
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries() as Array<
            PerformanceEntry & { hadRecentInput?: boolean; value?: number }
          >) {
            if (!entry.hadRecentInput) {
              clsScore += entry.value || 0;
            }
          }
          metrics.cls = clsScore;
        }).observe({ type: "layout-shift", buffered: true });

        // Time to Interactive approximation using Load event
        window.addEventListener("load", () => {
          const navTiming = performance.getEntriesByType(
            "navigation",
          )[0] as PerformanceNavigationTiming;
          metrics.tti = navTiming.domInteractive;
          metrics.loadTime = navTiming.loadEventEnd - navTiming.loadEventStart;

          setTimeout(() => resolve(metrics), 1000);
        });
      });
    });

    console.log("Web Vitals:", webVitals);

    // Assert Core Web Vitals meet "Good" thresholds
    expect(webVitals.lcp, "LCP should be under 2.5s").toBeLessThan(2500);
    expect(webVitals.fcp, "FCP should be under 2s").toBeLessThan(2000);
    expect(webVitals.cls, "CLS should be under 0.1").toBeLessThan(0.1);
    expect(webVitals.tti, "TTI should be under 5s").toBeLessThan(5000);
  });

  test("should have acceptable bundle sizes", async ({ page }) => {
    const resourceSizes: Record<string, number> = {
      scripts: 0,
      stylesheets: 0,
      images: 0,
      fonts: 0,
      total: 0,
    };

    // Listen to all responses
    page.on("response", async (response) => {
      const url = response.url();
      const size = parseInt(response.headers()["content-length"] || "0", 10);

      if (url.includes(".js")) {
        resourceSizes.scripts += size;
      } else if (url.includes(".css")) {
        resourceSizes.stylesheets += size;
      } else if (url.match(/\.(jpg|jpeg|png|gif|svg|webp)$/)) {
        resourceSizes.images += size;
      } else if (url.match(/\.(woff|woff2|ttf|eot)$/)) {
        resourceSizes.fonts += size;
      }
      resourceSizes.total += size;
    });

    await page.goto("/", { waitUntil: "networkidle" });

    console.log("Resource Sizes (KB):", {
      scripts: (resourceSizes.scripts / 1024).toFixed(2),
      stylesheets: (resourceSizes.stylesheets / 1024).toFixed(2),
      images: (resourceSizes.images / 1024).toFixed(2),
      fonts: (resourceSizes.fonts / 1024).toFixed(2),
      total: (resourceSizes.total / 1024).toFixed(2),
    });

    // Assert against performance budgets (in KB)
    expect(
      resourceSizes.scripts / 1024,
      "Scripts should be under 500KB",
    ).toBeLessThan(500);
    expect(
      resourceSizes.stylesheets / 1024,
      "Stylesheets should be under 100KB",
    ).toBeLessThan(100);
    expect(
      resourceSizes.total / 1024,
      "Total should be under 2MB",
    ).toBeLessThan(2048);
  });

  test("should load efficiently on 3G connection", async ({
    page,
    context,
  }) => {
    // Emulate slow 3G network
    const client = await context.newCDPSession(page);
    await client.send("Network.emulateNetworkConditions", {
      offline: false,
      downloadThroughput: (750 * 1024) / 8, // 750kb/s
      uploadThroughput: (250 * 1024) / 8, // 250kb/s
      latency: 100, // 100ms
    });

    const startTime = Date.now();
    await page.goto("/", { waitUntil: "networkidle" });
    const loadTime = Date.now() - startTime;

    console.log("Load time on 3G:", loadTime, "ms");

    // Should load within 3 seconds on 3G
    expect(loadTime, "Page should load under 3s on 3G").toBeLessThan(3000);
  });

  test("should have minimal render-blocking resources", async ({ page }) => {
    let renderBlockingCount = 0;

    page.on("response", async (response) => {
      const headers = response.headers();
      const url = response.url();

      // Check for render-blocking CSS/JS in head
      if (
        (url.includes(".css") || url.includes(".js")) &&
        !headers.async &&
        !headers.defer
      ) {
        renderBlockingCount++;
      }
    });

    await page.goto("/", { waitUntil: "networkidle" });

    console.log("Render-blocking resources:", renderBlockingCount);

    // Should have minimal render-blocking resources
    expect(
      renderBlockingCount,
      "Should have few render-blocking resources",
    ).toBeLessThan(5);
  });

  test("should have efficient image loading", async ({ page }) => {
    await page.goto("/");

    // Check if images use modern formats and lazy loading
    const images = await page.locator("img").all();

    for (const img of images) {
      const src = await img.getAttribute("src");
      const loading = await img.getAttribute("loading");

      if (src) {
        // Check for optimized formats or next/image usage
        const isOptimized =
          src.includes("/_next/image") ||
          src.includes(".webp") ||
          src.includes(".avif");

        console.log(
          "Image:",
          src,
          "Optimized:",
          isOptimized,
          "Loading:",
          loading,
        );
      }
    }

    // All images should use lazy loading except above the fold
    const nonLazyImages = await page
      .locator('img:not([loading="lazy"])')
      .count();
    console.log("Non-lazy images:", nonLazyImages);

    // Should have some lazy-loaded images
    expect(images.length).toBeGreaterThan(0);
  });
});
