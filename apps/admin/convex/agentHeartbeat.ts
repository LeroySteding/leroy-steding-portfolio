import { v } from "convex/values";
import { mutation } from "./_generated/server";

/**
 * Public mutation for agents to register their heartbeat
 * Called from OpenClaw agents to show they're alive
 */
export const registerHeartbeat = mutation({
  args: {
    agentName: v.string(),
    sessionId: v.string(),
    status: v.union(
      v.literal("active"),
      v.literal("idle"),
      v.literal("offline")
    ),
    currentTask: v.optional(v.string()),
    metadata: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    // Find existing session
    const existing = await ctx.db
      .query("agent_sessions")
      .withIndex("by_session_id", (q) => q.eq("sessionId", args.sessionId))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        agentName: args.agentName,
        status: args.status,
        lastActivity: Date.now(),
        metadata: args.metadata,
      });
      return existing._id;
    } else {
      return await ctx.db.insert("agent_sessions", {
        agentName: args.agentName,
        sessionId: args.sessionId,
        status: args.status,
        lastActivity: Date.now(),
        metadata: args.metadata,
        createdAt: Date.now(),
      });
    }
  },
});

/**
 * Public mutation to demo register all agents
 * For development/testing only
 */
export const registerDemoAgents = mutation({
  args: {},
  handler: async (ctx) => {
    const agents = [
      { name: "orchestrator", emoji: "🎯", status: "active" as const },
      { name: "architect", emoji: "🏗️", status: "idle" as const },
      { name: "coder", emoji: "⚡", status: "active" as const },
      { name: "researcher", emoji: "🔍", status: "idle" as const },
      { name: "business", emoji: "💼", status: "active" as const },
      { name: "data-handler", emoji: "🕷️", status: "idle" as const },
      { name: "critic", emoji: "🛡️", status: "active" as const },
    ];

    for (const agent of agents) {
      const sessionId = `demo-${agent.name}-${Date.now()}`;
      
      // Check if already exists
      const existing = await ctx.db
        .query("agent_sessions")
        .filter((q) => q.eq(q.field("agentName"), agent.name))
        .first();

      if (existing) {
        await ctx.db.patch(existing._id, {
          status: agent.status,
          lastActivity: Date.now(),
        });
      } else {
        await ctx.db.insert("agent_sessions", {
          agentName: agent.name,
          sessionId,
          status: agent.status,
          lastActivity: Date.now(),
          metadata: { emoji: agent.emoji, demo: true },
          createdAt: Date.now(),
        });
      }
    }

    return { registered: agents.length };
  },
});
