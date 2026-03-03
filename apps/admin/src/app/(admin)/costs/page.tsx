"use client";

import { useQuery } from "convex/react";
import { api } from "@repo/convex";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  DollarSign, 
  TrendingDown, 
  TrendingUp, 
  Activity,
  AlertCircle 
} from "lucide-react";

export default function CostsPage() {
  const stats = useQuery(api.cost_tracking.getStats);
  const dailyUsage = useQuery(api.cost_tracking.getDailyUsage, { days: 30 });
  const agentBreakdown = useQuery(api.cost_tracking.getBreakdownByAgent);
  const modelBreakdown = useQuery(api.cost_tracking.getBreakdownByModel);
  const savings = useQuery(api.cost_tracking.getSavingsFromLocal);

  const isLoading = !stats || !dailyUsage || !agentBreakdown || !modelBreakdown || !savings;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Activity className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading cost data...</p>
        </div>
      </div>
    );
  }

  const budgetPercentage = stats.percentOfBudget;
  const isOverBudget = stats.overBudget;

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">💰 Cost Tracking</h1>
        <p className="text-muted-foreground">
          Monitor AI model spending and optimize for efficiency
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Monthly Total */}
        <Card className={isOverBudget ? "border-destructive" : ""}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${stats.monthlyTotal.toFixed(2)}
            </div>
            <div className="flex items-center gap-2 mt-2">
              <div className="text-xs text-muted-foreground">
                of ${stats.monthlyBudget} budget
              </div>
              {isOverBudget && (
                <Badge variant="destructive" className="text-xs">
                  Over Budget
                </Badge>
              )}
            </div>
            {/* Budget bar */}
            <div className="mt-3 w-full bg-secondary rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${
                  isOverBudget 
                    ? "bg-destructive" 
                    : budgetPercentage > 80 
                    ? "bg-yellow-500" 
                    : "bg-green-500"
                }`}
                style={{ width: `${Math.min(budgetPercentage, 100)}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {budgetPercentage.toFixed(0)}% used
            </p>
          </CardContent>
        </Card>

        {/* Savings from Local */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Savings (Local)</CardTitle>
            <TrendingDown className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${savings.savings.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {savings.ollamaTasks} tasks via Ollama
            </p>
            <p className="text-xs text-muted-foreground">
              Would cost ${savings.potentialCost.toFixed(2)} with Haiku
            </p>
          </CardContent>
        </Card>

        {/* Top Agent */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Spender</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.topAgent}</div>
            <p className="text-xs text-muted-foreground mt-2">
              ${stats.topAgentCost.toFixed(2)} this month
            </p>
          </CardContent>
        </Card>

        {/* Projection */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Month Projection</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${((stats.monthlyTotal / new Date().getDate()) * 30).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Based on current usage rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Budget Alert */}
      {budgetPercentage > 80 && (
        <Card className="mb-8 border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20">
          <CardContent className="flex items-start gap-3 pt-6">
            <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-yellow-900 dark:text-yellow-100">
                Budget Warning
              </h3>
              <p className="text-sm text-yellow-800 dark:text-yellow-200 mt-1">
                You've used {budgetPercentage.toFixed(0)}% of your monthly budget. 
                Consider optimizing by using local models for simple tasks.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Agent Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Cost by Agent (Last 30 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {agentBreakdown.map((item) => (
                <div key={item.agent} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{item.agent}</span>
                    <span className="text-sm font-bold">${item.cost.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-secondary rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{
                          width: `${(item.cost / agentBreakdown[0].cost) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {item.tasks} tasks
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    ${item.avgCostPerTask.toFixed(3)} per task
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Model Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Cost by Model (Last 30 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {modelBreakdown.map((item) => (
                <div key={item.model} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      {item.model}
                      {item.model === "ollama" && (
                        <Badge variant="secondary" className="ml-2 text-xs">
                          FREE
                        </Badge>
                      )}
                    </span>
                    <span className="text-sm font-bold">${item.cost.toFixed(2)}</span>
                  </div>
                  <div className="flex-1 bg-secondary rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        item.model === "ollama" ? "bg-green-500" : "bg-primary"
                      }`}
                      style={{
                        width: `${item.percentage}%`,
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{item.uses} uses</span>
                    <span>{item.percentage.toFixed(1)}% of total</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Daily Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Daily Usage (Last 30 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {dailyUsage.slice(-14).map((day) => (
              <div key={day.date} className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground w-24">
                  {new Date(day.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
                <div className="flex-1 bg-secondary rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full"
                    style={{
                      width: `${(day.cost / Math.max(...dailyUsage.map(d => d.cost))) * 100}%`,
                    }}
                  />
                </div>
                <span className="text-xs font-medium w-16 text-right">
                  ${day.cost.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Optimization Tips */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>💡 Optimization Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-1">✓</span>
              <span>
                Use <strong>Ollama (local)</strong> for simple tasks like data extraction
                and scraping
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-1">✓</span>
              <span>
                Use <strong>Haiku</strong> for quick research and content analysis
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-1">✓</span>
              <span>
                Use <strong>Sonnet</strong> for coding and complex workflows
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-1">✓</span>
              <span>
                Reserve <strong>Opus</strong> for architecture decisions and complex
                problem-solving
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-500 mt-1">⚠</span>
              <span>
                Current local model usage: {savings.percentage?.toFixed(0)}% (target: 60%)
              </span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
