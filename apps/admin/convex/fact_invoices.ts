/**
 * Factuur App - Invoices Management
 */

import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// ========== QUERIES ==========

export const listInvoices = query({
  args: {
    userId: v.id("zzp_users"),
    status: v.optional(v.union(
      v.literal("concept"),
      v.literal("verzonden"),
      v.literal("betaald"),
      v.literal("achterstallig"),
      v.literal("geannuleerd")
    )),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let invoicesQuery = ctx.db
      .query("fact_invoices")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc");

    if (args.status) {
      invoicesQuery = invoicesQuery.filter((q) => q.eq(q.field("status"), args.status));
    }

    if (args.limit) {
      return await invoicesQuery.take(args.limit);
    }

    return await invoicesQuery.collect();
  },
});

export const getInvoice = query({
  args: { invoiceId: v.id("fact_invoices") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.invoiceId);
  },
});

export const getInvoiceByNumber = query({
  args: { nummer: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("fact_invoices")
      .withIndex("by_nummer", (q) => q.eq("nummer", args.nummer))
      .first();
  },
});

export const getInvoicesByClient = query({
  args: { clientId: v.id("fact_clients") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("fact_invoices")
      .withIndex("by_client", (q) => q.eq("clientId", args.clientId))
      .order("desc")
      .collect();
  },
});

export const getOverdueInvoices = query({
  args: { userId: v.id("zzp_users") },
  handler: async (ctx, args) => {
    const now = Date.now();
    const invoices = await ctx.db
      .query("fact_invoices")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    return invoices.filter(
      (inv) => inv.due_date < now && inv.status !== "betaald" && inv.status !== "geannuleerd"
    );
  },
});

export const getInvoiceStats = query({
  args: {
    userId: v.id("zzp_users"),
    year: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let invoices = await ctx.db
      .query("fact_invoices")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    if (args.year) {
      const yearStart = new Date(args.year, 0, 1).getTime();
      const yearEnd = new Date(args.year, 11, 31, 23, 59, 59).getTime();
      invoices = invoices.filter(
        (inv) => inv.invoice_date >= yearStart && inv.invoice_date <= yearEnd
      );
    }

    const stats = {
      total: invoices.length,
      concept: 0,
      verzonden: 0,
      betaald: 0,
      achterstallig: 0,
      geannuleerd: 0,
      totalAmount: 0,
      paidAmount: 0,
      outstandingAmount: 0,
      averageValue: 0,
    };

    for (const invoice of invoices) {
      stats[invoice.status] = (stats[invoice.status] || 0) + 1;
      stats.totalAmount += invoice.total;
      
      if (invoice.status === "betaald") {
        stats.paidAmount += invoice.total;
      } else if (invoice.status !== "geannuleerd") {
        stats.outstandingAmount += invoice.total;
      }
    }

    stats.averageValue = stats.total > 0 ? Math.round(stats.totalAmount / stats.total) : 0;

    return stats;
  },
});

export const getRecurringInvoices = query({
  args: { userId: v.id("zzp_users") },
  handler: async (ctx, args) => {
    const allInvoices = await ctx.db
      .query("fact_invoices")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    return allInvoices.filter(
      (inv) => inv.recurring !== undefined && inv.recurring.active
    );
  },
});

// ========== MUTATIONS ==========

export const createInvoice = mutation({
  args: {
    userId: v.id("zzp_users"),
    clientId: v.id("fact_clients"),
    items: v.array(v.object({
      omschrijving: v.string(),
      aantal: v.number(),
      eenheidsprijs: v.number(),
      btw_tarief: v.union(v.literal(21), v.literal(9), v.literal(0)),
    })),
    invoice_date: v.number(),
    payment_terms: v.number(), // days
    template: v.optional(v.union(
      v.literal("default"),
      v.literal("modern"),
      v.literal("minimal"),
      v.literal("professional")
    )),
    notes: v.optional(v.string()),
    internalNotes: v.optional(v.string()),
    recurring: v.optional(v.object({
      frequency: v.union(
        v.literal("maandelijks"),
        v.literal("kwartaal"),
        v.literal("jaarlijks")
      ),
      nextInvoiceDate: v.optional(v.number()),
      endDate: v.optional(v.number()),
      active: v.boolean(),
    })),
  },
  handler: async (ctx, args) => {
    // Get company settings to generate invoice number
    const settings = await ctx.db
      .query("fact_company_settings")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();

    if (!settings) {
      throw new Error("Company settings not found. Please set up your company profile first.");
    }

    // Generate invoice number
    const invoiceNumber = `${settings.invoice_prefix}-${args.invoice_date.toString().slice(0, 4)}-${String(settings.invoice_number).padStart(3, '0')}`;

    // Calculate totals
    let subtotal = 0;
    let btw = 0;
    const processedItems = args.items.map(item => {
      const itemSubtotal = item.aantal * item.eenheidsprijs;
      const itemBtw = Math.round((itemSubtotal * item.btw_tarief) / 100);
      subtotal += itemSubtotal;
      btw += itemBtw;
      
      return {
        ...item,
        subtotaal: itemSubtotal,
      };
    });

    const total = subtotal + btw;
    const due_date = args.invoice_date + (args.payment_terms * 24 * 60 * 60 * 1000);

    const now = Date.now();
    const invoiceId = await ctx.db.insert("fact_invoices", {
      userId: args.userId,
      clientId: args.clientId,
      nummer: invoiceNumber,
      items: processedItems,
      subtotal,
      btw,
      total,
      status: "concept",
      invoice_date: args.invoice_date,
      due_date,
      template: args.template || "default",
      notes: args.notes,
      internalNotes: args.internalNotes,
      recurring: args.recurring,
      createdAt: now,
      updatedAt: now,
    });

    // Increment invoice number
    await ctx.db.patch(settings._id, {
      invoice_number: settings.invoice_number + 1,
    });

    return invoiceId;
  },
});

export const updateInvoice = mutation({
  args: {
    invoiceId: v.id("fact_invoices"),
    items: v.optional(v.array(v.object({
      omschrijving: v.string(),
      aantal: v.number(),
      eenheidsprijs: v.number(),
      btw_tarief: v.union(v.literal(21), v.literal(9), v.literal(0)),
      subtotaal: v.number(),
    }))),
    status: v.optional(v.union(
      v.literal("concept"),
      v.literal("verzonden"),
      v.literal("betaald"),
      v.literal("achterstallig"),
      v.literal("geannuleerd")
    )),
    invoice_date: v.optional(v.number()),
    due_date: v.optional(v.number()),
    paid_date: v.optional(v.number()),
    template: v.optional(v.union(
      v.literal("default"),
      v.literal("modern"),
      v.literal("minimal"),
      v.literal("professional")
    )),
    pdf_url: v.optional(v.string()),
    notes: v.optional(v.string()),
    internalNotes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { invoiceId, items, ...otherUpdates } = args;
    const invoice = await ctx.db.get(invoiceId);

    if (!invoice) {
      throw new Error("Invoice not found");
    }

    // Recalculate totals if items changed
    let updates: any = { ...otherUpdates };
    if (items) {
      let subtotal = 0;
      let btw = 0;

      for (const item of items) {
        subtotal += item.subtotaal;
        btw += Math.round((item.subtotaal * item.btw_tarief) / 100);
      }

      updates.items = items;
      updates.subtotal = subtotal;
      updates.btw = btw;
      updates.total = subtotal + btw;
    }

    // Auto-set paid_date when status changes to betaald
    if (updates.status === "betaald" && !updates.paid_date) {
      updates.paid_date = Date.now();
    }

    await ctx.db.patch(invoiceId, {
      ...updates,
      updatedAt: Date.now(),
    });

    return invoiceId;
  },
});

export const markInvoiceSent = mutation({
  args: {
    invoiceId: v.id("fact_invoices"),
    sentTo: v.array(v.string()),
    pdf_url: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.invoiceId, {
      status: "verzonden",
      sentTo: args.sentTo,
      pdf_url: args.pdf_url,
      updatedAt: Date.now(),
    });
  },
});

export const markInvoicePaid = mutation({
  args: {
    invoiceId: v.id("fact_invoices"),
    paid_date: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.invoiceId, {
      status: "betaald",
      paid_date: args.paid_date || Date.now(),
      updatedAt: Date.now(),
    });
  },
});

export const deleteInvoice = mutation({
  args: { invoiceId: v.id("fact_invoices") },
  handler: async (ctx, args) => {
    const invoice = await ctx.db.get(args.invoiceId);
    
    if (!invoice) {
      throw new Error("Invoice not found");
    }

    // Only allow deletion of concept invoices
    if (invoice.status !== "concept") {
      throw new Error("Only concept invoices can be deleted. Use cancel instead.");
    }

    await ctx.db.delete(args.invoiceId);
  },
});

export const cancelInvoice = mutation({
  args: { invoiceId: v.id("fact_invoices") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.invoiceId, {
      status: "geannuleerd",
      updatedAt: Date.now(),
    });
  },
});

export const duplicateInvoice = mutation({
  args: {
    invoiceId: v.id("fact_invoices"),
    invoice_date: v.number(),
  },
  handler: async (ctx, args) => {
    const original = await ctx.db.get(args.invoiceId);
    
    if (!original) {
      throw new Error("Invoice not found");
    }

    // Get company settings for new number
    const settings = await ctx.db
      .query("fact_company_settings")
      .withIndex("by_user", (q) => q.eq("userId", original.userId))
      .first();

    if (!settings) {
      throw new Error("Company settings not found");
    }

    const invoiceNumber = `${settings.invoice_prefix}-${args.invoice_date.toString().slice(0, 4)}-${String(settings.invoice_number).padStart(3, '0')}`;
    
    const now = Date.now();
    const { _id, _creationTime, ...invoiceData } = original;
    const newInvoiceId = await ctx.db.insert("fact_invoices", {
      ...invoiceData,
      nummer: invoiceNumber,
      invoice_date: args.invoice_date,
      due_date: args.invoice_date + (14 * 24 * 60 * 60 * 1000), // 14 days default
      status: "concept",
      pdf_url: undefined,
      sentTo: undefined,
      paid_date: undefined,
      createdAt: now,
      updatedAt: now,
    });

    // Increment invoice number
    await ctx.db.patch(settings._id, {
      invoice_number: settings.invoice_number + 1,
    });

    return newInvoiceId;
  },
});
