import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAuth } from "./_helpers";

const status = v.union(v.literal("discovered"), v.literal("researching"), v.literal("applying"), v.literal("applied"), v.literal("interviewing"), v.literal("offer"), v.literal("rejected"), v.literal("withdrawn"));

export const list = query({
  args: { status: v.optional(status) },
  handler: async (ctx, args) => {
    let items = await ctx.db.query("job_applications").order("desc").collect();
    if (args.status) items = items.filter((i) => i.status === args.status);
    return items;
  },
});

export const get = query({
  args: { id: v.id("job_applications") },
  handler: async (ctx, args) => ctx.db.get(args.id),
});

export const activeCount = query({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("job_applications").collect();
    return all.filter((j) => !["rejected", "withdrawn"].includes(j.status)).length;
  },
});

// Public push mutation for agents (no auth required)
export const push = mutation({
  args: {
    company: v.string(), position: v.string(), url: v.optional(v.string()),
    status: v.optional(status), salary: v.optional(v.string()), location: v.optional(v.string()),
    remote: v.optional(v.boolean()), notes: v.optional(v.string()),
    contacts: v.optional(v.array(v.object({ name: v.string(), role: v.optional(v.string()), linkedin: v.optional(v.string()) }))),
    tags: v.optional(v.array(v.string())), nextAction: v.optional(v.string()), nextActionDate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // Dedup: check if same company+position already exists
    const existing = await ctx.db.query("job_applications")
      .withIndex("by_company_position", (q) => q.eq("company", args.company).eq("position", args.position))
      .first();
    if (existing) {
      await ctx.db.patch(existing._id, { ...args, status: args.status ?? existing.status, tags: args.tags ?? existing.tags });
      return existing._id;
    }
    return await ctx.db.insert("job_applications", { ...args, status: args.status ?? "discovered", tags: args.tags ?? [], createdAt: Date.now() });
  },
});

export const create = mutation({
  args: {
    company: v.string(),
    position: v.string(),
    url: v.optional(v.string()),
    status: v.optional(status),
    salary: v.optional(v.string()),
    location: v.optional(v.string()),
    remote: v.optional(v.boolean()),
    notes: v.optional(v.string()),
    contacts: v.optional(v.array(v.object({ name: v.string(), role: v.optional(v.string()), linkedin: v.optional(v.string()) }))),
    tags: v.optional(v.array(v.string())),
    nextAction: v.optional(v.string()),
    nextActionDate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await requireAuth(ctx);
    return await ctx.db.insert("job_applications", {
      ...args,
      status: args.status ?? "discovered",
      tags: args.tags ?? [],
      createdAt: Date.now(),
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("job_applications"),
    company: v.optional(v.string()),
    position: v.optional(v.string()),
    url: v.optional(v.string()),
    status: v.optional(status),
    salary: v.optional(v.string()),
    location: v.optional(v.string()),
    remote: v.optional(v.boolean()),
    notes: v.optional(v.string()),
    contacts: v.optional(v.array(v.object({ name: v.string(), role: v.optional(v.string()), linkedin: v.optional(v.string()) }))),
    appliedAt: v.optional(v.number()),
    nextAction: v.optional(v.string()),
    nextActionDate: v.optional(v.number()),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    await requireAuth(ctx);
    const { id, ...fields } = args;
    const update: Record<string, any> = {};
    for (const [k, val] of Object.entries(fields)) {
      if (val !== undefined) update[k] = val;
    }
    if (args.status === "applied" && !args.appliedAt) update.appliedAt = Date.now();
    await ctx.db.patch(id, update);
  },
});

export const remove = mutation({
  args: { id: v.id("job_applications") },
  handler: async (ctx, args) => {
    await requireAuth(ctx);
    await ctx.db.delete(args.id);
  },
});
