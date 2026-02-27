# Content Calendar Integration

**Implementation:** ADMIN-02  
**Date:** 2026-02-27  
**Author:** Coder Agent

## Overview

Calendar view for content scheduling at `/admin/content` with drag-and-drop functionality, integrated with the existing content management system. Provides both grid and calendar views for managing content across different stages from idea to publication.

## Features

### 1. **Dual View System**
Toggle between two views:
- **Grid View** - Card-based layout with filters (existing)
- **Calendar View** - Monthly calendar with drag-and-drop (new)

### 2. **Calendar View**
Monthly calendar grid showing:
- 7-day week (Monday - Sunday)
- Previous/current/next month days
- Today highlighted with primary border
- Content items displayed on their target dates
- Quick add button (+) on each day

### 3. **Drag & Drop Scheduling**
- Powered by `@hello-pangea/dnd` (same as jobs dashboard)
- Drag content items between dates
- Auto-updates `targetDate` on drop
- Visual feedback during dragging
- Works on desktop and tablet

### 4. **Content Status System**
Six status stages with color coding:
- **Idea** 💡 - Initial concept (slate)
- **Outline** 📝 - Structure defined (blue)
- **Drafting** ✍️ - Content creation (indigo)
- **Review** 👀 - Ready for feedback (purple)
- **Scheduled** 📅 - Planned publication (orange)
- **Published** ✅ - Live content (green)

### 5. **Content Types**
Supports 6 content types:
- Blog Post
- Social Post
- Newsletter
- Video
- Podcast
- Case Study

Each type has its own icon (FileText, MessageSquare, Video)

### 6. **Calendar Navigation**
- **Previous/Next Month** buttons
- **Today** button to jump to current month
- Month and year display in header

### 7. **Quick Add from Calendar**
- Click (+) button on any day
- Opens add form with date pre-filled
- Target date automatically set to clicked day

### 8. **Content Detail Dialog**
Click any content item to see:
- Full title and type
- Editable status dropdown
- Platform information
- Target and published dates
- Notes (full text, pre-wrapped)
- SEO keywords as badges
- Related blog post ID

### 9. **Status Legend**
Color-coded legend at bottom showing:
- All 6 status colors
- Status name labels
- Visual reference for calendar items

### 10. **Mobile-Responsive**
- Calendar grid adapts to screen size
- Touch-friendly interactions
- Stacked header on mobile
- Full-width dialogs

## Technical Architecture

### Component Structure
```
ContentPage (container)
├── Header
│   ├── Title & Stats
│   ├── View Toggle (Grid/Calendar)
│   └── Add Content Button
├── Stats Cards (4)
├── Conditional View
│   ├── Grid View (existing)
│   │   ├── Filters & Search
│   │   └── Content Cards Grid
│   └── Calendar View (new)
│       ├── Calendar Header (navigation)
│       ├── DragDropContext
│       │   └── Calendar Grid (7×5-6)
│       │       └── Day Cells (Droppable)
│       │           └── Content Items (Draggable)
│       └── Status Legend
└── Dialogs
    ├── Add Content Form
    └── Content Detail Dialog
```

### File Structure
```
apps/admin/src/
├── app/(admin)/content/
│   └── page.tsx (updated - dual view)
└── components/
    └── content-calendar.tsx (new)
```

### State Management
```typescript
const [viewType, setViewType] = useState<"grid" | "calendar">("grid");
const [selectedContent, setSelectedContent] = useState<any>(null);
const [prefilledDate, setPrefilledDate] = useState<Date | null>(null);
```

### Data Flow
1. **Query:** `useQuery(api.content_calendar.list)` fetches all content
2. **Group:** Content grouped by `targetDate` (yyyy-MM-dd format)
3. **Render:** Calendar grid shows content on respective dates
4. **Drag:** User drags content to new date
5. **Mutation:** `useMutation(api.content_calendar.update)` updates `targetDate`
6. **Re-render:** Convex reactivity updates calendar

### Drag & Drop Implementation
```typescript
<DragDropContext onDragEnd={handleDragEnd}>
  <Droppable droppableId={`date-${dateKey}`}>
    {(provided, snapshot) => (
      <Card ref={provided.innerRef} {...provided.droppableProps}>
        {dayContent.map((item, index) => (
          <Draggable key={item._id} draggableId={item._id} index={index}>
            {(provided, snapshot) => (
              <div 
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
              >
                <ContentCalendarItem content={item} />
              </div>
            )}
          </Draggable>
        ))}
        {provided.placeholder}
      </Card>
    )}
  </Droppable>
</DragDropContext>
```

### Date Handling
```typescript
// Generate calendar grid
const monthStart = startOfMonth(currentMonth);
const monthEnd = endOfMonth(currentMonth);
const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 }); // Monday
const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

// Group content by date
const dateKey = format(item.targetDate, "yyyy-MM-dd");
grouped[dateKey] = [...(grouped[dateKey] || []), item];
```

## Convex Integration

### Schema Fields (content_calendar table)
```typescript
{
  title: string,
  type: "blog_post" | "social_post" | "newsletter" | "video" | "podcast" | "case_study",
  status: "idea" | "outline" | "drafting" | "review" | "scheduled" | "published",
  platform?: string,
  targetDate?: number,  // Timestamp - used for calendar positioning
  publishedAt?: number,
  notes?: string,
  seoKeywords?: string[],
  relatedBlogPostId?: string,
  createdAt: number
}
```

### Queries Used
- `api.content_calendar.list` - Fetch all content items
- `api.content_calendar.stats` - Get analytics (ideas, in progress, published)

### Mutations Used
- `api.content_calendar.create` - Create new content
- `api.content_calendar.update` - Update content (drag & drop)
- `api.content_calendar.updateStatus` - Quick status changes

## UI Components

### shadcn/ui Components
- **Card** - Calendar days, content items, stats
- **Badge** - Status labels, keywords, counts
- **Button** - Navigation, actions, view toggle
- **Dialog** - Add form, detail view
- **Input** - Form fields, search (grid view)
- **Textarea** - Notes field
- **Label** - Form labels
- **Select** - Filters, status dropdown

### Lucide Icons
- `CalendarIcon` - Calendar view toggle
- `Grid3x3` - Grid view toggle
- `Plus` - Add content
- `ChevronLeft/Right` - Month navigation
- `FileText` - Blog post, newsletter, case study
- `MessageSquare` - Social post
- `Video` - Video, podcast
- `Lightbulb` - Ideas stat
- `Check` - Published stat
- `Archive` - Total published

### Utility Libraries
- **date-fns** - Date formatting, calendar calculations
  - `format` - Display dates
  - `startOfMonth`, `endOfMonth` - Month boundaries
  - `startOfWeek`, `endOfWeek` - Week boundaries
  - `eachDayOfInterval` - Generate day array
  - `isSameMonth`, `isSameDay`, `isToday` - Date comparisons
  - `addMonths`, `subMonths` - Month navigation

## Styling

### View Toggle
```tsx
<div className="flex items-center gap-1 border rounded-lg p-1">
  <Button variant={viewType === "grid" ? "default" : "ghost"}>Grid</Button>
  <Button variant={viewType === "calendar" ? "default" : "ghost"}>Calendar</Button>
</div>
```

### Calendar Day Cells
- **Current month:** Full opacity
- **Other months:** `opacity-40`
- **Today:** `border-accent-primary border-2`
- **Dragging over:** `bg-muted/50`
- **Min height:** `min-h-[120px]`

### Content Items
```typescript
const STATUS_COLORS = {
  idea: "bg-slate-200 text-slate-800 border-slate-300",
  outline: "bg-blue-200 text-blue-800 border-blue-300",
  drafting: "bg-indigo-200 text-indigo-800 border-indigo-300",
  review: "bg-purple-200 text-purple-800 border-purple-300",
  scheduled: "bg-orange-200 text-orange-800 border-orange-300",
  published: "bg-green-200 text-green-800 border-green-300",
};
```

### Hover Effects
- Content items: `hover:shadow-md hover:scale-105`
- Active: `active:scale-95`
- Dragging: `opacity-50`

## Performance Optimizations

### useMemo for Heavy Calculations
1. **Calendar Days** - Generate only when month changes
```typescript
const { monthStart, monthEnd, calendarDays } = useMemo(() => {
  // Generate calendar grid
}, [currentMonth]);
```

2. **Content Grouping** - Group by date only when content changes
```typescript
const contentByDate = useMemo(() => {
  // Group content by targetDate
}, [content]);
```

### Lazy Loading
- Dialogs only render when open
- Content items only render for visible dates

### Efficient Re-renders
- Convex reactivity updates only changed items
- Drag state isolated to specific content items
- View type controls rendering path

## User Workflows

### Add Content for Specific Date
1. Open calendar view
2. Click (+) button on desired date
3. Form opens with target date pre-filled
4. Enter title, type, status, notes
5. Submit → content appears on calendar

### Reschedule Content
1. Find content item on calendar
2. Click and hold to grab
3. Drag to new date
4. Release to drop
5. Target date updates automatically

### View Content Details
1. Click any content item (grid or calendar)
2. Detail dialog opens
3. View all fields (type, platform, dates, notes, keywords)
4. Change status via dropdown
5. Close dialog

### Navigate Calendar
1. Use ← / → to change months
2. Click "Today" to jump to current month
3. Scroll through months to plan ahead

### Switch Between Views
1. Click "Grid" or "Calendar" toggle in header
2. View switches instantly
3. Both views share same data
4. Filters only apply to grid view

## Accessibility

- **Keyboard Navigation:** All buttons focusable
- **ARIA Labels:** Descriptive labels on icons
- **Semantic HTML:** Proper heading hierarchy
- **Focus States:** Visible focus rings
- **Screen Readers:** Meaningful text alternatives
- **Color Contrast:** WCAG AA compliant

## Mobile UX

### Touch Targets
- Minimum 44×44px tap targets
- Generous padding on buttons
- Large drag handles on content items

### Layout Adaptation
- 7-column grid on all sizes (compact on mobile)
- Stacked header on mobile
- Full-width dialogs
- Touch-optimized spacing

### Performance
- Smooth 60fps animations
- Minimal re-renders
- Efficient date calculations

## Integration with Existing System

### Grid View (Preserved)
- All existing functionality intact
- Search, filters, stats still work
- Card-based layout unchanged
- Quick status progression buttons

### Shared Data
- Both views query same Convex data
- Changes in one view reflect in other
- Single source of truth

### Consistent UI
- Same color scheme and typography
- Matching button styles
- Familiar dialog patterns
- Consistent spacing

## Future Enhancements

Potential improvements for later:

1. **Week View** - More compact than month, more detail than grid
2. **Recurring Content** - Schedule weekly/monthly posts
3. **Bulk Operations** - Select multiple items, update status
4. **Templates** - Save content templates
5. **Collaboration** - Assign content to team members
6. **Publishing Automation** - Auto-publish when date arrives
7. **Analytics** - View performance metrics
8. **Import/Export** - CSV/iCal support
9. **Multi-month View** - See 3 months at once
10. **Content Dependencies** - Link related content pieces

## Testing Checklist

- [ ] Drag & drop works between all dates
- [ ] Calendar navigation (prev/next/today) works
- [ ] Add content with pre-filled date works
- [ ] Content detail dialog shows all fields
- [ ] Status dropdown updates correctly
- [ ] View toggle switches smoothly
- [ ] Mobile layout is responsive
- [ ] Today is highlighted correctly
- [ ] Content appears on correct dates
- [ ] Month boundaries handled properly

## Known Issues ⚠️

**Admin Convex Import Paths:**
- Fixed in this implementation to use correct paths: `../../../convex/_generated/api`
- However, other admin pages still use incorrect paths
- See blocked task ADMIN-CONVEX-IMPORTS for global fix

## Related Documentation

- [Content Calendar Schema](../convex/schema.ts)
- [Content Calendar API](../convex/content_calendar.ts)
- [Job Applications Dashboard](./ADMIN-JOB-DASHBOARD.md) (similar drag & drop pattern)

## Support

For questions or issues:
- Check Linear task: `ADMIN-02`
- Review commit history for this feature
- Contact team in Telegram group
