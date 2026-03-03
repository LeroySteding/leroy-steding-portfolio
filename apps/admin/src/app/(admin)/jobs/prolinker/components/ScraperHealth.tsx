"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../../../../convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  PlayCircle,
  TrendingUp,
  Clock,
} from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export function ScraperHealth() {
  const [isTriggering, setIsTriggering] = useState(false);
  
  const scraperHealth = useQuery(api.prolinker_dashboard.scraperHealth);
  const triggerScraper = useMutation(api.prolinker_dashboard.triggerScraper);

  const handleTriggerScraper = async () => {
    setIsTriggering(true);
    try {
      await triggerScraper({});
      // TODO: Show success message
    } catch (error) {
      console.error("Failed to trigger scraper:", error);
      // TODO: Show error message
    } finally {
      setIsTriggering(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "text-green-600";
      case "error":
        return "text-red-600";
      default:
        return "text-slate-600";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case "error":
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Activity className="w-5 h-5 text-slate-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600">
              Last Run
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              {scraperHealth?.lastRunStatus && getStatusIcon(scraperHealth.lastRunStatus)}
              <span className="text-sm">
                {scraperHealth?.lastRunTime
                  ? formatDistanceToNow(scraperHealth.lastRunTime, { addSuffix: true })
                  : "Never"}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600">
              Success Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {scraperHealth?.successRate || 0}%
            </div>
            <Progress value={scraperHealth?.successRate || 0} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600">
              Total Runs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {scraperHealth?.totalRuns || 0}
            </div>
            <p className="text-xs text-slate-500 mt-1">Last 10 runs tracked</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600">
              Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge
              variant={scraperHealth?.lastRunStatus === "success" ? "default" : "destructive"}
              className="text-sm"
            >
              {scraperHealth?.lastRunStatus === "success" ? "Healthy" : "Issues Detected"}
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Last Run Details */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Last Run Status
              </CardTitle>
              <CardDescription>
                Details from the most recent scraping session
              </CardDescription>
            </div>
            <Button
              onClick={handleTriggerScraper}
              disabled={isTriggering}
              size="sm"
            >
              <PlayCircle className={`w-4 h-4 mr-2 ${isTriggering ? "animate-spin" : ""}`} />
              {isTriggering ? "Triggering..." : "Trigger Manual Scrape"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {scraperHealth?.lastRunStats ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="text-sm text-blue-900 font-medium">New Jobs</div>
                <div className="text-2xl font-bold text-blue-600 mt-1">
                  {scraperHealth.lastRunStats.newJobs || 0}
                </div>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="text-sm text-green-900 font-medium">Total Jobs</div>
                <div className="text-2xl font-bold text-green-600 mt-1">
                  {scraperHealth.lastRunStats.totalJobs || 0}
                </div>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="text-sm text-purple-900 font-medium">Duration</div>
                <div className="text-2xl font-bold text-purple-600 mt-1">
                  {scraperHealth.lastRunStats.durationMs 
                    ? `${Math.round(scraperHealth.lastRunStats.durationMs / 1000)}s`
                    : "N/A"}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-slate-500">
              <Clock className="w-12 h-12 mx-auto mb-2 opacity-20" />
              <p>No scraper runs recorded yet</p>
              <p className="text-sm mt-1">Click &quot;Trigger Manual Scrape&quot; to start</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Jobs Per Scrape Trend */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Jobs Per Scrape Trend
          </CardTitle>
          <CardDescription>
            Number of jobs discovered in recent scraping sessions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {scraperHealth?.jobsPerScrape && scraperHealth.jobsPerScrape.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={scraperHealth.jobsPerScrape}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  name="New Jobs" 
                />
                <Line 
                  type="monotone" 
                  dataKey="total" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  name="Total Jobs" 
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-slate-500">
              No trend data available
            </div>
          )}
        </CardContent>
      </Card>

      {/* Error Log */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            Error Log
          </CardTitle>
          <CardDescription>
            Recent errors and issues
          </CardDescription>
        </CardHeader>
        <CardContent>
          {scraperHealth?.errors && scraperHealth.errors.length > 0 ? (
            <div className="space-y-2">
              {scraperHealth.errors.map((error: any, index: number) => (
                <div
                  key={error._id}
                  className="p-3 bg-red-50 border border-red-200 rounded-lg"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <XCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                        <span className="font-medium text-sm text-red-900">
                          {error.event}
                        </span>
                      </div>
                      {error.metadata?.message && (
                        <p className="text-sm text-red-800 mt-1 ml-6">
                          {error.metadata.message}
                        </p>
                      )}
                    </div>
                    <span className="text-xs text-red-700 whitespace-nowrap">
                      {formatDistanceToNow(error.createdAt, { addSuffix: true })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-500">
              <CheckCircle2 className="w-12 h-12 mx-auto mb-2 text-green-500 opacity-20" />
              <p>No errors recorded</p>
              <p className="text-sm mt-1">All scraping sessions completed successfully</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Configuration Info */}
      <Card>
        <CardHeader>
          <CardTitle>Scraper Configuration</CardTitle>
          <CardDescription>
            Current scraper settings and schedule
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-slate-600">Source</Label>
              <p className="text-sm mt-1">ProLinker.nl</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-slate-600">Schedule</Label>
              <p className="text-sm mt-1">Every 4 hours (via cron)</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-slate-600">Max Pages</Label>
              <p className="text-sm mt-1">5 pages per run</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-slate-600">Rate Limit</Label>
              <p className="text-sm mt-1">2000ms between requests</p>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-slate-50 rounded-lg">
            <h4 className="font-semibold text-sm mb-2">Notes</h4>
            <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
              <li>Scraper runs automatically every 4 hours</li>
              <li>Duplicate jobs are automatically detected and skipped</li>
              <li>Jobs not seen in 30 days are automatically archived</li>
              <li>Manual triggers are logged for auditing</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Label({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <label className={`block text-sm font-medium ${className}`}>{children}</label>;
}
