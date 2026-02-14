/**
 * Factuur App - Company Settings
 */

import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// ========== QUERIES ==========

export const getCompanySettings = query({
  args: { userId: v.id("zzp_users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("fact_company_settings")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();
  },
});

// ========== MUTATIONS ==========

export const createCompanySettings = mutation({
  args: {
    userId: v.id("zzp_users"),
    naam: v.string(),
    kvk: v.string(),
    iban: v.string(),
    email: v.string(),
    adres: v.object({
      straat: v.string(),
      huisnummer: v.string(),
      postcode: v.string(),
      plaats: v.string(),
      land: v.optional(v.string()),
    }),
    btw_nummer: v.optional(v.string()),
    bic: v.optional(v.string()),
    telefoon: v.optional(v.string()),
    website: v.optional(v.string()),
    logo_url: v.optional(v.string()),
    invoice_prefix: v.optional(v.string()),
    default_payment_terms: v.optional(v.number()),
    default_template: v.optional(v.string()),
    footer_text: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if settings already exist
    const existing = await ctx.db
      .query("fact_company_settings")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();

    if (existing) {
      throw new Error("Company settings already exist. Use update instead.");
    }

    const now = Date.now();
    const settingsId = await ctx.db.insert("fact_company_settings", {
      userId: args.userId,
      naam: args.naam,
      kvk: args.kvk,
      iban: args.iban,
      email: args.email,
      adres: args.adres,
      btw_nummer: args.btw_nummer,
      bic: args.bic,
      telefoon: args.telefoon,
      website: args.website,
      logo_url: args.logo_url,
      invoice_prefix: args.invoice_prefix || "INV",
      invoice_number: 1, // Start counter at 1
      default_payment_terms: args.default_payment_terms || 14, // 14 days default
      default_template: args.default_template || "default",
      footer_text: args.footer_text,
      createdAt: now,
      updatedAt: now,
    });

    return settingsId;
  },
});

export const updateCompanySettings = mutation({
  args: {
    settingsId: v.id("fact_company_settings"),
    naam: v.optional(v.string()),
    adres: v.optional(v.object({
      straat: v.string(),
      huisnummer: v.string(),
      postcode: v.string(),
      plaats: v.string(),
      land: v.optional(v.string()),
    })),
    btw_nummer: v.optional(v.string()),
    iban: v.optional(v.string()),
    bic: v.optional(v.string()),
    email: v.optional(v.string()),
    telefoon: v.optional(v.string()),
    website: v.optional(v.string()),
    logo_url: v.optional(v.string()),
    invoice_prefix: v.optional(v.string()),
    default_payment_terms: v.optional(v.number()),
    default_template: v.optional(v.string()),
    footer_text: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { settingsId, ...updates } = args;

    await ctx.db.patch(settingsId, {
      ...updates,
      updatedAt: Date.now(),
    });

    return settingsId;
  },
});

export const updateInvoiceCounter = mutation({
  args: {
    settingsId: v.id("fact_company_settings"),
    invoice_number: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.settingsId, {
      invoice_number: args.invoice_number,
      updatedAt: Date.now(),
    });
  },
});

export const updateLogo = mutation({
  args: {
    settingsId: v.id("fact_company_settings"),
    logo_url: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.settingsId, {
      logo_url: args.logo_url,
      updatedAt: Date.now(),
    });
  },
});
