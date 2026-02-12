import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // LinkedIn Jobs
  jobs: defineTable({
    clerkUserId: v.string(),
    platform: v.literal("linkedin"),
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
    status: v.union(
      v.literal("new"),
      v.literal("viewed"),
      v.literal("saved"),
      v.literal("applied"),
      v.literal("rejected"),
      v.literal("archived")
    ),
    notes: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["clerkUserId"])
    .index("by_user_status", ["clerkUserId", "status"])
    .index("by_posted", ["postedAt"])
    .index("by_match_score", ["matchScore"])
    .searchIndex("search_jobs", {
      searchField: "title",
      filterFields: ["clerkUserId", "location", "status"],
    }),

  // Trends (X/Twitter, LinkedIn, Reddit)
  trends: defineTable({
    platform: v.union(
      v.literal("twitter"),
      v.literal("linkedin"),
      v.literal("reddit")
    ),
    topic: v.string(),
    hashtag: v.optional(v.string()),
    mentions: v.number(),
    sentiment: v.number(), // -1 to 1
    growthRate: v.number(), // % change from previous period
    peakTime: v.number(),
    examplePosts: v.array(
      v.object({
        url: v.string(),
        author: v.string(),
        engagement: v.number(),
      })
    ),
    timestamp: v.number(),
  })
    .index("by_platform_time", ["platform", "timestamp"])
    .index("by_growth", ["growthRate"]),

  // Posts (from all platforms)
  posts: defineTable({
    platform: v.union(
      v.literal("twitter"),
      v.literal("linkedin"),
      v.literal("reddit")
    ),
    externalId: v.string(),
    author: v.string(),
    authorAvatar: v.optional(v.string()),
    content: v.string(),
    url: v.string(),
    engagement: v.object({
      likes: v.number(),
      shares: v.number(),
      comments: v.number(),
      views: v.optional(v.number()),
    }),
    topics: v.array(v.string()),
    sentiment: v.optional(v.number()),
    timestamp: v.number(),
  })
    .index("by_platform_time", ["platform", "timestamp"])
    .index("by_likes", ["engagement.likes"]),

  // Content Ideas
  contentIdeas: defineTable({
    clerkUserId: v.string(),
    title: v.string(),
    description: v.string(),
    platform: v.union(
      v.literal("twitter"),
      v.literal("linkedin"),
      v.literal("reddit"),
      v.literal("multi")
    ),
    format: v.string(), // "thread", "article", "post", "carousel"
    basedOnTrends: v.array(v.id("trends")),
    estimatedReach: v.optional(v.number()),
    bestPostTime: v.optional(v.number()),
    status: v.union(
      v.literal("idea"),
      v.literal("drafted"),
      v.literal("scheduled"),
      v.literal("published")
    ),
    draft: v.optional(v.string()),
    publishedUrl: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user_status", ["clerkUserId", "status"])
    .index("by_created", ["createdAt"]),

  // Alerts/Notifications
  alerts: defineTable({
    clerkUserId: v.string(),
    type: v.union(
      v.literal("job_match"),
      v.literal("trend_spike"),
      v.literal("competitor_activity"),
      v.literal("opportunity")
    ),
    title: v.string(),
    message: v.string(),
    data: v.any(),
    priority: v.union(
      v.literal("low"),
      v.literal("medium"),
      v.literal("high"),
      v.literal("urgent")
    ),
    read: v.boolean(),
    dismissed: v.boolean(),
    sentToTelegram: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_user_read", ["clerkUserId", "read"])
    .index("by_priority", ["priority", "createdAt"]),

  // User Monitoring Config
  monitoringConfig: defineTable({
    clerkUserId: v.string(),
    jobFilters: v.object({
      keywords: v.array(v.string()),
      locations: v.array(v.string()),
      minSalary: v.optional(v.number()),
      maxSalary: v.optional(v.number()),
      skills: v.array(v.string()),
    }),
    trendFilters: v.object({
      platforms: v.array(v.string()),
      topics: v.array(v.string()),
      minMentions: v.number(),
    }),
    notifications: v.object({
      telegram: v.boolean(),
      email: v.boolean(),
      inApp: v.boolean(),
    }),
    syncSchedule: v.object({
      linkedin: v.string(), // cron expression
      twitter: v.string(),
      reddit: v.string(),
    }),
    updatedAt: v.number(),
  }).index("by_user", ["clerkUserId"]),
});
