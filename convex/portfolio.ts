/**
 * Portfolio-specific public queries
 * These are read-only queries used by the portfolio frontend (SSR via ConvexHttpClient).
 * No authentication required.
 */
import { v } from "convex/values";
import { query } from "./_generated/server";

// ==================== SECTION QUERIES ====================
// Sections are stored in site_settings with keys like "section:hero", "section:about", etc.

export const getSection = query({
  args: {
    key: v.string(),
    locale: v.optional(v.union(v.literal("en"), v.literal("nl"))),
  },
  handler: async (ctx, args) => {
    const settings = await ctx.db
      .query("site_settings")
      .withIndex("by_key", (q) => q.eq("key", args.key))
      .collect();

    if (args.locale) {
      const localized = settings.find((s) => s.locale === args.locale);
      if (localized) return localized.value;
    }

    // Fallback to first match (likely "en") or null
    const fallback = settings.find((s) => s.locale === "en") ?? settings[0];
    return fallback?.value ?? null;
  },
});

// ==================== PUBLISHED CONTENT QUERIES ====================

export const getPublishedProjects = query({
  args: {
    locale: v.optional(v.union(v.literal("en"), v.literal("nl"))),
  },
  handler: async (ctx, args) => {
    let projects = await ctx.db.query("projects").collect();

    // Only published projects
    projects = projects.filter((p) => p.published !== false);

    if (args.locale) {
      projects = projects.filter((p) => p.locale === args.locale);
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

export const getFeaturedProjects = query({
  args: {
    locale: v.optional(v.union(v.literal("en"), v.literal("nl"))),
  },
  handler: async (ctx, args) => {
    let projects = await ctx.db.query("projects").collect();

    projects = projects.filter(
      (p) => p.featured === true && p.published !== false
    );

    if (args.locale) {
      projects = projects.filter((p) => p.locale === args.locale);
    }

    return projects.sort(
      (a, b) => (a.featuredOrder ?? 999) - (b.featuredOrder ?? 999)
    );
  },
});

export const getProjectById = query({
  args: {
    id: v.id("projects"),
    locale: v.optional(v.union(v.literal("en"), v.literal("nl"))),
  },
  handler: async (ctx, args) => {
    const project = await ctx.db.get(args.id);
    if (!project) return null;
    
    // Check locale match if specified
    if (args.locale && project.locale !== args.locale) {
      return null;
    }
    
    return project;
  },
});

export const getProjectBySlug = query({
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
      return (
        projects.find((p) => p.locale === args.locale) ??
        projects.find((p) => p.locale === "en") ??
        projects[0] ??
        null
      );
    }
    return projects[0] ?? null;
  },
});

export const getPublishedExperiences = query({
  args: {
    locale: v.optional(v.union(v.literal("en"), v.literal("nl"))),
  },
  handler: async (ctx, args) => {
    let experiences = await ctx.db.query("experiences").collect();

    experiences = experiences.filter((e) => e.published !== false);

    if (args.locale) {
      experiences = experiences.filter((e) => e.locale === args.locale);
    }

    return experiences.sort((a, b) => {
      if (a.order !== undefined && b.order !== undefined) {
        return a.order - b.order;
      }
      return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
    });
  },
});

export const getExperienceBySlug = query({
  args: {
    slug: v.string(),
    locale: v.optional(v.union(v.literal("en"), v.literal("nl"))),
  },
  handler: async (ctx, args) => {
    // Experiences don't have slugs in schema, so match by company+title
    const experiences = await ctx.db.query("experiences").collect();
    const matching = experiences.filter((e) => {
      const expSlug = `${e.company}-${e.title}`
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-");
      return expSlug === args.slug || e.title === args.slug;
    });

    if (args.locale) {
      return (
        matching.find((e) => e.locale === args.locale) ??
        matching.find((e) => e.locale === "en") ??
        matching[0] ??
        null
      );
    }
    return matching[0] ?? null;
  },
});

export const getPublishedPosts = query({
  args: {
    locale: v.optional(v.union(v.literal("en"), v.literal("nl"))),
  },
  handler: async (ctx, args) => {
    let posts = await ctx.db.query("blog_posts").collect();

    posts = posts.filter((p) => p.status === "published");

    if (args.locale) {
      posts = posts.filter((p) => p.locale === args.locale);
    }

    return posts.sort((a, b) => {
      const aTime = a.publishedAt ?? a._creationTime;
      const bTime = b.publishedAt ?? b._creationTime;
      return bTime - aTime;
    });
  },
});

export const getFeaturedPosts = query({
  args: {
    locale: v.optional(v.union(v.literal("en"), v.literal("nl"))),
  },
  handler: async (ctx, args) => {
    let posts = await ctx.db.query("blog_posts").collect();

    posts = posts.filter(
      (p) => p.featured === true && p.status === "published"
    );

    if (args.locale) {
      posts = posts.filter((p) => p.locale === args.locale);
    }

    return posts.sort((a, b) => {
      const aTime = a.publishedAt ?? a._creationTime;
      const bTime = b.publishedAt ?? b._creationTime;
      return bTime - aTime;
    });
  },
});

export const getPostBySlug = query({
  args: {
    slug: v.string(),
    locale: v.optional(v.union(v.literal("en"), v.literal("nl"))),
  },
  handler: async (ctx, args) => {
    const posts = await ctx.db
      .query("blog_posts")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .collect();

    if (args.locale) {
      return (
        posts.find((p) => p.locale === args.locale) ??
        posts.find((p) => p.locale === "en") ??
        posts[0] ??
        null
      );
    }
    return posts[0] ?? null;
  },
});

export const getPublishedSkills = query({
  args: {
    locale: v.optional(v.union(v.literal("en"), v.literal("nl"))),
    category: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let skills = await ctx.db.query("skills").collect();

    skills = skills.filter((s) => s.published !== false);

    if (args.locale) {
      skills = skills.filter((s) => !s.locale || s.locale === args.locale);
    }

    if (args.category) {
      skills = skills.filter((s) => s.category === args.category);
    }

    return skills.sort((a, b) => {
      if (a.order !== undefined && b.order !== undefined) {
        return a.order - b.order;
      }
      return b.proficiency - a.proficiency;
    });
  },
});
