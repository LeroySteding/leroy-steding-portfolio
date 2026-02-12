"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckSquare, Plus, ArrowRight, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import type { Id } from "../../../../convex/_generated/dataModel";

const statuses = ["backlog", "todo", "in_progress", "review", "done", "cancelled"] as const;
const priorities = ["low", "medium", "high", "critical"] as const;
const categories = ["development", "devops", "content", "seo", "design", "marketing", "job_hunting", "other"] as const;

const statusLabels: Record<string, string> = {
  backlog: "📋 Backlog", todo: "📝 Todo", in_progress: "🔨 In Progress",
  review: "👀 Review", done: "✅ Done", cancelled: "❌ Cancelled",
};

const priorityColors: Record<string, string> = {
  low: "secondary", medium: "default", high: "destructive", critical: "destructive",
};

export default function TasksPage() {
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newPriority, setNewPriority] = useState<string>("medium");
  const [newCategory, setNewCategory] = useState<string>("development");

  const tasks = useQuery(api.tasks.list, {
    ...(categoryFilter !== "all" ? { category: categoryFilter as any } : {}),
    ...(priorityFilter !== "all" ? { priority: priorityFilter as any } : {}),
  });
  const createTask = useMutation(api.tasks.create);
  const updateTask = useMutation(api.tasks.update);
  const removeTask = useMutation(api.tasks.remove);

  const handleCreate = async () => {
    if (!newTitle.trim()) return;
    await createTask({ title: newTitle, priority: newPriority as any, category: newCategory as any });
    setNewTitle("");
    setShowAddDialog(false);
  };

  const moveTask = (id: Id<"tasks">, newStatus: string) => {
    updateTask({ id, status: newStatus as any });
  };

  const activeStatuses = statuses.filter((s) => s !== "done" && s !== "cancelled");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold flex items-center gap-2"><CheckSquare className="h-8 w-8" /> Tasks</h1>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild><Button><Plus className="mr-2 h-4 w-4" />Add Task</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>New Task</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <Input placeholder="Task title" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleCreate()} />
              <div className="flex gap-2">
                <Select value={newPriority} onValueChange={setNewPriority}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{priorities.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
                </Select>
                <Select value={newCategory} onValueChange={setNewCategory}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{categories.map((c) => <SelectItem key={c} value={c}>{c.replace("_", " ")}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <Button onClick={handleCreate} className="w-full">Create Task</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-4">
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-48"><SelectValue placeholder="Category" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((c) => <SelectItem key={c} value={c}>{c.replace("_", " ")}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-48"><SelectValue placeholder="Priority" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            {priorities.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="board">
        <TabsList>
          <TabsTrigger value="board">Board</TabsTrigger>
          <TabsTrigger value="list">List</TabsTrigger>
        </TabsList>

        <TabsContent value="board">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {activeStatuses.map((status) => {
              const statusTasks = tasks?.filter((t) => t.status === status) ?? [];
              return (
                <Card key={status}>
                  <CardHeader className="py-3">
                    <CardTitle className="text-sm">{statusLabels[status]} <Badge variant="outline" className="ml-1">{statusTasks.length}</Badge></CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {statusTasks.map((task) => (
                      <div key={task._id} className="p-3 rounded-lg bg-muted/50 space-y-2">
                        <div className="flex items-start justify-between">
                          <span className="text-sm font-medium">{task.title}</span>
                          <Badge variant={priorityColors[task.priority] as any} className="text-xs ml-1">{task.priority}</Badge>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Badge variant="outline" className="text-xs">{task.category.replace("_", " ")}</Badge>
                          {task.assignee && <span>• {task.assignee}</span>}
                        </div>
                        <div className="flex gap-1">
                          {status !== "review" && (
                            <Button size="sm" variant="ghost" className="h-6 text-xs" onClick={() => moveTask(task._id, statuses[statuses.indexOf(status) + 1])}>
                              <ArrowRight className="h-3 w-3" />
                            </Button>
                          )}
                          {status === "review" && (
                            <Button size="sm" variant="ghost" className="h-6 text-xs" onClick={() => moveTask(task._id, "done")}>✅ Done</Button>
                          )}
                          <Button size="sm" variant="ghost" className="h-6 text-xs" onClick={() => removeTask({ id: task._id })}>
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="list">
          <Card>
            <CardContent className="py-4">
              <div className="space-y-2">
                {tasks?.map((task) => (
                  <div key={task._id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">{statusLabels[task.status]}</Badge>
                      <span className="font-medium">{task.title}</span>
                      <Badge variant={priorityColors[task.priority] as any} className="text-xs">{task.priority}</Badge>
                      <Badge variant="outline" className="text-xs">{task.category.replace("_", " ")}</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      {task.dueDate && <span className="text-xs text-muted-foreground">{format(new Date(task.dueDate), "MMM d")}</span>}
                      <Button size="sm" variant="ghost" onClick={() => removeTask({ id: task._id })}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
