/**
 * Workflow Engine API - DAG-based multi-agent workflows
 *
 * Public API for:
 * 1. Creating workflows from templates
 * 2. Creating custom workflows
 * 3. Querying workflow status
 * 4. Managing workflow lifecycle
 */
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { internal } from "./_generated/api";
// ============================================================================
// CREATE WORKFLOWS
// ============================================================================
/**
 * Create workflow from template
 */
export const createFromTemplate = mutation({
    args: {
        templateId: v.string(),
        name: v.optional(v.string()),
        context: v.any(),
        priority: v.optional(v.union(v.literal("low"), v.literal("medium"), v.literal("high"), v.literal("critical"))),
        createdBy: v.string(),
        linearIssueId: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const template = await ctx.db
            .query("workflow_templates")
            .withIndex("by_template_id", (q) => q.eq("templateId", args.templateId))
            .first();
        if (!template) {
            throw new Error(`Template not found: ${args.templateId}`);
        }
        for (const requiredKey of template.requiredContext) {
            if (!args.context[requiredKey]) {
                throw new Error(`Missing required context: ${requiredKey}`);
            }
        }
        const workflowId = await ctx.db.insert("workflows", {
            name: args.name || template.name,
            description: template.description,
            templateId: args.templateId,
            status: "pending",
            priority: args.priority || template.defaultPriority,
            context: args.context,
            createdBy: args.createdBy,
            assignedAgents: template.steps.map((s) => s.agent),
            retryCount: 0,
            maxRetries: 3,
            linearIssueId: args.linearIssueId,
            estimatedDurationMs: template.estimatedDurationMs,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        });
        for (let i = 0; i < template.steps.length; i++) {
            const templateStep = template.steps[i];
            await ctx.db.insert("workflow_steps", {
                workflowId,
                stepId: templateStep.stepId,
                name: templateStep.name,
                agent: templateStep.agent,
                status: "pending",
                dependencies: templateStep.dependencies,
                command: templateStep.command,
                timeoutMs: templateStep.timeoutMs,
                retries: 0,
                maxRetries: templateStep.maxRetries,
                order: i,
                canRunInParallel: templateStep.canRunInParallel,
                createdAt: Date.now(),
                updatedAt: Date.now(),
            });
        }
        await ctx.db.patch(template._id, {
            usageCount: template.usageCount + 1,
        });
        await ctx.db.insert("agent_feed", {
            type: "task_update",
            title: `Workflow Created: ${template.name}`,
            content: `New workflow from template "${args.templateId}" with ${template.steps.length} steps`,
            source: args.createdBy,
            tags: ["workflow", args.templateId],
            priority: args.priority || template.defaultPriority,
            read: false,
            metadata: { workflowId },
            createdAt: Date.now(),
        });
        return {
            workflowId,
            stepsCreated: template.steps.length,
            estimatedDurationMs: template.estimatedDurationMs,
        };
    },
});
/**
 * Create custom workflow
 */
export const createCustom = mutation({
    args: {
        name: v.string(),
        description: v.optional(v.string()),
        steps: v.array(v.object({
            stepId: v.string(),
            name: v.string(),
            agent: v.string(),
            dependencies: v.array(v.string()),
            command: v.optional(v.string()),
            timeoutMs: v.optional(v.number()),
            maxRetries: v.number(),
            canRunInParallel: v.boolean(),
        })),
        context: v.any(),
        priority: v.union(v.literal("low"), v.literal("medium"), v.literal("high"), v.literal("critical")),
        createdBy: v.string(),
        linearIssueId: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const workflowId = await ctx.db.insert("workflows", {
            name: args.name,
            description: args.description,
            status: "pending",
            priority: args.priority,
            context: args.context,
            createdBy: args.createdBy,
            assignedAgents: args.steps.map((s) => s.agent),
            retryCount: 0,
            maxRetries: 3,
            linearIssueId: args.linearIssueId,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        });
        for (let i = 0; i < args.steps.length; i++) {
            const step = args.steps[i];
            await ctx.db.insert("workflow_steps", {
                workflowId,
                stepId: step.stepId,
                name: step.name,
                agent: step.agent,
                status: "pending",
                dependencies: step.dependencies,
                command: step.command,
                timeoutMs: step.timeoutMs,
                retries: 0,
                maxRetries: step.maxRetries,
                order: i,
                canRunInParallel: step.canRunInParallel,
                createdAt: Date.now(),
                updatedAt: Date.now(),
            });
        }
        return { workflowId, stepsCreated: args.steps.length };
    },
});
// ============================================================================
// QUERIES
// ============================================================================
export const getDetails = query({
    args: { workflowId: v.id("workflows") },
    handler: async (ctx, args) => {
        const workflow = await ctx.db.get(args.workflowId);
        if (!workflow)
            return null;
        const steps = await ctx.db
            .query("workflow_steps")
            .withIndex("by_workflow_id", (q) => q.eq("workflowId", args.workflowId))
            .collect();
        const executions = await ctx.db
            .query("workflow_executions")
            .withIndex("by_workflow_id", (q) => q.eq("workflowId", args.workflowId))
            .order("desc")
            .take(100);
        const totalSteps = steps.length;
        const completedSteps = steps.filter((s) => s.status === "completed").length;
        const failedSteps = steps.filter((s) => s.status === "failed").length;
        const runningSteps = steps.filter((s) => s.status === "running").length;
        const progress = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;
        return {
            workflow,
            steps: steps.sort((a, b) => a.order - b.order),
            executions,
            stats: {
                totalSteps,
                completedSteps,
                failedSteps,
                runningSteps,
                progress: Math.round(progress),
            },
        };
    },
});
export const list = query({
    args: {
        status: v.optional(v.union(v.literal("pending"), v.literal("running"), v.literal("paused"), v.literal("completed"), v.literal("failed"), v.literal("cancelled"))),
        createdBy: v.optional(v.string()),
        limit: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        let query = ctx.db.query("workflows");
        if (args.status) {
            query = query.withIndex("by_status", (q) => q.eq("status", args.status));
        }
        const workflows = await query.order("desc").take(args.limit || 50);
        if (args.createdBy) {
            return workflows.filter((w) => w.createdBy === args.createdBy);
        }
        return workflows;
    },
});
export const getStats = query({
    args: {
        period: v.optional(v.union(v.literal("day"), v.literal("week"), v.literal("month"))),
    },
    handler: async (ctx, args) => {
        const now = Date.now();
        const periodMs = {
            day: 86400000,
            week: 604800000,
            month: 2592000000,
        };
        const cutoff = now - (periodMs[args.period || "week"]);
        const allWorkflows = await ctx.db
            .query("workflows")
            .withIndex("by_created_at")
            .filter((q) => q.gte(q.field("createdAt"), cutoff))
            .collect();
        const completed = allWorkflows.filter((w) => w.status === "completed");
        const failed = allWorkflows.filter((w) => w.status === "failed");
        const running = allWorkflows.filter((w) => w.status === "running" || w.status === "pending");
        const durations = completed
            .filter((w) => w.startedAt && w.completedAt)
            .map((w) => w.completedAt - w.startedAt);
        const avgDuration = durations.length > 0
            ? durations.reduce((sum, d) => sum + d, 0) / durations.length
            : 0;
        const byTemplate = {};
        for (const w of allWorkflows) {
            if (w.templateId) {
                byTemplate[w.templateId] = (byTemplate[w.templateId] || 0) + 1;
            }
        }
        return {
            total: allWorkflows.length,
            completed: completed.length,
            failed: failed.length,
            running: running.length,
            successRate: completed.length + failed.length > 0
                ? (completed.length / (completed.length + failed.length)) * 100
                : 0,
            avgDurationMs: Math.round(avgDuration),
            byTemplate,
        };
    },
});
// ============================================================================
// WORKFLOW ACTIONS
// ============================================================================
export const start = mutation({
    args: { workflowId: v.id("workflows") },
    handler: async (ctx, args) => {
        return ctx.runMutation(internal.workflow_engine_executor.startWorkflow, {
            workflowId: args.workflowId,
        });
    },
});
export const pause = mutation({
    args: { workflowId: v.id("workflows") },
    handler: async (ctx, args) => {
        return ctx.runMutation(internal.workflow_engine_executor.pauseWorkflow, {
            workflowId: args.workflowId,
        });
    },
});
export const cancel = mutation({
    args: {
        workflowId: v.id("workflows"),
        reason: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        return ctx.runMutation(internal.workflow_engine_executor.cancelWorkflow, {
            workflowId: args.workflowId,
            reason: args.reason,
        });
    },
});
export const retry = mutation({
    args: { workflowId: v.id("workflows") },
    handler: async (ctx, args) => {
        return ctx.runMutation(internal.workflow_engine_executor.retryWorkflow, {
            workflowId: args.workflowId,
        });
    },
});
