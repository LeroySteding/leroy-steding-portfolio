# Sanity CMS Integration Guide

## 🎉 Setup Complete!

Your Sanity CMS is now integrated into your Next.js portfolio. This guide will help you complete the setup and migrate your content.

## 📁 File Structure

```
apps/portfolio/
├── sanity/
│   ├── schemas/
│   │   ├── post.ts              # Blog post schema with i18n
│   │   └── index.ts             # Schema exports
│   ├── lib/
│   │   ├── client.ts            # Sanity client configuration
│   │   ├── queries.ts           # GROQ queries for data fetching
│   │   ├── actions.ts           # Server-side data fetching functions
│   │   └── image.ts             # Image URL builder
│   ├── env.ts                   # Environment variable validation
│   └── types.ts                 # TypeScript types for Sanity data
├── app/
│   └── studio/
│       └── [[...tool]]/         # Sanity Studio admin interface
│           ├── page.tsx
│           └── layout.tsx
├── scripts/
│   └── migrate-blog-posts.ts   # Migration script for existing posts
└── sanity.config.ts             # Main Sanity configuration
```

## 🚀 Getting Started

### Step 1: Access Sanity Studio

1. **Start your development server** (if not running):
   ```bash
   npm run dev
   ```

2. **Navigate to the Studio**:
   ```
   http://localhost:3001/studio
   ```

3. **First-time setup**:
   - You'll be prompted to sign in with Sanity
   - Use the Sanity account associated with project ID: `p6hg7krm`
   - Grant necessary permissions

### Step 2: Migrate Existing Blog Posts

Once the Studio is accessible, run the migration script:

```bash
npm run migrate:blog
```

This will:
- ✅ Import all 6 English blog posts
- ✅ Import all 6 Dutch blog posts
- ✅ Preserve all metadata (tags, categories, featured status)
- ✅ Set up proper language associations

### Step 3: Verify Migration

1. Go to Studio: `http://localhost:3001/studio`
2. Check the "Blog Post" section
3. You should see 12 posts (6 EN + 6 NL)
4. Each post should have:
   - Title, slug, excerpt
   - Full markdown content
   - Category, tags, author
   - Published date, reading time
   - Featured flag
   - Language designation

## 🔧 Configuration

### Environment Variables

Already configured in your `.env`:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=p6hg7krm
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2025-10-15
SANITY_API_KEY=sk...
```

### Supported Languages

- 🇬🇧 English (`en`)
- 🇳🇱 Dutch (`nl`)

## 📝 Creating New Blog Posts

### Via Sanity Studio (Recommended)

1. Navigate to `/studio`
2. Click "Blog Post" → "Create"
3. Fill in all required fields:
   - Title
   - Slug (auto-generated from title)
   - Excerpt (max 200 chars)
   - Content (Markdown editor)
   - Category (Article/Tutorial/Research)
   - Tags
   - Published date
   - Reading time (e.g., "8 min read")
   - Featured toggle
4. **Important**: Create separate posts for each language
   - English post with `language: en`
   - Dutch post with `language: nl`
   - Use i18n plugin to link translations

### Programmatically

Use the Sanity client in your code:

```typescript
import { client } from '@/sanity/lib/client'

const newPost = await client.create({
  _type: 'post',
  title: 'New Blog Post',
  slug: { current: 'new-blog-post' },
  language: 'en',
  // ... other fields
})
```

## 🔄 Data Fetching

### Server Components (Recommended)

```typescript
import { getAllPosts, getPostBySlug } from '@/sanity/lib/actions'

// Get all posts for a language
const posts = await getAllPosts('en')

// Get specific post
const post = await getPostBySlug('my-slug', 'nl')

// Get featured posts only
const featured = await getFeaturedPosts('en')
```

### Available Functions

- `getAllPosts(language)` - All posts, sorted by date
- `getPostBySlug(slug, language)` - Single post
- `getFeaturedPosts(language)` - Featured posts only (max 6)
- `getPostsByCategory(category, language)` - Posts by category
- `getPostsByTag(tag, language)` - Posts by tag
- `getAllCategories(language)` - Unique categories
- `getAllTags(language)` - Unique tags

## 🎨 Features

### Built-in

- ✅ **Markdown Support** - Rich text editing with markdown
- ✅ **i18n Ready** - Separate content per language
- ✅ **Image Management** - Upload and optimize images
- ✅ **Version History** - Track changes over time
- ✅ **Draft/Published** - Control content visibility
- ✅ **Real-time Preview** - See changes instantly

### Schema Features

- **Auto-generated Slugs** - From title
- **Character Limits** - 200 char excerpts
- **Required Fields** - Enforced validation
- **Featured Flag** - Highlight important posts
- **Category System** - Article/Tutorial/Research
- **Tag System** - Flexible categorization
- **Reading Time** - Manual entry for accuracy

## 🔐 Security

### Studio Access

Currently open to anyone with the URL. To secure:

1. **Add Clerk Authentication** (already installed):
   ```typescript
   // In app/studio/[[...tool]]/page.tsx
   import { auth } from '@clerk/nextjs'
   
   // Protect the route
   const { userId } = auth()
   if (!userId) redirect('/sign-in')
   ```

2. **Configure CORS in Sanity**:
   - Go to sanity.io/manage
   - Add your domain to allowed origins

### API Security

- Use `useCdn: false` for draft content
- Token-based authentication for mutations
- Rate limiting via Sanity settings

## 📊 Next Steps

### Immediate

1. ✅ Access Studio at `/studio`
2. ✅ Run migration: `npm run migrate:blog`
3. ✅ Verify all posts imported correctly
4. ✅ Test creating a new post

### Short-term

- [ ] Update blog pages to use Sanity data
- [ ] Add image upload for cover images
- [ ] Set up draft/publish workflow
- [ ] Configure real-time preview

### Long-term

- [ ] Add Clerk auth to protect Studio
- [ ] Migrate projects to Sanity
- [ ] Migrate experiences to Sanity
- [ ] Set up webhooks for build triggers
- [ ] Configure CDN caching strategy

## 🆘 Troubleshooting

### Can't access Studio

1. Check dev server is running: `http://localhost:3001`
2. Verify environment variables in `.env`
3. Clear Next.js cache: `rm -rf .next`

### Migration fails

1. Check Sanity API key is valid
2. Verify project ID matches your Sanity project
3. Check network connection
4. Review error message for specific issues

### Content not showing

1. Verify language parameter matches (`en` vs `nl`)
2. Check published date is in the past
3. Ensure content is published (not draft)
4. Clear cache and rebuild

## 📚 Resources

- [Sanity Documentation](https://www.sanity.io/docs)
- [Next.js + Sanity Guide](https://www.sanity.io/guides/nextjs-app-router)
- [GROQ Query Language](https://www.sanity.io/docs/groq)
- [Document Internationalization](https://www.sanity.io/plugins/document-internationalization)

## 🎯 Summary

Your Sanity CMS setup includes:

- ✅ Fully configured Sanity Studio
- ✅ Blog schema with i18n support
- ✅ Data fetching utilities
- ✅ Migration script ready
- ✅ Type-safe queries
- ✅ Markdown support
- ✅ Image optimization ready

**Next**: Access the Studio and run the migration!

```bash
# Start if not running
npm run dev

# Open Studio
open http://localhost:3001/studio

# Run migration
npm run migrate:blog
```

Happy content managing! 🎉
