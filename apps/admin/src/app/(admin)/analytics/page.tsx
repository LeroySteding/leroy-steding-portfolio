"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../../../convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatCard } from "@/components/stat-card";
import { BarChart3, DollarSign, Cpu, Zap, GitBranch, Rocket } from "lucide-react";
import { format } from "date-fns";

export default function AnalyticsPage() {
  const summary = useQuery(api.analytics_log.summary, {});
  const recentLogs = useQuery(api.analytics_log.list, { limit: 20 });
  const deployments = useQuery(api.deployments.list, { limit: 10 });
  const githubActivity = useQuery(api.github_activity.list, { limit: 10 });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold flex items-center gap-2"><BarChart3 className="h-8 w-8" /> Analytics & Usage</h1>

      {/* Summary cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Cost" value={`$${(summary?.totalCost ?? 0).toFixed(4)}`} icon={DollarSign} description="All time" />
        <StatCard title="Tokens In" value={(summary?.totalTokensIn ?? 0).toLocaleString()} icon={Cpu} description="Input tokens" />
        <StatCard title="Tokens Out" value={(summary?.totalTokensOut ?? 0).toLocaleString()} icon={Zap} description="Output tokens" />
        <StatCard title="Total Events" value={summary?.totalEvents ?? 0} icon={BarChart3} description="Logged events" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* By Agent */}
        <Card>
          <CardHeader><CardTitle>Usage by Agent</CardTitle></CardHeader>
          <CardContent>
            {summary?.byAgent && Object.keys(summary.byAgent).length > 0 ? (
              <div className="space-y-2">
                {Object.entries(summary.byAgent).sort(([, a], [, b]) => b - a).map(([agent, count]) => (
                  <div key={agent} className="flex items-center justify-between p-2 rounded bg-muted/50">
                    <span className="font-medium text-sm">{agent}</span>
                    <Badge variant="outline">{count} events</Badge>
                  </div>
                ))}
              </div>
            ) : <p className="text-sm text-muted-foreground">No agent data yet.</p>}
          </CardContent>
        </Card>

        {/* By Model */}
        <Card>
          <CardHeader><CardTitle>Usage by Model</CardTitle></CardHeader>
          <CardContent>
            {summary?.byModel && Object.keys(summary.byModel).length > 0 ? (
              <div className="space-y-2">
                {Object.entries(summary.byModel).sort(([, a], [, b]) => b - a).map(([model, count]) => (
                  <div key={model} className="flex items-center justify-between p-2 rounded bg-muted/50">
                    <span className="font-medium text-sm">{model}</span>
                    <Badge variant="outline">{count} calls</Badge>
                  </div>
                ))}
              </div>
            ) : <p className="text-sm text-muted-foreground">No model data yet.</p>}
          </CardContent>
        </Card>
      </div>

      {/* Deployments */}
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Rocket className="h-5 w-5" /> Deployment History</CardTitle></CardHeader>
        <CardContent>
          {!deployments?.length ? <p className="text-sm text-muted-foreground">No deployments tracked.</p> : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Project</TableHead>
                  <TableHead>Environment</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Commit</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {deployments.map((d) => (
                  <TableRow key={d._id}>
                    <TableCell className="font-medium">{d.project}</TableCell>
                    <TableCell><Badge variant="outline">{d.environment}</Badge></TableCell>
                    <TableCell><Badge variant={d.status === "ready" ? "default" : d.status === "error" ? "destructive" : "secondary"}>{d.status}</Badge></TableCell>
                    <TableCell className="text-sm">{d.commitMessage ?? d.commitSha?.slice(0, 7) ?? "—"}</TableCell>
                    <TableCell className="text-sm">{d.buildDuration ? `${(d.buildDuration / 1000).toFixed(1)}s` : "—"}</TableCell>
                    <TableCell className="text-sm">{format(new Date(d.createdAt), "MMM d, HH:mm")}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* GitHub Activity */}
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><GitBranch className="h-5 w-5" /> GitHub Activity</CardTitle></CardHeader>
        <CardContent>
          {!githubActivity?.length ? <p className="text-sm text-muted-foreground">No GitHub activity tracked.</p> : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Repo</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>#</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {githubActivity.map((g) => (
                  <TableRow key={g._id}>
                    <TableCell className="font-medium">{g.repo}</TableCell>
                    <TableCell><Badge variant="outline">{g.type}</Badge></TableCell>
                    <TableCell>#{g.number}</TableCell>
                    <TableCell><a href={g.url} target="_blank" rel="noopener" className="hover:underline">{g.title}</a></TableCell>
                    <TableCell><Badge variant="secondary">{g.status}</Badge></TableCell>
                    <TableCell className="text-sm">{format(new Date(g.createdAt), "MMM d")}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Recent logs */}
      <Card>
        <CardHeader><CardTitle>Recent Activity Logs</CardTitle></CardHeader>
        <CardContent>
          {!recentLogs?.length ? <p className="text-sm text-muted-foreground">No logs yet.</p> : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {recentLogs.map((log) => (
                <div key={log._id} className="flex items-center justify-between p-2 rounded bg-muted/30 text-sm">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline">{log.event}</Badge>
                    {log.agent && <span className="text-muted-foreground">{log.agent}</span>}
                    {log.model && <Badge variant="secondary" className="text-xs">{log.model}</Badge>}
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    {log.cost !== undefined && <span>${log.cost.toFixed(4)}</span>}
                    {log.durationMs !== undefined && <span>{(log.durationMs / 1000).toFixed(1)}s</span>}
                    <span>{format(new Date(log.createdAt), "HH:mm")}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
