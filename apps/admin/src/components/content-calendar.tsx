"use client";

import { useState, useMemo } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  ChevronLeft, ChevronRight, FileText, Video, MessageSquare, 
  Plus, Calendar as CalendarIcon 
} from "lucide-react";
import { 
  format, startOfMonth, endOfMonth, eachDayOfInterval, 
  isSameMonth, isSameDay, isToday, addMonths, subMonths,
  startOfWeek, endOfWeek, getDay
} from "date-fns";

type ContentStatus = "idea" | "outline" | "drafting" | "review" | "scheduled" | "published";
type ContentType = "blog_post" | "social_post" | "newsletter" | "video" | "podcast" | "case_study";

interface ContentItem {
  _id: Id<"content_calendar">;
  title: string;
  type: ContentType;
  status: ContentStatus;
  platform?: string;
  targetDate?: number;
  publishedAt?: number;
  notes?: string;
  seoKeywords?: string[];
  createdAt: number;
}

const TYPE_ICONS: Record<ContentType, any> = {
  blog_post: FileText,
  social_post: MessageSquare,
  newsletter: FileText,
  video: Video,
  podcast: Video,
  case_study: FileText,
};

const STATUS_COLORS: Record<ContentStatus, string> = {
  idea: "bg-slate-200 text-slate-800 border-slate-300",
  outline: "bg-blue-200 text-blue-800 border-blue-300",
  drafting: "bg-indigo-200 text-indigo-800 border-indigo-300",
  review: "bg-purple-200 text-purple-800 border-purple-300",
  scheduled: "bg-orange-200 text-orange-800 border-orange-300",
  published: "bg-green-200 text-green-800 border-green-300",
};

interface ContentCalendarProps {
  content: ContentItem[];
  onContentClick: (content: ContentItem) => void;
  onAddContent: (date: Date) => void;
}

export default function ContentCalendar({ content, onContentClick, onAddContent }: ContentCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const updateContent = useMutation(api.content_calendar.update);

  // Generate calendar days
  const { monthStart, monthEnd, calendarDays } = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 }); // Monday
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

    return { monthStart, monthEnd, calendarDays };
  }, [currentMonth]);

  // Group content by date
  const contentByDate = useMemo(() => {
    const grouped: Record<string, ContentItem[]> = {};
    
    content.forEach((item) => {
      if (!item.targetDate) return;
      
      const dateKey = format(item.targetDate, "yyyy-MM-dd");
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(item);
    });

    return grouped;
  }, [content]);

  // Handle drag end
  const handleDragEnd = async (result: DropResult) => {
    const { draggableId, destination } = result;

    if (!destination) return;

    const destDate = destination.droppableId; // Format: "date-yyyy-MM-dd"
    if (!destDate.startsWith("date-")) return;

    const dateString = destDate.replace("date-", "");
    const newTargetDate = new Date(dateString).getTime();

    try {
      await updateContent({
        id: draggableId as Id<"content_calendar">,
        targetDate: newTargetDate,
      });
    } catch (error) {
      console.error("Failed to update content date:", error);
    }
  };

  const goToPreviousMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const goToNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const goToToday = () => setCurrentMonth(new Date());

  return (
    <div className="space-y-4">
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={goToPreviousMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-2xl font-bold min-w-[200px] text-center">
            {format(currentMonth, "MMMM yyyy")}
          </h2>
          <Button variant="outline" size="icon" onClick={goToNextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <Button variant="outline" onClick={goToToday}>
          Today
        </Button>
      </div>

      {/* Calendar Grid */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-7 gap-2">
          {/* Weekday Headers */}
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
            <div
              key={day}
              className="text-center text-sm font-semibold text-muted-foreground py-2"
            >
              {day}
            </div>
          ))}

          {/* Calendar Days */}
          {calendarDays.map((day) => {
            const dateKey = format(day, "yyyy-MM-dd");
            const dayContent = contentByDate[dateKey] || [];
            const isCurrentMonth = isSameMonth(day, currentMonth);
            const isTodayDate = isToday(day);

            return (
              <Droppable key={dateKey} droppableId={`date-${dateKey}`}>
                {(provided, snapshot) => (
                  <Card
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`
                      min-h-[120px] 
                      ${!isCurrentMonth ? "opacity-40" : ""}
                      ${isTodayDate ? "border-accent-primary border-2" : ""}
                      ${snapshot.isDraggingOver ? "bg-muted/50" : ""}
                      transition-colors
                    `}
                  >
                    <CardHeader className="p-2">
                      <div className="flex items-center justify-between">
                        <span
                          className={`
                            text-sm font-medium
                            ${isTodayDate ? "text-accent-primary font-bold" : ""}
                          `}
                        >
                          {format(day, "d")}
                        </span>
                        {isCurrentMonth && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => onAddContent(day)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="p-2 pt-0 space-y-1">
                      {dayContent.map((item, index) => (
                        <Draggable
                          key={item._id}
                          draggableId={item._id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={snapshot.isDragging ? "opacity-50" : ""}
                            >
                              <ContentCalendarItem
                                content={item}
                                onClick={() => onContentClick(item)}
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </CardContent>
                  </Card>
                )}
              </Droppable>
            );
          })}
        </div>
      </DragDropContext>

      {/* Legend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Status Legend</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {Object.entries(STATUS_COLORS).map(([status, colorClass]) => (
            <div key={status} className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-sm border ${colorClass}`} />
              <span className="text-xs capitalize">{status}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function ContentCalendarItem({
  content,
  onClick,
}: {
  content: ContentItem;
  onClick: () => void;
}) {
  const Icon = TYPE_ICONS[content.type] || FileText;
  const colorClass = STATUS_COLORS[content.status];

  return (
    <div
      onClick={onClick}
      className={`
        group cursor-pointer rounded-md p-1.5 text-xs border 
        ${colorClass}
        hover:shadow-md hover:scale-105 
        active:scale-95
        transition-all duration-200
      `}
    >
      <div className="flex items-start gap-1">
        <Icon className="h-3 w-3 flex-shrink-0 mt-0.5" />
        <span className="line-clamp-2 font-medium flex-1">
          {content.title}
        </span>
      </div>
      {content.platform && (
        <div className="text-[10px] opacity-75 mt-0.5">
          {content.platform}
        </div>
      )}
    </div>
  );
}
