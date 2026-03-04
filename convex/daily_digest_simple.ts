/**
 * Daily Digest - Simplified Version
 * Generates morning standup report without complex queries
 */

import { v } from "convex/values";
import { internalAction, internalMutation } from "./_generated/server";
import { internal } from "./_generated/api";

export const generateDailyDigest = internalAction({
  args: {},
  handler: async (ctx): Promise<any> => {
    console.log("[daily-digest] Generating morning standup...");
    
    const now = Date.now();
    const yesterday = now - 86400000;
    
    // Get basic stats directly
    const [tasks, jobs, scrapedJobs] = await Promise.all([
      ctx.runQuery(internal.tasks.list),
      ctx.runQuery(internal.job_applications.list),
      ctx.runQuery(internal.scraped_jobs.list),
    ]);
    
    // Calculate stats
    const taskStats = {
      completed: tasks.filter((t: any) => t.status === "completed" && (t.updatedAt || t.createdAt) > yesterday).length,
      failed: tasks.filter((t: any) => t.status === "failed" && (t.updatedAt || t.createdAt) > yesterday).length,
      pending: tasks.filter((t: any) => t.status === "pending").length,
      highPriority: tasks.filter((t: any) => t.status === "pending" && (t.priority === "high" || t.priority === "critical")).length,
      critical: tasks.filter((t: any) => t.priority === "critical").length,
    };
    
    const jobStats = {
      applied: jobs.filter((j: any) => j.status === "applied" && (j.appliedAt || j.createdAt) > yesterday).length,
      discovered: jobs.filter((j: any) => j.status === "discovered" && j.createdAt > yesterday).length,
    };
    
    const scraperStats = {
      total: scrapedJobs.filter((j: any) => j.scrapedAt > yesterday).length,
      prolinker: scrapedJobs.filter((j: any) => j.source === "prolinker" && j.scrapedAt > yesterday).length,
      freep: scrapedJobs.filter((j: any) => j.source === "freep" && j.scrapedAt > yesterday).length,
      medium: scrapedJobs.filter((j: any) => j.source === "medium" && j.scrapedAt > yesterday).length,
    };
    
    // Build digest
    const digest = {
      date: new Date().toISOString().split('T')[0],
      yesterday: {
        tasksCompleted: taskStats.completed,
        tasksFailed: taskStats.failed,
        jobsApplied: jobStats.applied,
        jobsScraped: scraperStats.total,
      },
      today: {
        pendingTasks: taskStats.pending,
        highPriorityTasks: taskStats.highPriority,
        criticalIssues: taskStats.critical,
      },
      scrapers: {
        prolinker: { count: scraperStats.prolinker, status: scraperStats.prolinker > 0 ? "healthy" : "warning" },
        freep: { count: scraperStats.freep, status: scraperStats.freep > 0 ? "healthy" : "warning" },
        medium: { count: scraperStats.medium, status: scraperStats.medium > 0 ? "healthy" : "warning" },
      },
      blockers: [] as string[],
      suggestions: [] as string[],
    };
    
    // Add blockers
    const stuckTasks = tasks.filter((t: any) => t.status === "pending" && now - t.createdAt > 86400000);
    if (stuckTasks.length > 0) {
      digest.blockers.push(`${stuckTasks.length} tasks pending >24h`);
    }
    
    // Add suggestions
    if (taskStats.pending > 10) {
      digest.suggestions.push(`High task backlog (${taskStats.pending}). Consider prioritizing.`);
    }
    if (taskStats.critical > 0) {
      digest.suggestions.push(`⚠️ ${taskStats.critical} critical tasks need immediate attention.`);
    }
    if (scraperStats.freep === 0) {
      digest.suggestions.push("Freep scraper hasn't run recently. Check cron schedule.");
    }
    
    // Store digest
    await ctx.runMutation(internal.daily_digest_simple.storeDailyDigest, { digest });
    
    return digest;
  },
});

export const storeDailyDigest = internalMutation({
  args: { digest: v.any() },
  handler: async (ctx, args) => {
    const lines: string[] = [];
    
    lines.push(`**Yesterday**`);
    lines.push(`✅ ${args.digest.yesterday.tasksCompleted} tasks completed`);
    lines.push(`📥 ${args.digest.yesterday.jobsScraped} jobs scraped`);
    lines.push(`📨 ${args.digest.yesterday.jobsApplied} applications sent`);
    lines.push(``);
    
    lines.push(`**Today**`);
    lines.push(`📋 ${args.digest.today.pendingTasks} pending tasks`);
    lines.push(`🔴 ${args.digest.today.highPriorityTasks} high priority`);
    lines.push(``);
    
    lines.push(`**Scrapers**`);
    lines.push(`• ProLinker: ${args.digest.scrapers.prolinker.count} jobs (${args.digest.scrapers.prolinker.status})`);
    lines.push(`• Freep: ${args.digest.scrapers.freep.count} jobs (${args.digest.scrapers.freep.status})`);
    lines.push(`• Medium: ${args.digest.scrapers.medium.count} jobs (${args.digest.scrapers.medium.status})`);
    
    if (args.digest.blockers.length > 0) {
      lines.push(``);
      lines.push(`**⚠️ Blockers**`);
      args.digest.blockers.forEach((b: string) => lines.push(`• ${b}`));
    }
    
    if (args.digest.suggestions.length > 0) {
      lines.push(``);
      lines.push(`**💡 Suggestions**`);
      args.digest.suggestions.forEach((s: string) => lines.push(`• ${s}`));
    }
    
    // Log to agent feed
    await ctx.db.insert("agent_feed", {
      title: `📊 Daily Standup - ${args.digest.date}`,
      content: lines.join('\n'),
      type: "briefing",
      source: "daily-digest",
      priority: "medium",
      read: false,
      tags: ["standup", "report"],
      createdAt: Date.now(),
      metadata: args.digest,
    });
  },
});
