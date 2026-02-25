"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExternalLink, TrendingUp, Newspaper, Briefcase, Lightbulb, Check } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function IntelligencePage() {
  const [filter, setFilter] = useState<string>("all");
  const feed = useQuery(api.intelligence.recentFeed, { limit: 100 });
  const stats = useQuery(api.intelligence.stats);
  const markRead = useMutation(api.intelligence.markRead);
  const createContent = useMutation(api.intelligence.createContentFromFeed);
  
  if (!feed) {
    return (
      <div className="container py-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4" />
          <div className="h-32 bg-muted rounded" />
          <div className="h-32 bg-muted rounded" />
        </div>
      </div>
    );
  }
  
  const filtered = filter === "all" 
    ? feed 
    : feed.filter((item: any) => item.type === filter);
  
  const handleCreateContent = async (feedId: Id<"agent_feed">) => {
    try {
      await createContent({ feedId });
      // TODO: Show success toast
    } catch (error) {
      console.error("Failed to create content:", error);
    }
  };
  
  return (
    <div className="container py-6 space-y-6">
      {/* Header */}
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Intelligence Feed</h1>
        <p className="text-muted-foreground mt-1">
          {stats?.totalFeedItems || 0} items discovered • {stats?.unreadFeed || 0} unread
        </p>
      </header>
      
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard 
          label="Trends This Week"
          value={stats?.trends || 0}
          icon={<TrendingUp className="h-4 w-4" />}
        />
        <StatCard 
          label="News Items"
          value={stats?.news || 0}
          icon={<Newspaper className="h-4 w-4" />}
        />
        <StatCard 
          label="Job Opportunities"
          value={stats?.jobs || 0}
          icon={<Briefcase className="h-4 w-4" />}
        />
        <StatCard 
          label="Content Ideas"
          value={stats?.contentIdeas || 0}
          icon={<Lightbulb className="h-4 w-4" />}
        />
      </div>
      
      {/* Filters */}
      <Tabs defaultValue="all" onValueChange={setFilter}>
        <TabsList>
          <TabsTrigger value="all">All ({feed.length})</TabsTrigger>
          <TabsTrigger value="trend">
            Trends ({feed.filter((f: any) => f.type === "trend").length})
          </TabsTrigger>
          <TabsTrigger value="news">
            News ({feed.filter((f: any) => f.type === "news").length})
          </TabsTrigger>
          <TabsTrigger value="insight">
            Insights ({feed.filter((f: any) => f.type === "insight").length})
          </TabsTrigger>
          <TabsTrigger value="briefing">
            Briefings ({feed.filter((f: any) => f.type === "briefing").length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value={filter} className="space-y-4 mt-6">
          {filtered.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No items found</p>
              </CardContent>
            </Card>
          ) : (
            filtered.map((item: any) => (
              <FeedCard
                key={item._id}
                item={item}
                onMarkRead={() => markRead({ id: item._id })}
                onCreateContent={() => handleCreateContent(item._id)}
              />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function StatCard({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardDescription className="text-sm font-medium">
          {label}
        </CardDescription>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}

function FeedCard({ 
  item, 
  onMarkRead, 
  onCreateContent 
}: { 
  item: any;
  onMarkRead: () => void;
  onCreateContent: () => void;
}) {
  const priorityColors = {
    low: "bg-slate-100 text-slate-800",
    medium: "bg-blue-100 text-blue-800",
    high: "bg-orange-100 text-orange-800",
    critical: "bg-red-100 text-red-800",
  };
  
  const typeIcons = {
    trend: <TrendingUp className="h-4 w-4" />,
    news: <Newspaper className="h-4 w-4" />,
    insight: <Lightbulb className="h-4 w-4" />,
    briefing: <Briefcase className="h-4 w-4" />,
  };
  
  return (
    <Card className={item.read ? "opacity-60" : ""}>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1 flex-1">
            <div className="flex items-center gap-2">
              {typeIcons[item.type as keyof typeof typeIcons]}
              <CardTitle className="text-lg">{item.title}</CardTitle>
            </div>
            <CardDescription className="flex items-center gap-2">
              <span>{item.source || "Unknown source"}</span>
              <span>•</span>
              <span>{formatDistanceToNow(item.createdAt, { addSuffix: true })}</span>
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Badge 
              className={priorityColors[item.priority as keyof typeof priorityColors]}
              variant="secondary"
            >
              {item.priority}
            </Badge>
            {!item.read && (
              <Badge variant="default">New</Badge>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <p className="text-sm text-muted-foreground mb-3">
          {item.content}
        </p>
        
        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {item.tags.map((tag: string) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="gap-2">
        <Button 
          size="sm"
          onClick={onCreateContent}
          disabled={item.read}
        >
          <Lightbulb className="h-4 w-4 mr-2" />
          Create Content
        </Button>
        
        {item.metadata?.url && (
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => window.open(item.metadata.url, '_blank')}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            View Source
          </Button>
        )}
        
        {!item.read && (
          <Button 
            size="sm" 
            variant="ghost"
            onClick={onMarkRead}
          >
            <Check className="h-4 w-4 mr-2" />
            Mark Read
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
