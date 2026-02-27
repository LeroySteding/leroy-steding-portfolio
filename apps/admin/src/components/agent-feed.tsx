"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Rss, ExternalLink } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

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

export function AgentFeed() {
  const feed = useQuery(api.agent_feed.list, { 
    limit: 10,
    unreadOnly: false,
  });

  const unreadCount = feed?.filter(item => !item.read).length || 0;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Rss className="h-5 w-5" />
          Activity Feed
          {unreadCount > 0 && (
            <Badge variant="destructive" className="ml-2">
              {unreadCount} new
            </Badge>
          )}
        </CardTitle>
        <Button size="sm" variant="outline" asChild>
          <Link href="/feed">
            <ExternalLink className="h-4 w-4 mr-2" />
            View All
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {!feed || feed.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Rss className="h-12 w-12 mx-auto mb-3 opacity-20" />
            <p className="font-medium">No activity yet</p>
            <p className="text-sm">Agent updates will appear here</p>
          </div>
        ) : (
          <div className="space-y-3">
            {feed.map((item) => (
              <Link
                key={item._id}
                href={`/feed/${item._id}`}
                className="block p-3 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <span className="text-xl">{typeEmojis[item.type] || "📄"}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium truncate">{item.title}</p>
                      {!item.read && (
                        <div className="h-2 w-2 rounded-full bg-blue-500" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                      {item.content}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      {item.source && (
                        <Badge variant="outline" className="text-xs">
                          {item.source}
                        </Badge>
                      )}
                      <Badge variant={priorityColors[item.priority]} className="text-xs">
                        {item.priority}
                      </Badge>
                      <span>
                        {formatDistanceToNow(item.createdAt, { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
