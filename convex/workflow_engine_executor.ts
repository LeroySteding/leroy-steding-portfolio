/**
 * Workflow Executor - DAG-based workflow execution engine
 * 
 * Core responsibilities:
 * 1. Evaluate step dependencies (DAG traversal)
 * 2. Execute steps in correct order with parallelization
 * 3. Handle retries and error recovery
 * 4. Update workflow and step status
 * 5. Pass context between steps
 */

import { v } from "convex/values";
import { mutation, internalMutation, query, action } from "./_generated/server";
import { internal } from "./_generated/api";
import { Id } from "./_generated/dataModel";

// ============================================================================
// TYPES
// ============================================================================

export interface WorkflowContext {
  [key: string]: any;
}

export interface StepResult {
  success: boolean;
  output?: any;
  error?: string;
}

// ============================================================================
// WORKFLOW EXECUTION
// ============================================================================

/**
 * Start workflow execution
 */
export const startWorkflow = mutation({
  args: {
    workflowId: v.id("workflows"),
  },
  handler: async (ctx, args) => {
    const workflow = await ctx.db.get(args.workflowId);
    if (!workflow) throw new Error("Workflow not found");

    if (workflow.status !== "pending" && workflow.status !== "paused") {
      throw new Error(`Cannot start workflow in status: ${workflow.status}`);
    }

    // Update workflow status
    await ctx.db.patch(args.workflowId, {
      status: "running",
      startedAt: Date.now(),
      updatedAt: Date.now(),
    });

    // Log execution event
    await ctx.db.insert("workflow_executions", {
      workflowId: args.workflowId,
      stepId: "workflow",
      agent: "orchestrator",
      action: "started",
      details: `Workflow "${workflow.name}" started`,
      timestamp: Date.now(),
    });

    // Kick off step evaluation
    await ctx.scheduler.runAfter(0, internal.workflow_executor.evaluateSteps, {
      workflowId: args.workflowId,
    });

    return { success: true };
  },
});

/**
 * Evaluate which steps can be executed
 * Internal mutation called by scheduler
 */
export const evaluateSteps = internalMutation({
  args: {
    workflowId: v.id("workflows"),
  },
  handler: async (ctx, args) => {
    const workflow = await ctx.db.get(args.workflowId);
    if (!workflow || workflow.status !== "running") {
      return; // Workflow stopped or completed
    }

    // Get all steps for this workflow
    const steps = await ctx.db
      .query("workflow_steps")
      .withIndex("by_workflow_id", (q) => q.eq("workflowId", args.workflowId))
      .collect();

    // Find steps that are ready to execute
    const readySteps = steps.filter((step) => {
      // Skip if not pending
      if (step.status !== "pending") return false;

      // Check if all dependencies are completed
      const allDepsCompleted = step.dependencies.every((depStepId) => {
        const depStep = steps.find((s) => s.stepId === depStepId);
        return depStep?.status === "completed";
      });

      return allDepsCompleted;
    });

    if (readySteps.length === 0) {
      // Check if workflow is complete
      const allCompleted = steps.every(
        (s) => s.status === "completed" || s.status === "skipped"
      );
      const anyFailed = steps.some((s) => s.status === "failed");

      if (allCompleted) {
        await ctx.db.patch(args.workflowId, {
          status: "completed",
          completedAt: Date.now(),
          updatedAt: Date.now(),
        });

        await ctx.db.insert("workflow_executions", {
          workflowId: args.workflowId,
          stepId: "workflow",
          agent: "orchestrator",
          action: "completed",
          details: `Workflow completed successfully`,
          timestamp: Date.now(),
        });
      } else if (anyFailed) {
        await ctx.db.patch(args.workflowId, {
          status: "failed",
          completedAt: Date.now(),
          error: "One or more steps failed",
          updatedAt: Date.now(),
        });

        await ctx.db.insert("workflow_executions", {
          workflowId: args.workflowId,
          stepId: "workflow",
          agent: "orchestrator",
          action: "failed",
          details: `Workflow failed`,
          timestamp: Date.now(),
        });
      }

      return;
    }

    // Execute ready steps
    for (const step of readySteps) {
      await ctx.scheduler.runAfter(0, internal.workflow_executor.executeStep, {
        workflowId: args.workflowId,
        stepId: step.stepId,
      });
    }
  },
});

/**
 * Execute a single workflow step
 */
export const executeStep = internalMutation({
  args: {
    workflowId: v.id("workflows"),
    stepId: v.string(),
  },
  handler: async (ctx, args) => {
    const workflow = await ctx.db.get(args.workflowId);
    if (!workflow) return;

    // Find the step
    const steps = await ctx.db
      .query("workflow_steps")
      .withIndex("by_workflow_id", (q) => q.eq("workflowId", args.workflowId))
      .collect();

    const step = steps.find((s) => s.stepId === args.stepId);
    if (!step) return;

    // Update step status to running
    await ctx.db.patch(step._id, {
      status: "running",
      startedAt: Date.now(),
      updatedAt: Date.now(),
    });

    await ctx.db.insert("workflow_executions", {
      workflowId: args.workflowId,
      stepId: step.stepId,
      agent: step.agent,
      action: "started",
      details: `Step "${step.name}" started`,
      timestamp: Date.now(),
    });

    // Dispatch to agent via action
    await ctx.scheduler.runAfter(0, internal.workflow_executor.dispatchToAgent, {
      workflowId: args.workflowId,
      stepId: step.stepId,
      stepDbId: step._id,
      agent: step.agent,
      command: step.command || `Execute workflow step: ${step.name}`,
      context: workflow.context,
    });
  },
});

/**
 * Dispatch step to agent (action to call external systems)
 */
export const dispatchToAgent = action({
  args: {
    workflowId: v.id("workflows"),
    stepId: v.string(),
    stepDbId: v.id("workflow_steps"),
    agent: v.string(),
    command: v.string(),
    context: v.any(),
  },
  handler: async (ctx, args) => {
    try {
      // Execute the command via openclaw CLI
      const { execSync } = await import("child_process");
      
      const cmd = `openclaw agent --agent ${args.agent} --message "${args.command}" --deliver`;
      
      console.log(`[Workflow ${args.workflowId}] Dispatching to ${args.agent}: ${cmd}`);
      
      execSync(cmd, {
        stdio: "inherit",
        timeout: 300000, // 5 min default timeout
      });

      // Mark step as completed
      await ctx.runMutation(internal.workflow_executor.completeStep, {
        stepDbId: args.stepDbId,
        workflowId: args.workflowId,
        success: true,
      });
    } catch (error: any) {
      // Mark step as failed
      await ctx.runMutation(internal.workflow_executor.completeStep, {
        stepDbId: args.stepDbId,
        workflowId: args.workflowId,
        success: false,
        error: error.message || "Unknown error",
      });
    }
  },
});

/**
 * Mark step as completed or failed
 */
export const completeStep = internalMutation({
  args: {
    stepDbId: v.id("workflow_steps"),
    workflowId: v.id("workflows"),
    success: v.boolean(),
    output: v.optional(v.any()),
    error: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const step = await ctx.db.get(args.stepDbId);
    if (!step) return;

    const now = Date.now();
    const durationMs = step.startedAt ? now - step.startedAt : 0;

    if (args.success) {
      // Step completed successfully
      await ctx.db.patch(args.stepDbId, {
        status: "completed",
        output: args.output,
        completedAt: now,
        durationMs,
        updatedAt: now,
      });

      await ctx.db.insert("workflow_executions", {
        workflowId: args.workflowId,
        stepId: step.stepId,
        agent: step.agent,
        action: "completed",
        details: `Step "${step.name}" completed in ${durationMs}ms`,
        metadata: { durationMs, output: args.output },
        timestamp: now,
      });
    } else {
      // Step failed
      const shouldRetry = step.retries < step.maxRetries;

      if (shouldRetry) {
        // Retry
        await ctx.db.patch(args.stepDbId, {
          status: "pending",
          retries: step.retries + 1,
          error: args.error,
          updatedAt: now,
        });

        await ctx.db.insert("workflow_executions", {
          workflowId: args.workflowId,
          stepId: step.stepId,
          agent: step.agent,
          action: "retried",
          details: `Step "${step.name}" failed, retrying (${step.retries + 1}/${step.maxRetries})`,
          metadata: { error: args.error },
          timestamp: now,
        });
      } else {
        // Fail permanently
        await ctx.db.patch(args.stepDbId, {
          status: "failed",
          error: args.error,
          completedAt: now,
          durationMs,
          updatedAt: now,
        });

        await ctx.db.insert("workflow_executions", {
          workflowId: args.workflowId,
          stepId: step.stepId,
          agent: step.agent,
          action: "failed",
          details: `Step "${step.name}" failed after ${step.maxRetries} retries`,
          metadata: { error: args.error },
          timestamp: now,
        });
      }
    }

    // Continue workflow evaluation
    await ctx.scheduler.runAfter(1000, internal.workflow_executor.evaluateSteps, {
      workflowId: args.workflowId,
    });
  },
});

// ============================================================================
// WORKFLOW CONTROL
// ============================================================================

/**
 * Pause workflow execution
 */
export const pauseWorkflow = mutation({
  args: {
    workflowId: v.id("workflows"),
  },
  handler: async (ctx, args) => {
    const workflow = await ctx.db.get(args.workflowId);
    if (!workflow) throw new Error("Workflow not found");

    await ctx.db.patch(args.workflowId, {
      status: "paused",
      pausedAt: Date.now(),
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});

/**
 * Cancel workflow execution
 */
export const cancelWorkflow = mutation({
  args: {
    workflowId: v.id("workflows"),
    reason: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const workflow = await ctx.db.get(args.workflowId);
    if (!workflow) throw new Error("Workflow not found");

    await ctx.db.patch(args.workflowId, {
      status: "cancelled",
      completedAt: Date.now(),
      error: args.reason || "Cancelled by user",
      updatedAt: Date.now(),
    });

    // Cancel all pending/running steps
    const steps = await ctx.db
      .query("workflow_steps")
      .withIndex("by_workflow_id", (q) => q.eq("workflowId", args.workflowId))
      .filter((q) =>
        q.or(q.eq(q.field("status"), "pending"), q.eq(q.field("status"), "running"))
      )
      .collect();

    for (const step of steps) {
      await ctx.db.patch(step._id, {
        status: "skipped",
        updatedAt: Date.now(),
      });
    }

    return { success: true };
  },
});

/**
 * Retry failed workflow
 */
export const retryWorkflow = mutation({
  args: {
    workflowId: v.id("workflows"),
  },
  handler: async (ctx, args) => {
    const workflow = await ctx.db.get(args.workflowId);
    if (!workflow) throw new Error("Workflow not found");

    if (workflow.retryCount >= workflow.maxRetries) {
      throw new Error("Max retries exceeded");
    }

    // Reset failed steps to pending
    const steps = await ctx.db
      .query("workflow_steps")
      .withIndex("by_workflow_id", (q) => q.eq("workflowId", args.workflowId))
      .filter((q) => q.eq(q.field("status"), "failed"))
      .collect();

    for (const step of steps) {
      await ctx.db.patch(step._id, {
        status: "pending",
        error: undefined,
        retries: 0,
        updatedAt: Date.now(),
      });
    }

    // Update workflow
    await ctx.db.patch(args.workflowId, {
      status: "pending",
      retryCount: workflow.retryCount + 1,
      error: undefined,
      updatedAt: Date.now(),
    });

    // Schedule workflow restart
    await ctx.scheduler.runAfter(0, internal.workflow_engine_executor.startWorkflow, {
      workflowId: args.workflowId,
    });

    return { success: true };
  },
});

// ============================================================================
// QUERIES
// ============================================================================

/**
 * Get workflow with steps
 */
export const getWorkflow = query({
  args: {
    workflowId: v.id("workflows"),
  },
  handler: async (ctx, args) => {
    const workflow = await ctx.db.get(args.workflowId);
    if (!workflow) return null;

    const steps = await ctx.db
      .query("workflow_steps")
      .withIndex("by_workflow_id", (q) => q.eq("workflowId", args.workflowId))
      .collect();

    const executions = await ctx.db
      .query("workflow_executions")
      .withIndex("by_workflow_id", (q) => q.eq("workflowId", args.workflowId))
      .order("desc")
      .take(100);

    return {
      workflow,
      steps: steps.sort((a, b) => a.order - b.order),
      executions,
    };
  },
});

/**
 * List active workflows
 */
export const listActiveWorkflows = query({
  args: {},
  handler: async (ctx) => {
    const workflows = await ctx.db
      .query("workflows")
      .withIndex("by_status")
      .filter((q) =>
        q.or(
          q.eq(q.field("status"), "pending"),
          q.eq(q.field("status"), "running"),
          q.eq(q.field("status"), "paused")
        )
      )
      .order("desc")
      .take(50);

    return workflows;
  },
});
