# Adzuna API Setup Guide

## Getting API Credentials

1. **Sign up for free API access:**
   - Visit: https://developer.adzuna.com/
   - Click "Get your free API key"
   - Register for a developer account
   - Free tier: 250 API calls/month

2. **Get your credentials:**
   - After registration, you'll receive:
     - `Application ID` (app_id)
     - `API Key` (app_key)

3. **Add to environment:**
   ```bash
   # In .env.local
   ADZUNA_APP_ID=your_app_id_here
   ADZUNA_API_KEY=your_api_key_here
   ```

## Testing

```bash
# Test with dry-run (requires API key)
npx tsx apps/admin/scripts/scrape-jobs.ts --source=adzuna --dry-run

# Live run (saves to Convex)
npx tsx apps/admin/scripts/scrape-jobs.ts --source=adzuna

# Include in "all" sources
npx tsx apps/admin/scripts/scrape-jobs.ts --source=all
# Note: Adzuna is auto-included in "all" only if API key is set
```

## API Details

**Endpoint:** `https://api.adzuna.com/v1/api/jobs/nl/search/{page}`

**Parameters:**
- `app_id` - Your application ID
- `app_key` - Your API key
- `results_per_page` - Max 50 per request
- `what` - Search query (job title, skills)
- `where` - Location (we use "nederland")

**Search Queries Used:**
1. "fullstack developer"
2. "react developer"
3. "typescript developer"
4. "frontend developer react"
5. "backend developer typescript"
6. "full stack engineer"

## Expected Results

With valid credentials:
- ~50-200 jobs per run (depends on market)
- Focuses on Netherlands
- Filters for React, TypeScript, Fullstack roles
- Auto-deduplicates across queries
- Saves to Convex `scraped_jobs` table

## Rate Limits

**Free Tier:**
- 250 API calls/month
- Each search query = 1 call
- 6 queries per run = 6 calls
- Can run ~41 times per month
- Recommended: Run once daily

**Paid Tiers:**
- Contact Adzuna for higher limits
- See: https://developer.adzuna.com/pricing

## Troubleshooting

### "Missing API credentials"
- Check `.env.local` has `ADZUNA_APP_ID` and `ADZUNA_API_KEY`
- Restart server/script after adding variables

### "HTTP 401 Unauthorized"
- Invalid API credentials
- Check app_id and app_key are correct
- Verify account is active

### "HTTP 429 Too Many Requests"
- Rate limit exceeded
- Wait until next month or upgrade plan
- Check usage at: https://developer.adzuna.com/dashboard

### "0 jobs found"
- Normal if market is slow
- Try broader search terms
- Check location filter (nederland)

## API Response Example

```json
{
  "results": [
    {
      "id": "12345",
      "title": "Senior Fullstack Developer",
      "company": {
        "display_name": "TechCorp BV"
      },
      "location": {
        "display_name": "Amsterdam, Noord-Holland"
      },
      "description": "We are looking for...",
      "salary_min": 60000,
      "salary_max": 80000,
      "redirect_url": "https://www.adzuna.nl/...",
      "created": "2026-03-04T07:00:00Z",
      "contract_type": "permanent",
      "contract_time": "full_time"
    }
  ],
  "count": 142
}
```

## Features

✅ **Automatic Technology Extraction**
- Parses title and description for 50+ tech keywords
- JavaScript, TypeScript, React, Vue, Angular, etc.

✅ **Smart Salary Formatting**
- Converts to Euro format: €60,000 - €80,000
- Marks estimated salaries
- Handles missing data gracefully

✅ **Remote Detection**
- Checks location and description for remote keywords
- Dutch: "thuiswerk", "thuiswerken"
- English: "remote", "work from home"

✅ **Deduplication**
- Same job can appear in multiple queries
- Deduplicates by URL before saving
- Reduces database clutter

✅ **Error Handling**
- Retry logic with exponential backoff
- Individual query failures don't break entire run
- Detailed error logging

## References

- [Adzuna API Docs](https://developer.adzuna.com/overview)
- [API Parameters](https://developer.adzuna.com/docs/search)
- [Rate Limits](https://developer.adzuna.com/pricing)
- [Developer Dashboard](https://developer.adzuna.com/dashboard)
