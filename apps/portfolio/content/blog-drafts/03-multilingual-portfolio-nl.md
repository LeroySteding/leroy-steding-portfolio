# Een Volledig Geïnternationaliseerd Portfolio Bouwen met Next.js 16 en next-intl

**Categorie:** Tutorial  
**Tags:** Next.js, Internationalisatie, i18n, next-intl, React, TypeScript  
**Leestijd:** 18 min lezen  
**Auteur:** Leroy Steding

---

Een meertalige website maken gaat niet alleen over tekst vertalen—het gaat om het bieden van een naadloze ervaring voor gebruikers in hun voorkeurstaal, inclusief correcte URL-structuren, taalspecifieke content en cultureel passende formattering. In deze uitgebreide handleiding laat ik je zien hoe je een volledig geïnternationaliseerd portfolio bouwt met Next.js 16 en next-intl, gebaseerd op mijn productie-implementatie die Engels en Nederlands ondersteunt.

## Inhoudsopgave

1. [Waarom Internationalisatie Belangrijk Is](#waarom-internationalisatie-belangrijk-is)
2. [De Juiste i18n Library Kiezen](#de-juiste-i18n-library-kiezen)
3. [Project Setup en Configuratie](#project-setup-en-configuratie)
4. [next-intl Opzetten](#next-intl-opzetten)
5. [Vertalingsbestanden Maken](#vertalingsbestanden-maken)
6. [De Taalwisselaar Implementeren](#de-taalwisselaar-implementeren)
7. [Dynamische Content Vertalen](#dynamische-content-vertalen)
8. [SEO voor Meertalige Sites](#seo-voor-meertalige-sites)
9. [Datum, Nummer en Valuta Formattering](#datum-nummer-en-valuta-formattering)
10. [Best Practices en Veelvoorkomende Valkuilen](#best-practices-en-veelvoorkomende-valkuilen)

---

## Waarom Internationalisatie Belangrijk Is

Voordat we in de implementatie duiken, laten we begrijpen waarom i18n cruciaal is:

### Zakelijke Voordelen

- **Uitgebreid Bereik**: Bereik gebruikers in verschillende regio's en talen
- **Betere SEO**: Scoor in lokale zoekresultaten voor verschillende talen
- **Professioneel Imago**: Toont aandacht voor detail en wereldwijde bewustwording
- **Gebruikersvertrouwen**: Mensen prefereren content in hun moedertaal

### Technische Voordelen

- **Georganiseerde Codebase**: Scheidt content van code
- **Eenvoudiger Onderhoud**: Update vertalingen zonder codewijzigingen
- **Schaalbaarheid**: Gemakkelijk om later nieuwe talen toe te voegen
- **Type Safety**: Moderne i18n libraries bieden TypeScript ondersteuning

---

## De Juiste i18n Library Kiezen

Voor Next.js App Router zijn de hoofdopties:

### next-intl (Aanbevolen)

**Voordelen:**
- Eersteklas App Router ondersteuning
- TypeScript ondersteuning met type-safe vertalingen
- Server Component compatibel
- Actieve ontwikkeling en community
- Rijke formatteringsmogelijkheden

**Nadelen:**
- Vereist configuratie voor middleware

### next-i18next

**Voordelen:**
- Langbestaande library
- Grote community

**Nadelen:**
- Pages Router gefocust
- App Router ondersteuning is nog in ontwikkeling

### react-intl

**Voordelen:**
- Onderdeel van FormatJS ecosysteem
- Uitgebreide formattering

**Nadelen:**
- Complexere setup voor Next.js
- Minder Next.js-specifieke functies

**Mijn keuze: next-intl** - Het biedt de beste developer experience voor Next.js App Router projecten.

---

## Project Setup en Configuratie

### Stap 1: Dependencies Installeren

```bash
pnpm add next-intl
```

### Stap 2: Project Structuur

Maak een georganiseerde structuur voor vertalingen:

```
jouw-project/
├── app/
│   └── [locale]/
│       ├── layout.tsx
│       ├── page.tsx
│       ├── about/
│       │   └── page.tsx
│       ├── blog/
│       │   ├── page.tsx
│       │   └── [slug]/
│       │       └── page.tsx
│       └── projects/
│           └── page.tsx
├── locales/
│   ├── en.ts
│   └── nl.ts
├── components/
│   └── LanguageSwitcher.tsx
├── i18n/
│   ├── request.ts
│   └── routing.ts
└── middleware.ts
```

---

## next-intl Opzetten

### Stap 3: Routing Configureren

Maak `i18n/routing.ts`:

```typescript
// i18n/routing.ts
import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

export const routing = defineRouting({
  // Lijst van alle ondersteunde locales
  locales: ["en", "nl"],
  
  // Standaard locale wanneer geen locale gedetecteerd wordt
  defaultLocale: "en",
  
  // Prefix strategie: "always" | "as-needed" | "never"
  localePrefix: "always",
  
  // Optioneel: locale-specifieke pad mappings
  pathnames: {
    "/": "/",
    "/about": {
      en: "/about",
      nl: "/over-mij",
    },
    "/projects": {
      en: "/projects",
      nl: "/projecten",
    },
    "/blog": {
      en: "/blog",
      nl: "/blog",
    },
    "/contact": {
      en: "/contact",
      nl: "/contact",
    },
  },
});

// Exporteer navigatie utilities
export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);

// Type voor ondersteunde locales
export type Locale = (typeof routing.locales)[number];
```

### Stap 4: Request Configuratie Maken

Maak `i18n/request.ts`:

```typescript
// i18n/request.ts
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  // Haal de locale op uit de request
  let locale = await requestLocale;

  // Valideer dat de locale ondersteund wordt
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  // Laad de vertaalberichten
  const messages = (await import(`../locales/${locale}.ts`)).default;

  return {
    locale,
    messages,
    // Optioneel: Configureer tijdzone
    timeZone: locale === "nl" ? "Europe/Amsterdam" : "UTC",
    // Optioneel: Configureer datum/tijd formaten
    now: new Date(),
  };
});
```

### Stap 5: Middleware Configureren

Maak `middleware.ts` in je project root:

```typescript
// middleware.ts
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Match alle paden behalve:
  // - API routes
  // - Next.js internals (_next)
  // - Statische bestanden (afbeeldingen, fonts, etc.)
  matcher: [
    "/((?!api|_next|_vercel|studio|.*\\..*).*)",
  ],
};
```

### Stap 6: Root Layout Updaten

Maak `app/[locale]/layout.tsx`:

```typescript
// app/[locale]/layout.tsx
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });

  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: `/${locale}`,
      languages: {
        en: "/en",
        nl: "/nl",
      },
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  // Valideer dat de inkomende `locale` parameter geldig is
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Laad berichten voor de huidige locale
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

## Vertalingsbestanden Maken

### Stap 7: Nederlandse Vertalingen

Maak `locales/nl.ts`:

```typescript
// locales/nl.ts
const translations = {
  Metadata: {
    title: "Leroy Steding - Full-Stack Developer",
    description:
      "Full-stack developer gespecialiseerd in React, Next.js en TypeScript",
  },
  
  Navigation: {
    home: "Home",
    about: "Over Mij",
    projects: "Projecten",
    blog: "Blog",
    contact: "Contact",
    cv: "CV",
    services: "Diensten",
  },
  
  Hero: {
    greeting: "Hallo, ik ben",
    name: "Leroy Steding",
    title: "Full-Stack Developer",
    subtitle:
      "Moderne webapplicaties bouwen met React, Next.js en TypeScript",
    cta: {
      primary: "Bekijk Mijn Werk",
      secondary: "Neem Contact Op",
    },
  },
  
  About: {
    title: "Over Mij",
    intro:
      "Ik ben een gepassioneerde full-stack developer met meer dan 10 jaar ervaring...",
    skills: {
      title: "Technische Vaardigheden",
      frontend: "Frontend",
      backend: "Backend",
      tools: "Tools & DevOps",
    },
    experience: {
      title: "Ervaring",
      years: "{years} jaar",
    },
  },
  
  Projects: {
    title: "Uitgelichte Projecten",
    subtitle: "Een selectie van mijn recente werk",
    viewProject: "Bekijk Project",
    viewCode: "Bekijk Code",
    technologies: "Technologieën",
    client: "Klant",
    year: "Jaar",
    categories: {
      all: "Alles",
      web: "Webontwikkeling",
      mobile: "Mobiele App",
      ecommerce: "E-commerce",
      saas: "SaaS",
    },
  },
  
  Contact: {
    title: "Laten We Connecten",
    subtitle: "Heb je een project in gedachten? Laten we bespreken hoe ik kan helpen",
    form: {
      name: "Je Naam",
      email: "Je E-mail",
      subject: "Onderwerp",
      message: "Je Bericht",
      submit: "Verstuur Bericht",
      sending: "Versturen...",
      success: "Bericht succesvol verzonden!",
      error: "Er ging iets mis. Probeer het opnieuw.",
    },
  },
  
  Common: {
    loading: "Laden...",
    error: "Er ging iets mis",
    tryAgain: "Probeer Opnieuw",
    backToHome: "Terug naar Home",
    learnMore: "Meer Informatie",
    viewAll: "Bekijk Alles",
  },
} as const;

export default translations;
```

---

## De Taalwisselaar Implementeren

### Stap 8: Taalwisselaar Component

```typescript
// components/LanguageSwitcher.tsx
"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing";

const locales = [
  { code: "en", label: "EN", flag: "🇬🇧" },
  { code: "nl", label: "NL", flag: "🇳🇱" },
];

export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const switchLocale = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <div className="flex items-center gap-1" role="group" aria-label="Taalselectie">
      {locales.map((loc) => (
        <button
          key={loc.code}
          type="button"
          onClick={() => switchLocale(loc.code)}
          aria-label={`Wissel naar ${loc.label}`}
          aria-pressed={locale === loc.code}
          className={`
            px-3 py-2 text-sm font-medium rounded-md transition-all duration-200
            ${
              locale === loc.code
                ? "bg-accent-primary text-white"
                : "text-text-secondary hover:text-accent-primary hover:bg-surface/50"
            }
          `}
        >
          <span className="mr-1">{loc.flag}</span>
          {loc.label}
        </button>
      ))}
    </div>
  );
}
```

---

## Dynamische Content Vertalen

### Stap 9: Vertalingen in Server Components

```typescript
// app/[locale]/page.tsx
import { getTranslations } from "next-intl/server";

export default async function HomePage() {
  const t = await getTranslations("Hero");

  return (
    <section className="hero">
      <p>{t("greeting")}</p>
      <h1>{t("name")}</h1>
      <h2>{t("title")}</h2>
      <p>{t("subtitle")}</p>
      
      <div className="cta-buttons">
        <a href="/projects">{t("cta.primary")}</a>
        <a href="/contact">{t("cta.secondary")}</a>
      </div>
    </section>
  );
}
```

### Stap 10: Vertalingen in Client Components

```typescript
// components/ContactForm.tsx
"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

export function ContactForm() {
  const t = useTranslations("Contact.form");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  return (
    <form>
      <label htmlFor="name">{t("name")}</label>
      <input type="text" id="name" name="name" required />
      
      <label htmlFor="email">{t("email")}</label>
      <input type="email" id="email" name="email" required />
      
      <button type="submit" disabled={status === "sending"}>
        {status === "sending" ? t("sending") : t("submit")}
      </button>
      
      {status === "success" && <p className="success">{t("success")}</p>}
      {status === "error" && <p className="error">{t("error")}</p>}
    </form>
  );
}
```

---

## SEO voor Meertalige Sites

### Stap 11: Correcte Metadata Genereren

```typescript
// app/[locale]/layout.tsx
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";

  return {
    title: t("title"),
    description: t("description"),
    
    // Alternatieve taalversies
    alternates: {
      canonical: `${baseUrl}/${locale}`,
      languages: {
        en: `${baseUrl}/en`,
        nl: `${baseUrl}/nl`,
        "x-default": `${baseUrl}/en`,
      },
    },
    
    // Open Graph
    openGraph: {
      title: t("title"),
      description: t("description"),
      locale: locale,
      alternateLocale: locale === "en" ? "nl" : "en",
    },
  };
}
```

---

## Datum, Nummer en Valuta Formattering

### Stap 12: Locale-Bewuste Formattering

```typescript
// hooks/useFormatters.ts
import { useFormatter, useLocale } from "next-intl";

export function useFormatters() {
  const format = useFormatter();

  return {
    // Formatteer datums
    formatDate: (date: Date) => {
      return format.dateTime(date, {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    },

    // Formatteer valuta
    formatCurrency: (amount: number, currency: string = "EUR") => {
      return format.number(amount, {
        style: "currency",
        currency,
      });
    },
  };
}

// Gebruik in components
function PriceDisplay({ amount }: { amount: number }) {
  const { formatCurrency } = useFormatters();
  
  return <span>{formatCurrency(amount)}</span>;
  // EN: "€1,234.56"
  // NL: "€ 1.234,56"
}
```

---

## Best Practices en Veelvoorkomende Valkuilen

### Best Practice 1: Organiseer Vertalingen per Feature

```typescript
// Goed: Georganiseerd per feature/pagina
const translations = {
  Hero: { ... },
  About: { ... },
  Contact: { ... },
};

// Vermijd: Platte structuur die moeilijk te onderhouden is
const translations = {
  heroTitle: "...",
  heroSubtitle: "...",
  aboutTitle: "...",
};
```

### Best Practice 2: Type-Safe Vertalingen

```typescript
// Maak een type voor je vertalingen
import en from "@/locales/en";

type Messages = typeof en;

declare global {
  interface IntlMessages extends Messages {}
}

// Nu krijg je autocomplete en type checking!
const t = useTranslations("Hero");
t("cta.primary"); // ✅ Type-safe
t("cta.nonexistent"); // ❌ TypeScript error
```

### Veelvoorkomende Valkuil: Hardcoded Strings

```typescript
// ❌ Fout: Hardcoded string
<button>Verstuur</button>

// ✅ Goed: Vertaalde string
<button>{t("submit")}</button>
```

---

## Conclusie

Het bouwen van een meertalig portfolio vereist zorgvuldige planning maar betaalt zich uit in:

- **Professioneel Imago**: Toont wereldwijde bewustwording
- **Uitgebreid Bereik**: Bereik meer potentiële klanten/werkgevers
- **Betere SEO**: Scoor in meerdere taalmarkten
- **Gebruikerservaring**: Mensen prefereren hun moedertaal

Belangrijkste punten:

1. **Kies de juiste library** - next-intl voor App Router
2. **Organiseer vertalingen** - Per feature/pagina, niet plat
3. **Vergeet SEO niet** - Correcte alternate links en sitemaps
4. **Formatteer datums/nummers correct** - Gebruik locale-aware formatters

Mijn Nederlands-Engelse portfolio bedient bezoekers in beide talen naadloos, en de setup kostte ongeveer een dag om correct te implementeren.

---

## Bronnen

- [next-intl Documentatie](https://next-intl-docs.vercel.app/)
- [Next.js Internationalisatie Handleiding](https://nextjs.org/docs/app/building-your-application/routing/internationalization)
- [MDN: Intl API](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl)
