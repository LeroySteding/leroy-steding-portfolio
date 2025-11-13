"use client";

import React, { useState, useRef, useEffect } from "react";
import { useResumeBuilder } from "@/contexts/ResumeBuilderContext";
import { Sparkles, Check, X, Loader2 } from "lucide-react";

interface EditableFieldProps {
  path: string;
  value: string;
  type?: "text" | "textarea" | "rich-text";
  className?: string;
  placeholder?: string;
  multiline?: boolean;
  aiSuggestionsEnabled?: boolean;
  children?: React.ReactNode;
}

export function EditableField({
  path,
  value,
  type = "text",
  className = "",
  placeholder,
  multiline = false,
  aiSuggestionsEnabled = true,
  children,
}: EditableFieldProps) {
  const {
    isEditing,
    editingField,
    setEditingField,
    updateCVData,
    requestAISuggestions,
    aiSuggestions,
    applyAISuggestion,
  } = useResumeBuilder();

  const [localValue, setLocalValue] = useState(value);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  const isCurrentlyEditing = isEditing && editingField === path;
  const hasSuggestions = aiSuggestions[path]?.length > 0;

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    if (isCurrentlyEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isCurrentlyEditing]);

  const handleClick = () => {
    if (isEditing && !isCurrentlyEditing) {
      setEditingField(path);
    }
  };

  const handleSave = () => {
    updateCVData(path, localValue);
    setEditingField(null);
  };

  const handleCancel = () => {
    setLocalValue(value);
    setEditingField(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && type !== "textarea") {
      e.preventDefault();
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  const handleRequestAI = async () => {
    setIsLoadingSuggestions(true);
    await requestAISuggestions(path, localValue);
    setIsLoadingSuggestions(false);
  };

  const handleApplySuggestion = (suggestion: string) => {
    setLocalValue(suggestion);
    applyAISuggestion(path, suggestion);
  };

  if (!isEditing) {
    return <div className={className}>{children || value}</div>;
  }

  if (isCurrentlyEditing) {
    return (
      <div className="relative group">
        <div className="flex items-start gap-2">
          {multiline || type === "textarea" ? (
            <textarea
              ref={inputRef as React.RefObject<HTMLTextAreaElement>}
              value={localValue}
              onChange={(e) => setLocalValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              className="w-full min-h-[100px] px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 border-2 border-cyan-500 dark:border-cyan-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:focus:ring-cyan-400"
              rows={4}
            />
          ) : (
            <input
              ref={inputRef as React.RefObject<HTMLInputElement>}
              type="text"
              value={localValue}
              onChange={(e) => setLocalValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              className="w-full px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 border-2 border-cyan-500 dark:border-cyan-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:focus:ring-cyan-400"
            />
          )}
          
          <div className="flex items-center gap-1 flex-shrink-0">
            {aiSuggestionsEnabled && (
              <button
                onClick={handleRequestAI}
                disabled={isLoadingSuggestions}
                className="p-2 bg-violet-500 hover:bg-violet-600 text-white rounded-lg transition-colors disabled:opacity-50"
                title="Get AI suggestions"
              >
                {isLoadingSuggestions ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
              </button>
            )}
            <button
              onClick={handleSave}
              className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
              title="Save changes"
            >
              <Check className="w-4 h-4" />
            </button>
            <button
              onClick={handleCancel}
              className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
              title="Cancel"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {hasSuggestions && (
          <div className="mt-3 p-4 bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-700 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-violet-600 dark:text-violet-400" />
              <h4 className="text-sm font-semibold text-violet-900 dark:text-violet-100">
                AI Suggestions
              </h4>
            </div>
            <div className="space-y-2">
              {aiSuggestions[path].map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleApplySuggestion(suggestion)}
                  className="w-full text-left p-3 bg-white dark:bg-gray-800 hover:bg-violet-100 dark:hover:bg-violet-900/30 border border-violet-200 dark:border-violet-700 rounded-lg transition-colors text-sm text-gray-900 dark:text-white"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      onClick={handleClick}
      className={`${className} cursor-pointer hover:bg-cyan-50 dark:hover:bg-cyan-900/20 hover:ring-2 hover:ring-cyan-300 dark:hover:ring-cyan-700 rounded px-2 py-1 -mx-2 -my-1 transition-all`}
      title="Click to edit"
    >
      {children || value}
    </div>
  );
}
