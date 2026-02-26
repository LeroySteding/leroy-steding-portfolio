"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Edit, Trash2, Languages } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { EmptyState } from "@/components/empty-state";
import { FileText } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function BlogListPage() {
  const router = useRouter();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [localeFilter, setLocaleFilter] = useState<"all" | "en" | "nl">("all");
  const blogPosts = useQuery(
    api.blog_posts.list,
    localeFilter === "all" ? {} : { locale: localeFilter }
  );
  const deleteBlogPost = useMutation(api.blog_posts.remove);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteBlogPost({ id: deleteId as any });
      toast({
        title: "Success",
        description: "Blog post deleted successfully",
      });
      setDeleteId(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete blog post",
        variant: "destructive",
      });
    }
  };

  if (!blogPosts) {
    return <div>Loading...</div>;
  }

  if (blogPosts.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Blog Posts</h1>
          <Button asChild>
            <Link href="/blog/new">
              <Plus className="mr-2 h-4 w-4" />
              New Post
            </Link>
          </Button>
        </div>
        <EmptyState
          icon={FileText}
          title="No blog posts yet"
          description="Create your first blog post to get started"
          action={{
            label: "Create Post",
            onClick: () => router.push("/blog/new"),
          }}
        />
      </div>
    );
  }

  // Group posts by translation group
  const groupedPosts = blogPosts?.reduce((acc, post) => {
    const key = post.translationGroup || post._id;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(post);
    return acc;
  }, {} as Record<string, typeof blogPosts>);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Blog Posts</h1>
        <div className="flex gap-2">
          <Select value={localeFilter} onValueChange={(value: any) => setLocaleFilter(value)}>
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Languages</SelectItem>
              <SelectItem value="en">🇬🇧 English</SelectItem>
              <SelectItem value="nl">🇳🇱 Dutch</SelectItem>
            </SelectContent>
          </Select>
          <Button asChild>
            <Link href="/blog/new">
              <Plus className="mr-2 h-4 w-4" />
              New Post
            </Link>
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Locale</TableHead>
              <TableHead>Translations</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {blogPosts.map((post) => {
              const translations = groupedPosts?.[post.translationGroup || post._id]?.filter(
                (p) => p._id !== post._id
              );
              return (
                <TableRow key={post._id}>
                  <TableCell className="font-medium">
                    <Link href={`/blog/${post._id}`} className="hover:underline">
                      {post.title}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={post.status === "published" ? "default" : "secondary"}
                    >
                      {post.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">
                      {post.locale === "en" ? "🇬🇧 EN" : "🇳🇱 NL"}
                    </span>
                  </TableCell>
                  <TableCell>
                    {translations && translations.length > 0 ? (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Languages className="h-3 w-3" />
                        {translations.map((t) => (
                          <Link
                            key={t._id}
                            href={`/blog/${t._id}`}
                            className="hover:text-foreground"
                          >
                            {t.locale === "en" ? "🇬🇧" : "🇳🇱"}
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {format(new Date(post._creationTime), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="ghost" asChild>
                        <Link href={`/blog/${post._id}/edit`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setDeleteId(post._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete blog post?"
        description="This action cannot be undone. The blog post will be permanently deleted."
      />
    </div>
  );
}
