import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAuth } from "./_helpers";

// List all skills with optional filters
export const list: any = query({
  args: {
    locale: v.optional(v.union(v.literal("en"), v.literal("nl"))),
    category: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let skills = await ctx.db.query("skills").collect();

    if (args.locale) {
      skills = skills.filter((skill) => skill.locale === args.locale);
    }

    if (args.category) {
      skills = skills.filter((skill) => skill.category === args.category);
    }

    return skills.sort((a, b) => {
      // Sort by order first if specified
      if (a.order !== undefined && b.order !== undefined) {
        return a.order - b.order;
      }
      // Then by proficiency (highest first)
      return b.proficiency - a.proficiency;
    });
  },
});

// Get a single skill by ID
export const getById: any = query({
  args: { id: v.id("skills") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Get a skill by name
export const getByName: any = query({
  args: { name: v.string() },
  handler: async (ctx, args) => {
    const skills = await ctx.db
      .query("skills")
      .withIndex("by_name", (q) => q.eq("name", args.name))
      .collect();
    return skills[0];
  },
});

// Public push mutation for agents (no auth required)
export const push = mutation({
  args: {
    name: v.string(), category: v.string(), proficiency: v.number(),
    icon: v.optional(v.string()), iconUrl: v.optional(v.string()), color: v.optional(v.string()),
    yearsOfExperience: v.optional(v.number()), order: v.optional(v.number()),
    locale: v.optional(v.union(v.literal("en"), v.literal("nl"))), published: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    if (args.proficiency < 1 || args.proficiency > 100) throw new Error("Proficiency must be between 1 and 100");
    // Dedup: check if same name already exists
    const existing = await ctx.db.query("skills")
      .withIndex("by_name", (q) => q.eq("name", args.name))
      .first();
    if (existing) {
      await ctx.db.patch(existing._id, args);
      return existing._id;
    }
    return await ctx.db.insert("skills", args);
  },
});

// Create a new skill
export const create = mutation({
  args: {
    name: v.string(),
    category: v.string(),
    proficiency: v.number(),
    icon: v.optional(v.string()),
    iconUrl: v.optional(v.string()),
    color: v.optional(v.string()),
    yearsOfExperience: v.optional(v.number()),
    order: v.optional(v.number()),
    locale: v.optional(v.union(v.literal("en"), v.literal("nl"))),
    published: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    await requireAuth(ctx);

    // Validate proficiency range
    if (args.proficiency < 1 || args.proficiency > 100) {
      throw new Error("Proficiency must be between 1 and 100");
    }

    const skillId = await ctx.db.insert("skills", args);
    return skillId;
  },
});

// Update a skill
export const update = mutation({
  args: {
    id: v.id("skills"),
    name: v.optional(v.string()),
    category: v.optional(v.string()),
    proficiency: v.optional(v.number()),
    icon: v.optional(v.string()),
    iconUrl: v.optional(v.string()),
    color: v.optional(v.string()),
    yearsOfExperience: v.optional(v.number()),
    order: v.optional(v.number()),
    locale: v.optional(v.union(v.literal("en"), v.literal("nl"))),
    published: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    await requireAuth(ctx);

    const { id, ...updates } = args;
    const existingSkill = await ctx.db.get(id);

    if (!existingSkill) {
      throw new Error("Skill not found");
    }

    // Validate proficiency range if provided
    if (
      updates.proficiency !== undefined &&
      (updates.proficiency < 1 || updates.proficiency > 100)
    ) {
      throw new Error("Proficiency must be between 1 and 100");
    }

    await ctx.db.patch(id, updates);
    return id;
  },
});

// Delete a skill
export const remove = mutation({
  args: { id: v.id("skills") },
  handler: async (ctx, args) => {
    await requireAuth(ctx);
    await ctx.db.delete(args.id);
    return args.id;
  },
});

export const get = getById;
