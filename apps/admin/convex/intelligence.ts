import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

/**
 * Get recent agent feed items
 */
export const recentFeed = query({
  args: { 
    limit: v.optional(v.number()),
    type: v.optional(v.string()),
  },
  handler: async (ctx, { limit = 50, type }) => {
    let query = ctx.db.query("agent_feed").order("desc");
    
    const items = await query.take(limit);
    
    // Filter by type if specified
    if (type) {
      return items.filter(item => item.type === type);
    }
    
    return items;
  },
});

/**
 * Get dashboard statistics
 */
export const stats = query({
  handler: async (ctx) => {
    const feed = await ctx.db.query("agent_feed").collect();
    const jobs = await ctx.db.query("job_applications").collect();
    const content = await ctx.db.query("content_calendar").collect();
    
    // Count items from this week
    const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const thisWeekFeed = feed.filter(f => f.createdAt > oneWeekAgo);
    
    return {
      trends: thisWeekFeed.filter(f => f.type === "trend").length,
      news: thisWeekFeed.filter(f => f.type === "news").length,
      jobs: jobs.filter(j => j.createdAt > oneWeekAgo).length,
      contentIdeas: content.filter(c => c.status === "idea").length,
      totalFeedItems: feed.length,
      unreadFeed: feed.filter(f => !f.read).length,
    };
  },
});

/**
 * Mark feed item as read
 */
export const markRead = mutation({
  args: { id: v.id("agent_feed") },
  handler: async (ctx, { id }) => {
    await ctx.db.patch(id, { read: true });
  },
});

/**
 * Create content from trend
 */
export const createContentFromFeed = mutation({
  args: { 
    feedId: v.id("agent_feed"),
  },
  handler: async (ctx, { feedId }) => {
    const feedItem = await ctx.db.get(feedId);
    if (!feedItem) throw new Error("Feed item not found");
    
    // Create content calendar entry
    const contentId = await ctx.db.insert("content_calendar", {
      title: feedItem.title,
      type: "blog_post",
      status: "idea",
      notes: `Inspired by ${feedItem.source}: ${feedItem.content}`,
      seoKeywords: feedItem.tags || [],
      createdAt: Date.now(),
    });
    
    // Mark feed item as actioned
    await ctx.db.patch(feedId, { read: true });
    
    return contentId;
  },
});
