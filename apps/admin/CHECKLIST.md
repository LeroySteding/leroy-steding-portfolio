# Admin Panel Setup Checklist

Use this checklist to get the admin panel up and running.

## ✅ Initial Setup

- [ ] Navigate to monorepo root: `cd /tmp/leroy-steding-portfolio`
- [ ] Install dependencies: `pnpm install`
- [ ] Navigate to admin: `cd apps/admin`
- [ ] Copy environment file: `cp .env.example .env`

## ✅ Clerk Setup (Authentication)

- [ ] Sign up at https://clerk.com
- [ ] Create a new application
- [ ] Copy **Publishable Key** → `.env` as `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- [ ] Copy **Secret Key** → `.env` as `CLERK_SECRET_KEY`
- [ ] Set Clerk URLs in `.env` (already configured for local dev)

## ✅ Supabase Setup (Database & Storage)

### Database
- [ ] Sign up at https://supabase.com
- [ ] Create a new project (pick a region)
- [ ] Wait for project to initialize (~2 minutes)
- [ ] Go to Settings → API
- [ ] Copy **Project URL** → `.env` as `NEXT_PUBLIC_SUPABASE_URL`
- [ ] Copy **anon public key** → `.env` as `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Copy **service_role key** → `.env` as `SUPABASE_SERVICE_ROLE_KEY`

### Run Database Schema
- [ ] In Supabase dashboard, go to **SQL Editor**
- [ ] Click **New Query**
- [ ] Open `apps/admin/src/lib/supabase/schema.sql`
- [ ] Copy entire contents and paste into SQL editor
- [ ] Click **Run** (or Cmd/Ctrl + Enter)
- [ ] Verify success message appears

### Storage Bucket
- [ ] In Supabase dashboard, go to **Storage**
- [ ] Click **Create new bucket**
- [ ] Name: `media`
- [ ] Public bucket: **Yes**
- [ ] File size limit: **50 MB**
- [ ] Click **Create bucket**

### Storage Policies
- [ ] Click on `media` bucket → **Policies** tab
- [ ] Click **New Policy** (4 times, one for each operation)

**Policy 1 - SELECT (Read):**
- [ ] Name: `Public read access`
- [ ] Allowed operation: `SELECT`
- [ ] Target roles: `public`
- [ ] USING: `true`
- [ ] Click **Review** → **Save policy**

**Policy 2 - INSERT (Upload):**
- [ ] Name: `Authenticated users can upload`
- [ ] Allowed operation: `INSERT`  
- [ ] Target roles: `authenticated`
- [ ] WITH CHECK: `auth.role() = 'authenticated'`
- [ ] Click **Review** → **Save policy**

**Policy 3 - UPDATE:**
- [ ] Name: `Authenticated users can update`
- [ ] Allowed operation: `UPDATE`
- [ ] Target roles: `authenticated`
- [ ] USING: `auth.role() = 'authenticated'`
- [ ] Click **Review** → **Save policy**

**Policy 4 - DELETE:**
- [ ] Name: `Authenticated users can delete`
- [ ] Allowed operation: `DELETE`
- [ ] Target roles: `authenticated`
- [ ] USING: `auth.role() = 'authenticated'`
- [ ] Click **Review** → **Save policy**

## ✅ Development

- [ ] Start dev server: `pnpm dev` (from monorepo root)
- [ ] Or: `cd apps/admin && pnpm dev`
- [ ] Open http://localhost:3001
- [ ] Should redirect to Clerk sign-in page

## ✅ First Login

- [ ] Click **Sign up** on the sign-in page
- [ ] Create account with email/password
- [ ] Should redirect to `/dashboard`
- [ ] Verify sidebar navigation works
- [ ] Test dark mode toggle in header
- [ ] Click through all pages

## ✅ Verify Everything Works

- [ ] Dashboard loads with stat cards
- [ ] Blog page shows empty state
- [ ] Projects page shows empty state
- [ ] Experience page shows empty state
- [ ] Skills page shows empty state
- [ ] Media page shows empty state
- [ ] Settings page shows forms
- [ ] User avatar appears in header
- [ ] Dark mode toggle works
- [ ] All navigation links work

## 🎯 Next Steps (Development)

After the basic setup works:

### Build CRUD Operations
- [ ] Create blog post form with Tiptap editor
- [ ] Add Supabase queries for blog CRUD
- [ ] Add project form and CRUD
- [ ] Add experience form and CRUD
- [ ] Add skills form and CRUD
- [ ] Implement media upload with Supabase Storage

### Add Polish
- [ ] Toast notifications for success/errors
- [ ] Loading states for all async operations
- [ ] Form validation with zod
- [ ] Error boundaries
- [ ] Optimistic UI updates

### Connect to Portfolio
- [ ] Update portfolio app to read from Supabase
- [ ] Create API routes or use Server Components
- [ ] Migrate existing Sanity content to Supabase
- [ ] Test bilingual content (EN/NL)

### Production Deployment
- [ ] Get production Clerk keys
- [ ] Get production Supabase credentials
- [ ] Configure Vercel deployment
- [ ] Set environment variables in Vercel
- [ ] Deploy and test

## 🆘 Troubleshooting

**Clerk redirect loop:**
- Check `.env` has all Clerk variables
- Restart dev server after changing `.env`
- Clear browser cache/cookies

**Supabase connection error:**
- Verify project URL is correct
- Check you're using anon key (not service role key for client)
- Confirm SQL schema was executed

**Build errors:**
- Run `pnpm install` from monorepo root
- Clear `.next` folder: `rm -rf .next`
- Check all imports are correct

**TypeScript errors:**
- Run `pnpm typecheck` to see all errors
- Make sure all dependencies are installed

---

## 📊 What's Included

- ✅ 24 TypeScript/TSX files (~1160 lines of code)
- ✅ 8 pages (Dashboard, Blog, Projects, Experience, Skills, Media, Settings, Auth)
- ✅ Tiptap rich text editor with full toolbar
- ✅ Responsive sidebar navigation
- ✅ Dark mode support
- ✅ Clerk authentication
- ✅ Supabase schema for 6 tables
- ✅ shadcn/ui components
- ✅ Comprehensive documentation

**Ready to build!** 🚀
