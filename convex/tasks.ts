import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAuth } from "./_helpers";

const status = v.union(v.literal("backlog"), v.literal("todo"), v.literal("in_progress"), v.literal("review"), v.literal("done"), v.literal("cancelled"));
const priority = v.union(v.literal("low"), v.literal("medium"), v.literal("high"), v.literal("critical"));
const category = v.union(v.literal("development"), v.literal("devops"), v.literal("content"), v.literal("seo"), v.literal("design"), v.literal("marketing"), v.literal("job_hunting"), v.literal("other"));

export const list = query({
  args: {
    status: v.optional(status),
    priority: v.optional(priority),
    category: v.optional(category),
    assignee: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let items = await ctx.db.query("tasks").order("desc").collect();
    if (args.status) items = items.filter((i) => i.status === args.status);
    if (args.priority) items = items.filter((i) => i.priority === args.priority);
    if (args.category) items = items.filter((i) => i.category === args.category);
    if (args.assignee) items = items.filter((i) => i.assignee === args.assignee);
    return items;
  },
});

export const get = query({
  args: { id: v.id("tasks") },
  handler: async (ctx, args) => ctx.db.get(args.id),
});

export const countByStatus = query({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("tasks").collect();
    const counts: Record<string, number> = {};
    for (const t of all) counts[t.status] = (counts[t.status] ?? 0) + 1;
    return counts;
  },
});

// Public push mutation for agents (no auth required)
export const push = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    status: v.optional(status),
    priority: v.optional(priority),
    category: v.optional(category),
    assignee: v.optional(v.string()),
    dueDate: v.optional(v.number()),
    tags: v.optional(v.array(v.string())),
    relatedUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Dedup: check if same title already exists
    const existing = await ctx.db.query("tasks")
      .withIndex("by_title", (q) => q.eq("title", args.title))
      .first();
    if (existing) {
      await ctx.db.patch(existing._id, {
        description: args.description ?? existing.description,
        status: args.status ?? existing.status,
        priority: args.priority ?? existing.priority,
        category: args.category ?? existing.category,
        assignee: args.assignee ?? existing.assignee,
        dueDate: args.dueDate ?? existing.dueDate,
        tags: args.tags ?? existing.tags,
        relatedUrl: args.relatedUrl ?? existing.relatedUrl,
      });
      return existing._id;
    }
    return await ctx.db.insert("tasks", {
      title: args.title,
      description: args.description,
      status: args.status ?? "backlog",
      priority: args.priority ?? "medium",
      category: args.category ?? "development",
      assignee: args.assignee,
      dueDate: args.dueDate,
      tags: args.tags ?? [],
      relatedUrl: args.relatedUrl,
      completedAt: undefined,
      createdAt: Date.now(),
    });
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    status: v.optional(status),
    priority: v.optional(priority),
    category: v.optional(category),
    assignee: v.optional(v.string()),
    dueDate: v.optional(v.number()),
    tags: v.optional(v.array(v.string())),
    relatedUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAuth(ctx);
    return await ctx.db.insert("tasks", {
      title: args.title,
      description: args.description,
      status: args.status ?? "backlog",
      priority: args.priority ?? "medium",
      category: args.category ?? "development",
      assignee: args.assignee,
      dueDate: args.dueDate,
      tags: args.tags ?? [],
      relatedUrl: args.relatedUrl,
      createdAt: Date.now(),
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("tasks"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    status: v.optional(status),
    priority: v.optional(priority),
    category: v.optional(category),
    assignee: v.optional(v.string()),
    dueDate: v.optional(v.number()),
    completedAt: v.optional(v.number()),
    tags: v.optional(v.array(v.string())),
    relatedUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAuth(ctx);
    const { id, ...fields } = args;
    const update: Record<string, any> = {};
    for (const [k, val] of Object.entries(fields)) {
      if (val !== undefined) update[k] = val;
    }
    if (args.status === "done" && !args.completedAt) update.completedAt = Date.now();
    await ctx.db.patch(id, update);
  },
});

export const remove = mutation({
  args: { id: v.id("tasks") },
  handler: async (ctx, args) => {
    await requireAuth(ctx);
    await ctx.db.delete(args.id);
  },
});
