"use client";

import { useState, useMemo } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../../../convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Activity, RefreshCw, AlertCircle, CheckCircle2, Clock, 
  TrendingUp, TrendingDown, ExternalLink, Settings, Play,
  Database, Zap, Globe, FileText, MessageSquare, Hash
} from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow, format, subDays } from "date-fns";

interface ScraperStatus {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  status: "healthy" | "warning" | "error" | "paused";
  enabled: boolean;
  schedule: string;
  lastRun?: number;
  nextRun?: number;
  stats: {
    jobs24h: number;
    jobs7d: number;
    jobs30d: number;
    matchRate: number;
    avgMatchScore: number;
    successRate: number;
    lastSuccessfulRun?: number;
  };
  health: {
    uptime: number;
    errorRate: number;
    avgDuration: number;
    lastError?: string;
  };
  detailUrl: string;
}

export default function JobSourcesPage() {
  const [refreshing, setRefreshing] = useState<string | null>(null);
  
  // Fetch scraper statistics
  const prolinkerStats = useQuery(api.prolinker_scraper.getStats);
  const freepStats = useQuery(api.freep_scraper.getStats);
  const scrapedJobs = useQuery(api.scraped_jobs.list, { limit: 1000 });
  
  // Mock trigger scraper mutation (to be implemented)
  const triggerScraper = useMutation(api.cron_tasks.manualTrigger);
  
  // Calculate stats for each scraper
  const scrapers: ScraperStatus[] = useMemo(() => {
    if (!scrapedJobs) return [];
    
    const now = Date.now();
    const day = 24 * 60 * 60 * 1000;
    
    const calculateScraperStats = (source: string) => {
      const sourceJobs = scrapedJobs.filter(j => j.source === source);
      const jobs24h = sourceJobs.filter(j => j.scrapedAt >= now - day).length;
      const jobs7d = sourceJobs.filter(j => j.scrapedAt >= now - 7 * day).length;
      const jobs30d = sourceJobs.filter(j => j.scrapedAt >= now - 30 * day).length;
      
      const jobsWithMatch = sourceJobs.filter(j => j.matchScore !== undefined);
      const avgMatchScore = jobsWithMatch.length > 0
        ? jobsWithMatch.reduce((sum, j) => sum + (j.matchScore || 0), 0) / jobsWithMatch.length
        : 0;
      
      const matchRate = sourceJobs.length > 0
        ? (jobsWithMatch.filter(j => (j.matchScore || 0) >= 70).length / sourceJobs.length) * 100
        : 0;
      
      return { jobs24h, jobs7d, jobs30d, matchRate, avgMatchScore, successRate: 100 };
    };
    
    return [
      {
        id: "prolinker",
        name: "ProLinker",
        description: "Dutch freelance and contract jobs",
        icon: Zap,
        status: prolinkerStats?.lastScrape ? "healthy" : "warning",
        enabled: true,
        schedule: "Every 4 hours",
        lastRun: prolinkerStats?.lastScrape,
        nextRun: prolinkerStats?.lastScrape ? prolinkerStats.lastScrape + 4 * 60 * 60 * 1000 : undefined,
        stats: {
          ...calculateScraperStats("prolinker"),
          lastSuccessfulRun: prolinkerStats?.lastScrape,
        },
        health: {
          uptime: 99.5,
          errorRate: 0.5,
          avgDuration: 45,
          lastError: undefined,
        },
        detailUrl: "/jobs/sources/prolinker",
      },
      {
        id: "freep",
        name: "Freep.nl",
        description: "Dutch government contracts and public sector",
        icon: Globe,
        status: freepStats?.lastScrape ? "healthy" : "warning",
        enabled: true,
        schedule: "Every 6 hours",
        lastRun: freepStats?.lastScrape,
        nextRun: freepStats?.lastScrape ? freepStats.lastScrape + 6 * 60 * 60 * 1000 : undefined,
        stats: {
          ...calculateScraperStats("freep"),
          lastSuccessfulRun: freepStats?.lastScrape,
        },
        health: {
          uptime: 98.0,
          errorRate: 2.0,
          avgDuration: 60,
          lastError: undefined,
        },
        detailUrl: "/jobs/sources/freep",
      },
      {
        id: "linkedin",
        name: "LinkedIn",
        description: "Professional networking and job postings",
        icon: Database,
        status: "paused",
        enabled: false,
        schedule: "Manual",
        stats: {
          ...calculateScraperStats("linkedin"),
          successRate: 100,
        },
        health: {
          uptime: 95.0,
          errorRate: 5.0,
          avgDuration: 30,
        },
        detailUrl: "/jobs/sources/linkedin",
      },
      {
        id: "medium",
        name: "Medium",
        description: "Engineering blogs and company hiring posts",
        icon: FileText,
        status: "paused",
        enabled: false,
        schedule: "Daily at 10 AM",
        stats: {
          jobs24h: 0,
          jobs7d: 0,
          jobs30d: 0,
          matchRate: 0,
          avgMatchScore: 0,
          successRate: 0,
        },
        health: {
          uptime: 0,
          errorRate: 0,
          avgDuration: 0,
        },
        detailUrl: "/jobs/sources/medium",
      },
      {
        id: "reddit",
        name: "Reddit",
        description: "r/forhire, r/remotejs, and Dutch job subreddits",
        icon: MessageSquare,
        status: "paused",
        enabled: false,
        schedule: "Every 3 hours",
        stats: {
          jobs24h: 0,
          jobs7d: 0,
          jobs30d: 0,
          matchRate: 0,
          avgMatchScore: 0,
          successRate: 0,
        },
        health: {
          uptime: 0,
          errorRate: 0,
          avgDuration: 0,
        },
        detailUrl: "/jobs/sources/reddit",
      },
      {
        id: "hackernews",
        name: "HackerNews",
        description: "Who's Hiring monthly threads",
        icon: Hash,
        status: "paused",
        enabled: false,
        schedule: "Daily at 12 PM",
        stats: {
          jobs24h: 0,
          jobs7d: 0,
          jobs30d: 0,
          matchRate: 0,
          avgMatchScore: 0,
          successRate: 0,
        },
        health: {
          uptime: 0,
          errorRate: 0,
          avgDuration: 0,
        },
        detailUrl: "/jobs/sources/hackernews",
      },
    ];
  }, [scrapedJobs, prolinkerStats, freepStats]);
  
  // Calculate overview stats
  const overviewStats = useMemo(() => {
    const total = scrapers.reduce((sum, s) => sum + s.stats.jobs30d, 0);
    const active = scrapers.filter(s => s.enabled).length;
    const avgMatchRate = scrapers.length > 0
      ? scrapers.reduce((sum, s) => sum + s.stats.matchRate, 0) / scrapers.length
      : 0;
    const avgUptime = scrapers.length > 0
      ? scrapers.reduce((sum, s) => sum + s.health.uptime, 0) / scrapers.length
      : 0;
    
    return { total, active, avgMatchRate, avgUptime };
  }, [scrapers]);
  
  const handleTriggerScraper = async (scraperId: string) => {
    setRefreshing(scraperId);
    try {
      // Trigger manual scrape
      await triggerScraper({ scraperId });
      // Refresh data after 3 seconds
      setTimeout(() => setRefreshing(null), 3000);
    } catch (error) {
      console.error(`Failed to trigger ${scraperId}:`, error);
      setRefreshing(null);
    }
  };
  
  const getStatusColor = (status: ScraperStatus["status"]) => {
    switch (status) {
      case "healthy":
        return "text-green-600 bg-green-50 border-green-200";
      case "warning":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "error":
        return "text-red-600 bg-red-50 border-red-200";
      case "paused":
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };
  
  const getStatusIcon = (status: ScraperStatus["status"]) => {
    switch (status) {
      case "healthy":
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case "warning":
        return <AlertCircle className="h-5 w-5 text-yellow-600" />;
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      case "paused":
        return <Clock className="h-5 w-5 text-gray-600" />;
    }
  };
  
  if (!scrapedJobs) {
    return (
      <div className="container py-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4" />
          <div className="grid grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded" />
            ))}
          </div>
          <div className="grid grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-64 bg-muted rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container py-6 space-y-6">
      {/* Header */}
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Job Sources</h1>
          <p className="text-muted-foreground mt-1">
            Monitor and manage all job scraping sources
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Configure
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh All
          </Button>
        </div>
      </header>
      
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Jobs (30d)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overviewStats.total}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Across all sources
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Active Sources</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {overviewStats.active} / {scrapers.length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Currently scraping
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Avg Match Rate</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {overviewStats.avgMatchRate.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Jobs matching preferences
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>System Health</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {overviewStats.avgUptime.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Average uptime
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Scrapers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {scrapers.map((scraper) => (
          <Card 
            key={scraper.id}
            className={`border-2 ${getStatusColor(scraper.status)}`}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-background border">
                    <scraper.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{scraper.name}</CardTitle>
                    <CardDescription className="text-xs mt-1">
                      {scraper.description}
                    </CardDescription>
                  </div>
                </div>
                {getStatusIcon(scraper.status)}
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Schedule & Status */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Schedule</span>
                  <span className="font-medium">{scraper.schedule}</span>
                </div>
                {scraper.lastRun && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Last run</span>
                    <span className="font-medium">
                      {formatDistanceToNow(scraper.lastRun, { addSuffix: true })}
                    </span>
                  </div>
                )}
                {scraper.nextRun && scraper.enabled && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Next run</span>
                    <span className="font-medium">
                      {formatDistanceToNow(scraper.nextRun, { addSuffix: true })}
                    </span>
                  </div>
                )}
              </div>
              
              {/* Stats */}
              <div className="pt-3 border-t space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Jobs (24h / 7d / 30d)</span>
                  <span className="font-mono font-medium">
                    {scraper.stats.jobs24h} / {scraper.stats.jobs7d} / {scraper.stats.jobs30d}
                  </span>
                </div>
                {scraper.stats.matchRate > 0 && (
                  <>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Match rate</span>
                      <span className="font-medium">
                        {scraper.stats.matchRate.toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Avg match score</span>
                      <span className="font-medium">
                        {scraper.stats.avgMatchScore.toFixed(0)}/100
                      </span>
                    </div>
                  </>
                )}
              </div>
              
              {/* Health */}
              <div className="pt-3 border-t space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Uptime</span>
                  <span className="font-medium">
                    {scraper.health.uptime.toFixed(1)}%
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Error rate</span>
                  <span className="font-medium">
                    {scraper.health.errorRate.toFixed(1)}%
                  </span>
                </div>
                {scraper.health.avgDuration > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Avg duration</span>
                    <span className="font-medium">
                      {scraper.health.avgDuration}s
                    </span>
                  </div>
                )}
              </div>
              
              {/* Actions */}
              <div className="pt-3 border-t flex gap-2">
                <Link href={scraper.detailUrl} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full">
                    <ExternalLink className="h-3 w-3 mr-2" />
                    Details
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleTriggerScraper(scraper.id)}
                  disabled={!scraper.enabled || refreshing === scraper.id}
                >
                  {refreshing === scraper.id ? (
                    <RefreshCw className="h-3 w-3 animate-spin" />
                  ) : (
                    <Play className="h-3 w-3" />
                  )}
                </Button>
              </div>
              
              {!scraper.enabled && (
                <Badge variant="secondary" className="w-full justify-center">
                  Coming Soon
                </Badge>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
