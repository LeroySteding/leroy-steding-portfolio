"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { MessageSquare, Clock, ArrowRight } from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";

const agentIcons: Record<string, string> = {
  orchestrator: "🎯",
  architect: "🏗️",
  coder: "⚡",
  researcher: "🔍",
  business: "💼",
  "data-handler": "🕷️",
  critic: "🛡️",
  compliance: "⚖️",
  system: "🤖",
};

const agentColors: Record<string, string> = {
  orchestrator: "bg-purple-100 text-purple-800",
  architect: "bg-blue-100 text-blue-800",
  coder: "bg-yellow-100 text-yellow-800",
  researcher: "bg-green-100 text-green-800",
  business: "bg-pink-100 text-pink-800",
  "data-handler": "bg-orange-100 text-orange-800",
  critic: "bg-red-100 text-red-800",
  compliance: "bg-indigo-100 text-indigo-800",
  system: "bg-gray-100 text-gray-800",
};

export function AgentMessages() {
  const [filterAgent, setFilterAgent] = useState<string>("all");
  const [timeRange, setTimeRange] = useState<"1h" | "24h" | "7d" | "all">("24h");

  // Get agent feed (acts as message log)
  const feedItems = useQuery(api.agent_feed.list, { limit: 100 });

  if (!feedItems) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Agent Messages
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">Loading messages...</div>
        </CardContent>
      </Card>
    );
  }

  // Filter by time range
  const now = Date.now();
  const timeRangeMs = {
    "1h": 60 * 60 * 1000,
    "24h": 24 * 60 * 60 * 1000,
    "7d": 7 * 24 * 60 * 60 * 1000,
    all: Infinity,
  };

  let filtered = feedItems.filter(
    (item) => now - item.createdAt < timeRangeMs[timeRange]
  );

  // Filter by agent (check source or tags)
  if (filterAgent !== "all") {
    filtered = filtered.filter(
      (item) =>
        item.source === filterAgent || item.tags.includes(filterAgent)
    );
  }

  // Get unique agents (filter out undefined)
  const uniqueAgents: string[] = Array.from(
    new Set(feedItems.map((item) => item.source).filter((s): s is string => !!s))
  );

  // Group by day
  const groupedByDay: Record<string, typeof filtered> = {};
  filtered.forEach((item) => {
    const day = format(new Date(item.createdAt), "yyyy-MM-dd");
    if (!groupedByDay[day]) {
      groupedByDay[day] = [];
    }
    groupedByDay[day].push(item);
  });

  const sortedDays = Object.keys(groupedByDay).sort().reverse();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Agent Messages
          </CardTitle>
          <div className="flex gap-2">
            <Select value={timeRange} onValueChange={(v) => setTimeRange(v as typeof timeRange)}>
              <SelectTrigger className="w-[110px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1h">Last hour</SelectItem>
                <SelectItem value="24h">Last 24h</SelectItem>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="all">All time</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterAgent} onValueChange={setFilterAgent}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Agents</SelectItem>
                {uniqueAgents.map((agent) => (
                  <SelectItem key={agent} value={agent}>
                    {agentIcons[agent] || "🤖"} {agent}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {filtered.length === 0 ? (
          <div className="text-center py-8 text-sm text-muted-foreground">
            No messages in this time range
          </div>
        ) : (
          <div className="space-y-6 max-h-[700px] overflow-y-auto">
            {sortedDays.map((day) => {
              const dayMessages = groupedByDay[day];
              const isToday = day === format(new Date(), "yyyy-MM-dd");
              const isYesterday =
                day === format(new Date(Date.now() - 86400000), "yyyy-MM-dd");

              return (
                <div key={day} className="space-y-2">
                  {/* Day header */}
                  <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground sticky top-0 bg-background py-1 z-10">
                    <Clock className="h-3 w-3" />
                    {isToday
                      ? "Today"
                      : isYesterday
                      ? "Yesterday"
                      : format(new Date(day), "EEEE, MMM d, yyyy")}
                    <Badge variant="outline" className="ml-auto">
                      {dayMessages.length}
                    </Badge>
                  </div>

                  {/* Messages */}
                  <div className="space-y-2">
                    {dayMessages.map((message) => {
                      const isInterAgent = message.tags.some((tag) =>
                        uniqueAgents.includes(tag)
                      );

                      return (
                        <div
                          key={message._id}
                          className={`flex gap-3 p-3 rounded-lg border transition-colors ${
                            message.read
                              ? "bg-muted/30"
                              : "bg-muted/70 border-l-2 border-primary"
                          }`}
                        >
                          {/* Agent icon */}
                          <div className="flex-shrink-0">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center text-lg ${
                                message.source ? (agentColors[message.source] || "bg-gray-100") : "bg-gray-100"
                              }`}
                            >
                              {message.source ? (agentIcons[message.source] || "🤖") : "🤖"}
                            </div>
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0 space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs font-medium">
                                {message.source || "system"}
                              </span>
                              {isInterAgent && (
                                <>
                                  <ArrowRight className="h-3 w-3 text-muted-foreground" />
                                  <div className="flex gap-1">
                                    {message.tags
                                      .filter((tag) => uniqueAgents.includes(tag))
                                      .map((tag) => (
                                        <span
                                          key={tag}
                                          className="text-xs px-1.5 py-0.5 bg-muted rounded"
                                        >
                                          {agentIcons[tag] || "🤖"}
                                        </span>
                                      ))}
                                  </div>
                                </>
                              )}
                              <Badge
                                variant="outline"
                                className="ml-auto text-xs"
                              >
                                {message.type}
                              </Badge>
                            </div>

                            <h4 className="text-sm font-medium">{message.title}</h4>
                            <p className="text-xs text-muted-foreground line-clamp-2">
                              {message.content}
                            </p>

                            <span className="text-xs text-muted-foreground">
                              {format(new Date(message.createdAt), "HH:mm:ss")} •{" "}
                              {formatDistanceToNow(message.createdAt, {
                                addSuffix: true,
                              })}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
