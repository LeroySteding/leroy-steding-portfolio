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

  agent_feed: defineTable({
    type: v.union(
      v.literal("news"),
      v.literal("trend"),
      v.literal("alert"),
      v.literal("task_update"),
      v.literal("deploy"),
      v.literal("pr"),
      v.literal("briefing"),
      v.literal("insight")
    ),
    title: v.string(),
    content: v.string(),
    source: v.optional(v.string()),
    tags: v.array(v.string()),
    priority: v.union(
      v.literal("low"),
      v.literal("medium"),
      v.literal("high"),
      v.literal("critical")
    ),
    read: v.boolean(),
    metadata: v.optional(v.any()),
    createdAt: v.number(),
  })
    .index("by_type", ["type"])
    .index("by_priority", ["priority"])
    .index("by_created_at", ["createdAt"])
    .index("by_read", ["read"]),

  tasks: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    status: v.union(
      v.literal("backlog"),
      v.literal("todo"),
      v.literal("in_progress"),
      v.literal("review"),
      v.literal("done"),
      v.literal("cancelled")
    ),
    priority: v.union(
      v.literal("low"),
      v.literal("medium"),
      v.literal("high"),
      v.literal("critical")
    ),
    category: v.union(
      v.literal("development"),
      v.literal("devops"),
      v.literal("content"),
      v.literal("seo"),
      v.literal("design"),
      v.literal("marketing"),
      v.literal("job_hunting"),
      v.literal("other")
    ),
    assignee: v.optional(v.string()),
    dueDate: v.optional(v.number()),
    completedAt: v.optional(v.number()),
    tags: v.array(v.string()),
    relatedUrl: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_status", ["status"])
    .index("by_priority", ["priority"])
    .index("by_category", ["category"])
    .index("by_assignee", ["assignee"])
    .index("by_due_date", ["dueDate"]),

  job_applications: defineTable({
    company: v.string(),
    position: v.string(),
    url: v.optional(v.string()),
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
    salary: v.optional(v.string()),
    location: v.optional(v.string()),
    remote: v.optional(v.boolean()),
    notes: v.optional(v.string()),
    contacts: v.optional(
      v.array(
        v.object({
          name: v.string(),
          role: v.optional(v.string()),
          linkedin: v.optional(v.string()),
        })
      )
    ),
    appliedAt: v.optional(v.number()),
    nextAction: v.optional(v.string()),
    nextActionDate: v.optional(v.number()),
    tags: v.array(v.string()),
    createdAt: v.number(),
  })
    .index("by_status", ["status"])
    .index("by_company", ["company"])
    .index("by_created_at", ["createdAt"]),

  seo_tracking: defineTable({
    url: v.string(),
    keyword: v.optional(v.string()),
    position: v.optional(v.number()),
    impressions: v.optional(v.number()),
    clicks: v.optional(v.number()),
    ctr: v.optional(v.number()),
    domain: v.string(),
    pageTitle: v.optional(v.string()),
    notes: v.optional(v.string()),
    checkedAt: v.number(),
    createdAt: v.number(),
  })
    .index("by_domain", ["domain"])
    .index("by_keyword", ["keyword"])
    .index("by_checked_at", ["checkedAt"]),

  content_calendar: defineTable({
    title: v.string(),
    type: v.union(
      v.literal("blog_post"),
      v.literal("social_post"),
      v.literal("newsletter"),
      v.literal("video"),
      v.literal("podcast"),
      v.literal("case_study")
    ),
    status: v.union(
      v.literal("idea"),
      v.literal("outline"),
      v.literal("drafting"),
      v.literal("review"),
      v.literal("scheduled"),
      v.literal("published")
    ),
    platform: v.optional(v.string()),
    targetDate: v.optional(v.number()),
    publishedAt: v.optional(v.number()),
    notes: v.optional(v.string()),
    seoKeywords: v.optional(v.array(v.string())),
    relatedBlogPostId: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_type", ["type"])
    .index("by_status", ["status"])
    .index("by_target_date", ["targetDate"]),

  analytics_log: defineTable({
    event: v.string(),
    agent: v.optional(v.string()),
    model: v.optional(v.string()),
    tokensIn: v.optional(v.number()),
    tokensOut: v.optional(v.number()),
    cost: v.optional(v.number()),
    durationMs: v.optional(v.number()),
    metadata: v.optional(v.any()),
    createdAt: v.number(),
  })
    .index("by_event", ["event"])
    .index("by_agent", ["agent"])
    .index("by_created_at", ["createdAt"])
    .index("by_model", ["model"]),

  deployments: defineTable({
    project: v.string(),
    environment: v.union(
      v.literal("production"),
      v.literal("preview"),
      v.literal("development")
    ),
    status: v.union(
      v.literal("building"),
      v.literal("ready"),
      v.literal("error"),
      v.literal("cancelled")
    ),
    url: v.optional(v.string()),
    commitSha: v.optional(v.string()),
    commitMessage: v.optional(v.string()),
    buildDuration: v.optional(v.number()),
    platform: v.string(),
    createdAt: v.number(),
  })
    .index("by_project", ["project"])
    .index("by_status", ["status"])
    .index("by_created_at", ["createdAt"]),

  github_activity: defineTable({
    repo: v.string(),
    type: v.union(
      v.literal("pr"),
      v.literal("issue"),
      v.literal("review"),
      v.literal("merge"),
      v.literal("release")
    ),
    number: v.number(),
    title: v.string(),
    status: v.string(),
    url: v.string(),
    author: v.optional(v.string()),
    labels: v.optional(v.array(v.string())),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  })
    .index("by_repo", ["repo"])
    .index("by_type", ["type"])
    .index("by_status", ["status"])
    .index("by_created_at", ["createdAt"]),

  site_settings: defineTable({
    key: v.string(),
    value: v.any(),
    locale: v.optional(v.union(v.literal("en"), v.literal("nl"))),
    description: v.optional(v.string()),
    updatedBy: v.optional(v.string()),
  }).index("by_key", ["key"]),
});
