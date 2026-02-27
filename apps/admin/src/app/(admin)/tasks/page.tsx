"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../../convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckSquare, Plus, Users } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import type { Id } from "../../../../../../convex/_generated/dataModel";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { QuickDelegate } from "@/components/quick-delegate";

const statuses = ["backlog", "todo", "in_progress", "review", "done", "cancelled"] as const;
const priorities = ["low", "medium", "high", "critical"] as const;
const categories = ["development", "devops", "content", "seo", "design", "marketing", "job_hunting", "other"] as const;

const statusLabels: Record<string, string> = {
  backlog: "📋 Backlog", 
  todo: "📝 Todo", 
  in_progress: "🔨 In Progress",
  review: "👀 Review", 
  done: "✅ Done", 
  cancelled: "❌ Cancelled",
  pending: "⏳ Pending",
  blocked: "🚫 Blocked",
  completed: "✅ Completed",
};

const priorityColors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  low: "secondary", 
  medium: "outline", 
  high: "default", 
  critical: "destructive",
};

// Map agent task statuses to board columns
const statusMapping: Record<string, string> = {
  pending: "backlog",
  blocked: "backlog",
  in_progress: "in_progress",
  review: "review",
  completed: "done",
};

export default function TasksPage() {
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newPriority, setNewPriority] = useState<string>("medium");
  const [newCategory, setNewCategory] = useState<string>("development");
  const [activeTab, setActiveTab] = useState<"all" | "personal" | "agent">("agent");

  // Get both types of tasks
  const personalTasks = useQuery(api.tasks.list, {
    ...(categoryFilter !== "all" ? { category: categoryFilter as any } : {}),
    ...(priorityFilter !== "all" ? { priority: priorityFilter as any } : {}),
  });
  
  const agentTasks = useQuery(api.agentCoordination.getAgentTasks, {});

  const createTask = useMutation(api.tasks.create);
  const updateTask = useMutation(api.tasks.update);
  const updateAgentTask = useMutation(api.agentCoordination.updateAgentTask);

  const handleCreate = async () => {
    if (!newTitle.trim()) return;
    await createTask({ title: newTitle, priority: newPriority as any, category: newCategory as any });
    setNewTitle("");
    setShowAddDialog(false);
  };

  // Combine and transform tasks for unified display
  const allTasks = [
    ...(personalTasks || []).map(t => ({
      ...t,
      type: 'personal' as const,
      assignees: t.assignee ? [t.assignee] : [],
    })),
    ...(agentTasks || []).map(t => ({
      ...t,
      type: 'agent' as const,
      assignees: t.assignedTo,
      priority: t.priority,
      status: statusMapping[t.status] || t.status,
      category: 'development' as const,
    })),
  ];

  const filteredTasks = allTasks.filter(t => {
    if (activeTab === "personal" && t.type !== "personal") return false;
    if (activeTab === "agent" && t.type !== "agent") return false;
    if (priorityFilter !== "all" && t.priority !== priorityFilter) return false;
    return true;
  });

  const activeStatuses = ["backlog", "todo", "in_progress", "review"];
  const groupedByStatus = activeStatuses.reduce((acc, status) => {
    acc[status] = filteredTasks.filter((t) => t.status === status);
    return acc;
  }, {} as Record<string, typeof filteredTasks>);

  const completedTasks = filteredTasks.filter((t) => t.status === "done" || t.status === "completed");
  const cancelledTasks = filteredTasks.filter((t) => t.status === "cancelled");

  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const newStatus = destination.droppableId;
    const task = allTasks.find(t => t._id === draggableId);
    
    if (!task) return;

    try {
      if (task.type === "personal") {
        await updateTask({ id: task._id as Id<"tasks">, status: newStatus as any });
      } else {
        // Map board status back to agent task status
        const agentStatus = newStatus === "backlog" ? "pending" : 
                           newStatus === "in_progress" ? "in_progress" :
                           newStatus === "review" ? "review" :
                           newStatus === "done" ? "completed" : "pending";
        await updateAgentTask({ 
          taskId: task._id as Id<"agent_tasks">, 
          status: agentStatus as any 
        });
      }
    } catch (error) {
      console.error("Failed to update task status:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <CheckSquare className="h-8 w-8" /> Tasks
          </h1>
          <p className="text-muted-foreground mt-1">
            {filteredTasks.length} total • {completedTasks.length} completed
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/agents">
              <Users className="mr-2 h-4 w-4" />
              Agent Dashboard
            </Link>
          </Button>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Task
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>New Task</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <Input 
                  placeholder="Task title" 
                  value={newTitle} 
                  onChange={(e) => setNewTitle(e.target.value)} 
                  onKeyDown={(e) => e.key === "Enter" && handleCreate()} 
                />
                <div className="flex gap-2">
                  <Select value={newPriority} onValueChange={setNewPriority}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {priorities.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Select value={newCategory} onValueChange={setNewCategory}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {categories.map((c) => <SelectItem key={c} value={c}>{c.replace("_", " ")}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleCreate} className="w-full">Create Task</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex gap-4">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="flex-1">
          <TabsList>
            <TabsTrigger value="all">All Tasks ({allTasks.length})</TabsTrigger>
            <TabsTrigger value="personal">Personal ({personalTasks?.length || 0})</TabsTrigger>
            <TabsTrigger value="agent">Agent Tasks ({agentTasks?.length || 0})</TabsTrigger>
          </TabsList>
        </Tabs>

        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-48"><SelectValue placeholder="Priority" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            {priorities.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
          </SelectContent>
        </Select>

        {activeTab === "personal" && (
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-48"><SelectValue placeholder="Category" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((c) => <SelectItem key={c} value={c}>{c.replace("_", " ")}</SelectItem>)}
            </SelectContent>
          </Select>
        )}
      </div>

      <Tabs defaultValue="board" className="w-full">
        <TabsList>
          <TabsTrigger value="board">Board View</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
        </TabsList>

        <TabsContent value="board" className="space-y-6">
          <DragDropContext onDragEnd={handleDragEnd}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {activeStatuses.map((status) => {
                const tasksInStatus = groupedByStatus[status] || [];
                return (
                  <Card key={status} className="flex flex-col h-full">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium flex items-center justify-between">
                        {statusLabels[status]}
                        <Badge variant="outline">{tasksInStatus.length}</Badge>
                      </CardTitle>
                    </CardHeader>
                    <Droppable droppableId={status}>
                      {(provided, snapshot) => (
                        <CardContent 
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={`space-y-2 flex-1 transition-colors ${
                            snapshot.isDraggingOver ? 'bg-muted/50' : ''
                          }`}
                          style={{ minHeight: '200px' }}
                        >
                          {tasksInStatus.map((task, index) => (
                            <Draggable key={task._id} draggableId={task._id} index={index}>
                              {(provided, snapshot) => (
                                <Card
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={`p-3 transition-all cursor-grab active:cursor-grabbing ${
                                    snapshot.isDragging 
                                      ? 'shadow-lg ring-2 ring-primary rotate-2' 
                                      : 'hover:shadow-md hover:-translate-y-0.5'
                                  }`}
                                  style={{
                                    ...provided.draggableProps.style,
                                  }}
                                >
                                  <Link 
                                    href={task.type === 'personal' ? `/tasks/${task._id}` : `/agents`}
                                    className="block mb-2"
                                    onClick={(e) => {
                                      if (snapshot.isDragging) e.preventDefault();
                                    }}
                                  >
                                    <div className="flex items-start justify-between mb-2">
                                      <p className="text-sm font-medium line-clamp-2 flex-1">{task.title}</p>
                                      {task.type === 'agent' && (
                                        <Badge variant="outline" className="text-xs ml-2 shrink-0">
                                          <Users className="h-3 w-3 mr-1" />
                                          Agent
                                        </Badge>
                                      )}
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Badge variant={priorityColors[task.priority]} className="text-xs">
                                        {task.priority}
                                      </Badge>
                                      {task.assignees && task.assignees.length > 0 && (
                                        <span className="text-xs text-muted-foreground truncate">
                                          {task.assignees.slice(0, 2).join(", ")}
                                          {task.assignees.length > 2 && ` +${task.assignees.length - 2}`}
                                        </span>
                                      )}
                                    </div>
                                  </Link>
                                  <div className="mt-2 flex justify-end" onClick={(e) => e.stopPropagation()}>
                                    <QuickDelegate
                                      taskId={task._id}
                                      taskType={task.type}
                                      currentAssignees={task.assignees}
                                      size="sm"
                                      variant="ghost"
                                    />
                                  </div>
                                </Card>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </CardContent>
                      )}
                    </Droppable>
                  </Card>
                );
              })}
            </div>
          </DragDropContext>

          {(completedTasks.length > 0 || cancelledTasks.length > 0) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {completedTasks.length > 0 && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium flex items-center justify-between">
                      ✅ Completed
                      <Badge variant="outline">{completedTasks.length}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {completedTasks.map((task) => (
                        <div key={task._id} className="text-sm p-2 bg-muted/30 rounded flex items-center justify-between">
                          <span className="line-through opacity-60 flex-1">{task.title}</span>
                          {task.type === 'agent' && (
                            <Badge variant="outline" className="text-xs">Agent</Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {cancelledTasks.length > 0 && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium flex items-center justify-between">
                      ❌ Cancelled
                      <Badge variant="outline">{cancelledTasks.length}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {cancelledTasks.map((task) => (
                        <div key={task._id} className="text-sm p-2 bg-muted/30 rounded opacity-60">
                          {task.title}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="list" className="space-y-2">
          {filteredTasks.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                <CheckSquare className="h-12 w-12 mx-auto mb-3 opacity-20" />
                <p>No tasks found</p>
              </CardContent>
            </Card>
          ) : (
            filteredTasks.map((task) => (
              <Card key={task._id} className="hover:bg-muted/50 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Link 
                          href={task.type === 'personal' ? `/tasks/${task._id}` : `/agents`}
                          className="font-medium hover:underline"
                        >
                          {task.title}
                        </Link>
                        {task.type === 'agent' && (
                          <Badge variant="outline" className="text-xs">
                            <Users className="h-3 w-3 mr-1" />
                            Agent Task
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Badge variant="outline">{statusLabels[task.status]}</Badge>
                        <Badge variant={priorityColors[task.priority]}>{task.priority}</Badge>
                        {task.assignees && task.assignees.length > 0 && (
                          <span className="text-muted-foreground">
                            {task.assignees.join(", ")}
                          </span>
                        )}
                      </div>
                    </div>
                    <QuickDelegate
                      taskId={task._id}
                      taskType={task.type}
                      currentAssignees={task.assignees}
                    />
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
