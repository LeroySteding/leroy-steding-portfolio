import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
// Public log mutation for agents (no auth required)
export const log = mutation({
    args: {
        event: v.string(), agent: v.optional(v.string()), model: v.optional(v.string()),
        tokensIn: v.optional(v.number()), tokensOut: v.optional(v.number()),
        cost: v.optional(v.number()), durationMs: v.optional(v.number()),
        metadata: v.optional(v.any()),
        createdAt: v.optional(v.number()), // Allow explicit createdAt for historical entries
    },
    handler: async (ctx, args) => {
        // Use provided createdAt or default to now
        const createdAt = args.createdAt ?? Date.now();
        return await ctx.db.insert("analytics_log", { ...args, createdAt });
    },
});
export const list = query({
    args: { event: v.optional(v.string()), agent: v.optional(v.string()), model: v.optional(v.string()), limit: v.optional(v.number()) },
    handler: async (ctx, args) => {
        let items = await ctx.db.query("analytics_log").order("desc").collect();
        if (args.event)
            items = items.filter((i) => i.event === args.event);
        if (args.agent)
            items = items.filter((i) => i.agent === args.agent);
        if (args.model)
            items = items.filter((i) => i.model === args.model);
        return items.slice(0, args.limit ?? 100);
    },
});
export const summary = query({
    args: {},
    handler: async (ctx) => {
        const all = await ctx.db.query("analytics_log").collect();
        let totalCost = 0, totalTokensIn = 0, totalTokensOut = 0;
        const byAgent = {};
        const byModel = {};
        for (const item of all) {
            totalCost += item.cost ?? 0;
            totalTokensIn += item.tokensIn ?? 0;
            totalTokensOut += item.tokensOut ?? 0;
            if (item.agent)
                byAgent[item.agent] = (byAgent[item.agent] ?? 0) + 1;
            if (item.model)
                byModel[item.model] = (byModel[item.model] ?? 0) + 1;
        }
        return { totalCost, totalTokensIn, totalTokensOut, totalEvents: all.length, byAgent, byModel };
    },
});
export const remove = mutation({
    args: { id: v.id("analytics_log") },
    handler: async (ctx, args) => { await ctx.db.delete(args.id); },
});
// Alias for 'log' - used by scrapers and other automated systems
export const push = log;
