import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  blog_posts: defineTable({
    title: v.string(),
    slug: v.string(),
    content: v.any(), // Tiptap JSON content
    excerpt: v.optional(v.string()),
    coverImage: v.optional(v.string()),
    locale: v.union(v.literal("en"), v.literal("nl")),
    status: v.union(v.literal("draft"), v.literal("published")),
    publishedAt: v.optional(v.number()),
    author: v.string(),
    authorName: v.optional(v.string()),
    authorAvatar: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    seoTitle: v.optional(v.string()),
    seoDescription: v.optional(v.string()),
    readingTime: v.optional(v.number()),
    featured: v.optional(v.boolean()),
  })
    .index("by_slug", ["slug"])
    .index("by_locale", ["locale"])
    .index("by_status", ["status"])
    .index("by_published_at", ["publishedAt"]),

  projects: defineTable({
    title: v.string(),
    slug: v.string(),
    description: v.string(),
    content: v.any(), // Tiptap JSON content
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
  })
    .index("by_slug", ["slug"])
    .index("by_locale", ["locale"])
    .index("by_featured", ["featured", "featuredOrder"])
    .index("by_published", ["published"]),

  experiences: defineTable({
    title: v.string(),
    company: v.string(),
    position: v.optional(v.string()),
    description: v.optional(v.string()),
    content: v.optional(v.any()), // Tiptap JSON content
    location: v.optional(v.string()),
    logoUrl: v.optional(v.string()),
    startDate: v.string(), // ISO date string
    endDate: v.optional(v.string()), // ISO date string, null = current
    isCurrent: v.optional(v.boolean()),
    locale: v.union(v.literal("en"), v.literal("nl")),
    type: v.union(v.literal("work"), v.literal("education")),
    technologies: v.optional(v.array(v.string())),
    achievements: v.optional(v.array(v.string())),
    order: v.optional(v.number()),
    published: v.optional(v.boolean()),
  })
    .index("by_locale", ["locale"])
    .index("by_type", ["type"])
    .index("by_start_date", ["startDate"])
    .index("by_order", ["order"]),

  skills: defineTable({
    name: v.string(),
    category: v.string(),
    proficiency: v.number(), // 1-100
    icon: v.optional(v.string()),
    iconUrl: v.optional(v.string()),
    color: v.optional(v.string()),
    yearsOfExperience: v.optional(v.number()),
    order: v.optional(v.number()),
    locale: v.optional(v.union(v.literal("en"), v.literal("nl"))),
    published: v.optional(v.boolean()),
  })
    .index("by_category", ["category"])
    .index("by_order", ["order"])
    .index("by_name", ["name"]),

  media: defineTable({
    storageId: v.id("_storage"),
    filename: v.string(),
    mimeType: v.string(),
    alt: v.optional(v.string()),
    caption: v.optional(v.string()),
    width: v.optional(v.number()),
    height: v.optional(v.number()),
    fileSize: v.optional(v.number()),
    uploadedBy: v.string(), // Clerk user ID
  })
    .index("by_mime_type", ["mimeType"])
    .index("by_uploaded_by", ["uploadedBy"]),

  site_settings: defineTable({
    key: v.string(),
    value: v.any(),
    locale: v.optional(v.union(v.literal("en"), v.literal("nl"))),
    description: v.optional(v.string()),
    updatedBy: v.optional(v.string()),
  }).index("by_key", ["key"]),
});
