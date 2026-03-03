"use node";
import { v } from "convex/values";
import { internalAction } from "./_generated/server";
import { LinearClient } from "@linear/sdk";
import { internal } from "./_generated/api";
// Linear Client initialization (reusable)
function getLinearClient() {
    const apiKey = process.env.LINEAR_API_KEY;
    if (!apiKey) {
        throw new Error("LINEAR_API_KEY not configured");
    }
    return new LinearClient({ apiKey });
}
// ============================================================================
// LINEAR → CONVEX SYNC
// ============================================================================
/**
 * Sync a Linear issue to Convex agent_tasks
 */
export const syncIssueToTask = internalAction({
    args: {
        issueId: v.string(),
    },
    handler: async (ctx, args) => {
        const linear = getLinearClient();
        // Fetch issue from Linear
        const issue = await linear.issue(args.issueId);
        if (!issue) {
            throw new Error(`Issue ${args.issueId} not found in Linear`);
        }
        // Get assignee info
        const assignee = await issue.assignee;
        const assigneeName = assignee?.name || "unassigned";
        // Map Linear state to agent task status
        const statusMap = {
            "Backlog": "pending",
            "Todo": "pending",
            "In Progress": "in_progress",
            "In Review": "in_progress",
            "Done": "completed",
            "Canceled": "cancelled",
        };
        const state = await issue.state;
        const status = statusMap[state?.name || "Todo"] || "pending";
        // Map Linear priority to agent task priority
        const priorityMap = {
            0: "low", // No priority
            1: "low", // Urgent
            2: "medium", // High
            3: "high", // Medium
            4: "critical", // Low (inverted in Linear)
        };
        const priority = priorityMap[issue.priority || 0] || "medium";
        // Check if task already exists
        const existingTask = await ctx.runQuery(internal.linearQueries.findTaskByLinearId, { linearIssueId: issue.id });
        if (existingTask) {
            // Update existing task
            await ctx.runMutation(internal.linearQueries.updateTaskFromLinear, {
                taskId: existingTask._id,
                title: issue.title,
                description: issue.description || undefined,
                status,
                priority,
                assignedTo: [assigneeName],
            });
            return { action: "updated", taskId: existingTask._id };
        }
        else {
            // Create new task
            const taskId = await ctx.runMutation(internal.linearQueries.createTaskFromLinear, {
                linearIssueId: issue.id,
                title: issue.title,
                description: issue.description || undefined,
                status,
                priority,
                assignedTo: [assigneeName],
                linearUrl: issue.url,
            });
            return { action: "created", taskId };
        }
    },
});
/**
 * Sync all issues from a Linear team
 */
export const syncTeamIssues = internalAction({
    args: {
        teamKey: v.string(), // e.g., "STE"
        limit: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const linear = getLinearClient();
        // Find team
        const teams = await linear.teams();
        const team = teams.nodes.find((t) => t.key === args.teamKey);
        if (!team) {
            throw new Error(`Team with key ${args.teamKey} not found`);
        }
        // Fetch issues
        const issues = await team.issues({
            first: args.limit || 50,
            filter: {
                state: {
                    type: { nin: ["canceled", "completed"] }, // Only active issues
                },
            },
        });
        const results = [];
        for (const issue of issues.nodes) {
            try {
                const result = await ctx.runAction(internal.linearSync.syncIssueToTask, {
                    issueId: issue.id,
                });
                results.push({ issueId: issue.id, ...result });
            }
            catch (error) {
                console.error(`Failed to sync issue ${issue.id}:`, error);
                results.push({ issueId: issue.id, action: "failed", error: String(error) });
            }
        }
        return {
            teamKey: args.teamKey,
            synced: results.length,
            results,
        };
    },
});
// ============================================================================
// CONVEX → LINEAR SYNC
// ============================================================================
/**
 * Update Linear issue status when agent task status changes
 */
export const updateLinearIssueStatus = internalAction({
    args: {
        linearIssueId: v.string(),
        status: v.union(v.literal("pending"), v.literal("in_progress"), v.literal("completed"), v.literal("cancelled")),
    },
    handler: async (ctx, args) => {
        const linear = getLinearClient();
        // Map agent task status to Linear state
        const statusToStateMap = {
            pending: "Todo",
            in_progress: "In Progress",
            completed: "Done",
            cancelled: "Canceled",
        };
        const targetStateName = statusToStateMap[args.status];
        // Get the issue
        const issue = await linear.issue(args.linearIssueId);
        const team = await issue.team;
        if (!team) {
            throw new Error("Team not found for issue");
        }
        // Find the target state
        const states = await team.states();
        const targetState = states.nodes.find((s) => s.name === targetStateName);
        if (!targetState) {
            throw new Error(`State ${targetStateName} not found in team`);
        }
        // Update the issue
        await issue.update({
            stateId: targetState.id,
        });
        return { success: true, newState: targetStateName };
    },
});
/**
 * Create a new Linear issue from an agent task
 */
export const createLinearIssue = internalAction({
    args: {
        taskId: v.id("agent_tasks"),
        teamKey: v.string(),
    },
    handler: async (ctx, args) => {
        const linear = getLinearClient();
        // Get task details
        const task = await ctx.runQuery(internal.linearQueries.getTask, {
            taskId: args.taskId,
        });
        if (!task) {
            throw new Error("Task not found");
        }
        if (task.linearIssueId) {
            throw new Error("Task already has a Linear issue");
        }
        // Find team
        const teams = await linear.teams();
        const team = teams.nodes.find((t) => t.key === args.teamKey);
        if (!team) {
            throw new Error(`Team with key ${args.teamKey} not found`);
        }
        // Map priority
        const priorityMap = {
            low: 1,
            medium: 2,
            high: 3,
            critical: 4,
        };
        // Create issue
        const issuePayload = await linear.createIssue({
            teamId: team.id,
            title: task.title,
            description: task.description || "",
            priority: priorityMap[task.priority] || 2,
        });
        const issue = await issuePayload.issue;
        if (!issue) {
            throw new Error("Failed to create Linear issue");
        }
        // Update task with Linear issue ID
        await ctx.runMutation(internal.linearQueries.updateTaskLinearId, {
            taskId: args.taskId,
            linearIssueId: issue.id,
        });
        return {
            linearIssueId: issue.id,
            url: issue.url,
        };
    },
});
