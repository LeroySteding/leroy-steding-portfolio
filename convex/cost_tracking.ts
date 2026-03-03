/**
 * Cost Tracking - Monitor AI model spending
 * 
 * Tracks usage by agent, model, and time period
 */

import { v } from "convex/values";
import { internalMutation, query } from "./_generated/server";

// ==================== COST LOGGING ====================

export const logModelUsage = internalMutation({
  args: {
    agent: v.string(),
    model: v.string(),
    task: v.string(),
    inputTokens: v.number(),
    outputTokens: v.number(),
    duration: v.number(), // milliseconds
  },
  handler: async (ctx, args) => {
    const cost = calculateCost(args.model, args.inputTokens, args.outputTokens);
    
    await ctx.db.insert("cost_logs", {
      ...args,
      cost,
      timestamp: Date.now(),
    });
    
    return { cost };
  },
});

function calculateCost(
  model: string,
  inputTokens: number,
  outputTokens: number
): number {
  // Cost per million tokens (as of 2026)
  const PRICING: Record<string, { input: number; output: number }> = {
    "claude-opus-4": { input: 15, output: 75 },
    "claude-sonnet-4.5": { input: 3, output: 15 },
    "claude-haiku-4.5": { input: 0.25, output: 1.25 },
    "ollama": { input: 0, output: 0 }, // Local = free
  };
  
  const pricing = PRICING[model] || PRICING["claude-sonnet-4.5"];
  
  const inputCost = (inputTokens / 1_000_000) * pricing.input;
  const outputCost = (outputTokens / 1_000_000) * pricing.output;
  
  return inputCost + outputCost;
}

// ==================== QUERIES ====================

export const getDailyUsage = query({
  args: { days: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const days = args.days || 30;
    const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
    
    const logs = await ctx.db
      .query("cost_logs")
      .filter((q) => q.gte(q.field("timestamp"), cutoff))
      .collect();
    
    // Group by day
    const dailyData = new Map<string, number>();
    
    for (const log of logs) {
      const date = new Date(log.timestamp).toISOString().split("T")[0];
      dailyData.set(date, (dailyData.get(date) || 0) + log.cost);
    }
    
    return Array.from(dailyData.entries())
      .map(([date, cost]) => ({ date, cost }))
      .sort((a, b) => a.date.localeCompare(b.date));
  },
});

export const getMonthlyTotal = query({
  handler: async (ctx) => {
    const now = Date.now();
    const startOfMonth = new Date(
      new Date(now).getFullYear(),
      new Date(now).getMonth(),
      1
    ).getTime();
    
    const logs = await ctx.db
      .query("cost_logs")
      .filter((q) => q.gte(q.field("timestamp"), startOfMonth))
      .collect();
    
    return logs.reduce((sum, log) => sum + log.cost, 0);
  },
});

export const getBreakdownByAgent = query({
  handler: async (ctx) => {
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    
    const logs = await ctx.db
      .query("cost_logs")
      .filter((q) => q.gte(q.field("timestamp"), thirtyDaysAgo))
      .collect();
    
    // Group by agent
    const agentCosts = new Map<string, number>();
    const agentTasks = new Map<string, number>();
    
    for (const log of logs) {
      agentCosts.set(log.agent, (agentCosts.get(log.agent) || 0) + log.cost);
      agentTasks.set(log.agent, (agentTasks.get(log.agent) || 0) + 1);
    }
    
    return Array.from(agentCosts.entries())
      .map(([agent, cost]) => ({
        agent,
        cost,
        tasks: agentTasks.get(agent) || 0,
        avgCostPerTask: cost / (agentTasks.get(agent) || 1),
      }))
      .sort((a, b) => b.cost - a.cost);
  },
});

export const getBreakdownByModel = query({
  handler: async (ctx) => {
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    
    const logs = await ctx.db
      .query("cost_logs")
      .filter((q) => q.gte(q.field("timestamp"), thirtyDaysAgo))
      .collect();
    
    // Group by model
    const modelCosts = new Map<string, number>();
    const modelUsage = new Map<string, number>();
    
    for (const log of logs) {
      modelCosts.set(log.model, (modelCosts.get(log.model) || 0) + log.cost);
      modelUsage.set(log.model, (modelUsage.get(log.model) || 0) + 1);
    }
    
    return Array.from(modelCosts.entries())
      .map(([model, cost]) => ({
        model,
        cost,
        uses: modelUsage.get(model) || 0,
        percentage: 0, // Will calculate below
      }))
      .sort((a, b) => b.cost - a.cost)
      .map((item, _, arr) => {
        const totalCost = arr.reduce((sum, i) => sum + i.cost, 0);
        return {
          ...item,
          percentage: totalCost > 0 ? (item.cost / totalCost) * 100 : 0,
        };
      });
  },
});

export const getSavingsFromLocal = query({
  handler: async (ctx) => {
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    
    const logs = await ctx.db
      .query("cost_logs")
      .filter((q) => q.gte(q.field("timestamp"), thirtyDaysAgo))
      .collect();
    
    // Calculate what it would cost if all Ollama tasks used Haiku
    const ollamaLogs = logs.filter((log) => log.model === "ollama");
    
    let potentialCost = 0;
    for (const log of ollamaLogs) {
      // Calculate what Haiku would have cost
      potentialCost += calculateCost(
        "claude-haiku-4.5",
        log.inputTokens,
        log.outputTokens
      );
    }
    
    return {
      actualCost: 0, // Ollama is free
      potentialCost,
      savings: potentialCost,
      ollamaTasks: ollamaLogs.length,
    };
  },
});

export const getStats = query({
  handler: async (ctx) => {
    const monthlyTotal = await ctx.runQuery(internal.cost_tracking.getMonthlyTotal);
    const savingsData = await ctx.runQuery(internal.cost_tracking.getSavingsFromLocal);
    const breakdown = await ctx.runQuery(internal.cost_tracking.getBreakdownByAgent);
    
    const MONTHLY_BUDGET = 50; // USD
    const percentOfBudget = (monthlyTotal / MONTHLY_BUDGET) * 100;
    
    return {
      monthlyTotal,
      monthlyBudget: MONTHLY_BUDGET,
      percentOfBudget,
      overBudget: monthlyTotal > MONTHLY_BUDGET,
      savings: savingsData.savings,
      topAgent: breakdown[0]?.agent || "none",
      topAgentCost: breakdown[0]?.cost || 0,
    };
  },
});
