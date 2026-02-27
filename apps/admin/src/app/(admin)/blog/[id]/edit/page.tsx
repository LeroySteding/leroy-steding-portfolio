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
import { SlugInput } from "@/components/slug-input";
import { LocaleSelector } from "@/components/locale-selector";
import { TagInput } from "@/components/tag-input";
import { TranslationManager } from "@/components/translation-manager";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "@/components/ui/use-toast";

export default function EditBlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const post = useQuery(api.blog_posts.get, { id: id as any });
  const updateBlogPost = useMutation(api.blog_posts.update);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState({});
  const [coverImage, setCoverImage] = useState("");
  const [locale, setLocale] = useState<"en" | "nl">("en");
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [tags, setTags] = useState<string[]>([]);
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setSlug(post.slug);
      setExcerpt(post.excerpt || "");
      setContent(post.content || {});
      setCoverImage(post.coverImage || "");
      setLocale(post.locale);
      setStatus(post.status);
      setTags(post.tags || []);
      setSeoTitle(post.seoTitle || "");
      setSeoDescription(post.seoDescription || "");
    }
  }, [post]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);
    try {
      await updateBlogPost({
        id: id as any,
        title,
        slug,
        content,
        excerpt: excerpt || undefined,
        coverImage: coverImage || undefined,
        locale,
        status,
        tags: tags.length > 0 ? tags : undefined,
        seoTitle: seoTitle || undefined,
        seoDescription: seoDescription || undefined,
      });

      toast({
        title: "Success",
        description: "Blog post updated successfully",
      });
      router.push("/blog");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update blog post",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/blog">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Edit Blog Post</h1>
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
                placeholder="Enter blog post title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Slug</Label>
              <Input
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="article-slug"
              />
            </div>

            <div className="space-y-2">
              <Label>Excerpt</Label>
              <Textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Brief summary of the post"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <LocaleSelector value={locale} onChange={setLocale} />
              <div className="space-y-2">
                <Label>Status</Label>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={status === "published"}
                    onCheckedChange={(checked) =>
                      setStatus(checked ? "published" : "draft")
                    }
                  />
                  <span className="text-sm">
                    {status === "published" ? "Published" : "Draft"}
                  </span>
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

            <TagInput value={tags} onChange={setTags} />
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
                placeholder="Leave empty to use post title"
              />
            </div>

            <div className="space-y-2">
              <Label>SEO Description</Label>
              <Textarea
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
                placeholder="Leave empty to use excerpt"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <TranslationManager postId={id as any} currentLocale={locale} />

        <div className="flex gap-2">
          <Button type="submit" disabled={isSubmitting || !title}>
            {isSubmitting ? "Saving..." : "Update Post"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
