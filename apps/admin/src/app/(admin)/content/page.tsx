"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import type { Id } from "../../../../../convex/_generated/dataModel";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, FileText, Video, MessageSquare, Lightbulb, Check, Archive, Grid3x3, Calendar as CalendarIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import ContentCalendar from "@/components/content-calendar";

type ContentStatus = "idea" | "outline" | "drafting" | "review" | "scheduled" | "published";
type ContentType = "blog_post" | "social_post" | "newsletter" | "video" | "podcast" | "case_study";

const STATUS_OPTIONS: { value: ContentStatus; label: string; color: string }[] = [
  { value: "idea", label: "Idea", color: "bg-slate-100 text-slate-800" },
  { value: "outline", label: "Outline", color: "bg-blue-100 text-blue-800" },
  { value: "drafting", label: "Drafting", color: "bg-indigo-100 text-indigo-800" },
  { value: "review", label: "Review", color: "bg-purple-100 text-purple-800" },
  { value: "scheduled", label: "Scheduled", color: "bg-orange-100 text-orange-800" },
  { value: "published", label: "Published", color: "bg-green-100 text-green-800" },
];

const TYPE_OPTIONS: { value: ContentType; label: string; icon: any }[] = [
  { value: "blog_post", label: "Blog Post", icon: FileText },
  { value: "social_post", label: "Social Post", icon: MessageSquare },
  { value: "newsletter", label: "Newsletter", icon: FileText },
  { value: "video", label: "Video", icon: Video },
  { value: "podcast", label: "Podcast", icon: Video },
  { value: "case_study", label: "Case Study", icon: FileText },
];

export default function ContentPage() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddingContent, setIsAddingContent] = useState(false);
  const [viewType, setViewType] = useState<"grid" | "calendar">("grid");
  const [selectedContent, setSelectedContent] = useState<any>(null);
  const [prefilledDate, setPrefilledDate] = useState<Date | null>(null);

  const content = useQuery(api.contentCalendar.list);
  const stats = useQuery(api.contentCalendar.stats);
  const updateStatus = useMutation(api.contentCalendar.updateStatus);
  const createContent = useMutation(api.contentCalendar.create);

  if (!content) {
    return (
      <div className="container py-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4" />
          <div className="h-32 bg-muted rounded" />
          <div className="grid grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-48 bg-muted rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const filtered = content.filter((item: any) => {
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    const matchesType = typeFilter === "all" || item.type === typeFilter;
    const matchesSearch =
      !searchQuery ||
      item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.notes?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.seoKeywords?.some((kw: string) => kw.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesType && matchesSearch;
  });

  const handleCreateContent = async (data: any) => {
    try {
      await createContent(data);
      setIsAddingContent(false);
    } catch (error) {
      console.error("Failed to create content:", error);
    }
  };

  const handleStatusChange = async (id: Id<"content_calendar">, status: ContentStatus) => {
    try {
      await updateStatus({ id, status });
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const handleAddContentForDate = (date: Date) => {
    setPrefilledDate(date);
    setIsAddingContent(true);
  };

  const handleContentClick = (content: any) => {
    setSelectedContent(content);
  };

  return (
    <div className="container py-6 space-y-6">
      {/* Header */}
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Content Calendar</h1>
          <p className="text-muted-foreground mt-1">
            {stats?.ideas || 0} ideas • {stats?.inProgress || 0} in progress • {stats?.publishedThisWeek || 0} published this week
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* View Toggle */}
          <div className="flex items-center gap-1 border rounded-lg p-1">
            <Button
              variant={viewType === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewType("grid")}
            >
              <Grid3x3 className="h-4 w-4 mr-2" />
              Grid
            </Button>
            <Button
              variant={viewType === "calendar" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewType("calendar")}
            >
              <CalendarIcon className="h-4 w-4 mr-2" />
              Calendar
            </Button>
          </div>
          <Dialog open={isAddingContent} onOpenChange={(open) => {
            setIsAddingContent(open);
            if (!open) setPrefilledDate(null);
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Content
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Content</DialogTitle>
                <DialogDescription>Add a new content idea or piece</DialogDescription>
              </DialogHeader>
              <AddContentForm 
                onSubmit={handleCreateContent} 
                onCancel={() => {
                  setIsAddingContent(false);
                  setPrefilledDate(null);
                }}
                prefilledDate={prefilledDate}
              />
            </DialogContent>
          </Dialog>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Ideas" value={stats?.ideas || 0} icon={<Lightbulb className="h-4 w-4" />} />
        <StatCard label="In Progress" value={stats?.inProgress || 0} icon={<FileText className="h-4 w-4" />} />
        <StatCard label="Published This Week" value={stats?.publishedThisWeek || 0} icon={<Check className="h-4 w-4" />} />
        <StatCard label="Total Published" value={stats?.totalPublished || 0} icon={<Archive className="h-4 w-4" />} />
      </div>

      {/* Conditional View: Grid or Calendar */}
      {viewType === "grid" ? (
        <>
          {/* Filters & Search */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              placeholder="Search by title, keywords, or notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {STATUS_OPTIONS.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {TYPE_OPTIONS.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Content Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filtered.length === 0 ? (
              <Card className="col-span-full">
                <CardContent className="py-12 text-center">
                  <Lightbulb className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">No content found. Create your first piece!</p>
                </CardContent>
              </Card>
            ) : (
              filtered.map((item: any) => (
                <ContentCard key={item._id} content={item} onStatusChange={handleStatusChange} />
              ))
            )}
          </div>
        </>
      ) : (
        <ContentCalendar
          content={content}
          onContentClick={handleContentClick}
          onAddContent={handleAddContentForDate}
        />
      )}

      {/* Content Detail Dialog */}
      {selectedContent && (
        <ContentDetailDialog
          content={selectedContent}
          isOpen={!!selectedContent}
          onClose={() => setSelectedContent(null)}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
}

function StatCard({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardDescription className="text-sm font-medium">{label}</CardDescription>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}

function ContentCard({
  content,
  onStatusChange,
}: {
  content: any;
  onStatusChange: (id: Id<"content_calendar">, status: ContentStatus) => void;
}) {
  const statusConfig = STATUS_OPTIONS.find((s) => s.value === content.status);
  const typeConfig = TYPE_OPTIONS.find((t) => t.value === content.type);
  const Icon = typeConfig?.icon || FileText;

  const getNextAction = () => {
    switch (content.status) {
      case "idea":
        return { label: "Create Outline", nextStatus: "outline" as ContentStatus };
      case "outline":
        return { label: "Start Drafting", nextStatus: "drafting" as ContentStatus };
      case "drafting":
        return { label: "Ready for Review", nextStatus: "review" as ContentStatus };
      case "review":
        return { label: "Schedule", nextStatus: "scheduled" as ContentStatus };
      case "scheduled":
        return { label: "Publish Now", nextStatus: "published" as ContentStatus };
      default:
        return null;
    }
  };

  const nextAction = getNextAction();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1 flex-1">
            <div className="flex items-center gap-2">
              <Icon className="h-4 w-4" />
              <CardTitle className="text-lg line-clamp-2">{content.title}</CardTitle>
            </div>
            <CardDescription className="flex items-center gap-2">
              <span>{typeConfig?.label || "Unknown type"}</span>
              {content.platform && (
                <>
                  <span>•</span>
                  <span>{content.platform}</span>
                </>
              )}
            </CardDescription>
          </div>
          <Badge className={statusConfig?.color} variant="secondary">
            {statusConfig?.label}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {content.notes && (
          <p className="text-sm text-muted-foreground line-clamp-3">{content.notes}</p>
        )}

        {content.seoKeywords && content.seoKeywords.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {content.seoKeywords.slice(0, 5).map((keyword: string) => (
              <Badge key={keyword} variant="outline" className="text-xs">
                {keyword}
              </Badge>
            ))}
          </div>
        )}

        <p className="text-xs text-muted-foreground">
          {formatDistanceToNow(content.createdAt, { addSuffix: true })}
        </p>
      </CardContent>

      {nextAction && (
        <CardFooter>
          <Button
            size="sm"
            onClick={() => onStatusChange(content._id, nextAction.nextStatus)}
            className="w-full"
          >
            {nextAction.label}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}

function AddContentForm({ 
  onSubmit, 
  onCancel,
  prefilledDate 
}: { 
  onSubmit: (data: any) => void; 
  onCancel: () => void;
  prefilledDate?: Date | null;
}) {
  const [formData, setFormData] = useState({
    title: "",
    type: "blog_post" as ContentType,
    status: "idea" as ContentStatus,
    platform: "",
    targetDate: prefilledDate ? prefilledDate.toISOString().split("T")[0] : "",
    notes: "",
    seoKeywords: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      targetDate: formData.targetDate ? new Date(formData.targetDate).getTime() : undefined,
      seoKeywords: formData.seoKeywords.split(",").map((k) => k.trim()).filter(Boolean),
      createdAt: Date.now(),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="type">Type *</Label>
          <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value as ContentType })}>
            <SelectTrigger id="type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TYPE_OPTIONS.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="status">Status</Label>
          <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value as ContentStatus })}>
            <SelectTrigger id="status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.filter((s) => s.value !== "published").map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="platform">Platform</Label>
          <Input
            id="platform"
            value={formData.platform}
            onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
            placeholder="LinkedIn, Blog, YouTube"
          />
        </div>
        <div>
          <Label htmlFor="targetDate">Target Date</Label>
          <Input
            id="targetDate"
            type="date"
            value={formData.targetDate}
            onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="seoKeywords">SEO Keywords (comma-separated)</Label>
        <Input
          id="seoKeywords"
          value={formData.seoKeywords}
          onChange={(e) => setFormData({ ...formData, seoKeywords: e.target.value })}
          placeholder="react, nextjs, typescript"
        />
      </div>

      <div>
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          rows={4}
          placeholder="Content outline, ideas, research notes..."
        />
      </div>

      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Create Content</Button>
      </div>
    </form>
  );
}

function ContentDetailDialog({
  content,
  isOpen,
  onClose,
  onStatusChange,
}: {
  content: any;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange: (id: Id<"content_calendar">, status: ContentStatus) => void;
}) {
  const [status, setStatus] = useState(content.status);
  const statusConfig = STATUS_OPTIONS.find((s) => s.value === content.status);
  const typeConfig = TYPE_OPTIONS.find((t) => t.value === content.type);

  const handleStatusChange = async (newStatus: ContentStatus) => {
    try {
      await onStatusChange(content._id, newStatus);
      setStatus(newStatus);
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{content.title}</DialogTitle>
          <DialogDescription>
            {typeConfig?.label} {content.platform && `• ${content.platform}`}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {/* Status */}
          <div>
            <Label className="text-sm font-medium">Status</Label>
            <Select value={status} onValueChange={handleStatusChange}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-xs text-muted-foreground">Type</Label>
              <p className="text-sm mt-1">{typeConfig?.label}</p>
            </div>
            {content.platform && (
              <div>
                <Label className="text-xs text-muted-foreground">Platform</Label>
                <p className="text-sm mt-1">{content.platform}</p>
              </div>
            )}
            {content.targetDate && (
              <div>
                <Label className="text-xs text-muted-foreground">Target Date</Label>
                <p className="text-sm mt-1">
                  {new Date(content.targetDate).toLocaleDateString()}
                </p>
              </div>
            )}
            {content.publishedAt && (
              <div>
                <Label className="text-xs text-muted-foreground">Published</Label>
                <p className="text-sm mt-1">
                  {new Date(content.publishedAt).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>

          {/* Notes */}
          {content.notes && (
            <div>
              <Label className="text-sm font-medium">Notes</Label>
              <p className="text-sm mt-1 whitespace-pre-wrap">{content.notes}</p>
            </div>
          )}

          {/* SEO Keywords */}
          {content.seoKeywords && content.seoKeywords.length > 0 && (
            <div>
              <Label className="text-sm font-medium">SEO Keywords</Label>
              <div className="flex flex-wrap gap-2 mt-1">
                {content.seoKeywords.map((keyword: string) => (
                  <Badge key={keyword} variant="outline">
                    {keyword}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Related Blog Post */}
          {content.relatedBlogPostId && (
            <div>
              <Label className="text-sm font-medium">Related Blog Post</Label>
              <p className="text-sm mt-1 text-muted-foreground">
                ID: {content.relatedBlogPostId}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-4 border-t">
            <Button onClick={onClose} className="flex-1">
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
