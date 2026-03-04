/**
 * Auto-Apply Settings
 * 
 * Stores user preferences and safety controls for the auto-apply system.
 */

import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAuth } from "./_helpers";

export const mode = v.union(
  v.literal("manual"),      // Review each job, one-click apply
  v.literal("semi-auto"),   // Auto-apply to high-match jobs (score >80%)
  v.literal("full-auto")    // Auto-apply to all jobs above threshold
);

export const get: any = query({
  args: {},
  handler: async (ctx) => {
    await requireAuth(ctx);
    
    // Get the single settings record (or create default)
    const settings = await ctx.db.query("auto_apply_settings").first();
    
    if (!settings) {
      // Return defaults if not yet created
      return {
        mode: "manual" as const,
        enabled: false,
        dailyLimit: 10,
        scoreThreshold: 70,
        companyCooldownDays: 30,
        blacklistCompanies: [],
        blacklistKeywords: [],
        whitelistCompanies: [],
        requiredKeywords: [],
        dryRun: true,
        notifyOnApply: true,
        autoWithdrawOnBetter: false,
        weeklyReportEnabled: true,
      };
    }
    
    return settings;
  },
});

export const update = mutation({
  args: {
    mode: v.optional(mode),
    enabled: v.optional(v.boolean()),
    dailyLimit: v.optional(v.number()),
    scoreThreshold: v.optional(v.number()),
    companyCooldownDays: v.optional(v.number()),
    blacklistCompanies: v.optional(v.array(v.string())),
    blacklistKeywords: v.optional(v.array(v.string())),
    whitelistCompanies: v.optional(v.array(v.string())),
    requiredKeywords: v.optional(v.array(v.string())),
    dryRun: v.optional(v.boolean()),
    notifyOnApply: v.optional(v.boolean()),
    autoWithdrawOnBetter: v.optional(v.boolean()),
    weeklyReportEnabled: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    await requireAuth(ctx);
    
    const existing = await ctx.db.query("auto_apply_settings").first();
    
    if (existing) {
      // Update existing settings
      const updates: Record<string, any> = {};
      for (const [key, value] of Object.entries(args)) {
        if (value !== undefined) updates[key] = value;
      }
      await ctx.db.patch(existing._id, updates);
      return existing._id;
    } else {
      // Create new settings record
      return await ctx.db.insert("auto_apply_settings", {
        mode: args.mode ?? "manual",
        enabled: args.enabled ?? false,
        dailyLimit: args.dailyLimit ?? 10,
        scoreThreshold: args.scoreThreshold ?? 70,
        companyCooldownDays: args.companyCooldownDays ?? 30,
        blacklistCompanies: args.blacklistCompanies ?? [],
        blacklistKeywords: args.blacklistKeywords ?? [],
        whitelistCompanies: args.whitelistCompanies ?? [],
        requiredKeywords: args.requiredKeywords ?? [],
        dryRun: args.dryRun ?? true,
        notifyOnApply: args.notifyOnApply ?? true,
        autoWithdrawOnBetter: args.autoWithdrawOnBetter ?? false,
        weeklyReportEnabled: args.weeklyReportEnabled ?? true,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    }
  },
});

export const reset = mutation({
  args: {},
  handler: async (ctx) => {
    await requireAuth(ctx);
    
    const existing = await ctx.db.query("auto_apply_settings").first();
    if (existing) {
      await ctx.db.delete(existing._id);
    }
  },
});

// Get stats for dashboard
export const getStats: any = query({
  args: {},
  handler: async (ctx) => {
    await requireAuth(ctx);
    
    const settings = await ctx.db.query("auto_apply_settings").first();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayMs = today.getTime();
    
    // Count today's applications
    const allApplications = await ctx.db.query("job_applications").collect();
    const todayApplications = allApplications.filter(
      app => app.appliedAt && app.appliedAt >= todayMs
    );
    
    const autoApplications = allApplications.filter(
      app => app.appliedVia === "auto-apply"
    );
    
    return {
      enabled: settings?.enabled ?? false,
      mode: settings?.mode ?? "manual",
      dailyLimit: settings?.dailyLimit ?? 10,
      todayCount: todayApplications.length,
      remainingToday: Math.max(0, (settings?.dailyLimit ?? 10) - todayApplications.length),
      totalAutoApplied: autoApplications.length,
      dryRun: settings?.dryRun ?? true,
    };
  },
});
