"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { slugify } from "@/lib/utils";
import { useEffect, useState } from "react";

interface SlugInputProps {
  title: string;
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

export function SlugInput({
  title,
  value,
  onChange,
  label = "Slug",
}: SlugInputProps) {
  const [isManuallyEdited, setIsManuallyEdited] = useState(false);

  useEffect(() => {
    if (!isManuallyEdited && title) {
      onChange(slugify(title));
    }
  }, [title, isManuallyEdited, onChange]);

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input
        value={value}
        onChange={(e) => {
          setIsManuallyEdited(true);
          onChange(slugify(e.target.value));
        }}
        placeholder="article-slug"
      />
    </div>
  );
}
