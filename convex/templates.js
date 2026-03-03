import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
// List all published templates
export const list = query({
    args: {
        category: v.optional(v.string()),
        sortBy: v.optional(v.union(v.literal("newest"), v.literal("popular"), v.literal("price-low"), v.literal("price-high"))),
    },
    handler: async (ctx, args) => {
        let query = ctx.db
            .query("templates")
            .filter((q) => q.eq(q.field("published"), true));
        if (args.category && args.category !== "all") {
            query = query.filter((q) => q.eq(q.field("category"), args.category));
        }
        let templates = await query.collect();
        // Sort
        switch (args.sortBy) {
            case "popular":
                templates.sort((a, b) => b.salesCount - a.salesCount);
                break;
            case "price-low":
                templates.sort((a, b) => a.price - b.price);
                break;
            case "price-high":
                templates.sort((a, b) => b.price - a.price);
                break;
            case "newest":
            default:
                templates.sort((a, b) => b.createdAt - a.createdAt);
                break;
        }
        return templates;
    },
});
// Get single template by slug
export const getBySlug = query({
    args: { slug: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("templates")
            .withIndex("by_slug", (q) => q.eq("slug", args.slug))
            .first();
    },
});
// Get template by ID
export const get = query({
    args: { id: v.id("templates") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.id);
    },
});
// Create template (admin only)
export const create = mutation({
    args: {
        name: v.string(),
        slug: v.string(),
        tagline: v.string(),
        description: v.string(),
        price: v.number(),
        category: v.string(),
        stack: v.array(v.string()),
        features: v.array(v.string()),
        image: v.string(),
        demoUrl: v.string(),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("templates", {
            ...args,
            published: false,
            rating: 5.0,
            reviewCount: 0,
            salesCount: 0,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        });
    },
});
// Update template
export const update = mutation({
    args: {
        id: v.id("templates"),
        name: v.optional(v.string()),
        tagline: v.optional(v.string()),
        description: v.optional(v.string()),
        price: v.optional(v.number()),
        published: v.optional(v.boolean()),
        badge: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const { id, ...updates } = args;
        return await ctx.db.patch(id, {
            ...updates,
            updatedAt: Date.now(),
        });
    },
});
// Record purchase
export const recordPurchase = mutation({
    args: {
        templateId: v.id("templates"),
        buyerEmail: v.string(),
        buyerName: v.optional(v.string()),
        licenseType: v.union(v.literal("standard"), v.literal("pro"), v.literal("enterprise")),
        price: v.number(),
        stripeSessionId: v.string(),
    },
    handler: async (ctx, args) => {
        // Record purchase
        const purchaseId = await ctx.db.insert("template_purchases", {
            ...args,
            purchasedAt: Date.now(),
        });
        // Increment sales count
        const template = await ctx.db.get(args.templateId);
        if (template) {
            await ctx.db.patch(args.templateId, {
                salesCount: template.salesCount + 1,
            });
        }
        return purchaseId;
    },
});
