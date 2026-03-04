#!/usr/bin/env tsx
/**
 * Adzuna Netherlands Job Fetcher
 * 
 * Fetches job listings from Adzuna API (Netherlands).
 * Free tier: 250 calls/month
 * 
 * API Docs: https://developer.adzuna.com/docs
 * Get API key: https://developer.adzuna.com/signup
 */

import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../convex/_generated/api";

const convex = new ConvexHttpClient(process.env.CONVEX_URL!);

interface AdzunaJob {
  id: string;
  title: string;
  company: {
    display_name: string;
  };
  location: {
    display_name: string;
  };
  description: string;
  salary_min?: number;
  salary_max?: number;
  redirect_url: string;
  created: string;
  contract_type?: string;
  category: {
    label: string;
  };
}

async function fetchAdzunaJobs(): Promise<void> {
  console.log("🚀 Fetching jobs from Adzuna Netherlands API...");

  const APP_ID = process.env.ADZUNA_APP_ID;
  const APP_KEY = process.env.ADZUNA_APP_KEY;

  if (!APP_ID || !APP_KEY) {
    console.error("❌ Missing Adzuna credentials. Set ADZUNA_APP_ID and ADZUNA_APP_KEY");
    console.log("💡 Get free API keys: https://developer.adzuna.com/signup");
    process.exit(1);
  }

  try {
    // Search for fullstack/React/TypeScript jobs in Netherlands
    const queries = [
      "fullstack developer",
      "react developer",
      "typescript developer",
      "frontend developer react",
      "backend developer node",
    ];

    let totalJobs = 0;
    let savedJobs = 0;

    for (const query of queries) {
      console.log(`\n🔍 Searching: "${query}"...`);

      const url = new URL(`https://api.adzuna.com/v1/api/jobs/nl/search/1`);
      url.searchParams.set("app_id", APP_ID);
      url.searchParams.set("app_key", APP_KEY);
      url.searchParams.set("what", query);
      url.searchParams.set("results_per_page", "10");
      url.searchParams.set("sort_by", "date");

      const response = await fetch(url.toString());

      if (!response.ok) {
        console.error(`❌ HTTP ${response.status}: ${response.statusText}`);
        continue;
      }

      const data = await response.json();
      const jobs: AdzunaJob[] = data.results || [];

      console.log(`✅ Found ${jobs.length} jobs for "${query}"`);
      totalJobs += jobs.length;

      // Save to Convex
      for (const job of jobs) {
        const scrapedJob = {
          title: job.title,
          company: job.company.display_name,
          location: job.location.display_name,
          description: job.description,
          salary: job.salary_min && job.salary_max 
            ? `€${job.salary_min}-€${job.salary_max}`
            : undefined,
          url: job.redirect_url,
          technologies: extractTechnologies(job.title + " " + job.description),
          postedAt: new Date(job.created).getTime(),
          source: "adzuna_nl",
          remote: job.location.display_name.toLowerCase().includes("remote") ||
                  job.description.toLowerCase().includes("remote"),
          employmentType: job.contract_type,
        };

        try {
          await convex.mutation(api.scraped_jobs.pushBatch, {
            jobs: [scrapedJob],
          });
          savedJobs++;
        } catch (error) {
          console.error(`❌ Error saving job ${job.id}:`, error);
        }
      }

      // Rate limiting (250 calls/month = ~8/day)
      await sleep(1000);
    }

    console.log(`\n✅ Total: ${totalJobs} jobs found, ${savedJobs} saved to Convex`);

    // Log to analytics
    await convex.mutation(api.analytics_log.push, {
      event: "adzuna_fetch_completed",
      agent: "fetcher",
      metadata: { jobsTotal: totalJobs, jobsSaved: savedJobs },
    });

  } catch (error) {
    console.error("❌ Failed to fetch Adzuna jobs:", error);
    throw error;
  }
}

function extractTechnologies(text: string): string[] {
  const techKeywords = [
    "JavaScript", "TypeScript", "Python", "Java", "C#", "React", "Vue", "Angular",
    "Next.js", "Node.js", "Express", "Django", "Flask", "PostgreSQL", "MongoDB",
    "Docker", "Kubernetes", "AWS", "Azure", "GCP"
  ];

  const found = new Set<string>();
  const lowerText = text.toLowerCase();

  techKeywords.forEach((tech) => {
    if (lowerText.includes(tech.toLowerCase())) {
      found.add(tech);
    }
  });

  return Array.from(found);
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Run
if (require.main === module) {
  fetchAdzunaJobs()
    .then(() => {
      console.log("✅ Adzuna fetch complete!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Adzuna fetch failed:", error);
      process.exit(1);
    });
}

export { fetchAdzunaJobs };
