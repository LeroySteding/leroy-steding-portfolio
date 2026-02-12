"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Briefcase, TrendingUp, FileText, Bell } from "lucide-react";

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
}: {
  title: string;
  value: number;
  subtitle: string;
  icon: any;
}) {
  return (
    <div className="rounded-lg border bg-card p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="mt-2 text-3xl font-bold">{value}</p>
          <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
        </div>
        <div className="rounded-full bg-primary/10 p-3">
          <Icon className="h-6 w-6 text-primary" />
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const stats = useQuery(api.dashboard.getStats);
  const activity = useQuery(api.dashboard.getRecentActivity);

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="New Jobs"
          value={stats.jobs.new}
          subtitle={`${stats.jobs.highMatches} high matches`}
          icon={Briefcase}
        />
        <StatCard
          title="Trending Topics"
          value={stats.trends.trending}
          subtitle={`${stats.trends.total} total trends`}
          icon={TrendingUp}
        />
        <StatCard
          title="Content Ideas"
          value={stats.content.readyToPublish}
          subtitle={`${stats.content.total} total ideas`}
          icon={FileText}
        />
        <StatCard
          title="Alerts"
          value={stats.alerts.unread}
          subtitle={`${stats.alerts.urgent} urgent`}
          icon={Bell}
        />
      </div>

      {/* Recent Activity */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Jobs */}
        <div className="rounded-lg border bg-card">
          <div className="border-b p-4">
            <h3 className="font-semibold">Recent Jobs</h3>
          </div>
          <div className="p-4">
            {activity?.recentJobs && activity.recentJobs.length > 0 ? (
              <div className="space-y-3">
                {activity.recentJobs.map((job) => (
                  <div key={job._id} className="flex items-start gap-3">
                    <div className="rounded-full bg-primary/10 p-2">
                      <Briefcase className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{job.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {job.company} • {job.location}
                      </p>
                      {job.matchScore && (
                        <p className="text-xs text-primary font-medium mt-1">
                          {job.matchScore}% match
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                No recent jobs
              </p>
            )}
          </div>
        </div>

        {/* Top Trends */}
        <div className="rounded-lg border bg-card">
          <div className="border-b p-4">
            <h3 className="font-semibold">Top Trends</h3>
          </div>
          <div className="p-4">
            {activity?.topTrends && activity.topTrends.length > 0 ? (
              <div className="space-y-3">
                {activity.topTrends.map((trend) => (
                  <div key={trend._id} className="flex items-start gap-3">
                    <div className="rounded-full bg-primary/10 p-2">
                      <TrendingUp className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium">{trend.topic}</p>
                      <p className="text-sm text-muted-foreground">
                        {trend.platform} • {trend.mentions} mentions
                      </p>
                      <p className="text-xs text-green-600 font-medium mt-1">
                        +{trend.growthRate.toFixed(0)}% growth
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                No trending topics
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Alerts */}
      {activity?.recentAlerts && activity.recentAlerts.length > 0 && (
        <div className="rounded-lg border bg-card">
          <div className="border-b p-4">
            <h3 className="font-semibold">Recent Alerts</h3>
          </div>
          <div className="p-4 space-y-3">
            {activity.recentAlerts.map((alert) => (
              <div
                key={alert._id}
                className={`flex items-start gap-3 rounded-lg p-3 ${
                  alert.priority === "urgent"
                    ? "bg-red-50 border border-red-200"
                    : alert.priority === "high"
                    ? "bg-orange-50 border border-orange-200"
                    : "bg-gray-50"
                }`}
              >
                <Bell className="h-4 w-4 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium">{alert.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {alert.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
