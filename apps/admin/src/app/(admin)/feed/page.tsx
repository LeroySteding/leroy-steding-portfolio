"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../../convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Rss, Check, CheckCheck, Trash2 } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { useState } from "react";

const feedTypes = ["all", "news", "trend", "alert", "task_update", "deploy", "pr", "briefing", "insight"] as const;
const priorities = ["all", "low", "medium", "high", "critical"] as const;
const feedTypeIcons: Record<string, string> = {
  news: "📰", trend: "📈", alert: "🚨", task_update: "✅",
  deploy: "🚀", pr: "🔀", briefing: "📋", insight: "💡",
};

export default function FeedPage() {
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");

  const feedItems = useQuery(api.agent_feed.list, {
    ...(typeFilter !== "all" ? { type: typeFilter as any } : {}),
    ...(priorityFilter !== "all" ? { priority: priorityFilter as any } : {}),
  });
  const markRead = useMutation(api.agent_feed.markRead);
  const markAllRead = useMutation(api.agent_feed.markAllRead);
  const removeFeed = useMutation(api.agent_feed.remove);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold flex items-center gap-2"><Rss className="h-8 w-8" /> Agent Feed</h1>
        <Button variant="outline" onClick={() => markAllRead()}><CheckCheck className="mr-2 h-4 w-4" />Mark All Read</Button>
      </div>

      <div className="flex gap-4">
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-48"><SelectValue placeholder="Filter by type" /></SelectTrigger>
          <SelectContent>
            {feedTypes.map((t) => <SelectItem key={t} value={t}>{t === "all" ? "All Types" : t.replace("_", " ")}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-48"><SelectValue placeholder="Filter by priority" /></SelectTrigger>
          <SelectContent>
            {priorities.map((p) => <SelectItem key={p} value={p}>{p === "all" ? "All Priorities" : p}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        {!feedItems?.length ? (
          <Card><CardContent className="py-8 text-center text-muted-foreground">No feed items found.</CardContent></Card>
        ) : (
          feedItems.map((item) => (
            <Card key={item._id} className={!item.read ? "border-l-4 border-l-primary" : "opacity-75"}>
              <CardContent className="flex gap-4 py-4">
                <span className="text-2xl">{feedTypeIcons[item.type] ?? "📌"}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Link href={`/feed/${item._id}`} className="font-semibold hover:underline">{item.title}</Link>
                    <Badge variant="outline" className="text-xs">{item.type.replace("_", " ")}</Badge>
                    <Badge variant={item.priority === "critical" || item.priority === "high" ? "destructive" : "secondary"} className="text-xs">{item.priority}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{item.content}</p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{format(new Date(item.createdAt), "MMM d, yyyy HH:mm")}</span>
                    {item.source && <span>via {item.source}</span>}
                    {item.tags.length > 0 && item.tags.map((t) => <Badge key={t} variant="outline" className="text-xs">{t}</Badge>)}
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  {!item.read && (
                    <Button size="sm" variant="ghost" onClick={() => markRead({ id: item._id })}><Check className="h-4 w-4" /></Button>
                  )}
                  <Button size="sm" variant="ghost" onClick={() => removeFeed({ id: item._id })}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
