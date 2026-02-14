/**
 * ZZP Users - Shared across all ZZP SaaS apps
 */

import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// ========== QUERIES ==========

export const getCurrentUser = query({
  args: { clerkUserId: v.optional(v.string()), email: v.optional(v.string()) },
  handler: async (ctx, args) => {
    if (args.clerkUserId) {
      return await ctx.db
        .query("zzp_users")
        .withIndex("by_clerk_user", (q) => q.eq("clerkUserId", args.clerkUserId))
        .first();
    }
    if (args.email) {
      return await ctx.db
        .query("zzp_users")
        .withIndex("by_email", (q) => q.eq("email", args.email))
        .first();
    }
    return null;
  },
});

export const getUserById = query({
  args: { userId: v.id("zzp_users") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.userId);
  },
});

export const getUserByKvk = query({
  args: { kvk: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("zzp_users")
      .withIndex("by_kvk", (q) => q.eq("kvk", args.kvk))
      .first();
  },
});

export const listUsersByPlan = query({
  args: { plan: v.union(v.literal("free"), v.literal("pro"), v.literal("enterprise")) },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("zzp_users")
      .withIndex("by_plan", (q) => q.eq("plan", args.plan))
      .collect();
  },
});

// ========== MUTATIONS ==========

export const createUser = mutation({
  args: {
    email: v.string(),
    naam: v.string(),
    kvk: v.string(),
    bedrijf: v.optional(v.string()),
    btw_nummer: v.optional(v.string()),
    plan: v.optional(v.union(v.literal("free"), v.literal("pro"), v.literal("enterprise"))),
    clerkUserId: v.optional(v.string()),
    phone: v.optional(v.string()),
    iban: v.optional(v.string()),
    adres: v.optional(v.object({
      straat: v.string(),
      huisnummer: v.string(),
      postcode: v.string(),
      plaats: v.string(),
      land: v.optional(v.string()),
    })),
  },
  handler: async (ctx, args) => {
    // Check if user already exists
    const existing = await ctx.db
      .query("zzp_users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (existing) {
      throw new Error("User with this email already exists");
    }

    const now = Date.now();
    const userId = await ctx.db.insert("zzp_users", {
      email: args.email,
      naam: args.naam,
      kvk: args.kvk,
      bedrijf: args.bedrijf,
      btw_nummer: args.btw_nummer,
      plan: args.plan || "free",
      clerkUserId: args.clerkUserId,
      phone: args.phone,
      iban: args.iban,
      adres: args.adres,
      createdAt: now,
      updatedAt: now,
    });

    return userId;
  },
});

export const updateUser = mutation({
  args: {
    userId: v.id("zzp_users"),
    naam: v.optional(v.string()),
    bedrijf: v.optional(v.string()),
    btw_nummer: v.optional(v.string()),
    phone: v.optional(v.string()),
    iban: v.optional(v.string()),
    adres: v.optional(v.object({
      straat: v.string(),
      huisnummer: v.string(),
      postcode: v.string(),
      plaats: v.string(),
      land: v.optional(v.string()),
    })),
    metadata: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const { userId, ...updates } = args;
    
    await ctx.db.patch(userId, {
      ...updates,
      updatedAt: Date.now(),
    });

    return userId;
  },
});

export const upgradePlan = mutation({
  args: {
    userId: v.id("zzp_users"),
    plan: v.union(v.literal("free"), v.literal("pro"), v.literal("enterprise")),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.userId, {
      plan: args.plan,
      updatedAt: Date.now(),
    });

    return args.userId;
  },
});

export const deleteUser = mutation({
  args: { userId: v.id("zzp_users") },
  handler: async (ctx, args) => {
    // Note: In production, you'd want to handle cascading deletes
    // or mark as deleted rather than actually deleting
    await ctx.db.delete(args.userId);
  },
});
