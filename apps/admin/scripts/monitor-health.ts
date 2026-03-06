#!/usr/bin/env tsx
/**
 * Health Monitor - Autonomous Error Detection
 * 
 * Monitors:
 * - Job fetch success (0 jobs = alert)
 * - Recent scraping activity
 * - Critical errors in logs
 * - System anomalies
 * 
 * Run via cron every hour to catch issues early.
 */

import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../convex/_generated/api";

const convex = new ConvexHttpClient(process.env.CONVEX_URL!);

interface HealthCheck {
  name: string;
  status: "ok" | "warning" | "critical";
  message: string;
  details?: any;
}

async function checkJobFetchHealth(): Promise<HealthCheck> {
  const twentyFourHoursAgo = Date.now() - 24 * 60 * 60 * 1000;
  
  try {
    // Get jobs scraped in last 24 hours
    const recentJobs = await convex.query(api.scraped_jobs.list, {
      limit: 100,
    });
    
    const jobsLast24h = recentJobs.filter(
      (job: any) => job.scrapedAt && job.scrapedAt >= twentyFourHoursAgo
    );
    
    if (jobsLast24h.length === 0) {
      return {
        name: "Job Fetch",
        status: "critical",
        message: `❌ CRITICAL: 0 jobs fetched in last 24 hours`,
        details: { totalJobs: recentJobs.length, last24h: 0 },
      };
    }
    
    if (jobsLast24h.length < 5) {
      return {
        name: "Job Fetch",
        status: "warning",
        message: `⚠️  WARNING: Only ${jobsLast24h.length} jobs fetched in last 24h (expected 10+)`,
        details: { totalJobs: recentJobs.length, last24h: jobsLast24h.length },
      };
    }
    
    return {
      name: "Job Fetch",
      status: "ok",
      message: `✅ ${jobsLast24h.length} jobs fetched in last 24h`,
      details: { totalJobs: recentJobs.length, last24h: jobsLast24h.length },
    };
  } catch (error: any) {
    return {
      name: "Job Fetch",
      status: "critical",
      message: `❌ CRITICAL: Failed to query jobs`,
      details: { error: error.message },
    };
  }
}

async function checkJobMatchingHealth(): Promise<HealthCheck> {
  try {
    // Generate digest using optimized v2 algorithm (uses pre-computed scores)
    const digest = await convex.query(api.job_matching_v2.generateDailyDigestV2, {
      userId: "leroy",
      minScore: 50,
      limit: 10,
      hoursBack: 24,
    });
    
    if (!digest || !digest.jobs || digest.jobs.length === 0) {
      return {
        name: "Job Matching",
        status: "warning",
        message: `⚠️  WARNING: No job matches found (score >= 50)`,
        details: { 
          matchCount: 0,
          totalScraped: digest?.totalScraped || 0,
          message: digest?.message || "No digest generated"
        },
      };
    }
    
    return {
      name: "Job Matching",
      status: "ok",
      message: `✅ ${digest.jobs.length} job matches (score >= 50)`,
      details: { 
        matchCount: digest.jobs.length,
        topScore: digest.jobs[0]?.matchScore || digest.jobs[0]?.metadata?.matchScore || 0,
        totalScraped: digest.totalScraped,
        message: digest.message
      },
    };
  } catch (error: any) {
    return {
      name: "Job Matching",
      status: "critical",
      message: `❌ CRITICAL: Job matching query failed`,
      details: { error: error.message },
    };
  }
}

async function checkConvexHealth(): Promise<HealthCheck> {
  try {
    // Simple ping to verify Convex is reachable
    await convex.query(api.analytics_log.list, { limit: 1 });
    
    return {
      name: "Convex Database",
      status: "ok",
      message: `✅ Convex connection healthy`,
    };
  } catch (error: any) {
    return {
      name: "Convex Database",
      status: "critical",
      message: `❌ CRITICAL: Cannot connect to Convex`,
      details: { error: error.message },
    };
  }
}

async function runHealthChecks(): Promise<void> {
  console.log("🏥 Running Health Checks...\n");
  
  const checks: HealthCheck[] = await Promise.all([
    checkConvexHealth(),
    checkJobFetchHealth(),
    checkJobMatchingHealth(),
  ]);
  
  const criticalIssues = checks.filter((c) => c.status === "critical");
  const warnings = checks.filter((c) => c.status === "warning");
  const healthy = checks.filter((c) => c.status === "ok");
  
  // Print results
  console.log("📊 Health Check Results:\n");
  
  checks.forEach((check) => {
    console.log(`${check.message}`);
    if (check.details) {
      console.log(`   Details: ${JSON.stringify(check.details)}`);
    }
  });
  
  console.log(`\n📈 Summary:`);
  console.log(`   ✅ Healthy: ${healthy.length}`);
  console.log(`   ⚠️  Warnings: ${warnings.length}`);
  console.log(`   ❌ Critical: ${criticalIssues.length}`);
  
  // Log to Convex
  const status = criticalIssues.length > 0 
    ? "critical" 
    : warnings.length > 0 
    ? "warning" 
    : "healthy";
  
  await convex.mutation(api.analytics_log.push, {
    event: "health_check_completed",
    agent: "monitor",
    metadata: {
      status,
      healthyCount: healthy.length,
      warningCount: warnings.length,
      criticalCount: criticalIssues.length,
      checks: checks.map((c) => ({
        name: c.name,
        status: c.status,
        message: c.message,
      })),
    },
  });
  
  // Exit with error code if critical issues found
  if (criticalIssues.length > 0) {
    console.log(`\n🚨 CRITICAL ISSUES DETECTED - Alerting required!`);
    process.exit(1);
  }
  
  if (warnings.length > 0) {
    console.log(`\n⚠️  WARNINGS DETECTED - Monitor closely`);
  }
  
  console.log(`\n✅ Health check complete`);
}

// Run
if (require.main === module) {
  runHealthChecks()
    .then(() => {
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Health check failed:", error);
      process.exit(1);
    });
}

export { runHealthChecks };
