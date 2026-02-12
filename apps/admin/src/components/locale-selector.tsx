"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface LocaleSelectorProps {
  value: "en" | "nl";
  onChange: (value: "en" | "nl") => void;
  label?: string;
}

export function LocaleSelector({
  value,
  onChange,
  label = "Language",
}: LocaleSelectorProps) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="en">🇬🇧 English</SelectItem>
          <SelectItem value="nl">🇳🇱 Nederlands</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
