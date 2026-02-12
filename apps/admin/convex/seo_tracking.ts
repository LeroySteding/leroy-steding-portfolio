import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAuth } from "./_helpers";

export const list = query({
  args: { domain: v.optional(v.string()), keyword: v.optional(v.string()), limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    let items = await ctx.db.query("seo_tracking").order("desc").collect();
    if (args.domain) items = items.filter((i) => i.domain === args.domain);
    if (args.keyword) items = items.filter((i) => i.keyword === args.keyword);
    return items.slice(0, args.limit ?? 100);
  },
});

export const get = query({
  args: { id: v.id("seo_tracking") },
  handler: async (ctx, args) => ctx.db.get(args.id),
});

// Public push mutation for agents (no auth required)
export const push = mutation({
  args: {
    url: v.string(), keyword: v.optional(v.string()), position: v.optional(v.number()),
    impressions: v.optional(v.number()), clicks: v.optional(v.number()), ctr: v.optional(v.number()),
    domain: v.string(), pageTitle: v.optional(v.string()), notes: v.optional(v.string()),
    checkedAt: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("seo_tracking", { ...args, checkedAt: args.checkedAt ?? Date.now(), createdAt: Date.now() });
  },
});

export const create = mutation({
  args: {
    url: v.string(), keyword: v.optional(v.string()), position: v.optional(v.number()),
    impressions: v.optional(v.number()), clicks: v.optional(v.number()), ctr: v.optional(v.number()),
    domain: v.string(), pageTitle: v.optional(v.string()), notes: v.optional(v.string()),
    checkedAt: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await requireAuth(ctx);
    return await ctx.db.insert("seo_tracking", { ...args, checkedAt: args.checkedAt ?? Date.now(), createdAt: Date.now() });
  },
});

export const update = mutation({
  args: {
    id: v.id("seo_tracking"), url: v.optional(v.string()), keyword: v.optional(v.string()),
    position: v.optional(v.number()), impressions: v.optional(v.number()), clicks: v.optional(v.number()),
    ctr: v.optional(v.number()), domain: v.optional(v.string()), pageTitle: v.optional(v.string()),
    notes: v.optional(v.string()), checkedAt: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await requireAuth(ctx);
    const { id, ...fields } = args;
    const update: Record<string, any> = {};
    for (const [k, val] of Object.entries(fields)) { if (val !== undefined) update[k] = val; }
    await ctx.db.patch(id, update);
  },
});

export const remove = mutation({
  args: { id: v.id("seo_tracking") },
  handler: async (ctx, args) => { await requireAuth(ctx); await ctx.db.delete(args.id); },
});
