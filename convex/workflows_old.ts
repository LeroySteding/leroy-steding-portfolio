/**
 * CONVEX WORKFLOW ENGINE
 * Autonomous agent dispatch on status changes
 */

import { v } from "convex/values";
import { action, internalAction, internalMutation, mutation, query } from "./_generated/server";
import { internal } from "./_generated/api";

// ==================== WORKFLOW DEFINITIONS ====================

type JobStatus = "discovered" | "researching" | "applying" | "applied" | "interviewing" | "offer" | "rejected" | "withdrawn";
type ContentStatus = "idea" | "outline" | "drafting" | "review" | "scheduled" | "published";

interface WorkflowRule {
  trigger: string; // status transition
  agent: string;
  taskTemplate: string;
  priority: "low" | "medium" | "high" | "critical";
}

// Job Application Workflows
const JOB_WORKFLOWS: Record<string, WorkflowRule> = {
  "discovered→researching": {
    trigger: "discovered→researching",
    agent: "researcher",
    taskTemplate: "Research company: {company} for {position} role. Analyze culture, tech stack, interview process, and key decision makers. Location: {location}",
    priority: "high",
  },
  "researching→applying": {
    trigger: "researching→applying",
    agent: "business",
    taskTemplate: "Draft application materials for {company} - {position}. Create tailored resume and cover letter highlighting relevant experience. Location: {location}",
    priority: "high",
  },
  "applied→interviewing": {
    trigger: "applied→interviewing",
    agent: "researcher",
    taskTemplate: "Prepare interview brief for {company} - {position}. Research likely questions, prepare STAR stories, identify salary negotiation points.",
    priority: "critical",
  },
  "interviewing→offer": {
    trigger: "interviewing→offer",
    agent: "business",
    taskTemplate: "Draft negotiation strategy for {company} offer. Research market rates for {position} in {location}, prepare counter-offer script.",
    priority: "critical",
  },
};

// Content Calendar Workflows
const CONTENT_WORKFLOWS: Record<string, WorkflowRule> = {
  "idea→outline": {
    trigger: "idea→outline",
    agent: "business",
    taskTemplate: "Create outline for {type}: '{title}'. Target platform: {platform}. Keywords: {keywords}. Structure sections and key points.",
    priority: "medium",
  },
  "outline→drafting": {
    trigger: "outline→drafting",
    agent: "business",
    taskTemplate: "Write draft for {type}: '{title}'. Platform: {platform}. Follow outline, optimize for SEO keywords: {keywords}.",
    priority: "high",
  },
  "drafting→review": {
    trigger: "drafting→review",
    agent: "critic",
    taskTemplate: "Review {type}: '{title}' for quality, accuracy, and engagement. Check SEO optimization for: {keywords}. Provide improvement suggestions.",
    priority: "medium",
  },
  "review→scheduled": {
    trigger: "review→scheduled",
    agent: "orchestrator",
    taskTemplate: "Schedule {type}: '{title}' for publication on {platform}. Coordinate cross-posting and promotion strategy.",
    priority: "low",
  },
};

// ==================== WORKFLOW DISPATCH ====================

export const dispatchJobWorkflow = internalMutation({
  args: {
    jobId: v.id("job_applications"),
    oldStatus: v.string(),
    newStatus: v.string(),
    jobData: v.object({
      company: v.string(),
      position: v.string(),
      location: v.optional(v.string()),
      notes: v.optional(v.string()),
    }),
  },
  handler: async (ctx, args) => {
    const transition = `${args.oldStatus}→${args.newStatus}`;
    const rule = JOB_WORKFLOWS[transition];

    if (!rule) {
      console.log(`[workflow] No workflow defined for job transition: ${transition}`);
      return null;
    }

    // Generate task description from template
    const taskDescription = rule.taskTemplate
      .replace("{company}", args.jobData.company)
      .replace("{position}", args.jobData.position)
      .replace("{location}", args.jobData.location || "Unknown")
      .replace("{notes}", args.jobData.notes || "");

    // Create agent task
    const taskId = await ctx.db.insert("agent_tasks", {
      title: `${rule.agent}: ${args.jobData.company} - ${args.jobData.position}`,
      description: taskDescription,
      assignedTo: [rule.agent],
      status: "pending",
      priority: rule.priority,
      context: JSON.stringify({
        workflowType: "job",
        jobId: args.jobId,
        transition,
      }),
      dependencies: [],
      createdBy: "workflow-engine",
      metadata: {
        workflow: transition,
        jobData: args.jobData,
      },
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    console.log(`[workflow] Created task ${taskId} for agent ${rule.agent}: ${transition}`);

    // Schedule async execution
    await ctx.scheduler.runAfter(0, internal.workflows_old.executeAgentTask, {
      taskId,
      agent: rule.agent,
    });

    return taskId;
  },
});

export const dispatchContentWorkflow = internalMutation({
  args: {
    contentId: v.id("content_calendar"),
    oldStatus: v.string(),
    newStatus: v.string(),
    contentData: v.object({
      title: v.string(),
      type: v.string(),
      platform: v.optional(v.string()),
      seoKeywords: v.optional(v.array(v.string())),
      notes: v.optional(v.string()),
    }),
  },
  handler: async (ctx, args) => {
    const transition = `${args.oldStatus}→${args.newStatus}`;
    const rule = CONTENT_WORKFLOWS[transition];

    if (!rule) {
      console.log(`[workflow] No workflow defined for content transition: ${transition}`);
      return null;
    }

    // Generate task description from template
    const keywords = args.contentData.seoKeywords?.join(", ") || "none";
    const taskDescription = rule.taskTemplate
      .replace("{title}", args.contentData.title)
      .replace("{type}", args.contentData.type)
      .replace("{platform}", args.contentData.platform || "unspecified")
      .replace("{keywords}", keywords);

    // Create agent task
    const taskId = await ctx.db.insert("agent_tasks", {
      title: `${rule.agent}: ${args.contentData.title}`,
      description: taskDescription,
      assignedTo: [rule.agent],
      status: "pending",
      priority: rule.priority,
      context: JSON.stringify({
        workflowType: "content",
        contentId: args.contentId,
        transition,
      }),
      dependencies: [],
      createdBy: "workflow-engine",
      metadata: {
        workflow: transition,
        contentData: args.contentData,
      },
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    console.log(`[workflow] Created task ${taskId} for agent ${rule.agent}: ${transition}`);

    // Schedule async execution
    await ctx.scheduler.runAfter(0, internal.workflows_old.executeAgentTask, {
      taskId,
      agent: rule.agent,
    });

    return taskId;
  },
});

// ==================== AGENT TASK EXECUTION ====================

export const executeAgentTask = internalAction({
  args: {
    taskId: v.id("agent_tasks"),
    agent: v.string(),
  },
  handler: async (ctx, args) => {
    // Fetch task details
    const task = await ctx.runQuery(internal.workflows_old.getTask, { taskId: args.taskId });
    if (!task) {
      console.error(`[workflow] Task ${args.taskId} not found`);
      return;
    }

    try {
      // Update task status to in_progress
      await ctx.runMutation(internal.workflows_old.updateTaskStatus, {
        taskId: args.taskId,
        status: "in_progress",
      });

      console.log(`[workflow] Executing task ${args.taskId} via agent ${args.agent}`);

      // Execute OpenClaw CLI command
      // Format: openclaw sessions send --label <agent> --message <task>
      const command = `openclaw sessions send --label ${args.agent} --message "${task.description}"`;
      
      console.log(`[workflow] Would execute: ${command}`);
      // Note: In production, use Node.js child_process or actual execution
      // For now, we log the command that would be executed

      // Log to agent feed
      await ctx.runMutation(internal.workflows_old.logToFeed, {
        type: "task_update",
        title: `Agent ${args.agent} assigned task`,
        content: task.title || "Untitled task",
        tags: ["workflow", args.agent, task.metadata?.workflow || "unknown"],
        priority: task.priority,
      });

      // Mark task as completed (in real system, wait for agent response)
      await ctx.runMutation(internal.workflows_old.updateTaskStatus, {
        taskId: args.taskId,
        status: "completed",
      });

    } catch (error) {
      console.error(`[workflow] Error executing task ${args.taskId}:`, error);
      await ctx.runMutation(internal.workflows_old.updateTaskStatus, {
        taskId: args.taskId,
        status: "blocked",
      });
    }
  },
});

// ==================== HELPER MUTATIONS & QUERIES ====================

export const getTask = internalMutation({
  args: { taskId: v.id("agent_tasks") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.taskId);
  },
});

export const updateTaskStatus = internalMutation({
  args: {
    taskId: v.id("agent_tasks"),
    status: v.union(
      v.literal("pending"),
      v.literal("in_progress"),
      v.literal("blocked"),
      v.literal("completed"),
      v.literal("cancelled")
    ),
  },
  handler: async (ctx, args) => {
    const updates: any = {
      status: args.status,
      updatedAt: Date.now(),
    };
    if (args.status === "completed") {
      updates.completedAt = Date.now();
    }
    await ctx.db.patch(args.taskId, updates);
  },
});

export const logToFeed = internalMutation({
  args: {
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
    tags: v.array(v.string()),
    priority: v.union(
      v.literal("low"),
      v.literal("medium"),
      v.literal("high"),
      v.literal("critical")
    ),
  },
  handler: async (ctx, args) => {
    // Check for duplicates
    const existing = await ctx.db
      .query("agent_feed")
      .withIndex("by_title_source", (q) => q.eq("title", args.title).eq("source", "workflow-engine"))
      .first();

    if (!existing) {
      await ctx.db.insert("agent_feed", {
        ...args,
        source: "workflow-engine",
        read: false,
        createdAt: Date.now(),
      });
    }
  },
});

// ==================== PUBLIC QUERIES ====================

export const getActiveWorkflows: any = query({
  args: {
    workflowType: v.optional(v.union(v.literal("job"), v.literal("content"))),
  },
  handler: async (ctx, args) => {
    const tasks = await ctx.db
      .query("agent_tasks")
      .withIndex("by_status", (q) => q.eq("status", "pending"))
      .collect();

    let filtered = tasks.filter(t => t.createdBy === "workflow-engine");
    
    if (args.workflowType) {
      filtered = filtered.filter(t => {
        try {
          const context = JSON.parse(t.context || "{}");
          return context.workflowType === args.workflowType;
        } catch {
          return false;
        }
      });
    }

    return filtered;
  },
});

export const getWorkflowsForEntity: any = query({
  args: {
    entityId: v.string(),
    entityType: v.union(v.literal("job"), v.literal("content")),
  },
  handler: async (ctx, args) => {
    const tasks = await ctx.db
      .query("agent_tasks")
      .filter(q => q.eq(q.field("createdBy"), "workflow-engine"))
      .collect();

    return tasks.filter(t => {
      try {
        const context = JSON.parse(t.context || "{}");
        const idField = args.entityType === "job" ? "jobId" : "contentId";
        return context[idField] === args.entityId;
      } catch {
        return false;
      }
    });
  },
});
