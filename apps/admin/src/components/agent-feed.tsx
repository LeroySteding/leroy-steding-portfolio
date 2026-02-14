"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { 
  Activity, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  Rocket, 
  GitPullRequest,
  FileText,
  Lightbulb
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const feedIcons = {
  news: <FileText className="h-4 w-4" />,
  trend: <TrendingUp className="h-4 w-4" />,
  alert: <AlertTriangle className="h-4 w-4" />,
  task_update: <CheckCircle2 className="h-4 w-4" />,
  deploy: <Rocket className="h-4 w-4" />,
  pr: <GitPullRequest className="h-4 w-4" />,
  briefing: <FileText className="h-4 w-4" />,
  insight: <Lightbulb className="h-4 w-4" />,
};

const feedColors = {
  news: "bg-blue-100 text-blue-700 border-blue-300",
  trend: "bg-purple-100 text-purple-700 border-purple-300",
  alert: "bg-red-100 text-red-700 border-red-300",
  task_update: "bg-green-100 text-green-700 border-green-300",
  deploy: "bg-orange-100 text-orange-700 border-orange-300",
  pr: "bg-indigo-100 text-indigo-700 border-indigo-300",
  briefing: "bg-cyan-100 text-cyan-700 border-cyan-300",
  insight: "bg-yellow-100 text-yellow-700 border-yellow-300",
};

const priorityColors = {
  low: "text-gray-500",
  medium: "text-yellow-600",
  high: "text-orange-600",
  critical: "text-red-600",
};

const agentIcons: Record<string, string> = {
  orchestrator: "🎯",
  architect: "🏗️",
  coder: "💻",
  researcher: "🔍",
  business: "📈",
  "data-handler": "🕷️",
  critic: "⚠️",
  system: "⚙️",
};

export function AgentFeed() {
  const feed = useQuery(api.agentCoordination.getAgentFeed, { limit: 50 });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Activity Feed
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!feed ? (
          <div className="text-sm text-muted-foreground">Loading...</div>
        ) : feed.length > 0 ? (
          <ScrollArea className="h-[600px] pr-4">
            <div className="space-y-3">
              {feed.map((item, idx) => (
                <div key={item._id}>
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 mt-1">
                      <div
                        className={`p-2 rounded-lg border ${
                          feedColors[item.type]
                        }`}
                      >
                        {feedIcons[item.type]}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className="font-medium text-sm">{item.title}</h4>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {formatDistanceToNow(item.createdAt, { addSuffix: true })}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {item.content}
                      </p>
                      <div className="flex items-center gap-2 flex-wrap">
                        {item.source && (
                          <Badge variant="secondary" className="text-xs">
                            {agentIcons[item.source] || "🤖"} {item.source}
                          </Badge>
                        )}
                        <Badge
                          variant="outline"
                          className={`text-xs ${feedColors[item.type]}`}
                        >
                          {item.type.replace("_", " ")}
                        </Badge>
                        <span className={`text-xs ${priorityColors[item.priority]}`}>
                          {item.priority}
                        </span>
                        {item.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {item.tags.length > 3 && (
                          <span className="text-xs text-muted-foreground">
                            +{item.tags.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  {idx < feed.length - 1 && <Separator className="my-3" />}
                </div>
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="text-center py-8 text-sm text-muted-foreground">
            No activity yet
          </div>
        )}
      </CardContent>
    </Card>
  );
}
