import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

/**
 * List all content
 */
export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query("content_calendar").order("desc").collect();
  },
});

/**
 * Get content statistics
 */
export const stats = query({
  handler: async (ctx) => {
    const content = await ctx.db.query("content_calendar").collect();
    const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

    return {
      ideas: content.filter((c) => c.status === "idea").length,
      inProgress: content.filter((c) => ["outline", "drafting", "review"].includes(c.status)).length,
      publishedThisWeek: content.filter(
        (c) => c.status === "published" && c.createdAt > oneWeekAgo
      ).length,
      totalPublished: content.filter((c) => c.status === "published").length,
    };
  },
});

/**
 * Update content status
 */
export const updateStatus = mutation({
  args: {
    id: v.id("content_calendar"),
    status: v.union(
      v.literal("idea"),
      v.literal("outline"),
      v.literal("drafting"),
      v.literal("review"),
      v.literal("scheduled"),
      v.literal("published")
    ),
  },
  handler: async (ctx, { id, status }) => {
    const updates: any = { status };
    
    // Set publishedAt when publishing
    if (status === "published") {
      updates.publishedAt = Date.now();
    }
    
    await ctx.db.patch(id, updates);
  },
});

/**
 * Create new content
 */
export const create = mutation({
  args: {
    title: v.string(),
    type: v.union(
      v.literal("blog_post"),
      v.literal("social_post"),
      v.literal("newsletter"),
      v.literal("video"),
      v.literal("podcast"),
      v.literal("case_study")
    ),
    status: v.optional(
      v.union(
        v.literal("idea"),
        v.literal("outline"),
        v.literal("drafting"),
        v.literal("review"),
        v.literal("scheduled"),
        v.literal("published")
      )
    ),
    platform: v.optional(v.string()),
    notes: v.optional(v.string()),
    seoKeywords: v.optional(v.array(v.string())),
    createdAt: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("content_calendar", {
      ...args,
      status: args.status || "idea",
    });
  },
});
