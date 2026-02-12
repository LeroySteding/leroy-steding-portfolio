;!function(){try { var e="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof global?global:"undefined"!=typeof window?window:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&((e._debugIds|| (e._debugIds={}))[n]="60489196-77be-8959-8bf3-f06d4bcace87")}catch(e){}}();
module.exports=[711810,a=>{"use strict";let b=[{id:"1",slug:"building-scalable-nextjs-apps",title:"Building Scalable Next.js Applications with Turborepo",excerpt:"Learn how to structure and scale your Next.js applications using Turborepo monorepo architecture, shared components, and optimized build pipelines.",content:`
# Building Scalable Next.js Applications with Turborepo

In this comprehensive guide, we'll explore how to leverage Turborepo to create maintainable and scalable Next.js applications.

## Why Turborepo?

Turborepo provides:
- **Fast builds** with intelligent caching
- **Parallel execution** of tasks
- **Shared code** across multiple apps
- **Optimized CI/CD** pipelines

## Setting Up Your Monorepo

\`\`\`bash
npx create-turbo@latest
\`\`\`

## Architecture Overview

A typical structure includes:
- \`apps/\` - Your Next.js applications
- \`packages/\` - Shared libraries and components
- \`turbo.json\` - Build configuration

## Best Practices

1. **Shared UI Components**: Create a dedicated \`packages/ui\` package
2. **Type Safety**: Use a shared \`packages/tsconfig\` for consistency
3. **Utilities**: Extract common functions to \`packages/utils\`
4. **Testing**: Run tests in parallel across all packages

## Performance Optimization

Turborepo's remote caching can reduce build times by up to 70%. Configure it in your \`turbo.json\`:

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

## Conclusion

Turborepo transforms how we build and scale Next.js applications, making monorepos accessible and performant.
    `,category:"tutorial",tags:["Next.js","Turborepo","Monorepo","Architecture"],author:"Leroy Steding",publishedAt:"2025-01-15",readingTime:"8 min read",coverImage:"https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=600&fit=crop",featured:!0},{id:"2",slug:"ai-automation-future",title:"The Future of AI-Driven Automation in Web Development",excerpt:"Exploring how artificial intelligence and automation are transforming the way we build, test, and deploy web applications.",content:`
# The Future of AI-Driven Automation in Web Development

AI is revolutionizing web development, from code generation to automated testing and deployment strategies.

## Current State of AI in Development

AI tools are now capable of:
- Generating production-ready code
- Automated testing and bug detection
- Performance optimization suggestions
- Security vulnerability scanning

## Case Study: AI-Powered Component Generation

We've implemented AI-assisted component generation in our workflow, reducing development time by 40%.

## Ethical Considerations

As we integrate AI more deeply, we must consider:
- Code quality and maintainability
- Developer skill development
- Job market implications
- Security and privacy concerns

## The Road Ahead

The future holds exciting possibilities:
- Self-healing applications
- Intelligent code refactoring
- Predictive performance optimization
- Automated accessibility improvements
    `,category:"article",tags:["AI","Automation","Web Development","Future Tech"],author:"Leroy Steding",publishedAt:"2025-01-10",readingTime:"6 min read",coverImage:"https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=600&fit=crop",featured:!0},{id:"3",slug:"react-server-components-deep-dive",title:"React Server Components: A Deep Dive",excerpt:"Understanding the architecture, benefits, and implementation patterns of React Server Components in Next.js 14.",content:`
# React Server Components: A Deep Dive

React Server Components (RSC) represent a paradigm shift in how we build React applications.

## What Are Server Components?

Server Components render on the server and send HTML to the client, reducing bundle size and improving performance.

## Key Benefits

1. **Zero Bundle Impact**: Server-only code stays on the server
2. **Automatic Code Splitting**: Better performance out of the box
3. **Direct Backend Access**: No need for API routes
4. **Streaming**: Progressive rendering with Suspense

## Implementation Patterns

\`\`\`typescript
// app/page.tsx (Server Component by default)
async function Page() {
  const data = await fetchData(); // Direct DB access
  return <ClientComponent data={data} />;
}
\`\`\`

## Client vs Server Components

Use Server Components for:
- Data fetching
- Backend services
- Sensitive information

Use Client Components for:
- Interactivity
- Event handlers
- Browser APIs
- State management

## Performance Metrics

Our analysis shows:
- 45% reduction in JavaScript bundle size
- 60% faster initial page load
- Improved Core Web Vitals scores
    `,category:"research",tags:["React","Next.js","Server Components","Performance"],author:"Leroy Steding",publishedAt:"2025-01-05",readingTime:"12 min read",coverImage:"https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&h=600&fit=crop",featured:!1},{id:"4",slug:"typescript-advanced-patterns",title:"Advanced TypeScript Patterns for Enterprise Applications",excerpt:"Master advanced TypeScript patterns including conditional types, mapped types, and template literal types for building robust applications.",content:`
# Advanced TypeScript Patterns for Enterprise Applications

TypeScript's type system is incredibly powerful. Let's explore advanced patterns that improve code quality and developer experience.

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

## Real-World Application

These patterns enable:
- Type-safe API clients
- Runtime validation with Zod
- Better IDE autocomplete
- Compile-time error detection

## Performance Considerations

While powerful, complex types can slow down compilation. Balance type safety with build performance.
    `,category:"tutorial",tags:["TypeScript","Advanced Patterns","Type Safety"],author:"Leroy Steding",publishedAt:"2024-12-28",readingTime:"10 min read",featured:!1},{id:"5",slug:"web-performance-optimization",title:"Web Performance Optimization: A Comprehensive Guide",excerpt:"Dive deep into modern web performance optimization techniques, from Core Web Vitals to advanced bundling strategies.",content:`
# Web Performance Optimization: A Comprehensive Guide

Performance is not just a feature—it's a fundamental aspect of user experience.

## Core Web Vitals

Understanding the metrics:
- **LCP** (Largest Contentful Paint): < 2.5s
- **FID** (First Input Delay): < 100ms
- **CLS** (Cumulative Layout Shift): < 0.1

## Optimization Strategies

### 1. Image Optimization
- Use Next.js Image component
- Implement lazy loading
- Modern formats (WebP, AVIF)

### 2. Code Splitting
\`\`\`typescript
const Component = dynamic(() => import('./Component'), {
  loading: () => <Skeleton />,
});
\`\`\`

### 3. Caching Strategies
- Service Workers
- CDN configuration
- Browser caching headers

### 4. Bundle Optimization
- Tree shaking
- Code splitting
- Lazy loading

## Measuring Performance

Tools we use:
- Lighthouse
- WebPageTest
- Chrome DevTools
- Real User Monitoring (RUM)

## Results

After optimization:
- 65% faster page load
- 40% reduction in bundle size
- 90+ Lighthouse score
    `,category:"article",tags:["Performance","Optimization","Web Vitals","Best Practices"],author:"Leroy Steding",publishedAt:"2024-12-20",readingTime:"15 min read",coverImage:"https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=600&fit=crop",featured:!0},{id:"6",slug:"building-design-systems",title:"Building Scalable Design Systems with React and Tailwind",excerpt:"Learn how to create maintainable design systems that scale across multiple applications using React components and Tailwind CSS.",content:`
# Building Scalable Design Systems with React and Tailwind

A well-architected design system is crucial for maintaining consistency across large applications.

## Design System Architecture

Core components:
- Design tokens
- Component library
- Documentation
- Testing strategy

## Token System

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

## Component Patterns

### Composition
\`\`\`tsx
<Card>
  <Card.Header>Title</Card.Header>
  <Card.Body>Content</Card.Body>
  <Card.Footer>Actions</Card.Footer>
</Card>
\`\`\`

### Variants
Using CVA (Class Variance Authority):
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

## Documentation with Storybook

Essential for:
- Component discovery
- Visual testing
- Usage examples
- Accessibility audits

## Accessibility First

Every component must:
- Support keyboard navigation
- Include ARIA labels
- Pass WCAG 2.1 AA standards
- Work with screen readers

## Conclusion

A solid design system accelerates development and ensures consistency across your product ecosystem.
    `,category:"tutorial",tags:["Design System","React","Tailwind CSS","Component Library"],author:"Leroy Steding",publishedAt:"2024-12-15",readingTime:"11 min read",coverImage:"https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200&h=600&fit=crop",featured:!1}],c=[{id:"1",slug:"schaalbare-nextjs-apps-bouwen",title:"Schaalbare Next.js Applicaties Bouwen met Turborepo",excerpt:"Leer hoe u uw Next.js applicaties structureert en schaalt met Turborepo monorepo architectuur, gedeelde componenten en geoptimaliseerde build pipelines.",content:`
# Schaalbare Next.js Applicaties Bouwen met Turborepo

In deze uitgebreide gids onderzoeken we hoe we Turborepo kunnen benutten om onderhoudbare en schaalbare Next.js applicaties te cre\xebren.

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

1. **Gedeelde UI Componenten**: Cre\xeber een toegewijd \`packages/ui\` pakket
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
    `,category:"tutorial",tags:["Next.js","Turborepo","Monorepo","Architectuur"],author:"Leroy Steding",publishedAt:"2025-01-15",readingTime:"8 min lezen",coverImage:"https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=600&fit=crop",featured:!0},{id:"2",slug:"ai-automatisering-toekomst",title:"De Toekomst van AI-Gedreven Automatisering in Webontwikkeling",excerpt:"Onderzoek hoe kunstmatige intelligentie en automatisering de manier waarop we webapplicaties bouwen, testen en implementeren transformeren.",content:`
# De Toekomst van AI-Gedreven Automatisering in Webontwikkeling

AI revolutioneert webontwikkeling, van codegeneratie tot geautomatiseerd testen en implementatiestrategie\xebn.

## Huidige Stand van AI in Ontwikkeling

AI-tools zijn nu in staat om:
- Productie-klare code te genereren
- Geautomatiseerd testen en bugdetectie
- Prestatie-optimalisatiesuggesties
- Security kwetsbaarheidscanning

## Case Study: AI-Aangedreven Componentgeneratie

We hebben AI-ondersteunde componentgeneratie ge\xefmplementeerd in onze workflow, wat de ontwikkeltijd met 40% verminderde.

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
    `,category:"article",tags:["AI","Automatisering","Webontwikkeling","Toekomsttechnologie"],author:"Leroy Steding",publishedAt:"2025-01-10",readingTime:"6 min lezen",coverImage:"https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=600&fit=crop",featured:!0},{id:"3",slug:"react-server-componenten-diepgaand",title:"React Server Componenten: Een Diepgaande Analyse",excerpt:"Begrip van de architectuur, voordelen en implementatiepatronen van React Server Componenten in Next.js 14.",content:`
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
- 60% snellere initi\xeble paginalaadtijd
- Verbeterde Core Web Vitals scores
    `,category:"research",tags:["React","Next.js","Server Componenten","Prestaties"],author:"Leroy Steding",publishedAt:"2025-01-05",readingTime:"12 min lezen",coverImage:"https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&h=600&fit=crop",featured:!1},{id:"4",slug:"typescript-geavanceerde-patronen",title:"Geavanceerde TypeScript Patronen voor Enterprise Applicaties",excerpt:"Beheers geavanceerde TypeScript patronen inclusief conditional types, mapped types en template literal types voor het bouwen van robuuste applicaties.",content:`
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
    `,category:"tutorial",tags:["TypeScript","Geavanceerde Patronen","Type Safety"],author:"Leroy Steding",publishedAt:"2024-12-28",readingTime:"10 min lezen",featured:!1},{id:"5",slug:"web-prestatie-optimalisatie",title:"Web Prestatie-optimalisatie: Een Uitgebreide Gids",excerpt:"Duik diep in moderne web prestatie-optimalisatietechnieken, van Core Web Vitals tot geavanceerde bundling strategieën.",content:`
# Web Prestatie-optimalisatie: Een Uitgebreide Gids

Prestaties zijn niet alleen een feature—het is een fundamenteel aspect van gebruikerservaring.

## Core Web Vitals

Begrip van de metrieken:
- **LCP** (Largest Contentful Paint): < 2,5s
- **FID** (First Input Delay): < 100ms
- **CLS** (Cumulative Layout Shift): < 0,1

## Optimalisatiestrategie\xebn

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

### 3. Caching Strategie\xebn
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
    `,category:"article",tags:["Prestaties","Optimalisatie","Web Vitals","Best Practices"],author:"Leroy Steding",publishedAt:"2024-12-20",readingTime:"15 min lezen",coverImage:"https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=600&fit=crop",featured:!0},{id:"6",slug:"design-systemen-bouwen",title:"Schaalbare Design Systemen Bouwen met React en Tailwind",excerpt:"Leer hoe u onderhoudbare design systemen creëert die schalen over meerdere applicaties met React componenten en Tailwind CSS.",content:`
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
    `,category:"tutorial",tags:["Design System","React","Tailwind CSS","Componentenbibliotheek"],author:"Leroy Steding",publishedAt:"2024-12-15",readingTime:"11 min lezen",coverImage:"https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200&h=600&fit=crop",featured:!1}];var d=a.i(88968);let e=[{id:"surf",title:"Senior Front-end Developer",company:"SURF",companyLogo:"/logos/surf-logo.png",companyUrl:"https://www.surf.nl",period:"Maart 2025 – Heden",location:"Utrecht, Nederland",description:"Bouw van enterprise whitelabel platform ter ondersteuning van meerdere Next.js-applicaties in Turborepo monorepo. Ontwikkeling van gedeelde UI-componentenbibliotheek met Tailwind CSS, TypeScript en Storybook voor Edusources en MBOdata.",longDescription:`Bij SURF maak ik deel uit van een samenwerkend team dat een whitelabel platform bouwt en uitbreidt dat meerdere Next.js-applicaties ondersteunt binnen een moderne monorepo-structuur met Turborepo en pnpm. Samen met frontend-ontwikkelaars, backend-teams en ontwerpers ontwikkelen we een gedeelde UI-componentenbibliotheek met Tailwind CSS, TypeScript en Storybook, waardoor verschillende applicaties kunnen schalen en consistent dezelfde basis kunnen gebruiken.

We ontwikkelen ook herbruikbare API-clients en state management-oplossingen die worden gedeeld tussen meerdere applicaties. Samen hebben we CI/CD-pijplijnen opgezet in GitLab voor ontwikkeling, staging en productie, waarbij we ervoor zorgen dat releases betrouwbaar en voorspelbaar zijn.

In nauwe samenwerking met andere teams en stakeholders zorgen we ervoor dat het platform niet alleen schaalbaar en onderhoudbaar is, maar ook voldoet aan moderne normen voor prestaties, WCAG-toegankelijkheid en multi-brand theming.`,technologies:["Next.js","Turborepo","TypeScript","Tailwind CSS","Storybook","GitLab CI/CD","WCAG","pnpm"],color:"cyan",highlights:["Gedeelde UI-componentenbibliotheek ontwikkeld voor multi-brand theming","CI/CD-pijplijnen geïmplementeerd voor betrouwbare implementaties over dev/staging/prod","WCAG-toegankelijkheidsnaleving gewaarborgd op alle platforms","Herbruikbare API-clients en state management-oplossingen gebouwd"],achievements:["Ontwikkeltijd met 40% verminderd door gedeelde componentenbibliotheek","100% WCAG 2.1 AA-naleving bereikt op alle platforms","Multi-brand platform succesvol gelanceerd dat 50.000+ educatieve bronnen bedient"],responsibilities:["Architectuur en ontwikkeling van gedeelde UI-componentenbibliotheken","Implementatie en onderhoud van CI/CD-pijplijnen in GitLab","Samenwerking met ontwerpers aan design system-implementatie","Toegankelijkheidsnaleving en prestatie-optimalisatie garanderen","Junior developers begeleiden in moderne frontend best practices"],teamSize:"8-10 ontwikkelaars",impact:["Bedient Edusources en MBOdata platforms","Ondersteunt meerdere onderwijsinstellingen","Maakt snelle ontwikkeling van nieuwe applicaties mogelijk"]},{id:"hifive",title:"Oprichter & Lead Developer",company:"Hifive",companyLogo:"/logos/hifive-logo.svg",companyUrl:"https://hifive.nl",period:"Juli 2013 – Heden",location:"Zaandam, Nederland",description:"Digitaal innovatiebureau opgericht, gespecialiseerd in custom e-commerceplatforms, mobiele applicaties en websites met AI-technologieën en software-integraties.",longDescription:`Bij Hifive geloven we in de kracht van maatwerk oplossingen om bedrijven te transformeren. Onze expertise in het cre\xebren van unieke e-commerce platforms, mobiele applicaties en custom websites, ondersteund door de nieuwste AI-technologie\xebn en software-integraties, stelt ons in staat om uw digitale aanwezigheid te optimaliseren.

Bij Hifive staan we voor innovatie, kwaliteit en klanttevredenheid. Ons toegewijde team van professionals werkt nauw samen met elke klant om oplossingen te ontwerpen die niet alleen voldoen aan hun huidige behoeften, maar hen ook voorbereiden op toekomstige groei en succes. Of u nu een startup bent of een gevestigde onderneming, wij bieden de tools en inzichten die nodig zijn om te gedijen in een steeds veranderende digitale wereld.

We zijn trots op ons vermogen om complexe uitdagingen te vertalen naar gebruiksvriendelijke, effectieve oplossingen. Onze aanpak is altijd persoonlijk, met focus op het opbouwen van duurzame relaties met onze klanten. Hifive is meer dan een leverancier; we zijn uw partner in digitale innovatie.`,technologies:["Next.js","React Native","AI/ML","Python","FastAPI","TypeScript","E-commerce","MedusaJS","Tailwind"],color:"violet",highlights:["12+ jaar levering van custom digitale oplossingen","AI-aangedreven e-commerce en mobiele platforms","Langdurige klantpartnerschappen en digitale transformatie","Full-service digitaal innovatiebureau"],achievements:["Succesvol 100+ custom projecten opgeleverd","Langdurige partnerschappen opgebouwd met 50+ klanten","Pionier in AI-integratie in Nederlandse MKB-markt","95% klantretentie gehandhaafd"],responsibilities:["Ontwikkeling van custom e-commerceplatforms leiden","AI-aangedreven bedrijfsoplossingen architecten","Klantrelaties en projectoplevering beheren","Ontwikkelteam opbouwen en begeleiden","Technische innovatie en strategie stimuleren"],impact:["Digitale operaties getransformeerd voor 50+ bedrijven","Miljoenen aan extra omzet gegenereerd voor klanten","Schaalbare platforms gecreëerd die duizenden gebruikers bedienen"]},{id:"vodafoneziggo",title:"Senior Frontend Developer",company:"VodafoneZiggo",companyLogo:"/logos/vodafoneziggo-logo.png",companyUrl:"https://www.vodafoneziggo.nl",period:"November 2024 – Maart 2025",location:"Utrecht, Nederland",description:"Ontwikkeling van hoogpresterende cross-platform mobiele applicaties met React Native, Expo en TypeScript. Schaalbaar ontwerpsysteem gebouwd met Storybook.",longDescription:`Bij VodafoneZiggo heb ik bijgedragen aan de ontwikkeling van hoogpresterende mobiele applicaties als React Native Developer. Mijn rol omvatte het bouwen en optimaliseren van gebruikersinterfaces met React Native, Expo en TypeScript, met als doel een naadloze cross-platform ervaring te garanderen.

Ik gebruikte Storybook om een schaalbaar ontwerpsysteem te ontwikkelen en te onderhouden, waardoor effici\xebnte componenttesting en UI-consistentie mogelijk werd. Het schrijven van robuuste, onderhoudbare code stond centraal, ondersteund door ESLint voor statische analyse en Jest voor unit- en integratietesting.

Met een sterke focus op toegankelijkheid (WCAG-normen) zorgde ik ervoor dat de applicaties inclusief waren en voldeden aan branchenormen. Daarnaast werd SonarQube gebruikt om codekwaliteit continu te monitoren en hoge ontwikkelstandaarden te handhaven.

Deze ervaring verdiepte mijn expertise in mobiele ontwikkeling, toegankelijkheid en CI/CD best practices binnen een enterprise omgeving.`,technologies:["React Native","Expo","TypeScript","Storybook","Jest","WCAG","SonarQube","ESLint"],color:"cyan",highlights:["Schaalbaar ontwerpsysteem gebouwd met Storybook","WCAG-toegankelijkheidsnaleving overal gewaarborgd","Enterprise CI/CD best practices geïmplementeerd","Hoge codekwaliteit gehandhaafd met SonarQube"],achievements:["Mobiele app opgeleverd die 3M+ actieve gebruikers bedient","99,9% uptime en 4,5+ ster app store beoordeling bereikt","Componentontwikkelingstijd met 50% verminderd met ontwerpsysteem","90%+ testdekking gehandhaafd over hele codebase"],responsibilities:["Cross-platform mobiele functies ontwikkelen met React Native","Componentenbibliotheek bouwen en onderhouden in Storybook","Toegankelijkheidsnormen implementeren (WCAG 2.1)","Uitgebreide tests schrijven met Jest","Samenwerken met ontwerpers en backend teams"],teamSize:"15-20 ontwikkelaars",impact:["Miljoenen VodafoneZiggo-klanten bedienen","Naadloos account- en servicebeheer mogelijk maken","Klanttevredenheidsscores verbeteren"]},{id:"bravelink",title:"Full-Stack Engineer",company:"BraveLink",companyLogo:"/logos/bravelink-logo.jpeg",companyUrl:"https://bravelink.nl",period:"April 2024 – Oktober 2024",location:"Amsterdam, Nederland",description:"Data-gedreven talent matchmaker die softwareontwikkelingsexpertise combineert met een mensgerichte aanpak.",longDescription:`Ik ben een data-gedreven opdracht matchmaker bij BraveLink, met een achtergrond in softwareontwikkeling en een passie voor mensen. Dankzij mijn expertise in technologie en data-analyse cre\xeber ik de ideale match tussen talent en organisaties, ongeacht de sector.

Mijn expertisegebieden omvatten strategische matching gericht op zowel vaardigheden als bedrijfscultuur, data-analyse met gebruik van inzichten voor nauwkeurige plaatsingen, en softwareontwikkeling waarbij ik technologische oplossingen cre\xeber voor effectieve matches. Mijn doel is om mensen en bedrijven samen te brengen voor wederzijds succes.`,technologies:["Data-analyse","Full-Stack Ontwikkeling","Strategische Matching","TypeScript","React","Node.js"],color:"violet",highlights:["Technologie-gedreven talent matchingplatform","Strategische data-analyse voor optimale plaatsingen","Cross-sector expertise en flexibiliteit"],achievements:["Succesvol 50+ professionals geplaatst in ideale rollen","95% plaatsingsretentie bereikt na 6 maanden","Data-gedreven matchingalgoritmen gebouwd"],responsibilities:["Kandidaatvaardigheden en culturele fit analyseren","Professionals matchen met organisaties","Matchingalgoritmen en tools ontwikkelen","Relaties opbouwen met klanten en kandidaten"],impact:["Talent verbonden met toonaangevende organisaties","Plaatsingssuccesspercentages verbeterd","Time-to-hire voor klanten verminderd"]},{id:"braveorange",title:"Senior Frontend Developer",company:"BraveOrange",companyLogo:"/logos/braveorange-logo.png",companyUrl:"https://braveorange.nl",period:"September 2023 – Oktober 2024",location:"Amsterdam, Nederland",description:"Full-stack ontwikkeling met Java, Spring Boot, JavaScript en TypeScript. Uitgebreide webapplicaties gebouwd met moderne frameworks.",longDescription:`Bij Brave Orange was ik actief als Fullstack Developer, waarbij ik een breed scala aan technieken inzette, waaronder Java, Spring Boot, JavaScript en TypeScript. Mijn rol omvatte het ontwikkelen en implementeren van uitgebreide webapplicaties.

Ik bracht rijke ervaring mee in het gebruik van geavanceerde technologie\xebn zoals React, Node.js, Next.js en verschillende andere moderne frameworks en tools, wat bijdroeg aan mijn voortdurend groeiende passie voor technische innovatie.`,technologies:["React","Next.js","TypeScript","Java","Spring Boot","Node.js"],color:"cyan",highlights:["Full-stack webapplicatie ontwikkeling","Moderne framework implementatie","Technische innovatie en best practices"],achievements:["Meerdere enterprise webapplicaties opgeleverd","Frontend en backend systemen naadloos geïntegreerd","Junior developers begeleid in best practices"],responsibilities:["Full-stack webapplicaties ontwikkelen","Moderne React en Next.js oplossingen implementeren","Backend services bouwen met Java en Spring Boot","Samenwerken met cross-functionele teams"],teamSize:"10-15 ontwikkelaars"},{id:"robidus",title:"Front-end Developer",company:"Robidus",companyLogo:"/logos/robidus-logo.png",companyUrl:"https://robidus.nl",period:"Maart 2021 – December 2021",location:"Nederland",description:"Ontwikkeling van geavanceerd applicatieplatform met integratie van diverse datastromen voor WGA- en Ziektewetbegeleiding.",longDescription:`Bij Robidus speelde ik een belangrijke rol in de ontwikkeling van een geavanceerd applicatieplatform gericht op het integreren van verschillende datastromen voor WGA- en Ziektewetbegeleiding. Mijn focus lag op het cre\xebren van een robuust en schaalbaar platform met Next.js, TypeScript en andere geavanceerde technologie\xebn.

Ik droeg actief bij aan het ontwikkelingsproces door de inzet van Continuous Integration en Deployment, waarbij Jenkins werd gebruikt om codewijzigingen te automatiseren. Dit zorgde voor snelle feedback en effici\xebnte probleemoplossing.

Door mijn expertise in Next.js en React, gecombineerd met een gedetailleerde backlog en effectieve samenwerking binnen het team, bouwden we een platform dat niet alleen een naadloze gebruikerservaring biedt, maar ook bijdraagt aan de missie van Robidus in de sociale zekerheid.`,technologies:["Next.js","TypeScript","React","Jenkins","CI/CD"],color:"violet",highlights:["Sociale zekerheid data-integratieplatform","CI/CD-automatisering met Jenkins","Naadloze gebruikerservaring voor complexe workflows"],achievements:["Platform gebouwd dat jaarlijks 10.000+ gevallen verwerkt","Verwerkingstijd van gevallen met 50% verminderd","100% AVG-naleving gehandhaafd"],responsibilities:["Frontend ontwikkelen met Next.js en React","CI/CD-pijplijnen implementeren met Jenkins","Meerdere databronnen integreren","Beveiliging en AVG-naleving garanderen"],impact:["Sociaal zekerheidsgevallenbeheer gestroomlijnd","Efficiëntie voor medewerkers verbeterd","Data-nauwkeurigheid en betrouwbaarheid verbeterd"]},{id:"software-bastards",title:"Front-End Developer",company:"Software Bastards",companyLogo:"/logos/software-bastards-logo.svg",companyUrl:"https://softwarebastards.nl",period:"Juli 2022 – September 2023",location:"Amsterdam, Nederland",description:"Frontend-ontwikkeling met focus op innovatieve webapplicaties met React 18, TypeScript en modern JavaScript-ecosysteem. Herbruikbare componentenbibliotheken gebouwd, complexe state management geïmplementeerd met Redux Toolkit en 90%+ testdekking gehandhaafd. Tibbaa gecontracteerd voor React Native mobiele ontwikkeling tijdens deze periode.",longDescription:`Bij Software Bastards werkte ik als Front-End Developer in een dynamische agency-omgeving, waarbij ik moderne webapplicaties bouwde voor diverse klanten, waaronder startups en gevestigde ondernemingen. De rol benadrukte technische excellentie, clean code-principes en innovatieve oplossingen met behulp van geavanceerde frontend-technologie\xebn.

Mijn primaire focus lag op het ontwikkelen van geavanceerde React-applicaties met TypeScript, het cre\xebren van responsive, performante gebruikersinterfaces die uitzonderlijke gebruikerservaringen leverden. Ik architecteerde en bouwde herbruikbare componentenbibliotheken die fundamentele assets werden gedeeld over meerdere klantprojecten, wat de ontwikkeltijd met 40% verminderde en consistente ontwerppatronen garandeerde. Deze bibliotheken omvatten complexe formuliercomponenten met validatie, datavisualisatiewidgets en interactieve UI-elementen.

State management werd ge\xefmplementeerd met Redux Toolkit voor voorspelbare state containers, gecombineerd met Redux Saga voor het afhandelen van complexe asynchrone workflows. Ik integreerde RESTful API's en GraphQL-endpoints met Apollo Client, waarbij ik optimistische updates en intelligente cachingstrategie\xebn implementeerde om waargenomen prestaties te verbeteren. Authenticatie en autorisatie werden afgehandeld via JWT-tokens met refresh-mechanismen en op rollen gebaseerde toegangscontrole.

Codekwaliteit was van het grootste belang - ik handhaafde 90%+ testdekking met Jest en React Testing Library, waarbij ik uitgebreide unit tests schreef voor componenten en integratietests voor gebruikersworkflows. ESLint met Airbnb's style guide zorgde voor consistente codestandaarden, terwijl Prettier automatische opmaak verzorgde. Ik stelde webpack-configuraties op geoptimaliseerd voor productie met code splitting, tree shaking en lazy loading om bundlegroottes te minimaliseren.

Samenwerking was integraal voor succes - ik werkte nauw samen met UX-ontwerpers om Figma-ontwerpen te vertalen naar pixel-perfecte implementaties, werkte samen met backend-ontwikkelaars aan API contract design en integratie, nam deel aan code reviews met constructieve feedback aan collega's, en droeg bij aan technische besluitvorming en architectuurdiscussies. De agile omgeving met twee-weekse sprints hield oplevering gefocust en iteratief.

Tijdens deze periode contracteerde ik ook voor Tibbaa voor het ontwikkelen van React Native mobiele applicaties, wat veelzijdigheid over web- en mobiele platforms toonde. De rol versterkte mijn frontend engineering-capaciteiten aanzienlijk, verdiepte mijn begrip van het moderne JavaScript-ecosysteem en versterkte best practices in componentarchitectuur en state management.`,technologies:["React 18","TypeScript 4.x","JavaScript ES2022","Redux Toolkit","Redux Saga","Webpack 5","Babel","CSS3","SASS","CSS Modules","Styled Components","Jest","React Testing Library","ESLint","Prettier","GraphQL","Apollo Client","REST APIs","JWT","Git","GitHub","Figma","Responsive Design","Cross-browser Compatibility","Performance Optimization","Code Splitting","Lazy Loading","Agile/Scrum"],color:"violet",highlights:["Moderne React applicatie-ontwikkeling","Clean code en best practices focus","Collaboratieve teamomgeving"],achievements:["Meerdere klantprojecten succesvol opgeleverd","Herbruikbare componentenbibliotheken geïmplementeerd","Hoge codekwaliteitsnormen gehandhaafd"],responsibilities:["Frontend-functies ontwikkelen met React en TypeScript","Responsive designs implementeren","Samenwerken met cross-functionele teams","Codekwaliteit en prestaties handhaven"]},{id:"tibbaa",title:"React Native Developer",company:"Tibbaa (via Software Bastards)",companyLogo:"/logos/tibbaa-logo.png",companyUrl:"https://tibbaa.com",period:"September 2022 – Mei 2023",location:"Amsterdam, Nederland",description:"Mobiele applicatie-ontwikkeling met focus op cross-platform iOS en Android applicaties met React Native en Expo. Opdracht via Software Bastards. Complexe navigatieflows geïmplementeerd, native modules geïntegreerd en 4,5+ ster app store-beoordelingen bereikt met focus op prestatie-optimalisatie en gebruikerservaring.",longDescription:`Bij Tibbaa werkte ik als React Native Developer via een opdracht door Software Bastards, waarbij ik cross-platform mobiele applicaties bouwde voor iOS en Android die native-kwaliteit gebruikerservaringen leverden. De rol richtte zich op het cre\xebren van performante, gebruiksvriendelijke mobiele oplossingen die voldeden aan hoge normen voor kwaliteit en gebruikerstevredenheid.

Mijn verantwoordelijkheden richtten zich op het ontwikkelen van nieuwe functies en het verbeteren van bestaande functionaliteit met React Native met TypeScript, waarbij ik type safety en code onderhoudbaarheid over de hele mobiele codebase garandeerde. Ik implementeerde complexe navigatieflows met React Navigation, waarbij ik intu\xeftieve gebruikersreizen cre\xeberde met stack, tab en drawer navigators. Deep linking werd ge\xefntegreerd om naadloze navigatie mogelijk te maken vanuit push notifications en externe bronnen.

State management werd afgehandeld via Redux met Redux Toolkit, waarbij applicatiestatus effici\xebnt werd beheerd en persistente opslag werd ge\xefmplementeerd met AsyncStorage voor offline-mogelijkheden. Ik integreerde RESTful API's voor data-ophaling en real-time updates, waarbij ik optimistische UI-updates implementeerde om waargenomen prestaties te verbeteren. Push notifications werden geconfigureerd via Firebase Cloud Messaging, wat tijdige gebruikersbetrokkenheid mogelijk maakte.

Native module-integratie was een belangrijk aspect - ik verbond JavaScript en native code voor platformspecifieke functies, waaronder cameratoegang, biometrische authenticatie (Face ID, Touch ID, vingerafdruk), geolocatiediensten en lokale bestandssysteembewerkingen. Platformspecifieke code werd zorgvuldig beheerd om consistent gedrag te garanderen terwijl native mogelijkheden werden benut waar nuttig.

Prestatie-optimalisatie was kritiek voor het leveren van soepele 60fps-ervaringen. Ik implementeerde FlatList-virtualisatie voor effici\xebnte rendering van grote lijsten, gebruikte React.memo en useMemo om onnodige re-renders te voorkomen, optimaliseerde afbeeldingslading met react-native-fast-image, en monitorde prestaties met Flipper debugging tools. Bundelgrootte werd geminimaliseerd door code splitting en het verwijderen van ongebruikte afhankelijkheden.

Testen was uitgebreid met Jest en React Native Testing Library die bedrijfslogica en componentrendering dekten. Ik voerde handmatige tests uit op zowel iOS-simulators en Android-emulators, plus echte apparaten om platformspecifieke problemen op te vangen. App store deployment-processen werden vastgesteld voor TestFlight (iOS) en Google Play Console (Android), waarbij versiebeheer, release notes en gefaseerde rollouts werden beheerd.

Samenwerking met productmanagers, UX-ontwerpers, backend-engineers en QA-testers zorgde voor afstemming en kwaliteit. De applicaties die ik ontwikkelde, behaalden uitstekende 4,5+ ster beoordelingen en positieve gebruikersrecensies, wat de focus op prestaties en gebruikerservaring valideerde. Deze rol versterkte mijn mobiele ontwikkelingsexpertise en cross-platform architectuurvaardigheden.`,technologies:["React Native 0.70+","Expo SDK","TypeScript 4.x","Redux Toolkit","React Navigation","AsyncStorage","Firebase Cloud Messaging","Push Notifications","Deep Linking","Native Modules","iOS","Android","Biometric Authentication","Geolocation","Camera","Jest","React Native Testing Library","Flipper","TestFlight","Google Play Console","REST APIs","Performance Optimization","FlatList","Image Optimization","Code Splitting","Git","Agile/Scrum"],color:"cyan",highlights:["Cross-platform mobiele ontwikkeling","Native iOS en Android functies","Hoogpresterende mobiele applicaties"],achievements:["Succesvolle mobiele applicaties gelanceerd","Uitstekende app store-beoordelingen bereikt","Functies opgeleverd binnen strakke deadlines"],responsibilities:["React Native mobiele applicaties ontwikkelen","Native iOS en Android functies implementeren","App-prestaties optimaliseren","Samenwerken met product- en ontwerpteams"]},{id:"rampage",title:"Frontend Developer",company:"Rampage (via Rebels)",companyLogo:"/logos/rebels-rampage-logo.png",companyUrl:"#",period:"Januari 2021 – Juli 2022",location:"Amsterdam, Nederland",description:"Frontend-ontwikkelingsopdracht via Rebels, waarbij moderne webapplicaties werden gebouwd met React en TypeScript.",longDescription:`Bij Rampage werkte ik als Frontend Developer via een opdracht door Rebels. Mijn rol omvatte het bouwen en onderhouden van moderne webapplicaties met React, TypeScript en hedendaagse frontend-technologie\xebn.

Ik droeg bij aan het ontwikkelen van gebruikersinterfaces die zowel visueel aantrekkelijk als zeer functioneel waren, waarbij uitstekende gebruikerservaring over alle platforms werd gegarandeerd. Werkend in een agile omgeving, werkte ik samen met ontwerpers en backend-ontwikkelaars om hoogwaardige oplossingen op te leveren.`,technologies:["React","TypeScript","JavaScript","CSS3","HTML5","Agile"],color:"violet",highlights:["Moderne React applicatie-ontwikkeling","Agile teamsamenwerking","Hoogwaardige gebruikersinterface-implementatie"],achievements:["Meerdere feature releases opgeleverd","Applicatieprestaties verbeterd","Uitstekende codekwaliteit gehandhaafd"],responsibilities:["Frontend-functies ontwikkelen met React en TypeScript","Samenwerken met cross-functionele teams","Responsive designs implementeren","Codekwaliteit en best practices garanderen"]},{id:"rebels",title:"Full-Stack Developer",company:"Rebels",companyLogo:"/logos/rebels-logo.jpeg",companyUrl:"https://rebels.nl",period:"Februari 2020 – Juli 2022",location:"Amsterdam, Nederland",description:"Full-stack ontwikkeling bij toonaangevende Amsterdamse tech consultancy, waarbij hoogwaardige softwareoplossingen werden opgeleverd over diverse klant opdrachten. Succesvol 5+ grote projecten voltooid voor enterprise klanten waaronder VodafoneZiggo, SURF, Rampage, Robidus en Lost Lemon, waarbij expertise werd opgebouwd over React, Next.js, TypeScript, Node.js en Java-ecosystemen.",longDescription:`Bij Rebels werkte ik als Full-Stack Developer bij een van de premier tech consultancies van Amsterdam, bekend om het plaatsen van topengineering-talent bij toonaangevende bedrijven in Nederland. Over 2,5 jaar voltooide ik succesvol 5+ klantopdrachten die onderwijstechnologie, sociale zekerheid, telecommunicatie en webontwikkelingssectoren omvatten, waarbij ik consistent positieve feedback ontving voor technische excellentie en professionaliteit.

Het consultancy-model vereiste uitzonderlijk aanpassingsvermogen - elke opdracht bracht nieuwe technische stacks, teamdynamiek, bedrijfsdomeinen en projectmethodologie\xebn met zich mee. Deze omgeving versnelde mijn professionele groei toen ik snel onboarde naar nieuwe codebases, onbekende technologie\xebn onder de knie kreeg en waarde leverde binnen strakke tijdslijnen. Snel leren en effectieve communicatie werden essenti\xeble vaardigheden voor het navigeren door diverse klantcontexten.

Mijn technische focus omspande de volledige stack met bijzondere kracht in moderne JavaScript/TypeScript-ecosystemen. Frontend-ontwikkeling richtte zich op React en Next.js, waarbij responsive, toegankelijke gebruikersinterfaces werden gebouwd met sterke nadruk op componentarchitectuur en state management. Ik implementeerde complexe formulieren met validatie, datatables met sorteren/filteren, dashboards met real-time updates en multi-step workflows. Backend-werk omvatte Node.js API's met Express/Fastify en Java services met Spring Boot, het ontwerpen van RESTful endpoints, het implementeren van bedrijfslogica en integratie met databases (PostgreSQL, MongoDB) en externe services.

Belangrijke klantopdrachten omvatten:

**SURF (2025)** - Enterprise whitelabel platform voor educatieve bronnen die 50.000+ gebruikers bedienen, gedeelde componentenbibliotheken bouwen en CI/CD-pijplijnen implementeren

**VodafoneZiggo (2024-2025)** - React Native mobiele applicatie voor 3M+ klanten, ontwerpsystemen ontwikkelen en WCAG-toegankelijkheid garanderen

**Rampage (2021-2022)** - Frontend-ontwikkeling waarbij moderne webapplicaties werden gebouwd met React en TypeScript

**Robidus (2021)** - Sociale zekerheidsplatform dat diverse datastromen integreert, CI/CD implementeren met Jenkins

**Lost Lemon (2020)** - Frontend-ontwikkeling voor MensCentraal-applicatie met SASS en Java JSF/Primefaces

Elke opdracht versterkte best practices in softwareontwikkeling - clean code-principes, uitgebreid testen, code review, agile methodologie\xebn en effectieve klantcommunicatie. Ik werkte samen met cross-functionele teams waaronder ontwerpers, productmanagers, QA-engineers en mede-ontwikkelaars, waarbij ik vaak diende als een brug tussen technische en niet-technische stakeholders.

De Rebels-ervaring was transformerend voor mijn carri\xe8re, waarbij ik werd blootgesteld aan enterprise-schaal systemen, diverse technische architecturen en high-performance teamomgevingen. Het bouwde vertrouwen in mijn vermogen om complexe technische uitdagingen aan te pakken, snel aan te passen aan nieuwe domeinen en consistent professionele resultaten te leveren. De nadruk van de consultancy op continu leren en technische excellentie sloot perfect aan bij mijn groeimindset, wat een sterke basis vestigde voor senior-level rollen.`,technologies:["React 17-18","Next.js 11-13","TypeScript 4.x","JavaScript ES2020+","Node.js 14-16","Express","Fastify","Java 11-17","Spring Boot 2.x","PostgreSQL","MongoDB","REST APIs","GraphQL","Git","Docker","Jenkins","CI/CD","Jest","React Testing Library","JUnit","Agile/Scrum","SASS","Tailwind CSS","Redux","Context API","Microservices","OAuth","JWT","WCAG","Responsive Design","Full-Stack Development","Client Consulting"],color:"cyan",highlights:["Diverse klantopdrachten en projecten","Full-stack ontwikkeling over meerdere domeinen","Grote enterprise klanten","Aanpasbare consultancy-omgeving"],achievements:["Succesvol 5+ klantopdrachten voltooid","Langetermijnrelaties opgebouwd met grote klanten","Oplossingen opgeleverd over diverse technische stacks","Consistent positieve klantfeedback ontvangen"],responsibilities:["Full-stack oplossingen opleveren voor klantopdrachten","Aanpassen aan verschillende technische stacks en methodologieën","Samenwerken met diverse teams en stakeholders","Hoge kwaliteitsnormen handhaven over projecten"],impact:["Bijgedragen aan grote enterprise projecten","Succesvolle klantbetrekkingen mogelijk gemaakt","Reputatie opgebouwd voor technische excellentie"]},{id:"lost-lemon",title:"Frontend Developer",company:"Lost Lemon (via Rebels)",companyLogo:"/logos/lost-lemon-logo.png",companyUrl:"#",period:"Oktober 2020 – December 2020",location:"Amsterdam, Nederland",description:"Frontend-ontwikkeling voor MensCentraal-applicatie met SASS en Java JSF/Primefaces-componenten.",longDescription:`Bij Lost Lemon droeg ik bij aan het verbeteren van de MensCentraal-applicatie via een opdracht door Rebels. Het project richtte zich op het herontwerpen van het dashboard en andere functionaliteiten met een nieuw design, waarbij gebruiksvriendelijkheid werd verbeterd op basis van gebruikersonderzoek.

Ik werkte met SASS om componenten te stylen, vaak gebouwd met Primefaces-componenten. De applicatie was een webgebaseerde Java (JSF/Primefaces)-applicatie, wat nauwe samenwerking met backend-ontwikkelaars vereiste om naadloze integratie te garanderen.`,technologies:["SASS","Java JSF","Primefaces","JavaScript","CSS3","Gebruikersonderzoek"],color:"violet",highlights:["MensCentraal applicatie herontwerp","Gebruikersonderzoek-gedreven verbeteringen","Primefaces componenten styling","Java JSF webapplicatie"],achievements:["Gebruiksvriendelijkheid verbeterd op basis van onderzoek","Dashboard succesvol herontworpen","Visuele consistentie over applicatie verbeterd"],responsibilities:["Primefaces-componenten stylen met SASS","Nieuwe ontwerpen implementeren voor dashboard","Gebruikerservaring verbeteren op basis van onderzoek","Samenwerken met backend Java-ontwikkelaars"]},{id:"timber",title:"Hybris E-Commerce Developer",company:"Timber and Building Supplies Holland N.V",companyLogo:"/logos/tabs-logo.png",companyUrl:"#",period:"Maart 2019 – Februari 2020",location:"Zaandam, Nederland",description:"Frontend-ontwikkeling voor SAP Hybris E-Commerce platform met diepe integratie in backend-systemen.",longDescription:`Bij Timber and Building Supplies Holland N.V. speelde ik een cruciale rol als Hybris E-Commerce Developer, waarbij mijn focus primair lag op frontend-ontwikkeling. Mijn verantwoordelijkheden omvatten het ontwerpen en implementeren van gebruikersinterfaces met behulp van geavanceerde webtechnologie\xebn, terwijl ik ook nauw samenwerkte met het backend-team.

Tijdens mijn tijd bij het bedrijf verdiepte ik me ook in Java en SAP. Dit stelde me niet alleen in staat om aan de frontend te werken, maar ook om grondig begrip en praktische ervaring op te doen in de backend-aspecten van het Hybris E-Commerce platform. Mijn werk omvatte het integreren van SAP-systemen met het Hybris-platform, wat essentieel was voor het effici\xebnt beheren van online retailprocessen.

Ik droeg actief bij aan verschillende projectfasen, van concept en ontwerp tot ontwikkeling en implementatie. Mijn vaardigheden in frontend-technologie\xebn, gecombineerd met mijn vermogen om Java- en SAP-aspecten te begrijpen en te implementeren, stelde me in staat bij te dragen aan een naadloze en ge\xefntegreerde e-commerce-ervaring voor onze klanten.`,technologies:["SAP Hybris","Java","SAP Integration","E-Commerce","Frontend","Spring"],color:"cyan",highlights:["SAP Hybris e-commerce platformontwikkeling","Frontend en backend integratie","Naadloze online retailervaring"],achievements:["50.000+ product-SKU's beheerd","€5M+ aan jaarlijkse online verkopen verwerkt","1.000+ B2B-klanten succesvol bediend"],responsibilities:["Frontend ontwikkelen voor Hybris-platform","SAP-systemen integreren met e-commerce","Complexe B2B-workflows implementeren","Prestaties en gebruikerservaring optimaliseren"],impact:["Digitale transformatie mogelijk gemaakt voor bouwmaterialenbedrijf","B2B-bestelprocessen gestroomlijnd","Online omzet significant verhoogd"]},{id:"improvers",title:"Front-End Developer",company:"Improvers",companyLogo:"/logos/improvers-logo.png",companyUrl:"#",period:"Oktober 2017 – Augustus 2018",location:"Nederland",description:"Frontend-ontwikkeling met moderne JavaScript frameworks en responsive design technieken.",longDescription:`Bij Improvers werkte ik als Front-End Developer, waarbij ik me richtte op het bouwen van responsive webapplicaties met moderne JavaScript frameworks. Mijn rol omvatte het cre\xebren van gebruikersinterfaces die zowel visueel aantrekkelijk als zeer functioneel waren.

Ik werkte samen met ontwerpers en backend-ontwikkelaars om hoogwaardige weboplossingen op te leveren, waarbij cross-browser compatibiliteit en optimale prestaties werden gegarandeerd.`,technologies:["JavaScript","HTML5","CSS3","jQuery","Responsive Design","Bootstrap"],color:"violet",highlights:["Responsive webapplicatie-ontwikkeling","Cross-browser compatibiliteit","Moderne JavaScript-implementatie"],achievements:["Meerdere klantprojecten opgeleverd","Websiteprestaties verbeterd","Responsive designs geïmplementeerd"],responsibilities:["Frontend-functies ontwikkelen met JavaScript","Responsive designs implementeren","Cross-browser compatibiliteit garanderen","Samenwerken met ontwerp- en backend-teams"]},{id:"woodwing",title:"Junior Software Engineer",company:"WoodWing",companyLogo:"/logos/woodwing-logo.png",companyUrl:"https://www.woodwing.com",period:"Februari 2016 – September 2016",location:"Zaandam, Nederland",description:"Softwareontwikkelingsstage en junior rol bij toonaangevende content management solutions provider.",longDescription:`Bij WoodWing begon ik als stagiair en maakte ik de overstap naar een Junior Software Engineer-rol, waarbij ik werkte aan content management-oplossingen. Deze 8 maanden durende positie bood waardevolle ervaring in professionele softwareontwikkeling, werken met enterprise klanten en het leren van best practices in de industrie.

Ik droeg bij aan het ontwikkelen van functies voor WoodWing's content management platform, werkte samen met senior engineers en kreeg kennis van complexe softwaresystemen.`,technologies:["JavaScript","PHP","HTML5","CSS3","Content Management","Agile"],color:"cyan",highlights:["Stagiair naar Junior Engineer transitie","Enterprise content management systemen","Professionele ontwikkelingservaring"],achievements:["Succesvol overgegaan van stagiair naar junior engineer","Bijgedragen aan enterprise platform functies","Professionele softwareontwikkelingspraktijken geleerd"],responsibilities:["Functies ontwikkelen voor content management platform","Samenwerken met senior engineers","Deelnemen aan code reviews","Enterprise softwareontwikkeling leren"]},{id:"objeqts",title:"Junior Software Engineer",company:"Objeqts BV",companyLogo:"/logos/objeqts-logo.png",companyUrl:"#",period:"Mei 2015 – September 2015",location:"Nederland",description:"Junior softwareontwikkelingsrol gericht op webapplicaties en softwareoplossingen.",longDescription:`Bij Objeqts BV werkte ik als Junior Software Engineer, waarbij ik bijdroeg aan webapplicatie-ontwikkeling en softwareoplossingen. Deze rol bood early career ervaring in professionele softwareontwikkelingsomgevingen.

Ik werkte aan verschillende projecten, leerde best practices voor softwareontwikkeling en kreeg hands-on ervaring met webtechnologie\xebn.`,technologies:["JavaScript","PHP","HTML5","CSS3","MySQL","Web Development"],color:"violet",highlights:["Early career softwareontwikkeling","Webapplicatie-ontwikkeling","Professionele ontwikkelingspraktijken"],achievements:["Bijgedragen aan meerdere projecten","Webapplicaties ontwikkeld","Professionele workflows geleerd"],responsibilities:["Webapplicatie-functies ontwikkelen","Samenwerken met ontwikkelteam","Schone, onderhoudbare code schrijven","Best practices voor softwareontwikkeling leren"]},{id:"jaspers-media",title:"Web Developer Stagiair",company:"Jaspers Media",companyLogo:"/logos/jaspers-media-logo.png",companyUrl:"#",period:"Januari 2014 – Mei 2014",location:"Nederland",description:"Webontwikkelingsstage gericht op PHP, MySQL en JavaScript. Google Maps-applicatie gebouwd voor Biernet.nl.",longDescription:`Bij Jaspers Media voltooide ik een webontwikkelingsstage waarbij ik hands-on ervaring opdeed met PHP, MySQL en JavaScript. Een belangrijk project was het ontwikkelen van een Google Maps-applicatie voor Biernet.nl, die lokale gebruikers hielp om nabijgelegen biergerelateerde etablissementen te vinden.

Deze stage bood fundamentele ervaring in webontwikkeling, databasebeheer en werken met API's.`,technologies:["PHP","MySQL","JavaScript","Google Maps API","HTML5","CSS3"],color:"cyan",highlights:["Google Maps API-integratie","PHP en MySQL-ontwikkeling","Real-world webapplicatieproject"],achievements:["Functionele Google Maps-applicatie gebouwd","Google Maps API succesvol geïntegreerd","Fundamentele webontwikkelingsvaardigheden opgedaan"],responsibilities:["Webapplicaties ontwikkelen met PHP en MySQL","Google Maps API integreren","Interactieve kaartfuncties creëren","Webontwikkelingsfundamenten leren"]},{id:"djw-media",title:"Application Developer Stagiair",company:"DJW Media",companyLogo:"/logos/djw-media-logo.svg",companyUrl:"#",period:"Januari 2013 – Juni 2013",location:"Nederland",description:"Applicatieontwikkelingsstage waarbij werd gewerkt aan CMS-systemen en de Feest Familie-website.",longDescription:`Bij DJW Media voltooide ik mijn eerste stage als Application Developer, waarbij ik werkte aan content management systemen en webapplicaties. Een opmerkelijk project was het bijdragen aan de Feest Familie-website, wat waardevolle ervaring opleverde in CMS-ontwikkeling en webprogrammering.

Deze stage markeerde het begin van mijn professionele softwareontwikkelingsreis en bood essenti\xeble fundamentele vaardigheden.`,technologies:["PHP","MySQL","CMS","HTML","CSS","JavaScript"],color:"violet",highlights:["Eerste professionele ontwikkelingsstage","CMS-systeemontwikkeling","Fundament voor softwarecarrière"],achievements:["Bijgedragen aan Feest Familie-website","CMS-ontwikkeling geleerd","Fundamentele programmeervaardigheden opgebouwd"],responsibilities:["Werken aan CMS-systemen","Webapplicatie-functies ontwikkelen","Applicatieontwikkeling leren","Samenwerken met ontwikkelteam"]}];var f=a.i(90312);let g=[{id:"ai-ats",title:"AI ATS Recruitment Platform",description:"Intelligent sollicitantenvolgsysteem voor geautomatiseerde vacature-kandidaat matching. AI-aangedreven CV-parsing en semantische functie-matching gebouwd met behulp van vector embeddings. Geautomatiseerde screeningworkflows en kandidaatrangschikking geïmplementeerd op basis van functievereisten en ervaring.",longDescription:`AI ATS is een intelligent sollicitantenvolgsysteem dat recruitment revolutioneert door middel van AI-aangedreven automatisering. Het platform gebruikt geavanceerde NLP en machine learning om cv's te parseren, vaardigheden en ervaring te extraheren, en kandidaten semantisch te matchen met vacatures met behulp van vector embeddings.

Gebouwd met Next.js en Python, beschikt het systeem over geautomatiseerde kandidaatscreening, intelligente rankingalgoritmen en workflowautomatisering die de time-to-hire met 60% vermindert. Integratie met LangChain maakt conversationele AI-interfaces mogelijk voor kandidaatinteractie, terwijl Pinecone vector database de semantische zoekfunctionaliteit aandrijft.`,image:"https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=600&fit=crop",technologies:["Next.js","OpenAI GPT-4","LangChain","Pinecone","PostgreSQL","TypeScript","Python"],liveUrl:null,githubUrl:null,featured:!0,category:"product",year:"2024",showOnCV:!0,achievements:["Geautomatiseerde CV-parsing en vaardighedenextractie","Semantische matching-engine gebouwd voor vacature-kandidaat fit","AI-aangedreven kandidaatscreeningworkflows geïmplementeerd"],challenges:["Diverse CV-formaten en structuren parseren","Nauwkeurige semantische matching-algoritmen bouwen","Onbevooroordeelde AI-screening garanderen"],solutions:["Multi-format CV-parser ontwikkeld met OCR-ondersteuning","Vector embeddings geïmplementeerd voor semantische vacature-matching","Transparante AI-beslissingsuitleg gecreëerd"],impact:["Time-to-hire met 60% verminderd","Wekelijks 1000+ sollicitaties verwerken","Kwaliteit van kandidaat-match met 45% verbeterd"]},{id:"3d-cad-quote-tool",title:"3D CAD Offertetool",description:"Productieofferteringssysteem met realtime 3D CAD-bestandsvisualisatie en geautomatiseerde kostencalculatie. Three.js geïntegreerd voor interactieve 3D-rendering en Python-gebaseerde parser voor het extraheren van specificaties uit STEP-, STL- en DXF-bestanden.",longDescription:`Een geavanceerd productieofferteringssysteem dat het offerteproces voor plaatbewerking revolutioneert. Het platform beschikt over geavanceerde 3D CAD-bestandsparsingmogelijkheden die automatisch afmetingen, materialen en complexiteitsmetrieken extraheren uit STEP, STL en andere 3D-formaten.

Gebouwd met Next.js-frontend en Python-backend, gebruikt het systeem Three.js voor 3D-visualisatie en aangepaste algoritmen voor het berekenen van productiekosten inclusief materiaal, arbeid, insteltijd en machinegebruik. Het platform integreert met bestaande ERP-systemen en biedt directe, nauwkeurige offertes die voorheen uren handmatige berekening kostten.`,image:"https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&h=600&fit=crop",technologies:["Next.js","Three.js","Python","FastAPI","PostgreSQL","React Three Fiber","TypeScript"],liveUrl:null,githubUrl:null,featured:!0,category:"client",year:"2024",showOnCV:!0,achievements:["Offertegenereringsproces geautomatiseerd met 3D-visualisatie","CAD-bestandsparser gebouwd die meerdere formaten ondersteunt","Geautomatiseerde PDF-rapportgeneratie geïntegreerd"],challenges:["Complexe 3D CAD-bestandsformaten parseren en interpreteren","Nauwkeurige productiekosten berekenen uit 3D-modellen","Realtime visualisatie bieden van geparseerde onderdelen"],solutions:["Aangepaste CAD-parsing-engine ontwikkeld die meerdere formaten ondersteunt","Berekeningsalgoritmen gebouwd op basis van best practices in productie","Three.js geïntegreerd voor interactieve 3D-visualisatie"],impact:["Offertegenereringstijd verminderd van 2 uur naar 2 minuten","Offertenauwkeurigheid verbeterd met 95%","Maandelijks 500+ offertes verwerken"]},{id:"ai-manufacturing-solutions",title:"AI-Aangedreven Productieoplossingen",description:"Digitale transformatie-initiatief met implementatie van AI-automatisering voor productieoperaties. Intelligente documentverwerking gebouwd met OpenAI GPT-4 en geautomatiseerde workfloworkestratie met n8n die ERP- en CRM-systemen verbindt.",longDescription:`Een uitgebreid AI-transformatieproject voor De Vries Surface Technologies, met implementatie van intelligente procesautomatisering over meerdere bedrijfsworkflows. De oplossingsarchitectuur omvat geautomatiseerde documentverwerking, voorspellende onderhoudsplanning, kwaliteitscontroleautomatisering en business intelligence-dashboards.

Gebouwd op Azure cloud-infrastructuur met Python-gebaseerde microservices en FastAPI-endpoints, integreert het systeem met bestaande productiesystemen terwijl het nieuwe AI-aangedreven mogelijkheden biedt. Het platform omvat aangepaste machine learning-modellen voor kwaliteitsvoorspelling, geautomatiseerde rapportage en realtime analyse.`,image:"https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1200&h=600&fit=crop",technologies:["OpenAI GPT-4","LangChain","Python","FastAPI","n8n","Power BI","PostgreSQL"],liveUrl:null,githubUrl:null,featured:!0,category:"client",year:"2024",showOnCV:!0,achievements:["Documentverwerkingsworkflows geautomatiseerd","AI-aangedreven kwaliteitsvoorspelling geïntegreerd","Realtime productiemonitoringdashboards gebouwd"],challenges:["AI integreren in bestaande productieprocessen","Modellen trainen met beperkte historische gegevens","Systeembetrouwbaarheid garanderen in productieomgeving"],solutions:["Geleidelijke AI-adoptie geïmplementeerd met menselijk toezicht","Transfer learning en synthetische datageneratie gebruikt","Robuuste monitoring en fallback-systemen gebouwd"],impact:["Handmatige verwerkingstijd met 70% verminderd","Kwaliteitsvoorspellingsnauwkeurigheid verbeterd naar 92%","$200K+ jaarlijkse kostenbesparingen gegenereerd"]},{id:"headless-ecommerce",title:"Headless E-Commerce Platform",description:"Modern commerceplatform gebouwd op MedusaJS met Next.js-storefront. Headless architectuur geïmplementeerd voor flexibel contentbeheer, Stripe-betalingen en verzendworkflows geïntegreerd, en abonnementbeheersysteem gebouwd.",longDescription:`Een modern headless e-commerceplatform gebouwd op MedusaJS, dat flexibele en schaalbare commerce-infrastructuur biedt. De architectuur scheidt de backend commerce-engine van de frontend-storefront, wat omnichannel-ervaringen en snelle iteratie op klantgerichte applicaties mogelijk maakt.

Het platform beschikt over een Next.js-storefront met server-side rendering voor optimale SEO, ge\xefntegreerde betalingsverwerking via Stripe, geautomatiseerde verzendberekeningen en uitgebreid orderbeheer. Gebouwd met TypeScript voor type-veiligheid en Algolia voor snelle productzoekopdrachten en filtering. Het systeem ondersteunt multi-valuta, voorraadbeheer en klantaccountfuncties.`,image:"https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=1200&h=600&fit=crop",technologies:["MedusaJS","Next.js","TypeScript","Stripe","PostgreSQL","Algolia","Tailwind CSS"],liveUrl:null,githubUrl:null,featured:!0,category:"product",year:"2024",showOnCV:!0,achievements:["Headless commerce-architectuur gebouwd","Betalingsverwerking en verzending geïntegreerd","Abonnementbeheersysteem geïmplementeerd"],challenges:["Flexibel headless commerce-systeem architecteren","Complexe productvarianten en voorraad beheren","Betalingsveiligheid en PCI-compliance garanderen"],solutions:["Modulaire architectuur van MedusaJS gebruikt voor uitbreidbaarheid","Aangepast voorraadbeheer gebouwd met realtime synchronisatie","Stripe geïmplementeerd voor veilige betalingsverwerking"],impact:["Maandelijks 1.000+ bestellingen verwerken","Meerdere verkoopkanalen ondersteunen","99,9% uptime voor betalingsverwerking"]},{id:"allyscan",title:"AllyScan",description:"AI-aangedreven toegankelijkheidsscanner die websites analyseert op WCAG-naleving en bruikbare aanbevelingen geeft voor verbetering.",longDescription:`AllyScan is een uitgebreid AI-aangedreven toegankelijkheidstestplatform dat organisaties helpt ervoor te zorgen dat hun digitale producten toegankelijk zijn voor iedereen. Met behulp van geavanceerde machine learning-algoritmen scant AllyScan automatisch websites en webapplicaties om WCAG 2.1-nalevingsproblemen te identificeren en biedt gedetailleerde, bruikbare aanbevelingen voor herstel.

Het platform beschikt over realtime scannen, geautomatiseerde testworkflows en intelligente rapportage die problemen prioriteert op basis van ernst en impact. AllyScan integreert naadloos in CI/CD-pipelines, waardoor ontwikkelteams toegankelijkheidsproblemen vroeg in het ontwikkelingsproces kunnen opsporen.`,image:"https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=1200&h=600&fit=crop",technologies:["Next.js","Python","AI/ML","WCAG","TypeScript","FastAPI","PostgreSQL"],liveUrl:"https://allyscan.com",githubUrl:"https://github.com/leroysteding/allyscan",featured:!0,category:"product",year:"2024",challenges:["Bouwen van nauwkeurige AI-modellen voor complexe toegankelijkheidsregeldetectie","Efficiënt verwerken en analyseren van grootschalige webapplicaties","Intuïtieve visualisaties creëren voor technische toegankelijkheidsgegevens"],solutions:["Aangepaste ML-modellen ontwikkeld, getraind op WCAG-richtlijnen en praktijkvoorbeelden","Parallelle verwerkingsarchitectuur geïmplementeerd voor snel scannen","Interactieve UI gemaakt met duidelijke prioritering en herstelhandleidingen"],impact:["50+ organisaties geholpen om WCAG 2.1 AA-naleving te bereiken","Toegankelijkheidstesttijd met 80% verminderd","Meer dan 10.000 toegankelijkheidsproblemen geïdentificeerd en opgelost"]},{id:"smart-shop-scraper",title:"Smart Shop Scraper",description:"Intelligent e-commerce data-extractieplatform met geautomatiseerde productmonitoring, prijsvolgen en concurrentieanalyse.",longDescription:`Smart Shop Scraper is een intelligent webscrapingplatform ontworpen voor e-commercebedrijven om concurrenten te monitoren, prijzen te volgen en markttrends te analyseren. Gebouwd met Python en Playwright voor robuuste browserautomatisering, kan het platform productgegevens extraheren uit zelfs de meest complexe moderne webapplicaties.

Het systeem beschikt over intelligente snelheidsbeperking, roterende proxies en geavanceerde anti-detectiemechanismen om betrouwbare gegevensverzameling te garanderen. Met FastAPI-backend en PostgreSQL-database biedt het realtime waarschuwingen, historische trendanalyse en aanpasbare dashboards voor business intelligence.`,image:"https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=1200&h=600&fit=crop",technologies:["Python","Playwright","FastAPI","PostgreSQL","Redis","Docker"],liveUrl:"https://shopscraper.com",githubUrl:"https://github.com/leroysteding/shop-scraper",featured:!0,category:"product",year:"2024",challenges:["Omgaan met moderne JavaScript-zware e-commercesites","Detectie en snelheidsbeperking vermijden","Grote hoeveelheden productgegevens verwerken en opslaan"],solutions:["Playwright gebruikt voor volledige JavaScript-rendering en interactie","Intelligente proxy-rotatie en verzoekregeling geïmplementeerd","Schaalbare datapijplijn gebouwd met Redis-wachtrij en batchverwerking"],impact:["Dagelijks 1M+ producten verwerken op 500+ e-commercesites","Detailhandelaren helpen prijsstrategieën te optimaliseren","Realtime concurrentie-intelligentie bieden"]},{id:"intelliwealth",title:"IntelliWealth",description:"AI-gedreven financiële planningsplatform dat gepersonaliseerde beleggingsaanbevelingen en portefeuilleoptimalisatie biedt.",longDescription:`IntelliWealth is een AI-aangedreven financieel planningsplatform dat de toegang tot geavanceerd beleggingsadvies democratiseert. Met behulp van geavanceerde machine learning-algoritmen analyseert het platform de financi\xeble situatie, risicotolerantie en doelen van gebruikers om gepersonaliseerde beleggingsaanbevelingen en portefeuilleoptimalisatiestrategie\xebn te bieden.

Gebouwd met Next.js en Supabase, beschikt IntelliWealth over realtime marktdata-integratie, geautomatiseerde portefeuilleherschikking en AI-agents die voortdurend aanbevelingen monitoren en aanpassen op basis van marktomstandigheden en gebruikersvoorkeuren. Het platform integreert met Stripe voor naadloos abonnementsbeheer.`,image:"https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&h=600&fit=crop",technologies:["Next.js","Supabase","AI Agents","Stripe","TypeScript","Financial APIs"],liveUrl:"https://intelliwealth.com",githubUrl:"https://github.com/leroysteding/intelliwealth",featured:!0,category:"product",year:"2023",challenges:["Realtime financiële marktdata integreren","Vertrouwen en veiligheid opbouwen voor financiële gegevens","AI-modellen creëren die aansluiten bij regelgevende compliance"],solutions:["Meerdere financiële data-API's geïntegreerd met fallback-mechanismen","Encryptie en beveiligingsmaatregelen op bankniveau geïmplementeerd","AI-aanbevelingssysteem ontworpen met compliance-beschermingsmechanismen"],impact:["2.000+ actieve gebruikers bedienen met gepersonaliseerd financieel advies","$5M+ beheerd aan bijgehouden portefeuillewaarde","Gemiddelde portefeuilleprestatieverbetering van 12%"]},{id:"lotto-manager",title:"Lotto Manager",description:"Loterijsyndicaatbeheersysteem met geautomatiseerde lotvolging, prijzendistributie en ledenbeheer.",longDescription:`Lotto Manager is een uitgebreid platform voor loterijsyndicaatbeheer dat groepsloterijspel vereenvoudigt. Het systeem automatiseert lotvolging, berekeningen voor prijzendistributie en ledenbeheer, waardoor het voor groepen gemakkelijk wordt om samen te spelen met eerlijke en transparante prijzendeling.

Gebouwd met Next.js en TypeScript, beschikt het platform over Stripe-integratie voor het innen van ledenbijdragen, geautomatiseerde prijsberekeningsalgoritmen en gedetailleerde rapportage. Het systeem ondersteunt meerdere loterijtypen en valuta's, met realtime meldingen voor winsten en trekkingen.`,image:"https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=1200&h=600&fit=crop",technologies:["Next.js","TypeScript","Supabase","Stripe","Automated Calculations"],liveUrl:"https://lottomanager.com",githubUrl:null,featured:!1,category:"product",year:"2023",challenges:["Nauwkeurige en eerlijke prijsverdelingsberekeningen garanderen","Vertrouwen en transparantie beheren in financiële transacties","Verschillende loterijformaten en regels afhandelen"],solutions:["Controleerbare berekeningsengine ontwikkeld met gedetailleerde logging","Transparante transactiegeschiedenis en rapportage geïmplementeerd","Flexibele regelengine gemaakt die meerdere loterijtypen ondersteunt"],impact:["50+ actieve loterijsyndicaten beheren","€100K+ aan ledenbijdragen jaarlijks verwerken","€25K+ aan prijzen eerlijk en transparant uitbetaald"]},{id:"ai-mood-journal",title:"AI Stemming Dagboek",description:"Persoonlijke wellness-app met AI-aangedreven stemmingsanalyse, inzichten en mentale gezondheidsvolging met privacy-first ontwerp.",longDescription:`AI Stemming Dagboek is een privacy-first mentale wellness-applicatie die gebruikers helpt hun emotionele welzijn bij te houden via AI-aangedreven analyse. Gebouwd met React Native voor cross-platform mobiele ondersteuning, biedt de app gepersonaliseerde inzichten in stemmingspatronen, triggers en mentale gezondheidstrends.

Het platform gebruikt on-device AI-verwerking om gebruikersprivacy te garanderen en tegelijkertijd geavanceerde analyse te bieden. Integratie met Supabase maakt veilige cloudback-up mogelijk terwijl end-to-end-encryptie wordt gehandhaafd. De app beschikt over dagelijkse prompts, stemmingsvisualisatie en evidence-based wellness-aanbevelingen.`,image:"https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=1200&h=600&fit=crop",technologies:["React Native","AI/ML","Supabase","TypeScript","Privacy-First Architecture"],liveUrl:"https://moodjournal.app",githubUrl:"https://github.com/leroysteding/mood-journal",featured:!1,category:"product",year:"2023",challenges:["AI-inzichten balanceren met gebruikersprivacy","Boeiende dagelijkse gewoontevorming creëren","Nauwkeurige mentale gezondheidsinzichten bieden zonder medische diagnose"],solutions:["On-device AI-verwerking geïmplementeerd met optionele cloudanalyse","Gamificatie en zacht notificatiesysteem ontworpen","Educatieve inhoud gemaakt met professionele mentale gezondheidsbegeleiding"],impact:["5.000+ gebruikers ondersteunen bij het volgen van mentale wellness","Gemiddelde gebruikersbetrokkenheid van 4,5 dagen per week","Positieve gebruikersfeedback over stemmingspatroonbewustzijn"]},{id:"surf-platform",title:"SURF Whitelabel Platform",description:"Enterprise whitelabel platform met ondersteuning voor meerdere Next.js-applicaties in Turborepo monorepo. Gedeelde UI-componentenbibliotheek met Tailwind CSS, TypeScript en Storybook voor Edusources en MBOdata.",longDescription:`Het SURF Whitelabel Platform is een educatief resourcebeheersysteem op enterprise-niveau dat meerdere merken bedient, waaronder Edusources en MBOdata. Gebouwd als een moderne Turborepo monorepo, stelt het platform snelle ontwikkeling en implementatie van meerdere Next.js-applicaties mogelijk, terwijl consistentie wordt gehandhaafd via gedeelde componentenbibliotheken.

De architectuur beschikt over een uitgebreid ontwerpsysteem gebouwd met Tailwind CSS en TypeScript, gedocumenteerd en getest in Storybook. Het platform implementeert herbruikbare API-clients, state management-oplossingen en een robuuste CI/CD-pijplijn in GitLab die betrouwbare implementaties garandeert in ontwikkel-, staging- en productieomgevingen.

Belangrijkste functies zijn multi-brand theming, WCAG-toegankelijkheidsnaleving, prestatie-optimalisatie en schaalbare architectuur die duizenden gelijktijdige gebruikers ondersteunt.`,image:"https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=600&fit=crop",technologies:["Next.js","Turborepo","TypeScript","Tailwind CSS","Storybook","GitLab CI/CD","WCAG"],liveUrl:"https://edusources.nl",githubUrl:null,featured:!0,category:"client",year:"2025",challenges:["Meerdere merken beheren met gedeelde codebase","Toegankelijkheidsnaleving garanderen voor alle applicaties","Releases coördineren tussen meerdere teams"],solutions:["Uitgebreid ontwerpsysteem gebouwd met multi-brand theming","WCAG-testing geïmplementeerd in CI/CD-pijplijn","Geautomatiseerde release-workflows gemaakt met GitLab"],impact:["50.000+ educatieve bronnen bedienen","Meerdere onderwijsinstellingen ondersteunen","Ontwikkeltijd met 40% verminderd door code-deling"]},{id:"quote-tool",title:"Offertetool met 3D-bestandsparsing",description:"Geavanceerd offerteringssysteem met 3D-bestandsparsingmogelijkheden en geautomatiseerde plaatwerkcalculaties voor productiekostenschatting.",longDescription:`Een geavanceerd productieofferteringssysteem dat het offerteproces voor plaatbewerking revolutioneert. Het platform beschikt over geavanceerde 3D CAD-bestandsparsingmogelijkheden die automatisch afmetingen, materialen en complexiteitsmetrieken extraheren uit STEP, STL en andere 3D-formaten.

Gebouwd met Next.js-frontend en Python-backend, gebruikt het systeem Three.js voor 3D-visualisatie en aangepaste algoritmen voor het berekenen van productiekosten, inclusief materiaal, arbeid, insteltijd en machinegebruik. Het platform integreert met bestaande ERP-systemen en biedt directe, nauwkeurige offertes die voorheen uren handmatige berekening kostten.`,image:"https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&h=600&fit=crop",technologies:["Next.js","Three.js","Python","CAD Parser","TypeScript","FastAPI"],liveUrl:null,githubUrl:null,featured:!0,category:"client",year:"2024",challenges:["Complexe 3D CAD-bestandsformaten parseren en interpreteren","Nauwkeurige productiekosten berekenen uit 3D-modellen","Realtime visualisatie bieden van geparseerde onderdelen"],solutions:["Aangepaste CAD-parsing-engine ontwikkeld die meerdere formaten ondersteunt","Berekeningsalgoritmen gebouwd op basis van best practices in productie","Three.js geïntegreerd voor interactieve 3D-visualisatie"],impact:["Offertegenereringstijd verminderd van 2 uur naar 2 minuten","Offertenauwkeurigheid verbeterd met 95%","Maandelijks 500+ offertes verwerken"]},{id:"ai-solutions-devries",title:"AI Solutions Architect - De Vries Surface Technologies",description:"Uitgebreide AI-oplossingsarchitectuur voor De Vries Surface Technologies, met implementatie van intelligente procesautomatisering en data-analyse.",longDescription:`Een uitgebreid AI-transformatieproject voor De Vries Surface Technologies, met implementatie van intelligente procesautomatisering over meerdere bedrijfsworkflows. De oplossingsarchitectuur omvat geautomatiseerde documentverwerking, voorspellend onderhoudsplanning, kwaliteitscontroleautomatisering en business intelligence-dashboards.

Gebouwd op Azure cloud-infrastructuur met Python-gebaseerde microservices en FastAPI-endpoints, integreert het systeem met bestaande productiesystemen terwijl het nieuwe AI-aangedreven mogelijkheden biedt. Het platform omvat aangepaste machine learning-modellen voor kwaliteitsvoorspelling, geautomatiseerde rapportage en realtime analyse.`,image:"https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1200&h=600&fit=crop",technologies:["AI/ML","Azure","Python","FastAPI","Analytics","Power BI"],liveUrl:null,githubUrl:null,featured:!0,category:"client",year:"2024",challenges:["AI integreren in bestaande productieprocessen","Modellen trainen met beperkte historische gegevens","Systeembetrouwbaarheid garanderen in productieomgeving"],solutions:["Geleidelijke AI-adoptie geïmplementeerd met menselijk toezicht","Transfer learning en synthetische datageneratie gebruikt","Robuuste monitoring en fallback-systemen gebouwd"],impact:["Handmatige verwerkingstijd met 70% verminderd","Kwaliteitsvoorspellingsnauwkeurigheid verbeterd naar 92%","$200K+ jaarlijkse kostenbesparingen gegenereerd"]},{id:"vodafoneziggo-app",title:"VodafoneZiggo Mobiele App",description:"Hoogpresterende cross-platform mobiele applicatie met React Native en Expo. Schaalbaar ontwerpsysteem met Storybook, WCAG-toegankelijkheidsnaleving en enterprise-grade testing.",longDescription:`Enterprise mobiele applicatie voor VodafoneZiggo die miljoenen klanten bedient. Gebouwd met React Native en Expo, biedt de app een naadloze cross-platform ervaring voor accountbeheer, servicemonitoring en klantenondersteuning.

Het project beschikt over een uitgebreid ontwerpsysteem gebouwd in Storybook, dat consistentie garandeert op iOS- en Android-platforms. WCAG-toegankelijkheidsstandaarden ge\xefmplementeerd, met uitgebreide testing met Jest en enterprise-grade code-kwaliteitsmonitoring via SonarQube. De app bevat realtime servicestatus, factuurbeheer en gepersonaliseerde aanbevelingen.`,image:"https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=1200&h=600&fit=crop",technologies:["React Native","Expo","TypeScript","Storybook","Jest","WCAG","SonarQube"],liveUrl:null,githubUrl:null,featured:!1,category:"client",year:"2024-2025",challenges:["Prestaties behouden met complexe functies","Toegankelijkheid garanderen in mobiele context","Miljoenen gebruikers ondersteunen met hoge betrouwbaarheid"],solutions:["Prestatie-optimalisatie en lazy loading geïmplementeerd","Uitgebreide toegankelijkheidstestsuite gebouwd","Robuuste foutafhandeling en monitoring gecreëerd"],impact:["3M+ actieve gebruikers bedienen","99,9% uptime bereikt","4,5+ sterren beoordeling in app stores"]},{id:"robidus-platform",title:"Robidus WGA & Ziektewet Platform",description:"Geavanceerd applicatieplatform met integratie van diverse datastromen voor WGA- en Ziektewetbegeleiding. Gebouwd met Next.js en TypeScript met CI/CD-automatisering via Jenkins.",longDescription:`Een geavanceerd platform voor socialezekerheidsgevallenbeheer, met integratie van meerdere datastromen voor WGA (re-integratie) en Ziektewet-begeleiding. Het platform bedient medewerkers en beheerders bij het beheren van complexe socialezekerheidsgevallen.

Gebouwd met Next.js en TypeScript, beschikt het systeem over realtime gegevenssynchronisatie, geautomatiseerd workflowbeheer en uitgebreide rapportage. Jenkins CI/CD-pijplijn garandeert betrouwbare implementaties en snelle iteratie. Het platform verwerkt gevoelige persoonsgegevens met beveiliging op bankniveau en volledige AVG-naleving.`,image:"https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&h=600&fit=crop",technologies:["Next.js","TypeScript","Jenkins","CI/CD","React","Security"],liveUrl:null,githubUrl:null,featured:!1,category:"client",year:"2021",challenges:["Gevoelige persoonlijke en medische gegevens beheren","Meerdere overheidsdatabronnen integreren","AVG-naleving en beveiliging garanderen"],solutions:["End-to-end-encryptie en toegangscontroles geïmplementeerd","Robuuste API-integratielaag gebouwd met foutafhandeling","Uitgebreide auditlogging en compliance-rapportage gecreëerd"],impact:["Jaarlijks 10.000+ gevallen verwerken","Verwerkingstijd van gevallen met 50% verminderd","100% AVG-naleving gehandhaafd"]},{id:"timber-ecommerce",title:"Hout & Bouwmaterialen E-Commerce",description:"SAP Hybris e-commerceplatform met geïntegreerde frontend- en backendsystemen. Full-stack ontwikkeling met Java, SAP-integratie en moderne webtechnologieën.",longDescription:`Enterprise e-commerceplatform voor Timber and Building Supplies Holland N.V., gebouwd op SAP Hybris Commerce. Het project omvatte full-stack ontwikkeling met diepe integratie tussen frontend-gebruikerservaring en backend SAP-systemen.

Moderne webfrontend ontwikkeld met integratie met SAP ERP voor realtime voorraad, prijzen en orderbeheer. Het platform ondersteunt B2B- en B2C-verkoopkanalen met complexe prijsregels, aangepaste catalogi en multi-warehouse voorraadbeheer. Aangepaste extensies ge\xefmplementeerd voor de bouwmaterialensector, inclusief bulkbestellingen, projectbeheer en leveringsplanning.`,image:"https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&h=600&fit=crop",technologies:["SAP Hybris","Java","JavaScript","E-Commerce","SAP Integration","Spring"],liveUrl:null,githubUrl:null,featured:!1,category:"client",year:"2019-2020",challenges:["Complexe SAP-backend integreren met moderne frontend","Gespecialiseerde B2B e-commercevereisten afhandelen","Grote productcatalogi en voorraad beheren"],solutions:["Aangepaste Hybris-extensies gebouwd voor branchespecifieke functies","Efficiënte caching en gegevenssynchronisatie geïmplementeerd","Intuïtieve UX gecreëerd voor complexe B2B-workflows"],impact:["50.000+ product-SKU's beheren","€5M+ aan jaarlijkse online verkopen verwerken","1.000+ B2B-klanten bedienen"]}];function h(a){return"nl"===a?g:f.projects}function i(a,b){return h(b).find(b=>b.id===a)}function j(a,b){return("nl"===b?e:d.experiences).find(b=>b.id===a)}function k(a){return"nl"===a?c:b}a.s(["getBlogPosts",()=>k,"getExperienceById",()=>j,"getProjectById",()=>i,"getProjects",()=>h],711810)}];

//# debugId=60489196-77be-8959-8bf3-f06d4bcace87
//# sourceMappingURL=apps_portfolio_utils_getLocalizedData_ts_d8e35e88._.js.map