"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Brain } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const categoryEmojis: Record<string, string> = {
  decision: "⚖️", learning: "📚", context: "🔗", reference: "📎", insight: "💡",
};

const agentEmojis: Record<string, string> = {
  orchestrator: "🎯", architect: "🏗️", coder: "⚡", researcher: "🔍",
  business: "💼", "data-scraper": "🕷️", "qa-critic": "🛡️",
};

export function AgentMemory() {
  const memories = useQuery(api.agentCoordination.getAgentMemories, { limit: 30 });

  if (!memories) return <Card><CardContent className="py-8 text-center text-muted-foreground">Loading memories...</CardContent></Card>;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          Agent Memory ({memories.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 max-h-[500px] overflow-y-auto">
        {memories.length === 0 && (
          <p className="text-muted-foreground text-center py-4">No memories stored yet</p>
        )}
        {memories.map((mem: { _id: string; agentName: string; category: string; content: string; tags: string[]; sharedWith: string; createdAt: number }) => (
          <div key={mem._id} className="p-2 rounded-lg hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-2 flex-wrap">
              <span>{categoryEmojis[mem.category] || "📝"}</span>
              <span className="text-xs bg-muted px-1.5 py-0.5 rounded">
                {agentEmojis[mem.agentName] || "🤖"} {mem.agentName}
              </span>
              <Badge variant="outline" className="text-xs">{mem.category}</Badge>
              <Badge variant="secondary" className="text-xs">{mem.sharedWith}</Badge>
            </div>
            <p className="text-sm mt-1 line-clamp-3">{mem.content}</p>
            <div className="flex items-center gap-2 mt-1">
              {mem.tags.map((tag: string) => (
                <span key={tag} className="text-xs text-muted-foreground">#{tag}</span>
              ))}
              <span className="text-xs text-muted-foreground ml-auto">
                {formatDistanceToNow(mem.createdAt, { addSuffix: true })}
              </span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
