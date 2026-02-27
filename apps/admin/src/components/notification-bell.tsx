"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, ExternalLink } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

const PRIORITY_COLORS: Record<string, string> = {
  low: "bg-slate-500",
  medium: "bg-blue-500",
  high: "bg-amber-500",
  critical: "bg-red-500",
};

const TYPE_ICONS: Record<string, string> = {
  news: "📰",
  trend: "📈",
  alert: "🚨",
  task_update: "✅",
  deploy: "🚀",
  pr: "🔀",
  briefing: "📋",
  insight: "💡",
};

export function NotificationBell() {
  const unreadCount = useQuery(api.agent_feed.unreadCount, {});
  const latestFeed = useQuery(api.agent_feed.list, { unreadOnly: true, limit: 5 });
  const markRead = useMutation(api.agent_feed.markRead);

  const handleMarkRead = async (id: string, event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    try {
      await markRead({ id: id as any });
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount !== undefined && unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-96">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifications</span>
          {unreadCount !== undefined && unreadCount > 0 && (
            <Badge variant="secondary" className="ml-2">
              {unreadCount} unread
            </Badge>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {!latestFeed || latestFeed.length === 0 ? (
          <div className="py-8 text-center text-sm text-muted-foreground">
            <Bell className="h-8 w-8 mx-auto mb-2 opacity-30" />
            <p>No new notifications</p>
          </div>
        ) : (
          <>
            <div className="max-h-96 overflow-y-auto">
              {latestFeed.map((item) => (
                <DropdownMenuItem
                  key={item._id}
                  className="flex flex-col items-start gap-2 p-3 cursor-pointer"
                  onClick={(e) => handleMarkRead(item._id, e)}
                >
                  <div className="flex items-start gap-2 w-full">
                    <span className="text-lg shrink-0">{TYPE_ICONS[item.type] || "📌"}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-medium text-sm leading-snug">{item.title}</p>
                        <div
                          className={`h-2 w-2 rounded-full shrink-0 mt-1 ${
                            PRIORITY_COLORS[item.priority] || "bg-gray-500"
                          }`}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                        {item.content}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        {item.source && (
                          <span className="text-xs text-muted-foreground">
                            from {item.source}
                          </span>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                    </div>
                  </div>
                </DropdownMenuItem>
              ))}
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link 
                href="/feed" 
                className="flex items-center justify-center gap-2 cursor-pointer font-medium"
              >
                <span>View all notifications</span>
                <ExternalLink className="h-4 w-4" />
              </Link>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
