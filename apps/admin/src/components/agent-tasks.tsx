"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { CheckCircle2, Circle, AlertCircle, Ban, Plus, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const agentIcons: Record<string, string> = {
  orchestrator: "🎯",
  architect: "🏗️",
  coder: "💻",
  researcher: "🔍",
  business: "📈",
  "data-handler": "🕷️",
  critic: "⚠️",
};

const statusIcons = {
  pending: <Circle className="h-4 w-4" />,
  in_progress: <Clock className="h-4 w-4" />,
  blocked: <AlertCircle className="h-4 w-4" />,
  completed: <CheckCircle2 className="h-4 w-4" />,
  cancelled: <Ban className="h-4 w-4" />,
};

const statusColors = {
  pending: "bg-gray-100 text-gray-700 border-gray-300",
  in_progress: "bg-blue-100 text-blue-700 border-blue-300",
  blocked: "bg-red-100 text-red-700 border-red-300",
  completed: "bg-green-100 text-green-700 border-green-300",
  cancelled: "bg-gray-100 text-gray-500 border-gray-300",
};

const priorityColors = {
  low: "bg-gray-50 text-gray-600 border-gray-200",
  medium: "bg-yellow-50 text-yellow-700 border-yellow-200",
  high: "bg-orange-50 text-orange-700 border-orange-200",
  critical: "bg-red-50 text-red-700 border-red-200",
};

const agentsList = [
  "orchestrator",
  "architect",
  "coder",
  "researcher",
  "business",
  "data-handler",
  "critic",
];

export function AgentTasks() {
  const tasks = useQuery(api.agentCoordination.getAgentTasks, {});
  const createTask = useMutation(api.agentCoordination.createAgentTask);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    assignedTo: [] as string[],
    priority: "medium" as "low" | "medium" | "high" | "critical",
  });

  const handleCreateTask = async () => {
    if (!formData.title || formData.assignedTo.length === 0) return;

    await createTask({
      title: formData.title,
      description: formData.description || undefined,
      assignedTo: formData.assignedTo,
      priority: formData.priority,
      createdBy: "orchestrator",
    });

    setFormData({
      title: "",
      description: "",
      assignedTo: [],
      priority: "medium",
    });
    setIsDialogOpen(false);
  };

  const activeTasks = tasks?.filter((t) => 
    t.status !== "completed" && t.status !== "cancelled"
  );

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-xl font-semibold">Active Tasks</CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              New Task
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Task</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Task title..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Task description..."
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value: any) =>
                    setFormData({ ...formData, priority: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Assign to Agents</Label>
                <div className="flex flex-wrap gap-2">
                  {agentsList.map((agent) => (
                    <Button
                      key={agent}
                      type="button"
                      variant={
                        formData.assignedTo.includes(agent) ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => {
                        if (formData.assignedTo.includes(agent)) {
                          setFormData({
                            ...formData,
                            assignedTo: formData.assignedTo.filter((a) => a !== agent),
                          });
                        } else {
                          setFormData({
                            ...formData,
                            assignedTo: [...formData.assignedTo, agent],
                          });
                        }
                      }}
                    >
                      {agentIcons[agent]} {agent}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateTask}>Create Task</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {!tasks ? (
          <div className="text-sm text-muted-foreground">Loading...</div>
        ) : activeTasks && activeTasks.length > 0 ? (
          <div className="space-y-3">
            {activeTasks.map((task) => (
              <div
                key={task._id}
                className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium truncate">{task.title}</h4>
                      <Badge
                        variant="outline"
                        className={`${statusColors[task.status]} flex items-center gap-1`}
                      >
                        {statusIcons[task.status]}
                        {task.status.replace("_", " ")}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={priorityColors[task.priority]}
                      >
                        {task.priority}
                      </Badge>
                    </div>
                    {task.description && (
                      <p className="text-sm text-muted-foreground mb-2">
                        {task.description}
                      </p>
                    )}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs text-muted-foreground">
                        Assigned to:
                      </span>
                      {task.assignedTo.map((agent) => (
                        <Badge key={agent} variant="secondary" className="text-xs">
                          {agentIcons[agent]} {agent}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground whitespace-nowrap">
                    {formatDistanceToNow(task.createdAt, { addSuffix: true })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-sm text-muted-foreground">
            No active tasks
          </div>
        )}
      </CardContent>
    </Card>
  );
}
