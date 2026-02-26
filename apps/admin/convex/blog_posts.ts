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
    translationGroup: v.optional(v.string()),
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
    translationGroup: v.optional(v.string()),
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
    const publishedAt =
      updates.status === "published" && !existingPost.publishedAt
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

// Get all translations of a blog post
export const getTranslations = query({
  args: { id: v.id("blog_posts") },
  handler: async (ctx, args) => {
    const post = await ctx.db.get(args.id);
    if (!post || !post.translationGroup) {
      return [];
    }

    const translations = await ctx.db
      .query("blog_posts")
      .withIndex("by_translation_group", (q) =>
        q.eq("translationGroup", post.translationGroup)
      )
      .collect();

    // Return all translations except the current post
    return translations.filter((t) => t._id !== args.id);
  },
});

// Link two posts as translations
export const linkTranslation = mutation({
  args: {
    sourceId: v.id("blog_posts"),
    targetId: v.id("blog_posts"),
  },
  handler: async (ctx, args) => {
    await requireAuth(ctx);

    const source = await ctx.db.get(args.sourceId);
    const target = await ctx.db.get(args.targetId);

    if (!source || !target) {
      throw new Error("Post not found");
    }

    if (source.locale === target.locale) {
      throw new Error("Cannot link posts with the same locale");
    }

    // Generate a new translation group if neither has one
    const translationGroup =
      source.translationGroup ||
      target.translationGroup ||
      crypto.randomUUID();

    // Update both posts to share the same translation group
    await ctx.db.patch(args.sourceId, { translationGroup });
    await ctx.db.patch(args.targetId, { translationGroup });

    // If source had a translation group, update all posts in that group
    if (source.translationGroup && source.translationGroup !== translationGroup) {
      const existingTranslations = await ctx.db
        .query("blog_posts")
        .withIndex("by_translation_group", (q) =>
          q.eq("translationGroup", source.translationGroup!)
        )
        .collect();

      for (const translation of existingTranslations) {
        if (translation._id !== args.sourceId) {
          await ctx.db.patch(translation._id, { translationGroup });
        }
      }
    }

    // Same for target
    if (target.translationGroup && target.translationGroup !== translationGroup) {
      const existingTranslations = await ctx.db
        .query("blog_posts")
        .withIndex("by_translation_group", (q) =>
          q.eq("translationGroup", target.translationGroup!)
        )
        .collect();

      for (const translation of existingTranslations) {
        if (translation._id !== args.targetId) {
          await ctx.db.patch(translation._id, { translationGroup });
        }
      }
    }

    return translationGroup;
  },
});

// Unlink a post from its translation group
export const unlinkTranslation = mutation({
  args: { id: v.id("blog_posts") },
  handler: async (ctx, args) => {
    await requireAuth(ctx);

    const post = await ctx.db.get(args.id);
    if (!post || !post.translationGroup) {
      return;
    }

    // Remove the translation group from this post
    await ctx.db.patch(args.id, { translationGroup: undefined });
  },
});

// Create a translation draft from an existing post
export const createTranslation = mutation({
  args: {
    sourceId: v.id("blog_posts"),
    targetLocale: v.union(v.literal("en"), v.literal("nl")),
  },
  handler: async (ctx, args) => {
    const userId = await requireAuth(ctx);
    const identity = await ctx.auth.getUserIdentity();

    const source = await ctx.db.get(args.sourceId);
    if (!source) {
      throw new Error("Source post not found");
    }

    if (source.locale === args.targetLocale) {
      throw new Error("Cannot create translation with the same locale");
    }

    // Generate or use existing translation group
    const translationGroup = source.translationGroup || crypto.randomUUID();

    // Update source with translation group if it doesn't have one
    if (!source.translationGroup) {
      await ctx.db.patch(args.sourceId, { translationGroup });
    }

    // Create new post as a draft with same content but different locale
    const newPostId = await ctx.db.insert("blog_posts", {
      title: `${source.title} (${args.targetLocale.toUpperCase()})`,
      slug: `${source.slug}-${args.targetLocale}`,
      content: source.content,
      excerpt: source.excerpt,
      coverImage: source.coverImage,
      locale: args.targetLocale,
      status: "draft",
      tags: source.tags,
      seoTitle: source.seoTitle,
      seoDescription: source.seoDescription,
      featured: source.featured,
      author: userId,
      authorName: identity?.name,
      authorAvatar: identity?.pictureUrl,
      translationGroup,
    });

    return newPostId;
  },
});
