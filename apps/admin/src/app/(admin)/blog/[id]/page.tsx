"use client";

import { use } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Edit,
  Globe,
  Calendar,
  Clock,
  User,
  Tag,
  Search,
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { toast } from "@/components/ui/use-toast";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

export default function BlogPostViewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const post = useQuery(api.blog_posts.get, { id: id as any });
  const updatePost = useMutation(api.blog_posts.update);

  const editor = useEditor({
    extensions: [StarterKit],
    content: post?.content || "",
    editable: false,
  }, [post?.content]);

  if (!post) {
    return <div>Loading...</div>;
  }

  const handleToggleStatus = async () => {
    const newStatus = post.status === "published" ? "draft" : "published";
    try {
      await updatePost({ id: post._id, status: newStatus });
      toast({
        title: "Success",
        description: `Post ${newStatus === "published" ? "published" : "unpublished"}`,
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      });
    }
  };

  const seoTitle = post.seoTitle || post.title;
  const seoDescription = post.seoDescription || post.excerpt || "";

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/blog">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">{post.title}</h1>
          <Badge variant={post.status === "published" ? "default" : "secondary"}>
            {post.status}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleToggleStatus}>
            {post.status === "published" ? "Unpublish" : "Publish"}
          </Button>
          <Button asChild>
            <Link href={`/blog/${id}/edit`}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Link>
          </Button>
        </div>
      </div>

      {/* Metadata */}
      <Card>
        <CardHeader>
          <CardTitle>Metadata</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Locale:</span>
              <span className="font-medium">{post.locale.toUpperCase()}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Author:</span>
              <span className="font-medium">{post.authorName || post.author}</span>
            </div>
            {post.publishedAt && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Published:</span>
                <span className="font-medium">
                  {format(new Date(post.publishedAt), "MMM d, yyyy")}
                </span>
              </div>
            )}
            {post.readingTime && (
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Reading time:</span>
                <span className="font-medium">{post.readingTime} min</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Slug:</span>
              <code className="text-xs bg-muted px-1.5 py-0.5 rounded">
                {post.slug}
              </code>
            </div>
          </div>
          {post.tags && post.tags.length > 0 && (
            <div className="flex items-center gap-2 mt-4">
              <Tag className="h-4 w-4 text-muted-foreground" />
              <div className="flex gap-1 flex-wrap">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* SEO Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            SEO Preview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg p-4 bg-white dark:bg-zinc-950 space-y-1 max-w-xl">
            <div className="text-sm text-muted-foreground truncate">
              leroy.dev › blog › {post.slug}
            </div>
            <div className="text-lg text-blue-600 dark:text-blue-400 font-medium leading-tight hover:underline cursor-pointer truncate">
              {seoTitle}
            </div>
            <div className="text-sm text-muted-foreground line-clamp-2">
              {seoDescription}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cover Image */}
      {post.coverImage && (
        <Card>
          <CardContent className="pt-6">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full rounded-lg object-cover max-h-96"
            />
          </CardContent>
        </Card>
      )}

      {/* Content */}
      <Card>
        <CardHeader>
          <CardTitle>Content</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose dark:prose-invert max-w-none">
            <EditorContent editor={editor} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
