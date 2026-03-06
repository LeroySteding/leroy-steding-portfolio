/**
 * Job Matching & Daily Digest
 * 
 * Scores scraped jobs against user preferences and generates daily digests
 */

import { v } from "convex/values";
import { query } from "./_generated/server";

/**
 * Leroy's job preferences (hardcoded for now, will move to DB later)
 */
const PREFERENCES = {
  // Core skills
  requiredTechnologies: ["typescript", "react", "nextjs", "node", "javascript"],
  preferredTechnologies: ["convex", "tailwind", "vercel", "ai", "llm", "gpt", "claude"],
  
  // Interests
  domains: ["ai", "automation", "saas", "devtools", "productivity", "analytics"],
  
  // Work style
  remote: true,
  keywords: ["senior", "lead", "full-stack", "fullstack", "full stack"],
  
  // Negative signals
  avoid: ["java", "php", ".net", "angular", "vue", "junior"],
};

/**
 * Calculate match score for a job (0-100)
 */
function calculateMatchScore(job: any): { score: number; details: string[] } {
  let score = 0;
  const details: string[] = [];
  
  // Convert all searchable text to lowercase
  const searchText = `${job.title} ${job.company} ${job.description} ${job.technologies?.join(" ") || ""}`.toLowerCase();
  
  // Remote preference (high weight)
  if (job.remote) {
    score += 20;
    details.push("Remote");
  }
  
  // Required technologies (must have at least one)
  const requiredMatches = PREFERENCES.requiredTechnologies.filter((tech) =>
    searchText.includes(tech.toLowerCase())
  );
  if (requiredMatches.length > 0) {
    score += Math.min(requiredMatches.length * 10, 30);
    details.push(`Core: ${requiredMatches.slice(0, 3).join(", ")}`);
  } else {
    // No required tech = low score
    score -= 20;
  }
  
  // Preferred technologies (bonus points)
  const preferredMatches = PREFERENCES.preferredTechnologies.filter((tech) =>
    searchText.includes(tech.toLowerCase())
  );
  if (preferredMatches.length > 0) {
    score += Math.min(preferredMatches.length * 8, 25);
    details.push(`Nice: ${preferredMatches.slice(0, 3).join(", ")}`);
  }
  
  // Domain/interest match
  const domainMatches = PREFERENCES.domains.filter((domain) =>
    searchText.includes(domain.toLowerCase())
  );
  if (domainMatches.length > 0) {
    score += Math.min(domainMatches.length * 5, 15);
    details.push(`Domain: ${domainMatches.slice(0, 2).join(", ")}`);
  }
  
  // Seniority keywords
  const seniorityMatches = PREFERENCES.keywords.filter((keyword) =>
    searchText.includes(keyword.toLowerCase())
  );
  if (seniorityMatches.length > 0) {
    score += 10;
    details.push(`Level: ${seniorityMatches[0]}`);
  }
  
  // Negative signals
  const avoidMatches = PREFERENCES.avoid.filter((term) =>
    searchText.includes(term.toLowerCase())
  );
  if (avoidMatches.length > 0) {
    score -= avoidMatches.length * 10;
    details.push(`⚠️ ${avoidMatches.join(", ")}`);
  }
  
  // Normalize to 0-100
  score = Math.max(0, Math.min(100, score));
  
  return { score, details };
}

/**
 * Generate daily digest of top matched jobs
 */
export const generateDailyDigest: any = query({
  args: {
    userId: v.string(), // Future: look up user preferences
    limit: v.optional(v.number()),
    minScore: v.optional(v.number()),
    hoursBack: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 10;
    const minScore = args.minScore || 50;
    const hoursBack = args.hoursBack || 24;
    
    // Get recent jobs
    const cutoffTime = Date.now() - hoursBack * 60 * 60 * 1000;
    const allJobs = await ctx.db
      .query("scraped_jobs")
      .filter((q) => q.gte(q.field("scrapedAt"), cutoffTime))
      .filter((q) => q.neq(q.field("archived"), true))
      .collect();
    
    // Score each job
    const scoredJobs = allJobs.map((job) => {
      const { score, details } = calculateMatchScore(job);
      return {
        ...job,
        matchScore: score,
        matchDetails: details,
      };
    });
    
    // Filter by min score and sort
    const topJobs = scoredJobs
      .filter((job) => job.matchScore >= minScore)
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, limit);
    
    return {
      jobs: topJobs,
      totalScraped: allJobs.length,
      totalMatched: topJobs.length,
      message: `Found ${topJobs.length} high-quality matches from ${allJobs.length} jobs scraped in the last ${hoursBack} hours.`,
    };
  },
});

/**
 * Get match score for a single job (for UI)
 */
export const scoreJob: any = query({
  args: { jobId: v.id("scraped_jobs") },
  handler: async (ctx, args) => {
    const job = await ctx.db.get(args.jobId);
    if (!job) return null;
    
    const { score, details } = calculateMatchScore(job);
    return { score, details };
  },
});
