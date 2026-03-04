# Multi-Source Job Scraper

Unified job scraping system for aggregating listings from multiple platforms.

## 🎯 Status

### ✅ Working Scrapers
- **RemoteOK** - ⚡ Fast API-based scraper (93 jobs in ~10s)
  - Uses public JSON API
  - No browser required
  - Highly reliable
  - No API key needed

- **Adzuna NL** - 🇳🇱 Netherlands-focused API scraper
  - Official Adzuna API
  - 50-200 jobs per run
  - Requires free API key (250 calls/month)
  - Multiple tech queries (React, TypeScript, Fullstack)
  - See: [ADZUNA_SETUP.md](./ADZUNA_SETUP.md)

### ⚠️ In Development
- **WeWorkRemotely** - HTML scraper needs selector fixes
- **Indeed NL** - HTML scraper needs selector fixes

### 📋 Planned
- **LinkedIn Jobs** - Requires authentication
- **Glassdoor** - Requires careful rate limiting
- **Prolinker** - Deprecated (broken)

## 🚀 Quick Start

```bash
# Scrape all working sources
npx tsx apps/admin/scripts/scrape-jobs.ts --source=all

# Scrape specific source
npx tsx apps/admin/scripts/scrape-jobs.ts --source=remoteok

# Dry run (test without saving)
npx tsx apps/admin/scripts/scrape-jobs.ts --source=remoteok --dry-run
```

## 📁 Architecture

```
scrapers/
├── types.ts                    # Unified Job interface
├── BaseScraper.ts             # Base class with retry/rate limiting
├── RemoteOKScraper.ts         # ✅ Working
├── WeWorkRemotelyScraper.ts   # ⚠️ Needs fixes
├── IndeedScraper.ts           # ⚠️ Needs fixes
└── README.md                  # This file
```

## 🔧 Adding a New Scraper

1. Create new file: `MySourceScraper.ts`
2. Extend `BaseScraper`:

```typescript
import { BaseScraper } from "./BaseScraper";
import type { Job } from "./types";

export class MySourceScraper extends BaseScraper {
  constructor() {
    super({
      source: "mysource",
      baseUrl: "https://example.com/jobs",
      maxPages: 5,
      requestDelay: 2000,
    });
  }

  async scrape(): Promise<Job[]> {
    const jobs: Job[] = [];
    
    // Your scraping logic here
    // Use this.navigateWithRetry(url)
    // Use this.waitForSelector(selector)
    // Use this.getText(selector)
    
    return jobs;
  }
}
```

3. Add to `scrape-jobs.ts`:

```typescript
import { MySourceScraper } from "./scrapers/MySourceScraper";

const SCRAPERS = {
  // ...
  mysource: () => new MySourceScraper(),
};

// Update sourcesToRun for "all"
sourcesToRun = ["remoteok", "mysource"];
```

## 🛡️ Features

### Retry Logic
- Automatic retry with exponential backoff
- Configurable max retries (default: 3)
- Per-request error handling

### Rate Limiting
- Configurable delay between requests
- Respectful scraping to avoid IP blocks
- Per-source rate limits

### Deduplication
- Checks existing jobs by URL + source
- Updates `scrapedAt` for seen jobs
- Creates new jobs for unseen listings

### Health Checks
- Per-scraper status tracking
- Error rate monitoring
- Success/failure stats

## 📊 Unified Job Schema

All scrapers produce the same Job interface:

```typescript
interface Job {
  title: string;
  company: string;
  location?: string;
  description: string;
  salary?: string;
  url: string;                  // Unique per source
  technologies: string[];       // Auto-extracted
  postedAt?: number;            // Timestamp
  source: JobSource;            // "remoteok", "indeed", etc.
  remote?: boolean;
  employmentType?: string;      // "Full-time", "Contract", etc.
  experienceLevel?: string;     // "Junior", "Mid", "Senior", etc.
  scrapedAt: number;            // When we scraped it
}
```

## 🔍 Base Scraper Utilities

The `BaseScraper` class provides:

- `navigateWithRetry(url)` - Navigate with retry logic
- `waitForSelector(selector)` - Wait for element
- `getText(selector)` - Extract text safely
- `getTextAll(selector)` - Extract multiple elements
- `extractTechnologies(text)` - Parse tech keywords
- `retry(fn, context)` - Generic retry wrapper
- `sleep(ms)` - Async delay

## 🐛 Debugging

### Enable headless=false
```typescript
constructor() {
  super({
    // ...
    headless: false, // See browser window
  });
}
```

### Check job card structure
Use browser DevTools to inspect selectors:
1. Open site in browser
2. Inspect job listing element
3. Find unique CSS selectors
4. Test with `document.querySelector()`

### Common Issues

**"Waiting for selector failed"**
- Selector doesn't exist or changed
- Page didn't load completely
- Check with DevTools

**"0 jobs extracted"**
- Extraction logic failing silently
- Validate required fields exist
- Add console.log to debug

**"Too many errors"**
- Rate limiting triggered
- Increase `requestDelay`
- Check IP not blocked

## 📝 TODO

### Scraper Fixes Needed
- [ ] Fix WeWorkRemotely selectors
- [ ] Fix Indeed NL selectors
- [ ] Implement LinkedIn scraper
- [ ] Implement Glassdoor scraper

### Features
- [ ] Add job detail page scraping (full description)
- [ ] Add company logo/info scraping
- [ ] Add salary parsing/normalization
- [ ] Add location parsing (city/country)
- [ ] Add job type detection (remote/hybrid/onsite)

### Infrastructure
- [ ] Add health check dashboard
- [ ] Add scraper metrics to Convex
- [ ] Add error alerting
- [ ] Add cron job scheduling
- [ ] Add job age tracking (delete stale jobs)

## 🔐 Security

- **User Agent**: Rotating user agents to avoid detection
- **Rate Limiting**: Respectful delays between requests
- **Error Handling**: Graceful degradation on failures
- **No Credentials**: Public data only (no auth required)

## 📈 Performance

### RemoteOK (API)
- Speed: ~10 seconds
- Jobs: 90-100 per run
- Reliability: ✅ Excellent
- No browser overhead

### Puppeteer Scrapers
- Speed: ~60-90 seconds
- Jobs: 20-50 per page
- Reliability: ⚠️ Depends on selectors
- Browser overhead significant

## 🚨 Known Issues

1. **Indeed & WeWorkRemotely**: HTML selectors outdated
   - Sites frequently change structure
   - Need periodic maintenance
   - Consider using APIs if available

2. **LinkedIn**: Requires authentication
   - Cannot scrape without login
   - Consider using official API
   - Rate limits very strict

3. **Glassdoor**: Anti-scraping measures
   - Aggressive bot detection
   - Consider using official API

## 📚 Resources

- [RemoteOK API Docs](https://remoteok.com/api)
- [Puppeteer Docs](https://pptr.dev/)
- [Convex Docs](https://docs.convex.dev/)

## 💡 Tips

1. **Start with APIs** when available (faster, more reliable)
2. **Use browser automation** only when necessary
3. **Respect robots.txt** and terms of service
4. **Monitor for changes** in HTML structure
5. **Add tests** for extraction logic
6. **Log errors** to track issues

## 🔗 Related

- Main runner: `../scrape-jobs.ts`
- Convex API: `../../../convex/scraped_jobs.ts`
- Old scraper: `../scrape-prolinker.ts` (deprecated)
