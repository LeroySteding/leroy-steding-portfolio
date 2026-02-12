import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

const ghType = v.union(v.literal("pr"), v.literal("issue"), v.literal("review"), v.literal("merge"), v.literal("release"));

export const list = query({
  args: { repo: v.optional(v.string()), type: v.optional(ghType), limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    let items = await ctx.db.query("github_activity").order("desc").collect();
    if (args.repo) items = items.filter((i) => i.repo === args.repo);
    if (args.type) items = items.filter((i) => i.type === args.type);
    return items.slice(0, args.limit ?? 50);
  },
});

export const get = query({
  args: { id: v.id("github_activity") },
  handler: async (ctx, args) => ctx.db.get(args.id),
});

export const create = mutation({
  args: {
    repo: v.string(), type: ghType, number: v.number(), title: v.string(),
    status: v.string(), url: v.string(), author: v.optional(v.string()),
    labels: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    // Dedup: update existing entry if same repo+type+number
    const existing = await ctx.db.query("github_activity")
      .withIndex("by_repo", (q) => q.eq("repo", args.repo))
      .collect();
    const match = existing.find((i) => i.type === args.type && i.number === args.number);
    if (match) {
      await ctx.db.patch(match._id, { title: args.title, status: args.status, url: args.url, author: args.author, labels: args.labels, updatedAt: Date.now() });
      return match._id;
    }
    return await ctx.db.insert("github_activity", { ...args, createdAt: Date.now() });
  },
});

export const update = mutation({
  args: {
    id: v.id("github_activity"), status: v.optional(v.string()), title: v.optional(v.string()),
    labels: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args;
    const update: Record<string, any> = { updatedAt: Date.now() };
    for (const [k, val] of Object.entries(fields)) { if (val !== undefined) update[k] = val; }
    await ctx.db.patch(id, update);
  },
});

export const remove = mutation({
  args: { id: v.id("github_activity") },
  handler: async (ctx, args) => { await ctx.db.delete(args.id); },
});
