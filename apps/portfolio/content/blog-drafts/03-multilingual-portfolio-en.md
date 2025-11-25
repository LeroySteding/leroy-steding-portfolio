# Building a Fully Internationalized Portfolio with Next.js 16 and next-intl

**Category:** Tutorial  
**Tags:** Next.js, Internationalization, i18n, next-intl, React, TypeScript  
**Reading time:** 18 min read  
**Author:** Leroy Steding

---

Creating a multilingual website isn't just about translating text—it's about providing a seamless experience for users in their preferred language, including proper URL structures, language-specific content, and culturally appropriate formatting. In this comprehensive guide, I'll show you how to build a fully internationalized portfolio using Next.js 16 and next-intl, based on my production implementation supporting English and Dutch.

## Table of Contents

1. [Why Internationalization Matters](#why-internationalization-matters)
2. [Choosing the Right i18n Library](#choosing-the-right-i18n-library)
3. [Project Setup and Configuration](#project-setup-and-configuration)
4. [Setting Up next-intl](#setting-up-next-intl)
5. [Creating Translation Files](#creating-translation-files)
6. [Implementing the Language Switcher](#implementing-the-language-switcher)
7. [Translating Dynamic Content](#translating-dynamic-content)
8. [SEO for Multilingual Sites](#seo-for-multilingual-sites)
9. [Date, Number, and Currency Formatting](#date-number-and-currency-formatting)
10. [Best Practices and Common Pitfalls](#best-practices-and-common-pitfalls)

---

## Why Internationalization Matters

Before diving into implementation, let's understand why i18n is crucial:

### Business Benefits

- **Expanded Reach**: Reach users in different regions and languages
- **Better SEO**: Rank in local search results for different languages
- **Professional Image**: Demonstrates attention to detail and global awareness
- **User Trust**: People prefer content in their native language

### Technical Benefits

- **Organized Codebase**: Separates content from code
- **Easier Maintenance**: Update translations without code changes
- **Scalability**: Easy to add new languages later
- **Type Safety**: Modern i18n libraries provide TypeScript support

---

## Choosing the Right i18n Library

For Next.js App Router, the main options are:

### next-intl (Recommended)

**Pros:**
- First-class App Router support
- TypeScript support with type-safe translations
- Server Component compatible
- Active development and community
- Rich formatting capabilities

**Cons:**
- Requires middleware configuration

### next-i18next

**Pros:**
- Long-standing library
- Large community

**Cons:**
- Pages Router focused
- App Router support is still evolving

### react-intl

**Pros:**
- Part of FormatJS ecosystem
- Extensive formatting

**Cons:**
- More complex setup for Next.js
- Fewer Next.js-specific features

**My choice: next-intl** - It provides the best developer experience for Next.js App Router projects.

---

## Project Setup and Configuration

### Step 1: Install Dependencies

```bash
pnpm add next-intl
```

### Step 2: Project Structure

Create an organized structure for translations:

```
your-project/
├── locales/
│   ├── en.ts          # English translations
│   └── nl.ts          # Dutch translations
├── i18n/
│   ├── config.ts      # i18n configuration
│   ├── request.ts     # Server-side i18n setup
│   └── routing.ts     # Routing configuration
├── app/
│   └── [locale]/      # Locale-prefixed routes
│       ├── layout.tsx
│       ├── page.tsx
│       └── ...
└── middleware.ts      # Locale detection middleware
```

### Step 3: Configure i18n Settings

Create `i18n/config.ts`:

```typescript
export const locales = ['en', 'nl'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

export const localeNames: Record<Locale, string> = {
  en: 'English',
  nl: 'Nederlands',
};

export const localeFlags: Record<Locale, string> = {
  en: '🇬🇧',
  nl: '🇳🇱',
};
```

---

## Setting Up next-intl

### Step 1: Create Routing Configuration

Create `i18n/routing.ts`:

```typescript
import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';
import { locales, defaultLocale } from './config';

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: 'as-needed', // Only show prefix for non-default locale
});

// Export navigation utilities
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
```

### Step 2: Set Up Middleware

Create `middleware.ts` in your project root:

```typescript
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Match all pathnames except for
  // - API routes
  // - Static files
  // - Internal Next.js paths
  matcher: [
    '/',
    '/(nl|en)/:path*',
    '/((?!api|_next|_vercel|studio|.*\\..*).*)',
  ],
};
```

### Step 3: Configure Server-Side i18n

Create `i18n/request.ts`:

```typescript
import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  // Get the locale from the request
  let locale = await requestLocale;

  // Validate and fallback
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  // Load translations
  const messages = (await import(`../locales/${locale}.ts`)).default;

  return {
    locale,
    messages,
    timeZone: 'Europe/Amsterdam',
    now: new Date(),
  };
});
```

### Step 4: Update Next.js Config

Update `next.config.ts`:

```typescript
import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const nextConfig: NextConfig = {
  // Your other config options
};

export default withNextIntl(nextConfig);
```

### Step 5: Create Root Layout

Create `app/[locale]/layout.tsx`:

```typescript
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { locales, type Locale } from '@/i18n/config';

interface Props {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  // Validate locale
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  // Get messages for client components
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
```

---

## Creating Translation Files

### Step 1: Create English Translations

Create `locales/en.ts`:

```typescript
export default {
  metadata: {
    title: 'Leroy Steding - Full-Stack Developer',
    description: 'Building modern web applications with React and Next.js',
  },
  navigation: {
    home: 'Home',
    about: 'About',
    projects: 'Projects',
    blog: 'Blog',
    contact: 'Contact',
  },
  hero: {
    greeting: 'Hello, I am',
    name: 'Leroy Steding',
    title: 'Full-Stack Developer',
    subtitle: 'I build modern, scalable web applications',
    cta: {
      primary: 'View Projects',
      secondary: 'Contact Me',
    },
  },
  about: {
    title: 'About',
    titleHighlight: 'Me',
    description: 'Passionate developer with expertise in modern web technologies',
    yearsExperience: '{years} Years Experience',
    projectsCompleted: '{count} Projects Completed',
  },
  projects: {
    title: 'Featured',
    titleHighlight: 'Projects',
    viewAll: 'View All Projects',
    viewProject: 'View Project',
    technologies: 'Technologies',
  },
  blog: {
    title: 'Latest from the',
    titleHighlight: 'Blog',
    readMore: 'Read More',
    viewAll: 'View All Posts',
    minRead: '{minutes} min read',
  },
  contact: {
    title: 'Get in',
    titleHighlight: 'Touch',
    description: "Let's discuss your next project",
    form: {
      name: 'Your Name',
      email: 'Your Email',
      message: 'Your Message',
      submit: 'Send Message',
      sending: 'Sending...',
      success: 'Message sent successfully!',
      error: 'Failed to send message. Please try again.',
    },
  },
  footer: {
    copyright: '© {year} Leroy Steding. All rights reserved.',
    builtWith: 'Built with Next.js and Sanity',
  },
  common: {
    loading: 'Loading...',
    error: 'Something went wrong',
    retry: 'Try Again',
    backToHome: 'Back to Home',
  },
} as const;
```

### Step 2: Create Dutch Translations

Create `locales/nl.ts`:

```typescript
export default {
  metadata: {
    title: 'Leroy Steding - Full-Stack Developer',
    description: 'Moderne webapplicaties bouwen met React en Next.js',
  },
  navigation: {
    home: 'Home',
    about: 'Over Mij',
    projects: 'Projecten',
    blog: 'Blog',
    contact: 'Contact',
  },
  hero: {
    greeting: 'Hallo, ik ben',
    name: 'Leroy Steding',
    title: 'Full-Stack Developer',
    subtitle: 'Ik bouw moderne, schaalbare webapplicaties',
    cta: {
      primary: 'Bekijk Projecten',
      secondary: 'Neem Contact Op',
    },
  },
  about: {
    title: 'Over',
    titleHighlight: 'Mij',
    description: 'Gepassioneerde developer met expertise in moderne webtechnologieën',
    yearsExperience: '{years} Jaar Ervaring',
    projectsCompleted: '{count} Projecten Voltooid',
  },
  projects: {
    title: 'Uitgelichte',
    titleHighlight: 'Projecten',
    viewAll: 'Bekijk Alle Projecten',
    viewProject: 'Bekijk Project',
    technologies: 'Technologieën',
  },
  blog: {
    title: 'Laatste uit de',
    titleHighlight: 'Blog',
    readMore: 'Lees Meer',
    viewAll: 'Bekijk Alle Berichten',
    minRead: '{minutes} min lezen',
  },
  contact: {
    title: 'Neem',
    titleHighlight: 'Contact Op',
    description: 'Laten we uw volgende project bespreken',
    form: {
      name: 'Uw Naam',
      email: 'Uw E-mail',
      message: 'Uw Bericht',
      submit: 'Verstuur Bericht',
      sending: 'Versturen...',
      success: 'Bericht succesvol verzonden!',
      error: 'Bericht versturen mislukt. Probeer het opnieuw.',
    },
  },
  footer: {
    copyright: '© {year} Leroy Steding. Alle rechten voorbehouden.',
    builtWith: 'Gebouwd met Next.js en Sanity',
  },
  common: {
    loading: 'Laden...',
    error: 'Er is iets misgegaan',
    retry: 'Probeer Opnieuw',
    backToHome: 'Terug naar Home',
  },
} as const;
```

---

## Implementing the Language Switcher

### Step 1: Create the Language Switcher Component

Create `components/ui/LanguageSwitcher.tsx`:

```typescript
'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/routing';
import { locales, localeNames, localeFlags, type Locale } from '@/i18n/config';
import { useState, useTransition } from 'react';
import { ChevronDown, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);

  const handleLocaleChange = (newLocale: Locale) => {
    startTransition(() => {
      router.replace(pathname, { locale: newLocale });
    });
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isPending}
        className={`
          flex items-center gap-2 px-3 py-2 rounded-lg
          bg-gray-100 dark:bg-gray-800
          hover:bg-gray-200 dark:hover:bg-gray-700
          transition-colors duration-200
          ${isPending ? 'opacity-50 cursor-wait' : ''}
        `}
        aria-label="Select language"
        aria-expanded={isOpen}
      >
        <Globe className="w-4 h-4" />
        <span className="text-lg">{localeFlags[locale]}</span>
        <span className="hidden sm:inline text-sm font-medium">
          {localeNames[locale]}
        </span>
        <ChevronDown
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 mt-2 w-48 py-2 z-50 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700"
            >
              {locales.map((loc) => (
                <button
                  key={loc}
                  onClick={() => handleLocaleChange(loc)}
                  className={`
                    w-full flex items-center gap-3 px-4 py-2.5
                    hover:bg-gray-50 dark:hover:bg-gray-700
                    transition-colors duration-150
                    ${loc === locale ? 'bg-gray-50 dark:bg-gray-700' : ''}
                  `}
                >
                  <span className="text-xl">{localeFlags[loc]}</span>
                  <span className="font-medium">{localeNames[loc]}</span>
                  {loc === locale && (
                    <span className="ml-auto text-blue-600">✓</span>
                  )}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
```

### Step 2: Add to Navigation

```typescript
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';

export function Navigation() {
  return (
    <nav className="flex items-center gap-4">
      {/* Navigation links */}
      <LanguageSwitcher />
    </nav>
  );
}
```

---

## Translating Dynamic Content

### Using Translations in Server Components

```typescript
import { getTranslations } from 'next-intl/server';

export default async function AboutPage() {
  const t = await getTranslations('about');

  return (
    <section>
      <h1>
        {t('title')} <span className="text-blue-600">{t('titleHighlight')}</span>
      </h1>
      <p>{t('description')}</p>
      
      {/* With interpolation */}
      <p>{t('yearsExperience', { years: 5 })}</p>
      <p>{t('projectsCompleted', { count: 50 })}</p>
    </section>
  );
}
```

### Using Translations in Client Components

```typescript
'use client';

import { useTranslations } from 'next-intl';

export default function ContactForm() {
  const t = useTranslations('contact.form');
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <form>
      <input placeholder={t('name')} />
      <input placeholder={t('email')} type="email" />
      <textarea placeholder={t('message')} />
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? t('sending') : t('submit')}
      </button>
    </form>
  );
}
```

### Translating CMS Content (Sanity)

For CMS content, filter by language:

```typescript
// sanity/lib/queries.ts
export const getPostsByLanguage = groq`
  *[_type == "post" && language == $language] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    publishedAt,
    "readingTime": readingTime
  }
`;

// In your page
export default async function BlogPage({ params }: Props) {
  const { locale } = await params;
  const posts = await client.fetch(getPostsByLanguage, { language: locale });
  
  return <BlogList posts={posts} />;
}
```

---

## SEO for Multilingual Sites

### Step 1: Generate Metadata with Translations

```typescript
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://leroysteding.com';

  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: `${baseUrl}/${locale}`,
      languages: {
        en: `${baseUrl}/en`,
        nl: `${baseUrl}/nl`,
        'x-default': baseUrl,
      },
    },
    openGraph: {
      title: t('title'),
      description: t('description'),
      locale: locale,
      alternateLocale: locale === 'en' ? 'nl' : 'en',
    },
  };
}
```

### Step 2: Add hreflang Tags

The `alternates.languages` in metadata automatically generates hreflang tags:

```html
<link rel="alternate" hreflang="en" href="https://leroysteding.com/en" />
<link rel="alternate" hreflang="nl" href="https://leroysteding.com/nl" />
<link rel="alternate" hreflang="x-default" href="https://leroysteding.com" />
```

### Step 3: Generate Sitemap with All Languages

Create `app/sitemap.ts`:

```typescript
import { MetadataRoute } from 'next';
import { locales } from '@/i18n/config';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://leroysteding.com';
  
  const routes = ['', '/about', '/projects', '/blog', '/contact'];
  
  const sitemap: MetadataRoute.Sitemap = [];
  
  for (const route of routes) {
    for (const locale of locales) {
      const url = locale === 'en' 
        ? `${baseUrl}${route}` 
        : `${baseUrl}/${locale}${route}`;
      
      sitemap.push({
        url,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: route === '' ? 1 : 0.8,
        alternates: {
          languages: Object.fromEntries(
            locales.map((l) => [
              l,
              l === 'en' ? `${baseUrl}${route}` : `${baseUrl}/${l}${route}`,
            ])
          ),
        },
      });
    }
  }
  
  return sitemap;
}
```

---

## Date, Number, and Currency Formatting

### Using next-intl Formatters

```typescript
'use client';

import { useFormatter, useLocale } from 'next-intl';

export default function FormattingExamples() {
  const format = useFormatter();
  const locale = useLocale();

  const date = new Date('2024-01-15');
  const number = 1234567.89;
  const price = 99.99;

  return (
    <div>
      {/* Date formatting */}
      <p>Short: {format.dateTime(date, { dateStyle: 'short' })}</p>
      <p>Long: {format.dateTime(date, { dateStyle: 'long' })}</p>
      <p>Relative: {format.relativeTime(date)}</p>

      {/* Number formatting */}
      <p>Number: {format.number(number)}</p>
      <p>Percent: {format.number(0.25, { style: 'percent' })}</p>

      {/* Currency formatting */}
      <p>
        Price: {format.number(price, {
          style: 'currency',
          currency: 'EUR',
        })}
      </p>
    </div>
  );
}
```

**Output for English (en):**
```
Short: 1/15/24
Long: January 15, 2024
Relative: 3 months ago
Number: 1,234,567.89
Percent: 25%
Price: €99.99
```

**Output for Dutch (nl):**
```
Short: 15-01-24
Long: 15 januari 2024
Relative: 3 maanden geleden
Number: 1.234.567,89
Percent: 25%
Price: € 99,99
```

---

## Best Practices and Common Pitfalls

### Best Practices

#### 1. Use Namespaces for Organization

```typescript
// locales/en.ts
export default {
  navigation: { /* ... */ },
  hero: { /* ... */ },
  about: { /* ... */ },
  // Organized by feature/section
};
```

#### 2. Create Type-Safe Translations

```typescript
// types/i18n.ts
import en from '@/locales/en';

export type Messages = typeof en;
export type NestedKeyOf<T> = T extends object
  ? { [K in keyof T]: `${K & string}` | `${K & string}.${NestedKeyOf<T[K]>}` }[keyof T]
  : never;
export type TranslationKey = NestedKeyOf<Messages>;
```

#### 3. Handle Missing Translations Gracefully

```typescript
// i18n/request.ts
export default getRequestConfig(async ({ requestLocale }) => {
  // ...
  return {
    locale,
    messages,
    onError(error) {
      if (error.code === 'MISSING_MESSAGE') {
        console.warn('Missing translation:', error.message);
      } else {
        console.error('i18n error:', error);
      }
    },
    getMessageFallback({ key, namespace }) {
      return `[${namespace}.${key}]`;
    },
  };
});
```

#### 4. Lazy Load Large Translation Files

```typescript
// For very large translation files
const messages = await import(`../locales/${locale}.json`).then(
  (module) => module.default
);
```

### Common Pitfalls to Avoid

#### 1. Don't Hardcode Strings

```typescript
// ❌ Bad
<button>Submit</button>

// ✅ Good
<button>{t('form.submit')}</button>
```

#### 2. Don't Concatenate Translations

```typescript
// ❌ Bad - Word order differs between languages
<p>{t('hello')} {name}!</p>

// ✅ Good - Use interpolation
<p>{t('greeting', { name })}</p>
// en: "Hello, {name}!"
// nl: "Hallo, {name}!"
```

#### 3. Don't Forget About Pluralization

```typescript
// locales/en.ts
export default {
  items: {
    count: '{count, plural, =0 {No items} =1 {One item} other {# items}}',
  },
};

// Usage
t('items.count', { count: 5 }); // "5 items"
```

#### 4. Don't Ignore RTL Languages

If you plan to support RTL languages (Arabic, Hebrew):

```typescript
// app/[locale]/layout.tsx
export default function Layout({ children, params }) {
  const { locale } = params;
  const dir = ['ar', 'he'].includes(locale) ? 'rtl' : 'ltr';

  return (
    <html lang={locale} dir={dir}>
      <body>{children}</body>
    </html>
  );
}
```

---

## Conclusion

You've now learned how to build a fully internationalized portfolio with:

- ✅ next-intl setup with Next.js 16 App Router
- ✅ Type-safe translation files
- ✅ Language switcher with smooth transitions
- ✅ Server and client component translations
- ✅ CMS content translation with Sanity
- ✅ SEO optimization with hreflang tags
- ✅ Date, number, and currency formatting
- ✅ Best practices for maintainable i18n

### Next Steps

1. **Add More Languages**: Expand your reach by adding more locales
2. **Implement Translation Management**: Consider tools like Crowdin or Lokalise
3. **A/B Test Languages**: Measure engagement across different locales
4. **Automate Translation**: Use AI tools to help with initial translations

### Resources

- [next-intl Documentation](https://next-intl-docs.vercel.app/)
- [Next.js Internationalization Guide](https://nextjs.org/docs/app/building-your-application/routing/internationalization)
- [Google's i18n Best Practices](https://developers.google.com/search/docs/specialty/international)

---

*Happy internationalizing! 🌍*
