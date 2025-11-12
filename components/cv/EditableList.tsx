"use client";

import React, { useState } from "react";
import { useResumeBuilder } from "@/contexts/ResumeBuilderContext";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { EditableField } from "./EditableField";

interface EditableListProps {
  path: string;
  items: string[];
  className?: string;
  itemClassName?: string;
  addButtonText?: string;
  renderItem?: (item: string, index: number) => React.ReactNode;
}

export function EditableList({
  path,
  items,
  className = "",
  itemClassName = "",
  addButtonText = "Add item",
  renderItem,
}: EditableListProps) {
  const { isEditing, updateCVData } = useResumeBuilder();
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleAddItem = () => {
    const newItems = [...items, ""];
    updateCVData(path, newItems);
  };

  const handleRemoveItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    updateCVData(path, newItems);
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newItems = [...items];
    const draggedItem = newItems[draggedIndex];
    newItems.splice(draggedIndex, 1);
    newItems.splice(index, 0, draggedItem);
    
    updateCVData(path, newItems);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  return (
    <div className={className}>
      <ul className="space-y-2">
        {items.map((item, index) => (
          <li
            key={index}
            draggable={isEditing}
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragEnd={handleDragEnd}
            className={`flex items-start gap-2 ${
              draggedIndex === index ? "opacity-50" : ""
            }`}
          >
            {isEditing && (
              <div className="flex items-center gap-1 mt-1 flex-shrink-0">
                <GripVertical className="w-4 h-4 text-gray-400 cursor-move" />
                <button
                  onClick={() => handleRemoveItem(index)}
                  className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 rounded transition-colors"
                  title="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
            
            <div className="flex-1">
              {renderItem ? (
                renderItem(item, index)
              ) : (
                <EditableField
                  path={`${path}[${index}]`}
                  value={item}
                  className={itemClassName}
                  multiline
                />
              )}
            </div>
          </li>
        ))}
      </ul>

      {isEditing && (
        <button
          onClick={handleAddItem}
          className="mt-3 flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          {addButtonText}
        </button>
      )}
    </div>
  );
}
