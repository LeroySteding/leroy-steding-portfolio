import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// Get user's alerts
export const list = query({
  args: {
    includeRead: v.optional(v.boolean()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { includeRead = false, limit = 50 }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    let alertsQuery = ctx.db
      .query("alerts")
      .withIndex("by_user_read", (q) => q.eq("clerkUserId", identity.subject));

    if (!includeRead) {
      alertsQuery = alertsQuery.filter((q) => q.eq(q.field("read"), false));
    }

    return await alertsQuery.order("desc").take(limit);
  },
});

// Create alert
export const create = mutation({
  args: {
    type: v.union(
      v.literal("job_match"),
      v.literal("trend_spike"),
      v.literal("competitor_activity"),
      v.literal("opportunity")
    ),
    title: v.string(),
    message: v.string(),
    data: v.any(),
    priority: v.union(
      v.literal("low"),
      v.literal("medium"),
      v.literal("high"),
      v.literal("urgent")
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    return await ctx.db.insert("alerts", {
      clerkUserId: identity.subject,
      ...args,
      read: false,
      dismissed: false,
      sentToTelegram: false,
      createdAt: Date.now(),
    });
  },
});

// Mark as read
export const markRead = mutation({
  args: {
    id: v.id("alerts"),
  },
  handler: async (ctx, { id }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const alert = await ctx.db.get(id);
    if (!alert || alert.clerkUserId !== identity.subject) {
      throw new Error("Alert not found");
    }

    await ctx.db.patch(id, { read: true });
  },
});

// Dismiss alert
export const dismiss = mutation({
  args: {
    id: v.id("alerts"),
  },
  handler: async (ctx, { id }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const alert = await ctx.db.get(id);
    if (!alert || alert.clerkUserId !== identity.subject) {
      throw new Error("Alert not found");
    }

    await ctx.db.patch(id, { dismissed: true });
  },
});

// Get unread count
export const unreadCount = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const unread = await ctx.db
      .query("alerts")
      .withIndex("by_user_read", (q) =>
        q.eq("clerkUserId", identity.subject).eq("read", false)
      )
      .collect();

    return unread.length;
  },
});
