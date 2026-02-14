"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { CheckSquare, Clock, AlertCircle, Ban, CheckCircle2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import { Id } from "../../convex/_generated/dataModel";

const statusIcons = {
  pending: Clock,
  in_progress: CheckSquare,
  blocked: Ban,
  completed: CheckCircle2,
  cancelled: AlertCircle,
};

const statusColors = {
  pending: "bg-gray-100 text-gray-800",
  in_progress: "bg-blue-100 text-blue-800",
  blocked: "bg-red-100 text-red-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-gray-100 text-gray-600",
};

const priorityColors = {
  low: "bg-gray-100 text-gray-800",
  medium: "bg-yellow-100 text-yellow-800",
  high: "bg-orange-100 text-orange-800",
  critical: "bg-red-100 text-red-800",
};

const agentIcons: Record<string, string> = {
  orchestrator: "🎯",
  architect: "🏗️",
  coder: "⚡",
  researcher: "🔍",
  business: "💼",
  "data-handler": "🕷️",
  critic: "🛡️",
  compliance: "⚖️",
};

export function ActiveTasks() {
  const [filterAgent, setFilterAgent] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("active");
  
  const tasks = useQuery(
    api.agentCoordination.getAgentTasks,
    filterAgent !== "all" ? { agentName: filterAgent } : {}
  );
  
  const updateTask = useMutation(api.agentCoordination.updateAgentTask);

  if (!tasks) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckSquare className="h-5 w-5" />
            Active Tasks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">Loading tasks...</div>
        </CardContent>
      </Card>
    );
  }

  // Filter by status
  const filteredTasks = tasks.filter((task) => {
    if (filterStatus === "active") {
      return ["pending", "in_progress", "blocked"].includes(task.status);
    }
    if (filterStatus === "completed") {
      return task.status === "completed";
    }
    return true;
  });

  // Group by agent
  const tasksByAgent: Record<string, typeof tasks> = {};
  filteredTasks.forEach((task) => {
    task.assignedTo.forEach((agent) => {
      if (!tasksByAgent[agent]) {
        tasksByAgent[agent] = [];
      }
      tasksByAgent[agent].push(task);
    });
  });

  const uniqueAgents = Array.from(new Set(tasks.flatMap((t) => t.assignedTo)));

  const handleStatusChange = async (
    taskId: Id<"agent_tasks">,
    newStatus: "pending" | "in_progress" | "blocked" | "completed" | "cancelled"
  ) => {
    await updateTask({ taskId, status: newStatus });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <CheckSquare className="h-5 w-5" />
            Active Tasks
          </CardTitle>
          <div className="flex gap-2">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="all">All</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterAgent} onValueChange={setFilterAgent}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Agents</SelectItem>
                {uniqueAgents.map((agent) => (
                  <SelectItem key={agent} value={agent}>
                    {agentIcons[agent] || "🤖"} {agent}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {filteredTasks.length === 0 ? (
          <div className="text-center py-8 text-sm text-muted-foreground">
            No tasks found
          </div>
        ) : filterAgent !== "all" ? (
          // List view for single agent
          <div className="space-y-2">
            {filteredTasks.map((task) => {
              const StatusIcon = statusIcons[task.status];
              return (
                <div
                  key={task._id}
                  className="flex items-start gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <StatusIcon className="h-5 w-5 mt-0.5 text-muted-foreground" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-medium text-sm">{task.title}</h3>
                      <Badge className={priorityColors[task.priority]}>
                        {task.priority}
                      </Badge>
                      <Badge className={statusColors[task.status]}>
                        {task.status}
                      </Badge>
                    </div>
                    {task.description && (
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {task.description}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(task.createdAt, { addSuffix: true })}
                      </span>
                      {task.assignedTo.length > 1 && (
                        <span className="text-xs text-muted-foreground">
                          • {task.assignedTo.map((a) => agentIcons[a] || a).join(" ")}
                        </span>
                      )}
                    </div>
                  </div>
                  <Select
                    value={task.status}
                    onValueChange={(value) =>
                      handleStatusChange(
                        task._id,
                        value as typeof task.status
                      )
                    }
                  >
                    <SelectTrigger className="w-[130px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="blocked">Blocked</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              );
            })}
          </div>
        ) : (
          // Kanban view for all agents
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Object.entries(tasksByAgent).map(([agent, agentTasks]) => (
              <div key={agent} className="space-y-2">
                <h3 className="font-medium text-sm flex items-center gap-2 px-2">
                  <span className="text-lg">{agentIcons[agent] || "🤖"}</span>
                  {agent}
                  <Badge variant="outline" className="ml-auto">
                    {agentTasks.length}
                  </Badge>
                </h3>
                <div className="space-y-2">
                  {agentTasks.map((task) => {
                    const StatusIcon = statusIcons[task.status];
                    return (
                      <div
                        key={task._id}
                        className="p-3 border rounded-lg bg-card hover:bg-muted/50 transition-colors space-y-2"
                      >
                        <div className="flex items-start gap-2">
                          <StatusIcon className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-medium line-clamp-2">
                              {task.title}
                            </h4>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 flex-wrap">
                          <Badge
                            className={`${priorityColors[task.priority]} text-xs`}
                          >
                            {task.priority}
                          </Badge>
                          <Badge
                            className={`${statusColors[task.status]} text-xs`}
                          >
                            {task.status}
                          </Badge>
                        </div>
                        <span className="text-xs text-muted-foreground block">
                          {formatDistanceToNow(task.createdAt, {
                            addSuffix: true,
                          })}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
