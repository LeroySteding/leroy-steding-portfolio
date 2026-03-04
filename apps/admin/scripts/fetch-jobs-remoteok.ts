#!/usr/bin/env tsx
/**
 * RemoteOK Jobs Fetcher
 * 
 * Fetches remote job listings from RemoteOK's public JSON API.
 * No scraping needed - clean, reliable API.
 * 
 * API: https://remoteok.com/api
 * Docs: https://github.com/remoteintech/remote-jobs
 */

import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../convex/_generated/api";

const convex = new ConvexHttpClient(process.env.CONVEX_URL!);

interface RemoteOKJob {
  id: string;
  position: string;
  company: string;
  company_logo?: string;
  location: string;
  tags: string[];
  description: string;
  url: string;
  date: string;
  salary_min?: number;
  salary_max?: number;
}

async function fetchRemoteOKJobs(): Promise<void> {
  console.log("🚀 Fetching jobs from RemoteOK API...");

  try {
    const response = await fetch("https://remoteok.com/api", {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; JobBot/1.0)",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    
    // First item is metadata, skip it
    const jobs: RemoteOKJob[] = data.slice(1);
    
    console.log(`✅ Fetched ${jobs.length} jobs from RemoteOK`);

    // Filter for relevant jobs (fullstack, React, TypeScript, etc.)
    const relevantJobs = jobs.filter((job) => {
      const tags = job.tags.map(t => t.toLowerCase());
      const position = job.position.toLowerCase();
      
      return (
        tags.includes("react") ||
        tags.includes("typescript") ||
        tags.includes("nextjs") ||
        tags.includes("fullstack") ||
        tags.includes("full-stack") ||
        position.includes("full stack") ||
        position.includes("fullstack") ||
        position.includes("react") ||
        position.includes("typescript")
      );
    });

    console.log(`📊 Found ${relevantJobs.length} relevant jobs`);

    let saved = 0;

    for (const job of relevantJobs) {
      const scrapedJob = {
        title: job.position,
        company: job.company,
        location: job.location || "Remote",
        description: job.description || job.position,
        salary: job.salary_min && job.salary_max 
          ? `$${job.salary_min}-${job.salary_max}`
          : undefined,
        url: job.url,
        technologies: job.tags,
        postedAt: new Date(job.date).getTime(),
        source: "remoteok",
        remote: true, // RemoteOK is all remote jobs
      };

      try {
        await convex.mutation(api.scraped_jobs.pushBatch, {
          jobs: [scrapedJob],
        });
        saved++;
      } catch (error) {
        console.error(`❌ Error saving job ${job.id}:`, error);
      }
    }

    console.log(`\n✅ Saved ${saved} jobs to Convex`);

    // Log to analytics
    await convex.mutation(api.analytics_log.push, {
      event: "remoteok_fetch_completed",
      agent: "fetcher",
      metadata: { jobsTotal: jobs.length, jobsRelevant: relevantJobs.length, jobsSaved: saved },
    });

  } catch (error) {
    console.error("❌ Failed to fetch RemoteOK jobs:", error);
    throw error;
  }
}

// Run
if (require.main === module) {
  fetchRemoteOKJobs()
    .then(() => {
      console.log("✅ RemoteOK fetch complete!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ RemoteOK fetch failed:", error);
      process.exit(1);
    });
}

export { fetchRemoteOKJobs };
