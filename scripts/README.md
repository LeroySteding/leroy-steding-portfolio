# Scripts

Utility scripts for automation, scraping, and maintenance.

## Job Scraping

### ProLinker Scraper
Automated job listing scraper for ProLinker platform.

**Usage:**
```bash
# Full scrape
tsx scripts/scrape-prolinker.ts

# Dry run (no saving)
tsx scripts/scrape-prolinker.ts --dry-run

# Limit jobs
tsx scripts/scrape-prolinker.ts --limit=10

# Combined
tsx scripts/scrape-prolinker.ts --dry-run --limit=5
```

**Environment Variables:**
```bash
CONVEX_URL=https://your-project.convex.cloud
PROLINKER_URL=https://www.prolinker.nl/jobs  # Optional
PROLINKER_MAX_PAGES=5                        # Optional
PROLINKER_RATE_LIMIT_MS=2000                 # Optional
```

**Documentation:**  
See [docs/PROLINKER-SCRAPER.md](../docs/PROLINKER-SCRAPER.md) for complete documentation.

## Adding New Scripts

1. Create script in `scripts/` directory
2. Add shebang: `#!/usr/bin/env tsx`
3. Make executable: `chmod +x scripts/your-script.ts`
4. Document usage in this README
5. Add to package.json scripts if needed

## Dependencies

Scripts use:
- **tsx** - TypeScript execution
- **puppeteer** - Browser automation
- **convex** - Database client
- **date-fns** - Date utilities (if needed)

Install: `npm install` (already included in project)
