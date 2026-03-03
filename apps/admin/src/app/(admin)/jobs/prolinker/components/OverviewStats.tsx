import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Briefcase, 
  TrendingUp, 
  CheckCircle2, 
  Target, 
  Send, 
  BarChart3 
} from "lucide-react";

interface OverviewStatsProps {
  stats?: {
    totalJobs: number;
    newToday: number;
    newThisWeek: number;
    archivedJobs: number;
    totalApplications: number;
    autoApplied: number;
    manualApplied: number;
    offers: number;
    successRate: number;
  };
}

export function OverviewStats({ stats }: OverviewStatsProps) {
  if (!stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 w-24 bg-slate-200 rounded" />
              <div className="h-4 w-4 bg-slate-200 rounded" />
            </CardHeader>
            <CardContent>
              <div className="h-8 w-16 bg-slate-200 rounded mb-1" />
              <div className="h-3 w-32 bg-slate-200 rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Jobs Scraped",
      value: stats.totalJobs.toLocaleString(),
      description: `${stats.archivedJobs} archived`,
      icon: Briefcase,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "New This Week",
      value: stats.newThisWeek.toLocaleString(),
      description: `${stats.newToday} today`,
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Applications Sent",
      value: stats.totalApplications.toLocaleString(),
      description: `${stats.autoApplied} auto, ${stats.manualApplied} manual`,
      icon: Send,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Success Rate",
      value: `${stats.successRate}%`,
      description: `${stats.offers} offers received`,
      icon: Target,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <Icon className={`w-4 h-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-slate-500 mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
