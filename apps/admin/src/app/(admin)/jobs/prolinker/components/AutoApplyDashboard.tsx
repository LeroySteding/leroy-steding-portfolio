"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../../../../convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Zap, 
  Shield, 
  Ban, 
  Activity, 
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  X,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export function AutoApplyDashboard() {
  const settings = useQuery(api.auto_apply_settings.get);
  const stats = useQuery(api.auto_apply_settings.getStats);
  const applicationHistory = useQuery(api.prolinker_dashboard.applicationHistory, { limit: 20 });
  const weeklyPerformance = useQuery(api.prolinker_dashboard.weeklyPerformance);
  
  const updateSettings = useMutation(api.auto_apply_settings.update);

  const [localSettings, setLocalSettings] = useState({
    mode: settings?.mode || "manual",
    enabled: settings?.enabled || false,
    dailyLimit: settings?.dailyLimit || 10,
    scoreThreshold: settings?.scoreThreshold || 70,
    dryRun: settings?.dryRun ?? true,
  });

  const handleSaveSettings = async () => {
    await updateSettings(localSettings);
  };

  return (
    <div className="space-y-6">
      {/* Control Panel */}
      <Card className="border-2 border-blue-200">
        <CardHeader className="bg-blue-50">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-blue-600" />
                Auto-Apply Control Panel
              </CardTitle>
              <CardDescription>
                Configure automated job application settings
              </CardDescription>
            </div>
            {localSettings.enabled && (
              <Badge variant={localSettings.dryRun ? "outline" : "default"} className="text-sm">
                {localSettings.dryRun ? "DRY RUN MODE" : "LIVE MODE"}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          {/* Safety Warning */}
          {localSettings.enabled && !localSettings.dryRun && (
            <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-orange-900">Live Auto-Apply Active</h4>
                <p className="text-sm text-orange-800 mt-1">
                  The system will automatically apply to jobs matching your criteria. 
                  Make sure your profile and resume are up to date.
                </p>
              </div>
            </div>
          )}

          {/* Mode Selector */}
          <div className="space-y-3">
            <Label htmlFor="mode" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Application Mode
            </Label>
            <Select
              value={localSettings.mode}
              onValueChange={(value: "manual" | "semi-auto" | "full-auto") =>
                setLocalSettings({ ...localSettings, mode: value })
              }
            >
              <SelectTrigger id="mode">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="manual">
                  <div>
                    <div className="font-medium">Manual</div>
                    <div className="text-xs text-slate-500">Review and apply to each job manually</div>
                  </div>
                </SelectItem>
                <SelectItem value="semi-auto">
                  <div>
                    <div className="font-medium">Semi-Auto</div>
                    <div className="text-xs text-slate-500">Auto-apply to high-match jobs (80%+)</div>
                  </div>
                </SelectItem>
                <SelectItem value="full-auto">
                  <div>
                    <div className="font-medium">Full Auto</div>
                    <div className="text-xs text-slate-500">Auto-apply to all jobs above threshold</div>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Enable Switch */}
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
            <div>
              <Label htmlFor="enabled" className="text-base font-semibold">
                Enable Auto-Apply
              </Label>
              <p className="text-sm text-slate-600 mt-1">
                Start automatically applying to matching jobs
              </p>
            </div>
            <Switch
              id="enabled"
              checked={localSettings.enabled}
              onCheckedChange={(checked) =>
                setLocalSettings({ ...localSettings, enabled: checked })
              }
            />
          </div>

          {/* Dry Run Mode */}
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
            <div>
              <Label htmlFor="dryRun" className="text-base font-semibold">
                Dry Run Mode
              </Label>
              <p className="text-sm text-slate-600 mt-1">
                Test mode - no actual applications will be sent
              </p>
            </div>
            <Switch
              id="dryRun"
              checked={localSettings.dryRun}
              onCheckedChange={(checked) =>
                setLocalSettings({ ...localSettings, dryRun: checked })
              }
            />
          </div>

          {/* Daily Limit Slider */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Daily Application Limit</Label>
              <span className="text-sm font-semibold">{localSettings.dailyLimit} per day</span>
            </div>
            <Slider
              value={[localSettings.dailyLimit]}
              onValueChange={(value) =>
                setLocalSettings({ ...localSettings, dailyLimit: value[0] })
              }
              min={1}
              max={50}
              step={1}
              className="w-full"
            />
            <p className="text-xs text-slate-500">
              Limit applications to avoid spam and maintain quality
            </p>
          </div>

          {/* Score Threshold Slider */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Minimum Match Score</Label>
              <span className="text-sm font-semibold">{localSettings.scoreThreshold}%</span>
            </div>
            <Slider
              value={[localSettings.scoreThreshold]}
              onValueChange={(value) =>
                setLocalSettings({ ...localSettings, scoreThreshold: value[0] })
              }
              min={0}
              max={100}
              step={5}
              className="w-full"
            />
            <p className="text-xs text-slate-500">
              Only apply to jobs with a match score above this threshold
            </p>
          </div>

          {/* Save Button */}
          <div className="pt-4">
            <Button onClick={handleSaveSettings} className="w-full">
              Save Settings
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600">
              Applications Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.todayCount || 0} / {stats?.dailyLimit || 10}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {stats?.remainingToday || 0} remaining
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600">
              Total Auto-Applied
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalAutoApplied || 0}</div>
            <p className="text-xs text-slate-500 mt-1">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600">
              Current Mode
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold capitalize">
              {stats?.mode || "manual"}
            </div>
            <Badge variant={stats?.enabled ? "default" : "secondary"} className="mt-2 text-xs">
              {stats?.enabled ? "Active" : "Inactive"}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600">
              Safety Mode
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">
              {stats?.dryRun ? "Dry Run" : "Live"}
            </div>
            <Badge variant={stats?.dryRun ? "outline" : "destructive"} className="mt-2 text-xs">
              {stats?.dryRun ? "Safe" : "Live Applications"}
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Blacklist Manager */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Ban className="w-5 h-5" />
            Blacklist Manager
          </CardTitle>
          <CardDescription>
            Companies and keywords to avoid
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Blacklisted Companies</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {settings?.blacklistCompanies && settings.blacklistCompanies.length > 0 ? (
                settings.blacklistCompanies.map((company) => (
                  <Badge key={company} variant="secondary" className="text-sm">
                    {company}
                    <X className="w-3 h-3 ml-1 cursor-pointer" />
                  </Badge>
                ))
              ) : (
                <span className="text-sm text-slate-500">No blacklisted companies</span>
              )}
            </div>
            <div className="flex gap-2 mt-3">
              <Input placeholder="Add company name..." className="max-w-xs" />
              <Button size="sm">Add</Button>
            </div>
          </div>

          <div>
            <Label>Blacklisted Keywords</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {settings?.blacklistKeywords && settings.blacklistKeywords.length > 0 ? (
                settings.blacklistKeywords.map((keyword: string) => (
                  <Badge key={keyword} variant="secondary" className="text-sm">
                    {keyword}
                    <X className="w-3 h-3 ml-1 cursor-pointer" />
                  </Badge>
                ))
              ) : (
                <span className="text-sm text-slate-500">No blacklisted keywords</span>
              )}
            </div>
            <div className="flex gap-2 mt-3">
              <Input placeholder="Add keyword..." className="max-w-xs" />
              <Button size="sm">Add</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Performance Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Weekly Performance
          </CardTitle>
          <CardDescription>
            Applications sent and responses received
          </CardDescription>
        </CardHeader>
        <CardContent>
          {weeklyPerformance && weeklyPerformance.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weeklyPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="applied" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  name="Applications" 
                />
                <Line 
                  type="monotone" 
                  dataKey="responses" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  name="Responses" 
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-slate-500">
              No performance data available
            </div>
          )}
        </CardContent>
      </Card>

      {/* Application History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Recent Applications
          </CardTitle>
          <CardDescription>
            Latest auto-applied jobs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Applied</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Via</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applicationHistory && applicationHistory.length > 0 ? (
                  applicationHistory.map((app: any) => (
                    <TableRow key={app._id}>
                      <TableCell className="font-medium">{app.company}</TableCell>
                      <TableCell>{app.position}</TableCell>
                      <TableCell className="text-sm text-slate-500">
                        {app.appliedAt
                          ? formatDistanceToNow(app.appliedAt, { addSuffix: true })
                          : "-"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            app.status === "offer"
                              ? "default"
                              : app.status === "rejected"
                              ? "destructive"
                              : "secondary"
                          }
                        >
                          {app.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {app.appliedVia || "manual"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                      No applications yet
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
