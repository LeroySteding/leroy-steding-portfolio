import { v } from "convex/values";
import { internalMutation, internalQuery } from "./_generated/server";
// ============================================================================
// INTERNAL QUERIES & MUTATIONS (Non-Node runtime)
// ============================================================================
export const findTaskByLinearId = internalQuery({
    args: { linearIssueId: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("agent_tasks")
            .withIndex("by_linear_issue", (q) => q.eq("linearIssueId", args.linearIssueId))
            .first();
    },
});
export const getTask = internalQuery({
    args: { taskId: v.id("agent_tasks") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.taskId);
    },
});
export const createTaskFromLinear = internalMutation({
    args: {
        linearIssueId: v.string(),
        title: v.string(),
        description: v.optional(v.string()),
        status: v.union(v.literal("pending"), v.literal("in_progress"), v.literal("completed"), v.literal("cancelled")),
        priority: v.union(v.literal("low"), v.literal("medium"), v.literal("high"), v.literal("critical")),
        assignedTo: v.array(v.string()),
        linearUrl: v.string(),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("agent_tasks", {
            title: args.title,
            description: args.description,
            assignedTo: args.assignedTo,
            status: args.status,
            priority: args.priority,
            context: `Linear: ${args.linearUrl}`,
            dependencies: [],
            createdBy: "linear-sync",
            linearIssueId: args.linearIssueId,
            metadata: { source: "linear", url: args.linearUrl },
            createdAt: Date.now(),
            updatedAt: Date.now(),
        });
    },
});
export const updateTaskFromLinear = internalMutation({
    args: {
        taskId: v.id("agent_tasks"),
        title: v.string(),
        description: v.optional(v.string()),
        status: v.union(v.literal("pending"), v.literal("in_progress"), v.literal("completed"), v.literal("cancelled")),
        priority: v.union(v.literal("low"), v.literal("medium"), v.literal("high"), v.literal("critical")),
        assignedTo: v.array(v.string()),
    },
    handler: async (ctx, args) => {
        const { taskId, ...updates } = args;
        await ctx.db.patch(taskId, {
            ...updates,
            updatedAt: Date.now(),
        });
    },
});
export const updateTaskLinearId = internalMutation({
    args: {
        taskId: v.id("agent_tasks"),
        linearIssueId: v.string(),
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.taskId, {
            linearIssueId: args.linearIssueId,
            updatedAt: Date.now(),
        });
    },
});
