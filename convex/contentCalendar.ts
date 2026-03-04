import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const list: any = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("content_calendar").collect();
  },
});

export const getById: any = query({
  args: { id: v.id("content_calendar") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

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
    status: v.union(
      v.literal("idea"),
      v.literal("outline"),
      v.literal("drafting"),
      v.literal("review"),
      v.literal("scheduled"),
      v.literal("published")
    ),
    platform: v.optional(v.string()),
    targetDate: v.optional(v.number()),
    notes: v.optional(v.string()),
    seoKeywords: v.optional(v.array(v.string())),
    relatedBlogPostId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("content_calendar", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("content_calendar"),
    title: v.optional(v.string()),
    type: v.optional(
      v.union(
        v.literal("blog_post"),
        v.literal("social_post"),
        v.literal("newsletter"),
        v.literal("video"),
        v.literal("podcast"),
        v.literal("case_study")
      )
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
    targetDate: v.optional(v.number()),
    notes: v.optional(v.string()),
    seoKeywords: v.optional(v.array(v.string())),
    relatedBlogPostId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
  },
});

export const remove = mutation({
  args: { id: v.id("content_calendar") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const archive = mutation({
  args: { id: v.id("content_calendar") },
  handler: async (ctx, args) => {
    // Instead of archiving, delete the content calendar item
    await ctx.db.delete(args.id);
  },
});
