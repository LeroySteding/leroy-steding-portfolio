# Adzuna API Research Report

**Date**: 2026-03-04  
**Status**: Complete  
**Scope**: Dutch job listings via Adzuna API for fullstack/React/TypeScript positions

---

## Executive Summary

Adzuna provides a **free RESTful API** to query job listings across 16 countries, including the Netherlands. The API is well-documented, supports JSON responses, and has generous free tier limits suitable for small-to-medium integrations. **Recommended for integration** into leroysteding.nl for displaying relevant tech job opportunities.

---

## 1. API Overview

### Provider
- **Name**: Adzuna
- **Service**: Job board aggregator
- **Documentation**: https://developer.adzuna.com/
- **Status**: Active & maintained

### Key Characteristics
- **Type**: RESTful API
- **Authentication**: API key-based (app_id + app_key)
- **Response Formats**: JSON, JSONP, XML, HTML, XLSX
- **Rate Limiting**: Yes (see section 2)
- **CORS Support**: Unclear from docs (likely requires server-side proxy)
- **Data Freshness**: Real-time job listings updated continuously

---

## 2. Free Tier Limits

**Default Access** (no paid tier found in public documentation):

| Metric | Limit |
|--------|-------|
| **Requests per minute** | 25 |
| **Requests per day** | 250 |
| **Requests per week** | 1,000 |
| **Requests per month** | 2,500 |

### Notes
- Limits are enforced per API key
- **Trial Period**: 14 days for non-publishing research use
- **Upgrades**: Available upon request for commercial applications with mutual benefit
- Adzuna states their largest API users handle **millions of hits per day** (via custom licensing)
- Contact: https://www.adzuna.co.uk/hire/partners/

### Estimation for leroysteding.nl
- **Conservative use case**: 50-100 requests/day for job feeds = **easily within limits**
- **Recommended**: Implement caching (Redis/Convex) to minimize API calls
- **Risk**: Low for prototype/MVP; consider upgrade if job widget becomes heavily trafficked

---

## 3. API Endpoints for Netherlands

### Base URL
```
https://api.adzuna.com/v1/api
```

### Search Endpoint (Primary)
```
GET /jobs/{country}/search/{page}
```

**For Netherlands**:
```
https://api.adzuna.com/v1/api/jobs/nl/search/1?app_id={APP_ID}&app_key={APP_KEY}&what=react&results_per_page=20&content-type=application/json
```

**Parameters** (query string):
| Parameter | Type | Example | Notes |
|-----------|------|---------|-------|
| `app_id` | string | `your_app_id` | **Required** |
| `app_key` | string | `your_app_key` | **Required** |
| `what` | string | `react developer` | Job title/keyword search |
| `what_exclude` | string | `java` | Exclude jobs with this keyword |
| `where` | string | `Amsterdam` | Location filter (city/region) |
| `category` | string | `it-jobs` | Job category tag |
| `results_per_page` | int | 20 | Results per page (max: 50) |
| `salary_min` | int | 40000 | Minimum annual salary (EUR) |
| `salary_max` | int | 80000 | Maximum annual salary (EUR) |
| `full_time` | int | 1 | Filter for full-time (0=any, 1=full-time) |
| `permanent` | int | 1 | Filter for permanent (0=any, 1=permanent) |
| `sort_by` | string | `salary` | Sort order: `date`, `salary`, `relevance` |
| `page` | int | 1 | Pagination (already in URL path) |
| `content-type` | string | `application/json` | Response format |

### Categories Endpoint
```
GET /jobs/{country}/categories
```

**For Netherlands**:
```
https://api.adzuna.com/v1/api/jobs/nl/categories?app_id={APP_ID}&app_key={APP_KEY}&content-type=application/json
```

Returns all available job categories in the Netherlands.

### Version Endpoint
```
GET /jobs/{country}/version
```

Check current API version (useful for debugging).

### Additional Endpoints
- **Salary Data**: `/jobs/{country}/histogram` — distribution of current salaries
- **Historical Data**: `/jobs/{country}/history` — salary trends over time
- **Regional Data**: `/jobs/{country}/stats/region` — vacancy counts by region
- **Top Companies**: `/jobs/{country}/stats/company` — vacancy counts by company

---

## 4. Authentication Requirements

### Registration & API Key Generation
1. **Sign up** at: https://developer.adzuna.com/signup
2. **Required fields**:
   - Username
   - Email address
   - Password
   - Organization/Group name
   - Organization website
   - Application purpose (dropdown)
   - Average monthly visitors
   - Primary market
   - Primary industry

3. **Upon approval**:
   - Receive `app_id` (your application identifier)
   - Receive `app_key` (secret API key)

### Authentication Method
- **Type**: Query string parameters (no OAuth/Bearer tokens)
- **Placement**: Add `app_id` and `app_key` to every request
- **Example**:
  ```
  https://api.adzuna.com/v1/api/jobs/nl/search/1?app_id=ABC123&app_key=XYZ789&what=react
  ```

### Security Notes
- **Store credentials securely** (use environment variables, secrets manager, 1Password)
- **Do NOT commit** app_key to git or expose in client-side code
- **Implement server-side proxy** to hide credentials (recommended for leroysteding.nl)
- **Rotation**: No documented key rotation policy; request from Adzuna if compromised

---

## 5. Job Categories for Tech Roles

### Primary Category
**Category Tag**: `it-jobs`  
**Display Name**: `IT Jobs`

This is the main category for all tech roles including:
- Software developers
- Frontend/fullstack engineers
- React developers
- TypeScript specialists
- Senior developers
- Junior developers

### Search Strategy for Fullstack/React/TS

**Recommended Query Examples**:

```bash
# Fullstack React/TypeScript developers in Netherlands
what=fullstack%20react%20developer&what_exclude=junior&salary_min=45000&category=it-jobs

# React developers (all levels)
what=react%20developer&category=it-jobs

# TypeScript developers
what=typescript%20developer&category=it-jobs&what_exclude=java

# Senior fullstack engineers
what=senior%20fullstack%20engineer&salary_min=60000&permanent=1&full_time=1&category=it-jobs

# Frontend developers with React
what=frontend%20react&category=it-jobs
```

### Notes on Search Matching
- **Keyword matching**: Adzuna uses text-based search on job titles and descriptions
- **Broad matching**: Searching for "react" will match "React Developer", "React JS Engineer", etc.
- **Exclusions helpful**: Use `what_exclude` to filter out unrelated results (e.g., "react" + exclude "native" for web-only)
- **Categories**: The `it-jobs` category is broad; keyword refinement is essential

---

## 6. Response Format & Data Structure

### JSON Response Example
```json
{
  "__CLASS__": "Adzuna::API::Response::JobSearchResults",
  "count": 245,
  "mean": 52000,
  "results": [
    {
      "__CLASS__": "Adzuna::API::Response::Job",
      "id": "129698749",
      "title": "React Developer",
      "company": {
        "__CLASS__": "Adzuna::API::Response::Company",
        "display_name": "Tech Startup XYZ"
      },
      "location": {
        "__CLASS__": "Adzuna::API::Response::Location",
        "display_name": "Amsterdam, Netherlands",
        "area": ["Netherlands", "North Holland", "Amsterdam"],
        "latitude": 52.3676,
        "longitude": 4.9041
      },
      "category": {
        "__CLASS__": "Adzuna::API::Response::Category",
        "label": "IT Jobs",
        "tag": "it-jobs"
      },
      "contract_type": "permanent",
      "contract_time": "full_time",
      "salary_min": 50000,
      "salary_max": 60000,
      "salary_is_predicted": 0,
      "description": "We are looking for an experienced React developer... [truncated]",
      "created": "2026-03-01T10:30:00Z",
      "redirect_url": "https://www.adzuna.nl/jobs/land/ad/129698749?utm_source=api",
      "ad_id": "129698749"
    }
    // ... more results
  ]
}
```

### Key Fields to Utilize
- **title**: Job title
- **company.display_name**: Hiring company
- **location.display_name**: Job location (city/region)
- **salary_min / salary_max**: Annual salary range (EUR, when available)
- **salary_is_predicted**: Flag (0 = actual, 1 = estimated by Adzuna)
- **contract_type**: "permanent", "contract", "temporary"
- **contract_time**: "full_time", "part_time"
- **description**: Job summary (truncated; full details at redirect_url)
- **created**: Job posting date (ISO 8601)
- **redirect_url**: Link to full job posting on Adzuna

---

## 7. Implementation Recommendations

### For leroysteding.nl

#### 1. **Server-Side Integration** (Next.js API Route)
```typescript
// app/api/jobs/route.ts
export async function GET(request: Request) {
  const searchParams = new URL(request.url).searchParams;
  const keyword = searchParams.get('q') || 'react';
  
  const adzunaUrl = new URL('https://api.adzuna.com/v1/api/jobs/nl/search/1');
  adzunaUrl.searchParams.append('app_id', process.env.ADZUNA_APP_ID!);
  adzunaUrl.searchParams.append('app_key', process.env.ADZUNA_APP_KEY!);
  adzunaUrl.searchParams.append('what', keyword);
  adzunaUrl.searchParams.append('category', 'it-jobs');
  adzunaUrl.searchParams.append('results_per_page', '20');
  adzunaUrl.searchParams.append('content-type', 'application/json');
  
  const res = await fetch(adzunaUrl);
  return Response.json(await res.json());
}
```

#### 2. **Caching Strategy** (Convex)
- Cache search results for **30-60 minutes** to reduce API calls
- Invalidate cache when new results are fetched
- Store in Convex tables: `job_listings`, `job_cache`

#### 3. **Environment Variables**
```bash
ADZUNA_APP_ID=your_app_id_here
ADZUNA_APP_KEY=your_app_key_here
```

#### 4. **Features**
- **Job feed widget**: Display latest fullstack/React roles in Netherlands
- **Salary insights**: Show average salary ranges for tech roles
- **Location filtering**: Filter by city (Amsterdam, Utrecht, Rotterdam, etc.)
- **Keyword filtering**: Search for specific skills (TypeScript, Next.js, etc.)

#### 5. **Monitoring**
- Track API usage against monthly limit (2,500 requests)
- Alert if approaching rate limits
- Log failed requests for debugging

---

## 8. Known Limitations & Considerations

| Issue | Impact | Mitigation |
|-------|--------|-----------|
| **Truncated descriptions** | Job descriptions are summarized; full details require clicking through | Link to Adzuna job posting for complete details |
| **Salary predictions** | Not all jobs have real salary data; some are Adzuna-estimated | Flag predicted vs. actual salaries |
| **Geographic precision** | Location is often at city level, not specific address | Display city/region and use coordinates for mapping |
| **CORS blocking** | Direct frontend API calls may be blocked; requires server-side proxy | Implement Next.js API route as proxy |
| **Rate limits** | 250 requests/day is modest; aggressive features may exceed | Implement aggressive caching; consider upgrade if needed |
| **Trial period enforcement** | Research-only for first 14 days; commercial use after requires agreement | Plan upgrade timeline for production launch |
| **Update frequency** | Real-time but no guaranteed SLA | Not suitable for mission-critical job feeds |

---

## 9. Comparison with Alternatives

| Service | Free Tier | Rate Limits | Countries | Data Quality |
|---------|-----------|------------|-----------|--------------|
| **Adzuna** | 2,500 req/month | 25 req/min | 16 | Good (aggregated) |
| **Indeed API** | Limited (deprecated) | N/A | Multiple | Excellent |
| **GitHub Jobs** | Unlimited | 60 req/min | Global | Tech-focused |
| **Jooble API** | Free tier | Varies | 70+ | Good |
| **LinkedIn** | Restricted (requires OAuth) | 300 req/day | Global | Excellent |

**Verdict**: Adzuna is the best free option for Netherlands-focused job listings with reasonable rate limits.

---

## 10. Next Steps

1. **Register for API key**
   - Go to https://developer.adzuna.com/signup
   - Use leroysteding@gmail.com
   - Specify: "Job feed widget for leroysteding.nl portfolio"

2. **Test API endpoints**
   - Use the Interactive API docs: https://developer.adzuna.com/activedocs
   - Query for "react developer" in NL
   - Verify response structure

3. **Implement caching**
   - Add job listings table to Convex
   - Implement 60-minute cache with invalidation

4. **Build UI component**
   - Create React component to display job listings
   - Add filters for location, salary, contract type
   - Link to Adzuna job postings

5. **Monitor & scale**
   - Track API usage in Convex
   - Plan upgrade to Adzuna partner program if traffic grows

---

## Resources

- **Developer Portal**: https://developer.adzuna.com/
- **API Docs**: https://developer.adzuna.com/overview
- **Interactive Playground**: https://developer.adzuna.com/activedocs
- **Terms of Service**: https://developer.adzuna.com/docs/terms_of_service
- **Sign Up**: https://developer.adzuna.com/signup
- **Support**: https://www.adzuna.co.uk/hire/partners/ (partnership inquiries)

---

**Report Complete** | Research conducted 2026-03-04
