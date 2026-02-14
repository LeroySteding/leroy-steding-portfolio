/**
 * Factuur App - Clients Management
 */

import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// ========== QUERIES ==========

export const listClients = query({
  args: {
    userId: v.id("zzp_users"),
    activeOnly: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db
      .query("fact_clients")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc");

    if (args.activeOnly) {
      query = query.filter((q) => q.eq(q.field("active"), true));
    }

    return await query.collect();
  },
});

export const getClient = query({
  args: { clientId: v.id("fact_clients") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.clientId);
  },
});

export const getClientByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("fact_clients")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
  },
});

export const searchClients = query({
  args: {
    userId: v.id("zzp_users"),
    searchTerm: v.string(),
  },
  handler: async (ctx, args) => {
    const results = await ctx.db
      .query("fact_clients")
      .withSearchIndex("search_naam", (q) =>
        q.search("naam", args.searchTerm).eq("userId", args.userId)
      )
      .collect();

    return results;
  },
});

export const getClientStats = query({
  args: { clientId: v.id("fact_clients") },
  handler: async (ctx, args) => {
    const invoices = await ctx.db
      .query("fact_invoices")
      .withIndex("by_client", (q) => q.eq("clientId", args.clientId))
      .collect();

    const stats = {
      totalInvoices: invoices.length,
      totalInvoiced: 0,
      totalPaid: 0,
      outstandingBalance: 0,
      overdueCount: 0,
      averageInvoiceValue: 0,
      lastInvoiceDate: null as number | null,
    };

    const now = Date.now();
    
    for (const invoice of invoices) {
      stats.totalInvoiced += invoice.total;
      
      if (invoice.status === "betaald") {
        stats.totalPaid += invoice.total;
      } else if (invoice.status !== "geannuleerd") {
        stats.outstandingBalance += invoice.total;
        
        if (invoice.due_date < now) {
          stats.overdueCount += 1;
        }
      }

      if (!stats.lastInvoiceDate || invoice.invoice_date > stats.lastInvoiceDate) {
        stats.lastInvoiceDate = invoice.invoice_date;
      }
    }

    stats.averageInvoiceValue = stats.totalInvoices > 0
      ? Math.round(stats.totalInvoiced / stats.totalInvoices)
      : 0;

    return stats;
  },
});

// ========== MUTATIONS ==========

export const createClient = mutation({
  args: {
    userId: v.id("zzp_users"),
    naam: v.string(),
    email: v.string(),
    bedrijf: v.optional(v.string()),
    adres: v.object({
      straat: v.string(),
      huisnummer: v.string(),
      postcode: v.string(),
      plaats: v.string(),
      land: v.optional(v.string()),
    }),
    phone: v.optional(v.string()),
    kvk: v.optional(v.string()),
    btw_nummer: v.optional(v.string()),
    betalingstermijn: v.optional(v.number()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if client with same email already exists for this user
    const existing = await ctx.db
      .query("fact_clients")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .first();

    if (existing) {
      throw new Error("Client with this email already exists");
    }

    const now = Date.now();
    const clientId = await ctx.db.insert("fact_clients", {
      userId: args.userId,
      naam: args.naam,
      email: args.email,
      bedrijf: args.bedrijf,
      adres: args.adres,
      phone: args.phone,
      kvk: args.kvk,
      btw_nummer: args.btw_nummer,
      betalingstermijn: args.betalingstermijn || 14, // Default 14 days
      notes: args.notes,
      active: true,
      createdAt: now,
      updatedAt: now,
    });

    return clientId;
  },
});

export const updateClient = mutation({
  args: {
    clientId: v.id("fact_clients"),
    naam: v.optional(v.string()),
    email: v.optional(v.string()),
    bedrijf: v.optional(v.string()),
    adres: v.optional(v.object({
      straat: v.string(),
      huisnummer: v.string(),
      postcode: v.string(),
      plaats: v.string(),
      land: v.optional(v.string()),
    })),
    phone: v.optional(v.string()),
    kvk: v.optional(v.string()),
    btw_nummer: v.optional(v.string()),
    betalingstermijn: v.optional(v.number()),
    notes: v.optional(v.string()),
    active: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { clientId, ...updates } = args;

    await ctx.db.patch(clientId, {
      ...updates,
      updatedAt: Date.now(),
    });

    return clientId;
  },
});

export const deactivateClient = mutation({
  args: { clientId: v.id("fact_clients") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.clientId, {
      active: false,
      updatedAt: Date.now(),
    });
  },
});

export const reactivateClient = mutation({
  args: { clientId: v.id("fact_clients") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.clientId, {
      active: true,
      updatedAt: Date.now(),
    });
  },
});

export const deleteClient = mutation({
  args: { clientId: v.id("fact_clients") },
  handler: async (ctx, args) => {
    // Check if client has invoices
    const invoices = await ctx.db
      .query("fact_invoices")
      .withIndex("by_client", (q) => q.eq("clientId", args.clientId))
      .first();

    if (invoices) {
      throw new Error("Cannot delete client with existing invoices. Deactivate instead.");
    }

    await ctx.db.delete(args.clientId);
  },
});

export const updateClientBalances = mutation({
  args: { clientId: v.id("fact_clients") },
  handler: async (ctx, args) => {
    const invoices = await ctx.db
      .query("fact_invoices")
      .withIndex("by_client", (q) => q.eq("clientId", args.clientId))
      .collect();

    let totalInvoiced = 0;
    let outstandingBalance = 0;

    for (const invoice of invoices) {
      totalInvoiced += invoice.total;
      
      if (invoice.status !== "betaald" && invoice.status !== "geannuleerd") {
        outstandingBalance += invoice.total;
      }
    }

    await ctx.db.patch(args.clientId, {
      totalInvoiced,
      outstandingBalance,
      updatedAt: Date.now(),
    });

    return { totalInvoiced, outstandingBalance };
  },
});
