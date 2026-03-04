# Linear CLI Integration Research & Setup Guide

**Date**: March 4, 2026  
**Status**: Complete research, ready for implementation  
**Priority**: HIGH (blocks autonomous task tracking)  
**Author**: Researcher Agent

---

## Executive Summary

Linear CLI integration will enable **autonomous task tracking and automation** for the orchestrator agent. Three viable tools are available, each with different trade-offs:

| Tool | Type | Status | Maintainance | LLM-Optimized | Recommendation |
|------|------|--------|--------------|--------------|-----------------|
| **Linearis** | Third-party | Active | ✅ Recent | ✅ YES | **RECOMMENDED** |
| **@anoncam/linear-cli** | Third-party | Active | ⚠️ 1yr old | ⚠️ Partial | **SECONDARY** |
| **@linear/cli** | Official | Deprecated | ❌ 4yrs old | ❌ NO | **NOT RECOMMENDED** |
| **Linear TypeScript SDK** | Official | Active | ✅ Maintained | ✅ YES | **ALTERNATIVE** |

**Recommendation**: Use **Linearis** for CLI automation (optimized for LLM agents) + **Linear TypeScript SDK** for programmatic access (Convex mutations).

---

## 1. TOOL COMPARISON & EVALUATION

### 1.1 Linearis (RECOMMENDED)

**GitHub**: https://github.com/czottmann/linearis  
**Author**: Carlo Zottmann  
**Status**: Active & maintained (2025)

#### Features
✅ **LLM-optimized output** — JSON format, token-efficient (<1000 tokens for usage info)  
✅ **Smart ID resolution** — Understands ABC-123 format, partial matches  
✅ **Minimal token overhead** — <1000 tokens vs. 13k for official MCP server  
✅ **Full CRUD operations** — Create, read, update issues & comments  
✅ **File management** — Upload/download attachments  
✅ **Document management** — Create/update standalone documents  
✅ **Relationship management** — Parent-child issue linking  
✅ **Label management** — Add/remove/clear labels  
✅ **Comment functionality** — Add comments with markdown  
✅ **Pipe-friendly** — Works with jq and other Unix tools  
✅ **Human-friendly** — Clean, intuitive command syntax

#### Command Examples
```bash
# List recent issues
linearis issues list -l 10

# Search for specific work
linearis issues search "authentication" --team Platform

# Create issue with full details
linearis issues create "Fix login timeout" \
  --team Backend \
  --assignee user123 \
  --labels "Bug,Critical" \
  --priority 1

# Read specific issue
linearis issues read DEV-456

# Update issue status and priority
linearis issues update ABC-123 --status "In Review" --priority 2

# Add comment to issue
linearis comments create ABC-123 --body "Fixed in PR #456"

# Upload file
linearis embeds upload ./screenshot.png

# Pipe to jq for processing
linearis issues list -l 5 | jq '.[] | .identifier + ": " + .title'
```

#### Installation
```bash
# Via npm
npm install -g linearis

# Or clone and build
git clone https://github.com/czottmann/linearis.git
cd linearis
npm install
npm start
```

#### Authentication Setup
```bash
# Set environment variable with Linear API token
export LINEAR_API_TOKEN="your_api_token_here"

# Or store in ~/.linearis.config.json
{
  "apiToken": "your_api_token_here",
  "workspace": "your-workspace-name"
}
```

#### Pros & Cons
**Pros**:
- ✅ Built specifically for LLM agents (Carlo Zottmann's stated goal)
- ✅ Minimal token overhead
- ✅ Active development
- ✅ Great documentation & examples
- ✅ Fast & efficient

**Cons**:
- ⚠️ Third-party (not official Linear)
- ⚠️ Smaller community
- ⚠️ Focused on core features (not comprehensive)

### 1.2 @anoncam/linear-cli

**NPM**: https://www.npmjs.com/package/@anoncam/linear-cli  
**GitHub**: (Need to find exact repo)  
**Status**: Active (published 1 year ago, v1.0.5)

#### Features
✅ **Comprehensive CLI** — Cross-team queries, multiple filtering options  
✅ **Interactive UI** — Colorful terminal-based kanban visualization  
✅ **Flexible filtering** — Query across teams, assignees, projects  
✅ **Rich reporting** — Aggregate data, statistics  
✅ **TypeScript SDK** — Built on official Linear SDK  
✅ **JSON output** — Machine-readable results

#### Installation
```bash
npm install -g @anoncam/linear-cli
```

#### Pros & Cons
**Pros**:
- ✅ More comprehensive than official CLI
- ✅ Active maintenance
- ✅ Good filtering capabilities
- ✅ Uses official SDK (more reliable)

**Cons**:
- ⚠️ Not specifically optimized for LLM agents
- ⚠️ More token overhead than Linearis
- ⚠️ Larger dependency tree (14 dependencies)
- ⚠️ Interactive UI less useful for automation

### 1.3 @linear/cli (Official - NOT RECOMMENDED)

**NPM**: https://www.npmjs.com/package/@linear/cli  
**Status**: Deprecated (v0.0.5, published 4 years ago)

#### Features
⚠️ **Very limited** — Only `lin new` and `lin checkout` commands  
⚠️ **Minimal functionality** — No querying, no CRUD beyond creation  
⚠️ **Outdated** — No recent updates or maintenance

#### Verdict
❌ **NOT RECOMMENDED** — Use SDK or Linearis instead.

### 1.4 Linear TypeScript SDK (OFFICIAL)

**GitHub**: https://github.com/linear/linear/tree/master/packages/sdk  
**NPM**: @linear/sdk  
**Status**: Active & officially maintained

#### Features
✅ **Official support** — Maintained by Linear team  
✅ **Strongly typed** — Full TypeScript support  
✅ **Complete API coverage** — All Linear features available  
✅ **Well documented** — Official docs at developers.linear.app  
✅ **GraphQL-powered** — Efficient queries  
✅ **Node.js/TypeScript** — Perfect for Convex mutations

#### Installation
```bash
npm install @linear/sdk
```

#### Usage Example
```typescript
import { LinearClient } from '@linear/sdk';

const linearClient = new LinearClient({
  apiKey: process.env.LINEAR_API_TOKEN,
});

// Fetch issues
const issues = await linearClient.issues({
  filter: {
    team: { key: { eq: 'STE' } },
    assignee: { name: { contains: 'Leroy' } },
  },
});

// Create issue
const issue = await linearClient.issueCreate({
  teamId: 'team_id_here',
  title: 'New Task',
  description: 'Description',
  assigneeId: 'user_id_here',
});
```

#### Pros & Cons
**Pros**:
- ✅ Official support & long-term viability
- ✅ Complete API coverage
- ✅ Strongly typed (TypeScript)
- ✅ Perfect for Convex integration

**Cons**:
- ⚠️ More setup needed than CLI
- ⚠️ Requires Node.js environment
- ⚠️ Not shell-friendly (CLI-wise)

---

## 2. AUTHENTICATION METHODS

### 2.1 Linear API Token (Personal Access Token)

**Recommended for**: CLI, local development, scripts

#### How to Generate
1. Go to Linear workspace settings: https://linear.app/settings/api
2. Navigate to **"API"** section
3. Click **"Create new"** under Personal API tokens
4. Name the token: `steding-orchestrator-cli`
5. Copy the token (shown only once!)
6. Store securely in environment variables or 1Password

#### Token Permissions
- ✅ Can read all workspace data
- ✅ Can create/update/delete issues
- ✅ Can manage comments
- ✅ Can manage labels & relationships

#### Storage Options

**Option A: Environment Variable (Recommended)**
```bash
export LINEAR_API_TOKEN="lin_pat_xxxxxxxxxxxx"
```

**Option B: .env File (Development)**
```
LINEAR_API_TOKEN=lin_pat_xxxxxxxxxxxx
LINEAR_TEAM_KEY=STE
LINEAR_WORKSPACE=steding
```

**Option C: 1Password (Secure Storage)**
```bash
# Store in 1Password
op item create "Linear API Token" --vault "Private" \
  --text "lin_pat_xxxxxxxxxxxx"

# Retrieve in scripts
export LINEAR_API_TOKEN=$(op read "op://Private/Linear API Token/password")
```

**Option D: Config File (Linearis)**
```json
# ~/.linearis.config.json
{
  "apiToken": "lin_pat_xxxxxxxxxxxx",
  "workspace": "steding"
}
```

### 2.2 OAuth 2.0 (For Third-Party Apps)

**Recommended for**: Web applications, user-facing integrations  
**Not needed for**: CLI automation, internal tools

#### When to Use
- Building app that users will authorize
- Need user-specific credentials
- Want to avoid storing user tokens

#### Setup Process
1. Go to https://linear.app/settings/api
2. Create OAuth application
3. Configure redirect URI: `http://localhost:3000/callback`
4. Store Client ID & Client Secret securely
5. Implement OAuth flow in app

---

## 3. LINEAR CLI SETUP GUIDE

### 3.1 Quick Start with Linearis

#### Step 1: Install Linearis
```bash
npm install -g linearis
```

#### Step 2: Get Linear API Token
1. Visit: https://linear.app/settings/api
2. Create new Personal API token
3. Copy token

#### Step 3: Store Token
```bash
# Option A: Environment variable
export LINEAR_API_TOKEN="lin_pat_your_token_here"

# Option B: Config file
mkdir -p ~/.config/linearis
cat > ~/.config/linearis/config.json <<EOF
{
  "apiToken": "lin_pat_your_token_here",
  "workspace": "steding"
}
EOF
```

#### Step 4: Verify Installation
```bash
linearis --version
linearis usage
```

**Expected output**: Full list of available commands and options

#### Step 5: Test Commands
```bash
# List 5 recent issues in STE team
linearis issues list -l 5 --team STE

# Search for "orchestrator" tasks
linearis issues search "orchestrator" --team STE

# Create a test issue
linearis issues create "Test task from CLI" \
  --team STE \
  --labels "test" \
  --priority 3
```

### 3.2 Setup for Orchestrator Agent

#### Configuration File
Create `~/.openclaw/agents/orchestrator/linear-config.json`:
```json
{
  "apiToken": "${LINEAR_API_TOKEN}",
  "workspace": "steding",
  "defaultTeam": "STE",
  "teamKey": "STE",
  "config": {
    "pageSize": 50,
    "timeout": 10000
  }
}
```

#### Environment Variables
Add to orchestrator's `.env` or OpenClaw config:
```bash
LINEAR_API_TOKEN=lin_pat_xxxxxxxxxxxx
LINEAR_TEAM_KEY=STE
LINEAR_WORKSPACE=steding
```

#### Helper Script
Create `scripts/linear-query.sh`:
```bash
#!/bin/bash
# Query Linear issues for orchestrator

LINEAR_TOKEN=${LINEAR_API_TOKEN:-}
TEAM=${LINEAR_TEAM_KEY:-STE}

if [ -z "$LINEAR_TOKEN" ]; then
  echo "Error: LINEAR_API_TOKEN not set"
  exit 1
fi

# List assigned to specific user
if [ "$1" = "my-tasks" ]; then
  linearis issues search "assignee:@${2:-leroy}" --team "$TEAM"
fi

# List by status
if [ "$1" = "status" ]; then
  linearis issues search "status:${2:-In Progress}" --team "$TEAM"
fi

# List all open tasks
if [ "$1" = "open" ]; then
  linearis issues list --team "$TEAM" | jq '.[] | select(.state != "Done")'
fi
```

---

## 4. QUERY EXAMPLES FOR ORCHESTRATOR

### 4.1 Task Discovery Queries

```bash
# Find all HIGH priority tasks in STE team
linearis issues search "priority:1" --team STE

# Find tasks assigned to specific agent
linearis issues search "assignee:coder" --team STE

# Find tasks in "In Progress" state
linearis issues search "state:\"In Progress\"" --team STE

# Find blocked tasks (with "blocked" label)
linearis issues search "labels:blocked" --team STE

# Find overdue tasks
linearis issues search "dueDate:[null TO now-1d]" --team STE

# Find recently updated tasks
linearis issues list -l 10 --team STE | jq 'sort_by(.updatedAt) | .[-5:]'
```

### 4.2 Task Status Queries

```bash
# Count tasks by status
linearis issues list --team STE | \
  jq 'group_by(.state) | map({status: .[0].state, count: length})'

# List tasks in backlog
linearis issues search "state:Backlog" --team STE

# List tasks in review
linearis issues search "state:\"In Review\"" --team STE

# List completed tasks (today)
linearis issues search "state:Done updatedAt:[now-1d TO now]" --team STE
```

### 4.3 Task Assignment Queries

```bash
# Find unassigned tasks
linearis issues search "assignee:null" --team STE

# Get all tasks for specific agent
linearis issues search "assignee:coder_bot" --team STE

# Get tasks by priority
linearis issues search "priority:1 state:Backlog" --team STE

# Find tasks assigned to multiple people
linearis issues list --team STE | \
  jq 'map(select(.assignee != null)) | group_by(.assignee.displayName)'
```

### 4.4 Aggregation Queries

```bash
# Count issues by assignee
linearis issues list -l 100 --team STE | \
  jq 'group_by(.assignee.displayName) | \
      map({assignee: .[0].assignee.displayName, count: length})'

# Get issue breakdown by label
linearis issues list -l 100 --team STE | \
  jq '[.[] | .labels[].name] | group_by(.) | \
      map({label: .[0], count: length})'

# High priority tasks by team
linearis issues search "priority:1" --team STE | \
  jq 'map({id: .identifier, title: .title, priority: .priority})'
```

---

## 5. INTEGRATION WITH ORCHESTRATOR AGENT

### 5.1 Autonomous Task Tracking Workflow

```
┌─────────────────────────────────────────┐
│  Orchestrator Agent (Heartbeat Loop)    │
└────────────────┬────────────────────────┘
                 │
        ┌────────▼────────┐
        │ Query Linear CLI │
        │ (linearis cmd)   │
        └────────┬────────┘
                 │
    ┌────────────┴─────────────┐
    │  Parse Task Status       │
    │  - My tasks              │
    │  - Unassigned work       │
    │  - Blocked issues        │
    └────────────┬─────────────┘
                 │
    ┌────────────▼──────────────┐
    │ Update Task Assignment    │
    │ - Assign to agents        │
    │ - Update status           │
    │ - Add comments            │
    └────────────┬──────────────┘
                 │
    ┌────────────▼──────────────┐
    │ Broadcast to Team Chat    │
    │ - Daily standup           │
    │ - Urgent blockers         │
    │ - Completed work          │
    └────────────┬──────────────┘
                 │
    ┌────────────▼──────────────┐
    │ Log to Convex             │
    │ - Task events             │
    │ - Agent activity          │
    └──────────────────────────┘
```

### 5.2 Example: Daily Standup Automation

```bash
#!/bin/bash
# scripts/daily-standup.sh

LINEAR_TEAM=${LINEAR_TEAM_KEY:-STE}

echo "🔄 Daily Standup Report"
echo "========================"
echo ""

echo "📋 Tasks In Progress:"
linearis issues search "state:\"In Progress\"" --team "$LINEAR_TEAM" | \
  jq -r '.[] | "  - \(.identifier): \(.title) (assigned to: \(.assignee.displayName))"'

echo ""
echo "⚠️ Blocked Tasks:"
linearis issues search "labels:blocked" --team "$LINEAR_TEAM" | \
  jq -r '.[] | "  - \(.identifier): \(.title)"'

echo ""
echo "✅ Completed Today:"
linearis issues search "state:Done updatedAt:[now-1d TO now]" --team "$LINEAR_TEAM" | \
  jq -r '.[] | "  - \(.identifier): \(.title)"'

echo ""
echo "📌 High Priority (Unassigned):"
linearis issues search "priority:1 assignee:null" --team "$LINEAR_TEAM" | \
  jq -r '.[] | "  - \(.identifier): \(.title)"'
```

### 5.3 Convex Integration (Node.js)

#### Install Dependencies
```bash
npm install @linear/sdk
```

#### Convex Mutation Example
```typescript
// convex/tasks.ts
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { LinearClient } from "@linear/sdk";

const linearClient = new LinearClient({
  apiKey: process.env.LINEAR_API_TOKEN!,
});

export const syncTasksFromLinear = mutation({
  args: { teamKey: v.string() },
  handler: async (ctx, { teamKey }) => {
    // Fetch from Linear
    const issues = await linearClient.issues({
      filter: {
        team: { key: { eq: teamKey } },
        state: { type: { neq: "canceled" } },
      },
    });

    // Store in Convex
    for (const issue of issues.nodes) {
      await ctx.db.insert("agent_tasks", {
        linearId: issue.id,
        identifier: issue.identifier,
        title: issue.title,
        status: issue.state.name,
        assignedTo: issue.assignee?.displayName || "unassigned",
        priority: issue.priority,
        dueDate: issue.dueDate,
        url: issue.url,
        syncedAt: new Date(),
      });
    }

    return { synced: issues.nodes.length };
  },
});

export const getTasksForAgent = query({
  args: { agentName: v.string() },
  handler: async (ctx, { agentName }) => {
    return await ctx.db
      .query("agent_tasks")
      .withIndex("by_assignee", (q) => q.eq("assignedTo", agentName))
      .collect();
  },
});
```

---

## 6. TESTING BASIC COMMANDS

### 6.1 Verification Commands

```bash
# Verify installation
linearis --version

# Show all available commands
linearis

# Show detailed usage (for LLM agents)
linearis usage

# Test authentication
linearis issues list -l 1

# List 5 most recent issues
linearis issues list -l 5
```

### 6.2 Test Scenarios

#### Test 1: Query Issues
```bash
# Should return list of issues in JSON format
$ linearis issues list -l 3

# Output:
# [
#   {
#     "id": "abc123...",
#     "identifier": "STE-28",
#     "title": "Add leroysteding.nl to GSC",
#     "state": "Todo",
#     "priority": 2,
#     ...
#   },
#   ...
# ]
```

#### Test 2: Search Issues
```bash
# Should find matching issues
$ linearis issues search "blog" --team STE

# Filters by keyword "blog"
```

#### Test 3: Create Issue
```bash
# Should create new issue and return details
$ linearis issues create "Test CLI integration" \
  --team STE \
  --labels "test"

# Output includes new issue ID and details
```

#### Test 4: Update Issue
```bash
# Should update existing issue
$ linearis issues update "STE-28" --status "In Progress"

# Confirms update
```

#### Test 5: Add Comment
```bash
# Should add comment to issue
$ linearis comments create "STE-28" --body "Progress update: 50% complete"

# Confirms comment added
```

#### Test 6: JSON Piping
```bash
# Should work with jq for data processing
$ linearis issues list -l 5 | \
  jq '.[] | {id: .identifier, title: .title, priority: .priority}'

# Output:
# {
#   "id": "STE-28",
#   "title": "Add leroysteding.nl to GSC",
#   "priority": 2
# }
```

---

## 7. IMPLEMENTATION PLAN FOR ORCHESTRATOR INTEGRATION

### Phase 1: Installation & Authentication (Day 1-2)

**Tasks**:
- [ ] Install Linearis: `npm install -g linearis`
- [ ] Generate Linear API token from https://linear.app/settings/api
- [ ] Store token in 1Password: `op item create "Linear API Token"`
- [ ] Export as environment variable: `export LINEAR_API_TOKEN=...`
- [ ] Run verification: `linearis --version && linearis usage`

**Success Criteria**:
- ✅ Linearis installed and accessible via CLI
- ✅ Token securely stored
- ✅ Can run basic queries (list issues)

### Phase 2: Integration Scripts (Day 3-4)

**Tasks**:
- [ ] Create `scripts/linear-query.sh` helper script
- [ ] Create `scripts/daily-standup.sh` automation
- [ ] Create `scripts/task-assignment.sh` for agent routing
- [ ] Test all scripts with sample data
- [ ] Document command reference

**Success Criteria**:
- ✅ All scripts execute without errors
- ✅ Output is properly formatted JSON
- ✅ Scripts work with pipes and jq

### Phase 3: Orchestrator Cron Jobs (Day 5-7)

**Tasks**:
- [ ] Create cron job for hourly task sync
- [ ] Create cron job for daily standup report
- [ ] Create cron job for blocking issue detection
- [ ] Implement status update logic (assign tasks to agents)
- [ ] Add error handling & logging

**Success Criteria**:
- ✅ Cron jobs execute on schedule
- ✅ Tasks assigned to agents based on workload
- ✅ Daily standup sent to team chat
- ✅ Blocking issues flagged immediately

### Phase 4: Convex Integration (Week 2)

**Tasks**:
- [ ] Install Linear SDK: `npm install @linear/sdk`
- [ ] Create Convex `syncLinearTasks` mutation
- [ ] Sync to `agent_tasks` table hourly
- [ ] Query `getTasksForAgent` by agent name
- [ ] Implement real-time status updates

**Success Criteria**:
- ✅ Tasks synced from Linear to Convex
- ✅ Admin dashboard shows task inventory
- ✅ Agent status queries work correctly

### Phase 5: Autonomous Routing (Week 2-3)

**Tasks**:
- [ ] Implement task assignment logic (based on agent workload)
- [ ] Route high-priority work to available agents
- [ ] Add dependencies & blocking issue handling
- [ ] Implement approval workflow for complex tasks
- [ ] Test with production workload

**Success Criteria**:
- ✅ High-priority tasks automatically assigned
- ✅ Agents notified via Telegram/Slack
- ✅ Blocking issues prevent task progress
- ✅ Manual override possible

---

## 8. BEST PRACTICES & SECURITY

### 8.1 Token Management

**DO**:
- ✅ Store token in environment variable or 1Password
- ✅ Use separate token per environment (dev, prod)
- ✅ Rotate tokens quarterly
- ✅ Audit token usage regularly
- ✅ Use minimal scope (read-only for queries)

**DON'T**:
- ❌ Commit tokens to git
- ❌ Store in plain text files
- ❌ Share tokens via email or Slack
- ❌ Use personal tokens for production automation
- ❌ Log tokens in debug output

### 8.2 Query Optimization

**DO**:
- ✅ Limit results with `-l` flag (avoid unnecessary data)
- ✅ Use filters to reduce data transfer
- ✅ Cache results when appropriate (hourly sync)
- ✅ Use jq for JSON processing (reduce memory)
- ✅ Test queries before automating

**DON'T**:
- ❌ Fetch all issues repeatedly
- ❌ Run queries in tight loops
- ❌ Parse large JSON responses manually
- ❌ Ignore rate limits
- ❌ Run multiple queries sequentially when parallel is possible

### 8.3 Error Handling

```bash
#!/bin/bash
# Example error handling

LINEAR_TOKEN=${LINEAR_API_TOKEN:-}

if [ -z "$LINEAR_TOKEN" ]; then
  echo "❌ Error: LINEAR_API_TOKEN not set" >&2
  exit 1
fi

# Retry logic with exponential backoff
MAX_RETRIES=3
RETRY_DELAY=2

for attempt in $(seq 1 $MAX_RETRIES); do
  if linearis issues list -l 5 2>/dev/null; then
    echo "✅ Linear API query successful"
    exit 0
  fi
  
  if [ $attempt -lt $MAX_RETRIES ]; then
    echo "⚠️ Attempt $attempt failed, retrying in ${RETRY_DELAY}s..."
    sleep $RETRY_DELAY
    RETRY_DELAY=$((RETRY_DELAY * 2))
  fi
done

echo "❌ Failed after $MAX_RETRIES attempts" >&2
exit 1
```

---

## 9. TROUBLESHOOTING

### Problem: "command not found: linearis"

**Solution**:
```bash
# Check installation
npm list -g linearis

# Reinstall if needed
npm install -g linearis

# Verify in PATH
which linearis
```

### Problem: "Invalid API token"

**Solution**:
```bash
# Verify token is set
echo $LINEAR_API_TOKEN

# Generate new token at:
# https://linear.app/settings/api

# Ensure token is in correct format:
# lin_pat_xxxxxxxxxxxx
```

### Problem: "Team not found"

**Solution**:
```bash
# List available teams
linearis issues list

# Use correct team key (e.g., "STE" not "Steding")
linearis issues list --team STE
```

### Problem: "Timeout or slow responses"

**Solution**:
```bash
# Limit results
linearis issues list -l 10

# Use more specific filters
linearis issues search "assignee:leroy"

# Check network connectivity
curl https://api.linear.app/graphql -v
```

---

## 10. RECOMMENDED IMPLEMENTATION TIMELINE

| Phase | Duration | Effort | Dependency |
|-------|----------|--------|-----------|
| **Phase 1: Install & Auth** | Day 1-2 | 2-4 hrs | None |
| **Phase 2: Scripts** | Day 3-4 | 4-6 hrs | Phase 1 ✓ |
| **Phase 3: Cron Jobs** | Day 5-7 | 6-8 hrs | Phase 2 ✓ |
| **Phase 4: Convex Sync** | Week 2 | 8-10 hrs | Phase 3 ✓ |
| **Phase 5: Routing** | Week 2-3 | 10-12 hrs | Phase 4 ✓ |

**Total Effort**: ~40-50 hours over 2-3 weeks

**Critical Path**: Phase 1 → Phase 2 → Phase 3 (can start Phase 4 in parallel)

---

## 11. RESOURCES & DOCUMENTATION

### Official Documentation
- **Linear Developers**: https://developers.linear.app
- **Linear GraphQL Schema**: https://studio.apollographql.com/public/Linear-API/schema/reference
- **TypeScript SDK Docs**: https://developers.linear.app/docs/sdk

### Tools & Packages
- **Linearis GitHub**: https://github.com/czottmann/linearis
- **@anoncam/linear-cli**: https://www.npmjs.com/package/@anoncam/linear-cli
- **Linear TypeScript SDK**: https://www.npmjs.com/package/@linear/sdk

### Related Articles
- **Linearis Blog Post**: https://zottmann.org/2025/09/03/linearis-my-linear-cli-built.html
- **Linear MCP Server**: https://linear.app/docs/mcp

---

## CONCLUSION

**Recommendation**: Implement **Linearis + Linear TypeScript SDK** for comprehensive task tracking:

1. **Use Linearis for CLI automation** — Shell scripts, cron jobs, simple queries
2. **Use TypeScript SDK for Convex** — Robust, typed, well-supported
3. **Combine for complete solution** — Best of both worlds

This approach gives the orchestrator agent:
- ✅ Autonomous task discovery & assignment
- ✅ Real-time status updates
- ✅ Proactive blocking issue detection
- ✅ Token-efficient (Linearis) + robust (SDK)
- ✅ Easy team communication integration

**Next Step**: Proceed to Phase 1 (installation) immediately.

---

**Report Complete**: March 4, 2026  
**Implementation Ready**: YES  
**Estimated Start**: Today

---
