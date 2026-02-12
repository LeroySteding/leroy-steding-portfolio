import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// List jobs for current user
export const list = query({
  args: {
    status: v.optional(
      v.union(
        v.literal("new"),
        v.literal("viewed"),
        v.literal("saved"),
        v.literal("applied"),
        v.literal("rejected"),
        v.literal("archived")
      )
    ),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { status, limit = 50 }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    let jobsQuery = ctx.db
      .query("jobs")
      .withIndex("by_user", (q) => q.eq("clerkUserId", identity.subject));

    if (status) {
      jobsQuery = jobsQuery.filter((q) => q.eq(q.field("status"), status));
    }

    const jobs = await jobsQuery.order("desc").take(limit);

    return jobs;
  },
});

// Get single job
export const get = query({
  args: { id: v.id("jobs") },
  handler: async (ctx, { id }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const job = await ctx.db.get(id);
    if (!job || job.clerkUserId !== identity.subject) {
      throw new Error("Job not found");
    }

    return job;
  },
});

// Create job (from sync)
export const create = mutation({
  args: {
    externalId: v.string(),
    title: v.string(),
    company: v.string(),
    companyLogo: v.optional(v.string()),
    location: v.string(),
    salary: v.optional(
      v.object({
        min: v.number(),
        max: v.number(),
        currency: v.string(),
      })
    ),
    skills: v.array(v.string()),
    description: v.string(),
    postedAt: v.number(),
    url: v.string(),
    matchScore: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    // Check if already exists
    const existing = await ctx.db
      .query("jobs")
      .withIndex("by_user", (q) => q.eq("clerkUserId", identity.subject))
      .filter((q) => q.eq(q.field("externalId"), args.externalId))
      .first();

    if (existing) {
      return existing._id;
    }

    const jobId = await ctx.db.insert("jobs", {
      clerkUserId: identity.subject,
      platform: "linkedin",
      ...args,
      status: "new",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return jobId;
  },
});

// Update job status
export const updateStatus = mutation({
  args: {
    id: v.id("jobs"),
    status: v.union(
      v.literal("new"),
      v.literal("viewed"),
      v.literal("saved"),
      v.literal("applied"),
      v.literal("rejected"),
      v.literal("archived")
    ),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, { id, status, notes }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const job = await ctx.db.get(id);
    if (!job || job.clerkUserId !== identity.subject) {
      throw new Error("Job not found");
    }

    await ctx.db.patch(id, {
      status,
      notes,
      updatedAt: Date.now(),
    });
  },
});

// Search jobs
export const search = query({
  args: {
    query: v.string(),
    filters: v.optional(
      v.object({
        location: v.optional(v.string()),
        status: v.optional(v.string()),
      })
    ),
  },
  handler: async (ctx, { query, filters }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    let results = await ctx.db
      .query("jobs")
      .withSearchIndex("search_jobs", (q) =>
        q.search("title", query).eq("clerkUserId", identity.subject)
      )
      .collect();

    // Apply additional filters
    if (filters?.location) {
      results = results.filter((job) => job.location === filters.location);
    }
    if (filters?.status) {
      results = results.filter((job) => job.status === filters.status);
    }

    return results;
  },
});

// Get stats
export const getStats = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const allJobs = await ctx.db
      .query("jobs")
      .withIndex("by_user", (q) => q.eq("clerkUserId", identity.subject))
      .collect();

    const newJobs = allJobs.filter((j) => j.status === "new").length;
    const savedJobs = allJobs.filter((j) => j.status === "saved").length;
    const appliedJobs = allJobs.filter((j) => j.status === "applied").length;
    const highMatches = allJobs.filter(
      (j) => j.matchScore && j.matchScore > 85
    ).length;

    return {
      total: allJobs.length,
      new: newJobs,
      saved: savedJobs,
      applied: appliedJobs,
      highMatches,
    };
  },
});
