# Portfolio Admin Panel

A modern admin panel built with Next.js 16, Clerk authentication, and Convex for managing Leroy Steding's portfolio content.

## 🚀 Features

- **🔐 Authentication**: Secure authentication with Clerk
- **📝 Content Management**: Blog posts, projects, experience, skills, and media
- **🌍 Multilingual**: Support for English and Dutch content
- **🎨 Modern UI**: Built with shadcn/ui and Tailwind CSS
- **📱 Responsive**: Mobile-first design
- **🌙 Dark Mode**: System-aware theme switching
- **✏️ Rich Text Editor**: Tiptap editor with full formatting support
- **🗄️ Database**: Convex for real-time data and file storage

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Language**: TypeScript
- **Authentication**: Clerk
- **Database**: Convex (real-time)
- **Storage**: Convex File Storage
- **UI Components**: shadcn/ui + Radix UI
- **Styling**: Tailwind CSS
- **Rich Text**: Tiptap
- **Icons**: Lucide React
- **Theme**: next-themes

## 📁 Project Structure

```
apps/admin/
├── src/
│   ├── app/
│   │   ├── (admin)/          # Protected admin routes
│   │   │   ├── dashboard/    # Dashboard page
│   │   │   ├── blog/         # Blog management
│   │   │   ├── projects/     # Project management
│   │   │   ├── experience/   # Experience management
│   │   │   ├── skills/       # Skills management
│   │   │   ├── media/        # Media library
│   │   │   └── settings/     # Site settings
│   │   ├── (auth)/           # Public auth routes
│   │   │   ├── sign-in/      # Sign in page
│   │   │   └── sign-up/      # Sign up page
│   │   ├── globals.css       # Global styles
│   │   ├── layout.tsx        # Root layout
│   │   └── page.tsx          # Home (redirects to dashboard)
│   ├── components/
│   │   ├── editor/           # Tiptap editor
│   │   ├── layout/           # Layout components (Sidebar, Header)
│   │   ├── ui/               # shadcn/ui components
│   │   └── providers.tsx     # App providers
│   ├── lib/
│   │   └── utils.ts          # Utility functions
│   └── middleware.ts         # Clerk auth middleware
├── convex/
│   ├── schema.ts             # Database schema
│   ├── auth.config.ts        # Clerk integration
│   ├── blog_posts.ts         # Blog CRUD functions
│   ├── projects.ts           # Projects CRUD functions
│   ├── experiences.ts        # Experience CRUD functions
│   ├── skills.ts             # Skills CRUD functions
│   ├── media.ts              # Media/file storage
│   └── site_settings.ts      # Settings CRUD functions
├── .env.example              # Environment variables template
├── next.config.ts            # Next.js configuration
├── package.json              # Dependencies
├── tailwind.config.ts        # Tailwind configuration
└── tsconfig.json             # TypeScript configuration
```

## 🚦 Getting Started

### Prerequisites

- Node.js 20+
- pnpm 9+
- Clerk account (for authentication)
- Convex account (for database and storage)

### Installation

1. **Install dependencies** (from monorepo root):

```bash
pnpm install
```

2. **Set up environment variables**:

```bash
cd apps/admin
cp .env.example .env
```

Fill in your Clerk and Convex credentials in `.env`.

3. **Initialize Convex**:

```bash
cd apps/admin
npx convex dev
```

This will:
- Create a new Convex project (or link to existing)
- Generate the schema and functions
- Give you the `NEXT_PUBLIC_CONVEX_URL`
- Start the Convex development server

4. **Configure Clerk for Convex**:

- Go to your Clerk dashboard
- Navigate to JWT Templates
- Create a new template for Convex
- Add the issuer URL to your `.env` as `CLERK_JWT_ISSUER_DOMAIN`

### Development

Run the development servers (you need **two terminals**):

**Terminal 1 - Convex:**
```bash
cd apps/admin
npx convex dev
```

**Terminal 2 - Next.js:**
```bash
# From monorepo root
pnpm dev

# Or just the admin app
cd apps/admin
pnpm dev
```

The admin panel will be available at `http://localhost:3001`.

### Building

```bash
# From monorepo root
pnpm build

# Or just the admin app
cd apps/admin
pnpm build
```

## 🔑 Environment Variables

Create a `.env` file based on `.env.example`:

```bash
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx
CLERK_JWT_ISSUER_DOMAIN=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# Convex
NEXT_PUBLIC_CONVEX_URL=
CONVEX_DEPLOYMENT=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3001
```

### Getting Credentials

**Clerk:**
1. Sign up at https://clerk.com
2. Create a new application
3. Copy the publishable and secret keys from the dashboard
4. Go to JWT Templates → Create template for Convex
5. Copy the issuer domain

**Convex:**
1. Sign up at https://convex.dev
2. Run `npx convex dev` in your project
3. Follow the prompts to create/link a project
4. Copy the deployment URL from the output

## 📊 Database Schema

The admin panel uses the following Convex tables:

- **`blog_posts`**: Blog articles with i18n support
- **`projects`**: Portfolio projects
- **`experiences`**: Work history and education
- **`skills`**: Technical skills with proficiency levels
- **`media`**: Media library with Convex file storage
- **`site_settings`**: Global site configuration

All tables automatically include:
- Unique `_id` (Convex ID)
- `_creationTime` timestamp
- Real-time reactivity
- Type-safe queries and mutations

See `convex/schema.ts` for the complete schema.

### Real-time Updates

Convex provides automatic real-time updates. When data changes, your UI updates instantly without polling or manual refreshes!

## 🎨 UI Components

This app uses [shadcn/ui](https://ui.shadcn.com/) components:

- Button
- Card
- Input
- Label

To add more components:

```bash
npx shadcn@latest add [component-name]
```

## ✏️ Rich Text Editor

The Tiptap editor supports:

- **Formatting**: Bold, italic, code
- **Headings**: H1, H2, H3
- **Lists**: Bullet and numbered lists
- **Blockquotes**
- **Code blocks**
- **Links**
- **Images**
- **Undo/Redo**

Content is saved as JSON for portability and can be rendered on the frontend using `@tiptap/react` or converted to HTML.

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the repository in Vercel
3. Set the root directory to `apps/admin`
4. Add all environment variables
5. Deploy!

Vercel will automatically detect Next.js and configure the build settings.

### Environment Variables in Production

Make sure to set all environment variables in your hosting platform:

- Clerk keys (production keys, not test!)
- Supabase URL and keys
- `NEXT_PUBLIC_APP_URL` (your production URL)

## 📝 Usage

### Creating Content

1. **Blog Posts**: Navigate to Blog → New Post
2. **Projects**: Go to Projects → New Project
3. **Experience**: Add entries in Experience
4. **Skills**: Manage skills with proficiency ratings
5. **Media**: Upload images to the media library

### Multilingual Content

Most content types support both English (EN) and Dutch (NL):

- Create separate entries for each language
- Use the same slug for related content
- Filter by locale in the database

### Media Management

Upload images to Convex File Storage:

1. Go to Media → Upload
2. Select files (images, videos, PDFs)
3. Files are automatically stored in Convex
4. Add alt text and captions
5. Use the generated URL in your content

Convex handles file storage, CDN, and URL generation automatically.

## 🔒 Security

- **Authentication**: All routes except sign-in/sign-up are protected by Clerk
- **Backend Security**: Convex mutations require authentication (enforced server-side)
- **Queries**: Public by default (for portfolio frontend to read)
- **Mutations**: Protected - only authenticated users can create/update/delete
- **Environment Variables**: Never commit `.env` files
- **API Keys**: Use environment variables for all secrets

## 🤝 Contributing

This is a private admin panel. If you need to make changes:

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Clerk Documentation](https://clerk.com/docs)
- [Convex Documentation](https://docs.convex.dev)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tiptap Documentation](https://tiptap.dev/)
- [Tailwind CSS](https://tailwindcss.com/)

## 🐛 Troubleshooting

### Build Errors

```bash
# Clean build cache
rm -rf .next
pnpm build
```

### Clerk Issues

- Check that all Clerk env variables are set
- Verify you're using the correct keys (test vs production)
- Check middleware configuration in `src/middleware.ts`
- Ensure JWT template is configured for Convex

### Convex Connection Issues

- Make sure `npx convex dev` is running
- Verify `NEXT_PUBLIC_CONVEX_URL` is set correctly
- Check that auth is configured in `convex/auth.config.ts`
- Run `npx convex dev --once` to push schema changes

### TypeScript Errors

```bash
# Type check
pnpm typecheck

# Update types
pnpm --filter @steding/admin add -D @types/node@latest @types/react@latest @types/react-dom@latest
```

## 📄 License

Private - All Rights Reserved

## 👤 Author

**Leroy Steding**
- Website: https://leroysteding.nl
- GitHub: [@leroysteding](https://github.com/leroysteding)

---

Built with ❤️ using Next.js 16, Clerk, and Convex
