#!/usr/bin/env tsx
/**
 * ProLinker Daily Job Digest
 * 
 * Generates and sends daily digest of top matched jobs via Telegram.
 * Uses Convex job matching API to score and rank jobs.
 */

import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../convex/_generated/api";
import { execSync } from "child_process";

const CONVEX_URL = process.env.CONVEX_URL || process.env.NEXT_PUBLIC_CONVEX_URL;
const MIN_SCORE = 70;
const MAX_JOBS = 10;

if (!CONVEX_URL) {
  console.error("❌ CONVEX_URL not set in environment");
  process.exit(1);
}

const client = new ConvexHttpClient(CONVEX_URL);

/**
 * Format job for Telegram message
 */
function formatJob(job: any, index: number): string {
  const score = Math.round(job.matchScore);
  
  let msg = `\n${index}. **${job.title}** at ${job.company}\n`;
  msg += `   📊 Score: ${score}/100`;
  
  // Score breakdown
  const breakdown: string[] = [];
  if (job.techStackScore > 5) breakdown.push(`Tech ${Math.round(job.techStackScore)}`);
  if (job.locationScore > 5) breakdown.push(`Location ${Math.round(job.locationScore)}`);
  if (job.salaryScore > 5) breakdown.push(`Salary ${Math.round(job.salaryScore)}`);
  if (job.companyScore > 5) breakdown.push(`Company ${Math.round(job.companyScore)}`);
  if (job.keywordScore > 5) breakdown.push(`Keywords ${Math.round(job.keywordScore)}`);
  
  if (breakdown.length > 0) {
    msg += ` (${breakdown.join(", ")})`;
  }
  msg += `\n`;
  
  if (job.location) msg += `   📍 ${job.location}`;
  if (job.remote) msg += ` [Remote]`;
  msg += `\n`;
  
  if (job.salary) msg += `   💰 ${job.salary}\n`;
  
  if (job.matchDetails?.matchedTechnologies?.length > 0) {
    const techs = job.matchDetails.matchedTechnologies.slice(0, 5);
    msg += `   💻 ${techs.join(", ")}`;
    if (job.matchDetails.matchedTechnologies.length > 5) {
      msg += ` +${job.matchDetails.matchedTechnologies.length - 5} more`;
    }
    msg += `\n`;
  }
  
  if (job.url) msg += `   🔗 ${job.url}\n`;
  
  return msg;
}

/**
 * Send digest via OpenClaw Telegram
 */
function sendTelegram(message: string): void {
  try {
    // Escape special characters for shell
    const escapedMessage = message
      .replace(/\\/g, '\\\\')
      .replace(/"/g, '\\"')
      .replace(/\$/g, '\\$')
      .replace(/`/g, '\\`');
    
    execSync(
      `openclaw message send --action send --channel telegram --target leroy --message "${escapedMessage}"`,
      { stdio: "inherit" }
    );
  } catch (error) {
    console.error("❌ Failed to send Telegram message");
    console.error(error);
    // Print message to console as fallback
    console.log("\n📬 Digest (not sent):\n");
    console.log(message);
  }
}

/**
 * Main execution
 */
async function main() {
  try {
    console.log("🔍 ProLinker Daily Digest - Starting...");
    console.log(`⏰ ${new Date().toLocaleString()}\n`);

    // Get daily digest from Convex
    console.log("📋 Fetching matched jobs from Convex...");
    const digest = await client.query(api.job_matching.generateDailyDigest, {
      userId: "leroy",
      limit: MAX_JOBS
    });

    console.log(`✓ Found ${digest.jobs.length} jobs (${digest.totalScraped} total scraped in last 24h)\n`);

    // Build Telegram message
    let message = `📬 **ProLinker Daily Digest**\n`;
    message += `📅 ${new Date().toLocaleDateString("en-US", { 
      weekday: "long", 
      year: "numeric", 
      month: "long", 
      day: "numeric" 
    })}\n`;
    
    if (digest.jobs.length === 0) {
      message += `\nNo new jobs found matching your criteria (score >= ${MIN_SCORE}).\n`;
      message += `\n📊 Stats:\n`;
      message += `- Jobs scraped (last 24h): ${digest.totalScraped}\n`;
      message += `- No jobs scored >= ${MIN_SCORE}\n`;
    } else {
      // Filter jobs with score >= MIN_SCORE
      const topJobs = digest.jobs.filter(job => job.matchScore >= MIN_SCORE);
      
      if (topJobs.length === 0) {
        message += `\n⚠️ Found ${digest.jobs.length} matches, but none scored >= ${MIN_SCORE}.\n`;
        const topScore = Math.max(...digest.jobs.map(j => j.matchScore));
        message += `Highest score: ${Math.round(topScore)}/100\n`;
      } else {
        message += `\n✨ Found ${topJobs.length} top matches:\n`;
        
        topJobs.forEach((job, i) => {
          message += formatJob(job, i + 1);
        });
        
        const avgScore = Math.round(
          topJobs.reduce((sum, j) => sum + j.matchScore, 0) / topJobs.length
        );
        
        message += `\n📊 Stats:\n`;
        message += `- Jobs scraped (last 24h): ${digest.totalScraped}\n`;
        message += `- Jobs scored >= ${MIN_SCORE}: ${topJobs.length}\n`;
        message += `- Average score (top ${topJobs.length}): ${avgScore}/100\n`;
      }
    }
    
    message += `\n🔧 Manage preferences: admin.leroysteding.nl/admin/jobs/prolinker`;
    
    // Send via Telegram
    console.log("📤 Sending digest via Telegram...");
    sendTelegram(message);
    console.log("✅ Digest sent successfully!\n");

    // Log summary to console
    console.log("📊 Summary:");
    console.log(`- Total scraped (24h): ${digest.totalScraped}`);
    console.log(`- Top matches: ${digest.jobs.filter(j => j.matchScore >= MIN_SCORE).length}`);
    console.log(`- Highest score: ${digest.jobs.length > 0 ? Math.round(Math.max(...digest.jobs.map(j => j.matchScore))) : "N/A"}/100`);
    
  } catch (error) {
    console.error("❌ Error generating digest:", error);
    throw error;
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

export { main };
