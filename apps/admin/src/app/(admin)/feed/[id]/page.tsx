"use client";

import { use, useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ConfirmDialog } from "@/components/confirm-dialog";
import {
  ArrowLeft,
  Check,
  Trash2,
  Calendar,
  Tag,
  Info,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";

const typeEmojis: Record<string, string> = {
  news: "📰",
  trend: "📈",
  alert: "🚨",
  task_update: "✅",
  deploy: "🚀",
  pr: "🔀",
  briefing: "📋",
  insight: "💡",
};

const priorityColors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  low: "secondary",
  medium: "outline",
  high: "default",
  critical: "destructive",
};

export default function FeedItemViewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { toast } = useToast();
  const item = useQuery(api.agent_feed.get, { id: id as any });
  const markRead = useMutation(api.agent_feed.markRead);
  const removeItem = useMutation(api.agent_feed.remove);
  const [showDelete, setShowDelete] = useState(false);

  if (item === undefined) {
    return <div>Loading...</div>;
  }

  if (item === null) {
    return (
      <div className="space-y-6 max-w-4xl">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/feed">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Feed Item Not Found</h1>
        </div>
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            This feed item does not exist or has been deleted.
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleMarkRead = async () => {
    try {
      await markRead({ id: item._id });
      toast({ title: "Marked as read" });
    } catch {
      toast({ title: "Error", description: "Failed to mark as read", variant: "destructive" });
    }
  };

  const handleDelete = async () => {
    try {
      await removeItem({ id: item._id });
      toast({ title: "Deleted" });
      router.push("/feed");
    } catch {
      toast({ title: "Error", description: "Failed to delete", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/feed">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <span className="text-2xl">{typeEmojis[item.type] || "📄"}</span>
          <h1 className="text-3xl font-bold">{item.title}</h1>
        </div>
        <div className="flex items-center gap-2">
          {!item.read && (
            <Button variant="outline" onClick={handleMarkRead}>
              <Check className="h-4 w-4 mr-2" />
              Mark Read
            </Button>
          )}
          <Button variant="destructive" onClick={() => setShowDelete(true)}>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {/* Metadata */}
      <Card>
        <CardHeader>
          <CardTitle>Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Type:</span>
              <Badge variant="outline">
                {typeEmojis[item.type]} {item.type}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Priority:</span>
              <Badge variant={priorityColors[item.priority] || "outline"}>
                {item.priority}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Status:</span>
              <Badge variant={item.read ? "secondary" : "default"}>
                {item.read ? "Read" : "Unread"}
              </Badge>
            </div>
            {item.source && (
              <div className="flex items-center gap-2">
                <Info className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Source:</span>
                <span className="font-medium">{item.source}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Created:</span>
              <span className="font-medium">
                {format(new Date(item.createdAt), "MMM d, yyyy HH:mm")}
              </span>
            </div>
          </div>
          {item.tags && item.tags.length > 0 && (
            <div className="flex items-center gap-2 mt-4">
              <Tag className="h-4 w-4 text-muted-foreground" />
              <div className="flex gap-1 flex-wrap">
                {item.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Content */}
      <Card>
        <CardHeader>
          <CardTitle>Content</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose dark:prose-invert max-w-none whitespace-pre-wrap">
            {item.content}
          </div>
        </CardContent>
      </Card>

      {/* Metadata JSON */}
      {item.metadata && (
        <Card>
          <CardHeader>
            <CardTitle>Metadata</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-xs bg-muted p-4 rounded-lg overflow-auto max-h-96">
              {JSON.stringify(item.metadata, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}

      <ConfirmDialog
        open={showDelete}
        onOpenChange={setShowDelete}
        title="Delete Feed Item"
        description="Are you sure you want to delete this feed item? This action cannot be undone."
        onConfirm={handleDelete}
      />
    </div>
  );
}
