"use client";

import type React from "react";
import { createContext, useCallback, useContext, useState } from "react";
import type { CVData } from "@/data/cv";
import type {
  AISuggestion,
  ResumeBuilderState,
  ResumeCustomization,
} from "@/lib/cv/types";

interface ResumeBuilderContextType extends ResumeBuilderState {
  updateCVData: (path: string, value: any) => void;
  setIsEditing: (isEditing: boolean) => void;
  setEditingField: (field: string | null) => void;
  requestAISuggestions: (field: string, content: string) => Promise<void>;
  applyAISuggestion: (field: string, suggestion: string) => void;
  updateCustomization: (updates: Partial<ResumeCustomization>) => void;
  generatePDFPreview: () => Promise<void>;
  resetToOriginal: () => void;
  exportData: () => CVData;
  setAtsMode: (atsMode: boolean) => void;
}

const ResumeBuilderContext = createContext<
  ResumeBuilderContextType | undefined
>(undefined);

export function ResumeBuilderProvider({
  children,
  initialData,
}: {
  children: React.ReactNode;
  initialData: CVData;
}) {
  const [cvData, setCvData] = useState<CVData>(initialData);
  const [isEditing, setIsEditing] = useState(false);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [aiSuggestions, setAiSuggestions] = useState<Record<string, string[]>>(
    {},
  );
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);
  const [atsMode, setAtsMode] = useState(false);
  const [customization, setCustomization] = useState<ResumeCustomization>({
    colorScheme: "default",
    fontFamily: "inter",
    fontSize: "medium",
    spacing: "normal",
    accentColor: "#0891b2",
    layout: "single-column",
  });

  const updateCVData = useCallback((path: string, value: any) => {
    setCvData((prev) => {
      const newData = { ...prev };
      const keys = path.split(".");
      let current: any = newData;

      for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        const arrayMatch = key.match(/(.+)\[(\d+)\]/);

        if (arrayMatch) {
          const [, arrayKey, index] = arrayMatch;
          current[arrayKey] = [...current[arrayKey]];
          current = current[arrayKey][parseInt(index, 10)];
        } else {
          current[key] = { ...current[key] };
          current = current[key];
        }
      }

      const lastKey = keys[keys.length - 1];
      current[lastKey] = value;

      return newData;
    });
  }, []);

  const requestAISuggestions = useCallback(
    async (field: string, content: string) => {
      try {
        const response = await fetch("/api/cv/ai-suggestions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ field, content }),
        });

        if (!response.ok) throw new Error("Failed to get AI suggestions");

        const data: AISuggestion = await response.json();
        setAiSuggestions((prev) => ({
          ...prev,
          [field]: data.suggestions,
        }));
      } catch (error) {
        console.error("Error requesting AI suggestions:", error);
      }
    },
    [],
  );

  const applyAISuggestion = useCallback(
    (field: string, suggestion: string) => {
      updateCVData(field, suggestion);
      setAiSuggestions((prev) => {
        const newSuggestions = { ...prev };
        delete newSuggestions[field];
        return newSuggestions;
      });
    },
    [updateCVData],
  );

  const updateCustomization = useCallback(
    (updates: Partial<ResumeCustomization>) => {
      setCustomization((prev) => ({ ...prev, ...updates }));
    },
    [],
  );

  const generatePDFPreview = useCallback(async () => {
    try {
      const response = await fetch("/api/cv/generate-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cvData, customization }),
      });

      if (!response.ok) throw new Error("Failed to generate PDF");

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      if (pdfPreviewUrl) {
        URL.revokeObjectURL(pdfPreviewUrl);
      }

      setPdfPreviewUrl(url);
    } catch (error) {
      console.error("Error generating PDF preview:", error);
    }
  }, [cvData, customization, pdfPreviewUrl]);

  const resetToOriginal = useCallback(() => {
    setCvData(initialData);
    setAiSuggestions({});
    setCustomization({
      colorScheme: "default",
      fontFamily: "inter",
      fontSize: "medium",
      spacing: "normal",
      accentColor: "#0891b2",
      layout: "single-column",
    });
  }, [initialData]);

  const exportData = useCallback(() => {
    return cvData;
  }, [cvData]);

  return (
    <ResumeBuilderContext.Provider
      value={{
        cvData,
        isEditing,
        editingField,
        aiSuggestions,
        pdfPreviewUrl,
        customization,
        atsMode,
        updateCVData,
        setIsEditing,
        setEditingField,
        requestAISuggestions,
        applyAISuggestion,
        updateCustomization,
        generatePDFPreview,
        resetToOriginal,
        exportData,
        setAtsMode,
      }}
    >
      {children}
    </ResumeBuilderContext.Provider>
  );
}

export function useResumeBuilder() {
  const context = useContext(ResumeBuilderContext);
  if (!context) {
    throw new Error(
      "useResumeBuilder must be used within ResumeBuilderProvider",
    );
  }
  return context;
}
