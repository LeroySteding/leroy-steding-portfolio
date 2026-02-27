"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TiptapEditor } from "@/components/tiptap-editor";
import { ImageUpload } from "@/components/image-upload";
import { LocaleSelector } from "@/components/locale-selector";
import { TagInput } from "@/components/tag-input";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "@/components/ui/use-toast";

export default function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const project = useQuery(api.projects.get, { id: id as any });
  const updateProject = useMutation(api.projects.update);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState({});
  const [coverImage, setCoverImage] = useState("");
  const [technologies, setTechnologies] = useState<string[]>([]);
  const [liveUrl, setLiveUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [locale, setLocale] = useState<"en" | "nl">("en");
  const [featured, setFeatured] = useState(false);
  const [year, setYear] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (project) {
      setTitle(project.title);
      setSlug(project.slug);
      setDescription(project.description);
      setContent(project.content || {});
      setCoverImage(project.coverImage || "");
      setTechnologies(project.technologies || []);
      setLiveUrl(project.liveUrl || "");
      setGithubUrl(project.githubUrl || "");
      setLocale(project.locale);
      setFeatured(project.featured || false);
      setYear(project.year?.toString() || "");
      setSeoTitle(project.seoTitle || "");
      setSeoDescription(project.seoDescription || "");
    }
  }, [project]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);
    try {
      await updateProject({
        id: id as any,
        title,
        slug,
        description,
        content,
        coverImage: coverImage || undefined,
        technologies,
        liveUrl: liveUrl || undefined,
        githubUrl: githubUrl || undefined,
        locale,
        featured: featured || undefined,
        year: year ? parseInt(year) : undefined,
        seoTitle: seoTitle || undefined,
        seoDescription: seoDescription || undefined,
      });

      toast({
        title: "Success",
        description: "Project updated successfully",
      });
      router.push("/projects");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update project",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!project) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/projects">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Edit Project</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Title *</Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter project title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Slug</Label>
              <Input
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="project-slug"
              />
            </div>

            <div className="space-y-2">
              <Label>Description *</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of the project"
                rows={3}
                required
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <LocaleSelector value={locale} onChange={setLocale} />
              <div className="space-y-2">
                <Label>Year</Label>
                <Input
                  type="number"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  placeholder="2024"
                />
              </div>
              <div className="space-y-2">
                <Label>Featured</Label>
                <div className="flex items-center space-x-2 h-10">
                  <Switch checked={featured} onCheckedChange={setFeatured} />
                  <span className="text-sm">{featured ? "Yes" : "No"}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Content</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Cover Image</Label>
              <ImageUpload
                value={coverImage}
                onChange={setCoverImage}
                onRemove={() => setCoverImage("")}
              />
            </div>

            <div className="space-y-2">
              <Label>Content *</Label>
              <TiptapEditor content={content} onChange={setContent} />
            </div>

            <TagInput
              value={technologies}
              onChange={setTechnologies}
              label="Technologies"
              placeholder="Add technologies"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Links</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Live URL</Label>
              <Input
                type="url"
                value={liveUrl}
                onChange={(e) => setLiveUrl(e.target.value)}
                placeholder="https://example.com"
              />
            </div>

            <div className="space-y-2">
              <Label>GitHub URL</Label>
              <Input
                type="url"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/username/repo"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>SEO</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>SEO Title</Label>
              <Input
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                placeholder="Leave empty to use project title"
              />
            </div>

            <div className="space-y-2">
              <Label>SEO Description</Label>
              <Textarea
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
                placeholder="Leave empty to use description"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-2">
          <Button
            type="submit"
            disabled={isSubmitting || !title || !description}
          >
            {isSubmitting ? "Saving..." : "Update Project"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
