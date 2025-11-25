# Een Moderne CMS-Gestuurde Website Bouwen met Sanity en Next.js 16

**Categorie:** Tutorial  
**Tags:** Sanity, Next.js, CMS, Headless CMS, React, TypeScript  
**Leestijd:** 20 min lezen  
**Auteur:** Leroy Steding

---

Sanity.io is een van de krachtigste en meest flexibele headless CMS platformen die vandaag beschikbaar zijn. Gecombineerd met Next.js creëert het een krachtpatser voor het bouwen van content-rijke websites met uitstekende developer experience en redactionele flexibiliteit. In deze uitgebreide handleiding laat ik je zien hoe je Sanity opzet met Next.js 16 vanaf nul, gebaseerd op mijn productie-implementatie.

## Inhoudsopgave

1. [Waarom Sanity + Next.js?](#waarom-sanity--nextjs)
2. [Project Setup](#project-setup)
3. [Sanity Studio Configuratie](#sanity-studio-configuratie)
4. [Content Schema's Maken](#content-schemas-maken)
5. [Content Ophalen met GROQ](#content-ophalen-met-groq)
6. [Real-time Preview met Draft Mode](#real-time-preview-met-draft-mode)
7. [Image Optimalisatie](#image-optimalisatie)
8. [Internationalisatie Ondersteuning](#internationalisatie-ondersteuning)
9. [Deployment en Productie](#deployment-en-productie)
10. [Best Practices en Tips](#best-practices-en-tips)

---

## Waarom Sanity + Next.js?

Voordat we in de implementatie duiken, laten we begrijpen waarom deze combinatie zo krachtig is:

### Sanity Voordelen

- **Real-time Samenwerking**: Meerdere redacteuren kunnen tegelijk werken
- **Gestructureerde Content**: Definieer je eigen schema's met volledige TypeScript ondersteuning
- **GROQ Query Taal**: Krachtige en flexibele content queries
- **Asset Pipeline**: Ingebouwde image optimalisatie en transformaties
- **Portable Text**: Rich text met volledige aanpassing
- **Genereuze Gratis Tier**: Geschikt voor de meeste projecten

### Next.js Voordelen

- **Server Components**: Haal data op aan serverkant voor betere prestaties
- **App Router**: Moderne routing met layouts en loading states
- **Image Optimalisatie**: Automatische image optimalisatie
- **ISR/SSG/SSR**: Kies je rendering strategie per pagina
- **TypeScript**: Eersteklas TypeScript ondersteuning

### De Combinatie

Samen bieden ze:
- Content editors krijgen een mooie, aanpasbare studio
- Developers krijgen type-safe content met uitstekende DX
- Gebruikers krijgen snelle, SEO-geoptimaliseerde pagina's
- Iedereen krijgt real-time preview mogelijkheden

---

## Project Setup

### Stap 1: Next.js Project Maken

Bij een nieuw project:

```bash
npx create-next-app@latest my-sanity-site --typescript --tailwind --app
cd my-sanity-site
```

### Stap 2: Sanity Dependencies Installeren

```bash
# Core Sanity packages
pnpm add sanity @sanity/vision @sanity/image-url next-sanity

# Voor rich text/markdown
pnpm add sanity-plugin-markdown @portabletext/react

# Voor internationalisatie (optioneel)
pnpm add @sanity/document-internationalization
```

### Stap 3: Sanity Project Maken

```bash
# Initialiseer Sanity (als je nog geen project hebt)
npx sanity@latest init --env

# Of maak handmatig een project op sanity.io/manage
```

### Stap 4: Environment Variables

Maak `.env.local`:

```bash
# Sanity Configuratie
NEXT_PUBLIC_SANITY_PROJECT_ID=jouw-project-id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
SANITY_API_TOKEN=jouw-api-token  # Voor server-side operaties

# Site URL (voor preview)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## Sanity Studio Configuratie

### Stap 5: Sanity Configureren

Maak `sanity.config.ts` in je project root:

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
  title: "Mijn Website",

  projectId,
  dataset,

  // Studio embedden op /studio route
  basePath: "/studio",

  plugins: [
    // Custom desk structuur
    structureTool({ structure }),
    
    // Visueel bewerken en preview
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
    
    // Markdown ondersteuning
    markdownSchema(),
    
    // Internationalisatie
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

### Stap 6: Studio Route Maken

Maak `app/studio/[[...tool]]/page.tsx`:

```typescript
// app/studio/[[...tool]]/page.tsx
"use client";

import { NextStudio } from "next-sanity/studio";
import config from "../../../sanity.config";

export default function StudioPage() {
  return <NextStudio config={config} />;
}
```

Maak `app/studio/[[...tool]]/layout.tsx`:

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
    <html lang="nl">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
```

---

## Content Schema's Maken

### Stap 7: Schema Structuur Opzetten

Maak de schema directory:

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

### Stap 8: Blog Post Schema Maken

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
      title: "Titel",
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
      title: "Samenvatting",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required().max(200),
    }),
    defineField({
      name: "coverImage",
      title: "Cover Afbeelding",
      type: "image",
      options: {
        hotspot: true,  // Schakel focuspunt selectie in
      },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alternatieve Tekst",
          description: "Belangrijk voor toegankelijkheid en SEO",
        },
      ],
    }),
    defineField({
      name: "content",
      title: "Inhoud",
      type: "markdown",  // Gebruik markdown plugin
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "category",
      title: "Categorie",
      type: "string",
      options: {
        list: [
          { title: "Artikel", value: "article" },
          { title: "Tutorial", value: "tutorial" },
          { title: "Onderzoek", value: "research" },
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
      title: "Auteur",
      type: "string",
      initialValue: "Jouw Naam",
    }),
    defineField({
      name: "publishedAt",
      title: "Gepubliceerd Op",
      type: "datetime",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "readingTime",
      title: "Leestijd",
      type: "string",
      description: 'bijv. "8 min lezen"',
    }),
    defineField({
      name: "featured",
      title: "Uitgelicht",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "language",
      title: "Taal",
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
        subtitle: `${category} ${featured ? "⭐ Uitgelicht" : ""} door ${author}`,
        media: selection.media,
      };
    },
  },
});
```

### Stap 9: Project Schema Maken

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
      title: "Titel",
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
      title: "Beschrijving",
      type: "text",
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "longDescription",
      title: "Uitgebreide Beschrijving",
      type: "markdown",
    }),
    defineField({
      name: "image",
      title: "Project Afbeelding",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "technologies",
      title: "Technologieën",
      type: "array",
      of: [{ type: "string" }],
      options: {
        layout: "tags",
      },
    }),
    defineField({
      name: "category",
      title: "Categorie",
      type: "string",
      options: {
        list: [
          { title: "Webontwikkeling", value: "web" },
          { title: "Mobiele App", value: "mobile" },
          { title: "E-commerce", value: "ecommerce" },
          { title: "SaaS", value: "saas" },
        ],
      },
    }),
    defineField({
      name: "client",
      title: "Klant",
      type: "string",
    }),
    defineField({
      name: "year",
      title: "Jaar",
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
      title: "Uitgelicht",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "order",
      title: "Weergave Volgorde",
      type: "number",
    }),
    defineField({
      name: "language",
      title: "Taal",
      type: "string",
      readOnly: true,
      hidden: true,
    }),
  ],
  orderings: [
    {
      title: "Weergave Volgorde",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
    {
      title: "Jaar, Nieuwste",
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
        subtitle: `${client || "Persoonlijk"} ${featured ? "⭐" : ""}`,
        media: selection.media,
      };
    },
  },
});
```

### Stap 10: Schema's Exporteren

```typescript
// sanity/schemas/index.ts
import post from "./post";
import project from "./project";

export const schemaTypes = [post, project];
```

---

## Content Ophalen met GROQ

### Stap 11: Sanity Client Maken

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

// Client met auth token voor mutaties
export const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});
```

### Stap 12: GROQ Queries Maken

```typescript
// sanity/lib/queries.ts
import { groq } from "next-sanity";

// Alle posts ophalen
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

// Enkele post op slug
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

// Uitgelichte posts ophalen
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

// Alle projecten ophalen
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

// Enkel project ophalen
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

// Posts op categorie
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

### Stap 13: Server Actions Maken

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

// Type definities
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

// Alle posts ophalen
export async function getAllPosts(
  language: "en" | "nl" = "en"
): Promise<BlogPost[]> {
  try {
    const posts = await client.fetch<BlogPost[]>(postsQuery, { language });
    return posts;
  } catch (error) {
    console.error("Fout bij ophalen posts:", error);
    return [];
  }
}

// Enkele post op slug ophalen
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
    console.error("Fout bij ophalen post:", error);
    return null;
  }
}

// Uitgelichte posts ophalen
export async function getFeaturedPosts(
  language: "en" | "nl" = "en"
): Promise<BlogPost[]> {
  try {
    const posts = await client.fetch<BlogPost[]>(featuredPostsQuery, {
      language,
    });
    return posts;
  } catch (error) {
    console.error("Fout bij ophalen uitgelichte posts:", error);
    return [];
  }
}

// Alle projecten ophalen
export async function getAllProjects(
  language: "en" | "nl" = "en"
): Promise<Project[]> {
  try {
    const projects = await client.fetch<Project[]>(projectsQuery, { language });
    return projects;
  } catch (error) {
    console.error("Fout bij ophalen projecten:", error);
    return [];
  }
}

// Enkel project op slug ophalen
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
    console.error("Fout bij ophalen project:", error);
    return null;
  }
}
```

---

## Real-time Preview met Draft Mode

### Stap 14: Preview API Routes Maken

```typescript
// app/api/draft/route.ts
import { draftMode } from "next/headers";
import { redirect } from "next/navigation";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");
  const slug = searchParams.get("slug");
  const type = searchParams.get("type");

  // Valideer secret
  if (secret !== process.env.SANITY_PREVIEW_SECRET) {
    return new Response("Ongeldige token", { status: 401 });
  }

  // Schakel draft mode in
  (await draftMode()).enable();

  // Redirect naar de preview pagina
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

---

## Image Optimalisatie

### Stap 16: Image URL Builder Maken

```typescript
// sanity/lib/image.ts
import imageUrlBuilder from "@sanity/image-url";
import { client } from "./client";

const builder = imageUrlBuilder(client);

export function urlFor(source: any) {
  return builder.image(source);
}

// Gebruik voorbeelden:
// urlFor(image).width(800).height(600).url()
// urlFor(image).width(400).blur(50).url()  // Voor placeholders
```

### Stap 17: Geoptimaliseerde Image Component Maken

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

## Internationalisatie Ondersteuning

### Stap 18: Document Internationalisatie Configureren

De `@sanity/document-internationalization` plugin maakt aparte documenten voor elke taal:

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

### Stap 19: Gelokaliseerde Content Ophalen

```typescript
// Voorbeeld: Posts ophalen voor huidige locale
export async function getLocalizedPosts(locale: string) {
  const language = locale === "nl" ? "nl" : "en";
  const posts = await getAllPosts(language);
  return posts;
}
```

---

## Deployment en Productie

### Stap 20: CORS Configureren voor Sanity

In je Sanity project instellingen (sanity.io/manage):

1. Ga naar API → CORS Origins
2. Voeg je productie URL's toe:
   - `https://jouw-domein.com`
   - `http://localhost:3000` (voor ontwikkeling)

### Stap 21: Deployen naar Vercel

```bash
# Installeer Vercel CLI
npm install -g vercel

# Deploy
vercel

# Stel environment variables in via Vercel dashboard
```

### Stap 22: Revalidatie Configureren

Voor ISR (Incremental Static Regeneration):

```typescript
// app/blog/[slug]/page.tsx
export const revalidate = 3600; // Hervalideer elk uur

// Of gebruik on-demand revalidatie met webhooks
```

Maak een webhook endpoint:

```typescript
// app/api/revalidate/route.ts
import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const secret = request.headers.get("x-sanity-webhook-secret");

  if (secret !== process.env.SANITY_WEBHOOK_SECRET) {
    return NextResponse.json({ message: "Ongeldige secret" }, { status: 401 });
  }

  const { _type, slug } = body;

  // Hervalideer op basis van document type
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

## Best Practices en Tips

### 1. Type Safety

Genereer TypeScript types vanuit je schema's:

```bash
# Met sanity-codegen of sanity typegen
npx sanity typegen generate
```

### 2. Query Performance

Gebruik projections om alleen benodigde velden op te halen:

```groq
// Goed - haal alleen wat je nodig hebt op
*[_type == "post"] { title, slug, excerpt }

// Slecht - haalt hele document op
*[_type == "post"]
```

### 3. Caching Strategie

```typescript
// Statische pagina's met revalidatie
export const revalidate = 3600;

// Dynamische pagina's
export const dynamic = "force-dynamic";

// Gebruik tags voor granulaire cache controle
const posts = await client.fetch(query, params, {
  next: { tags: ["posts"] },
});
```

### 4. Error Handling

Handel fouten altijd netjes af:

```typescript
export async function getPost(slug: string) {
  try {
    const post = await client.fetch(query, { slug });
    if (!post) {
      notFound();
    }
    return post;
  } catch (error) {
    console.error("Kon post niet ophalen:", error);
    throw new Error("Kon post niet laden");
  }
}
```

### 5. Studio Aanpassing

Maak een custom desk structuur voor betere redactionele ervaring:

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
        .title("Projecten")
        .child(
          S.documentList()
            .title("Projecten")
            .filter('_type == "project"')
        ),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (item) => !["post", "project"].includes(item.getId() || "")
      ),
    ]);
```

---

## Conclusie

Sanity + Next.js is een krachtige combinatie die je geeft:

- **Redactionele Vrijheid**: Niet-technische gebruikers kunnen eenvoudig content beheren
- **Developer Experience**: Type-safe queries, real-time preview, moderne tooling
- **Prestaties**: Geoptimaliseerde afbeeldingen, slimme caching, snelle builds
- **Flexibiliteit**: Custom schema's, lokalisatie, elke rendering strategie

De setup lijkt misschien uitgebreid, maar eenmaal geconfigureerd biedt het een uitstekende basis voor content-rijke websites. De investering in een goede setup betaalt zich terug in onderhoudbaarheid en efficiëntie van content management.

Voor mijn portfolio handelt deze setup blogposts in meerdere talen, project case studies en dynamische pagina-inhoud - allemaal beheersbaar via een mooie studio interface.

---

## Bronnen

- [Sanity Documentatie](https://www.sanity.io/docs)
- [Next.js + Sanity Handleiding](https://www.sanity.io/guides/nextjs-app-router)
- [GROQ Query Cheat Sheet](https://www.sanity.io/docs/query-cheat-sheet)
- [Sanity TypeScript Handleiding](https://www.sanity.io/docs/typescript)
