import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { internal } from "./_generated/api";
import { requireAuth } from "./_helpers";

const contentType = v.union(v.literal("blog_post"), v.literal("social_post"), v.literal("newsletter"), v.literal("video"), v.literal("podcast"), v.literal("case_study"));
const contentStatus = v.union(v.literal("idea"), v.literal("outline"), v.literal("drafting"), v.literal("review"), v.literal("scheduled"), v.literal("published"));

export const list: any = query({
  args: { type: v.optional(contentType), status: v.optional(contentStatus) },
  handler: async (ctx, args) => {
    let items = await ctx.db.query("content_calendar").order("desc").collect();
    if (args.type) items = items.filter((i) => i.type === args.type);
    if (args.status) items = items.filter((i) => i.status === args.status);
    return items;
  },
});

export const get: any = query({
  args: { id: v.id("content_calendar") },
  handler: async (ctx, args) => ctx.db.get(args.id),
});

export const upcomingCount: any = query({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("content_calendar").collect();
    return all.filter((c) => !["published"].includes(c.status)).length;
  },
});

export const stats: any = query({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("content_calendar").collect();
    const now = Date.now();
    const oneWeekAgo = now - 7 * 24 * 60 * 60 * 1000;
    
    return {
      ideas: all.filter((c) => c.status === "idea").length,
      inProgress: all.filter((c) => ["outline", "drafting", "review", "scheduled"].includes(c.status)).length,
      publishedThisWeek: all.filter((c) => c.status === "published" && c.publishedAt && c.publishedAt >= oneWeekAgo).length,
      totalPublished: all.filter((c) => c.status === "published").length,
    };
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id("content_calendar"),
    status: contentStatus,
  },
  handler: async (ctx, args) => {
    await requireAuth(ctx);
    const update: Record<string, any> = { status: args.status };
    if (args.status === "published") {
      update.publishedAt = Date.now();
    }
    await ctx.db.patch(args.id, update);
  },
});

// Public push mutation for agents (no auth required)
export const push = mutation({
  args: {
    title: v.string(), type: contentType, status: v.optional(contentStatus),
    platform: v.optional(v.string()), targetDate: v.optional(v.number()),
    notes: v.optional(v.string()), seoKeywords: v.optional(v.array(v.string())),
    relatedBlogPostId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Dedup: check if same title+targetDate already exists
    const existing = await ctx.db.query("content_calendar")
      .withIndex("by_title_targetDate", (q) => q.eq("title", args.title).eq("targetDate", args.targetDate))
      .first();
    if (existing) {
      await ctx.db.patch(existing._id, { ...args, status: args.status ?? existing.status });
      return existing._id;
    }
    return await ctx.db.insert("content_calendar", { ...args, status: args.status ?? "idea", createdAt: Date.now() });
  },
});

export const create = mutation({
  args: {
    title: v.string(), type: contentType, status: v.optional(contentStatus),
    platform: v.optional(v.string()), targetDate: v.optional(v.number()),
    notes: v.optional(v.string()), seoKeywords: v.optional(v.array(v.string())),
    relatedBlogPostId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAuth(ctx);
    return await ctx.db.insert("content_calendar", { ...args, status: args.status ?? "idea", createdAt: Date.now() });
  },
});

export const update = mutation({
  args: {
    id: v.id("content_calendar"), title: v.optional(v.string()), type: v.optional(contentType),
    status: v.optional(contentStatus), platform: v.optional(v.string()),
    targetDate: v.optional(v.number()), publishedAt: v.optional(v.number()),
    notes: v.optional(v.string()), seoKeywords: v.optional(v.array(v.string())),
    relatedBlogPostId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAuth(ctx);
    const { id, ...fields } = args;
    
    // Get current content to capture old status
    const currentContent = await ctx.db.get(id);
    if (!currentContent) throw new Error("Content not found");
    
    const oldStatus = currentContent.status;
    const newStatus = args.status || oldStatus;
    
    const update: Record<string, any> = {};
    for (const [k, val] of Object.entries(fields)) { if (val !== undefined) update[k] = val; }
    if (args.status === "published" && !args.publishedAt) update.publishedAt = Date.now();
    
    await ctx.db.patch(id, update);
    
    // Trigger workflow if status changed
    // TODO: Re-enable after fixing internal API generation
    // if (oldStatus !== newStatus) {
    //   await ctx.scheduler.runAfter(0, internal.workflows.dispatchContentWorkflow, {
    //     contentId: id,
    //     oldStatus,
    //     newStatus,
    //     contentData: {
    //       title: args.title || currentContent.title,
    //       type: args.type || currentContent.type,
    //       platform: args.platform || currentContent.platform,
    //       seoKeywords: args.seoKeywords || currentContent.seoKeywords,
    //       notes: args.notes || currentContent.notes,
    //     },
    //   });
    // }
  },
});

export const remove = mutation({
  args: { id: v.id("content_calendar") },
  handler: async (ctx, args) => { await requireAuth(ctx); await ctx.db.delete(args.id); },
});
