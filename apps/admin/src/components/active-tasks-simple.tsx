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
import { CheckSquare, Plus, User } from "lucide-react";
import Link from "next/link";
import { useToast } from "./ui/use-toast";

const statusColors: Record<string, string> = {
  pending: "bg-gray-500",
  in_progress: "bg-blue-500",
  blocked: "bg-red-500",
  completed: "bg-green-500",
  cancelled: "bg-gray-400",
};

const priorityColors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  low: "secondary",
  medium: "outline",
  high: "default",
  critical: "destructive",
};

const agentIcons: Record<string, string> = {
  orchestrator: "🎯",
  architect: "🏗️",
  coder: "⚡",
  researcher: "🔍",
  business: "💼",
  "data-handler": "🕷️",
  critic: "🛡️",
};

export function ActiveTasksSimple() {
  const tasks = useQuery(api.agentCoordination.getAgentTasks, {});
  const updateTask = useMutation(api.agentCoordination.updateAgentTask);
  const { toast } = useToast();

  const activeTasks = tasks?.filter(
    (t) => t.status === "in_progress" || t.status === "pending"
  ) || [];

  const handleStatusChange = async (
    taskId: any,
    newStatus: "pending" | "in_progress" | "blocked" | "completed" | "cancelled"
  ) => {
    try {
      await updateTask({ taskId, status: newStatus });
      toast({
        title: "Status updated!",
        description: `Task moved to ${newStatus}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update task status",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <CheckSquare className="h-5 w-5" />
          Active Tasks
          <Badge variant="outline" className="ml-2">
            {activeTasks.length} active
          </Badge>
        </CardTitle>
        <Button size="sm" asChild>
          <Link href="/tasks">
            <Plus className="h-4 w-4 mr-2" />
            View All
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {!tasks ? (
          <div className="text-center py-8 text-muted-foreground">
            Loading tasks...
          </div>
        ) : activeTasks.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <CheckSquare className="h-12 w-12 mx-auto mb-3 opacity-20" />
            <p className="font-medium">No active tasks</p>
            <p className="text-sm">Tasks assigned to agents will appear here</p>
          </div>
        ) : (
          <div className="space-y-3">
            {activeTasks.map((task) => (
              <div
                key={task._id}
                className="flex items-start gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div
                  className={`h-2 w-2 rounded-full mt-2 ${statusColors[task.status]}`}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <p className="font-medium">{task.title}</p>
                    <Badge variant={priorityColors[task.priority]} className="text-xs">
                      {task.priority}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={`text-xs ${statusColors[task.status]} text-white border-none`}
                    >
                      {task.status}
                    </Badge>
                  </div>
                  {task.assignedTo && task.assignedTo.length > 0 && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                      <User className="h-3 w-3" />
                      {task.assignedTo.map((agent) => (
                        <span key={agent}>
                          {agentIcons[agent] || "🤖"} {agent}
                        </span>
                      ))}
                    </div>
                  )}
                  {task.context && (
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {task.context}
                    </p>
                  )}
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
                  <SelectTrigger className="w-[140px]">
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
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
