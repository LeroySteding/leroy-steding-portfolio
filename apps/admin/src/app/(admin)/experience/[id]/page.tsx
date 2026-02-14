"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Edit, MapPin, Calendar, Briefcase, Award } from "lucide-react";
import Link from "next/link";
import { format, parseISO } from "date-fns";

export default function ExperienceDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const experience = useQuery(api.experiences.get, { id: params.id as any });

  if (experience === undefined) return <div>Loading...</div>;
  if (experience === null) return <div>Experience not found</div>;

  const startDate = parseISO(experience.startDate);
  const endDate = experience.endDate ? parseISO(experience.endDate) : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/experience"><ArrowLeft className="h-4 w-4 mr-1" />Back</Link>
          </Button>
          <h1 className="text-3xl font-bold">{experience.title}</h1>
        </div>
        <Button asChild>
          <Link href={`/experience/${params.id}/edit`}>
            <Edit className="h-4 w-4 mr-1" />Edit
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Main info */}
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-3">
              {experience.logoUrl && (
                <img src={experience.logoUrl} alt={experience.company} className="w-12 h-12 rounded-lg object-cover" />
              )}
              <div>
                <CardTitle className="text-xl">{experience.company}</CardTitle>
                {experience.position && (
                  <p className="text-muted-foreground">{experience.position}</p>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {experience.description && (
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground">{experience.description}</p>
              </div>
            )}

            {experience.content && (
              <div>
                <h3 className="font-semibold mb-2">Content</h3>
                <div className="prose prose-sm dark:prose-invert max-w-none p-4 bg-muted/50 rounded-lg">
                  <pre className="text-xs whitespace-pre-wrap">{JSON.stringify(experience.content, null, 2)}</pre>
                </div>
              </div>
            )}

            {experience.achievements && experience.achievements.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Achievements</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  {experience.achievements.map((a, i) => (
                    <li key={i}>{a}</li>
                  ))}
                </ul>
              </div>
            )}

            {experience.technologies && experience.technologies.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Technologies</h3>
                <div className="flex flex-wrap gap-2">
                  {experience.technologies.map((t) => (
                    <Badge key={t} variant="secondary">{t}</Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Timeline */}
          <Card>
            <CardHeader><CardTitle className="text-sm">Timeline</CardTitle></CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                  <div className="w-0.5 h-8 bg-border" />
                  <div className={`w-3 h-3 rounded-full ${experience.isCurrent ? "bg-green-500 animate-pulse" : "bg-muted-foreground"}`} />
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium">{format(startDate, "MMM yyyy")}</p>
                    <p className="text-xs text-muted-foreground">Start</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">{endDate ? format(endDate, "MMM yyyy") : "Present"}</p>
                    <p className="text-xs text-muted-foreground">{experience.isCurrent ? "Current" : "End"}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Meta */}
          <Card>
            <CardHeader><CardTitle className="text-sm">Details</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                {experience.type === "work" ? <Briefcase className="h-4 w-4" /> : <Award className="h-4 w-4" />}
                <Badge variant={experience.type === "work" ? "default" : "secondary"}>{experience.type}</Badge>
              </div>
              {experience.location && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {experience.location}
                </div>
              )}
              <div className="flex items-center gap-2">
                <Badge variant="outline">{experience.locale === "en" ? "🇬🇧 EN" : "🇳🇱 NL"}</Badge>
                <Badge variant={experience.published ? "default" : "secondary"}>
                  {experience.published ? "Published" : "Draft"}
                </Badge>
              </div>
              {experience.order !== undefined && (
                <p className="text-sm text-muted-foreground">Order: {experience.order}</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
