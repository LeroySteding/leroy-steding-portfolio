# Complete Handleiding voor Migratie naar Next.js 16: Alles Wat Je Moet Weten

**Categorie:** Tutorial  
**Tags:** Next.js, React, Migratie, Webontwikkeling, Prestaties  
**Leestijd:** 15 min lezen  
**Auteur:** Leroy Steding

---

Next.js 16 vertegenwoordigt een significante evolutie in het React framework ecosysteem, met de introductie van Turbopack als standaard bundler, nieuwe middleware patronen en verbeterde prestatie-optimalisaties. In deze uitgebreide handleiding loop ik je door alles wat je moet weten om succesvol te migreren van Next.js 14 of 15 naar versie 16, gebaseerd op mijn praktijkervaring met het migreren van mijn portfolio site.

## Inhoudsopgave

1. [Wat is Nieuw in Next.js 16](#wat-is-nieuw-in-nextjs-16)
2. [Vereisten](#vereisten)
3. [Stapsgewijs Migratieproces](#stapsgewijs-migratieproces)
4. [Breaking Changes en Hoe Hiermee Om te Gaan](#breaking-changes)
5. [Turbopack Migratie](#turbopack-migratie)
6. [Middleware naar Proxy Migratie](#middleware-naar-proxy-migratie)
7. [Prestatie-optimalisaties](#prestatie-optimalisaties)
8. [Veelvoorkomende Problemen en Oplossingen](#veelvoorkomende-problemen-en-oplossingen)
9. [Je Migratie Testen](#je-migratie-testen)
10. [Conclusie](#conclusie)

---

## Wat is Nieuw in Next.js 16

Next.js 16 brengt verschillende baanbrekende functies die het de meest performante versie tot nu toe maken:

### Turbopack als Standaard

Turbopack, geschreven in Rust, is nu de standaard bundler voor ontwikkeling en productie builds. Dit resulteert in:

- **Tot 95% snellere** lokale server opstart
- **Tot 76% snellere** code updates met Fast Refresh
- **Significant verminderd** geheugengebruik tijdens builds

### Nieuw Proxy Patroon (Vervangt Middleware)

De `middleware.ts` bestandsconventie wordt uitgefaseerd ten gunste van een nieuw `proxy` patroon dat biedt:

- Betere prestaties door edge-geoptimaliseerde routing
- Schonere scheiding van verantwoordelijkheden
- Meer voorspelbare request handling

### React 19 Ondersteuning

Volledige ondersteuning voor React 19 functies inclusief:

- Server Components verbeteringen
- Verbeterde Suspense boundaries
- Nieuwe hooks en patronen

### Verbeterde Image Optimalisatie

Het `next/image` component bevat nu:

- Automatische format detectie (AVIF/WebP)
- Betere lazy loading strategieën
- Verminderde Cumulative Layout Shift (CLS)

---

## Vereisten

Voordat je begint met migreren, zorg ervoor dat je hebt:

```bash
# Node.js 18.17 of later (20.x aanbevolen)
node --version  # Moet >= 18.17.0 zijn

# pnpm, npm, of yarn
pnpm --version  # of npm/yarn

# Git voor versiebeheer (maak een backup branch!)
git checkout -b nextjs-16-migration
```

### Maak een Backup van Je Project

Maak altijd een backup voor grote migraties:

```bash
# Maak een migratie branch
git checkout -b pre-nextjs-16-backup
git push origin pre-nextjs-16-backup

# Ga terug naar main en maak migratie branch
git checkout main
git checkout -b nextjs-16-migration
```

---

## Stapsgewijs Migratieproces

### Stap 1: Dependencies Updaten

Update eerst Next.js en gerelateerde packages:

```bash
# Met pnpm (aanbevolen)
pnpm add next@16 react@19 react-dom@19

# Of met npm
npm install next@16 react@19 react-dom@19

# Of met yarn
yarn add next@16 react@19 react-dom@19
```

### Stap 2: TypeScript Types Updaten

Als je TypeScript gebruikt, update de type definities:

```bash
pnpm add -D @types/react@19 @types/react-dom@19
```

### Stap 3: next.config.ts Updaten

Next.js 16 geeft voorkeur aan `.ts` configuratiebestanden. Als je nog steeds `next.config.js` of `next.config.mjs` gebruikt, overweeg te migreren:

```typescript
// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Turbopack is nu standaard, geen specificatie nodig
  
  // Experimentele functies
  experimental: {
    // optimizePackageImports voor betere tree-shaking
    optimizePackageImports: [
      "lucide-react",
      "framer-motion",
      "@sanity/ui",
    ],
  },

  // Image optimalisatie
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
    // Nieuw in Next.js 16: automatische format selectie
    formats: ["image/avif", "image/webp"],
  },

  // Headers voor beveiliging
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
```

### Stap 4: Package.json Scripts Updaten

Update je build scripts om Turbopack te gebruiken:

```json
{
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build --turbopack",
    "start": "next start",
    "lint": "next lint"
  }
}
```

---

## Breaking Changes

### 1. Middleware Deprecation Waarschuwing

Je zult deze waarschuwing zien bij het builden:

```
⚠ The "middleware" file convention is deprecated. 
Please use "proxy" instead.
```

**Oplossing:** Migreer naar het nieuwe proxy patroon (zie volgende sectie).

### 2. React 19 Strict Mode Wijzigingen

React 19 heeft strengere eisen voor hooks en effects:

```typescript
// Voorheen (kan problemen veroorzaken)
useEffect(() => {
  fetchData();
}, []); // Ontbrekende dependency

// Nu (correct)
const fetchData = useCallback(async () => {
  // fetch logica
}, [dependency]);

useEffect(() => {
  fetchData();
}, [fetchData]);
```

### 3. Image Component Wijzigingen

Het `next/image` component heeft bijgewerkte standaarden:

```tsx
// Voorheen
import Image from "next/image";

<Image
  src="/photo.jpg"
  width={800}
  height={600}
  layout="responsive" // Verouderd
/>

// Nu
import Image from "next/image";

<Image
  src="/photo.jpg"
  width={800}
  height={600}
  style={{ width: '100%', height: 'auto' }}
/>
```

### 4. Font Loading Updates

De `next/font` API heeft kleine wijzigingen:

```typescript
// Voorheen
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

// Nu (hetzelfde, maar met nieuwe optimalisatie opties)
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  display: "swap", // Aanbevolen voor prestaties
  preload: true,   // Nieuwe optie
});
```

---

## Turbopack Migratie

Turbopack is nu de standaard bundler. Dit moet je weten:

### Configuratie Verschillen

Sommige webpack-specifieke configuraties hebben updates nodig:

```typescript
// next.config.ts

const nextConfig: NextConfig = {
  // Webpack-specifieke config (werkt nog maar overweeg migratie)
  webpack: (config) => {
    // Custom webpack config
    return config;
  },

  // Turbopack-native alternatieven
  experimental: {
    // Gebruik dit in plaats van webpack aliases waar mogelijk
    optimizePackageImports: ["package-name"],
  },
};
```

### Bekende Turbopack Beperkingen

Vanaf Next.js 16 ondersteunt Turbopack niet:

1. **Custom webpack loaders** - Gebruik alternatieven of wacht op Turbopack plugin ondersteuning
2. **Sommige CSS-in-JS libraries** - Controleer compatibiliteit
3. **Bepaalde build-time plugins** - Kunnen updates nodig hebben

### Terugvallen op Webpack

Als je problemen tegenkomt, kun je tijdelijk terugvallen op webpack:

```bash
# Development zonder Turbopack
next dev --no-turbopack

# Build zonder Turbopack
next build --no-turbopack
```

---

## Middleware naar Proxy Migratie

Het middleware patroon wordt vervangen door een meer performante proxy aanpak.

### Huidige Middleware (Verouderd)

```typescript
// middleware.ts (oude aanpak)
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Locale detectie
  const locale = request.cookies.get("NEXT_LOCALE")?.value || "en";

  // Redirect logica
  if (pathname === "/") {
    return NextResponse.redirect(new URL(`/${locale}`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
```

### Nieuw Proxy Patroon (Aanbevolen)

```typescript
// proxy.ts (nieuwe aanpak - komt in toekomstige Next.js versies)
// Voor nu werkt middleware nog maar toont deprecation waarschuwing

// Het proxy patroon zal bieden:
// - Edge-geoptimaliseerde routing
// - Betere caching integratie
// - Schonere API
```

**Opmerking:** Vanaf Next.js 16.0.1 is het proxy patroon aangekondigd maar middleware werkt nog. Monitor de Next.js documentatie voor de volledige proxy API wanneer beschikbaar.

### Tijdelijke Oplossing

Voor nu kun je de waarschuwing onderdrukken of middleware blijven gebruiken:

```typescript
// middleware.ts
// Dit toont een waarschuwing maar blijft werken
import createMiddleware from "next-intl/middleware";

export default createMiddleware({
  locales: ["en", "nl"],
  defaultLocale: "en",
});

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
```

---

## Prestatie-optimalisaties

### 1. Package Imports Optimaliseren

Voeg veelgebruikte packages toe om tree-shaking te optimaliseren:

```typescript
// next.config.ts
experimental: {
  optimizePackageImports: [
    "lucide-react",
    "framer-motion",
    "date-fns",
    "@radix-ui/react-icons",
  ],
}
```

### 2. Image Optimalisatie

Gebruik de nieuwe image optimalisatie functies:

```tsx
import Image from "next/image";

export function OptimizedImage({ src, alt }: { src: string; alt: string }) {
  return (
    <Image
      src={src}
      alt={alt}
      width={1200}
      height={630}
      priority={false}
      loading="lazy"
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRg..."
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    />
  );
}
```

### 3. Route Segment Config

Gebruik route segment configuratie voor optimale caching:

```typescript
// app/blog/[slug]/page.tsx
export const dynamic = "force-static";
export const revalidate = 3600; // Hervalideer elk uur

// Of voor dynamische content
export const dynamic = "force-dynamic";
```

### 4. Parallelle Data Fetching

Benut parallelle data fetching:

```typescript
// app/page.tsx
async function HomePage() {
  // Parallel fetching - veel sneller dan sequentieel
  const [posts, projects, testimonials] = await Promise.all([
    getPosts(),
    getProjects(),
    getTestimonials(),
  ]);

  return (
    <>
      <BlogSection posts={posts} />
      <ProjectsSection projects={projects} />
      <TestimonialsSection testimonials={testimonials} />
    </>
  );
}
```

---

## Veelvoorkomende Problemen en Oplossingen

### Probleem 1: TypeScript Fouten Na Upgrade

**Fout:** Type fouten gerelateerd aan React 19 wijzigingen

**Oplossing:**

```bash
# Wis TypeScript cache
rm -rf node_modules/.cache
rm -rf .next

# Herinstalleer dependencies
pnpm install

# Herbouw
pnpm build
```

### Probleem 2: CSS Module Problemen met Turbopack

**Fout:** Styles laden niet correct

**Oplossing:**

```typescript
// Zorg voor correcte CSS module naamgeving
// component.module.css (correct)
// component.css (werkt niet als module)

// Importeer correct
import styles from "./component.module.css";
```

### Probleem 3: Dynamic Imports Werken Niet

**Fout:** `dynamic` imports werken niet zoals verwacht

**Oplossing:**

```typescript
// Voorheen
const Component = dynamic(() => import("./Component"));

// Nu (met correcte loading state)
const Component = dynamic(() => import("./Component"), {
  loading: () => <div>Laden...</div>,
  ssr: true, // of false indien alleen client-side
});
```

### Probleem 4: Environment Variables Laden Niet

**Fout:** `process.env.VARIABLE` is undefined

**Oplossing:**

```typescript
// Zorg voor correcte prefix voor client-side variabelen
// .env.local
NEXT_PUBLIC_API_URL=https://api.example.com  // Beschikbaar in browser
API_SECRET=secret123  // Alleen server-side

// next.config.ts - voor build-time variabelen
const nextConfig = {
  env: {
    CUSTOM_VAR: process.env.CUSTOM_VAR,
  },
};
```

### Probleem 5: Build Geheugen Problemen

**Fout:** JavaScript heap out of memory

**Oplossing:**

```bash
# Verhoog Node.js geheugen limiet
NODE_OPTIONS="--max-old-space-size=8192" pnpm build

# Of in package.json
{
  "scripts": {
    "build": "NODE_OPTIONS='--max-old-space-size=8192' next build"
  }
}
```

---

## Je Migratie Testen

### 1. Development Testen

```bash
# Start development server
pnpm dev

# Controleer op console fouten
# Test alle routes
# Verifieer dat hot reload werkt
```

### 2. Build Testen

```bash
# Productie build
pnpm build

# Controleer op build waarschuwingen/fouten
# Noteer deprecation waarschuwingen
```

### 3. Productie Preview

```bash
# Start productie server lokaal
pnpm start

# Test alle functionaliteit
# Controleer prestatie metrics
```

### 4. Lighthouse Audit

Voer Lighthouse uit om voor/na prestaties te vergelijken:

```bash
# Installeer Lighthouse CLI
npm install -g lighthouse

# Voer audit uit
lighthouse http://localhost:3000 --output html --output-path ./lighthouse-report.html
```

### 5. E2E Testen

Als je Playwright of Cypress tests hebt:

```bash
# Voer E2E tests uit
pnpm test:e2e

# Verifieer dat alle tests slagen
```

---

## Migratie Checklist

Gebruik deze checklist om je migratie voortgang bij te houden:

- [ ] Backup branch aangemaakt
- [ ] Next.js naar versie 16 geüpdatet
- [ ] React naar versie 19 geüpdatet
- [ ] TypeScript types geüpdatet
- [ ] next.config.ts geüpdatet
- [ ] package.json scripts geüpdatet
- [ ] React 19 strict mode problemen opgelost
- [ ] Image components geüpdatet
- [ ] Getest met Turbopack
- [ ] Middleware deprecation aangepakt
- [ ] Package imports geoptimaliseerd
- [ ] Development build uitgevoerd
- [ ] Productie build uitgevoerd
- [ ] E2E tests uitgevoerd
- [ ] Prestatie audit gedaan
- [ ] Deployed naar staging
- [ ] Deployed naar productie

---

## Conclusie

Migreren naar Next.js 16 is een significante maar waardevolle upgrade. De prestatie verbeteringen van Turbopack alleen al maken het de moeite waard, en de nieuwe functies bereiden je voor op de toekomst van React ontwikkeling.

Belangrijkste punten:

1. **Maak altijd een backup** voordat je migreert
2. **Test grondig** in development en staging
3. **Pak deprecation waarschuwingen** vroeg aan
4. **Benut nieuwe optimalisaties** voor betere prestaties
5. **Monitor de Next.js blog** voor updates over het proxy patroon

De migratie kostte mij ongeveer 4 uur voor mijn portfolio site, inclusief het oplossen van alle edge cases en testen. Je ervaring kan variëren afhankelijk van project complexiteit.

Heb je vragen over de migratie? Neem gerust contact op via het contactformulier of connect met mij op LinkedIn!

---

## Bronnen

- [Next.js 16 Release Notes](https://nextjs.org/blog)
- [Turbopack Documentatie](https://turbo.build/pack)
- [React 19 Documentatie](https://react.dev)
- [Next.js Migratie Handleiding](https://nextjs.org/docs/upgrading)
