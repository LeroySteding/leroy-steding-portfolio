/**
 * Belastingbot - BTW Reports, Waitlist, Bank Imports
 */

import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// ========== BTW REPORTS ==========

export const listBtwReports = query({
  args: { userId: v.id("zzp_users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("belt_btw_reports")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();
  },
});

export const getBtwReport = query({
  args: {
    userId: v.id("zzp_users"),
    year: v.number(),
    quarter: v.union(v.literal(1), v.literal(2), v.literal(3), v.literal(4)),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("belt_btw_reports")
      .withIndex("by_user_quarter_year", (q) =>
        q.eq("userId", args.userId)
         .eq("year", args.year)
         .eq("quarter", args.quarter)
      )
      .first();
  },
});

export const createBtwReport = mutation({
  args: {
    userId: v.id("zzp_users"),
    kvk: v.string(),
    quarter: v.union(v.literal(1), v.literal(2), v.literal(3), v.literal(4)),
    year: v.number(),
    rubrieken: v.object({
      r1a: v.number(),
      r1b: v.number(),
      r1c: v.optional(v.number()),
      r1d: v.optional(v.number()),
      r1e: v.number(),
      r2a: v.optional(v.number()),
      r3a: v.optional(v.number()),
      r3b: v.optional(v.number()),
      r4a: v.optional(v.number()),
      r4b: v.optional(v.number()),
      r5a: v.optional(v.number()),
      r5b: v.number(),
      r5c: v.optional(v.number()),
      r5d: v.optional(v.number()),
      r5e: v.optional(v.number()),
      r5f: v.optional(v.number()),
      r5g: v.number(),
    }),
  },
  handler: async (ctx, args) => {
    // Check if report already exists
    const existing = await ctx.db
      .query("belt_btw_reports")
      .withIndex("by_user_quarter_year", (q) =>
        q.eq("userId", args.userId)
         .eq("year", args.year)
         .eq("quarter", args.quarter)
      )
      .first();

    if (existing) {
      throw new Error("BTW report for this quarter already exists");
    }

    const now = Date.now();
    const reportId = await ctx.db.insert("belt_btw_reports", {
      userId: args.userId,
      kvk: args.kvk,
      quarter: args.quarter,
      year: args.year,
      rubrieken: args.rubrieken,
      status: "concept",
      createdAt: now,
      updatedAt: now,
    });

    return reportId;
  },
});

export const updateBtwReport = mutation({
  args: {
    reportId: v.id("belt_btw_reports"),
    rubrieken: v.optional(v.object({
      r1a: v.number(),
      r1b: v.number(),
      r1c: v.optional(v.number()),
      r1d: v.optional(v.number()),
      r1e: v.number(),
      r2a: v.optional(v.number()),
      r3a: v.optional(v.number()),
      r3b: v.optional(v.number()),
      r4a: v.optional(v.number()),
      r4b: v.optional(v.number()),
      r5a: v.optional(v.number()),
      r5b: v.number(),
      r5c: v.optional(v.number()),
      r5d: v.optional(v.number()),
      r5e: v.optional(v.number()),
      r5f: v.optional(v.number()),
      r5g: v.number(),
    })),
    status: v.optional(v.union(
      v.literal("concept"),
      v.literal("ingediend"),
      v.literal("goedgekeurd"),
      v.literal("betaald")
    )),
    pdf_url: v.optional(v.string()),
    belastingdienst_reference: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { reportId, ...updates } = args;
    
    const updateData: any = { ...updates, updatedAt: Date.now() };
    
    if (updates.status === "ingediend" && !updates.belastingdienst_reference) {
      updateData.submittedAt = Date.now();
    }

    await ctx.db.patch(reportId, updateData);
    return reportId;
  },
});

export const generateBtwReportFromExpenses = mutation({
  args: {
    userId: v.id("zzp_users"),
    kvk: v.string(),
    year: v.number(),
    quarter: v.union(v.literal(1), v.literal(2), v.literal(3), v.literal(4)),
  },
  handler: async (ctx, args) => {
    // Calculate quarter date range
    const quarterStart = (args.quarter - 1) * 3;
    const startDate = new Date(args.year, quarterStart, 1).getTime();
    const endDate = new Date(args.year, quarterStart + 3, 0, 23, 59, 59).getTime();

    // Get expenses for the quarter
    const expenses = await ctx.db
      .query("belt_expenses")
      .withIndex("by_user_date", (q) =>
        q.eq("userId", args.userId)
         .gte("date", startDate)
         .lte("date", endDate)
      )
      .collect();

    // Calculate rubrieken from expenses
    // This is a simplified version - in production you'd need invoices too
    let voorbelasting = 0; // 5b

    for (const expense of expenses) {
      voorbelasting += expense.btw_amount;
    }

    const rubrieken = {
      r1a: 0, // You'd get this from invoices
      r1b: 0,
      r1e: 0,
      r5b: voorbelasting,
      r5g: -voorbelasting, // Simplified: assuming only expenses, no income
    };

    const now = Date.now();
    const reportId = await ctx.db.insert("belt_btw_reports", {
      userId: args.userId,
      kvk: args.kvk,
      quarter: args.quarter,
      year: args.year,
      rubrieken,
      status: "concept",
      createdAt: now,
      updatedAt: now,
    });

    return reportId;
  },
});

// ========== WAITLIST ==========

export const addToWaitlist = mutation({
  args: {
    email: v.string(),
    naam: v.optional(v.string()),
    bedrijf: v.optional(v.string()),
    source: v.optional(v.string()),
    referrer: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if already on waitlist
    const existing = await ctx.db
      .query("belt_waitlist")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (existing) {
      return existing._id;
    }

    const waitlistId = await ctx.db.insert("belt_waitlist", {
      email: args.email,
      naam: args.naam,
      bedrijf: args.bedrijf,
      source: args.source,
      referrer: args.referrer,
      inviteSent: false,
      convertedToUser: false,
      createdAt: Date.now(),
    });

    return waitlistId;
  },
});

export const getWaitlist = query({
  args: { 
    convertedOnly: v.optional(v.boolean()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db
      .query("belt_waitlist")
      .withIndex("by_created_at")
      .order("desc");

    if (args.convertedOnly !== undefined) {
      query = query.filter((q) => q.eq(q.field("convertedToUser"), args.convertedOnly));
    }

    if (args.limit) {
      return await query.take(args.limit);
    }

    return await query.collect();
  },
});

export const markWaitlistInvited = mutation({
  args: { waitlistId: v.id("belt_waitlist") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.waitlistId, {
      inviteSent: true,
      invitedAt: Date.now(),
    });
  },
});

export const convertWaitlistToUser = mutation({
  args: {
    waitlistId: v.id("belt_waitlist"),
    userId: v.id("zzp_users"),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.waitlistId, {
      convertedToUser: true,
      userId: args.userId,
    });
  },
});

// ========== BANK IMPORTS ==========

export const createBankImport = mutation({
  args: {
    userId: v.id("zzp_users"),
    bank_name: v.string(),
    file_name: v.string(),
    file_url: v.optional(v.string()),
    transactions: v.array(v.object({
      date: v.string(),
      description: v.string(),
      amount: v.number(),
      counterparty: v.optional(v.string()),
      counterparty_account: v.optional(v.string()),
      type: v.union(v.literal("debit"), v.literal("credit")),
    })),
  },
  handler: async (ctx, args) => {
    const transactionsWithMatch = args.transactions.map(t => ({
      ...t,
      matched: false,
      expenseId: undefined,
    }));

    const importId = await ctx.db.insert("belt_bank_imports", {
      userId: args.userId,
      bank_name: args.bank_name,
      file_name: args.file_name,
      file_url: args.file_url,
      transactions: transactionsWithMatch,
      status: "processing",
      totalTransactions: args.transactions.length,
      matchedCount: 0,
      createdAt: Date.now(),
    });

    return importId;
  },
});

export const listBankImports = query({
  args: { userId: v.id("zzp_users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("belt_bank_imports")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();
  },
});

export const matchTransactionToExpense = mutation({
  args: {
    importId: v.id("belt_bank_imports"),
    transactionIndex: v.number(),
    expenseId: v.id("belt_expenses"),
  },
  handler: async (ctx, args) => {
    const bankImport = await ctx.db.get(args.importId);
    if (!bankImport) {
      throw new Error("Bank import not found");
    }

    const transactions = [...bankImport.transactions];
    if (args.transactionIndex >= transactions.length) {
      throw new Error("Transaction index out of bounds");
    }

    transactions[args.transactionIndex].matched = true;
    transactions[args.transactionIndex].expenseId = args.expenseId;

    const matchedCount = transactions.filter(t => t.matched).length;

    await ctx.db.patch(args.importId, {
      transactions,
      matchedCount,
      status: matchedCount === transactions.length ? "completed" : "matched",
      processedAt: Date.now(),
    });

    return args.importId;
  },
});
