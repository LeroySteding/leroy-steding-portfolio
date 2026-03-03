import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAuth } from "./_helpers";
// List all experiences with optional filters
export const list = query({
    args: {
        locale: v.optional(v.union(v.literal("en"), v.literal("nl"))),
        type: v.optional(v.union(v.literal("work"), v.literal("education"))),
    },
    handler: async (ctx, args) => {
        let experiences = await ctx.db.query("experiences").collect();
        if (args.locale) {
            experiences = experiences.filter((exp) => exp.locale === args.locale);
        }
        if (args.type) {
            experiences = experiences.filter((exp) => exp.type === args.type);
        }
        return experiences.sort((a, b) => {
            // Sort by order first if specified
            if (a.order !== undefined && b.order !== undefined) {
                return a.order - b.order;
            }
            // Then by start date (most recent first)
            return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
        });
    },
});
// Get a single experience by ID
export const getById = query({
    args: { id: v.id("experiences") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.id);
    },
});
// Public push mutation for agents (no auth required)
export const push = mutation({
    args: {
        title: v.string(), company: v.string(), position: v.optional(v.string()),
        description: v.optional(v.string()), content: v.optional(v.any()),
        location: v.optional(v.string()), logoUrl: v.optional(v.string()),
        startDate: v.string(), endDate: v.optional(v.string()), isCurrent: v.optional(v.boolean()),
        locale: v.union(v.literal("en"), v.literal("nl")),
        type: v.union(v.literal("work"), v.literal("education")),
        technologies: v.optional(v.array(v.string())), achievements: v.optional(v.array(v.string())),
        order: v.optional(v.number()), published: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        // Dedup: check if same company+title already exists
        const existing = await ctx.db.query("experiences")
            .withIndex("by_company", (q) => q.eq("company", args.company))
            .collect();
        const match = existing.find((i) => i.title === args.title);
        if (match) {
            await ctx.db.patch(match._id, args);
            return match._id;
        }
        return await ctx.db.insert("experiences", args);
    },
});
// Create a new experience
export const create = mutation({
    args: {
        title: v.string(),
        company: v.string(),
        position: v.optional(v.string()),
        description: v.optional(v.string()),
        content: v.optional(v.any()),
        location: v.optional(v.string()),
        logoUrl: v.optional(v.string()),
        startDate: v.string(),
        endDate: v.optional(v.string()),
        isCurrent: v.optional(v.boolean()),
        locale: v.union(v.literal("en"), v.literal("nl")),
        type: v.union(v.literal("work"), v.literal("education")),
        technologies: v.optional(v.array(v.string())),
        achievements: v.optional(v.array(v.string())),
        order: v.optional(v.number()),
        published: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        await requireAuth(ctx);
        const experienceId = await ctx.db.insert("experiences", args);
        return experienceId;
    },
});
// Update an experience
export const update = mutation({
    args: {
        id: v.id("experiences"),
        title: v.optional(v.string()),
        company: v.optional(v.string()),
        position: v.optional(v.string()),
        description: v.optional(v.string()),
        content: v.optional(v.any()),
        location: v.optional(v.string()),
        logoUrl: v.optional(v.string()),
        startDate: v.optional(v.string()),
        endDate: v.optional(v.string()),
        isCurrent: v.optional(v.boolean()),
        locale: v.optional(v.union(v.literal("en"), v.literal("nl"))),
        type: v.optional(v.union(v.literal("work"), v.literal("education"))),
        technologies: v.optional(v.array(v.string())),
        achievements: v.optional(v.array(v.string())),
        order: v.optional(v.number()),
        published: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        await requireAuth(ctx);
        const { id, ...updates } = args;
        const existingExperience = await ctx.db.get(id);
        if (!existingExperience) {
            throw new Error("Experience not found");
        }
        await ctx.db.patch(id, updates);
        return id;
    },
});
// Delete an experience
export const remove = mutation({
    args: { id: v.id("experiences") },
    handler: async (ctx, args) => {
        await requireAuth(ctx);
        await ctx.db.delete(args.id);
        return args.id;
    },
});
export const get = getById;
