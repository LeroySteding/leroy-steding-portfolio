/**
 * Agent Registry - Skill Matching & Smart Routing
 * 
 * Maintains registry of agent capabilities and routes tasks intelligently
 */

import { v } from "convex/values";
import { query } from "./_generated/server";
import { internal } from "./_generated/api";

// ==================== AGENT CAPABILITIES ====================

interface AgentCapability {
  agentId: string;
  name: string;
  emoji: string;
  skills: string[];
  capacity: number; // max concurrent tasks
  avgCompletionTime: number; // milliseconds
  successRate: number; // 0-1
  preferredTaskTypes: string[];
  availability: string; // "24/7" or specific hours
  costPerHour: number; // USD (0 for local models)
}

export const AGENT_REGISTRY: Record<string, AgentCapability> = {
  orchestrator: {
    agentId: "orchestrator",
    name: "Orchestrator",
    emoji: "🎯",
    skills: ["coordination", "planning", "delegation", "monitoring"],
    capacity: 10,
    avgCompletionTime: 600000, // 10 min
    successRate: 0.95,
    preferredTaskTypes: ["coordination", "planning", "status_update"],
    availability: "24/7",
    costPerHour: 0.50, // Sonnet
  },
  
  architect: {
    agentId: "architect",
    name: "Architect",
    emoji: "🏗️",
    skills: ["system_design", "architecture", "database_design", "api_design"],
    capacity: 3,
    avgCompletionTime: 3600000, // 1 hour
    successRate: 0.90,
    preferredTaskTypes: ["feature_design", "refactoring", "architecture_review"],
    availability: "24/7",
    costPerHour: 2.00, // Opus (complex thinking)
  },
  
  coder: {
    agentId: "coder",
    name: "Coder",
    emoji: "💻",
    skills: ["typescript", "react", "nextjs", "convex", "debugging", "testing"],
    capacity: 5,
    avgCompletionTime: 2400000, // 40 min
    successRate: 0.88,
    preferredTaskTypes: ["bug_fix", "feature_implementation", "refactoring", "testing"],
    availability: "24/7",
    costPerHour: 1.00, // Sonnet
  },
  
  researcher: {
    agentId: "researcher",
    name: "Researcher",
    emoji: "🔍",
    skills: ["market_research", "company_analysis", "competitor_intel", "data_gathering"],
    capacity: 8,
    avgCompletionTime: 1800000, // 30 min
    successRate: 0.92,
    preferredTaskTypes: ["job_research", "content_research", "market_analysis"],
    availability: "24/7",
    costPerHour: 0.30, // Haiku
  },
  
  business: {
    agentId: "business",
    name: "Business",
    emoji: "📊",
    skills: ["copywriting", "content_creation", "strategy", "marketing"],
    capacity: 6,
    avgCompletionTime: 2700000, // 45 min
    successRate: 0.85,
    preferredTaskTypes: ["content_writing", "marketing", "application_writing"],
    availability: "24/7",
    costPerHour: 0.50, // Sonnet
  },
  
  "data-handler": {
    agentId: "data-handler",
    name: "Data Handler",
    emoji: "🗂️",
    skills: ["web_scraping", "data_extraction", "dom_analysis", "api_integration"],
    capacity: 10,
    avgCompletionTime: 900000, // 15 min
    successRate: 0.93,
    preferredTaskTypes: ["scraping", "data_extraction", "integration"],
    availability: "24/7",
    costPerHour: 0, // Local model (Ollama)
  },
  
  critic: {
    agentId: "critic",
    name: "Critic",
    emoji: "🔬",
    skills: ["code_review", "qa", "security_audit", "edge_case_testing"],
    capacity: 4,
    avgCompletionTime: 1200000, // 20 min
    successRate: 0.90,
    preferredTaskTypes: ["code_review", "qa", "security_review"],
    availability: "24/7",
    costPerHour: 1.00, // Sonnet (careful analysis)
  },
};

// ==================== SMART ROUTING ====================

interface TaskRequirements {
  taskType: string;
  priority: "low" | "medium" | "high" | "critical";
  estimatedDuration?: number;
  requiredSkills?: string[];
  budget?: number; // max USD
}

interface AgentScore {
  agentId: string;
  score: number;
  reasoning: string[];
  estimatedCost: number;
  estimatedTime: number;
}

export const findBestAgent: any = query({
  args: {
    taskType: v.string(),
    priority: v.string(),
    requiredSkills: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args): Promise<AgentScore> => {
    const candidates: AgentScore[] = [];
    
    for (const agent of Object.values(AGENT_REGISTRY)) {
      const score = calculateAgentScore(agent, {
        taskType: args.taskType,
        priority: args.priority as any,
        requiredSkills: args.requiredSkills,
      });
      
      if (score.score > 0) {
        candidates.push(score);
      }
    }
    
    // Sort by score (highest first)
    candidates.sort((a, b) => b.score - a.score);
    
    return candidates[0] || {
      agentId: "orchestrator",
      score: 0,
      reasoning: ["No suitable agent found, defaulting to orchestrator"],
      estimatedCost: 0,
      estimatedTime: 0,
    };
  },
});

function calculateAgentScore(
  agent: AgentCapability,
  requirements: TaskRequirements
): AgentScore {
  let score = 0;
  const reasoning: string[] = [];
  
  // 1. Task type match (40 points)
  if (agent.preferredTaskTypes.includes(requirements.taskType)) {
    score += 40;
    reasoning.push(`Preferred task type: ${requirements.taskType}`);
  }
  
  // 2. Skill match (30 points)
  if (requirements.requiredSkills) {
    const matchingSkills = requirements.requiredSkills.filter(skill =>
      agent.skills.includes(skill)
    );
    const skillMatchRatio = matchingSkills.length / requirements.requiredSkills.length;
    const skillScore = skillMatchRatio * 30;
    score += skillScore;
    
    if (skillScore > 0) {
      reasoning.push(`Skills match: ${matchingSkills.join(", ")}`);
    }
  }
  
  // 3. Success rate (20 points)
  score += agent.successRate * 20;
  reasoning.push(`Success rate: ${(agent.successRate * 100).toFixed(0)}%`);
  
  // 4. Availability/Capacity (10 points)
  // In production, check current load from agent_tasks
  score += 10; // assume available for now
  reasoning.push("Available now");
  
  // Bonus: Cost efficiency
  if (agent.costPerHour === 0) {
    score += 5;
    reasoning.push("💰 Free (local model)");
  }
  
  // Priority boost
  if (requirements.priority === "critical" && agent.successRate > 0.9) {
    score += 10;
    reasoning.push("🚨 Reliable for critical tasks");
  }
  
  const estimatedTime = requirements.estimatedDuration || agent.avgCompletionTime;
  const estimatedCost = (estimatedTime / 3600000) * agent.costPerHour;
  
  return {
    agentId: agent.agentId,
    score: Math.round(score),
    reasoning,
    estimatedCost: Math.round(estimatedCost * 100) / 100,
    estimatedTime,
  };
}

// ==================== AGENT STATUS ====================

export const getAgentStatus: any = query({
  args: { agentId: v.optional(v.string()) },
  handler: async (ctx, args) => {
    if (args.agentId) {
      const agent = AGENT_REGISTRY[args.agentId];
      if (!agent) return null;
      
      // Get current tasks for this agent
      const agentId = args.agentId; // Store in variable for type narrowing
      const tasks = await ctx.db
        .query("agent_tasks")
        .filter((q) => q.eq(q.field("assignedTo"), [agentId]))
        .collect();
      
      const activeTasks = tasks.filter(t => t.status === "pending" || t.status === "in_progress");
      
      return {
        ...agent,
        currentLoad: activeTasks.length,
        utilization: (activeTasks.length / agent.capacity) * 100,
        tasks: activeTasks.map(t => ({ id: t._id, title: t.title, status: t.status })),
      };
    }
    
    // Return all agents
    const allAgents = await Promise.all(
      Object.keys(AGENT_REGISTRY).map(async (agentId) => {
        const agent = AGENT_REGISTRY[agentId];
        const tasks = await ctx.db
          .query("agent_tasks")
          .filter((q) => q.eq(q.field("status"), "pending"))
          .collect();
        
        const agentTasks = tasks.filter(t => t.assignedTo.includes(agentId));
        
        return {
          agentId: agent.agentId,
          name: agent.name,
          emoji: agent.emoji,
          currentLoad: agentTasks.length,
          capacity: agent.capacity,
          utilization: Math.round((agentTasks.length / agent.capacity) * 100),
          successRate: Math.round(agent.successRate * 100),
        };
      })
    );
    
    return allAgents;
  },
});

// ==================== COST TRACKING ====================

export const estimateTaskCost: any = query({
  args: {
    taskType: v.string(),
    agentId: v.optional(v.string()),
    estimatedDuration: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let agent: AgentCapability;
    
    if (args.agentId && AGENT_REGISTRY[args.agentId]) {
      agent = AGENT_REGISTRY[args.agentId];
    } else {
      // Find best agent
      const best = await ctx.runQuery(internal.agent_registry.findBestAgent, {
        taskType: args.taskType,
        priority: "medium",
      });
      agent = AGENT_REGISTRY[best.agentId];
    }
    
    const duration = args.estimatedDuration || agent.avgCompletionTime;
    const hours = duration / 3600000;
    const cost = hours * agent.costPerHour;
    
    return {
      agent: agent.name,
      duration: Math.round(duration / 60000), // minutes
      cost: Math.round(cost * 100) / 100,
      costPerHour: agent.costPerHour,
    };
  },
});

export default {
  findBestAgent,
  getAgentStatus,
  estimateTaskCost,
};
