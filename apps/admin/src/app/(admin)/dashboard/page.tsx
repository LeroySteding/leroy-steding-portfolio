"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../../convex/_generated/api";
import { StatCard } from "@/components/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileText, Briefcase, Award, Lightbulb, Image, Plus,
  Rss, CheckSquare, Building2, Calendar, Rocket, Bell,
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

const feedTypeIcons: Record<string, string> = {
  news: "📰", trend: "📈", alert: "🚨", task_update: "✅",
  deploy: "🚀", pr: "🔀", briefing: "📋", insight: "💡",
};

const priorityColors: Record<string, string> = {
  low: "secondary", medium: "default", high: "destructive", critical: "destructive",
};

export default function DashboardPage() {
  const blogPosts = useQuery(api.blog_posts.list, { locale: "en" });
  const projects = useQuery(api.projects.list, { locale: "en" });
  const experiences = useQuery(api.experiences.list, { locale: "en" });
  const skills = useQuery(api.skills.list, {});
  const media = useQuery(api.media.list, { limit: 100 });
  const taskCounts = useQuery(api.tasks.countByStatus, {});
  const unreadFeed = useQuery(api.agent_feed.unreadCount, {});
  const upcomingContent = useQuery(api.content_calendar.upcomingCount, {});
  const activeJobs = useQuery(api.job_applications.activeCount, {});
  const recentDeploys = useQuery(api.deployments.list, { limit: 5 });
  const feedItems = useQuery(api.agent_feed.list, { limit: 10 });
  const markAllRead = useMutation(api.agent_feed.markAllRead);

  const totalTasks = taskCounts ? Object.values(taskCounts).reduce((a, b) => a + b, 0) : 0;
  const activeTasks = (taskCounts?.todo ?? 0) + (taskCounts?.in_progress ?? 0) + (taskCounts?.review ?? 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Command Center</h1>
        <div className="flex gap-2">
          <Button asChild size="sm">
            <Link href="/tasks"><Plus className="mr-1 h-4 w-4" />New Task</Link>
          </Button>
          <Button asChild size="sm" variant="outline">
            <Link href="/blog/new"><FileText className="mr-1 h-4 w-4" />New Post</Link>
          </Button>
        </div>
      </div>

      {/* Command Center Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8">
        <StatCard title="Active Tasks" value={activeTasks} icon={CheckSquare} description={`${totalTasks} total`} />
        <StatCard title="Unread Feed" value={unreadFeed ?? 0} icon={Bell} description="Agent updates" />
        <StatCard title="Content Pipeline" value={upcomingContent ?? 0} icon={Calendar} description="In progress" />
        <StatCard title="Active Jobs" value={activeJobs ?? 0} icon={Building2} description="Applications" />
        <StatCard title="Blog Posts" value={blogPosts?.length ?? 0} icon={FileText} description="Total articles" />
        <StatCard title="Projects" value={projects?.length ?? 0} icon={Briefcase} description="Portfolio" />
        <StatCard title="Skills" value={skills?.length ?? 0} icon={Lightbulb} description="Technologies" />
        <StatCard title="Media" value={media?.length ?? 0} icon={Image} description="Files" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Agent Feed */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Rss className="h-5 w-5" /> Agent Feed
            </CardTitle>
            <div className="flex gap-2">
              <Button size="sm" variant="ghost" onClick={() => markAllRead()}>Mark all read</Button>
              <Button size="sm" variant="outline" asChild><Link href="/feed">View all</Link></Button>
            </div>
          </CardHeader>
          <CardContent>
            {!feedItems?.length ? (
              <p className="text-sm text-muted-foreground">No feed items yet. Agents will post updates here.</p>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {feedItems.map((item) => (
                  <div key={item._id} className={`flex gap-3 p-3 rounded-lg transition-colors ${item.read ? "bg-muted/30" : "bg-muted/70 border-l-2 border-primary"}`}>
                    <span className="text-xl">{feedTypeIcons[item.type] ?? "📌"}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm truncate">{item.title}</span>
                        <Badge variant={priorityColors[item.priority] as any} className="text-xs">{item.priority}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{item.content}</p>
                      <span className="text-xs text-muted-foreground">{format(new Date(item.createdAt), "MMM d, HH:mm")}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Deployments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Rocket className="h-5 w-5" /> Recent Deployments
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!recentDeploys?.length ? (
              <p className="text-sm text-muted-foreground">No deployments tracked yet.</p>
            ) : (
              <div className="space-y-3">
                {recentDeploys.map((d) => (
                  <div key={d._id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <div>
                      <div className="font-medium text-sm">{d.project}</div>
                      <div className="text-xs text-muted-foreground">{d.commitMessage ?? d.environment}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={d.status === "ready" ? "default" : d.status === "error" ? "destructive" : "secondary"}>
                        {d.status}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{format(new Date(d.createdAt), "MMM d")}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader><CardTitle>Quick Actions</CardTitle></CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button asChild><Link href="/blog/new"><Plus className="mr-2 h-4 w-4" />New Blog Post</Link></Button>
          <Button asChild variant="outline"><Link href="/projects/new"><Plus className="mr-2 h-4 w-4" />New Project</Link></Button>
          <Button asChild variant="outline"><Link href="/experience/new"><Plus className="mr-2 h-4 w-4" />New Experience</Link></Button>
          <Button asChild variant="outline"><Link href="/jobs"><Building2 className="mr-2 h-4 w-4" />Job Tracker</Link></Button>
          <Button asChild variant="outline"><Link href="/content"><Calendar className="mr-2 h-4 w-4" />Content Calendar</Link></Button>
        </CardContent>
      </Card>
    </div>
  );
}
