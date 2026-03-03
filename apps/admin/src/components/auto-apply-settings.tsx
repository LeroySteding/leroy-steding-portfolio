"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertTriangle,
  CheckCircle2,
  Settings,
  Shield,
  TrendingUp,
} from "lucide-react";

export function AutoApplySettings() {
  const settings = useQuery(api.auto_apply_settings.get);
  const stats = useQuery(api.auto_apply_settings.getStats);
  const updateSettings = useMutation(api.auto_apply_settings.update);

  const [localSettings, setLocalSettings] = useState(settings);

  // Update local state when settings load
  if (settings && !localSettings) {
    setLocalSettings(settings);
  }

  if (!settings || !stats || !localSettings) {
    return <div className="p-8">Loading settings...</div>;
  }

  const handleSave = async () => {
    try {
      await updateSettings(localSettings);
      alert("Settings saved successfully!");
    } catch (error) {
      console.error("Failed to save settings:", error);
      alert("Failed to save settings. Please try again.");
    }
  };

  const updateLocalSetting = (key: string, value: any) => {
    setLocalSettings({ ...localSettings, [key]: value });
  };

  const addToList = (key: string, value: string) => {
    if (!value.trim()) return;
    const list = localSettings[key] as string[];
    updateLocalSetting(key, [...list, value.trim()]);
  };

  const removeFromList = (key: string, index: number) => {
    const list = localSettings[key] as string[];
    updateLocalSetting(key, list.filter((_, i) => i !== index));
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Auto-Apply Settings</h1>
          <p className="text-muted-foreground">
            Configure automated job application system with safety controls
          </p>
        </div>
        <Button onClick={handleSave} size="lg">
          <Settings className="mr-2 h-4 w-4" />
          Save Settings
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
            {stats.enabled ? (
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            ) : (
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.enabled ? "Enabled" : "Disabled"}
            </div>
            <p className="text-xs text-muted-foreground">
              Mode: {stats.mode}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todayCount}</div>
            <p className="text-xs text-muted-foreground">
              of {stats.dailyLimit} applications
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Remaining</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.remainingToday}</div>
            <p className="text-xs text-muted-foreground">
              applications left today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Auto-Applied</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAutoApplied}</div>
            <p className="text-xs text-muted-foreground">
              all time
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Operating Mode</CardTitle>
          <CardDescription>
            Choose how the auto-apply system behaves
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="enabled">Enable Auto-Apply</Label>
              <p className="text-sm text-muted-foreground">
                Master switch for the entire system
              </p>
            </div>
            <Switch
              id="enabled"
              checked={localSettings.enabled}
              onCheckedChange={(checked) =>
                updateLocalSetting("enabled", checked)
              }
            />
          </div>

          <Separator />

          <div className="space-y-2">
            <Label htmlFor="mode">Mode</Label>
            <Select
              value={localSettings.mode}
              onValueChange={(value) => updateLocalSetting("mode", value)}
            >
              <SelectTrigger id="mode">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="manual">
                  Manual - Review each job, one-click apply
                </SelectItem>
                <SelectItem value="semi-auto">
                  Semi-Auto - Auto-apply to high matches (80%+)
                </SelectItem>
                <SelectItem value="full-auto">
                  Full-Auto - Auto-apply to all above threshold
                </SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              {localSettings.mode === "manual" && "Highest safety - full control"}
              {localSettings.mode === "semi-auto" && "Medium safety - quality filter"}
              {localSettings.mode === "full-auto" && "Lower safety - requires careful tuning"}
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="dailyLimit">Daily Application Limit</Label>
              <Input
                id="dailyLimit"
                type="number"
                min="1"
                max="50"
                value={localSettings.dailyLimit}
                onChange={(e) =>
                  updateLocalSetting("dailyLimit", parseInt(e.target.value))
                }
              />
              <p className="text-sm text-muted-foreground">
                Maximum applications per day (recommended: 5-15)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="scoreThreshold">Minimum Score Threshold</Label>
              <Input
                id="scoreThreshold"
                type="number"
                min="0"
                max="100"
                value={localSettings.scoreThreshold}
                onChange={(e) =>
                  updateLocalSetting("scoreThreshold", parseInt(e.target.value))
                }
              />
              <p className="text-sm text-muted-foreground">
                Only apply to jobs scoring above this (0-100)
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cooldown">Company Cooldown Period (days)</Label>
            <Input
              id="cooldown"
              type="number"
              min="1"
              max="365"
              value={localSettings.companyCooldownDays}
              onChange={(e) =>
                updateLocalSetting("companyCooldownDays", parseInt(e.target.value))
              }
            />
            <p className="text-sm text-muted-foreground">
              Days to wait before re-applying to the same company
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Safety Controls */}
      <Card>
        <CardHeader>
          <CardTitle>
            <Shield className="inline mr-2 h-5 w-5" />
            Safety Controls
          </CardTitle>
          <CardDescription>
            Filters and restrictions to maintain application quality
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Dry Run */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="dryRun">Dry-Run Mode</Label>
              <p className="text-sm text-muted-foreground">
                Test applications without actually submitting them
              </p>
            </div>
            <Switch
              id="dryRun"
              checked={localSettings.dryRun}
              onCheckedChange={(checked) =>
                updateLocalSetting("dryRun", checked)
              }
            />
          </div>

          <Separator />

          {/* Blacklist Companies */}
          <div className="space-y-2">
            <Label>Blacklist Companies</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Add company to blacklist"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    addToList("blacklistCompanies", e.currentTarget.value);
                    e.currentTarget.value = "";
                  }
                }}
              />
              <Button
                variant="outline"
                onClick={(e) => {
                  const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                  addToList("blacklistCompanies", input.value);
                  input.value = "";
                }}
              >
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {localSettings.blacklistCompanies.map((company, i) => (
                <Badge key={i} variant="destructive">
                  {company}
                  <button
                    onClick={() => removeFromList("blacklistCompanies", i)}
                    className="ml-2 hover:text-white"
                  >
                    ×
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          {/* Blacklist Keywords */}
          <div className="space-y-2">
            <Label>Blacklist Keywords</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Add keyword to blacklist"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    addToList("blacklistKeywords", e.currentTarget.value);
                    e.currentTarget.value = "";
                  }
                }}
              />
              <Button
                variant="outline"
                onClick={(e) => {
                  const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                  addToList("blacklistKeywords", input.value);
                  input.value = "";
                }}
              >
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {localSettings.blacklistKeywords.map((keyword, i) => (
                <Badge key={i} variant="destructive">
                  {keyword}
                  <button
                    onClick={() => removeFromList("blacklistKeywords", i)}
                    className="ml-2 hover:text-white"
                  >
                    ×
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          {/* Required Keywords */}
          <div className="space-y-2">
            <Label>Required Keywords</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Add required keyword"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    addToList("requiredKeywords", e.currentTarget.value);
                    e.currentTarget.value = "";
                  }
                }}
              />
              <Button
                variant="outline"
                onClick={(e) => {
                  const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                  addToList("requiredKeywords", input.value);
                  input.value = "";
                }}
              >
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {localSettings.requiredKeywords.map((keyword, i) => (
                <Badge key={i} variant="secondary">
                  {keyword}
                  <button
                    onClick={() => removeFromList("requiredKeywords", i)}
                    className="ml-2 hover:text-white"
                  >
                    ×
                  </button>
                </Badge>
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              Jobs must contain ALL required keywords
            </p>
          </div>

          {/* Whitelist Companies */}
          <div className="space-y-2">
            <Label>Whitelist Companies (Priority)</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Add priority company"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    addToList("whitelistCompanies", e.currentTarget.value);
                    e.currentTarget.value = "";
                  }
                }}
              />
              <Button
                variant="outline"
                onClick={(e) => {
                  const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                  addToList("whitelistCompanies", input.value);
                  input.value = "";
                }}
              >
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {localSettings.whitelistCompanies.map((company, i) => (
                <Badge key={i} variant="default">
                  {company}
                  <button
                    onClick={() => removeFromList("whitelistCompanies", i)}
                    className="ml-2 hover:text-white"
                  >
                    ×
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle>Notifications & Reporting</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="notifyOnApply">Notify on Each Application</Label>
              <p className="text-sm text-muted-foreground">
                Send notification for every application submitted
              </p>
            </div>
            <Switch
              id="notifyOnApply"
              checked={localSettings.notifyOnApply}
              onCheckedChange={(checked) =>
                updateLocalSetting("notifyOnApply", checked)
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="weeklyReport">Weekly Summary Report</Label>
              <p className="text-sm text-muted-foreground">
                Receive weekly summary of applications and results
              </p>
            </div>
            <Switch
              id="weeklyReport"
              checked={localSettings.weeklyReportEnabled}
              onCheckedChange={(checked) =>
                updateLocalSetting("weeklyReportEnabled", checked)
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Warning Banner */}
      {localSettings.enabled && !localSettings.dryRun && (
        <Card className="border-yellow-500 bg-yellow-50 dark:bg-yellow-950">
          <CardHeader>
            <CardTitle className="flex items-center text-yellow-700 dark:text-yellow-500">
              <AlertTriangle className="mr-2 h-5 w-5" />
              Auto-Apply is Active (LIVE MODE)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-yellow-700 dark:text-yellow-500">
              The system is currently submitting real applications. Make sure all settings
              are correct and you're comfortable with the current configuration.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} size="lg">
          <Settings className="mr-2 h-4 w-4" />
          Save Settings
        </Button>
      </div>
    </div>
  );
}
