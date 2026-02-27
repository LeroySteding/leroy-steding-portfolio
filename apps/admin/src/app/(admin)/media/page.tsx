"use client";

import { useState, useRef } from "react";
import { useQuery, useMutation } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { api } from "../../../../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, Copy, Trash2, Loader2, Image as ImageIcon } from "lucide-react";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { EmptyState } from "@/components/empty-state";
import { toast } from "@/components/ui/use-toast";
import { formatBytes } from "@/lib/utils";
import { format } from "date-fns";
import Image from "next/image";

export default function MediaPage() {
  const { user } = useUser();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const media = useQuery(api.media.list, { limit: 100 });
  const generateUploadUrl = useMutation(api.media.generateUploadUrl);
  const saveMedia = useMutation(api.media.create);
  const deleteMedia = useMutation(api.media.remove);

  const handleUpload = async (file: File) => {
    if (!user) return;

    setIsUploading(true);
    try {
      const uploadUrl = await generateUploadUrl();
      const result = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });

      const { storageId } = await result.json();

      await saveMedia({
        storageId,
        filename: file.name,
        mimeType: file.type,
        fileSize: file.size,
      });

      toast({
        title: "Success",
        description: "File uploaded successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload file",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleUpload(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const copyUrl = (storageId: string) => {
    const url = `/api/storage/${storageId}`;
    navigator.clipboard.writeText(url);
    toast({
      title: "Copied!",
      description: "URL copied to clipboard",
    });
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteMedia({ id: deleteId as any });
      toast({
        title: "Success",
        description: "File deleted successfully",
      });
      setDeleteId(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete file",
        variant: "destructive",
      });
    }
  };

  if (!media) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Media Library</h1>
      </div>

      {/* Upload Zone */}
      <Card
        className={`p-8 border-2 border-dashed transition-colors cursor-pointer ${
          isDragging ? "border-primary bg-primary/5" : ""
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !isUploading && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
          disabled={isUploading}
        />

        {isUploading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Uploading...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Upload className="h-8 w-8 text-muted-foreground" />
            <div className="text-center">
              <p className="font-medium">Click to upload or drag and drop</p>
              <p className="text-sm text-muted-foreground mt-1">
                Images only (PNG, JPG, GIF, WebP)
              </p>
            </div>
          </div>
        )}
      </Card>

      {/* Media Grid */}
      {media.length === 0 ? (
        <EmptyState
          icon={ImageIcon}
          title="No media files yet"
          description="Upload images to use in your blog posts, projects, and more"
          action={{
            label: "Upload File",
            onClick: () => fileInputRef.current?.click(),
          }}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
          {media.map((file) => (
            <Card key={file._id} className="overflow-hidden group">
              <div className="relative aspect-square bg-muted">
                {file.mimeType.startsWith("image/") ? (
                  <Image
                    src={`/api/storage/${file.storageId}`}
                    alt={file.filename}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <ImageIcon className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}

                {/* Overlay with actions */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={(e) => {
                      e.stopPropagation();
                      copyUrl(file.storageId);
                    }}
                  >
                    <Copy className="h-4 w-4 mr-1" />
                    Copy URL
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteId(file._id);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="p-3">
                <p className="text-sm font-medium truncate">{file.filename}</p>
                <div className="flex items-center justify-between mt-1 text-xs text-muted-foreground">
                  <span>{file.fileSize ? formatBytes(file.fileSize) : "—"}</span>
                  <span>{format(new Date(file._creationTime), "MMM d")}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete file?"
        description="This action cannot be undone. The file will be permanently deleted."
      />
    </div>
  );
}
