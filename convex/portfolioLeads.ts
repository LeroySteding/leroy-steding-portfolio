import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Create or update portfolio lead
export const upsertLead = mutation({
  args: {
    email: v.string(),
    name: v.optional(v.string()),
    source: v.union(
      v.literal("contact_form"),
      v.literal("newsletter"),
      v.literal("chat"),
      v.literal("booking")
    ),
    message: v.optional(v.string()),
    subject: v.optional(v.string()),
    phone: v.optional(v.string()),
    company: v.optional(v.string()),
    subscribedToNewsletter: v.optional(v.boolean()),
    ipAddress: v.optional(v.string()),
    userAgent: v.optional(v.string()),
    referrer: v.optional(v.string()),
    utmSource: v.optional(v.string()),
    utmMedium: v.optional(v.string()),
    utmCampaign: v.optional(v.string()),
    locale: v.optional(v.string()),
    metadata: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const { email, ...data } = args;
    const now = Date.now();

    // Check if lead exists
    const existing = await ctx.db
      .query("portfolio_leads")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();

    if (existing) {
      // Update existing lead
      await ctx.db.patch(existing._id, {
        ...data,
        updatedAt: now,
      });
      return { id: existing._id, isNew: false };
    }

    // Create new lead
    const leadId = await ctx.db.insert("portfolio_leads", {
      email,
      ...data,
      status: "new",
      createdAt: now,
      updatedAt: now,
    });

    return { id: leadId, isNew: true };
  },
});

// Get lead by email
export const getLeadByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("portfolio_leads")
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
        v.literal("archived")
      )
    ),
    subscribedToNewsletter: v.optional(v.boolean()),
    newsletterConfirmed: v.optional(v.boolean()),
    metadata: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const { email, ...updates } = args;
    const existing = await ctx.db
      .query("portfolio_leads")
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

// Get all leads (for admin dashboard)
export const getAllLeads = query({
  args: {
    status: v.optional(
      v.union(
        v.literal("new"),
        v.literal("contacted"),
        v.literal("qualified"),
        v.literal("converted"),
        v.literal("archived")
      )
    ),
    source: v.optional(
      v.union(
        v.literal("contact_form"),
        v.literal("newsletter"),
        v.literal("chat"),
        v.literal("booking")
      )
    ),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let leads = await ctx.db.query("portfolio_leads").collect();

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
