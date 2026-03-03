# ProLinker Admin Dashboard

Comprehensive admin dashboard for monitoring and managing the ProLinker automated job search system.

## Overview

The ProLinker Dashboard provides a centralized interface to:
- Monitor scraped jobs from ProLinker.nl
- Configure and manage automated job applications
- Track application performance and success rates
- Monitor scraper health and troubleshoot issues
- Match jobs against your profile and skills

## Features

### 1. Overview Tab
High-level metrics and quick actions:
- **Total Jobs Scraped** - All jobs discovered
- **New This Week** - Recent job postings
- **Applications Sent** - Manual vs automated applications
- **Success Rate** - Percentage of offers received
- Quick access to recent jobs and common actions

### 2. Jobs Table
Comprehensive job listing with:
- **Filters**: Location, tech stack, salary range, match score
- **Sorting**: By score, date, or salary
- **Actions**: View details, apply, archive, blacklist company
- **Tech Stack Tags**: Visual display of required technologies
- **Match Scores**: AI-powered job matching (0-100%)
- **CSV Export**: Download filtered results

### 3. Matching Section
Profile-based job matching:
- **Profile Editor**: Configure skills, preferences, target companies
- **Match Score Distribution**: Visual chart of how jobs match your profile
- **Top Matches**: Best-matched jobs ranked by score
- **Re-score Button**: Recalculate all match scores
- Skills categorized as Required vs Preferred
- Location and salary preferences

### 4. Auto-Apply Dashboard
Automated application control:
- **Mode Selector**: Manual, Semi-Auto (80%+ matches), or Full Auto
- **Safety Controls**: Dry run mode, daily limits, score thresholds
- **Blacklist Manager**: Exclude companies or keywords
- **Application History**: Track all automated applications
- **Weekly Performance Chart**: Visual trend of applications and responses
- Real-time stats: Today's count, remaining quota, total auto-applied

### 5. Scraper Health
Monitor scraping system:
- **Last Run Status**: Success/error state and timestamp
- **Success Rate**: Overall scraper reliability
- **Manual Trigger**: On-demand scraping
- **Jobs Per Scrape Trend**: Visual chart of scraper productivity
- **Error Log**: Recent issues with stack traces
- **Configuration**: Current scraper settings and schedule

## Tech Stack

### Frontend
- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **shadcn/ui** - Component library
- **Recharts** - Data visualization

### Backend
- **Convex** - Real-time database and API
- **Convex Subscriptions** - Live data updates
- All queries optimized with indexes

### Components
```
prolinker/
├── page.tsx                    # Main dashboard layout
└── components/
    ├── OverviewStats.tsx       # Stats cards
    ├── JobsTable.tsx           # Filterable job listing
    ├── MatchingSection.tsx     # Profile & matching
    ├── AutoApplyDashboard.tsx  # Automation controls
    └── ScraperHealth.tsx       # Scraper monitoring
```

## Convex Queries

All queries are in `convex/prolinker_dashboard.ts`:

- `overviewStats` - High-level metrics
- `listJobs` - Filtered job listing
- `getJob` - Single job details
- `scoreDistribution` - Match score histogram
- `topMatches` - Best matched jobs
- `applicationHistory` - Recent applications
- `weeklyPerformance` - 7-day trend data
- `scraperHealth` - Scraper status and errors
- `getTechnologies` - Unique tech stack tags
- `getLocations` - Unique job locations

## Mutations

- `archiveJob` - Soft delete a job
- `blacklistCompany` - Add company to blacklist
- `exportToCSV` - Generate CSV export (action)
- `triggerScraper` - Manual scraper run (action)

## Auto-Apply Settings

Managed via `convex/auto_apply_settings.ts`:

```typescript
{
  mode: "manual" | "semi-auto" | "full-auto",
  enabled: boolean,
  dailyLimit: number,        // Max applications per day
  scoreThreshold: number,    // Min score to auto-apply (0-100)
  companyCooldownDays: number,
  blacklistCompanies: string[],
  blacklistKeywords: string[],
  whitelistCompanies: string[],
  requiredKeywords: string[],
  dryRun: boolean,           // Safety mode
  notifyOnApply: boolean,
  autoWithdrawOnBetter: boolean,
  weeklyReportEnabled: boolean,
}
```

## Job Schema

```typescript
{
  title: string,
  company: string,
  location?: string,
  description: string,
  salary?: string,
  url: string,
  technologies: string[],
  postedAt?: number,
  scrapedAt: number,
  source: "prolinker",
  remote?: boolean,
  employmentType?: string,
  experienceLevel?: string,
  archived?: boolean,
  matchScore?: number,  // Calculated by matching algorithm
}
```

## Matching Algorithm

**Note**: The matching algorithm is planned but not yet implemented. Current implementation returns placeholder scores.

Planned scoring factors:
1. **Skills Match** (40%) - Required vs preferred tech stack
2. **Location Match** (15%) - Location preferences and remote work
3. **Salary Match** (15%) - Salary range alignment
4. **Company Match** (10%) - Target/whitelist companies
5. **Keywords Match** (10%) - Required keywords presence
6. **Experience Level** (10%) - Junior/mid/senior alignment

## Safety Features

### Dry Run Mode
- Test automation without sending real applications
- All actions logged but not executed
- Can be toggled independently of enabled state

### Daily Limits
- Configurable max applications per day (1-50)
- Prevents spam and maintains quality
- Resets at midnight

### Blacklist System
- Company blacklist - Never apply to these companies
- Keyword blacklist - Skip jobs containing these terms
- Immediate effect on auto-apply

### Score Thresholds
- Manual mode: No automatic applications
- Semi-auto: Only 80%+ matches
- Full-auto: Configurable threshold (default 70%)

## Real-time Updates

All dashboard data uses Convex subscriptions for real-time updates:
- Job list updates when scraper runs
- Application stats update when jobs are applied to
- Scraper health updates on each run
- No polling required - push-based updates

## Mobile Responsive

- All components are mobile-friendly
- Tables collapse gracefully on small screens
- Charts remain readable on mobile
- Filters adapt to vertical layout

## CSV Export

Export filtered jobs with all fields:
- Title, Company, Location, Salary
- Technologies (semicolon-separated)
- Remote status, Scraped date, URL
- Respects current filters

## Future Enhancements

### Planned Features
1. **Job Details Modal** - Full job description view
2. **One-Click Apply** - Pre-filled application templates
3. **Email Notifications** - Daily/weekly reports
4. **Advanced Filters** - More granular filtering
5. **Bulk Actions** - Archive/blacklist multiple jobs
6. **Match Score ML** - AI-powered scoring based on your application history
7. **Application Templates** - Pre-configured cover letters and answers
8. **Integration with LinkedIn** - Auto-apply via LinkedIn Easy Apply
9. **Calendar Integration** - Track interview schedules
10. **Notes & Tags** - Custom annotations per job

### Matching Algorithm (TODO)
Currently returns placeholder 0% scores. Implementation needed:
- Parse job requirements from description
- Calculate skill overlap with user profile
- Weight by importance (required vs preferred)
- Factor in location, salary, company preferences
- Store scores in `matchScore` field

### Scraper Improvements
- Multi-platform support (LinkedIn, Indeed, etc.)
- Custom scraping rules per platform
- Rate limiting per source
- Proxy rotation for reliability
- Incremental scraping (only new pages)

## Development

### Running Locally

```bash
# Start Convex dev server
npx convex dev

# Start Next.js dev server
cd apps/admin
pnpm dev
```

Access at: http://localhost:3000/admin/jobs/prolinker

### Testing

```bash
# Test scraper (dry run)
tsx scripts/scrape-prolinker.ts --dry-run --limit=10

# Trigger via dashboard
# Use "Trigger Manual Scrape" button in Scraper Health tab
```

### Adding New Filters

1. Add filter state in `JobsTable.tsx`
2. Add UI component in filters section
3. Pass filter to `listJobs` query
4. Update query handler in `convex/prolinker_dashboard.ts`

### Customizing Charts

Charts use Recharts library. Customize in component files:
- `MatchingSection.tsx` - Bar chart for score distribution
- `AutoApplyDashboard.tsx` - Line chart for weekly performance
- `ScraperHealth.tsx` - Line chart for jobs per scrape

## Troubleshooting

### Jobs not appearing
- Check scraper has run (Scraper Health tab)
- Verify filters are not too restrictive
- Check archived status filter

### Auto-apply not working
- Ensure mode is not "manual"
- Verify enabled toggle is ON
- Check daily limit not exceeded
- Confirm not in dry run mode (unless intended)

### Match scores showing 0%
- Matching algorithm not yet implemented
- Placeholder scores until algorithm is built
- Check "Re-score All" button (will still show 0 until implemented)

### Scraper errors
- Check Error Log in Scraper Health tab
- Verify ProLinker website is accessible
- Check rate limiting settings
- Review logs in Convex dashboard

## License

Part of the Leroy Steding Portfolio project.
