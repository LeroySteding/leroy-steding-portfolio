# ProLinker Job Scraper

Scrapes freelance project listings from [prolinker.com](https://prolinker.com/projects) and stores them in the Convex `scraped_jobs` table.

## Architecture

Uses **Firecrawl API** (not Puppeteer) because ProLinker uses Cloudflare bot protection that blocks headless browsers. Firecrawl renders pages and returns markdown which is then parsed.

## Setup

```bash
cd scripts/prolinker-scraper
npm install
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `CONVEX_URL` | `https://hallowed-mole-286.convex.cloud` | Convex deployment URL |
| `FIRECRAWL_API_KEY` | (required) | Firecrawl API key |
| `DRY_RUN` | `false` | Print results without pushing to Convex |

## Usage

```bash
node scraper.mjs              # Full scrape (5 pages → Convex)
DRY_RUN=true node scraper.mjs # Dry run
node scraper.mjs --test       # 1 page, dry run
```

## How It Works

1. Fetches `prolinker.com/projects?page=N` via Firecrawl API
2. Parses markdown output to extract project cards (title, URL, category, budget, location)
3. For tech-relevant projects, fetches detail pages for full descriptions
4. Auto-detects technologies from title/description keywords
5. Pushes to Convex via `scraped_jobs:pushBatch` with URL-based deduplication

### Tech Categories Scraped in Detail
- Website and Apps
- Software and systems
- Technology and Science

### Rate Limiting
- 1.5s delay between Firecrawl requests
- Max 5 pages per run (~50 projects)

## Cron

The Convex cron (`convex/crons.ts`) triggers every 4 hours. Since the scraper needs Firecrawl (external API), it runs as a standalone script. Set up via system cron:

```bash
# crontab -e
0 */4 * * * cd ~/Projects/personal/leroy-steding-portfolio/scripts/prolinker-scraper && FIRECRAWL_API_KEY=<key> node scraper.mjs >> /tmp/prolinker-scraper.log 2>&1
```

## Convex Integration

- **Table**: `scraped_jobs`
- **Mutations**: `push`, `pushBatch` (with dedup by `url + source`)
- **Queries**: `list`, `get`, `getByUrl`, `search`, `stats`
- **Source**: `"prolinker"`
