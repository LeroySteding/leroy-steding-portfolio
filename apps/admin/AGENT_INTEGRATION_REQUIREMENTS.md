# Agent Integration Requirements
**Admin App Enhancement for Multi-Agent Coordination**

## 📋 Overview

Transform admin.leroysteding.nl into a full-featured command center for managing the multi-agent system. Enable real-time monitoring, task coordination, memory management, and cross-agent collaboration.

---

## 🎯 Goals

1. **Visibility** - See what all agents are doing in real-time
2. **Control** - Assign, track, and manage tasks across agents
3. **Memory** - Shared knowledge base accessible to all agents
4. **Coordination** - Facilitate handoffs and collaboration
5. **Insights** - Performance metrics and bottleneck detection

---

## 🚀 Phase 1: Core Agent Operations (2-3 days)

### 1.1 ActiveTasks Component

**Location**: `src/components/active-tasks.tsx`

**Features**:
- Kanban board with columns: Pending, In Progress, Blocked, Completed
- Drag-and-drop task assignment between agents
- Real-time updates via Convex subscriptions
- Quick actions: assign, block, complete, cancel

**UI Requirements**:
```typescript
interface TaskCard {
  id: string;
  title: string;
  status: 'pending' | 'in_progress' | 'blocked' | 'completed' | 'cancelled';
  assignedTo: string[]; // Agent names
  priority: 'low' | 'medium' | 'high' | 'critical';
  createdBy: string;
  createdAt: number;
  updatedAt: number;
  dependencies?: string[]; // Task IDs
  linearIssueId?: string;
  blockedReason?: string;
}
```

**User Stories**:
- As Orchestrator, I want to see all active tasks in a kanban view
- As any agent, I want to update task status without leaving the dashboard
- As an agent, I want to see who's blocked on what so I can help
- As a user, I want to see which tasks are waiting on dependencies

**API Calls**:
- `useQuery(api.agentCoordination.getAgentTasks)` - Real-time task list
- `useMutation(api.agentCoordination.updateAgentTask)` - Status updates
- `useMutation(api.agentCoordination.createAgentTask)` - New task creation

**Design Notes**:
- Use shadcn/ui Card components
- Priority color coding (red = critical, orange = high, yellow = medium, gray = low)
- Agent avatars with emoji icons (from existing agentIcons map)
- Task age indicators (< 1h = new, > 24h = aging, > 48h = stale)

---

### 1.2 Task Assignment UI

**Location**: `src/app/(admin)/tasks/page.tsx` enhancement

**Features**:
- "Assign Task" modal with agent selector
- Multi-agent assignment support
- Task templates for common workflows
- Dependency selection (link to other tasks)
- Linear issue linking

**Form Fields**:
```typescript
interface TaskForm {
  title: string;
  description?: string;
  assignedTo: string[]; // Multi-select dropdown
  priority: 'low' | 'medium' | 'high' | 'critical';
  context?: string; // Rich text editor
  dependencies?: string[]; // Task ID picker
  linearIssueId?: string; // Linear integration
  caseFileId?: string; // Link to case file
}
```

**Validation**:
- Title required (min 3 chars)
- At least one assignee
- Circular dependency detection
- Linear issue ID format validation

**User Stories**:
- As Orchestrator, I want to quickly create tasks from templates
- As any user, I want to assign tasks to multiple agents at once
- As a planner, I want to define task dependencies upfront
- As a PM, I want to link tasks to Linear issues for tracking

---

### 1.3 Task Detail View

**Location**: `src/app/(admin)/tasks/[id]/page.tsx` enhancement

**Features**:
- Full task details with edit mode
- Activity timeline (status changes, comments, handoffs)
- Agent conversation thread (comments)
- Related tasks (dependencies + dependents)
- Linear issue embed (if linked)

**Components**:
- Task header (title, status badge, priority, assignees)
- Activity feed (who did what when)
- Comment section (agents can discuss)
- Related tasks sidebar
- Actions: Edit, Block, Complete, Delete

**User Stories**:
- As an agent, I want to see full context before starting a task
- As Orchestrator, I want to see task history and handoffs
- As any agent, I want to comment on tasks without leaving the dashboard
- As a PM, I want to jump to the Linear issue for more context

---

## 🧠 Phase 2: Memory & Context (3-4 days)

### 2.1 Agent Memory Browser

**Location**: `src/components/agent-memory.tsx`

**Features**:
- Searchable memory entries (full-text search)
- Filter by: agent, category, tags, date range
- Memory cards with preview + expand
- Create/edit memory entries (rich text)
- Share memory with specific agents or "all"

**Schema** (already in Convex):
```typescript
interface AgentMemory {
  agentName: string;
  category: 'insight' | 'decision' | 'learning' | 'context' | 'preference';
  content: string;
  tags: string[];
  sharedWith: 'all' | string[]; // Agent names or "all"
  importance: 'low' | 'medium' | 'high';
  relatedTasks?: string[];
  caseFileId?: string;
  expiresAt?: number; // Optional TTL
  metadata?: any;
}
```

**UI Layout**:
```
┌─────────────────────────────────────────────┐
│ 🧠 Agent Memory            [+ New Memory]   │
├─────────────────────────────────────────────┤
│ [Search...] [Agent ▼] [Category ▼] [Tags]  │
├─────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────┐ │
│ │ 🔍 Researcher • Insight • 2h ago        │ │
│ │ Market analysis shows...                │ │
│ │ Tags: market, saas, pricing             │ │
│ │ [View Details] [Edit] [Delete]          │ │
│ └─────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────┐ │
│ │ ⚡ Coder • Decision • 5h ago            │ │
│ │ Chose Next.js 15 for admin app          │ │
│ │ Tags: tech-stack, nextjs                │ │
│ └─────────────────────────────────────────┘ │
└─────────────────────────────────────────────┘
```

**User Stories**:
- As any agent, I want to search past insights before researching
- As Researcher, I want to log findings so other agents can reference them
- As Orchestrator, I want to see what decisions were made and why
- As any agent, I want to filter memory by project tags

---

### 2.2 Case Files UI

**Location**: `src/components/case-files.tsx` + detail page

**Features**:
- Case file list (active, archived)
- Case detail view with tabs:
  - Overview (summary, participants, status)
  - Timeline (chronological activity)
  - Resources (links, files, references)
  - Decisions (key decisions made)
  - Tasks (linked agent tasks)
- Rich text editor for case summary
- Add participants (agents)
- Attach resources (URLs, file references)

**Schema** (already in Convex):
```typescript
interface CaseFile {
  projectName: string;
  summary: string;
  participants: string[]; // Agent names
  status: 'active' | 'completed' | 'archived';
  resources?: Array<{
    type: 'url' | 'file' | 'note';
    title: string;
    content: string;
  }>;
  decisions?: Array<{
    decision: string;
    rationale: string;
    madeBy: string;
    timestamp: number;
  }>;
  tags?: string[];
  metadata?: any;
}
```

**User Stories**:
- As Orchestrator, I want to create case files for complex projects
- As any agent, I want to see all context for a project in one place
- As Architect, I want to log architectural decisions in case files
- As Business, I want to reference past case files for similar projects

---

### 2.3 Shared Context Editor

**Location**: Part of case file detail view

**Features**:
- Collaborative rich text editor (Tiptap)
- Real-time updates (Convex subscriptions)
- Version history (audit trail)
- Mentions (@agent-name to notify)
- Code blocks, images, links support

**Technical**:
- Already have Tiptap in admin app
- Add collaboration plugin for multi-user editing
- Store editor content as JSON in Convex
- Emit notifications on @mentions

**User Stories**:
- As multiple agents, we want to co-author case summaries
- As any agent, I want to @mention others for review
- As a reviewer, I want to see who changed what and when

---

## 📊 Phase 3: Monitoring & Insights (2-3 days)

### 3.1 Agent Performance Metrics

**Location**: `src/app/(admin)/agents/page.tsx` enhancement

**Features**:
- Agent stats cards:
  - Tasks completed (last 7d, 30d, all-time)
  - Average task duration
  - Success rate (completed vs cancelled)
  - Current workload (active tasks)
- Performance charts (recharts):
  - Tasks over time (line chart)
  - Task distribution by priority (pie chart)
  - Agent workload comparison (bar chart)
- Leaderboard (most productive agents)

**Metrics to Track**:
```typescript
interface AgentMetrics {
  agentName: string;
  tasksCompleted: number;
  tasksInProgress: number;
  tasksCancelled: number;
  avgCompletionTime: number; // ms
  totalActiveTime: number; // ms
  lastActive: number;
  successRate: number; // % completed
}
```

**User Stories**:
- As a manager, I want to see which agents are most productive
- As Orchestrator, I want to balance workload across agents
- As any user, I want to see agent trends over time
- As a PM, I want to identify bottlenecks in the workflow

---

### 3.2 Task Completion Analytics

**Location**: `src/app/(admin)/analytics/page.tsx` (new)

**Features**:
- Task flow visualization (pending → in_progress → completed)
- Bottleneck detection (tasks stuck in_progress > 24h)
- Dependency graph (tasks waiting on others)
- Time-to-completion by priority
- Agent collaboration patterns (handoff frequency)

**Charts**:
1. Task flow Sankey diagram
2. Bottleneck heatmap (tasks aging)
3. Dependency network graph
4. Completion time distribution (histogram)
5. Agent collaboration matrix

**User Stories**:
- As Orchestrator, I want to see where tasks get stuck
- As a PM, I want to optimize task dependencies
- As a manager, I want to see agent collaboration patterns
- As any user, I want to predict task completion times

---

### 3.3 Real-time Activity Feed

**Location**: `src/components/activity-feed.tsx`

**Features**:
- Live feed of agent actions (already exists as `agent_feed` table)
- Filter by: agent, event type, priority
- Event types:
  - task_created, task_updated, task_completed
  - memory_created, memory_shared
  - case_file_created, case_file_updated
  - agent_status_change (online, offline, active, idle)
- Notifications badge (unread count)
- Mark as read functionality

**UI**:
```
┌─────────────────────────────────────────────┐
│ 📡 Activity Feed              🔴 5 unread   │
├─────────────────────────────────────────────┤
│ 🔍 Researcher                    2m ago     │
│ Completed research on SaaS pricing          │
│                                             │
│ ⚡ Coder                          5m ago     │
│ Started task: Build ActiveTasks component   │
│                                             │
│ 🎯 Orchestrator                 10m ago     │
│ Created case file: Admin Integration        │
└─────────────────────────────────────────────┘
```

**User Stories**:
- As any user, I want to see recent agent activity at a glance
- As an agent, I want to be notified when tasks are assigned to me
- As Orchestrator, I want to see when agents come online/offline
- As any user, I want to filter the feed by agent or event type

---

## 🔗 Phase 4: Linear Integration (1-2 days)

### 4.1 Linear Sync

**Location**: `convex/linearIntegration.ts` (new)

**Features**:
- Two-way sync between agent tasks and Linear issues
- Create Linear issue from admin task
- Import Linear issues as agent tasks
- Status sync (In Progress, Done, Cancelled)
- Comment sync (agent comments → Linear, Linear comments → agent feed)

**Linear API Integration**:
- Use `@linear/sdk` (already installed)
- Store Linear API key in Convex env vars
- Webhook listener for Linear updates
- Mutation to create/update issues

**Sync Rules**:
- Agent task status "completed" → Linear issue status "Done"
- Linear issue assigned → Create agent task if not exists
- Agent comments → Linear comments (with "🤖 Agent:" prefix)
- Linear comments → Agent feed entries

**User Stories**:
- As a PM, I want agent tasks to appear in Linear automatically
- As an agent, I want to update Linear issues without leaving the dashboard
- As a team, we want one source of truth (bidirectional sync)
- As any user, I want to see Linear discussions in the admin app

---

### 4.2 Linear Issue Viewer

**Location**: `src/components/linear-issue-embed.tsx`

**Features**:
- Embed Linear issue in task detail view
- Display: title, description, status, assignee, comments
- Quick actions: Update status, add comment, open in Linear
- Real-time updates via webhook

**UI**:
```
┌─────────────────────────────────────────────┐
│ 🔗 Linear Issue: STE-123                    │
├─────────────────────────────────────────────┤
│ Title: Build ActiveTasks component          │
│ Status: In Progress  Assignee: @coder       │
│                                             │
│ Description:                                │
│ Create kanban board for agent tasks...      │
│                                             │
│ 💬 3 comments  [View in Linear →]          │
└─────────────────────────────────────────────┘
```

**User Stories**:
- As an agent, I want to see Linear issue details without leaving the app
- As a PM, I want to add comments to Linear from the admin app
- As any user, I want to jump to Linear for full issue context

---

## 🛠️ Technical Specifications

### Architecture

**Frontend** (Next.js 15 + React 19):
- Server Components for initial load (task lists, case files)
- Client Components for real-time updates (activity feed, agent status)
- Convex React hooks for subscriptions (`useQuery`)
- Optimistic updates with `useMutation`

**Backend** (Convex):
- Real-time subscriptions for live data
- Mutations for CRUD operations
- Scheduled functions for metrics aggregation
- Webhooks for Linear integration

**State Management**:
- Convex handles server state
- React Context for UI state (sidebar open, filters)
- No Redux needed (Convex is the single source of truth)

---

### Convex Schema Enhancements

**New Tables**:
None needed - all tables already exist:
- `agent_tasks` ✅
- `agent_memory` ✅
- `agent_sessions` ✅
- `case_files` ✅
- `agent_feed` ✅

**New Indexes** (for performance):
```typescript
// In schema.ts
defineTable({
  agent_tasks: {
    indexes: [
      'status', // Filter by status
      'assignedTo', // Filter by agent
      'priority', // Sort by priority
      'createdAt', // Sort by date
    ]
  },
  agent_memory: {
    indexes: [
      'agentName',
      'category',
      'tags', // Full-text search
      'importance',
    ]
  }
});
```

**New Mutations** (add to `agentCoordination.ts`):
```typescript
// Batch operations
export const assignTasksToAgent = mutation({...});
export const bulkUpdateTaskStatus = mutation({...});

// Memory operations
export const searchAgentMemory = query({...}); // Full-text search
export const getMemoryByTags = query({...});

// Metrics
export const getAgentMetrics = query({...});
export const getTaskAnalytics = query({...});

// Linear sync
export const syncLinearIssue = mutation({...});
export const handleLinearWebhook = mutation({...});
```

---

### Component Architecture

**Shared Components** (`src/components/`):
```
components/
├── agent-status.tsx ✅ (already exists)
├── active-tasks.tsx (Phase 1.1)
├── task-card.tsx (Phase 1.1)
├── task-form.tsx (Phase 1.2)
├── agent-memory.tsx (Phase 2.1)
├── memory-card.tsx (Phase 2.1)
├── case-files.tsx (Phase 2.2)
├── case-file-detail.tsx (Phase 2.2)
├── activity-feed.tsx (Phase 3.3)
├── agent-metrics.tsx (Phase 3.1)
├── task-analytics.tsx (Phase 3.2)
└── linear-issue-embed.tsx (Phase 4.2)
```

**Page Structure**:
```
app/(admin)/
├── dashboard/page.tsx (overview with cards)
├── agents/page.tsx ✅ (agent status + metrics)
├── tasks/
│   ├── page.tsx (kanban board)
│   └── [id]/page.tsx (task detail)
├── memory/page.tsx (memory browser)
├── cases/
│   ├── page.tsx (case file list)
│   └── [id]/page.tsx (case detail)
└── analytics/page.tsx (charts & insights)
```

---

### API Routes (Next.js)

**Webhooks** (`app/api/webhooks/`):
```typescript
// app/api/webhooks/linear/route.ts
export async function POST(req: Request) {
  // Verify Linear webhook signature
  // Parse webhook payload
  // Call Convex mutation to sync
  // Return 200 OK
}
```

**Cron Jobs** (Convex scheduled functions):
```typescript
// convex/cron.ts
export const aggregateMetrics = internalMutation({
  handler: async (ctx) => {
    // Calculate agent metrics
    // Store in metrics table
    // Run every hour
  }
});

export const detectBottlenecks = internalMutation({
  handler: async (ctx) => {
    // Find tasks stuck > 24h
    // Create alerts in agent_feed
    // Run every 6 hours
  }
});
```

---

## 🎨 Design System

**Colors** (already defined):
- Orchestrator: Purple (`bg-purple-500`)
- Architect: Blue (`bg-blue-500`)
- Coder: Yellow (`bg-yellow-500`)
- Researcher: Green (`bg-green-500`)
- Business: Pink (`bg-pink-500`)
- Data Scraper: Orange (`bg-orange-500`)
- QA Critic: Red (`bg-red-500`)
- Compliance: Indigo (`bg-indigo-500`)

**Icons** (Lucide React):
- 🎯 Orchestrator (`Target`)
- 🏗️ Architect (`Building`)
- ⚡ Coder (`Zap`)
- 🔍 Researcher (`Search`)
- 💼 Business (`Briefcase`)
- 🕷️ Data Scraper (`Bug`)
- 🛡️ QA Critic (`Shield`)
- ⚖️ Compliance (`Scale`)

**Typography**:
- Headings: `font-bold tracking-tight`
- Body: Default (Inter via Next.js)
- Code: `font-mono` (JetBrains Mono via Tailwind)

**Spacing**:
- Page padding: `py-8 px-4`
- Card spacing: `space-y-4`
- Grid gaps: `gap-6`

---

## 📦 Dependencies

**Already Installed** ✅:
- `@clerk/nextjs` - Auth
- `convex` - Backend
- `@linear/sdk` - Linear integration
- `@tiptap/*` - Rich text editor
- `lucide-react` - Icons
- `date-fns` - Date formatting
- `recharts` - Charts (if not installed, add it)
- `@radix-ui/*` - UI primitives

**To Add**:
```bash
pnpm add recharts @radix-ui/react-tabs
```

---

## 🧪 Testing Strategy

**Unit Tests** (Vitest):
- Convex mutations (mock ctx)
- Utility functions (date formatting, etc.)
- Component logic (hooks, state)

**Integration Tests**:
- Task assignment flow
- Linear sync bidirectional
- Real-time updates

**E2E Tests** (Playwright):
- Full task lifecycle (create → assign → complete)
- Agent status updates
- Memory search & filter

**Manual Testing**:
- Multi-agent collaboration
- Real-time updates across tabs
- Mobile responsiveness

---

## 📝 Implementation Checklist

### Phase 1: Core Agent Operations
- [ ] ActiveTasks kanban component
- [ ] Task assignment modal
- [ ] Task detail view enhancements
- [ ] Drag-and-drop task reassignment
- [ ] Task dependency picker
- [ ] Status badge components

### Phase 2: Memory & Context
- [ ] Agent Memory browser UI
- [ ] Memory search (full-text)
- [ ] Memory creation form
- [ ] Case Files list view
- [ ] Case File detail view
- [ ] Shared context editor (Tiptap)
- [ ] Version history tracking

### Phase 3: Monitoring & Insights
- [ ] Agent performance metrics cards
- [ ] Task completion analytics
- [ ] Activity feed enhancements
- [ ] Charts integration (recharts)
- [ ] Bottleneck detection logic
- [ ] Notification badge system

### Phase 4: Linear Integration
- [ ] Linear API integration (Convex)
- [ ] Two-way sync mutations
- [ ] Linear webhook handler
- [ ] Issue embed component
- [ ] Comment sync logic
- [ ] Status mapping (agent ↔ Linear)

### Polish & Launch
- [ ] Mobile responsive layouts
- [ ] Dark mode polish
- [ ] Loading states (skeletons)
- [ ] Error boundaries
- [ ] Toast notifications (success/error)
- [ ] Keyboard shortcuts
- [ ] Documentation (user guide)
- [ ] Deploy to Vercel

---

## 📚 Resources

**Existing Code**:
- `/apps/admin/src/components/agent-status.tsx` - Reference for agent display
- `/apps/admin/convex/agentCoordination.ts` - Backend mutations
- `/apps/admin/src/app/agents/page.tsx` - Agent dashboard page

**Documentation**:
- [Convex Docs](https://docs.convex.dev)
- [Linear API](https://developers.linear.app/docs/graphql/working-with-the-graphql-api)
- [shadcn/ui](https://ui.shadcn.com)
- [Tiptap Collaboration](https://tiptap.dev/docs/editor/extensions/functionality/collaboration)

**Design Inspiration**:
- Linear's task detail view
- Notion's workspace sidebar
- GitHub Projects kanban

---

## 🚦 Success Metrics

**Functionality**:
- ✅ All agents visible in real-time
- ✅ Tasks assigned/tracked without Telegram
- ✅ Memory searchable by all agents
- ✅ Case files capture project context
- ✅ Linear issues auto-sync

**Performance**:
- < 100ms page load (Next.js SSR)
- < 50ms real-time updates (Convex)
- Full-text search < 200ms

**UX**:
- 0 broken links
- Mobile responsive (all pages)
- Dark mode works everywhere
- Keyboard shortcuts documented

---

## 🤝 Collaboration

**Roles**:
- **Researcher** (me): Requirements, specs, research
- **Orchestrator**: Prioritization, task assignment
- **Architect**: Technical design, API design
- **Coder**: Implementation, testing
- **Business**: UX copy, user flows

**Communication**:
- Use Telegram group for updates
- Linear issues for tracking
- Convex agent_feed for async updates
- Admin dashboard for transparency

---

**Document Version**: 1.0  
**Created**: 2024-02-14  
**Author**: Researcher Agent 🔍  
**Status**: Ready for Review
