# Quick Setup Guide

Follow these steps to get the admin panel running:

## 1. Environment Setup

```bash
cd apps/admin
cp .env.example .env
```

Edit `.env` and add your credentials:

### Get Clerk Credentials
1. Go to https://clerk.com and sign up
2. Create a new application
3. Copy the **Publishable Key** and **Secret Key**
4. Go to **JWT Templates** → **New template** → Choose **Convex**
5. Copy the **Issuer** URL (looks like `https://your-app.clerk.accounts.dev`)
6. Paste into `.env`:
   ```
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
   CLERK_SECRET_KEY=sk_test_xxxxx
   CLERK_JWT_ISSUER_DOMAIN=https://your-app.clerk.accounts.dev
   ```

### Set Up Convex
1. Run from the admin directory:
   ```bash
   cd apps/admin
   npx convex dev
   ```
2. If this is your first time:
   - You'll be prompted to log in to Convex
   - Choose **Create a new project** or select an existing one
   - Choose a project name (e.g., `leroy-portfolio-admin`)
3. Convex will:
   - Initialize your project
   - Push the schema
   - Give you a deployment URL
4. Copy the deployment URL and add to `.env`:
   ```
   NEXT_PUBLIC_CONVEX_URL=https://xxxxx.convex.cloud
   CONVEX_DEPLOYMENT=prod:xxxxx
   ```

## 2. Install Dependencies

From the monorepo root:

```bash
pnpm install
```

## 3. Initialize Convex

The schema and functions are already created in the `convex/` directory. When you ran `npx convex dev`, it automatically:

- Created all database tables
- Set up authentication with Clerk
- Configured file storage
- Generated TypeScript types

You're all set! 🎉

**To verify everything is working:**
1. Keep `npx convex dev` running in a terminal
2. You should see "Convex functions ready" and a list of your functions
3. The Convex dashboard will open automatically - you can view your data there

## 4. Run Development Servers

You need **TWO terminals** running:

**Terminal 1 - Convex backend:**
```bash
cd apps/admin
npx convex dev
```

**Terminal 2 - Next.js frontend:**
```bash
# From monorepo root
pnpm dev

# Or just the admin app
cd apps/admin
pnpm dev
```

The admin panel will open at: **http://localhost:3001**

> **Important**: Keep both terminals running! Convex provides the backend, Next.js serves the frontend.

## 5. Create Your Account

1. Open http://localhost:3001
2. You'll be redirected to the sign-in page
3. Click **Sign up** instead
4. Create your account with email/password
5. You'll be redirected to the dashboard!

## Troubleshooting

### "Missing Clerk credentials" error
- Double-check your `.env` file has the correct Clerk keys
- Make sure there are no extra spaces or quotes
- Verify the JWT issuer domain is set
- Restart both dev servers after changing `.env`

### "Convex not defined" or connection errors
- Make sure `npx convex dev` is running in a separate terminal
- Verify `NEXT_PUBLIC_CONVEX_URL` is set in `.env`
- Check the URL doesn't have trailing slashes
- Restart the Next.js dev server

### Authentication errors
- Ensure Clerk JWT template for Convex is created
- Verify the issuer domain matches your Clerk instance
- Check `convex/auth.config.ts` is properly configured

### Can't upload images
- Convex file storage is built-in - no setup needed!
- If uploads fail, check browser console for errors
- Verify you're authenticated (signed in)

## Next Steps

1. ✅ Sign in to your admin panel
2. ✅ Explore the dashboard
3. ✅ Create your first blog post
4. ✅ Add a project
5. ✅ Upload some media
6. ✅ Configure site settings

## Need Help?

Check the main README.md for detailed documentation.
