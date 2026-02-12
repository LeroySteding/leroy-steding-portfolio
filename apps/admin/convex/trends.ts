import { v } from "convex/values";
import { query } from "./_generated/server";

// Get latest trends across platforms
export const latest = query({
  args: {
    platforms: v.optional(v.array(v.string())),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { platforms, limit = 50 }) => {
    let trendsQuery = ctx.db.query("trends");

    const trends = await trendsQuery.order("desc").take(limit);

    // Filter by platform if specified
    if (platforms && platforms.length > 0) {
      return trends.filter((t) => platforms.includes(t.platform));
    }

    return trends;
  },
});

// Get trending topics (highest growth)
export const topGrowth = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { limit = 10 }) => {
    return await ctx.db
      .query("trends")
      .withIndex("by_growth")
      .order("desc")
      .take(limit);
  },
});

// Get trends by platform
export const byPlatform = query({
  args: {
    platform: v.union(
      v.literal("twitter"),
      v.literal("linkedin"),
      v.literal("reddit")
    ),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { platform, limit = 20 }) => {
    return await ctx.db
      .query("trends")
      .withIndex("by_platform_time", (q) => q.eq("platform", platform))
      .order("desc")
      .take(limit);
  },
});

// Get trend stats
export const getStats = query({
  handler: async (ctx) => {
    const allTrends = await ctx.db.query("trends").collect();

    const byPlatform = {
      twitter: allTrends.filter((t) => t.platform === "twitter").length,
      linkedin: allTrends.filter((t) => t.platform === "linkedin").length,
      reddit: allTrends.filter((t) => t.platform === "reddit").length,
    };

    const topTrend = allTrends.sort((a, b) => b.growthRate - a.growthRate)[0];

    return {
      total: allTrends.length,
      byPlatform,
      topTrend: topTrend
        ? {
            topic: topTrend.topic,
            platform: topTrend.platform,
            growthRate: topTrend.growthRate,
          }
        : null,
    };
  },
});
