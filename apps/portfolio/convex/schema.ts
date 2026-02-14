import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Lead capture from contact forms, chat, newsletter, booking
  leads: defineTable({
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
    status: v.union(
      v.literal("new"),
      v.literal("contacted"),
      v.literal("qualified"),
      v.literal("converted"),
      v.literal("archived"),
    ),
    bookingUrl: v.optional(v.string()), // Cal.com booking URL
    metadata: v.optional(v.any()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_email", ["email"])
    .index("by_source", ["source"])
    .index("by_status", ["status"])
    .index("by_created", ["createdAt"]),

  // Blog post analytics (optional - for future)
  blog_views: defineTable({
    slug: v.string(),
    views: v.number(),
    updatedAt: v.number(),
  }).index("by_slug", ["slug"]),

  // Contact form submissions (detailed tracking)
  contact_submissions: defineTable({
    leadId: v.id("leads"),
    name: v.string(),
    email: v.string(),
    subject: v.string(),
    message: v.string(),
    ipAddress: v.optional(v.string()),
    userAgent: v.optional(v.string()),
    replied: v.boolean(),
    createdAt: v.number(),
  }).index("by_lead", ["leadId"]),
});
