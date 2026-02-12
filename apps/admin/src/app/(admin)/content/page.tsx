"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Plus, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";

const contentTypes = ["blog_post", "social_post", "newsletter", "video", "podcast", "case_study"] as const;
const contentStatuses = ["idea", "outline", "drafting", "review", "scheduled", "published"] as const;
const typeIcons: Record<string, string> = {
  blog_post: "📝", social_post: "📱", newsletter: "📧", video: "🎬", podcast: "🎙️", case_study: "📊",
};
const statusColors: Record<string, string> = {
  idea: "secondary", outline: "secondary", drafting: "default", review: "default", scheduled: "default", published: "default",
};

export default function ContentPage() {
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ title: "", type: "blog_post" as string, notes: "" });

  const items = useQuery(api.content_calendar.list, {
    ...(typeFilter !== "all" ? { type: typeFilter as any } : {}),
    ...(statusFilter !== "all" ? { status: statusFilter as any } : {}),
  });
  const createItem = useMutation(api.content_calendar.create);
  const updateItem = useMutation(api.content_calendar.update);
  const removeItem = useMutation(api.content_calendar.remove);

  const handleCreate = async () => {
    if (!form.title) return;
    await createItem({ title: form.title, type: form.type as any, notes: form.notes || undefined });
    setForm({ title: "", type: "blog_post", notes: "" });
    setShowAdd(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold flex items-center gap-2"><Calendar className="h-8 w-8" /> Content Calendar</h1>
        <Dialog open={showAdd} onOpenChange={setShowAdd}>
          <DialogTrigger asChild><Button><Plus className="mr-2 h-4 w-4" />Add Content</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>New Content Item</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <Input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{contentTypes.map((t) => <SelectItem key={t} value={t}>{typeIcons[t]} {t.replace("_", " ")}</SelectItem>)}</SelectContent>
              </Select>
              <Textarea placeholder="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
              <Button onClick={handleCreate} className="w-full">Create</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-4">
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {contentTypes.map((t) => <SelectItem key={t} value={t}>{typeIcons[t]} {t.replace("_", " ")}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {contentStatuses.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Status columns */}
      <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
        {contentStatuses.map((status) => {
          const statusItems = items?.filter((i) => i.status === status) ?? [];
          return (
            <Card key={status}>
              <CardHeader className="py-3">
                <CardTitle className="text-sm capitalize">{status} <Badge variant="outline" className="ml-1">{statusItems.length}</Badge></CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {statusItems.map((item) => (
                  <div key={item._id} className="p-3 rounded-lg bg-muted/50 space-y-2">
                    <div className="flex items-center gap-1">
                      <span>{typeIcons[item.type]}</span>
                      <span className="text-sm font-medium truncate">{item.title}</span>
                    </div>
                    {item.targetDate && <div className="text-xs text-muted-foreground">{format(new Date(item.targetDate), "MMM d")}</div>}
                    {item.notes && <p className="text-xs text-muted-foreground line-clamp-2">{item.notes}</p>}
                    <div className="flex gap-1">
                      {status !== "published" && (
                        <Select value={item.status} onValueChange={(v) => updateItem({ id: item._id, status: v as any })}>
                          <SelectTrigger className="h-6 text-xs w-24"><SelectValue /></SelectTrigger>
                          <SelectContent>{contentStatuses.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                        </Select>
                      )}
                      <Button size="sm" variant="ghost" className="h-6" onClick={() => removeItem({ id: item._id })}><Trash2 className="h-3 w-3" /></Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
