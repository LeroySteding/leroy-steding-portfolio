import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAuth } from "./_helpers";

// List all settings with optional locale filter
export const list = query({
  args: {
    locale: v.optional(v.union(v.literal("en"), v.literal("nl"))),
  },
  handler: async (ctx, args) => {
    let settings = await ctx.db.query("site_settings").collect();

    if (args.locale) {
      settings = settings.filter(
        (setting) => setting.locale === args.locale || !setting.locale,
      );
    }

    return settings.sort((a, b) => a.key.localeCompare(b.key));
  },
});

// Get a setting by key
export const getByKey = query({
  args: {
    key: v.string(),
    locale: v.optional(v.union(v.literal("en"), v.literal("nl"))),
  },
  handler: async (ctx, args) => {
    const settings = await ctx.db
      .query("site_settings")
      .withIndex("by_key", (q) => q.eq("key", args.key))
      .collect();

    if (args.locale) {
      const localizedSetting = settings.find(
        (setting) => setting.locale === args.locale,
      );
      if (localizedSetting) return localizedSetting;
    }

    // Return first match or null
    return settings[0] ?? null;
  },
});

// Get a single setting by ID
export const getById = query({
  args: { id: v.id("site_settings") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Public push mutation for agents (no auth required, upsert)
export const push = mutation({
  args: {
    key: v.string(), value: v.any(),
    locale: v.optional(v.union(v.literal("en"), v.literal("nl"))),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query("site_settings")
      .withIndex("by_key", (q) => q.eq("key", args.key))
      .collect();
    const match = args.locale ? existing.find((s) => s.locale === args.locale) : existing[0];
    if (match) {
      await ctx.db.patch(match._id, { value: args.value, description: args.description });
      return match._id;
    }
    return await ctx.db.insert("site_settings", { ...args, updatedBy: "agent" });
  },
});

// Create or update a setting (upsert)
export const upsert = mutation({
  args: {
    key: v.string(),
    value: v.any(),
    locale: v.optional(v.union(v.literal("en"), v.literal("nl"))),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await requireAuth(ctx);

    // Check if setting already exists
    const existingSettings = await ctx.db
      .query("site_settings")
      .withIndex("by_key", (q) => q.eq("key", args.key))
      .collect();

    const existingSetting = args.locale
      ? existingSettings.find((s) => s.locale === args.locale)
      : existingSettings[0];

    if (existingSetting) {
      // Update existing setting
      await ctx.db.patch(existingSetting._id, {
        value: args.value,
        description: args.description,
        updatedBy: userId,
      });
      return existingSetting._id;
    } else {
      // Create new setting
      const settingId = await ctx.db.insert("site_settings", {
        key: args.key,
        value: args.value,
        locale: args.locale,
        description: args.description,
        updatedBy: userId,
      });
      return settingId;
    }
  },
});

// Delete a setting
export const remove = mutation({
  args: { id: v.id("site_settings") },
  handler: async (ctx, args) => {
    await requireAuth(ctx);
    await ctx.db.delete(args.id);
    return args.id;
  },
});
