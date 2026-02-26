# Comprehensive Codebase Analysis Report
## Portfolio/Admin Monorepo - Leroy Steding

**Analysis Date:** February 26, 2026  
**Analyst:** AI Code Analysis System  
**Project Location:** `~/Projects/personal/leroy-steding-portfolio/`

---

## Executive Summary

This is a sophisticated **multi-agent portfolio management system** built on a modern TypeScript monorepo architecture. The system combines a public-facing portfolio website with a comprehensive admin dashboard, backed by Convex's reactive database and integrated with multiple external services including Linear, GitHub, Clerk, and OpenClaw AI.

**Key Highlights:**
- **448 TypeScript files** totaling ~73,000 lines of code
- **Dual Next.js applications** (Portfolio + Admin) with distinct architectures
- **30-table Convex schema** with sophisticated agent coordination system
- **Real-time multi-agent workflow engine** with memory and session management
- **Production-ready integrations** with Linear, GitHub, Sanity CMS, and Clerk auth

---

## 1. Architecture Overview

### 1.1 Monorepo Structure

```
leroy-steding-portfolio/
├── apps/
│   ├── portfolio/          # Public-facing Next.js 16 portfolio site
│   ├── admin/              # Admin dashboard (Next.js + Clerk + Convex)
│   └── storybook/          # Component documentation & design system
├── packages/
│   ├── ui/                 # Shared UI component library (tsup build)
│   ├── utils/              # Shared utility functions
│   ├── timeline-scroll/    # Custom timeline carousel component
│   └── tsconfig/           # Shared TypeScript configurations
├── convex/                 # Backend - 28 function files, 30 tables
└── Root configuration (Turbo, pnpm, Biome)
```

### 1.2 Build System Configuration

**Turbo Repo** (`turbo.json`):
```json
{
  "tasks": {
    "build": { "dependsOn": ["^build"], "outputs": ["dist/**", ".next/**"] },
    "dev": { "cache": false, "persistent": true },
    "lint": { "dependsOn": ["^lint"] },
    "typecheck": { "dependsOn": ["^typecheck"] }
  }
}
```

**Key Build Features:**
- Pipeline dependencies ensure correct build order
- Caching disabled for dev mode (live reloading)
- Global environment variables for all services
- 21 environment variables tracked for cache invalidation

**pnpm Workspaces**:
```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

### 1.3 Next.js Applications

#### Portfolio App (`apps/portfolio`)
- **Framework:** Next.js 16.1.1 with Turbopack
- **Architecture:** App Router with i18n (next-intl)
- **Route Groups:**
  - `(main)/[locale]/` - Localized public pages
  - `(studio)/` - Sanity CMS studio
- **Key Directories:**
  - `app/(main)/[locale]/` - 12 localized routes (en/nl)
  - `components/` - 15 component categories
  - `sanity/` - CMS configuration
  - `contexts/` - React context providers (4 contexts)
  - `lib/` - 17 utility modules

#### Admin App (`apps/admin`)
- **Framework:** Next.js 16.1.1 on port 3001
- **Architecture:** App Router with `(admin)` and `(auth)` route groups
- **Authentication:** Clerk with middleware protection
- **Key Directories:**
  - `src/app/(admin)/` - 17 protected admin routes
  - `src/components/` - 26 admin-specific components
  - `convex/` - Duplicate schema (for development)

#### Storybook App (`apps/storybook`)
- **Purpose:** Component documentation and design system
- **Configuration:** Storybook 10.1.11 with Vite
- **Stories:** 22 story files covering foundations, components, and pages

### 1.4 Shared Packages

| Package | Purpose | Build Tool | Key Exports |
|---------|---------|------------|-------------|
| `@steding/ui` | Shared UI components | tsup | Button, Card, Input, etc. |
| `@steding/utils` | Utility functions | tsup | Helper functions |
| `@steding/timeline-scroll` | Timeline carousel | tsup | TimelineScroll, ExperienceCard |
| `@steding/tsconfig` | TS configs | - | Base configurations |

---

## 2. Convex Backend Analysis

### 2.1 Schema Overview (30 Tables)

```
┌─────────────────────────────────────────────────────────────────┐
│                    CONVEX DATABASE SCHEMA                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  📄 CONTENT TABLES (5)                                          │
│  ├── blog_posts        - Blog posts with i18n & SEO            │
│  ├── projects          - Portfolio projects                     │
│  ├── experiences       - Work/education history                │
│  ├── skills            - Technical skills                      │
│  └── media             - File storage metadata                 │
│                                                                  │
│  🤖 AGENT COORDINATION TABLES (4)                               │
│  ├── agent_tasks       - Task assignment & tracking            │
│  ├── agent_memory      - Shared agent knowledge (searchable)   │
│  ├── case_files        - Project case management               │
│  └── agent_sessions    - Real-time agent presence              │
│                                                                  │
│  📊 TRACKING TABLES (8)                                         │
│  ├── tasks             - Personal task management              │
│  ├── job_applications  - Job search pipeline                   │
│  ├── content_calendar  - Content publishing workflow           │
│  ├── seo_tracking      - SEO position monitoring               │
│  ├── analytics_log     - AI usage & cost tracking              │
│  ├── deployments       - Build/deployment logs                 │
│  ├── github_activity   - GitHub PR/issue tracking              │
│  └── agent_feed        - Real-time agent notifications         │
│                                                                  │
│  🛒 E-COMMERCE TABLES (2)                                       │
│  ├── templates         - Digital product listings              │
│  └── template_purchases- Stripe purchase records               │
│                                                                  │
│  👥 CRM TABLES (1)                                              │
│  └── portfolio_leads   - Contact form & newsletter leads       │
│                                                                  │
│  ⚙️ CONFIG TABLES (1)                                           │
│  └── site_settings     - Key-value configuration               │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 Index Analysis (65+ Indexes)

**High-Performance Indexes:**
- **Search Indexes:** `agent_memory.search_content`, `case_files.search_summary`
- **Compound Indexes:** `by_company_position`, `by_title_targetDate`, `by_featured`
- **Time-Series Indexes:** `by_created_at`, `by_checked_at` (for analytics)
- **Relationship Indexes:** `by_linear_issue`, `by_case_file`

### 2.3 Function Inventory (28 Files)

| Category | Files | Purpose |
|----------|-------|---------|
| **Core Content** | 6 | CRUD for portfolio data |
| **Agent System** | 4 | Coordination, memory, heartbeat, feed |
| **Workflows** | 1 | Workflow engine & dispatch |
| **Integrations** | 4 | Linear sync, GitHub, webhooks |
| **Tracking** | 5 | Analytics, SEO, deployments |
| **Business** | 4 | Jobs, content calendar, templates, leads |
| **Utilities** | 4 | Cleanup, auth helpers, cron jobs |

### 2.4 Workflow Automation System

**Status-Driven Workflows** (`workflows.ts`):

```typescript
// Job Application Pipeline
discovered → researching → applying → applied → interviewing → offer
     ↓              ↓            ↓                  ↓
 researcher    business    researcher        business
(company      (resume)    (interview        (negotiation
 research)                prep)              strategy)

// Content Publishing Pipeline  
idea → outline → drafting → review → scheduled → published
  ↓        ↓          ↓         ↓          ↓
business business   business  critic   orchestrator
(outline) (draft)   (write)   (review) (schedule)
```

**Key Workflow Features:**
- Automatic agent task creation on status transitions
- Template-based task descriptions
- Scheduled execution via `ctx.scheduler.runAfter()`
- Integration with OpenClaw CLI for agent dispatch

### 2.5 Linear Integration

**Bidirectional Sync Architecture:**
```
Linear ←──────→ Convex
  │                │
  │  Webhooks      │  Actions
  │  (real-time)   │  (async)
  │                │
  └── Issues ─────→ agent_tasks
      Updates        (syncIssueToTask)
      Deletes
```

**Sync Capabilities:**
- Real-time webhook processing
- Batch team synchronization
- Status mapping (Linear → Convex)
- Priority mapping (Linear priority → agent priority)

### 2.6 Data Flow Diagram

```
                    ┌──────────────┐
     User Actions   │   Next.js    │
    ───────────────→│   Frontend   │
                    │   (React)    │
                    └──────┬───────┘
                           │ Convex Client
                           ▼
┌──────────────────────────────────────────────────────┐
│                    CONVEX BACKEND                     │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────┐  │
│  │   Queries   │  │  Mutations   │  │   Actions   │  │
│  │  (cached)   │  │  (atomic)    │  │  (async)    │  │
│  └──────┬──────┘  └──────┬───────┘  └──────┬──────┘  │
│         └─────────────────┼──────────────────┘        │
│                           ▼                          │
│              ┌─────────────────────┐                 │
│              │    Reactive DB      │                 │
│              │   (subscriptions)   │                 │
│              └─────────────────────┘                 │
└──────────────────────────────────────────────────────┘
         │                      │
         ▼                      ▼
┌──────────────┐      ┌──────────────────┐
│   OpenClaw   │      │   External APIs  │
│    Agents    │      │  (Linear, GitHub)│
└──────────────┘      └──────────────────┘
```

---

## 3. Frontend Architecture

### 3.1 Portfolio App Structure

**Route Architecture:**
```
/(main)/[locale]/
├── page.tsx                 # Homepage (Hero + sections)
├── about/
├── blog/
│   ├── page.tsx             # Blog listing
│   └── [slug]/page.tsx      # Individual post
├── projects/
│   ├── page.tsx             # Projects grid
│   └── [id]/page.tsx        # Project detail
├── experience/[id]/         # Experience detail
├── services/
│   ├── page.tsx             # Services overview
│   └── [slug]/              # Service detail
├── cv/
│   ├── page.tsx             # CV display
│   └── builder/             # CV builder tool
├── book/                    # Cal.com booking
├── templates/               # Template marketplace
├── testimonials/            # Client testimonials
├── contact/                 # Contact form
├── privacy/                 # Privacy policy
└── terms/                   # Terms of service
```

### 3.2 State Management

**Convex React Client Pattern:**
```typescript
// Admin app - Clerk + Convex integration
<ClerkProvider>
  <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
    <ThemeProvider>
      {children}
    </ThemeProvider>
  </ConvexProviderWithClerk>
</ClerkProvider>
```

**React Contexts (Portfolio):**
| Context | Purpose |
|---------|---------|
| `LayoutContext` | Layout state management |
| `ThemeContext` | Dark/light mode |
| `LanguageContext` | i18n locale management |
| `ResumeBuilderContext` | CV builder state |

### 3.3 Admin App Dashboard Structure

```
/(admin)/
├── dashboard/              # Overview with stats
├── agents/                 # Multi-agent management
│   └── View agent status, memory, feed, tasks
├── tasks/                  # Task management
│   └── [id]/               # Task detail
├── projects/               # Portfolio projects CRUD
│   ├── new/
│   └── [id]/edit/
├── blog/                   # Blog posts CRUD
│   ├── new/
│   └── [id]/edit/
├── experience/             # Work history CRUD
│   ├── new/
│   └── [id]/edit/
├── skills/                 # Skills management
├── jobs/                   # Job application pipeline
├── content/                # Content calendar
├── feed/                   # Agent notifications
├── intelligence/           # AI analytics
├── seo/                    # SEO tracking
├── analytics/              # Usage analytics
├── media/                  # File uploads
└── settings/               # Site configuration
```

### 3.4 Shared UI Components

**@steding/ui Package Structure:**
```
src/
├── components/
│   ├── Button/           # Primary, secondary, ghost variants
│   ├── Card/             # Card containers
│   ├── Input/            # Form inputs
│   ├── Select/           # Dropdown selects
│   ├── Checkbox/         # Checkboxes
│   ├── Radio/            # Radio buttons
│   ├── Badge/            # Status badges
│   ├── Progress/         # Progress bars
│   ├── Spinner/          # Loading states
│   ├── Toast/            # Notifications
│   ├── TextArea/         # Multi-line inputs
│   ├── Tabs/             # Tab navigation
│   ├── Card3D/           # 3D card effect
│   └── LayoutTextFlip/   # Text animation
├── tokens/
│   ├── colors.ts         # Design system colors
│   ├── typography.ts     # Font styles
│   ├── spacing.ts        # Spacing scale
│   └── effects.ts        # Shadows, animations
└── lib/
    └── utils.ts          # cn() utility
```

---

## 4. Code Quality Assessment

### 4.1 TypeScript Usage

**Coverage:** 100% TypeScript across all packages

**Type Safety Features:**
- Strict mode enabled across all tsconfig.json files
- Convex generated types for database (`_generated/dataModel.d.ts`)
- Zod schemas for form validation (admin app)
- Union types for status enums throughout

**Type Generation:**
```typescript
// Convex auto-generated types
import { Id } from "./_generated/dataModel";
import { internal } from "./_generated/api";

// Type-safe database IDs
type TaskId = Id<"agent_tasks">;
```

### 4.2 Code Organization

**Strengths:**
- ✅ Clear separation of concerns (apps/packages)
- ✅ Consistent file naming conventions
- ✅ Barrel exports (`index.ts`) for clean imports
- ✅ Co-location of related files
- ✅ Shared configurations in packages

**Directory Patterns:**
```
ComponentName/
├── ComponentName.tsx      # Main component
├── index.ts               # Barrel export
└── ComponentName.test.tsx # Co-located tests
```

### 4.3 Potential Technical Debt

| Issue | Severity | Location | Recommendation |
|-------|----------|----------|----------------|
| Commented workflow code | Medium | `job_applications.ts`, `content_calendar.ts` | Re-enable after internal API fix |
| Duplicate convex folder | Medium | `apps/admin/convex/` | Consolidate to root |
| Missing Linear sig verify | Low | `linearWebhook.ts` | Implement signature verification |
| Inline TODO comments | Low | Various | Move to Linear issues |

### 4.4 Security Considerations

**Implemented Security:**
- ✅ Clerk JWT authentication with issuer domain validation
- ✅ Route-level auth protection via middleware
- ✅ Security headers (HSTS, CSP, XSS protection)
- ✅ Environment variable protection (`.env.*local` in turbo)

**Areas for Improvement:**
- Linear webhook signature verification (currently commented)
- Rate limiting on public mutations (agents can push data)
- Input sanitization on Tiptap content storage

### 4.5 Performance Optimizations

**Implemented:**
```typescript
// next.config.ts
experimental: {
  optimizePackageImports: [
    "lucide-react",
    "@tabler/icons-react",
    "@radix-ui/react-dialog",
    "framer-motion",
    // ... 12 more packages
  ],
}
```

**Bundle Analysis:**
- Bundle analyzer available via `ANALYZE=true`
- Sentry integration with tree-shaking for logger
- Image optimization via Sanity CDN

---

## 5. Integration Points

### 5.1 Authentication (Clerk)

**Configuration:**
```typescript
// middleware.ts
const isPublicRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)"]);

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});
```

**Protected Routes:** All `/admin/(admin)/*` routes

### 5.2 CMS (Sanity)

**Integration:**
- Embedded Sanity Studio at `/studio`
- Visual editing with `@sanity/visual-editing`
- Document internationalization plugin
- Custom markdown plugin

### 5.3 AI/ML Integrations

**OpenAI Integration:**
- Chat API at `/api/chat/route.ts`
- CV AI suggestions at `/api/cv/ai-suggestions`

**OpenClaw AI:**
- Multi-agent coordination via Convex
- Agent heartbeats and session tracking
- Task dispatch via workflow engine

### 5.4 Project Management (Linear)

**Features:**
- Bidirectional sync with agent_tasks
- Webhook processing for real-time updates
- Team-based issue synchronization
- Status and priority mapping

### 5.5 GitHub Activity Tracking

**Data Collected:**
- Pull requests
- Issues
- Reviews
- Merges
- Releases

**Storage:** `github_activity` table with deduplication logic

### 5.6 Email & Communication

**Resend:**
- Contact form handling
- Newsletter subscription
- Transactional emails

**Cal.com:**
- Embedded booking widget
- Webhook processing for booking events

### 5.7 Analytics & Monitoring

**Sentry:**
```typescript
// sentry.client.config.ts
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
});
```

**Vercel Analytics:**
- Speed Insights
- Web Analytics

**Custom Analytics:**
- `analytics_log` table tracks AI token usage
- Cost tracking per agent/model
- Duration metrics

---

## 6. Agent System

### 6.1 Multi-Agent Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    AGENT ECOSYSTEM                           │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│   🎯 ORCHESTRATOR    - Task coordination & delegation       │
│   🏗️ ARCHITECT       - System design & architecture         │
│   ⚡ CODER            - Code implementation & debugging      │
│   🔍 RESEARCHER      - Research & data gathering            │
│   💼 BUSINESS        - Content creation & strategy          │
│   🕷️ DATA-HANDLER    - Web scraping & DOM analysis          │
│   🛡️ CRITIC          - Quality assurance & review           │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 6.2 Agent Coordination Mechanisms

**1. Task Assignment:**
```typescript
// agentCoordination.ts
export const createAgentTask = mutation({
  args: {
    title: v.string(),
    assignedTo: v.array(v.string()),  // Agent names
    priority: v.union(v.literal("low"), ...),
    dependencies: v.array(v.string()), // Other task IDs
  },
  // ...
});
```

**2. Session Tracking:**
```typescript
// agentHeartbeat.ts
export const registerHeartbeat = mutation({
  args: {
    agentName: v.string(),
    sessionId: v.string(),
    status: v.union(v.literal("active"), v.literal("idle"), v.literal("offline")),
    currentTask: v.optional(v.string()),
  },
});
```

**3. Real-time Feed:**
- `agent_feed` table for notifications
- Unread count queries
- Priority-based filtering

### 6.3 Memory & Context Sharing

**Memory Categories:**
| Category | Purpose | Sharing |
|----------|---------|---------|
| `decision` | Architectural decisions | team |
| `learning` | Lessons learned | all |
| `context` | Project context | team |
| `reference` | Documentation | all |
| `insight` | Analytics insights | private |

**Searchable Memory:**
```typescript
// Full-text search on agent_memory
.searchIndex("search_content", {
  searchField: "content",
  filterFields: ["agentName", "category", "sharedWith"],
});
```

### 6.4 Case Files (Project Context)

**Structure:**
```typescript
{
  projectName: string;
  status: "active" | "paused" | "completed" | "archived";
  participants: string[];  // Agent names
  summary: string;
  decisions: Array<{ decision, madeBy, timestamp, rationale }>;
  resources: Array<{ type, title, content, url, addedBy, timestamp }>;
  tags: string[];
}
```

### 6.5 Workflow Engine Capabilities

**Automatic Triggers:**
- Job status changes → Research tasks
- Content status changes → Writing/review tasks
- Deployments → Notification feed entries

**Execution Flow:**
1. Status change triggers `dispatchJobWorkflow` or `dispatchContentWorkflow`
2. Workflow creates agent task with template-filled description
3. Task scheduled via `ctx.scheduler.runAfter(0, ...)`
4. `executeAgentTask` action dispatches to OpenClaw CLI
5. Agent receives notification via Telegram

---

## 7. Recommendations

### 7.1 High Priority

1. **Re-enable Workflow Automation**
   - Fix internal API generation issue
   - Uncomment workflow triggers in job_applications.ts and content_calendar.ts
   - Add error handling for failed dispatches

2. **Consolidate Convex Schemas**
   - Remove `apps/admin/convex/` duplicate
   - Ensure all apps reference root `/convex`
   - Add CI check to prevent drift

3. **Implement Linear Webhook Security**
   - Add signature verification to `linearWebhook.ts`
   - Store webhook secret in environment
   - Add tests for verification logic

### 7.2 Medium Priority

4. **Add Rate Limiting**
   - Implement per-agent rate limits on push mutations
   - Add IP-based limits for public endpoints
   - Monitor analytics for abuse patterns

5. **Improve Type Safety**
   - Replace `v.any()` with strict schemas for content fields
   - Add branded types for external IDs (Linear, GitHub)
   - Generate types from Sanity schemas

6. **Add E2E Tests**
   - Portfolio app has Playwright config but minimal tests
   - Add critical path tests (contact form, booking)
   - Test agent workflow triggers

### 7.3 Architecture Improvements

7. **Event Sourcing for Workflows**
   - Create `workflow_events` table for audit trail
   - Store all status transitions
   - Enable workflow replay/debugging

8. **Caching Layer**
   - Add Redis for session caching
   - Cache Linear API responses
   - Implement stale-while-revalidate for public queries

9. **Monitoring & Alerting**
   - Add Datadog or similar for infrastructure
   - Create alerts for:
     - Agent heartbeat failures
     - Workflow execution errors
     - Linear sync failures

### 7.4 Scalability Considerations

10. **Database Optimization**
    - Add pagination to all list queries
    - Implement cursor-based pagination for large tables
    - Archive old records (cron job exists but minimal)

11. **Agent Load Balancing**
    - Track agent queue depth
    - Implement round-robin for task assignment
    - Add agent capacity limits

12. **Multi-Region Support**
    - Convex supports multi-region deployments
    - Consider Vercel Edge for portfolio app
    - Implement regional agent sessions

### 7.5 Documentation Needs

| Topic | Current State | Needed |
|-------|--------------|--------|
| Agent API | Markdown guides | OpenAPI spec |
| Workflow authoring | Inline comments | Dedicated docs |
| Local setup | BASIC.md | Docker compose |
| Deployment | Vercel config | Terraform/CDK |
| Troubleshooting | None | Runbook |

---

## Appendix A: Code Statistics

| Metric | Count |
|--------|-------|
| Total TypeScript Files | 448 |
| Total Lines of Code | ~73,000 |
| Convex Function Files | 28 |
| Database Tables | 30 |
| Database Indexes | 65+ |
| Next.js Routes (Portfolio) | 25+ |
| Next.js Routes (Admin) | 40+ |
| UI Components | 20+ |
| Storybook Stories | 22 |
| Environment Variables | 21 |

### File Distribution

```
convex/*.ts          ████████████████████ 4,572 LOC
apps/portfolio/**/*  ████████████████████████████████████ ~35,000 LOC
apps/admin/**/*      ████████████████████████ ~20,000 LOC
packages/**/*        ████████████ ~8,000 LOC
apps/storybook/**/*  ███ ~3,000 LOC
```

---

## Appendix B: Technology Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | Next.js 16, React 19, TypeScript 5.9, Tailwind CSS 4 |
| **Backend** | Convex (reactive database), Node.js 20+ |
| **Auth** | Clerk |
| **CMS** | Sanity 4 |
| **AI** | OpenAI GPT, OpenClaw |
| **PM** | Linear SDK |
| **Payments** | Stripe |
| **Email** | Resend |
| **Calendar** | Cal.com |
| **Testing** | Vitest, Playwright |
| **Build** | Turbo, pnpm, tsup |
| **Linting** | Biome |
| **Deployment** | Vercel |
| **Monitoring** | Sentry, Vercel Analytics |

---

*End of Report*
