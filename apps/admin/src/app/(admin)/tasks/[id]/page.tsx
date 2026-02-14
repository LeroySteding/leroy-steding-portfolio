"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import type { Id } from "../../../../../convex/_generated/dataModel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TagInput } from "@/components/tag-input";
import { toast } from "@/components/ui/use-toast";
import { ArrowLeft, Pencil, Save, X, ExternalLink, Calendar, Clock } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

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

const statusFlow: Record<string, string[]> = {
  backlog: ["todo"],
  todo: ["in_progress"],
  in_progress: ["review"],
  review: ["done"],
  done: [],
  cancelled: [],
};

export default function TaskDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const task = useQuery(api.tasks.get, { id: id as Id<"tasks"> });
  const updateTask = useMutation(api.tasks.update);

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    title: "", description: "", status: "" as string, priority: "" as string,
    category: "" as string, assignee: "", dueDate: "", tags: [] as string[], relatedUrl: "",
  });

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title ?? "",
        description: task.description ?? "",
        status: task.status,
        priority: task.priority,
        category: task.category,
        assignee: task.assignee ?? "",
        dueDate: task.dueDate ? format(new Date(task.dueDate), "yyyy-MM-dd") : "",
        tags: task.tags ?? [],
        relatedUrl: task.relatedUrl ?? "",
      });
    }
  }, [task]);

  const handleSave = async () => {
    try {
      await updateTask({
        id: id as Id<"tasks">,
        title: form.title,
        description: form.description || undefined,
        status: form.status as any,
        priority: form.priority as any,
        category: form.category as any,
        assignee: form.assignee || undefined,
        dueDate: form.dueDate ? new Date(form.dueDate).getTime() : undefined,
        tags: form.tags,
        relatedUrl: form.relatedUrl || undefined,
      });
      toast({ title: "Saved", description: "Task updated successfully" });
      setEditing(false);
    } catch {
      toast({ title: "Error", description: "Failed to update task", variant: "destructive" });
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    await updateTask({ id: id as Id<"tasks">, status: newStatus as any });
    toast({ title: "Status updated", description: `Moved to ${statusLabels[newStatus]}` });
  };

  if (task === undefined) return <div className="p-8">Loading...</div>;
  if (task === null) return <div className="p-8">Task not found.</div>;

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/tasks"><ArrowLeft className="h-4 w-4" /></Link>
          </Button>
          <h1 className="text-3xl font-bold">{editing ? "Edit Task" : task.title}</h1>
        </div>
        <div className="flex gap-2">
          {editing ? (
            <>
              <Button onClick={handleSave}><Save className="mr-2 h-4 w-4" />Save</Button>
              <Button variant="outline" onClick={() => setEditing(false)}><X className="mr-2 h-4 w-4" />Cancel</Button>
            </>
          ) : (
            <Button variant="outline" onClick={() => setEditing(true)}><Pencil className="mr-2 h-4 w-4" />Edit</Button>
          )}
        </div>
      </div>

      {/* Status transitions */}
      {!editing && (
        <div className="flex items-center gap-3 flex-wrap">
          <Badge variant={priorityColors[task.priority] as any} className="text-sm px-3 py-1">{task.priority}</Badge>
          <Badge variant="outline" className="text-sm px-3 py-1">{statusLabels[task.status]}</Badge>
          {statusFlow[task.status]?.map((next) => (
            <Button key={next} size="sm" onClick={() => handleStatusChange(next)}>
              Move to {statusLabels[next]}
            </Button>
          ))}
          {task.status !== "cancelled" && task.status !== "done" && (
            <Button size="sm" variant="outline" onClick={() => handleStatusChange("cancelled")}>Cancel Task</Button>
          )}
        </div>
      )}

      {editing ? (
        /* Edit mode */
        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Details</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{statuses.map((s) => <SelectItem key={s} value={s}>{statusLabels[s]}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select value={form.priority} onValueChange={(v) => setForm({ ...form, priority: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{priorities.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{categories.map((c) => <SelectItem key={c} value={c}>{c.replace("_", " ")}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Assignee</Label>
                  <Input value={form.assignee} onChange={(e) => setForm({ ...form, assignee: e.target.value })} placeholder="Assignee name" />
                </div>
                <div className="space-y-2">
                  <Label>Due Date</Label>
                  <Input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Related URL</Label>
                <Input value={form.relatedUrl} onChange={(e) => setForm({ ...form, relatedUrl: e.target.value })} placeholder="https://..." />
              </div>
              <TagInput value={form.tags} onChange={(tags) => setForm({ ...form, tags })} />
            </CardContent>
          </Card>
        </div>
      ) : (
        /* View mode */
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="md:col-span-2">
            <CardHeader><CardTitle>Details</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {task.description ? (
                <div>
                  <Label className="text-muted-foreground text-xs">Description</Label>
                  <p className="mt-1 whitespace-pre-wrap">{task.description}</p>
                </div>
              ) : (
                <p className="text-muted-foreground italic">No description</p>
              )}
              {task.relatedUrl && (
                <div>
                  <Label className="text-muted-foreground text-xs">Related URL</Label>
                  <a href={task.relatedUrl} target="_blank" rel="noopener" className="mt-1 flex items-center gap-1 text-blue-500 hover:underline">
                    {task.relatedUrl} <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              )}
              {task.tags && task.tags.length > 0 && (
                <div>
                  <Label className="text-muted-foreground text-xs">Tags</Label>
                  <div className="flex gap-1 mt-1 flex-wrap">
                    {task.tags.map((tag) => <Badge key={tag} variant="outline">{tag}</Badge>)}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Info</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Category</span>
                <Badge variant="outline">{task.category.replace("_", " ")}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Assignee</span>
                <span>{task.assignee ?? "—"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Due Date</span>
                <span className="flex items-center gap-1">
                  {task.dueDate ? (<><Calendar className="h-3 w-3" />{format(new Date(task.dueDate), "MMM d, yyyy")}</>) : "—"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Created</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />{format(new Date(task.createdAt), "MMM d, yyyy")}
                </span>
              </div>
              {task.completedAt && (
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Completed</span>
                  <span>{format(new Date(task.completedAt), "MMM d, yyyy")}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
