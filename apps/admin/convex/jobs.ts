import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

/**
 * List all job applications
 */
export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query("job_applications").order("desc").collect();
  },
});

/**
 * Update job application status
 */
export const updateStatus = mutation({
  args: {
    id: v.id("job_applications"),
    status: v.union(
      v.literal("discovered"),
      v.literal("researching"),
      v.literal("applying"),
      v.literal("applied"),
      v.literal("interviewing"),
      v.literal("offer"),
      v.literal("rejected"),
      v.literal("withdrawn")
    ),
  },
  handler: async (ctx, { id, status }) => {
    await ctx.db.patch(id, { status });
  },
});

/**
 * Create new job application
 */
export const create = mutation({
  args: {
    company: v.string(),
    position: v.string(),
    url: v.optional(v.string()),
    salary: v.optional(v.string()),
    location: v.optional(v.string()),
    remote: v.optional(v.boolean()),
    status: v.optional(
      v.union(
        v.literal("discovered"),
        v.literal("researching"),
        v.literal("applying"),
        v.literal("applied"),
        v.literal("interviewing"),
        v.literal("offer"),
        v.literal("rejected"),
        v.literal("withdrawn")
      )
    ),
    notes: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    createdAt: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("job_applications", {
      ...args,
      status: args.status || "discovered",
      tags: args.tags || [],
    });
  },
});
