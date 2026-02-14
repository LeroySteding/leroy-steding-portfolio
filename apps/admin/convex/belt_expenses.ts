/**
 * Belastingbot - Expenses Management
 */

import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// ========== QUERIES ==========

export const listExpenses = query({
  args: { 
    userId: v.id("zzp_users"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let expensesQuery = ctx.db
      .query("belt_expenses")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc");

    if (args.limit) {
      return await expensesQuery.take(args.limit);
    }

    return await expensesQuery.collect();
  },
});

export const getExpensesByDateRange = query({
  args: {
    userId: v.id("zzp_users"),
    startDate: v.number(),
    endDate: v.number(),
  },
  handler: async (ctx, args) => {
    const expenses = await ctx.db
      .query("belt_expenses")
      .withIndex("by_user_date", (q) => 
        q.eq("userId", args.userId)
         .gte("date", args.startDate)
         .lte("date", args.endDate)
      )
      .collect();

    return expenses;
  },
});

export const getExpensesByCategory = query({
  args: {
    userId: v.id("zzp_users"),
    category: v.union(
      v.literal("hardware"),
      v.literal("software"),
      v.literal("marketing"),
      v.literal("kantoor"),
      v.literal("reiskosten"),
      v.literal("telefoon_internet"),
      v.literal("zakelijke_diensten"),
      v.literal("overig")
    ),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("belt_expenses")
      .withIndex("by_category", (q) => q.eq("category", args.category))
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .collect();
  },
});

export const getExpenseStats = query({
  args: {
    userId: v.id("zzp_users"),
    year: v.number(),
    quarter: v.optional(v.union(v.literal(1), v.literal(2), v.literal(3), v.literal(4))),
  },
  handler: async (ctx, args) => {
    const yearStart = new Date(args.year, 0, 1).getTime();
    const yearEnd = new Date(args.year, 11, 31, 23, 59, 59).getTime();

    let startDate = yearStart;
    let endDate = yearEnd;

    if (args.quarter) {
      const quarterStart = (args.quarter - 1) * 3;
      startDate = new Date(args.year, quarterStart, 1).getTime();
      endDate = new Date(args.year, quarterStart + 3, 0, 23, 59, 59).getTime();
    }

    const expenses = await ctx.db
      .query("belt_expenses")
      .withIndex("by_user_date", (q) =>
        q.eq("userId", args.userId)
         .gte("date", startDate)
         .lte("date", endDate)
      )
      .collect();

    const stats = {
      totalAmount: 0,
      totalBtwAmount: 0,
      byCategory: {} as Record<string, { amount: number; count: number }>,
      byBtwRate: {
        21: { amount: 0, btw: 0, count: 0 },
        9: { amount: 0, btw: 0, count: 0 },
        0: { amount: 0, btw: 0, count: 0 },
      },
      count: expenses.length,
    };

    for (const expense of expenses) {
      stats.totalAmount += expense.amount;
      stats.totalBtwAmount += expense.btw_amount;

      // By category
      if (!stats.byCategory[expense.category]) {
        stats.byCategory[expense.category] = { amount: 0, count: 0 };
      }
      stats.byCategory[expense.category].amount += expense.amount;
      stats.byCategory[expense.category].count += 1;

      // By BTW rate
      stats.byBtwRate[expense.btw_rate].amount += expense.amount;
      stats.byBtwRate[expense.btw_rate].btw += expense.btw_amount;
      stats.byBtwRate[expense.btw_rate].count += 1;
    }

    return stats;
  },
});

export const getRecurringExpenses = query({
  args: { userId: v.id("zzp_users") },
  handler: async (ctx, args) => {
    const allExpenses = await ctx.db
      .query("belt_expenses")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    return allExpenses.filter(expense => expense.recurring !== undefined);
  },
});

// ========== MUTATIONS ==========

export const createExpense = mutation({
  args: {
    userId: v.id("zzp_users"),
    description: v.string(),
    amount: v.number(),
    btw_rate: v.union(v.literal(21), v.literal(9), v.literal(0)),
    category: v.union(
      v.literal("hardware"),
      v.literal("software"),
      v.literal("marketing"),
      v.literal("kantoor"),
      v.literal("reiskosten"),
      v.literal("telefoon_internet"),
      v.literal("zakelijke_diensten"),
      v.literal("overig")
    ),
    date: v.number(),
    kvk: v.string(),
    receipt_url: v.optional(v.string()),
    notes: v.optional(v.string()),
    recurring: v.optional(v.object({
      frequency: v.union(
        v.literal("maandelijks"),
        v.literal("kwartaal"),
        v.literal("jaarlijks")
      ),
      nextDate: v.optional(v.number()),
      endDate: v.optional(v.number()),
    })),
  },
  handler: async (ctx, args) => {
    // Calculate BTW amount
    const btw_amount = Math.round((args.amount * args.btw_rate) / 100);

    const now = Date.now();
    const expenseId = await ctx.db.insert("belt_expenses", {
      userId: args.userId,
      description: args.description,
      amount: args.amount,
      btw_rate: args.btw_rate,
      btw_amount,
      category: args.category,
      date: args.date,
      kvk: args.kvk,
      receipt_url: args.receipt_url,
      notes: args.notes,
      recurring: args.recurring,
      createdAt: now,
      updatedAt: now,
    });

    return expenseId;
  },
});

export const updateExpense = mutation({
  args: {
    expenseId: v.id("belt_expenses"),
    description: v.optional(v.string()),
    amount: v.optional(v.number()),
    btw_rate: v.optional(v.union(v.literal(21), v.literal(9), v.literal(0))),
    category: v.optional(v.union(
      v.literal("hardware"),
      v.literal("software"),
      v.literal("marketing"),
      v.literal("kantoor"),
      v.literal("reiskosten"),
      v.literal("telefoon_internet"),
      v.literal("zakelijke_diensten"),
      v.literal("overig")
    )),
    date: v.optional(v.number()),
    receipt_url: v.optional(v.string()),
    notes: v.optional(v.string()),
    recurring: v.optional(v.object({
      frequency: v.union(
        v.literal("maandelijks"),
        v.literal("kwartaal"),
        v.literal("jaarlijks")
      ),
      nextDate: v.optional(v.number()),
      endDate: v.optional(v.number()),
    })),
  },
  handler: async (ctx, args) => {
    const { expenseId, ...updates } = args;
    const expense = await ctx.db.get(expenseId);
    
    if (!expense) {
      throw new Error("Expense not found");
    }

    // Recalculate BTW if amount or rate changed
    let btw_amount = expense.btw_amount;
    if (updates.amount !== undefined || updates.btw_rate !== undefined) {
      const amount = updates.amount ?? expense.amount;
      const rate = updates.btw_rate ?? expense.btw_rate;
      btw_amount = Math.round((amount * rate) / 100);
    }

    await ctx.db.patch(expenseId, {
      ...updates,
      btw_amount,
      updatedAt: Date.now(),
    });

    return expenseId;
  },
});

export const deleteExpense = mutation({
  args: { expenseId: v.id("belt_expenses") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.expenseId);
  },
});

export const bulkCreateExpenses = mutation({
  args: {
    userId: v.id("zzp_users"),
    kvk: v.string(),
    expenses: v.array(v.object({
      description: v.string(),
      amount: v.number(),
      btw_rate: v.union(v.literal(21), v.literal(9), v.literal(0)),
      category: v.union(
        v.literal("hardware"),
        v.literal("software"),
        v.literal("marketing"),
        v.literal("kantoor"),
        v.literal("reiskosten"),
        v.literal("telefoon_internet"),
        v.literal("zakelijke_diensten"),
        v.literal("overig")
      ),
      date: v.number(),
      receipt_url: v.optional(v.string()),
      notes: v.optional(v.string()),
    })),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const expenseIds = [];

    for (const expense of args.expenses) {
      const btw_amount = Math.round((expense.amount * expense.btw_rate) / 100);
      
      const expenseId = await ctx.db.insert("belt_expenses", {
        userId: args.userId,
        kvk: args.kvk,
        description: expense.description,
        amount: expense.amount,
        btw_rate: expense.btw_rate,
        btw_amount,
        category: expense.category,
        date: expense.date,
        receipt_url: expense.receipt_url,
        notes: expense.notes,
        createdAt: now,
        updatedAt: now,
      });

      expenseIds.push(expenseId);
    }

    return expenseIds;
  },
});
