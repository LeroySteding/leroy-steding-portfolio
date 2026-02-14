# Linear Integration Setup

## 1. Get Linear API Key

1. Go to https://linear.app/settings/api
2. Create a new Personal API key
3. Copy the key (starts with `lin_api_`)

## 2. Configure Environment Variables

Add to your `.env.local`:

```bash
# Required for Linear sync
LINEAR_API_KEY=lin_api_your_key_here

# Optional: for webhook signature verification
LINEAR_WEBHOOK_SECRET=your_webhook_secret_here
```

Then add to Convex deployment:

```bash
cd apps/admin
npx convex env set LINEAR_API_KEY lin_api_your_key_here
# Optional:
npx convex env set LINEAR_WEBHOOK_SECRET your_webhook_secret_here
```

## 3. Deploy Convex Functions

```bash
cd apps/admin
npx convex dev
```

This will deploy:
- `linearSync.ts` - Sync functions
- `linearWebhook.ts` - Webhook handler

## 4. Configure Linear Webhook (Optional but Recommended)

For real-time sync from Linear → Convex:

1. Go to Linear Settings → API → Webhooks
2. Create new webhook
3. **URL**: `https://your-deployment.convex.site/linearWebhook`
   - Get URL from: `npx convex dashboard` → HTTP Actions
4. **Subscribe to events:**
   - ✅ Issue created
   - ✅ Issue updated
   - ✅ Issue deleted
5. Save webhook
6. Copy the signing secret and add to environment (step 2)

## 5. Test the Integration

### Sync Linear Issues → Convex

```typescript
// In your app or via Convex dashboard
await convex.action(api.linearSync.syncTeamIssues, {
  teamKey: "STE", // Your Linear team key
  limit: 50
});
```

### Sync Agent Task → Linear

```typescript
// Create Linear issue from existing agent task
await convex.action(api.linearSync.createLinearIssue, {
  taskId: task._id,
  teamKey: "STE"
});
```

### Manual Issue Sync

```typescript
// Sync a specific Linear issue
await convex.action(api.linearSync.syncIssueToTask, {
  issueId: "linear-issue-id"
});
```

## 6. Usage in Agents

Agents can now interact with Linear via Convex:

```typescript
// Create task in Convex (will be synced to Linear if webhook is set up)
const taskId = await convex.mutation(api.agentCoordination.createAgentTask, {
  title: "Build feature X",
  assignedTo: ["coder"],
  priority: "high",
  createdBy: "orchestrator",
});

// Later, create corresponding Linear issue
const linear = await convex.action(api.linearSync.createLinearIssue, {
  taskId,
  teamKey: "STE"
});

// Now task.linearIssueId is set, and updates sync bidirectionally
```

## 7. Automatic Sync Flow

Once webhook is configured:

```
Linear Issue Created/Updated
    ↓
Webhook → Convex linearWebhook
    ↓
syncIssueToTask action
    ↓
Creates/updates agent_task in Convex
    ↓
Agent sees task in admin dashboard
    ↓
Agent updates task status
    ↓
updateLinearIssueStatus action
    ↓
Linear issue status updated
```

## 8. Testing Locally

For local development with webhooks:

1. Install ngrok or use Convex dev webhooks:
   ```bash
   npx convex dev --once
   # Get HTTP Actions URL from output
   ```

2. Update Linear webhook URL to Convex dev URL

3. Test by creating/updating issues in Linear

## Troubleshooting

### API Key Not Working

- Verify key starts with `lin_api_`
- Check Linear API settings for key permissions
- Ensure key is set in Convex: `npx convex env list`

### Webhook Not Receiving Events

- Verify webhook URL is correct (HTTP Actions endpoint)
- Check Linear webhook logs in Settings → API → Webhooks
- Ensure events are subscribed to
- Check Convex logs: `npx convex logs`

### Status Not Syncing

- Verify Linear state names match mapping in `linearSync.ts`
- Check your team uses standard states: "Todo", "In Progress", "Done", "Canceled"
- Customize `statusMap` in code if using custom states

## Status Mapping

### Linear → Convex

| Linear State | Agent Task Status |
|-------------|-------------------|
| Backlog     | pending           |
| Todo        | pending           |
| In Progress | in_progress       |
| In Review   | in_progress       |
| Done        | completed         |
| Canceled    | cancelled         |

### Convex → Linear

| Agent Task Status | Linear State |
|------------------|--------------|
| pending          | Todo         |
| in_progress      | In Progress  |
| completed        | Done         |
| cancelled        | Canceled     |

## Next Steps

1. ✅ Configure environment variables
2. ✅ Deploy Convex functions
3. ✅ Set up webhook (optional)
4. ✅ Test sync with your STE team
5. 📊 View synced tasks in admin dashboard
6. 🤖 Agents can now work on Linear issues!
