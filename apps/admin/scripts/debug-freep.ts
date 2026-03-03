#!/usr/bin/env tsx
/**
 * Debug script to inspect Freep.nl page structure
 */

import puppeteer from "puppeteer";
import * as fs from "fs";
import * as path from "path";

async function debugFreep() {
  console.log("🔍 Starting Freep.nl debug session...");
  
  const browser = await puppeteer.launch({
    headless: false, // Show the browser
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  
  await page.setUserAgent(
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
  );

  console.log("📍 Loading https://www.freep.nl/opdrachten ...");
  
  await page.goto("https://www.freep.nl/opdrachten", {
    waitUntil: "networkidle2",
    timeout: 30000,
  });

  console.log("✅ Page loaded, waiting 3 seconds for dynamic content...");
  await new Promise(resolve => setTimeout(resolve, 3000));

  // Take screenshot
  const screenshotPath = path.join(process.cwd(), "freep-debug-screenshot.png");
  await page.screenshot({ path: screenshotPath, fullPage: true });
  console.log(`📸 Screenshot saved to: ${screenshotPath}`);

  // Get page HTML
  const html = await page.content();
  const htmlPath = path.join(process.cwd(), "freep-debug.html");
  fs.writeFileSync(htmlPath, html);
  console.log(`📄 HTML saved to: ${htmlPath}`);

  // Try to find common patterns
  console.log("\n🔍 Looking for common patterns...\n");

  const patterns = [
    { name: "Articles", selector: "article" },
    { name: "List items", selector: "li" },
    { name: "Cards", selector: "[class*='card']" },
    { name: "Jobs", selector: "[class*='job']" },
    { name: "Opdrachten", selector: "[class*='opdracht']" },
    { name: "Vacancies", selector: "[class*='vacanc']" },
    { name: "Listings", selector: "[class*='listing']" },
    { name: "Items", selector: "[class*='item']" },
  ];

  for (const pattern of patterns) {
    const elements = await page.$$(pattern.selector);
    console.log(`${pattern.name} (${pattern.selector}): ${elements.length} found`);
    
    if (elements.length > 0 && elements.length < 50) {
      // Sample first element's HTML
      try {
        const firstHTML = await page.evaluate((el) => el.outerHTML, elements[0]);
        console.log(`  Sample HTML (first 500 chars):`);
        console.log(`  ${firstHTML.substring(0, 500)}...\n`);
      } catch (e) {
        console.log(`  Could not extract sample HTML\n`);
      }
    }
  }

  // Check for React/Vue root elements
  const reactRoot = await page.$("[id*='react'], [id*='app'], [id*='root']");
  if (reactRoot) {
    const id = await page.evaluate((el) => el.id, reactRoot);
    console.log(`\n⚛️  Found React/SPA root: #${id}`);
  }

  // List all unique class names that might be relevant
  const uniqueClasses = await page.evaluate(() => {
    const classes = new Set<string>();
    document.querySelectorAll("[class]").forEach((el) => {
      el.className.split(" ").forEach((c) => {
        if (c && (
          c.includes("job") || 
          c.includes("opdracht") || 
          c.includes("card") || 
          c.includes("item") ||
          c.includes("list") ||
          c.includes("vacanc")
        )) {
          classes.add(c);
        }
      });
    });
    return Array.from(classes);
  });

  console.log("\n📋 Relevant class names found:");
  uniqueClasses.forEach((c) => console.log(`  - ${c}`));

  console.log("\n⏸️  Browser will stay open for 10 seconds for manual inspection...");
  await new Promise(resolve => setTimeout(resolve, 10000));

  await browser.close();
  console.log("✅ Debug session complete");
}

debugFreep()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Debug failed:", error);
    process.exit(1);
  });
