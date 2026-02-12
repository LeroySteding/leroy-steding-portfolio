import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

const environment = v.union(v.literal("production"), v.literal("preview"), v.literal("development"));
const status = v.union(v.literal("building"), v.literal("ready"), v.literal("error"), v.literal("cancelled"));

export const list = query({
  args: { project: v.optional(v.string()), status: v.optional(status), limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    let items = await ctx.db.query("deployments").order("desc").collect();
    if (args.project) items = items.filter((i) => i.project === args.project);
    if (args.status) items = items.filter((i) => i.status === args.status);
    return items.slice(0, args.limit ?? 50);
  },
});

export const get = query({
  args: { id: v.id("deployments") },
  handler: async (ctx, args) => ctx.db.get(args.id),
});

export const create = mutation({
  args: {
    project: v.string(), environment, status: v.optional(status),
    url: v.optional(v.string()), commitSha: v.optional(v.string()),
    commitMessage: v.optional(v.string()), buildDuration: v.optional(v.number()),
    platform: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Dedup: skip if same project+url already exists
    if (args.url) {
      const existing = await ctx.db.query("deployments")
        .withIndex("by_project", (q) => q.eq("project", args.project))
        .collect();
      const match = existing.find((i) => i.url === args.url);
      if (match) {
        await ctx.db.patch(match._id, { status: args.status ?? match.status, commitMessage: args.commitMessage ?? match.commitMessage });
        return match._id;
      }
    }
    return await ctx.db.insert("deployments", {
      ...args, status: args.status ?? "building", platform: args.platform ?? "vercel", createdAt: Date.now(),
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("deployments"), status: v.optional(status), url: v.optional(v.string()),
    buildDuration: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args;
    const update: Record<string, any> = {};
    for (const [k, val] of Object.entries(fields)) { if (val !== undefined) update[k] = val; }
    await ctx.db.patch(id, update);
  },
});

export const remove = mutation({
  args: { id: v.id("deployments") },
  handler: async (ctx, args) => { await ctx.db.delete(args.id); },
});
