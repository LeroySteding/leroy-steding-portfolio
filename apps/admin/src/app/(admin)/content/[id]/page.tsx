"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../../../convex/_generated/api";
import type { Id } from "../../../../../../../convex/_generated/dataModel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TagInput } from "@/components/tag-input";
import { toast } from "@/components/ui/use-toast";
import { ArrowLeft, Pencil, Save, X, Calendar, Clock, FileText } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

const contentTypes = ["blog_post", "social_post", "newsletter", "video", "podcast", "case_study"] as const;
const contentStatuses = ["idea", "outline", "drafting", "review", "scheduled", "published"] as const;

const statusEmoji: Record<string, string> = {
  idea: "💡", outline: "📝", drafting: "✍️", review: "👀", scheduled: "📅", published: "✅",
};

const typeEmoji: Record<string, string> = {
  blog_post: "📄", social_post: "📱", newsletter: "📧", video: "🎬", podcast: "🎙️", case_study: "📊",
};

const statusFlow: Record<string, string[]> = {
  idea: ["outline"],
  outline: ["drafting"],
  drafting: ["review"],
  review: ["scheduled"],
  scheduled: ["published"],
  published: [],
};

export default function ContentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const item = useQuery(api.content_calendar.get, { id: id as Id<"content_calendar"> });
  const updateItem = useMutation(api.content_calendar.update);

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    title: "", type: "" as string, status: "" as string, platform: "",
    targetDate: "", notes: "", seoKeywords: [] as string[], relatedBlogPostId: "",
  });

  useEffect(() => {
    if (item) {
      setForm({
        title: item.title ?? "",
        type: item.type,
        status: item.status,
        platform: item.platform ?? "",
        targetDate: item.targetDate ? format(new Date(item.targetDate), "yyyy-MM-dd") : "",
        notes: item.notes ?? "",
        seoKeywords: item.seoKeywords ?? [],
        relatedBlogPostId: item.relatedBlogPostId ?? "",
      });
    }
  }, [item]);

  const handleSave = async () => {
    try {
      await updateItem({
        id: id as Id<"content_calendar">,
        title: form.title, type: form.type as any, status: form.status as any,
        platform: form.platform || undefined,
        targetDate: form.targetDate ? new Date(form.targetDate).getTime() : undefined,
        notes: form.notes || undefined,
        seoKeywords: form.seoKeywords.length > 0 ? form.seoKeywords : undefined,
        relatedBlogPostId: form.relatedBlogPostId || undefined,
      });
      toast({ title: "Saved", description: "Content item updated" });
      setEditing(false);
    } catch {
      toast({ title: "Error", description: "Failed to update", variant: "destructive" });
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    await updateItem({ id: id as Id<"content_calendar">, status: newStatus as any });
    toast({ title: "Status updated", description: `Moved to ${statusEmoji[newStatus]} ${newStatus}` });
  };

  if (item === undefined) return <div className="p-8">Loading...</div>;
  if (item === null) return <div className="p-8">Content item not found.</div>;

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/content"><ArrowLeft className="h-4 w-4" /></Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{item.title}</h1>
            <p className="text-muted-foreground">{typeEmoji[item.type]} {item.type.replace("_", " ")} {item.platform && `• ${item.platform}`}</p>
          </div>
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

      {/* Status pipeline */}
      <div className="flex gap-1 overflow-x-auto">
        {contentStatuses.map((s) => (
          <button
            key={s}
            onClick={() => !editing && handleStatusChange(s)}
            className={`flex-1 min-w-[80px] py-2 px-3 rounded-lg text-center text-xs font-medium transition-colors ${
              s === item.status
                ? "bg-primary text-primary-foreground"
                : "bg-muted hover:bg-muted/80 text-muted-foreground"
            }`}
          >
            <div className="text-base">{statusEmoji[s]}</div>
            <div className="capitalize">{s}</div>
          </button>
        ))}
      </div>

      {/* Status transition buttons */}
      {!editing && statusFlow[item.status]?.length > 0 && (
        <div className="flex gap-2">
          {statusFlow[item.status].map((next) => (
            <Button key={next} size="sm" onClick={() => handleStatusChange(next)}>
              Move to {statusEmoji[next]} {next}
            </Button>
          ))}
        </div>
      )}

      {editing ? (
        <Card>
          <CardHeader><CardTitle>Details</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{contentTypes.map((t) => <SelectItem key={t} value={t}>{typeEmoji[t]} {t.replace("_", " ")}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{contentStatuses.map((s) => <SelectItem key={s} value={s}>{statusEmoji[s]} {s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Platform</Label>
                <Input value={form.platform} onChange={(e) => setForm({ ...form, platform: e.target.value })} placeholder="e.g. LinkedIn, Twitter" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Target Date</Label>
                <Input type="date" value={form.targetDate} onChange={(e) => setForm({ ...form, targetDate: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Related Blog Post ID</Label>
                <Input value={form.relatedBlogPostId} onChange={(e) => setForm({ ...form, relatedBlogPostId: e.target.value })} placeholder="Blog post ID" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={4} />
            </div>
            <div className="space-y-2">
              <Label>SEO Keywords</Label>
              <TagInput value={form.seoKeywords} onChange={(tags) => setForm({ ...form, seoKeywords: tags })} />
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="md:col-span-2">
            <CardHeader><CardTitle>Details</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {item.notes ? (
                <div>
                  <Label className="text-muted-foreground text-xs">Notes</Label>
                  <p className="mt-1 whitespace-pre-wrap">{item.notes}</p>
                </div>
              ) : (
                <p className="text-muted-foreground italic">No notes</p>
              )}
              {item.seoKeywords && item.seoKeywords.length > 0 && (
                <div>
                  <Label className="text-muted-foreground text-xs">SEO Keywords</Label>
                  <div className="flex gap-1 mt-1 flex-wrap">
                    {item.seoKeywords.map((kw) => <Badge key={kw} variant="outline">{kw}</Badge>)}
                  </div>
                </div>
              )}
              {/* Create blog post link */}
              {item.type === "blog_post" && !item.relatedBlogPostId && (
                <Button variant="outline" asChild>
                  <Link href={`/blog/new?title=${encodeURIComponent(item.title)}`}>
                    <FileText className="mr-2 h-4 w-4" />Create Blog Post
                  </Link>
                </Button>
              )}
              {item.relatedBlogPostId && (
                <div>
                  <Label className="text-muted-foreground text-xs">Related Blog Post</Label>
                  <Button variant="link" className="p-0 h-auto" asChild>
                    <Link href={`/blog/${item.relatedBlogPostId}/edit`}>View linked blog post →</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Info</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Type</span>
                <Badge variant="outline">{typeEmoji[item.type]} {item.type.replace("_", " ")}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Platform</span>
                <span>{item.platform ?? "—"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Target Date</span>
                <span className="flex items-center gap-1">
                  {item.targetDate ? (<><Calendar className="h-3 w-3" />{format(new Date(item.targetDate), "MMM d, yyyy")}</>) : "—"}
                </span>
              </div>
              {item.publishedAt && (
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Published</span>
                  <span>{format(new Date(item.publishedAt), "MMM d, yyyy")}</span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Created</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />{format(new Date(item.createdAt), "MMM d, yyyy")}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
