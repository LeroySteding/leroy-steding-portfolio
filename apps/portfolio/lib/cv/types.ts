import type { CVData } from "@/data/cv";

export interface ResumeBuilderState {
  cvData: CVData;
  isEditing: boolean;
  editingField: string | null;
  aiSuggestions: Record<string, string[]>;
  pdfPreviewUrl: string | null;
  customization: ResumeCustomization;
  atsMode: boolean;
}

export interface ResumeCustomization {
  colorScheme: "default" | "professional" | "modern" | "creative";
  fontFamily: "inter" | "roboto" | "merriweather" | "playfair";
  fontSize: "small" | "medium" | "large";
  spacing: "compact" | "normal" | "relaxed";
  accentColor: string;
  layout: "single-column" | "two-column";
}

export interface EditableField {
  path: string;
  value: string | string[];
  type: "text" | "textarea" | "list" | "rich-text";
  label: string;
  aiSuggestionPrompt?: string;
}

export interface AISuggestion {
  original: string;
  suggestions: string[];
  reasoning: string;
}
