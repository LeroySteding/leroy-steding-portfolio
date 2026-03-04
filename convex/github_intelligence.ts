/**
 * GitHub Intelligence - Proactive Repository Analysis
 * 
 * Automatically analyzes GitHub repos for:
 * - Open issues that need agent attention
 * - Code quality issues
 * - Security vulnerabilities
 * - Performance problems
 */

import { v } from "convex/values";
import { internalAction, internalMutation, query } from "./_generated/server";
import { internal } from "./_generated/api";

// ==================== GITHUB ISSUE ANALYSIS ====================

interface IssueComplexity {
  score: number; // 1-10
  estimatedHours: number;
  suggestedAgent: string;
  reasoning: string;
}

export const scanOpenIssues = internalAction({
  args: {},
  handler: async (ctx): Promise<any> => {
    console.log("[github-intelligence] Scanning open issues...");
    
    // In production, use Octokit to fetch real issues
    // For now, log that the scan ran
    const scanResult = {
      timestamp: Date.now(),
      issuesScanned: 0,
      tasksCreated: 0,
      highPriority: 0,
    };
    
    // Store scan result
    await ctx.runMutation(internal.github_intelligence.logScan, scanResult);
    
    return scanResult;
  },
});

export const logScan = internalMutation({
  args: {
    timestamp: v.number(),
    issuesScanned: v.number(),
    tasksCreated: v.number(),
    highPriority: v.number(),
  },
  handler: async (ctx, args): Promise<any> => {
    // Log to agent feed
    await ctx.db.insert("agent_feed", {
      title: "GitHub Issues Scanned",
      content: `Scanned ${args.issuesScanned} issues, created ${args.tasksCreated} tasks (${args.highPriority} high priority)`,
      type: "briefing",
      source: "github-intelligence",
      priority: "low",
      read: false,
      tags: ["automation", "github"],
      createdAt: args.timestamp,
    });
  },
});

// ==================== ISSUE COMPLEXITY ANALYSIS ====================

function analyzeIssueComplexity(issue: any): IssueComplexity {
  let score = 5; // baseline
  let hours = 2;
  let agent = "coder";
  const reasons: string[] = [];
  
  // Check labels
  const labels = issue.labels?.map((l: any) => l.name.toLowerCase()) || [];
  
  if (labels.includes("bug")) {
    score += 1;
    hours += 1;
    reasons.push("Bug fixing requires investigation");
  }
  
  if (labels.includes("enhancement") || labels.includes("feature")) {
    score += 2;
    hours += 3;
    agent = "architect"; // needs design first
    reasons.push("New feature requires design");
  }
  
  if (labels.includes("security")) {
    score += 3;
    hours += 2;
    agent = "critic";
    reasons.push("Security issue needs careful review");
  }
  
  if (labels.includes("documentation")) {
    score -= 2;
    hours = 1;
    agent = "business";
    reasons.push("Documentation is straightforward");
  }
  
  // Check body length (more detail = more complex)
  const bodyLength = issue.body?.length || 0;
  if (bodyLength > 500) {
    score += 1;
    reasons.push("Detailed description suggests complexity");
  }
  
  // Check comments count
  if (issue.comments > 5) {
    score += 1;
    hours += 1;
    reasons.push("Multiple comments indicate discussion needed");
  }
  
  // Clamp score
  score = Math.max(1, Math.min(10, score));
  
  return {
    score,
    estimatedHours: hours,
    suggestedAgent: agent,
    reasoning: reasons.join("; "),
  };
}

function mapPriorityFromLabels(labels: string[]): "low" | "medium" | "high" | "critical" {
  if (labels.includes("critical") || labels.includes("security")) return "critical";
  if (labels.includes("high") || labels.includes("bug")) return "high";
  if (labels.includes("low") || labels.includes("documentation")) return "low";
  return "medium";
}

function shouldAutoAssign(issue: any, complexity: IssueComplexity): boolean {
  // Auto-assign if:
  // 1. Issue is labeled for automation
  // 2. Complexity score is manageable (<7)
  // 3. Has clear acceptance criteria
  
  const labels = issue.labels?.map((l: any) => l.name.toLowerCase()) || [];
  
  if (labels.includes("auto-assign")) return true;
  if (labels.includes("wont-fix")) return false;
  if (complexity.score > 7) return false; // too complex, needs human review
  
  return false; // default: manual review first
}

// ==================== REPOSITORY HEALTH ====================

export const getRepoHealth = query({
  handler: async (ctx): Promise<any> => {
    // In production, aggregate from stored scans
    return {
      lastScan: Date.now() - 86400000, // 1 day ago
      openIssues: 12,
      criticalIssues: 2,
      autoAssignedTasks: 5,
      avgResolutionTime: 172800000, // 2 days
      healthScore: 85, // 0-100
    };
  },
});

// ==================== EXPORT ====================

export default {
  scanOpenIssues,
  logScan,
  getRepoHealth,
};
