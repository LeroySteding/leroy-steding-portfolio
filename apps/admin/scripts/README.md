# Admin Scripts

This directory contains automation scripts for the admin dashboard.

## Available Scripts

### Job Scraping

#### `scrape-prolinker.ts`
Scrapes job listings from ProLinker platform.

```bash
tsx apps/admin/scripts/scrape-prolinker.ts
```

**Features:**
- Pagination support
- Rate limiting
- Retry logic
- Technology extraction
- Deduplication

**Environment Variables:**
- `CONVEX_URL` - Required
- `PROLINKER_URL` - Optional (default: https://www.prolinker.nl/vacatures)
- `MAX_PAGES` - Optional (default: 10)
- `HEADLESS` - Optional (default: true)

#### `prolinker-cron.sh`
Cron wrapper for ProLinker scraper.

**Schedule:**
- Runs every 4 hours
- Logs to `~/logs/prolinker/`

### Auto-Apply

#### `auto-apply.ts`
Automated job application engine with safety controls.

```bash
# Dry-run mode (test)
tsx apps/admin/scripts/auto-apply.ts --dry-run

# Live mode
tsx apps/admin/scripts/auto-apply.ts

# Force (bypass limits)
tsx apps/admin/scripts/auto-apply.ts --force

# Specific job
tsx apps/admin/scripts/auto-apply.ts --job-id=xyz123
```

**Features:**
- Three modes: manual, semi-auto, full-auto
- Safety limits: daily cap, cooldowns, blacklists
- Puppeteer-based form filling
- Application tracking and logging
- Screenshot capture

**Environment Variables:**
- `CONVEX_URL` - Required

**⚠️ IMPORTANT:** Read `AUTO_APPLY_GUIDE.md` before using!

#### `auto-apply-cron.sh`
Cron wrapper for auto-apply engine.

**Schedule:**
- Twice daily: 9 AM and 5 PM
- Logs to `~/logs/auto-apply/`

## Setting Up Cron Jobs

### OpenClaw Cron (Recommended)

```bash
# ProLinker scraper (every 4 hours)
openclaw cron add "0 */4 * * *" "cd ~/Projects/personal/leroy-steding-portfolio && ./apps/admin/scripts/prolinker-cron.sh"

# Auto-apply (9 AM and 5 PM)
openclaw cron add "0 9,17 * * *" "cd ~/Projects/personal/leroy-steding-portfolio && ./apps/admin/scripts/auto-apply-cron.sh"

# List cron jobs
openclaw cron list

# Remove cron job
openclaw cron remove <job-id>
```

### System Cron

```bash
# Edit crontab
crontab -e

# Add these lines:
0 */4 * * * cd ~/Projects/personal/leroy-steding-portfolio && ./apps/admin/scripts/prolinker-cron.sh >> ~/logs/prolinker.log 2>&1
0 9,17 * * * cd ~/Projects/personal/leroy-steding-portfolio && ./apps/admin/scripts/auto-apply-cron.sh >> ~/logs/auto-apply.log 2>&1
```

## Logs

Scripts output logs to:
- ProLinker: `~/logs/prolinker/prolinker-YYYY-MM-DD.log`
- Auto-Apply: `~/logs/auto-apply/auto-apply-YYYY-MM-DD.log`

Old logs are automatically cleaned up after 30 days.

## Environment Setup

Create `.env.local` in project root:

```bash
# Convex
CONVEX_URL=https://your-deployment.convex.cloud

# Optional: ProLinker
PROLINKER_URL=https://www.prolinker.nl/vacatures
MAX_PAGES=10
HEADLESS=true
```

## Dependencies

Installed via pnpm workspace:

```bash
# Already in package.json
- puppeteer
- convex/browser
- tsx (for running TypeScript)
```

## Documentation

- [AUTO_APPLY_GUIDE.md](./AUTO_APPLY_GUIDE.md) - Complete guide for auto-apply system
- [PROLINKER-01-COMPLETION.md](../../../PROLINKER-01-COMPLETION.md) - ProLinker scraper documentation

## Safety

### Auto-Apply Safety Checklist

Before enabling auto-apply:

- [ ] Created application template with accurate data
- [ ] Tested in dry-run mode extensively
- [ ] Configured blacklists and filters
- [ ] Set conservative daily limits (5-10)
- [ ] Enabled notifications
- [ ] Reviewed AUTO_APPLY_GUIDE.md
- [ ] Started in manual or semi-auto mode
- [ ] Set up monitoring and log checks

## Troubleshooting

### Script won't run

```bash
# Make executable
chmod +x apps/admin/scripts/*.sh

# Check environment
echo $CONVEX_URL

# Test manually
tsx apps/admin/scripts/auto-apply.ts --dry-run
```

### Puppeteer errors

```bash
# Install Chromium dependencies (Linux)
sudo apt-get install -y chromium-browser

# macOS should work out of the box
```

### Cron jobs not running

```bash
# Check cron is running
pgrep cron

# Check logs
tail -f ~/logs/auto-apply/*.log

# Verify paths in cron scripts
```

## Best Practices

1. **Always test in dry-run mode first**
2. **Monitor logs regularly**
3. **Start with conservative limits**
4. **Update templates when info changes**
5. **Review applications periodically**
6. **Keep blacklists up to date**

## Support

For issues or questions, contact @steding_orchestrator_bot in the team Telegram group.
