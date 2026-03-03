import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAuth } from "./_helpers";
// List all blog posts with optional locale filter
export const list = query({
    args: {
        locale: v.optional(v.union(v.literal("en"), v.literal("nl"))),
        status: v.optional(v.union(v.literal("draft"), v.literal("published"))),
    },
    handler: async (ctx, args) => {
        let posts = await ctx.db.query("blog_posts").collect();
        if (args.locale) {
            posts = posts.filter((post) => post.locale === args.locale);
        }
        if (args.status) {
            posts = posts.filter((post) => post.status === args.status);
        }
        return posts.sort((a, b) => {
            const aTime = a.publishedAt ?? a._creationTime;
            const bTime = b.publishedAt ?? b._creationTime;
            return bTime - aTime;
        });
    },
});
// Get a single blog post by ID
export const get = query({
    args: { id: v.id("blog_posts") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.id);
    },
});
export const getById = get;
// Get a single blog post by slug
export const getBySlug = query({
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
            return posts.find((post) => post.locale === args.locale);
        }
        return posts[0];
    },
});
// Public push mutation for agents (no auth required)
export const push = mutation({
    args: {
        title: v.string(), slug: v.string(), content: v.any(),
        excerpt: v.optional(v.string()), coverImage: v.optional(v.string()),
        locale: v.union(v.literal("en"), v.literal("nl")),
        status: v.union(v.literal("draft"), v.literal("published")),
        tags: v.optional(v.array(v.string())), seoTitle: v.optional(v.string()),
        seoDescription: v.optional(v.string()), featured: v.optional(v.boolean()),
        author: v.optional(v.string()), authorName: v.optional(v.string()),
        readingTime: v.optional(v.number()), publishedAt: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        // Dedup: check if same slug already exists
        const existing = await ctx.db.query("blog_posts")
            .withIndex("by_slug", (q) => q.eq("slug", args.slug))
            .first();
        if (existing) {
            const { slug, ...updates } = args;
            await ctx.db.patch(existing._id, { ...updates, author: args.author ?? existing.author, authorName: args.authorName ?? existing.authorName });
            return existing._id;
        }
        return await ctx.db.insert("blog_posts", {
            ...args,
            author: args.author ?? "agent",
            authorName: args.authorName ?? "AI Agent",
            publishedAt: args.status === "published" ? (args.publishedAt ?? Date.now()) : undefined,
        });
    },
});
// Create a new blog post
export const create = mutation({
    args: {
        title: v.string(),
        slug: v.string(),
        content: v.any(),
        excerpt: v.optional(v.string()),
        coverImage: v.optional(v.string()),
        locale: v.union(v.literal("en"), v.literal("nl")),
        status: v.union(v.literal("draft"), v.literal("published")),
        tags: v.optional(v.array(v.string())),
        seoTitle: v.optional(v.string()),
        seoDescription: v.optional(v.string()),
        featured: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        const userId = await requireAuth(ctx);
        const identity = await ctx.auth.getUserIdentity();
        const postId = await ctx.db.insert("blog_posts", {
            ...args,
            author: userId,
            authorName: identity?.name,
            authorAvatar: identity?.pictureUrl,
            publishedAt: args.status === "published" ? Date.now() : undefined,
        });
        return postId;
    },
});
// Update a blog post
export const update = mutation({
    args: {
        id: v.id("blog_posts"),
        title: v.optional(v.string()),
        slug: v.optional(v.string()),
        content: v.optional(v.any()),
        excerpt: v.optional(v.string()),
        coverImage: v.optional(v.string()),
        locale: v.optional(v.union(v.literal("en"), v.literal("nl"))),
        status: v.optional(v.union(v.literal("draft"), v.literal("published"))),
        tags: v.optional(v.array(v.string())),
        seoTitle: v.optional(v.string()),
        seoDescription: v.optional(v.string()),
        featured: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        await requireAuth(ctx);
        const { id, ...updates } = args;
        const existingPost = await ctx.db.get(id);
        if (!existingPost) {
            throw new Error("Blog post not found");
        }
        // If changing status to published and there's no publishedAt, set it
        const publishedAt = updates.status === "published" && !existingPost.publishedAt
            ? Date.now()
            : existingPost.publishedAt;
        await ctx.db.patch(id, {
            ...updates,
            publishedAt,
        });
        return id;
    },
});
// Delete a blog post
export const remove = mutation({
    args: { id: v.id("blog_posts") },
    handler: async (ctx, args) => {
        await requireAuth(ctx);
        await ctx.db.delete(args.id);
        return args.id;
    },
});
