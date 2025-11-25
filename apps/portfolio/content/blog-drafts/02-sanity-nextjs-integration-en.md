# Building a Modern CMS-Powered Website with Sanity and Next.js 16

**Category:** Tutorial  
**Tags:** Sanity, Next.js, CMS, Headless CMS, React, TypeScript  
**Reading Time:** 20 min read  
**Author:** Leroy Steding

---

Sanity.io is one of the most powerful and flexible headless CMS platforms available today. Combined with Next.js, it creates a powerhouse for building content-rich websites with excellent developer experience and editorial flexibility. In this comprehensive guide, I'll show you how to set up Sanity with Next.js 16 from scratch, based on my production implementation.

## Table of Contents

1. [Why Sanity + Next.js?](#why-sanity--nextjs)
2. [Project Setup](#project-setup)
3. [Sanity Studio Configuration](#sanity-studio-configuration)
4. [Creating Content Schemas](#creating-content-schemas)
5. [Fetching Content with GROQ](#fetching-content-with-groq)
6. [Real-time Preview with Draft Mode](#real-time-preview-with-draft-mode)
7. [Image Optimization](#image-optimization)
8. [Internationalization Support](#internationalization-support)
9. [Deployment and Production](#deployment-and-production)
10. [Best Practices and Tips](#best-practices-and-tips)

---

## Why Sanity + Next.js?

Before diving into the implementation, let's understand why this combination is so powerful:

### Sanity Advantages

- **Real-time Collaboration**: Multiple editors can work simultaneously
- **Structured Content**: Define your own schemas with full TypeScript support
- **GROQ Query Language**: Powerful and flexible content queries
- **Asset Pipeline**: Built-in image optimization and transformations
- **Portable Text**: Rich text with full customization
- **Generous Free Tier**: Suitable for most projects

### Next.js Advantages

- **Server Components**: Fetch data on the server for better performance
- **App Router**: Modern routing with layouts and loading states
- **Image Optimization**: Automatic image optimization
- **ISR/SSG/SSR**: Choose your rendering strategy per page
- **TypeScript**: First-class TypeScript support

### The Combination

Together, they provide:
- Content editors get a beautiful, customizable studio
- Developers get type-safe content with excellent DX
- Users get fast, SEO-optimized pages
- Everyone gets real-time preview capabilities

---

## Project Setup

### Step 1: Create Next.js Project

If starting fresh:

```bash
npx create-next-app@latest my-sanity-site --typescript --tailwind --app
cd my-sanity-site
```

### Step 2: Install Sanity Dependencies

```bash
# Core Sanity packages
pnpm add sanity @sanity/vision @sanity/image-url next-sanity

# For rich text/markdown
pnpm add sanity-plugin-markdown @portabletext/react

# For internationalization (optional)
pnpm add @sanity/document-internationalization
```

### Step 3: Create Sanity Project

```bash
# Initialize Sanity (if you don't have a project yet)
npx sanity@latest init --env

# Or manually create a project at sanity.io/manage
```

### Step 4: Environment Variables

Create `.env.local`:

```bash
# Sanity Configuration
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
SANITY_API_TOKEN=your-api-token  # For server-side operations

# Site URL (for preview)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## Sanity Studio Configuration

### Step 5: Configure Sanity

Create `sanity.config.ts` in your project root:

```typescript
// sanity.config.ts
import { documentInternationalization } from "@sanity/document-internationalization";
import { visionTool } from "@sanity/vision";
import { type Config, defineConfig } from "sanity";
import { presentationTool } from "sanity/presentation";
import { structureTool } from "sanity/structure";
import { markdownSchema } from "sanity-plugin-markdown";
import { schemaTypes } from "./sanity/schemas";
import { structure } from "./sanity/structure";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!;

const config: Config = defineConfig({
  name: "default",
  title: "My Website",

  projectId,
  dataset,

  // Embed studio at /studio route
  basePath: "/studio",

  plugins: [
    // Custom desk structure
    structureTool({ structure }),
    
    // Visual editing and preview
    presentationTool({
      previewUrl: {
        origin: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
        previewMode: {
          enable: "/api/draft",
        },
      },
    }),
    
    // GROQ query playground
    visionTool(),
    
    // Markdown support
    markdownSchema(),
    
    // Internationalization
    documentInternationalization({
      supportedLanguages: [
        { id: "en", title: "English" },
        { id: "nl", title: "Nederlands" },
      ],
      schemaTypes: ["post", "project", "page"],
    }),
  ],

  schema: {
    types: schemaTypes,
  },
});

export default config;
```

### Step 6: Create Studio Route

Create `app/studio/[[...tool]]/page.tsx`:

```typescript
// app/studio/[[...tool]]/page.tsx
"use client";

import { NextStudio } from "next-sanity/studio";
import config from "../../../sanity.config";

export default function StudioPage() {
  return <NextStudio config={config} />;
}
```

Create `app/studio/[[...tool]]/layout.tsx`:

```typescript
// app/studio/[[...tool]]/layout.tsx
export const metadata = {
  title: "Sanity Studio",
  description: "Content management studio",
};

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
```

---

## Creating Content Schemas

### Step 7: Set Up Schema Structure

Create the schema directory:

```
sanity/
├── schemas/
│   ├── index.ts
│   ├── post.ts
│   ├── project.ts
│   ├── page.ts
│   └── sections/
│       ├── hero.ts
│       ├── features.ts
│       └── index.ts
├── lib/
│   ├── client.ts
│   ├── queries.ts
│   └── actions.ts
└── structure.ts
```

### Step 8: Create Blog Post Schema

```typescript
// sanity/schemas/post.ts
import { BookOpen } from "lucide-react";
import { defineField, defineType } from "sanity";

export default defineType({
  name: "post",
  title: "Blog Post",
  type: "document",
  icon: BookOpen,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required().max(200),
    }),
    defineField({
      name: "coverImage",
      title: "Cover Image",
      type: "image",
      options: {
        hotspot: true,  // Enable focal point selection
      },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alternative Text",
          description: "Important for accessibility and SEO",
        },
      ],
    }),
    defineField({
      name: "content",
      title: "Content",
      type: "markdown",  // Using markdown plugin
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "Article", value: "article" },
          { title: "Tutorial", value: "tutorial" },
          { title: "Research", value: "research" },
        ],
        layout: "radio",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "string" }],
      options: {
        layout: "tags",
      },
    }),
    defineField({
      name: "author",
      title: "Author",
      type: "string",
      initialValue: "Your Name",
    }),
    defineField({
      name: "publishedAt",
      title: "Published At",
      type: "datetime",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "readingTime",
      title: "Reading Time",
      type: "string",
      description: 'e.g., "8 min read"',
    }),
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "language",
      title: "Language",
      type: "string",
      readOnly: true,
      hidden: true,
    }),
  ],
  preview: {
    select: {
      title: "title",
      author: "author",
      media: "coverImage",
      category: "category",
      featured: "featured",
    },
    prepare(selection) {
      const { title, author, category, featured } = selection;
      return {
        title,
        subtitle: `${category} ${featured ? "⭐ Featured" : ""} by ${author}`,
        media: selection.media,
      };
    },
  },
});
```

### Step 9: Create Project Schema

```typescript
// sanity/schemas/project.ts
import { Folder } from "lucide-react";
import { defineField, defineType } from "sanity";

export default defineType({
  name: "project",
  title: "Project",
  type: "document",
  icon: Folder,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "longDescription",
      title: "Long Description",
      type: "markdown",
    }),
    defineField({
      name: "image",
      title: "Project Image",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "technologies",
      title: "Technologies",
      type: "array",
      of: [{ type: "string" }],
      options: {
        layout: "tags",
      },
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "Web Development", value: "web" },
          { title: "Mobile App", value: "mobile" },
          { title: "E-commerce", value: "ecommerce" },
          { title: "SaaS", value: "saas" },
        ],
      },
    }),
    defineField({
      name: "client",
      title: "Client",
      type: "string",
    }),
    defineField({
      name: "year",
      title: "Year",
      type: "string",
    }),
    defineField({
      name: "liveUrl",
      title: "Live URL",
      type: "url",
    }),
    defineField({
      name: "githubUrl",
      title: "GitHub URL",
      type: "url",
    }),
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
    }),
    defineField({
      name: "language",
      title: "Language",
      type: "string",
      readOnly: true,
      hidden: true,
    }),
  ],
  orderings: [
    {
      title: "Display Order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
    {
      title: "Year, Newest",
      name: "yearDesc",
      by: [{ field: "year", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      client: "client",
      media: "image",
      featured: "featured",
    },
    prepare(selection) {
      const { title, client, featured } = selection;
      return {
        title,
        subtitle: `${client || "Personal"} ${featured ? "⭐" : ""}`,
        media: selection.media,
      };
    },
  },
});
```

### Step 10: Export Schemas

```typescript
// sanity/schemas/index.ts
import post from "./post";
import project from "./project";

export const schemaTypes = [post, project];
```

---

## Fetching Content with GROQ

### Step 11: Create Sanity Client

```typescript
// sanity/lib/client.ts
import { createClient } from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!;
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: process.env.NODE_ENV === "production",
});

// Client with auth token for mutations
export const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});
```

### Step 12: Create GROQ Queries

```typescript
// sanity/lib/queries.ts
import { groq } from "next-sanity";

// Get all posts
export const postsQuery = groq`
  *[_type == "post" && language == $language] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    "coverImage": coverImage.asset->url,
    "coverImageAlt": coverImage.alt,
    category,
    tags,
    author,
    publishedAt,
    readingTime,
    featured,
    language
  }
`;

// Get single post by slug
export const postBySlugQuery = groq`
  *[_type == "post" && slug.current == $slug && language == $language][0] {
    _id,
    title,
    slug,
    excerpt,
    "coverImage": coverImage.asset->url,
    "coverImageAlt": coverImage.alt,
    content,
    category,
    tags,
    author,
    publishedAt,
    readingTime,
    featured,
    language
  }
`;

// Get featured posts
export const featuredPostsQuery = groq`
  *[_type == "post" && featured == true && language == $language] | order(publishedAt desc)[0...3] {
    _id,
    title,
    slug,
    excerpt,
    "coverImage": coverImage.asset->url,
    category,
    publishedAt,
    readingTime
  }
`;

// Get all projects
export const projectsQuery = groq`
  *[_type == "project" && language == $language] | order(order asc, year desc) {
    _id,
    title,
    slug,
    description,
    "image": image.asset->url,
    technologies,
    category,
    client,
    year,
    liveUrl,
    githubUrl,
    featured
  }
`;

// Get single project
export const projectBySlugQuery = groq`
  *[_type == "project" && slug.current == $slug && language == $language][0] {
    _id,
    title,
    slug,
    description,
    longDescription,
    "image": image.asset->url,
    technologies,
    category,
    client,
    year,
    liveUrl,
    githubUrl,
    featured
  }
`;

// Get posts by category
export const postsByCategoryQuery = groq`
  *[_type == "post" && category == $category && language == $language] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    "coverImage": coverImage.asset->url,
    category,
    publishedAt,
    readingTime
  }
`;
```

### Step 13: Create Server Actions

```typescript
// sanity/lib/actions.ts
"use server";

import { client } from "./client";
import {
  postsQuery,
  postBySlugQuery,
  featuredPostsQuery,
  projectsQuery,
  projectBySlugQuery,
} from "./queries";

// Type definitions
export interface BlogPost {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt: string;
  coverImage: string;
  coverImageAlt?: string;
  content?: string;
  category: string;
  tags?: string[];
  author: string;
  publishedAt: string;
  readingTime: string;
  featured: boolean;
  language: string;
}

export interface Project {
  _id: string;
  title: string;
  slug: { current: string };
  description: string;
  longDescription?: string;
  image: string;
  technologies: string[];
  category: string;
  client?: string;
  year: string;
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
}

// Fetch all posts
export async function getAllPosts(
  language: "en" | "nl" = "en"
): Promise<BlogPost[]> {
  try {
    const posts = await client.fetch<BlogPost[]>(postsQuery, { language });
    return posts;
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
}

// Fetch single post by slug
export async function getPostBySlug(
  slug: string,
  language: "en" | "nl" = "en"
): Promise<BlogPost | null> {
  try {
    const post = await client.fetch<BlogPost>(postBySlugQuery, {
      slug,
      language,
    });
    return post;
  } catch (error) {
    console.error("Error fetching post:", error);
    return null;
  }
}

// Fetch featured posts
export async function getFeaturedPosts(
  language: "en" | "nl" = "en"
): Promise<BlogPost[]> {
  try {
    const posts = await client.fetch<BlogPost[]>(featuredPostsQuery, {
      language,
    });
    return posts;
  } catch (error) {
    console.error("Error fetching featured posts:", error);
    return [];
  }
}

// Fetch all projects
export async function getAllProjects(
  language: "en" | "nl" = "en"
): Promise<Project[]> {
  try {
    const projects = await client.fetch<Project[]>(projectsQuery, { language });
    return projects;
  } catch (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
}

// Fetch single project by slug
export async function getProjectBySlug(
  slug: string,
  language: "en" | "nl" = "en"
): Promise<Project | null> {
  try {
    const project = await client.fetch<Project>(projectBySlugQuery, {
      slug,
      language,
    });
    return project;
  } catch (error) {
    console.error("Error fetching project:", error);
    return null;
  }
}
```

---

## Real-time Preview with Draft Mode

### Step 14: Create Preview API Routes

```typescript
// app/api/draft/route.ts
import { draftMode } from "next/headers";
import { redirect } from "next/navigation";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");
  const slug = searchParams.get("slug");
  const type = searchParams.get("type");

  // Validate secret
  if (secret !== process.env.SANITY_PREVIEW_SECRET) {
    return new Response("Invalid token", { status: 401 });
  }

  // Enable draft mode
  (await draftMode()).enable();

  // Redirect to the preview page
  if (type === "post" && slug) {
    redirect(`/blog/${slug}`);
  } else if (type === "project" && slug) {
    redirect(`/projects/${slug}`);
  } else {
    redirect("/");
  }
}
```

```typescript
// app/api/disable-draft/route.ts
import { draftMode } from "next/headers";
import { redirect } from "next/navigation";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const returnUrl = searchParams.get("returnUrl") || "/";

  (await draftMode()).disable();
  redirect(returnUrl);
}
```

### Step 15: Create Preview Provider

```typescript
// components/PreviewProvider.tsx
"use client";

import { LiveQueryProvider } from "@sanity/preview-kit";
import { client } from "@/sanity/lib/client";

export default function PreviewProvider({
  children,
  token,
}: {
  children: React.ReactNode;
  token: string;
}) {
  return (
    <LiveQueryProvider client={client} token={token}>
      {children}
    </LiveQueryProvider>
  );
}
```

---

## Image Optimization

### Step 16: Create Image URL Builder

```typescript
// sanity/lib/image.ts
import imageUrlBuilder from "@sanity/image-url";
import { client } from "./client";

const builder = imageUrlBuilder(client);

export function urlFor(source: any) {
  return builder.image(source);
}

// Usage examples:
// urlFor(image).width(800).height(600).url()
// urlFor(image).width(400).blur(50).url()  // For placeholders
```

### Step 17: Create Optimized Image Component

```typescript
// components/SanityImage.tsx
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";

interface SanityImageProps {
  image: any;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  priority?: boolean;
  className?: string;
}

export function SanityImage({
  image,
  alt,
  width = 800,
  height = 600,
  fill = false,
  priority = false,
  className,
}: SanityImageProps) {
  if (!image) return null;

  const imageUrl = urlFor(image).width(width).height(height).url();
  const blurUrl = urlFor(image).width(20).blur(50).url();

  if (fill) {
    return (
      <Image
        src={imageUrl}
        alt={alt}
        fill
        priority={priority}
        className={className}
        placeholder="blur"
        blurDataURL={blurUrl}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    );
  }

  return (
    <Image
      src={imageUrl}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      className={className}
      placeholder="blur"
      blurDataURL={blurUrl}
    />
  );
}
```

---

## Internationalization Support

### Step 18: Configure Document Internationalization

The `@sanity/document-internationalization` plugin creates separate documents for each language:

```typescript
// In sanity.config.ts
documentInternationalization({
  supportedLanguages: [
    { id: "en", title: "English" },
    { id: "nl", title: "Nederlands" },
  ],
  schemaTypes: ["post", "project", "page"],
})
```

### Step 19: Fetch Localized Content

```typescript
// Example: Fetching posts for current locale
export async function getLocalizedPosts(locale: string) {
  const language = locale === "nl" ? "nl" : "en";
  const posts = await getAllPosts(language);
  return posts;
}
```

---

## Deployment and Production

### Step 20: Configure CORS for Sanity

In your Sanity project settings (sanity.io/manage):

1. Go to API → CORS Origins
2. Add your production URLs:
   - `https://your-domain.com`
   - `http://localhost:3000` (for development)

### Step 21: Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
```

### Step 22: Configure Revalidation

For ISR (Incremental Static Regeneration):

```typescript
// app/blog/[slug]/page.tsx
export const revalidate = 3600; // Revalidate every hour

// Or use on-demand revalidation with webhooks
```

Create a webhook endpoint:

```typescript
// app/api/revalidate/route.ts
import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const secret = request.headers.get("x-sanity-webhook-secret");

  if (secret !== process.env.SANITY_WEBHOOK_SECRET) {
    return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
  }

  const { _type, slug } = body;

  // Revalidate based on document type
  if (_type === "post") {
    revalidatePath("/blog");
    if (slug?.current) {
      revalidatePath(`/blog/${slug.current}`);
    }
  } else if (_type === "project") {
    revalidatePath("/projects");
    if (slug?.current) {
      revalidatePath(`/projects/${slug.current}`);
    }
  }

  return NextResponse.json({ revalidated: true });
}
```

---

## Best Practices and Tips

### 1. Type Safety

Generate TypeScript types from your schemas:

```bash
# Using sanity-codegen or sanity typegen
npx sanity typegen generate
```

### 2. Query Performance

Use projections to fetch only needed fields:

```groq
// Good - fetch only what you need
*[_type == "post"] { title, slug, excerpt }

// Bad - fetches entire document
*[_type == "post"]
```

### 3. Caching Strategy

```typescript
// Static pages with revalidation
export const revalidate = 3600;

// Dynamic pages
export const dynamic = "force-dynamic";

// Use tags for granular cache control
const posts = await client.fetch(query, params, {
  next: { tags: ["posts"] },
});
```

### 4. Error Handling

Always handle errors gracefully:

```typescript
export async function getPost(slug: string) {
  try {
    const post = await client.fetch(query, { slug });
    if (!post) {
      notFound();
    }
    return post;
  } catch (error) {
    console.error("Failed to fetch post:", error);
    throw new Error("Failed to load post");
  }
}
```

### 5. Studio Customization

Create a custom desk structure for better editorial experience:

```typescript
// sanity/structure.ts
import { StructureBuilder } from "sanity/structure";

export const structure = (S: StructureBuilder) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Blog Posts")
        .child(
          S.documentList()
            .title("Blog Posts")
            .filter('_type == "post"')
        ),
      S.listItem()
        .title("Projects")
        .child(
          S.documentList()
            .title("Projects")
            .filter('_type == "project"')
        ),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (item) => !["post", "project"].includes(item.getId() || "")
      ),
    ]);
```

---

## Conclusion

Sanity + Next.js is a powerful combination that gives you:

- **Editorial Freedom**: Non-technical users can easily manage content
- **Developer Experience**: Type-safe queries, real-time preview, modern tooling
- **Performance**: Optimized images, smart caching, fast builds
- **Flexibility**: Custom schemas, localization, any rendering strategy

The setup might seem involved, but once configured, it provides an excellent foundation for content-rich websites. The investment in proper setup pays dividends in maintainability and content management efficiency.

For my portfolio, this setup handles blog posts in multiple languages, project case studies, and dynamic page content - all manageable through a beautiful studio interface.

---

## Resources

- [Sanity Documentation](https://www.sanity.io/docs)
- [Next.js + Sanity Guide](https://www.sanity.io/guides/nextjs-app-router)
- [GROQ Query Cheat Sheet](https://www.sanity.io/docs/query-cheat-sheet)
- [Sanity TypeScript Guide](https://www.sanity.io/docs/typescript)
