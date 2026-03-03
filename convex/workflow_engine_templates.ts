/**
 * Workflow Templates - Predefined workflow patterns
 * 
 * Templates for common multi-agent workflows:
 * 1. Feature Development - End-to-end feature implementation
 * 2. Content Publishing - Research → Write → Publish → Promote
 * 3. Job Application - Scrape → Match → Apply → Track
 */

import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// ============================================================================
// TEMPLATE DEFINITIONS
// ============================================================================

export const TEMPLATES = {
  "feature-development": {
    templateId: "feature-development",
    name: "Feature Development Workflow",
    description: "Complete feature implementation from design to deployment",
    category: "development",
    steps: [
      {
        stepId: "requirements",
        name: "Analyze Requirements",
        agent: "architect",
        dependencies: [],
        timeoutMs: 300000, // 5 min
        maxRetries: 1,
        canRunInParallel: false,
      },
      {
        stepId: "database-design",
        name: "Design Database Schema",
        agent: "architect",
        dependencies: ["requirements"],
        timeoutMs: 600000, // 10 min
        maxRetries: 2,
        canRunInParallel: false,
      },
      {
        stepId: "create-linear-tasks",
        name: "Create Linear Subtasks",
        agent: "orchestrator",
        dependencies: ["requirements"],
        timeoutMs: 180000, // 3 min
        maxRetries: 3,
        canRunInParallel: true, // Can run while schema is being designed
      },
      {
        stepId: "implement-backend",
        name: "Implement Backend",
        agent: "coder",
        dependencies: ["database-design"],
        timeoutMs: 1800000, // 30 min
        maxRetries: 2,
        canRunInParallel: false,
      },
      {
        stepId: "implement-frontend",
        name: "Implement Frontend",
        agent: "coder",
        dependencies: ["database-design"],
        timeoutMs: 1800000, // 30 min
        maxRetries: 2,
        canRunInParallel: true, // Can run in parallel with backend
      },
      {
        stepId: "write-tests",
        name: "Write Tests",
        agent: "coder",
        dependencies: ["implement-backend", "implement-frontend"],
        timeoutMs: 900000, // 15 min
        maxRetries: 2,
        canRunInParallel: false,
      },
      {
        stepId: "code-review",
        name: "Code Review",
        agent: "qa-critic",
        dependencies: ["write-tests"],
        timeoutMs: 600000, // 10 min
        maxRetries: 1,
        canRunInParallel: false,
      },
      {
        stepId: "deploy-staging",
        name: "Deploy to Staging",
        agent: "coder",
        dependencies: ["code-review"],
        timeoutMs: 300000, // 5 min
        maxRetries: 3,
        canRunInParallel: false,
      },
      {
        stepId: "qa-validation",
        name: "QA Validation",
        agent: "qa-critic",
        dependencies: ["deploy-staging"],
        timeoutMs: 600000, // 10 min
        maxRetries: 1,
        canRunInParallel: false,
      },
      {
        stepId: "deploy-production",
        name: "Deploy to Production",
        agent: "coder",
        dependencies: ["qa-validation"],
        timeoutMs: 300000, // 5 min
        maxRetries: 3,
        canRunInParallel: false,
      },
      {
        stepId: "post-deploy-check",
        name: "Post-Deploy Health Check",
        agent: "orchestrator",
        dependencies: ["deploy-production"],
        timeoutMs: 180000, // 3 min
        maxRetries: 2,
        canRunInParallel: false,
      },
    ],
    defaultPriority: "high" as const,
    estimatedDurationMs: 3600000 * 2, // ~2 hours
    requiredContext: ["linearIssueId", "featureDescription", "repo"],
  },

  "content-publishing": {
    templateId: "content-publishing",
    name: "Content Publishing Workflow",
    description: "Research, write, optimize, and publish content",
    category: "content",
    steps: [
      {
        stepId: "research-topic",
        name: "Research Topic & Trends",
        agent: "researcher",
        dependencies: [],
        timeoutMs: 600000, // 10 min
        maxRetries: 2,
        canRunInParallel: false,
      },
      {
        stepId: "create-outline",
        name: "Create Content Outline",
        agent: "business",
        dependencies: ["research-topic"],
        timeoutMs: 300000, // 5 min
        maxRetries: 2,
        canRunInParallel: false,
      },
      {
        stepId: "write-draft",
        name: "Write Draft",
        agent: "business",
        dependencies: ["create-outline"],
        timeoutMs: 1800000, // 30 min
        maxRetries: 2,
        canRunInParallel: false,
      },
      {
        stepId: "seo-optimization",
        name: "SEO Optimization",
        agent: "seo-analyst",
        dependencies: ["write-draft"],
        timeoutMs: 600000, // 10 min
        maxRetries: 2,
        canRunInParallel: false,
      },
      {
        stepId: "generate-images",
        name: "Generate Images/Graphics",
        agent: "media-producer",
        dependencies: ["write-draft"],
        timeoutMs: 900000, // 15 min
        maxRetries: 3,
        canRunInParallel: true, // Can run while SEO optimization happens
      },
      {
        stepId: "publish-to-cms",
        name: "Publish to CMS",
        agent: "coder",
        dependencies: ["seo-optimization", "generate-images"],
        timeoutMs: 300000, // 5 min
        maxRetries: 3,
        canRunInParallel: false,
      },
      {
        stepId: "share-social",
        name: "Share on Social Media",
        agent: "social-manager",
        dependencies: ["publish-to-cms"],
        timeoutMs: 300000, // 5 min
        maxRetries: 3,
        canRunInParallel: false,
      },
      {
        stepId: "track-performance",
        name: "Set Up Performance Tracking",
        agent: "analytics-agent",
        dependencies: ["publish-to-cms"],
        timeoutMs: 180000, // 3 min
        maxRetries: 2,
        canRunInParallel: true, // Can run while social sharing happens
      },
    ],
    defaultPriority: "medium" as const,
    estimatedDurationMs: 3600000 * 1.5, // ~1.5 hours
    requiredContext: ["topic", "targetAudience", "keywords"],
  },

  "job-application": {
    templateId: "job-application",
    name: "Job Application Workflow",
    description: "Scrape, match, apply, and track job applications",
    category: "automation",
    steps: [
      {
        stepId: "scrape-jobs",
        name: "Scrape New Jobs",
        agent: "data-scraper",
        dependencies: [],
        timeoutMs: 600000, // 10 min
        maxRetries: 3,
        canRunInParallel: false,
      },
      {
        stepId: "score-match",
        name: "Score & Match Jobs",
        agent: "researcher",
        dependencies: ["scrape-jobs"],
        timeoutMs: 300000, // 5 min
        maxRetries: 2,
        canRunInParallel: false,
      },
      {
        stepId: "filter-top-matches",
        name: "Filter Top Matches (score > 70)",
        agent: "orchestrator",
        dependencies: ["score-match"],
        timeoutMs: 60000, // 1 min
        maxRetries: 1,
        canRunInParallel: false,
      },
      {
        stepId: "generate-cover-letter",
        name: "Generate Custom Cover Letter",
        agent: "business",
        dependencies: ["filter-top-matches"],
        timeoutMs: 600000, // 10 min
        maxRetries: 2,
        canRunInParallel: false,
      },
      {
        stepId: "review-application",
        name: "Review Application (Manual if score 70-85)",
        agent: "orchestrator",
        dependencies: ["generate-cover-letter"],
        timeoutMs: 1800000, // 30 min (human in the loop)
        maxRetries: 0,
        canRunInParallel: false,
        command: "Check if auto-apply is enabled and score > 85. If yes, proceed. If no, notify for manual review.",
      },
      {
        stepId: "submit-application",
        name: "Submit Application",
        agent: "coder",
        dependencies: ["review-application"],
        timeoutMs: 600000, // 10 min
        maxRetries: 2,
        canRunInParallel: false,
      },
      {
        stepId: "log-application",
        name: "Log Application to Convex",
        agent: "orchestrator",
        dependencies: ["submit-application"],
        timeoutMs: 60000, // 1 min
        maxRetries: 3,
        canRunInParallel: false,
      },
      {
        stepId: "schedule-followup",
        name: "Schedule Follow-up (7 days)",
        agent: "orchestrator",
        dependencies: ["log-application"],
        timeoutMs: 60000, // 1 min
        maxRetries: 2,
        canRunInParallel: true,
      },
      {
        stepId: "notify-telegram",
        name: "Notify via Telegram",
        agent: "orchestrator",
        dependencies: ["log-application"],
        timeoutMs: 60000, // 1 min
        maxRetries: 3,
        canRunInParallel: true, // Can run while follow-up is scheduled
      },
    ],
    defaultPriority: "high" as const,
    estimatedDurationMs: 3600000, // ~1 hour
    requiredContext: ["jobUrl", "company", "position"],
  },
};

// ============================================================================
// TEMPLATE INITIALIZATION
// ============================================================================

/**
 * Initialize workflow templates in database
 * Run once to seed templates
 */
export const initializeTemplates = mutation({
  args: {},
  handler: async (ctx) => {
    for (const template of Object.values(TEMPLATES)) {
      // Check if template already exists
      const existing = await ctx.db
        .query("workflow_templates")
        .withIndex("by_template_id", (q) => q.eq("templateId", template.templateId))
        .first();

      if (existing) {
        // Update existing template
        await ctx.db.patch(existing._id, {
          ...template,
          version: existing.version + 1,
          updatedAt: Date.now(),
        });
      } else {
        // Create new template
        await ctx.db.insert("workflow_templates", {
          ...template,
          version: 1,
          active: true,
          usageCount: 0,
          createdBy: "system",
          createdAt: Date.now(),
          updatedAt: Date.now(),
        });
      }
    }

    return { success: true, count: Object.keys(TEMPLATES).length };
  },
});

/**
 * List all workflow templates
 */
export const listTemplates = query({
  args: {
    category: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db.query("workflow_templates").withIndex("by_active", (q) =>
      q.eq("active", true)
    );

    const templates = await query.collect();

    if (args.category) {
      return templates.filter((t) => t.category === args.category);
    }

    return templates;
  },
});

/**
 * Get template by ID
 */
export const getTemplate = query({
  args: {
    templateId: v.string(),
  },
  handler: async (ctx, args) => {
    const template = await ctx.db
      .query("workflow_templates")
      .withIndex("by_template_id", (q) => q.eq("templateId", args.templateId))
      .first();

    return template;
  },
});
