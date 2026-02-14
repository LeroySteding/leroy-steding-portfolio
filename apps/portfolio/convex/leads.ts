import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Create or update lead
export const upsertLead = mutation({
  args: {
    email: v.string(),
    name: v.optional(v.string()),
    source: v.union(
      v.literal("contact"),
      v.literal("newsletter"),
      v.literal("chat"),
      v.literal("booking"),
    ),
    message: v.optional(v.string()),
    subject: v.optional(v.string()),
    phone: v.optional(v.string()),
    company: v.optional(v.string()),
    bookingUrl: v.optional(v.string()),
    metadata: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const { email, ...data } = args;
    const now = Date.now();

    // Check if lead exists
    const existing = await ctx.db
      .query("leads")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();

    if (existing) {
      // Update existing lead
      await ctx.db.patch(existing._id, {
        ...data,
        updatedAt: now,
      });
      return existing._id;
    }

    // Create new lead
    const leadId = await ctx.db.insert("leads", {
      email,
      ...data,
      status: "new",
      createdAt: now,
      updatedAt: now,
    });

    return leadId;
  },
});

// Get lead by email
export const getLeadByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("leads")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
  },
});

// Update lead by email
export const updateLeadByEmail = mutation({
  args: {
    email: v.string(),
    name: v.optional(v.string()),
    phone: v.optional(v.string()),
    company: v.optional(v.string()),
    status: v.optional(
      v.union(
        v.literal("new"),
        v.literal("contacted"),
        v.literal("qualified"),
        v.literal("converted"),
        v.literal("archived"),
      ),
    ),
    bookingUrl: v.optional(v.string()),
    metadata: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const { email, ...updates } = args;
    const existing = await ctx.db
      .query("leads")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();

    if (!existing) {
      throw new Error(`Lead with email ${email} not found`);
    }

    await ctx.db.patch(existing._id, {
      ...updates,
      updatedAt: Date.now(),
    });

    return existing._id;
  },
});

// Create contact submission (detailed tracking)
export const createContactSubmission = mutation({
  args: {
    email: v.string(),
    name: v.string(),
    subject: v.string(),
    message: v.string(),
    ipAddress: v.optional(v.string()),
    userAgent: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { email, name, subject, message, ipAddress, userAgent } = args;

    // Upsert lead first
    const leadId = await ctx.runMutation("leads:upsertLead" as any, {
      email,
      name,
      source: "contact",
      subject,
      message,
    });

    // Create detailed submission record
    const submissionId = await ctx.db.insert("contact_submissions", {
      leadId,
      email,
      name,
      subject,
      message,
      ipAddress,
      userAgent,
      replied: false,
      createdAt: Date.now(),
    });

    return { leadId, submissionId };
  },
});

// Get all leads (for admin dashboard)
export const getAllLeads = query({
  args: {
    status: v.optional(
      v.union(
        v.literal("new"),
        v.literal("contacted"),
        v.literal("qualified"),
        v.literal("converted"),
        v.literal("archived"),
      ),
    ),
    source: v.optional(
      v.union(
        v.literal("contact"),
        v.literal("newsletter"),
        v.literal("chat"),
        v.literal("booking"),
      ),
    ),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let leads = await ctx.db.query("leads").collect();

    if (args.status) {
      leads = leads.filter((l) => l.status === args.status);
    }

    if (args.source) {
      leads = leads.filter((l) => l.source === args.source);
    }

    leads = leads.sort((a, b) => b.createdAt - a.createdAt);

    if (args.limit) {
      leads = leads.slice(0, args.limit);
    }

    return leads;
  },
});
