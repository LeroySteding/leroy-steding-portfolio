# Agent Integration Guide

## Overview

This guide shows how to connect OpenClaw Telegram agents to the admin dashboard for real-time monitoring.

## Prerequisites

- Convex URL: `https://hallowed-mole-286.eu-west-1.convex.cloud`
- Agent name (e.g., `critic`, `orchestrator`, `coder`)
- Node.js 18+ runtime

## Integration Steps

### 1. Create Heartbeat Script

Create `agent-heartbeat.mjs` in your agent's workspace:

```javascript
#!/usr/bin/env node
const CONVEX_URL = 'https://hallowed-mole-286.eu-west-1.convex.cloud';
const AGENT_NAME = 'YOUR_AGENT_NAME'; // e.g., 'orchestrator', 'critic'
const SESSION_ID = `openclaw-${AGENT_NAME}-${Date.now()}`;
const HEARTBEAT_INTERVAL = 30000; // 30 seconds

let currentStatus = 'active';

async function sendHeartbeat() {
  try {
    const url = `${CONVEX_URL}/api/mutation`;
    const payload = {
      path: 'agentHeartbeat:registerHeartbeat',
      format: 'json',
      args: [{
        agentName: AGENT_NAME,
        sessionId: SESSION_ID,
        status: currentStatus,
        metadata: {
          emoji: '🤖', // Your agent emoji
          role: 'Your Agent Role',
          runtime: 'openclaw',
          nodeVersion: process.version,
          timestamp: Date.now(),
        },
      }],
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error(`HTTP ${response.status}:`, await response.text());
      return;
    }

    console.log(`✓ [${new Date().toISOString()}] Heartbeat OK`);
  } catch (error) {
    console.error(`✗ [${new Date().toISOString()}] Failed:`, error.message);
  }
}

// Initialize
(async () => {
  console.log(`🚀 ${AGENT_NAME} agent starting heartbeat...`);
  await sendHeartbeat();
  setInterval(sendHeartbeat, HEARTBEAT_INTERVAL);
})();

// Graceful shutdown
process.on('SIGINT', async () => {
  currentStatus = 'offline';
  await sendHeartbeat();
  process.exit(0);
});
```

### 2. Make Executable

```bash
chmod +x agent-heartbeat.mjs
```

### 3. Run in Background

```bash
nohup node agent-heartbeat.mjs > heartbeat.log 2>&1 &
```

### 4. Verify

Check logs:
```bash
tail -f heartbeat.log
```

Should see:
```
✓ [2026-02-14T14:19:01.080Z] Heartbeat OK
```

### 5. Check Dashboard

Go to https://admin.leroysteding.nl/agents (after signing in)

You should see your agent in the "Active" or "Idle" section with real-time status.

## Agent Configuration

### Agent Names

Use lowercase, hyphenated names:
- `orchestrator`
- `architect`
- `coder`
- `researcher`
- `business`
- `data-handler`
- `critic`
- `compliance`

### Agent Emojis

Set the emoji in metadata:
- Orchestrator: 🎯
- Architect: 🏗️
- Coder: ⚡
- Researcher: 🔍
- Business: 💼
- Data Handler: 🕷️
- Critic: 🛡️
- Compliance: ⚖️

### Status Values

- `active` - Currently working on a task
- `idle` - Available for work
- `offline` - Not running or shutting down

## Troubleshooting

### "HTTP 404" Error

- Check Convex URL is correct
- Verify mutation exists: `convex/agentHeartbeat.ts`
- Ensure Convex deployment is live

### Agent Not Showing in Dashboard

- Verify heartbeat script is running: `ps aux | grep agent-heartbeat`
- Check logs for errors: `tail -f heartbeat.log`
- Sign in to admin dashboard first (Clerk auth required)
- Wait 30 seconds for next heartbeat

### Multiple Sessions

Each restart creates a new session. Old sessions will show as offline after 5 minutes of no heartbeat.

## Production Deployment

For production, integrate heartbeat into agent startup:

### Option A: Add to Agent Initialization

```javascript
// In your agent's main.js or index.js
import { startHeartbeat } from './agent-heartbeat.mjs';

async function main() {
  // Start heartbeat
  startHeartbeat();
  
  // Your agent logic...
}
```

### Option B: Systemd Service (Linux)

Create `/etc/systemd/system/agent-critic-heartbeat.service`:

```ini
[Unit]
Description=Agent Critic Heartbeat
After=network.target

[Service]
Type=simple
User=openclaw
WorkingDirectory=/home/openclaw/.openclaw/agents/qa-critic/workspace
ExecStart=/usr/bin/node agent-heartbeat.mjs
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Enable and start:
```bash
sudo systemctl enable agent-critic-heartbeat
sudo systemctl start agent-critic-heartbeat
```

### Option C: PM2 Process Manager

```bash
pm2 start agent-heartbeat.mjs --name "critic-heartbeat"
pm2 save
pm2 startup
```

## Testing

Test your integration:

1. Start heartbeat script
2. Open admin dashboard: https://admin.leroysteding.nl/agents
3. Verify agent appears with correct:
   - Name
   - Emoji
   - Status (active/idle)
   - Last activity timestamp
4. Stop script (Ctrl+C)
5. Verify status changes to "offline" within 30 seconds

## Roll-out Plan

**Phase 1: Proof of Concept (Day 1)**
- ✅ Critic agent (complete)

**Phase 2: Core Agents (Day 1-2)**
- [ ] Orchestrator
- [ ] Coder
- [ ] Architect

**Phase 3: Support Agents (Day 2)**
- [ ] Researcher
- [ ] Business
- [ ] Data Handler
- [ ] Compliance

## Support

Questions? Ping @steding_critic_bot (me) or @steding_orchestrator_bot

---

**Status:** ✅ POC Complete (Critic agent connected)
**Next:** Roll out to orchestrator + coder
