"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Languages, Plus, Link as LinkIcon, Unlink, ExternalLink } from "lucide-react";
import Link from "next/link";
import { toast } from "@/components/ui/use-toast";
import { Id } from "../../../../convex/_generated/dataModel";

interface TranslationManagerProps {
  postId: Id<"blog_posts">;
  currentLocale: "en" | "nl";
}

export function TranslationManager({ postId, currentLocale }: TranslationManagerProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [isLinking, setIsLinking] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string>("");

  const translations = useQuery(api.blog_posts.getTranslations, { id: postId });
  const allPosts = useQuery(api.blog_posts.list, {});
  const createTranslation = useMutation(api.blog_posts.createTranslation);
  const linkTranslation = useMutation(api.blog_posts.linkTranslation);
  const unlinkTranslation = useMutation(api.blog_posts.unlinkTranslation);

  const targetLocale = currentLocale === "en" ? "nl" : "en";
  const hasTranslation = translations && translations.length > 0;

  // Filter posts that could be linked (same locale as target, not already linked)
  const linkablePosts = allPosts?.filter(
    (post) =>
      post.locale === targetLocale &&
      post._id !== postId &&
      !post.translationGroup
  );

  const handleCreateTranslation = async () => {
    setIsCreating(true);
    try {
      const newId = await createTranslation({
        sourceId: postId,
        targetLocale,
      });
      toast({
        title: "Translation draft created",
        description: `A new ${targetLocale.toUpperCase()} draft has been created. Click to edit.`,
        action: (
          <Button variant="outline" size="sm" asChild>
            <Link href={`/blog/${newId}/edit`}>
              <ExternalLink className="h-3 w-3 mr-1" />
              Edit
            </Link>
          </Button>
        ),
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create translation",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleLinkTranslation = async () => {
    if (!selectedPostId) return;

    try {
      await linkTranslation({
        sourceId: postId,
        targetId: selectedPostId as any,
      });
      toast({
        title: "Success",
        description: "Posts linked as translations",
      });
      setIsLinking(false);
      setSelectedPostId("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to link translation",
        variant: "destructive",
      });
    }
  };

  const handleUnlink = async (translationId: Id<"blog_posts">) => {
    try {
      await unlinkTranslation({ id: translationId });
      toast({
        title: "Success",
        description: "Translation unlinked",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to unlink translation",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Languages className="h-5 w-5" />
          Translations
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current translations */}
        {hasTranslation ? (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Linked translations:</p>
            {translations.map((translation) => (
              <div
                key={translation._id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">
                    {translation.locale === "en" ? "🇬🇧" : "🇳🇱"}
                  </span>
                  <div>
                    <p className="font-medium">{translation.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {translation.locale.toUpperCase()} •{" "}
                      <Badge
                        variant={
                          translation.status === "published" ? "default" : "secondary"
                        }
                        className="text-xs"
                      >
                        {translation.status}
                      </Badge>
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/blog/${translation._id}/edit`}>
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleUnlink(translation._id)}
                  >
                    <Unlink className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            No translations linked yet.
          </p>
        )}

        {/* Add translation options */}
        {!isLinking ? (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCreateTranslation}
              disabled={isCreating || hasTranslation}
            >
              <Plus className="h-4 w-4 mr-2" />
              {isCreating
                ? "Creating..."
                : `Create ${targetLocale.toUpperCase()} translation`}
            </Button>
            {linkablePosts && linkablePosts.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsLinking(true)}
              >
                <LinkIcon className="h-4 w-4 mr-2" />
                Link existing post
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Link an existing {targetLocale.toUpperCase()} post as a translation:
            </p>
            <div className="flex gap-2">
              <Select value={selectedPostId} onValueChange={setSelectedPostId}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select a post..." />
                </SelectTrigger>
                <SelectContent>
                  {linkablePosts?.map((post) => (
                    <SelectItem key={post._id} value={post._id}>
                      {post.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                size="sm"
                onClick={handleLinkTranslation}
                disabled={!selectedPostId}
              >
                Link
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsLinking(false);
                  setSelectedPostId("");
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
