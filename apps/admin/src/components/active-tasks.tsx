"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { CheckSquare, Plus, User } from "lucide-react";
import Link from "next/link";

const statusColors: Record<string, string> = {
  backlog: "bg-gray-500",
  todo: "bg-blue-500",
  in_progress: "bg-yellow-500",
  review: "bg-purple-500",
  done: "bg-green-500",
  cancelled: "bg-red-500",
};

const priorityColors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  low: "secondary",
  medium: "outline",
  high: "default",
  critical: "destructive",
};

export function ActiveTasks() {
  // Get tasks for agents
  const agentTasks = useQuery(api.agentCoordination.getAgentTasks, {});
  
  // Get regular tasks (from /tasks page)
  const regularTasks = useQuery(api.tasks.list, { 
    status: "in_progress" 
  });

  const activeTasks = agentTasks?.filter(t => t.status === "in_progress") || [];
  const pendingTasks = agentTasks?.filter(t => t.status === "pending") || [];
  const regularActive = regularTasks || [];

  const allActiveTasks = [
    ...activeTasks,
    ...regularActive.map(t => ({
      _id: t._id,
      _creationTime: t.createdAt,
      title: t.title,
      assignedTo: t.assignee ? [t.assignee] : [],
      priority: t.priority,
      status: t.status,
      createdBy: "system",
    }))
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <CheckSquare className="h-5 w-5" />
          Active Tasks
          <Badge variant="outline" className="ml-2">
            {allActiveTasks.length} in progress
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
        {allActiveTasks.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <CheckSquare className="h-12 w-12 mx-auto mb-3 opacity-20" />
            <p className="font-medium">No active tasks</p>
            <p className="text-sm">Tasks assigned to agents will appear here</p>
          </div>
        ) : (
          <div className="space-y-3">
            {allActiveTasks.slice(0, 5).map((task) => (
              <div
                key={task._id}
                className="flex items-start gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div
                  className={`h-2 w-2 rounded-full mt-2 ${statusColors[task.status]}`}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium truncate">{task.title}</p>
                    <Badge variant={priorityColors[task.priority]} className="text-xs">
                      {task.priority}
                    </Badge>
                  </div>
                  {task.assignedTo && task.assignedTo.length > 0 && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <User className="h-3 w-3" />
                      {task.assignedTo.join(", ")}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {allActiveTasks.length > 5 && (
              <Button variant="ghost" size="sm" className="w-full" asChild>
                <Link href="/tasks">
                  View {allActiveTasks.length - 5} more tasks →
                </Link>
              </Button>
            )}
          </div>
        )}

        {pendingTasks.length > 0 && (
          <div className="mt-6 pt-6 border-t">
            <h4 className="text-sm font-medium mb-3 text-muted-foreground">
              Pending Assignment ({pendingTasks.length})
            </h4>
            <div className="space-y-2">
              {pendingTasks.slice(0, 3).map((task) => (
                <div
                  key={task._id}
                  className="flex items-center gap-2 text-sm p-2 rounded hover:bg-muted/50"
                >
                  <div className="h-1.5 w-1.5 rounded-full bg-gray-400" />
                  <span className="flex-1 truncate">{task.title}</span>
                  <Badge variant="outline" className="text-xs">
                    {task.priority}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
