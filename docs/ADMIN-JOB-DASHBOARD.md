# Job Applications Dashboard

**Implementation:** ADMIN-01  
**Date:** 2026-02-27  
**Author:** Coder Agent

## Overview

A comprehensive Kanban-style job applications dashboard at `/admin/jobs` that helps track and manage the job search pipeline. Features drag-and-drop cards, analytics, date range filters, and mobile-responsive design.

## Features

### 1. **4-Column Kanban Board**
Simplified status workflow:
- **Applied** - Includes: discovered, researching, applying, applied
- **Interviewing** - Active interview process
- **Offer** - Job offers received
- **Rejected** - Includes: rejected, withdrawn

### 2. **Drag & Drop**
- Powered by `@hello-pangea/dnd` (maintained fork of react-beautiful-dnd)
- Smooth animations and visual feedback
- Automatic status updates on drop
- Works on desktop and tablet
- Shows dragging state with opacity change

### 3. **Analytics Panel**
Four key metrics cards:

#### Total Applications
- Shows total applications in selected date range
- Displays count of active applications
- Icon: Building2

#### Success Rate
- Formula: `offers / (offers + rejected) * 100`
- Shows trending indicator (up/down arrow)
- Green if > 50%, red if ≤ 50%
- Displays offer vs rejected breakdown

#### Response Rate
- Formula: `(interviewing + offers + rejected) / applied * 100`
- Shows percentage of companies that responded
- Icon: CheckCircle2

#### Average Response Time
- Calculates days from `appliedAt` to status change
- Only includes jobs that progressed to interviewing/offer/rejected
- Displays in days (e.g., "14d")
- Icon: Clock

### 4. **Date Range Filters**
- **Last 7 days** - Recent activity
- **Last 30 days** - Default view
- **Last 90 days** - Quarterly overview
- **All time** - Complete history

Filters apply to:
- All job cards in Kanban columns
- Analytics calculations
- Trending indicators

### 5. **Trending Indicators**
Week-over-week comparison for each column:
- Compares last 7 days vs previous 7 days
- Shows percentage change (e.g., "+25%", "-10%")
- Green arrow up for positive trend
- Red arrow down for negative trend
- Hidden for Rejected column

### 6. **Job Cards**
Compact, informative cards with:
- Position title (2-line clamp)
- Company name
- Salary range (if specified)
- Location + Remote badge
- Up to 2 tags + "+N" badge for more
- Time since creation ("3 days ago")
- Hover effects: shadow + scale
- Active state: scale down

### 7. **Job Detail Dialog**
Full-screen modal with:
- Editable status dropdown
- Details grid (location, salary, remote, dates)
- Notes section (pre-wrapped text)
- Next action details
- All tags displayed
- Contact information
- LinkedIn links for contacts
- "View Posting" button
- Responsive layout

### 8. **Mobile-Responsive**
- **Desktop (lg):** 4 columns side-by-side
- **Tablet (md):** 2 columns
- **Mobile:** Single column stacked view
- Touch-friendly card sizes
- Collapsible analytics panel

## Technical Architecture

### Component Structure
```
JobsPage (Container)
├── Header
│   ├── Title & Description
│   ├── Date Range Filter
│   ├── Toggle Analytics Button
│   └── Add Job Button
├── Analytics Panel (4 cards, collapsible)
│   ├── Total Applications
│   ├── Success Rate
│   ├── Response Rate
│   └── Avg Response Time
├── DragDropContext
│   └── 4 Columns (Droppable)
│       └── Job Cards (Draggable)
│           └── JobCard Component
└── Dialogs
    ├── JobDetailDialog
    └── AddJobForm
```

### State Management
```typescript
const [isAddingJob, setIsAddingJob] = useState(false);
const [dateRange, setDateRange] = useState<DateRange>("30d");
const [selectedJob, setSelectedJob] = useState<any>(null);
const [showAnalytics, setShowAnalytics] = useState(true);
```

### Data Flow
1. **Query:** `useQuery(api.jobs.list)` fetches all jobs
2. **Filter:** `useMemo` applies date range filter
3. **Analytics:** `useMemo` calculates metrics from filtered jobs
4. **Group:** Jobs grouped by column status
5. **Mutation:** `useMutation(api.jobs.updateStatus)` on drag
6. **Re-render:** Convex reactivity updates UI

### Drag & Drop Implementation
```typescript
<DragDropContext onDragEnd={handleDragEnd}>
  <Droppable droppableId={column.id}>
    {(provided, snapshot) => (
      <div ref={provided.innerRef} {...provided.droppableProps}>
        {column.jobs.map((job, index) => (
          <Draggable key={job._id} draggableId={job._id} index={index}>
            {(provided, snapshot) => (
              <div 
                ref={provided.innerRef} 
                {...provided.draggableProps} 
                {...provided.dragHandleProps}
              >
                <JobCard job={job} />
              </div>
            )}
          </Draggable>
        ))}
        {provided.placeholder}
      </div>
    )}
  </Droppable>
</DragDropContext>
```

### Analytics Calculations

#### Success Rate
```typescript
const concluded = offers + rejected;
const successRate = concluded > 0 ? (offers / concluded) * 100 : 0;
```

#### Response Rate
```typescript
const responded = interviewing + offers + rejected;
const responseRate = applied > 0 ? (responded / applied) * 100 : 0;
```

#### Average Response Time
```typescript
const jobsWithResponse = filteredJobs.filter(j => 
  j.appliedAt && ["interviewing", "offer", "rejected"].includes(j.status)
);
const avgResponseTime = jobsWithResponse.length > 0
  ? jobsWithResponse.reduce((sum, j) => 
      sum + differenceInDays(j._creationTime, j.appliedAt!), 0
    ) / jobsWithResponse.length
  : 0;
```

#### Trending Calculation
```typescript
const now = Date.now();
const last7Days = subDays(now, 7).getTime();
const prev7Days = subDays(now, 14).getTime();

const recentApplied = filteredJobs.filter(j => 
  j.createdAt >= last7Days && column.statuses.includes(j.status)
).length;

const prevApplied = filteredJobs.filter(j => 
  j.createdAt >= prev7Days && j.createdAt < last7Days && column.statuses.includes(j.status)
).length;

const trendingPercent = prevApplied > 0 
  ? ((recentApplied - prevApplied) / prevApplied) * 100 
  : 0;
```

## Convex Integration

### Queries Used
- `api.jobs.list` - Fetch all job applications
- Returns array with fields: `_id`, `company`, `position`, `status`, `salary`, `location`, `remote`, `tags`, `notes`, `url`, `createdAt`, `appliedAt`, `contacts`, `nextAction`, `nextActionDate`

### Mutations Used
- `api.jobs.updateStatus({ id, status })` - Update job status (drag & drop)
- `api.jobs.create({ ...data })` - Create new job application
- Both require auth via `requireAuth(ctx)`

### Schema Fields (job_applications table)
```typescript
{
  company: string,
  position: string,
  url?: string,
  status: "discovered" | "researching" | "applying" | "applied" | 
          "interviewing" | "offer" | "rejected" | "withdrawn",
  salary?: string,
  location?: string,
  remote?: boolean,
  notes?: string,
  contacts?: Array<{
    name: string,
    role?: string,
    linkedin?: string
  }>,
  appliedAt?: number,  // Timestamp when status changed to "applied"
  nextAction?: string,
  nextActionDate?: number,
  tags: string[],
  createdAt: number
}
```

## UI Components Used

### shadcn/ui Components
- **Card** - Job cards, analytics cards, empty states
- **Badge** - Status counts, tags, remote indicator
- **Button** - Actions, add job, filters
- **Dialog** - Job details, add job form
- **Input** - Form fields
- **Textarea** - Notes field
- **Label** - Form labels
- **Select** - Date range, status dropdown

### Lucide Icons
- `Building2` - Company
- `MapPin` - Location
- `DollarSign` - Salary
- `Plus` - Add job
- `TrendingUp/TrendingDown` - Trending indicators
- `Clock` - Response time
- `CheckCircle2` - Success
- `XCircle` - Rejected
- `Calendar` - Date filter
- `BarChart3` - Analytics toggle
- `ExternalLink` - View posting
- `Filter` - Filters
- `Eye` - View details

### Utility Libraries
- **date-fns** - Date formatting, calculations
  - `formatDistanceToNow` - Relative time
  - `differenceInDays` - Time calculation
  - `format` - Date display
  - `subDays` - Date math
  - `startOfDay`, `endOfDay` - Range helpers

## Styling

### Tailwind Classes
- **Layout:** `grid`, `grid-cols-*`, `gap-*`, `space-y-*`, `flex`
- **Responsive:** `md:`, `lg:` breakpoint prefixes
- **Colors:** Custom color palette from admin theme
- **Spacing:** Consistent `p-*`, `m-*`, `gap-*`
- **Transitions:** `transition-*`, `hover:`, `active:`
- **Borders:** `border-*`, `rounded-*`

### Column Colors
```typescript
Applied:      bg-blue-50 border-blue-200
Interviewing: bg-purple-50 border-purple-200
Offer:        bg-green-50 border-green-200
Rejected:     bg-red-50 border-red-200
```

### Hover Effects
- Cards: `hover:shadow-lg hover:scale-[1.02]`
- Active: `active:scale-95`
- Dragging: `opacity-50`

## Performance Optimizations

### useMemo for Heavy Calculations
1. **filteredJobs** - Applies date range filter
2. **analytics** - Calculates all metrics
3. **jobsByColumn** - Groups jobs by column

Without memoization, these would recalculate on every render.

### Lazy Loading
- Dialogs only render when open
- Job detail content fetched on-demand

### Efficient Re-renders
- Convex reactivity only updates changed data
- Drag & drop state isolated to specific cards

## Accessibility

- **Keyboard Navigation:** All interactive elements focusable
- **ARIA Labels:** Descriptive labels on buttons/icons
- **Semantic HTML:** Proper heading hierarchy
- **Focus States:** Visible focus rings
- **Screen Readers:** Meaningful text alternatives

## Mobile UX

### Touch Targets
- Minimum 44×44px tap targets
- Generous card padding
- Large drag handles

### Layout Adaptation
- Single column on mobile
- Stacked analytics cards
- Full-width dialogs
- Touch-friendly spacing

### Performance
- Lazy load images (none currently)
- Smooth 60fps animations
- Minimal re-renders

## Usage Examples

### View Jobs by Date Range
1. Click date range dropdown (top right)
2. Select "Last 7 days", "Last 30 days", etc.
3. Kanban and analytics update instantly

### Drag Job to New Status
1. Click and hold job card
2. Drag to target column
3. Release to drop
4. Status updates automatically

### View Job Details
1. Click any job card
2. Dialog opens with full details
3. Edit status via dropdown
4. View posting link (if available)
5. Close dialog

### Add New Job
1. Click "Add Job" button
2. Fill in company and position (required)
3. Optionally add URL, salary, location, tags, notes
4. Click "Add Application"
5. Job appears in Applied column

### Toggle Analytics
1. Click chart icon (top right, next to date filter)
2. Analytics panel collapses/expands
3. More space for Kanban board when hidden

## Future Enhancements

Potential improvements for later:

1. **Bulk Actions** - Select multiple jobs, update status
2. **Export** - Download as CSV/Excel
3. **Email Integration** - Track correspondence
4. **Calendar View** - See interviews by date
5. **Reminders** - Notifications for next actions
6. **Company Research** - Auto-fetch company info
7. **Salary Insights** - Compare against market data
8. **Application Templates** - Save cover letters
9. **LinkedIn Integration** - Import applications
10. **AI Suggestions** - Recommend similar jobs

## Testing Checklist

- [ ] Drag & drop works between all columns
- [ ] Analytics calculations are accurate
- [ ] Date range filter updates data
- [ ] Add job form validates required fields
- [ ] Job detail dialog shows all fields
- [ ] Status dropdown updates correctly
- [ ] Trending indicators show correct direction
- [ ] Mobile layout stacks properly
- [ ] Empty states display when no jobs
- [ ] External links open in new tab

## Related Documentation

- [Convex Schema](../convex/schema.ts)
- [Jobs API](../convex/jobs.ts)
- [Job Applications API](../convex/job_applications.ts)

## Support

For questions or issues:
- Check Linear task: `ADMIN-01`
- Review commit history for this feature
- Contact team in Telegram group
