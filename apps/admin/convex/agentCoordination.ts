import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// ============================================================================
// AGENT TASKS
// ============================================================================

export const createAgentTask = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    assignedTo: v.array(v.string()),
    priority: v.union(
      v.literal("low"),
      v.literal("medium"),
      v.literal("high"),
      v.literal("critical")
    ),
    context: v.optional(v.string()),
    dependencies: v.optional(v.array(v.string())),
    createdBy: v.string(),
    linearIssueId: v.optional(v.string()),
    caseFileId: v.optional(v.id("case_files")),
    metadata: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const taskId = await ctx.db.insert("agent_tasks", {
      title: args.title,
      description: args.description,
      assignedTo: args.assignedTo,
      status: "pending",
      priority: args.priority,
      context: args.context,
      dependencies: args.dependencies || [],
      createdBy: args.createdBy,
      linearIssueId: args.linearIssueId,
      caseFileId: args.caseFileId,
      metadata: args.metadata,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    // Create agent feed entry
    await ctx.db.insert("agent_feed", {
      type: "task_update",
      title: `New Task: ${args.title}`,
      content: `Assigned to: ${args.assignedTo.join(", ")}`,
      source: args.createdBy,
      tags: ["agent_task", ...args.assignedTo],
      priority: args.priority,
      read: false,
      metadata: { taskId },
      createdAt: Date.now(),
    });

    return taskId;
  },
});

export const updateAgentTask = mutation({
  args: {
    taskId: v.id("agent_tasks"),
    status: v.optional(
      v.union(
        v.literal("pending"),
        v.literal("in_progress"),
        v.literal("blocked"),
        v.literal("completed"),
        v.literal("cancelled")
      )
    ),
    assignedTo: v.optional(v.array(v.string())),
    priority: v.optional(
      v.union(
        v.literal("low"),
        v.literal("medium"),
        v.literal("high"),
        v.literal("critical")
      )
    ),
    context: v.optional(v.string()),
    metadata: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const { taskId, ...updates } = args;

    await ctx.db.patch(taskId, {
      ...updates,
      updatedAt: Date.now(),
      ...(updates.status === "completed" && { completedAt: Date.now() }),
    });

    // Create feed entry for status change
    if (updates.status) {
      const task = await ctx.db.get(taskId);
      if (task) {
        await ctx.db.insert("agent_feed", {
          type: "task_update",
          title: `Task ${updates.status}: ${task.title}`,
          content: `Status changed to ${updates.status}`,
          source: "system",
          tags: ["agent_task", ...task.assignedTo],
          priority: task.priority,
          read: false,
          metadata: { taskId },
          createdAt: Date.now(),
        });
      }
    }

    return taskId;
  },
});

export const getAgentTasks = query({
  args: {
    agentName: v.optional(v.string()),
    status: v.optional(
      v.union(
        v.literal("pending"),
        v.literal("in_progress"),
        v.literal("blocked"),
        v.literal("completed"),
        v.literal("cancelled")
      )
    ),
    caseFileId: v.optional(v.id("case_files")),
  },
  handler: async (ctx, args) => {
    let tasks = await ctx.db.query("agent_tasks").collect();

    if (args.agentName) {
      tasks = tasks.filter((t) => t.assignedTo.includes(args.agentName!));
    }

    if (args.status) {
      tasks = tasks.filter((t) => t.status === args.status);
    }

    if (args.caseFileId) {
      tasks = tasks.filter((t) => t.caseFileId === args.caseFileId);
    }

    return tasks.sort((a, b) => b.createdAt - a.createdAt);
  },
});

// ============================================================================
// AGENT MEMORY
// ============================================================================

export const createAgentMemory = mutation({
  args: {
    agentName: v.string(),
    category: v.union(
      v.literal("decision"),
      v.literal("learning"),
      v.literal("context"),
      v.literal("reference"),
      v.literal("insight")
    ),
    content: v.string(),
    tags: v.array(v.string()),
    sharedWith: v.union(v.literal("all"), v.literal("team"), v.literal("private")),
    relatedTaskId: v.optional(v.id("agent_tasks")),
    relatedCaseId: v.optional(v.id("case_files")),
    metadata: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const memoryId = await ctx.db.insert("agent_memory", {
      ...args,
      createdAt: Date.now(),
    });

    return memoryId;
  },
});

export const searchAgentMemory = query({
  args: {
    searchTerm: v.string(),
    agentName: v.optional(v.string()),
    category: v.optional(
      v.union(
        v.literal("decision"),
        v.literal("learning"),
        v.literal("context"),
        v.literal("reference"),
        v.literal("insight")
      )
    ),
    sharedWith: v.optional(
      v.union(v.literal("all"), v.literal("team"), v.literal("private"))
    ),
  },
  handler: async (ctx, args) => {
    const results = await ctx.db
      .query("agent_memory")
      .withSearchIndex("search_content", (q) =>
        q.search("content", args.searchTerm)
      )
      .collect();

    let filtered = results;

    if (args.agentName) {
      filtered = filtered.filter((m) => m.agentName === args.agentName);
    }

    if (args.category) {
      filtered = filtered.filter((m) => m.category === args.category);
    }

    if (args.sharedWith) {
      filtered = filtered.filter((m) => m.sharedWith === args.sharedWith);
    }

    return filtered.sort((a, b) => b.createdAt - a.createdAt);
  },
});

export const getAgentMemories = query({
  args: {
    agentName: v.optional(v.string()),
    category: v.optional(
      v.union(
        v.literal("decision"),
        v.literal("learning"),
        v.literal("context"),
        v.literal("reference"),
        v.literal("insight")
      )
    ),
    tags: v.optional(v.array(v.string())),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let memories = await ctx.db.query("agent_memory").collect();

    if (args.agentName) {
      memories = memories.filter((m) => m.agentName === args.agentName);
    }

    if (args.category) {
      memories = memories.filter((m) => m.category === args.category);
    }

    if (args.tags && args.tags.length > 0) {
      memories = memories.filter((m) =>
        args.tags!.some((tag) => m.tags.includes(tag))
      );
    }

    memories = memories.sort((a, b) => b.createdAt - a.createdAt);

    if (args.limit) {
      memories = memories.slice(0, args.limit);
    }

    return memories;
  },
});

// ============================================================================
// CASE FILES
// ============================================================================

export const createCaseFile = mutation({
  args: {
    projectName: v.string(),
    summary: v.string(),
    participants: v.array(v.string()),
    tags: v.optional(v.array(v.string())),
    linearProjectId: v.optional(v.string()),
    telegramGroupId: v.optional(v.string()),
    metadata: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const caseFileId = await ctx.db.insert("case_files", {
      projectName: args.projectName,
      status: "active",
      participants: args.participants,
      summary: args.summary,
      decisions: [],
      resources: [],
      tags: args.tags || [],
      linearProjectId: args.linearProjectId,
      telegramGroupId: args.telegramGroupId,
      metadata: args.metadata,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    // Create agent feed entry
    await ctx.db.insert("agent_feed", {
      type: "insight",
      title: `New Case File: ${args.projectName}`,
      content: args.summary,
      source: "orchestrator",
      tags: ["case_file", ...args.participants],
      priority: "high",
      read: false,
      metadata: { caseFileId },
      createdAt: Date.now(),
    });

    return caseFileId;
  },
});

export const addDecisionToCaseFile = mutation({
  args: {
    caseFileId: v.id("case_files"),
    decision: v.string(),
    madeBy: v.string(),
    rationale: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const caseFile = await ctx.db.get(args.caseFileId);
    if (!caseFile) throw new Error("Case file not found");

    const newDecision = {
      decision: args.decision,
      madeBy: args.madeBy,
      timestamp: Date.now(),
      rationale: args.rationale,
    };

    await ctx.db.patch(args.caseFileId, {
      decisions: [...caseFile.decisions, newDecision],
      updatedAt: Date.now(),
    });

    return args.caseFileId;
  },
});

export const addResourceToCaseFile = mutation({
  args: {
    caseFileId: v.id("case_files"),
    type: v.union(
      v.literal("link"),
      v.literal("file"),
      v.literal("code"),
      v.literal("note"),
      v.literal("reference")
    ),
    title: v.string(),
    content: v.string(),
    url: v.optional(v.string()),
    addedBy: v.string(),
  },
  handler: async (ctx, args) => {
    const caseFile = await ctx.db.get(args.caseFileId);
    if (!caseFile) throw new Error("Case file not found");

    const newResource = {
      type: args.type,
      title: args.title,
      content: args.content,
      url: args.url,
      addedBy: args.addedBy,
      timestamp: Date.now(),
    };

    await ctx.db.patch(args.caseFileId, {
      resources: [...caseFile.resources, newResource],
      updatedAt: Date.now(),
    });

    return args.caseFileId;
  },
});

export const getCaseFiles = query({
  args: {
    status: v.optional(
      v.union(
        v.literal("active"),
        v.literal("paused"),
        v.literal("completed"),
        v.literal("archived")
      )
    ),
    participant: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let caseFiles = await ctx.db.query("case_files").collect();

    if (args.status) {
      caseFiles = caseFiles.filter((cf) => cf.status === args.status);
    }

    if (args.participant) {
      caseFiles = caseFiles.filter((cf) =>
        cf.participants.includes(args.participant!)
      );
    }

    return caseFiles.sort((a, b) => b.updatedAt - a.updatedAt);
  },
});

export const getCaseFileById = query({
  args: { caseFileId: v.id("case_files") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.caseFileId);
  },
});

// ============================================================================
// AGENT SESSIONS
// ============================================================================

export const updateAgentSession = mutation({
  args: {
    agentName: v.string(),
    sessionId: v.string(),
    status: v.union(
      v.literal("active"),
      v.literal("idle"),
      v.literal("offline")
    ),
    currentTask: v.optional(v.id("agent_tasks")),
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
        status: args.status,
        currentTask: args.currentTask,
        lastActivity: Date.now(),
        metadata: args.metadata,
      });
      return existing._id;
    } else {
      return await ctx.db.insert("agent_sessions", {
        agentName: args.agentName,
        sessionId: args.sessionId,
        status: args.status,
        currentTask: args.currentTask,
        lastActivity: Date.now(),
        metadata: args.metadata,
        createdAt: Date.now(),
      });
    }
  },
});

export const getAgentSessions = query({
  args: {
    status: v.optional(
      v.union(
        v.literal("active"),
        v.literal("idle"),
        v.literal("offline")
      )
    ),
  },
  handler: async (ctx, args) => {
    let sessions = await ctx.db.query("agent_sessions").collect();

    if (args.status) {
      sessions = sessions.filter((s) => s.status === args.status);
    }

    return sessions.sort((a, b) => b.lastActivity - a.lastActivity);
  },
});
