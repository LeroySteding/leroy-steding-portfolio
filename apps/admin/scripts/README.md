# Admin Scripts

Automation scripts for the admin application.

## Available Scripts

### scrape-prolinker.ts

Automated job scraper for ProLinker platform.

**Usage:**
```bash
# From project root
tsx apps/admin/scripts/scrape-prolinker.ts
```

**Environment Variables:**
- `CONVEX_URL` - Convex deployment URL (required)
- `PROLINKER_URL` - ProLinker job board URL (optional)
- `MAX_PAGES` - Maximum pages to scrape (optional, default: 10)
- `HEADLESS` - Run browser in headless mode (optional, default: true)

**Documentation:** See `/docs/PROLINKER-SCRAPER.md`

## Adding New Scripts

1. Create script file: `apps/admin/scripts/your-script.ts`
2. Add shebang: `#!/usr/bin/env tsx`
3. Make executable: `chmod +x apps/admin/scripts/your-script.ts`
4. Document usage in this README
5. Add detailed documentation in `/docs/`

## Cron Jobs

Scripts can be scheduled via OpenClaw or system cron:

```bash
# OpenClaw cron
openclaw cron add \
  --name "script-name" \
  --schedule "0 */4 * * *" \
  --command "cd ~/Projects/personal/leroy-steding-portfolio && tsx apps/admin/scripts/your-script.ts"

# System cron (macOS/Linux)
crontab -e
# Add: 0 */4 * * * cd ~/path/to/project && tsx apps/admin/scripts/your-script.ts
```

## Testing

Always test scripts locally before scheduling:

```bash
tsx apps/admin/scripts/your-script.ts
```

Check Convex database to verify results.
