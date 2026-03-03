#!/usr/bin/env node
/**
 * Freep.nl Scraper - Working Version
 * 
 * Scrapes Dutch government contract jobs from freep.nl
 * Uses Puppeteer to handle React hydration
 */

import puppeteer from "puppeteer";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../convex/_generated/api.js";

const CONVEX_URL = process.env.CONVEX_URL || process.env.NEXT_PUBLIC_CONVEX_URL;

if (!CONVEX_URL) {
  console.error("❌ CONVEX_URL not set");
  process.exit(1);
}

const client = new ConvexHttpClient(CONVEX_URL);

interface FreepJob {
  title: string;
  company: string;
  location: string;
  url: string;
  description: string;
  budget?: string;
  duration?: string;
  startDate?: string;
  postedDate?: string;
  isGovernment: boolean;
}

async function scrapeFreep(): Promise<FreepJob[]> {
  console.log("🏛️  Starting Freep scraper...");
  
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    
    console.log("📡 Loading freep.nl...");
    await page.goto("https://www.freep.nl/opdrachten", {
      waitUntil: "networkidle2",
      timeout: 30000,
    });
    
    // Wait for jobs to load
    console.log("⏳ Waiting for jobs to render...");
    await page.waitForSelector('[class*="opdracht"]', { timeout: 10000 })
      .catch(() => console.log("⚠️  No jobs selector found, trying alternative..."));
    
    // Extract jobs using page.evaluate
    const jobs = await page.evaluate(() => {
      const jobElements = document.querySelectorAll('a[href*="/opdracht/"]');
      const jobs: any[] = [];
      
      jobElements.forEach((el) => {
        try {
          const link = el as HTMLAnchorElement;
          const url = link.href;
          
          // Get title
          const titleEl = el.querySelector('h2, h3, [class*="title"]');
          const title = titleEl?.textContent?.trim() || '';
          
          if (!title) return;
          
          // Get company
          const companyEl = el.querySelector('[class*="company"], [class*="bedrijf"]');
          const company = companyEl?.textContent?.trim() || 'Unknown';
          
          // Get location
          const locationEl = el.querySelector('[class*="location"], [class*="plaats"]');
          const location = locationEl?.textContent?.trim() || 'Netherlands';
          
          // Get description
          const descEl = el.querySelector('[class*="description"], p');
          const description = descEl?.textContent?.trim() || title;
          
          // Check if government
          const isGovernment = 
            title.toLowerCase().includes('gemeente') ||
            title.toLowerCase().includes('provincie') ||
            title.toLowerCase().includes('ministerie') ||
            title.toLowerCase().includes('rijks') ||
            company.toLowerCase().includes('gemeente') ||
            company.toLowerCase().includes('overheid');
          
          jobs.push({
            title,
            company,
            location,
            url,
            description,
            isGovernment,
          });
        } catch (err) {
          console.error('Error parsing job:', err);
        }
      });
      
      return jobs;
    });
    
    console.log(`✅ Found ${jobs.length} jobs`);
    console.log(`🏛️  Government contracts: ${jobs.filter(j => j.isGovernment).length}`);
    
    return jobs;
    
  } finally {
    await browser.close();
  }
}

async function storeJobs(jobs: FreepJob[]) {
  console.log("\n💾 Storing jobs in Convex...");
  
  let stored = 0;
  let skipped = 0;
  
  for (const job of jobs) {
    try {
      await client.mutation(api.freep_scraper.storeJob, {
        title: job.title,
        company: job.company,
        location: job.location,
        url: job.url,
        description: job.description,
        budget: job.budget,
        duration: job.duration,
        startDate: job.startDate,
        postedDate: job.postedDate,
        isGovernment: job.isGovernment,
      });
      stored++;
    } catch (error) {
      console.error(`Error storing job "${job.title}":`, error);
      skipped++;
    }
  }
  
  console.log(`✅ Stored: ${stored}`);
  console.log(`⏭️  Skipped: ${skipped}`);
  
  return { stored, skipped };
}

async function main() {
  const startTime = Date.now();
  
  try {
    const jobs = await scrapeFreep();
    
    if (jobs.length === 0) {
      console.log("⚠️  No jobs found");
      return;
    }
    
    const { stored } = await storeJobs(jobs);
    
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    
    console.log("\n" + "=".repeat(60));
    console.log(`⏱️  Duration: ${duration}s`);
    console.log(`🔍 Jobs found: ${jobs.length}`);
    console.log(`🏛️  Government: ${jobs.filter(j => j.isGovernment).length}`);
    console.log(`💾 Saved: ${stored} new`);
    console.log("=".repeat(60) + "\n");
    
  } catch (error) {
    console.error("❌ Scraper failed:", error);
    process.exit(1);
  }
}

main();
