import type { BlogPost } from "./blog";

export const blogPostsNL: BlogPost[] = [
  {
    id: "1",
    slug: "schaalbare-nextjs-apps-bouwen",
    title: "Schaalbare Next.js Applicaties Bouwen met Turborepo",
    excerpt:
      "Leer hoe u uw Next.js applicaties structureert en schaalt met Turborepo monorepo architectuur, gedeelde componenten en geoptimaliseerde build pipelines.",
    content: `
# Schaalbare Next.js Applicaties Bouwen met Turborepo

In deze uitgebreide gids onderzoeken we hoe we Turborepo kunnen benutten om onderhoudbare en schaalbare Next.js applicaties te creëren.

## Waarom Turborepo?

Turborepo biedt:
- **Snelle builds** met intelligente caching
- **Parallelle uitvoering** van taken
- **Gedeelde code** over meerdere apps
- **Geoptimaliseerde CI/CD** pipelines

## Uw Monorepo Opzetten

\`\`\`bash
npx create-turbo@latest
\`\`\`

## Architectuur Overzicht

Een typische structuur omvat:
- \`apps/\` - Uw Next.js applicaties
- \`packages/\` - Gedeelde bibliotheken en componenten
- \`turbo.json\` - Build configuratie

## Best Practices

1. **Gedeelde UI Componenten**: Creëer een toegewijd \`packages/ui\` pakket
2. **Type Safety**: Gebruik een gedeeld \`packages/tsconfig\` voor consistentie
3. **Utilities**: Extraheer algemene functies naar \`packages/utils\`
4. **Testen**: Voer tests parallel uit over alle pakketten

## Prestatie-optimalisatie

Turborepo's remote caching kan build tijden met maximaal 70% verminderen. Configureer het in uw \`turbo.json\`:

\`\`\`json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "dist/**"]
    }
  }
}
\`\`\`

## Conclusie

Turborepo transformeert hoe we Next.js applicaties bouwen en schalen, waardoor monorepos toegankelijk en performant worden.
    `,
    category: "tutorial",
    tags: ["Next.js", "Turborepo", "Monorepo", "Architectuur"],
    author: "Leroy Steding",
    publishedAt: "2025-01-15",
    readingTime: "8 min lezen",
    coverImage:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=600&fit=crop",
    featured: true,
  },
  {
    id: "2",
    slug: "ai-automatisering-toekomst",
    title: "De Toekomst van AI-Gedreven Automatisering in Webontwikkeling",
    excerpt:
      "Onderzoek hoe kunstmatige intelligentie en automatisering de manier waarop we webapplicaties bouwen, testen en implementeren transformeren.",
    content: `
# De Toekomst van AI-Gedreven Automatisering in Webontwikkeling

AI revolutioneert webontwikkeling, van codegeneratie tot geautomatiseerd testen en implementatiestrategieën.

## Huidige Stand van AI in Ontwikkeling

AI-tools zijn nu in staat om:
- Productie-klare code te genereren
- Geautomatiseerd testen en bugdetectie
- Prestatie-optimalisatiesuggesties
- Security kwetsbaarheidscanning

## Case Study: AI-Aangedreven Componentgeneratie

We hebben AI-ondersteunde componentgeneratie geïmplementeerd in onze workflow, wat de ontwikkeltijd met 40% verminderde.

## Ethische Overwegingen

Naarmate we AI dieper integreren, moeten we overwegen:
- Codekwaliteit en onderhoudbaarheid
- Ontwikkeling van ontwikkelaarsvaardigheden
- Implicaties voor de arbeidsmarkt
- Beveiligings- en privacyzorgen

## De Weg Vooruit

De toekomst biedt spannende mogelijkheden:
- Zelfherstellende applicaties
- Intelligente code refactoring
- Voorspellende prestatie-optimalisatie
- Geautomatiseerde toegankelijkheidsverbeteringen
    `,
    category: "article",
    tags: ["AI", "Automatisering", "Webontwikkeling", "Toekomsttechnologie"],
    author: "Leroy Steding",
    publishedAt: "2025-01-10",
    readingTime: "6 min lezen",
    coverImage:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=600&fit=crop",
    featured: true,
  },
  {
    id: "3",
    slug: "react-server-componenten-diepgaand",
    title: "React Server Componenten: Een Diepgaande Analyse",
    excerpt:
      "Begrip van de architectuur, voordelen en implementatiepatronen van React Server Componenten in Next.js 14.",
    content: `
# React Server Componenten: Een Diepgaande Analyse

React Server Componenten (RSC) vertegenwoordigen een paradigmaverschuiving in hoe we React applicaties bouwen.

## Wat Zijn Server Componenten?

Server Componenten renderen op de server en sturen HTML naar de client, wat bundlegrootte vermindert en prestaties verbetert.

## Belangrijke Voordelen

1. **Geen Bundle Impact**: Server-only code blijft op de server
2. **Automatische Code Splitting**: Betere prestaties out of the box
3. **Directe Backend Toegang**: Geen behoefte aan API routes
4. **Streaming**: Progressieve rendering met Suspense

## Implementatiepatronen

\`\`\`typescript
// app/page.tsx (Server Component standaard)
async function Page() {
  const data = await fetchData(); // Directe DB toegang
  return <ClientComponent data={data} />;
}
\`\`\`

## Client vs Server Componenten

Gebruik Server Componenten voor:
- Data fetching
- Backend services
- Gevoelige informatie

Gebruik Client Componenten voor:
- Interactiviteit
- Event handlers
- Browser API's
- State management

## Prestatiemetrieken

Onze analyse toont:
- 45% vermindering in JavaScript bundlegrootte
- 60% snellere initiële paginalaadtijd
- Verbeterde Core Web Vitals scores
    `,
    category: "research",
    tags: ["React", "Next.js", "Server Componenten", "Prestaties"],
    author: "Leroy Steding",
    publishedAt: "2025-01-05",
    readingTime: "12 min lezen",
    coverImage:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&h=600&fit=crop",
    featured: false,
  },
  {
    id: "4",
    slug: "typescript-geavanceerde-patronen",
    title: "Geavanceerde TypeScript Patronen voor Enterprise Applicaties",
    excerpt:
      "Beheers geavanceerde TypeScript patronen inclusief conditional types, mapped types en template literal types voor het bouwen van robuuste applicaties.",
    content: `
# Geavanceerde TypeScript Patronen voor Enterprise Applicaties

TypeScript's type systeem is ongelooflijk krachtig. Laten we geavanceerde patronen verkennen die codekwaliteit en ontwikkelaarservaring verbeteren.

## Conditional Types

\`\`\`typescript
type IsString<T> = T extends string ? true : false;
type Result = IsString<"hello">; // true
\`\`\`

## Mapped Types

\`\`\`typescript
type Readonly<T> = {
  readonly [K in keyof T]: T[K];
};
\`\`\`

## Template Literal Types

\`\`\`typescript
type Color = "red" | "blue";
type Quantity = "one" | "two";
type ColoredQuantity = \`\${Quantity}-\${Color}\`;
\`\`\`

## Real-World Toepassing

Deze patronen maken mogelijk:
- Type-veilige API clients
- Runtime validatie met Zod
- Betere IDE autocomplete
- Compile-time foutdetectie

## Prestatie-overwegingen

Hoewel krachtig, kunnen complexe types compilatie vertragen. Balanceer type safety met build prestaties.
    `,
    category: "tutorial",
    tags: ["TypeScript", "Geavanceerde Patronen", "Type Safety"],
    author: "Leroy Steding",
    publishedAt: "2024-12-28",
    readingTime: "10 min lezen",
    featured: false,
  },
  {
    id: "5",
    slug: "web-prestatie-optimalisatie",
    title: "Web Prestatie-optimalisatie: Een Uitgebreide Gids",
    excerpt:
      "Duik diep in moderne web prestatie-optimalisatietechnieken, van Core Web Vitals tot geavanceerde bundling strategieën.",
    content: `
# Web Prestatie-optimalisatie: Een Uitgebreide Gids

Prestaties zijn niet alleen een feature—het is een fundamenteel aspect van gebruikerservaring.

## Core Web Vitals

Begrip van de metrieken:
- **LCP** (Largest Contentful Paint): < 2,5s
- **FID** (First Input Delay): < 100ms
- **CLS** (Cumulative Layout Shift): < 0,1

## Optimalisatiestrategieën

### 1. Afbeelding Optimalisatie
- Gebruik Next.js Image component
- Implementeer lazy loading
- Moderne formaten (WebP, AVIF)

### 2. Code Splitting
\`\`\`typescript
const Component = dynamic(() => import('./Component'), {
  loading: () => <Skeleton />,
});
\`\`\`

### 3. Caching Strategieën
- Service Workers
- CDN configuratie
- Browser caching headers

### 4. Bundle Optimalisatie
- Tree shaking
- Code splitting
- Lazy loading

## Prestaties Meten

Tools die we gebruiken:
- Lighthouse
- WebPageTest
- Chrome DevTools
- Real User Monitoring (RUM)

## Resultaten

Na optimalisatie:
- 65% snellere paginalaadtijd
- 40% vermindering in bundlegrootte
- 90+ Lighthouse score
    `,
    category: "article",
    tags: ["Prestaties", "Optimalisatie", "Web Vitals", "Best Practices"],
    author: "Leroy Steding",
    publishedAt: "2024-12-20",
    readingTime: "15 min lezen",
    coverImage:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=600&fit=crop",
    featured: true,
  },
  {
    id: "6",
    slug: "design-systemen-bouwen",
    title: "Schaalbare Design Systemen Bouwen met React en Tailwind",
    excerpt:
      "Leer hoe u onderhoudbare design systemen creëert die schalen over meerdere applicaties met React componenten en Tailwind CSS.",
    content: `
# Schaalbare Design Systemen Bouwen met React en Tailwind

Een goed gearchitecteerd design systeem is cruciaal voor het handhaven van consistentie over grote applicaties.

## Design Systeem Architectuur

Kerncomponenten:
- Design tokens
- Componentenbibliotheek
- Documentatie
- Teststrategie

## Token Systeem

\`\`\`typescript
export const tokens = {
  colors: {
    primary: {
      50: '#f0f9ff',
      500: '#0ea5e9',
      900: '#0c4a6e',
    },
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
  },
};
\`\`\`

## Component Patronen

### Compositie
\`\`\`tsx
<Card>
  <Card.Header>Titel</Card.Header>
  <Card.Body>Inhoud</Card.Body>
  <Card.Footer>Acties</Card.Footer>
</Card>
\`\`\`

### Varianten
Gebruik van CVA (Class Variance Authority):
\`\`\`typescript
const button = cva("btn", {
  variants: {
    intent: {
      primary: "btn-primary",
      secondary: "btn-secondary",
    },
  },
});
\`\`\`

## Documentatie met Storybook

Essentieel voor:
- Component discovery
- Visueel testen
- Gebruiksvoorbeelden
- Toegankelijkheidsaudits

## Toegankelijkheid Eerst

Elke component moet:
- Keyboard navigatie ondersteunen
- ARIA labels bevatten
- Voldoen aan WCAG 2.1 AA normen
- Werken met screen readers

## Conclusie

Een solide design systeem versnelt ontwikkeling en garandeert consistentie over uw productecosysteem.
    `,
    category: "tutorial",
    tags: ["Design System", "React", "Tailwind CSS", "Componentenbibliotheek"],
    author: "Leroy Steding",
    publishedAt: "2024-12-15",
    readingTime: "11 min lezen",
    coverImage:
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200&h=600&fit=crop",
    featured: false,
  },
];

// Utility functies voor blog
export function getAllPostsNL(): BlogPost[] {
  return blogPostsNL.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
}

export function getFeaturedPostsNL(): BlogPost[] {
  return blogPostsNL.filter((post) => post.featured);
}

export function getPostBySlugNL(slug: string): BlogPost | undefined {
  return blogPostsNL.find((post) => post.slug === slug);
}

export function getPostsByCategoryNL(category: string): BlogPost[] {
  return blogPostsNL.filter((post) => post.category === category);
}

export function getPostsByTagNL(tag: string): BlogPost[] {
  return blogPostsNL.filter((post) => post.tags.includes(tag));
}

export function getAllCategoriesNL(): string[] {
  return Array.from(new Set(blogPostsNL.map((post) => post.category)));
}

export function getAllTagsNL(): string[] {
  return Array.from(new Set(blogPostsNL.flatMap((post) => post.tags)));
}
