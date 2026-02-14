import { mutation } from "./_generated/server";
import { v } from "convex/values";

// Development helper: Seed agent sessions for testing
export const seedAgentSessions = mutation({
  args: {},
  handler: async (ctx) => {
    const agents = [
      { name: "orchestrator", status: "active" as const },
      { name: "architect", status: "idle" as const },
      { name: "coder", status: "active" as const },
      { name: "researcher", status: "active" as const },
      { name: "business", status: "idle" as const },
      { name: "data-scraper", status: "offline" as const },
      { name: "qa-critic", status: "offline" as const },
      { name: "compliance", status: "offline" as const },
    ];

    const now = Date.now();
    let created = 0;
    
    for (const agent of agents) {
      // Check if agent session already exists
      const existing = await ctx.db
        .query("agent_sessions")
        .filter((q) => q.eq(q.field("agentName"), agent.name))
        .first();

      if (!existing) {
        await ctx.db.insert("agent_sessions", {
          agentName: agent.name,
          sessionId: `session-${agent.name}-${now}`,
          status: agent.status,
          lastActivity: now - (agent.status === "offline" ? 86400000 : Math.floor(Math.random() * 3600000)),
          currentTask: undefined,
          metadata: {},
          createdAt: now,
        });
        created++;
      }
    }

    return { 
      success: true, 
      message: `Seeded ${created} agent sessions (${agents.length - created} already existed)` 
    };
  },
});

// Update agent status (called by real agents via API)
export const updateAgentStatus = mutation({
  args: {
    agentName: v.union(
      v.literal("orchestrator"),
      v.literal("architect"),
      v.literal("coder"),
      v.literal("researcher"),
      v.literal("business"),
      v.literal("data-scraper"),
      v.literal("qa-critic"),
      v.literal("compliance")
    ),
    status: v.union(
      v.literal("active"),
      v.literal("idle"),
      v.literal("offline")
    ),
    currentTask: v.optional(v.id("agent_tasks")),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("agent_sessions")
      .filter((q) => q.eq(q.field("agentName"), args.agentName))
      .first();

    const now = Date.now();

    if (existing) {
      await ctx.db.patch(existing._id, {
        status: args.status,
        lastActivity: now,
        ...(args.currentTask && { currentTask: args.currentTask }),
      });
    } else {
      await ctx.db.insert("agent_sessions", {
        agentName: args.agentName,
        sessionId: `session-${args.agentName}-${now}`,
        status: args.status,
        lastActivity: now,
        currentTask: args.currentTask,
        metadata: {},
        createdAt: now,
      });
    }

    return { success: true };
  },
});
