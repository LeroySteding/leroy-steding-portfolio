/**
 * Uren App - Time Tracking, Projects, Timesheets
 */

import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// ========== TIME ENTRY QUERIES ==========

export const listTimeEntries = query({
  args: {
    userId: v.id("zzp_users"),
    projectId: v.optional(v.id("uren_projects")),
    startDate: v.optional(v.number()),
    endDate: v.optional(v.number()),
    billableOnly: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db
      .query("uren_time_entries")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc");

    let entries = await query.collect();

    // Apply filters
    if (args.projectId) {
      entries = entries.filter(e => e.projectId === args.projectId);
    }

    if (args.startDate && args.endDate) {
      entries = entries.filter(
        e => e.date >= args.startDate! && e.date <= args.endDate!
      );
    }

    if (args.billableOnly) {
      entries = entries.filter(e => e.is_billable);
    }

    return entries;
  },
});

export const getActiveTimeEntry = query({
  args: { userId: v.id("zzp_users") },
  handler: async (ctx, args) => {
    const entries = await ctx.db
      .query("uren_time_entries")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .filter((q) => q.eq(q.field("end_time"), undefined))
      .collect();

    return entries[0] || null;
  },
});

export const getTimeEntryStats = query({
  args: {
    userId: v.id("zzp_users"),
    startDate: v.number(),
    endDate: v.number(),
  },
  handler: async (ctx, args) => {
    const entries = await ctx.db
      .query("uren_time_entries")
      .withIndex("by_user_date", (q) =>
        q.eq("userId", args.userId)
         .gte("date", args.startDate)
         .lte("date", args.endDate)
      )
      .collect();

    const stats = {
      totalHours: 0,
      billableHours: 0,
      nonBillableHours: 0,
      totalAmount: 0,
      entryCount: entries.length,
      byProject: {} as Record<string, { hours: number; amount: number }>,
    };

    for (const entry of entries) {
      if (entry.duration) {
        const hours = entry.duration / 3600; // Convert seconds to hours
        stats.totalHours += hours;

        if (entry.is_billable) {
          stats.billableHours += hours;
          if (entry.hourly_rate) {
            const amount = Math.round(hours * entry.hourly_rate);
            stats.totalAmount += amount;
          }
        } else {
          stats.nonBillableHours += hours;
        }

        // By project
        if (entry.projectId) {
          const projectKey = entry.projectId;
          if (!stats.byProject[projectKey]) {
            stats.byProject[projectKey] = { hours: 0, amount: 0 };
          }
          stats.byProject[projectKey].hours += hours;
          if (entry.is_billable && entry.hourly_rate) {
            stats.byProject[projectKey].amount += Math.round(hours * entry.hourly_rate);
          }
        }
      }
    }

    return stats;
  },
});

// ========== TIME ENTRY MUTATIONS ==========

export const startTimeEntry = mutation({
  args: {
    userId: v.id("zzp_users"),
    description: v.string(),
    projectId: v.optional(v.id("uren_projects")),
    is_billable: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    // Check if there's already an active entry
    const activeEntry = await ctx.db
      .query("uren_time_entries")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .filter((q) => q.eq(q.field("end_time"), undefined))
      .first();

    if (activeEntry) {
      throw new Error("Please stop the current timer before starting a new one");
    }

    // Get project details if provided
    let hourly_rate: number | undefined;
    if (args.projectId) {
      const project = await ctx.db.get(args.projectId);
      hourly_rate = project?.hourly_rate;
    }

    const now = Date.now();
    const entryId = await ctx.db.insert("uren_time_entries", {
      userId: args.userId,
      projectId: args.projectId,
      description: args.description,
      start_time: now,
      date: now,
      is_billable: args.is_billable ?? true,
      hourly_rate,
      createdAt: now,
      updatedAt: now,
    });

    return entryId;
  },
});

export const stopTimeEntry = mutation({
  args: { entryId: v.id("uren_time_entries") },
  handler: async (ctx, args) => {
    const entry = await ctx.db.get(args.entryId);
    
    if (!entry) {
      throw new Error("Time entry not found");
    }

    if (entry.end_time) {
      throw new Error("This time entry has already been stopped");
    }

    const now = Date.now();
    const duration = Math.floor((now - entry.start_time) / 1000); // seconds

    await ctx.db.patch(args.entryId, {
      end_time: now,
      duration,
      updatedAt: now,
    });

    return { duration };
  },
});

export const createTimeEntry = mutation({
  args: {
    userId: v.id("zzp_users"),
    projectId: v.optional(v.id("uren_projects")),
    description: v.string(),
    start_time: v.number(),
    end_time: v.number(),
    is_billable: v.boolean(),
    hourly_rate: v.optional(v.number()),
    tags: v.optional(v.array(v.string())),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const duration = Math.floor((args.end_time - args.start_time) / 1000);
    const now = Date.now();

    const entryId = await ctx.db.insert("uren_time_entries", {
      userId: args.userId,
      projectId: args.projectId,
      description: args.description,
      start_time: args.start_time,
      end_time: args.end_time,
      duration,
      date: args.start_time,
      is_billable: args.is_billable,
      hourly_rate: args.hourly_rate,
      tags: args.tags,
      notes: args.notes,
      createdAt: now,
      updatedAt: now,
    });

    return entryId;
  },
});

export const updateTimeEntry = mutation({
  args: {
    entryId: v.id("uren_time_entries"),
    description: v.optional(v.string()),
    start_time: v.optional(v.number()),
    end_time: v.optional(v.number()),
    projectId: v.optional(v.id("uren_projects")),
    is_billable: v.optional(v.boolean()),
    hourly_rate: v.optional(v.number()),
    tags: v.optional(v.array(v.string())),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { entryId, start_time, end_time, ...otherUpdates } = args;
    const entry = await ctx.db.get(entryId);

    if (!entry) {
      throw new Error("Time entry not found");
    }

    const updates: any = { ...otherUpdates };

    // Recalculate duration if times changed
    if (start_time !== undefined || end_time !== undefined) {
      const newStartTime = start_time ?? entry.start_time;
      const newEndTime = end_time ?? entry.end_time;
      
      if (newEndTime) {
        updates.start_time = newStartTime;
        updates.end_time = newEndTime;
        updates.duration = Math.floor((newEndTime - newStartTime) / 1000);
        updates.date = newStartTime;
      }
    }

    await ctx.db.patch(entryId, {
      ...updates,
      updatedAt: Date.now(),
    });

    return entryId;
  },
});

export const deleteTimeEntry = mutation({
  args: { entryId: v.id("uren_time_entries") },
  handler: async (ctx, args) => {
    const entry = await ctx.db.get(args.entryId);
    
    if (entry?.invoiceId) {
      throw new Error("Cannot delete a time entry that has been invoiced");
    }

    await ctx.db.delete(args.entryId);
  },
});

// ========== PROJECT QUERIES ==========

export const listUrenProjects = query({
  args: {
    userId: v.id("zzp_users"),
    activeOnly: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db
      .query("uren_projects")
      .withIndex("by_user", (q) => q.eq("userId", args.userId));

    if (args.activeOnly) {
      query = query.filter((q) => q.eq(q.field("active"), true));
    }

    return await query.collect();
  },
});

export const getUrenProject = query({
  args: { projectId: v.id("uren_projects") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.projectId);
  },
});

export const getUrenProjectStats = query({
  args: { projectId: v.id("uren_projects") },
  handler: async (ctx, args) => {
    const entries = await ctx.db
      .query("uren_time_entries")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
      .collect();

    const project = await ctx.db.get(args.projectId);

    let totalHours = 0;
    let totalAmount = 0;

    for (const entry of entries) {
      if (entry.duration) {
        const hours = entry.duration / 3600;
        totalHours += hours;
        
        if (entry.is_billable && entry.hourly_rate) {
          totalAmount += Math.round(hours * entry.hourly_rate);
        }
      }
    }

    return {
      totalHours,
      totalAmount,
      budgetHours: project?.budget_hours,
      budgetAmount: project?.budget_amount,
      percentComplete: project?.budget_hours 
        ? Math.round((totalHours / project.budget_hours) * 100)
        : null,
    };
  },
});

// ========== PROJECT MUTATIONS ==========

export const createUrenProject = mutation({
  args: {
    userId: v.id("zzp_users"),
    name: v.string(),
    clientId: v.optional(v.id("fact_clients")),
    description: v.optional(v.string()),
    hourly_rate: v.number(),
    budget_hours: v.optional(v.number()),
    budget_amount: v.optional(v.number()),
    color: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const projectId = await ctx.db.insert("uren_projects", {
      userId: args.userId,
      clientId: args.clientId,
      name: args.name,
      description: args.description,
      hourly_rate: args.hourly_rate,
      budget_hours: args.budget_hours,
      budget_amount: args.budget_amount,
      color: args.color || "#3b82f6",
      active: true,
      createdAt: now,
      updatedAt: now,
    });

    return projectId;
  },
});

export const updateUrenProject = mutation({
  args: {
    projectId: v.id("uren_projects"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    hourly_rate: v.optional(v.number()),
    budget_hours: v.optional(v.number()),
    budget_amount: v.optional(v.number()),
    color: v.optional(v.string()),
    active: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { projectId, ...updates } = args;

    await ctx.db.patch(projectId, {
      ...updates,
      updatedAt: Date.now(),
    });

    return projectId;
  },
});

export const deleteUrenProject = mutation({
  args: { projectId: v.id("uren_projects") },
  handler: async (ctx, args) => {
    // Check if project has time entries
    const entries = await ctx.db
      .query("uren_time_entries")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
      .first();

    if (entries) {
      throw new Error("Cannot delete project with time entries. Deactivate instead.");
    }

    await ctx.db.delete(args.projectId);
  },
});

// ========== TIMESHEET QUERIES ==========

export const listTimesheets = query({
  args: {
    userId: v.id("zzp_users"),
    status: v.optional(v.union(
      v.literal("concept"),
      v.literal("goedgekeurd"),
      v.literal("gefactureerd")
    )),
  },
  handler: async (ctx, args) => {
    let query = ctx.db
      .query("uren_timesheets")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc");

    if (args.status) {
      query = query.filter((q) => q.eq(q.field("status"), args.status));
    }

    return await query.collect();
  },
});

export const getTimesheet = query({
  args: { timesheetId: v.id("uren_timesheets") },
  handler: async (ctx, args) => {
    const timesheet = await ctx.db.get(args.timesheetId);
    
    if (!timesheet) return null;

    // Get all time entries
    const entries = await Promise.all(
      timesheet.entries.map(entryId => ctx.db.get(entryId))
    );

    return {
      ...timesheet,
      entriesData: entries.filter(e => e !== null),
    };
  },
});

// ========== TIMESHEET MUTATIONS ==========

export const createTimesheet = mutation({
  args: {
    userId: v.id("zzp_users"),
    period_start: v.number(),
    period_end: v.number(),
    entries: v.array(v.id("uren_time_entries")),
  },
  handler: async (ctx, args) => {
    // Calculate totals from entries
    let total_hours = 0;
    let total_billable_hours = 0;
    let total_amount = 0;

    for (const entryId of args.entries) {
      const entry = await ctx.db.get(entryId);
      if (entry && entry.duration) {
        const hours = entry.duration / 3600;
        total_hours += hours;
        
        if (entry.is_billable) {
          total_billable_hours += hours;
          if (entry.hourly_rate) {
            total_amount += Math.round(hours * entry.hourly_rate);
          }
        }
      }
    }

    const now = Date.now();
    const timesheetId = await ctx.db.insert("uren_timesheets", {
      userId: args.userId,
      period_start: args.period_start,
      period_end: args.period_end,
      entries: args.entries,
      status: "concept",
      total_hours,
      total_billable_hours,
      total_amount,
      createdAt: now,
      updatedAt: now,
    });

    return timesheetId;
  },
});

export const approveTimesheet = mutation({
  args: {
    timesheetId: v.id("uren_timesheets"),
    approvedBy: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.timesheetId, {
      status: "goedgekeurd",
      approvedBy: args.approvedBy,
      approvedAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

export const linkTimesheetToInvoice = mutation({
  args: {
    timesheetId: v.id("uren_timesheets"),
    invoiceId: v.id("fact_invoices"),
  },
  handler: async (ctx, args) => {
    const timesheet = await ctx.db.get(args.timesheetId);
    
    if (!timesheet) {
      throw new Error("Timesheet not found");
    }

    // Update timesheet
    await ctx.db.patch(args.timesheetId, {
      status: "gefactureerd",
      invoiceId: args.invoiceId,
      updatedAt: Date.now(),
    });

    // Link all time entries to invoice
    for (const entryId of timesheet.entries) {
      await ctx.db.patch(entryId, {
        invoiceId: args.invoiceId,
        updatedAt: Date.now(),
      });
    }
  },
});

export const deleteTimesheet = mutation({
  args: { timesheetId: v.id("uren_timesheets") },
  handler: async (ctx, args) => {
    const timesheet = await ctx.db.get(args.timesheetId);
    
    if (timesheet?.status === "gefactureerd") {
      throw new Error("Cannot delete an invoiced timesheet");
    }

    await ctx.db.delete(args.timesheetId);
  },
});
