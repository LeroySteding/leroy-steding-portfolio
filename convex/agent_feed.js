import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAuth } from "./_helpers";
const feedType = v.union(v.literal("news"), v.literal("trend"), v.literal("alert"), v.literal("task_update"), v.literal("deploy"), v.literal("pr"), v.literal("briefing"), v.literal("insight"));
const priority = v.union(v.literal("low"), v.literal("medium"), v.literal("high"), v.literal("critical"));
// Public push mutation for agents (no auth required)
export const push = mutation({
    args: {
        type: feedType,
        title: v.string(),
        content: v.string(),
        source: v.optional(v.string()),
        tags: v.optional(v.array(v.string())),
        priority: v.optional(priority),
        metadata: v.optional(v.any()),
    },
    handler: async (ctx, args) => {
        // Dedup: check if same title+source already exists
        const existing = await ctx.db.query("agent_feed")
            .withIndex("by_title_source", (q) => q.eq("title", args.title).eq("source", args.source ?? undefined))
            .first();
        if (existing) {
            await ctx.db.patch(existing._id, { content: args.content, priority: args.priority ?? existing.priority, metadata: args.metadata ?? existing.metadata });
            return existing._id;
        }
        return await ctx.db.insert("agent_feed", {
            type: args.type,
            title: args.title,
            content: args.content,
            source: args.source,
            tags: args.tags ?? [],
            priority: args.priority ?? "medium",
            read: false,
            metadata: args.metadata,
            createdAt: Date.now(),
        });
    },
});
export const list = query({
    args: {
        type: v.optional(feedType),
        priority: v.optional(priority),
        unreadOnly: v.optional(v.boolean()),
        limit: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        let items = await ctx.db.query("agent_feed").order("desc").collect();
        if (args.type)
            items = items.filter((i) => i.type === args.type);
        if (args.priority)
            items = items.filter((i) => i.priority === args.priority);
        if (args.unreadOnly)
            items = items.filter((i) => !i.read);
        return items.slice(0, args.limit ?? 50);
    },
});
export const get = query({
    args: { id: v.id("agent_feed") },
    handler: async (ctx, args) => ctx.db.get(args.id),
});
export const unreadCount = query({
    args: {},
    handler: async (ctx) => {
        const items = await ctx.db.query("agent_feed").withIndex("by_read", (q) => q.eq("read", false)).collect();
        return items.length;
    },
});
export const markRead = mutation({
    args: { id: v.id("agent_feed") },
    handler: async (ctx, args) => {
        await requireAuth(ctx);
        await ctx.db.patch(args.id, { read: true });
    },
});
export const markAllRead = mutation({
    args: {},
    handler: async (ctx) => {
        await requireAuth(ctx);
        const unread = await ctx.db.query("agent_feed").withIndex("by_read", (q) => q.eq("read", false)).collect();
        for (const item of unread) {
            await ctx.db.patch(item._id, { read: true });
        }
    },
});
export const remove = mutation({
    args: { id: v.id("agent_feed") },
    handler: async (ctx, args) => {
        await requireAuth(ctx);
        await ctx.db.delete(args.id);
    },
});
