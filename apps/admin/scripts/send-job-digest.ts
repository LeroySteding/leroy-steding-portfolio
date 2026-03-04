#!/usr/bin/env tsx
/**
 * Daily Job Digest Sender
 * 
 * Generates and sends daily job digest via Telegram
 */

import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../convex/_generated/api";

const convex = new ConvexHttpClient(process.env.CONVEX_URL!);

async function sendJobDigest(): Promise<void> {
  console.log("📊 Generating daily job digest...");

  try {
    const digest = await convex.query(api.job_matching.getDailyDigest, {});

    if (!digest.topMatches || digest.topMatches.length === 0) {
      console.log("ℹ️  No high-quality matches today");
      return;
    }

    // Build Telegram message
    let message = `🎯 **Daily Job Digest** - ${new Date().toLocaleDateString('nl-NL')}\n\n`;
    message += `📊 **Summary**:\n`;
    message += `• Total jobs scraped (24h): ${digest.totalNewJobs} new jobs\n`;
    message += `• High-quality matches found: ${digest.highQualityMatches} jobs\n`;
    message += `• Average match score: ${digest.averageScore}/100\n\n`;

    if (digest.topMatches.length > 0) {
      message += `🌟 **Top ${Math.min(10, digest.topMatches.length)} Matches**:\n\n`;

      digest.topMatches.slice(0, 10).forEach((match, i) => {
        if (!match) return;
        message += `${i + 1}. **${match.job.title}**\n`;
        message += `   📍 ${match.job.company} • ${match.job.location || 'Remote'}\n`;
        message += `   ⭐ Score: ${match.score}/100 (`;
        message += Object.entries(match.breakdown)
          .filter(([_, v]) => v > 0)
          .map(([k, v]) => `${k}:${v}`)
          .join(', ');
        message += `)\n`;
        message += `   🔗 ${match.job.url}\n\n`;
      });
    }

    message += `💼 View all: https://admin.leroysteding.nl/jobs`;

    console.log("\n" + message);
    console.log("\n✅ Digest generated!");
    
    // TODO: Actually send via Telegram
    // For now, just log it
    console.log("\n📱 Ready to send to Telegram (implement message tool call)");

  } catch (error) {
    console.error("❌ Failed to generate digest:", error);
    throw error;
  }
}

// Run
if (require.main === module) {
  sendJobDigest()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error("❌ Digest failed:", error);
      process.exit(1);
    });
}

export { sendJobDigest };
