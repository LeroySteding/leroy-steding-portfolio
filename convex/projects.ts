import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAuth } from "./_helpers";

// List all projects with optional locale filter
export const list: any = query({
  args: {
    locale: v.optional(v.union(v.literal("en"), v.literal("nl"))),
    published: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    let projects = await ctx.db.query("projects").collect();

    if (args.locale) {
      projects = projects.filter((project) => project.locale === args.locale);
    }

    if (args.published !== undefined) {
      projects = projects.filter(
        (project) => project.published === args.published,
      );
    }

    return projects.sort((a, b) => {
      if (a.featured && b.featured) {
        return (a.featuredOrder ?? 999) - (b.featuredOrder ?? 999);
      }
      if (a.featured) return -1;
      if (b.featured) return 1;
      return (b.year ?? 0) - (a.year ?? 0);
    });
  },
});

// Get a single project by ID
export const getById: any = query({
  args: { id: v.id("projects") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Get a single project by slug
export const getBySlug: any = query({
  args: {
    slug: v.string(),
    locale: v.optional(v.union(v.literal("en"), v.literal("nl"))),
  },
  handler: async (ctx, args) => {
    const projects = await ctx.db
      .query("projects")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .collect();

    if (args.locale) {
      return projects.find((project) => project.locale === args.locale);
    }

    return projects[0];
  },
});

// Public push mutation for agents (no auth required)
export const push = mutation({
  args: {
    title: v.string(), slug: v.string(), description: v.string(), content: v.any(),
    coverImage: v.optional(v.string()), galleryImages: v.optional(v.array(v.string())),
    technologies: v.array(v.string()), liveUrl: v.optional(v.string()),
    githubUrl: v.optional(v.string()), caseStudyUrl: v.optional(v.string()),
    locale: v.union(v.literal("en"), v.literal("nl")),
    featured: v.optional(v.boolean()), featuredOrder: v.optional(v.number()),
    year: v.optional(v.number()), duration: v.optional(v.string()),
    role: v.optional(v.string()), client: v.optional(v.string()),
    order: v.optional(v.number()), published: v.optional(v.boolean()),
    seoTitle: v.optional(v.string()), seoDescription: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Dedup: check if same slug already exists
    const existing = await ctx.db.query("projects")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
    if (existing) {
      await ctx.db.patch(existing._id, args);
      return existing._id;
    }
    return await ctx.db.insert("projects", args);
  },
});

// Create a new project
export const create = mutation({
  args: {
    title: v.string(),
    slug: v.string(),
    description: v.string(),
    content: v.any(),
    coverImage: v.optional(v.string()),
    galleryImages: v.optional(v.array(v.string())),
    technologies: v.array(v.string()),
    liveUrl: v.optional(v.string()),
    githubUrl: v.optional(v.string()),
    caseStudyUrl: v.optional(v.string()),
    locale: v.union(v.literal("en"), v.literal("nl")),
    featured: v.optional(v.boolean()),
    featuredOrder: v.optional(v.number()),
    year: v.optional(v.number()),
    duration: v.optional(v.string()),
    role: v.optional(v.string()),
    client: v.optional(v.string()),
    order: v.optional(v.number()),
    published: v.optional(v.boolean()),
    seoTitle: v.optional(v.string()),
    seoDescription: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAuth(ctx);
    const projectId = await ctx.db.insert("projects", args);
    return projectId;
  },
});

// Update a project
export const update = mutation({
  args: {
    id: v.id("projects"),
    title: v.optional(v.string()),
    slug: v.optional(v.string()),
    description: v.optional(v.string()),
    content: v.optional(v.any()),
    coverImage: v.optional(v.string()),
    galleryImages: v.optional(v.array(v.string())),
    technologies: v.optional(v.array(v.string())),
    liveUrl: v.optional(v.string()),
    githubUrl: v.optional(v.string()),
    caseStudyUrl: v.optional(v.string()),
    locale: v.optional(v.union(v.literal("en"), v.literal("nl"))),
    featured: v.optional(v.boolean()),
    featuredOrder: v.optional(v.number()),
    year: v.optional(v.number()),
    duration: v.optional(v.string()),
    role: v.optional(v.string()),
    client: v.optional(v.string()),
    order: v.optional(v.number()),
    published: v.optional(v.boolean()),
    seoTitle: v.optional(v.string()),
    seoDescription: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAuth(ctx);

    const { id, ...updates } = args;
    const existingProject = await ctx.db.get(id);

    if (!existingProject) {
      throw new Error("Project not found");
    }

    await ctx.db.patch(id, updates);
    return id;
  },
});

// Delete a project
export const remove = mutation({
  args: { id: v.id("projects") },
  handler: async (ctx, args) => {
    await requireAuth(ctx);
    await ctx.db.delete(args.id);
    return args.id;
  },
});

export const get = getById;
