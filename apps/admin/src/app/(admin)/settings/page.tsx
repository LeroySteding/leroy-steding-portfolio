"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { api } from "../../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LocaleSelector } from "@/components/locale-selector";
import { toast } from "@/components/ui/use-toast";

interface SettingsForm {
  siteTitle: string;
  siteDescription: string;
  email: string;
  githubUrl: string;
  linkedinUrl: string;
  twitterUrl: string;
  analyticsId: string;
}

export default function SettingsPage() {
  const { user } = useUser();
  const [locale, setLocale] = useState<"en" | "nl">("en");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const settings = useQuery(api.site_settings.list, { locale });
  const updateSetting = useMutation(api.site_settings.upsert);

  const [form, setForm] = useState<SettingsForm>({
    siteTitle: "",
    siteDescription: "",
    email: "",
    githubUrl: "",
    linkedinUrl: "",
    twitterUrl: "",
    analyticsId: "",
  });

  useEffect(() => {
    if (settings) {
      const settingsMap = settings.reduce((acc: any, setting: any) => {
        acc[setting.key] = setting.value;
        return acc;
      }, {});

      setForm({
        siteTitle: settingsMap.siteTitle || "",
        siteDescription: settingsMap.siteDescription || "",
        email: settingsMap.email || "",
        githubUrl: settingsMap.githubUrl || "",
        linkedinUrl: settingsMap.linkedinUrl || "",
        twitterUrl: settingsMap.twitterUrl || "",
        analyticsId: settingsMap.analyticsId || "",
      });
    }
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);
    try {
      const updates = Object.entries(form).map(([key, value]) => ({
        key,
        value,
        locale,
        updatedBy: user.id,
      }));

      for (const update of updates) {
        await updateSetting(update);
      }

      toast({
        title: "Success",
        description: "Settings updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update settings",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateField = (key: keyof SettingsForm, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  if (!settings) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Settings</h1>
        <LocaleSelector value={locale} onChange={setLocale} label="" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Site Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Site Title</Label>
              <Input
                value={form.siteTitle}
                onChange={(e) => updateField("siteTitle", e.target.value)}
                placeholder="Leroy Steding - Portfolio"
              />
            </div>

            <div className="space-y-2">
              <Label>Site Description</Label>
              <Textarea
                value={form.siteDescription}
                onChange={(e) =>
                  updateField("siteDescription", e.target.value)
                }
                placeholder="Full-stack developer specializing in modern web technologies"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => updateField("email", e.target.value)}
                placeholder="hello@example.com"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Social Links</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>GitHub URL</Label>
              <Input
                type="url"
                value={form.githubUrl}
                onChange={(e) => updateField("githubUrl", e.target.value)}
                placeholder="https://github.com/username"
              />
            </div>

            <div className="space-y-2">
              <Label>LinkedIn URL</Label>
              <Input
                type="url"
                value={form.linkedinUrl}
                onChange={(e) => updateField("linkedinUrl", e.target.value)}
                placeholder="https://linkedin.com/in/username"
              />
            </div>

            <div className="space-y-2">
              <Label>Twitter/X URL</Label>
              <Input
                type="url"
                value={form.twitterUrl}
                onChange={(e) => updateField("twitterUrl", e.target.value)}
                placeholder="https://x.com/username"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Analytics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Google Analytics ID</Label>
              <Input
                value={form.analyticsId}
                onChange={(e) => updateField("analyticsId", e.target.value)}
                placeholder="G-XXXXXXXXXX"
              />
              <p className="text-xs text-muted-foreground">
                Your Google Analytics Measurement ID
              </p>
            </div>
          </CardContent>
        </Card>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Settings"}
        </Button>
      </form>
    </div>
  );
}
