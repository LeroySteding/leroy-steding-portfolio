"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Brain, Search, Calendar, User, Tag, Lock, Users, Globe } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";

const categoryConfig = {
  decision: {
    label: "Decision",
    icon: "🎯",
    color: "bg-purple-100 text-purple-700",
  },
  learning: {
    label: "Learning",
    icon: "📚",
    color: "bg-blue-100 text-blue-700",
  },
  context: {
    label: "Context",
    icon: "💡",
    color: "bg-yellow-100 text-yellow-700",
  },
  reference: {
    label: "Reference",
    icon: "🔗",
    color: "bg-green-100 text-green-700",
  },
  insight: {
    label: "Insight",
    icon: "✨",
    color: "bg-pink-100 text-pink-700",
  },
};

const sharingConfig = {
  all: {
    label: "Public",
    icon: Globe,
    color: "text-blue-600",
  },
  team: {
    label: "Team",
    icon: Users,
    color: "text-green-600",
  },
  private: {
    label: "Private",
    icon: Lock,
    color: "text-gray-600",
  },
};

export function AgentMemory() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Get all memories (we'll filter client-side for now)
  const memories = useQuery(api.agentCoordination.getAgentMemories, {
    agentName: selectedAgent || undefined,
    category: selectedCategory as any,
  });

  if (!memories) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Agent Memory
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">Loading memory...</div>
        </CardContent>
      </Card>
    );
  }

  // Client-side filtering
  const filteredMemories = memories.filter((memory) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        memory.content.toLowerCase().includes(query) ||
        memory.agentName.toLowerCase().includes(query) ||
        memory.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }
    return true;
  });

  // Get unique agents and categories for filters
  const agents = Array.from(new Set(memories.map((m) => m.agentName)));
  const categories = Array.from(new Set(memories.map((m) => m.category)));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          Agent Memory
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-1">
          Shared knowledge base across all agents
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search & Filters */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search memories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            <Button
              size="sm"
              variant={selectedAgent === null ? "default" : "outline"}
              onClick={() => setSelectedAgent(null)}
            >
              All Agents
            </Button>
            {agents.map((agent) => (
              <Button
                key={agent}
                size="sm"
                variant={selectedAgent === agent ? "default" : "outline"}
                onClick={() => setSelectedAgent(agent === selectedAgent ? null : agent)}
              >
                {agent}
              </Button>
            ))}
          </div>

          <div className="flex gap-2 flex-wrap">
            <Button
              size="sm"
              variant={selectedCategory === null ? "default" : "outline"}
              onClick={() => setSelectedCategory(null)}
            >
              All Categories
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                size="sm"
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() =>
                  setSelectedCategory(category === selectedCategory ? null : category)
                }
              >
                {categoryConfig[category as keyof typeof categoryConfig].icon}{" "}
                {categoryConfig[category as keyof typeof categoryConfig].label}
              </Button>
            ))}
          </div>
        </div>

        {/* Results */}
        {filteredMemories.length === 0 ? (
          <div className="text-center py-12 text-sm text-muted-foreground">
            <Brain className="h-12 w-12 mx-auto mb-4 opacity-20" />
            <p>
              {searchQuery
                ? "No memories found matching your search"
                : "No memories yet"}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredMemories.map((memory) => {
              const SharingIcon = sharingConfig[memory.sharedWith].icon;
              return (
                <Card key={memory._id} className="bg-muted/50">
                  <CardContent className="pt-4 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">
                          {categoryConfig[memory.category].icon}
                        </span>
                        <Badge
                          variant="outline"
                          className={categoryConfig[memory.category].color}
                        >
                          {categoryConfig[memory.category].label}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {memory.agentName}
                        </Badge>
                      </div>
                      <div
                        className={`flex items-center gap-1 text-xs ${sharingConfig[memory.sharedWith].color}`}
                      >
                        <SharingIcon className="h-3 w-3" />
                        <span>{sharingConfig[memory.sharedWith].label}</span>
                      </div>
                    </div>

                    <p className="text-sm whitespace-pre-wrap">{memory.content}</p>

                    <div className="flex flex-wrap gap-1">
                      {memory.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          <Tag className="h-2 w-2 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>
                        {formatDistanceToNow(memory.createdAt, {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        <div className="text-xs text-muted-foreground text-center pt-4">
          Showing {filteredMemories.length} of {memories.length} memories
        </div>
      </CardContent>
    </Card>
  );
}

// Missing Button import - let me add it
import { Button } from "./ui/button";
