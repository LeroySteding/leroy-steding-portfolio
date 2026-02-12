"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { StatCard } from "@/components/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Briefcase, Award, Lightbulb, Image, Plus } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

export default function DashboardPage() {
  const blogPosts = useQuery(api.blog_posts.list, { locale: "en" });
  const projects = useQuery(api.projects.list, { locale: "en" });
  const experiences = useQuery(api.experiences.list, { locale: "en" });
  const skills = useQuery(api.skills.list, {});
  const media = useQuery(api.media.list, { limit: 100 });

  const blogCount = blogPosts?.length ?? 0;
  const projectCount = projects?.length ?? 0;
  const experienceCount = experiences?.length ?? 0;
  const skillCount = skills?.length ?? 0;
  const mediaCount = media?.length ?? 0;

  // Get recent items (last 5 across all types)
  const recentItems = [
    ...(blogPosts?.slice(0, 3).map((post) => ({
      type: "Blog Post",
      title: post.title,
      date: post._creationTime,
      href: `/blog/${post._id}/edit`,
    })) ?? []),
    ...(projects?.slice(0, 2).map((project) => ({
      type: "Project",
      title: project.title,
      date: project._creationTime,
      href: `/projects/${project._id}/edit`,
    })) ?? []),
  ]
    .sort((a, b) => b.date - a.date)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <StatCard
          title="Blog Posts"
          value={blogCount}
          icon={FileText}
          description="Total articles"
        />
        <StatCard
          title="Projects"
          value={projectCount}
          icon={Briefcase}
          description="Portfolio items"
        />
        <StatCard
          title="Experience"
          value={experienceCount}
          icon={Award}
          description="Work & education"
        />
        <StatCard
          title="Skills"
          value={skillCount}
          icon={Lightbulb}
          description="Technologies"
        />
        <StatCard
          title="Media"
          value={mediaCount}
          icon={Image}
          description="Uploaded files"
        />
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button asChild>
            <Link href="/blog/new">
              <Plus className="mr-2 h-4 w-4" />
              New Blog Post
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/projects/new">
              <Plus className="mr-2 h-4 w-4" />
              New Project
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/experience/new">
              <Plus className="mr-2 h-4 w-4" />
              New Experience
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/media">
              <Plus className="mr-2 h-4 w-4" />
              Upload Media
            </Link>
          </Button>
        </CardContent>
      </Card>

      {/* Recent Content */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Content</CardTitle>
        </CardHeader>
        <CardContent>
          {recentItems.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No recent content. Start creating!
            </p>
          ) : (
            <div className="space-y-3">
              {recentItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        {item.type}
                      </span>
                    </div>
                    <p className="font-medium">{item.title}</p>
                  </div>
                  <time className="text-sm text-muted-foreground">
                    {format(new Date(item.date), "MMM d, yyyy")}
                  </time>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
