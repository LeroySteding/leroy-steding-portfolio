"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Edit,
  ExternalLink,
  Github,
  FileText,
  Calendar,
  Clock,
  User,
  Building,
} from "lucide-react";
import Link from "next/link";
import { toast } from "@/components/ui/use-toast";

export default function ProjectViewPage({
  params,
}: {
  params: { id: string };
}) {
  const project = useQuery(api.projects.get, { id: params.id as any });
  const updateProject = useMutation(api.projects.update);

  if (!project) {
    return <div>Loading...</div>;
  }

  const handleTogglePublished = async () => {
    try {
      await updateProject({ id: project._id, published: !project.published });
      toast({
        title: "Success",
        description: `Project ${!project.published ? "published" : "unpublished"}`,
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/projects">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">{project.title}</h1>
          <Badge variant={project.published ? "default" : "secondary"}>
            {project.published ? "Published" : "Draft"}
          </Badge>
          {project.featured && <Badge variant="outline">Featured</Badge>}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleTogglePublished}>
            {project.published ? "Unpublish" : "Publish"}
          </Button>
          <Button asChild>
            <Link href={`/projects/${params.id}/edit`}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Link>
          </Button>
        </div>
      </div>

      {/* Hero / Cover Image */}
      {project.coverImage && (
        <Card>
          <CardContent className="pt-6">
            <img
              src={project.coverImage}
              alt={project.title}
              className="w-full rounded-lg object-cover max-h-96"
            />
          </CardContent>
        </Card>
      )}

      {/* Project Info */}
      <Card>
        <CardHeader>
          <CardTitle>Project Info</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">{project.description}</p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            {project.year && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Year:</span>
                <span className="font-medium">{project.year}</span>
              </div>
            )}
            {project.duration && (
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Duration:</span>
                <span className="font-medium">{project.duration}</span>
              </div>
            )}
            {project.role && (
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Role:</span>
                <span className="font-medium">{project.role}</span>
              </div>
            )}
            {project.client && (
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Client:</span>
                <span className="font-medium">{project.client}</span>
              </div>
            )}
          </div>

          {/* Technologies */}
          {project.technologies && project.technologies.length > 0 && (
            <div className="space-y-2">
              <span className="text-sm text-muted-foreground">Technologies</span>
              <div className="flex gap-1 flex-wrap">
                {project.technologies.map((tech) => (
                  <Badge key={tech} variant="outline">
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Links */}
      {(project.liveUrl || project.githubUrl || project.caseStudyUrl) && (
        <Card>
          <CardHeader>
            <CardTitle>Links</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-2 flex-wrap">
            {project.liveUrl && (
              <Button variant="outline" asChild>
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Live Site
                </a>
              </Button>
            )}
            {project.githubUrl && (
              <Button variant="outline" asChild>
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                  <Github className="h-4 w-4 mr-2" />
                  GitHub
                </a>
              </Button>
            )}
            {project.caseStudyUrl && (
              <Button variant="outline" asChild>
                <a href={project.caseStudyUrl} target="_blank" rel="noopener noreferrer">
                  <FileText className="h-4 w-4 mr-2" />
                  Case Study
                </a>
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Gallery */}
      {project.galleryImages && project.galleryImages.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Gallery</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {project.galleryImages.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`${project.title} gallery ${i + 1}`}
                  className="w-full rounded-lg object-cover aspect-video"
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
