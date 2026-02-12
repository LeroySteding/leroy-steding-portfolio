# Social Intelligence Admin

Real-time admin dashboard for monitoring LinkedIn jobs, X/Twitter trends, and Reddit opportunities.

## Tech Stack

- **Frontend:** Next.js 15 (App Router)
- **Auth:** Clerk
- **Database:** Convex (serverless real-time DB)
- **Styling:** Tailwind CSS + shadcn/ui
- **Language:** TypeScript

## Development

```bash
# Install dependencies
pnpm install

# Run Convex dev server (Terminal 1)
npx convex dev

# Run Next.js dev server (Terminal 2)
pnpm dev
```

Visit: http://localhost:3001

## Environment Variables

Copy `.env.local` with your credentials:

```env
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
CLERK_SECRET_KEY=...

# Convex
NEXT_PUBLIC_CONVEX_URL=...
CONVEX_DEPLOYMENT=...
```

## Deployment

### Deploy Convex

```bash
npx convex deploy --prod
```

### Deploy to Vercel

```bash
vercel --prod
```

Or via Vercel Dashboard:
1. Import GitHub repo
2. Set Root Directory: `apps/admin`
3. Add environment variables
4. Deploy

## Features

- ✅ Job monitoring (LinkedIn)
- ✅ Trend analysis (X/Twitter, Reddit)
- ✅ Real-time updates
- ✅ Match scoring
- ✅ Alert system
- ⏳ Content ideas (coming soon)
- ⏳ Settings page (coming soon)

## Documentation

- Setup: `../../SETUP.md`
- Deployment: `../../DEPLOY.md`
- Architecture: `../../BUILD_COMPLETE.md`

## License

Private - HiFive Digital
