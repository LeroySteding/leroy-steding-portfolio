"use client";

import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Users, Check } from "lucide-react";
import type { Id } from "../../../../convex/_generated/dataModel";

const AGENTS = [
  { id: "orchestrator", name: "Orchestrator", icon: "🎯" },
  { id: "architect", name: "Architect", icon: "🏗️" },
  { id: "coder", name: "Coder", icon: "💻" },
  { id: "researcher", name: "Researcher", icon: "🔍" },
  { id: "business", name: "Business", icon: "💼" },
  { id: "data-scraper", name: "Data Scraper", icon: "🕷️" },
  { id: "qa-critic", name: "QA Critic", icon: "🔎" },
];

interface QuickDelegateProps {
  taskId: Id<"tasks"> | Id<"agent_tasks">;
  taskType: "personal" | "agent";
  currentAssignees?: string[];
  size?: "sm" | "default" | "lg" | "icon";
  variant?: "default" | "outline" | "ghost";
}

export function QuickDelegate({ 
  taskId, 
  taskType, 
  currentAssignees = [],
  size = "sm",
  variant = "outline"
}: QuickDelegateProps) {
  const updatePersonalTask = useMutation(api.tasks.update);
  const updateAgentTask = useMutation(api.agentCoordination.updateAgentTask);

  const handleDelegate = async (agentId: string) => {
    try {
      if (taskType === "personal") {
        await updatePersonalTask({
          id: taskId as Id<"tasks">,
          assignee: agentId,
        });
      } else {
        // For agent tasks, toggle the agent in the assignedTo array
        const newAssignees = currentAssignees.includes(agentId)
          ? currentAssignees.filter(a => a !== agentId)
          : [...currentAssignees, agentId];
        
        await updateAgentTask({
          taskId: taskId as Id<"agent_tasks">,
          assignedTo: newAssignees,
        });
      }
    } catch (error) {
      console.error("Failed to delegate task:", error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} onClick={(e) => e.preventDefault()}>
          <Users className="h-4 w-4" />
          {size !== "icon" && <span className="ml-2">Delegate</span>}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Assign to Agent</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {AGENTS.map((agent) => {
          const isAssigned = currentAssignees.includes(agent.id);
          return (
            <DropdownMenuItem
              key={agent.id}
              onClick={(e: React.MouseEvent) => {
                e.preventDefault();
                handleDelegate(agent.id);
              }}
              className="cursor-pointer"
            >
              <span className="mr-2">{agent.icon}</span>
              <span className="flex-1">{agent.name}</span>
              {isAssigned && <Check className="h-4 w-4 text-primary" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
