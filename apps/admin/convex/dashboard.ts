import { query } from "./_generated/server";

// Get dashboard overview stats
export const getStats = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    // Get job stats
    const allJobs = await ctx.db
      .query("jobs")
      .withIndex("by_user", (q) => q.eq("clerkUserId", identity.subject))
      .collect();

    const newJobs = allJobs.filter((j) => j.status === "new").length;
    const highMatches = allJobs.filter(
      (j) => j.matchScore && j.matchScore > 85
    ).length;

    // Get trend stats
    const recentTrends = await ctx.db
      .query("trends")
      .order("desc")
      .take(100);

    const trendingCount = recentTrends.filter((t) => t.growthRate > 50).length;

    // Get content ideas
    const contentIdeas = await ctx.db
      .query("contentIdeas")
      .withIndex("by_user_status", (q) => q.eq("clerkUserId", identity.subject))
      .collect();

    const readyToPublish = contentIdeas.filter(
      (c) => c.status === "drafted"
    ).length;

    // Get alerts
    const unreadAlerts = await ctx.db
      .query("alerts")
      .withIndex("by_user_read", (q) =>
        q.eq("clerkUserId", identity.subject).eq("read", false)
      )
      .collect();

    return {
      jobs: {
        total: allJobs.length,
        new: newJobs,
        highMatches,
      },
      trends: {
        total: recentTrends.length,
        trending: trendingCount,
      },
      content: {
        total: contentIdeas.length,
        readyToPublish,
      },
      alerts: {
        unread: unreadAlerts.length,
        urgent: unreadAlerts.filter((a) => a.priority === "urgent").length,
      },
    };
  },
});

// Get recent activity
export const getRecentActivity = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    // Recent jobs (last 7 days)
    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const recentJobs = await ctx.db
      .query("jobs")
      .withIndex("by_user", (q) => q.eq("clerkUserId", identity.subject))
      .filter((q) => q.gte(q.field("createdAt"), sevenDaysAgo))
      .order("desc")
      .take(5);

    // Top trends (today)
    const todayStart = Date.now() - 24 * 60 * 60 * 1000;
    const topTrends = await ctx.db
      .query("trends")
      .filter((q) => q.gte(q.field("timestamp"), todayStart))
      .order("desc")
      .take(5);

    // Recent alerts
    const recentAlerts = await ctx.db
      .query("alerts")
      .withIndex("by_user_read", (q) => q.eq("clerkUserId", identity.subject))
      .order("desc")
      .take(5);

    return {
      recentJobs,
      topTrends,
      recentAlerts,
    };
  },
});
