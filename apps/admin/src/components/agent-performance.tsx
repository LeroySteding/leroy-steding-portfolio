"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Loader2 } from "lucide-react";
import { format, subDays, startOfDay } from "date-fns";

const AGENT_COLORS: Record<string, string> = {
  orchestrator: "#3b82f6",
  architect: "#8b5cf6",
  coder: "#10b981",
  researcher: "#f59e0b",
  business: "#ec4899",
  "data-scraper": "#06b6d4",
  "qa-critic": "#ef4444",
};

export function AgentPerformance() {
  const tasks = useQuery(api.agentCoordination.getAgentTasks, {});

  if (!tasks) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  // Calculate tasks completed per agent
  const completedTasks = tasks.filter(t => t.status === "completed");
  const agentTaskCounts: Record<string, number> = {};
  const agentCompletionTimes: Record<string, number[]> = {};

  for (const task of completedTasks) {
    for (const agent of task.assignedTo) {
      agentTaskCounts[agent] = (agentTaskCounts[agent] || 0) + 1;
      
      if (task.completedAt && task.createdAt) {
        const completionTime = (task.completedAt - task.createdAt) / (1000 * 60 * 60); // hours
        if (!agentCompletionTimes[agent]) agentCompletionTimes[agent] = [];
        agentCompletionTimes[agent].push(completionTime);
      }
    }
  }

  const taskData = Object.entries(agentTaskCounts).map(([agent, count]) => ({
    agent,
    count,
  })).sort((a, b) => b.count - a.count);

  const avgCompletionData = Object.entries(agentCompletionTimes).map(([agent, times]) => ({
    agent,
    avgHours: times.length > 0 ? times.reduce((a, b) => a + b, 0) / times.length : 0,
  })).sort((a, b) => a.avgHours - b.avgHours);

  // Activity heatmap (last 7 days)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = startOfDay(subDays(new Date(), 6 - i));
    return {
      date,
      dateStr: format(date, "MMM dd"),
      count: 0,
    };
  });

  for (const task of tasks) {
    const taskDate = startOfDay(new Date(task.createdAt));
    const dayEntry = last7Days.find(d => d.date.getTime() === taskDate.getTime());
    if (dayEntry) {
      dayEntry.count++;
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Tasks Completed per Agent */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Tasks Completed per Agent</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={taskData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="agent" 
                className="text-xs"
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis className="text-xs" />
              <Tooltip 
                contentStyle={{ backgroundColor: "hsl(var(--popover))", border: "1px solid hsl(var(--border))" }}
                labelStyle={{ color: "hsl(var(--popover-foreground))" }}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {taskData.map((entry) => (
                  <Cell key={entry.agent} fill={AGENT_COLORS[entry.agent] || "#64748b"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Average Completion Time */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Avg. Completion Time (hours)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={avgCompletionData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="agent" 
                className="text-xs"
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis className="text-xs" />
              <Tooltip 
                contentStyle={{ backgroundColor: "hsl(var(--popover))", border: "1px solid hsl(var(--border))" }}
                labelStyle={{ color: "hsl(var(--popover-foreground))" }}
                formatter={(value: number) => [`${value.toFixed(1)}h`, "Avg Time"]}
              />
              <Bar dataKey="avgHours" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Activity Heatmap (last 7 days) */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="text-base">Activity Heatmap (Last 7 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-2 h-32">
            {last7Days.map((day) => (
              <div key={day.dateStr} className="flex-1 flex flex-col items-center gap-2">
                <div 
                  className="w-full rounded-t transition-all"
                  style={{ 
                    height: `${Math.max((day.count / Math.max(...last7Days.map(d => d.count))) * 100, 8)}%`,
                    backgroundColor: day.count > 0 ? `hsl(var(--primary))` : "hsl(var(--muted))",
                    opacity: day.count > 0 ? 0.6 + (day.count / Math.max(...last7Days.map(d => d.count))) * 0.4 : 0.3,
                  }}
                />
                <div className="text-xs text-muted-foreground text-center">{day.dateStr}</div>
                <div className="text-xs font-semibold">{day.count}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
