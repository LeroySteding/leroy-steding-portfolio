#!/usr/bin/env tsx
import puppeteer from "puppeteer";
import * as fs from "fs";

async function debugNuxt() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  
  await page.goto("https://www.freep.nl/opdrachten", {
    waitUntil: "networkidle2",
  });

  await new Promise(resolve => setTimeout(resolve, 3000));

  // Extract __NUXT__ data
  const nuxtData = await page.evaluate(() => {
    return (window as any).__NUXT__;
  });

  // Save to JSON file
  fs.writeFileSync(
    "freep-nuxt-data.json",
    JSON.stringify(nuxtData, null, 2)
  );

  console.log("✅ Saved __NUXT__ data to freep-nuxt-data.json");
  console.log("\n📦 Data structure:");
  console.log("Keys at root:", Object.keys(nuxtData || {}));
  
  if (nuxtData?.data) {
    console.log("Keys in data:", Object.keys(nuxtData.data));
  }

  await browser.close();
}

debugNuxt().catch(console.error);
