import { CVData } from "./cv";
import { experiences } from "./experiences";

export const cvDataNL: CVData = {
  personalInfo: {
    name: "Leroy Steding",
    title: "Senior Full-Stack Developer & AI Automation Architect",
    email: "leroysteding@gmail.com",
    location: "Zaandam, Nederland",
    linkedin: "linkedin.com/in/leroysteding",
    github: "github.com/leroysteding",
    website: "leroysteding.nl"
  },
  
  summary: `Zeer bekwame Senior Full-Stack Developer en AI Automation Architect met 12+ jaar progressieve ervaring in het bouwen van enterprise-scale webplatformen, mobiele applicaties en intelligente automatiseringsoplossingen. Diepgaande expertise in het moderne JavaScript-ecosysteem (React 19, Next.js 16, TypeScript 5.x) met bewezen vermogen om complexe systemen te architectureren en te leveren die miljoenen gebruikers bedienen. Gespecialiseerd in AI-integratie (OpenAI, LangChain), microservices-architectuur en headless commerce-platforms. Bewezen staat van dienst in het leiden van cross-functionele teams, het mentoren van junior developers en het stimuleren van technische innovatie die meetbare bedrijfswaarde oplevert. Expert in full-stack ontwikkeling (Node.js, Python, Java), cloud-infrastructuur (AWS, Azure, Vercel) en moderne DevOps-praktijken (Docker, Kubernetes, CI/CD). Gepassioneerd over webtoegang

elijkheid (WCAG 2.1 AA/AAA), prestatie-optimalisatie en het creëren van uitzonderlijke gebruikerservaringen door schone, onderhoudbare code. Bedreven in het vertalen van complexe bedrijfsvereisten naar schaalbare technische oplossingen met focus op codekwaliteit, beveiliging en best practices.`,
  
  skills: [
    {
      category: "Frontend Ontwikkeling",
      items: [
        "React 19 (Hooks, Context API, Server Components)", "Next.js 16 (App Router, Server Actions, Middleware)",
        "TypeScript 5.x", "JavaScript (ES6+, ES2023)", "Vue.js 3 (Composition API)", "Angular 14+",
        "HTML5 (Semantische Markup, Toegankelijkheid)", "CSS3 (Grid, Flexbox, Custom Properties)",
        "Tailwind CSS v4", "SASS/SCSS (Modules, Mixins)", "Styled Components", "CSS-in-JS",
        "Responsive Design (Mobile-First)", "Progressive Web Apps (PWA, Service Workers)",
        "Web Toegankelijkheid (WCAG 2.1 AA/AAA, ARIA)", "SEO Optimalisatie",
        "Storybook 8 (Component Documentatie)", "Framer Motion (Animatie)", "GSAP",
        "React Native", "Expo SDK", "React Query/TanStack Query", "Zustand/Redux Toolkit",
        "Webpack 5", "Vite", "Turbopack", "SWC Compiler", "Babel"
      ]
    },
    {
      category: "Backend Ontwikkeling",
      items: [
        "Node.js 20+ (Express, Fastify, Nest.js)", "Python 3.11+ (Django, Flask)",
        "FastAPI (Async, Pydantic)", "Java 17+ (Spring Boot, Hibernate)",
        "REST APIs (OpenAPI/Swagger)", "GraphQL (Apollo Server, GraphQL Yoga)",
        "Microservices Architectuur (Event-Driven, CQRS)", "Serverless Functions",
        "PostgreSQL (Geavanceerde Queries, Indexes)", "MongoDB (Aggregation, Sharding)",
        "Redis (Caching, Pub/Sub)", "Supabase (Real-time, Auth, Storage)",
        "Prisma ORM", "TypeORM", "Sequelize", "SQLAlchemy",
        "Authenticatie (JWT, OAuth 2.0, SAML)", "Autorisatie (RBAC, ABAC)",
        "API Gateway", "Rate Limiting", "WebSockets", "Server-Sent Events (SSE)"
      ]
    },
    {
      category: "AI & Machine Learning",
      items: [
        "OpenAI API (GPT-4, GPT-4 Turbo, Embeddings)", "Anthropic Claude",
        "LangChain (Chains, Agents, Memory)", "LlamaIndex",
        "AI Agents (ReAct, Function Calling)", "Vector Databases (Pinecone, ChromaDB)",
        "RAG (Retrieval-Augmented Generation)", "Prompt Engineering",
        "Machine Learning Integratie", "TensorFlow.js", "Hugging Face Transformers",
        "n8n Workflow Automatisering", "Zapier", "Make (Integromat)",
        "Playwright Automatisering", "Puppeteer", "Selenium",
        "Proces Optimalisatie", "Data Pipeline Design"
      ]
    },
    {
      category: "DevOps & Infrastructuur",
      items: [
        "Docker (Compose, Multi-stage Builds)", "Kubernetes (Deployments, Services)",
        "Git (Geavanceerde Workflows, Rebasing)", "GitHub Actions", "GitLab CI/CD",
        "Jenkins", "CircleCI", "Azure DevOps Pipelines",
        "Vercel (Edge Functions, Analytics)", "Netlify", "Azure (App Service, Functions, DevOps)",
        "AWS (EC2, S3, Lambda, CloudFront, RDS)", "Google Cloud Platform",
        "Turborepo (Monorepo Management)", "pnpm", "npm", "Yarn", "Lerna",
        "Nginx", "Apache", "Load Balancing", "CDN Configuratie",
        "Monitoring (Sentry, DataDog, New Relic)", "Logging (ELK Stack)",
        "Infrastructure as Code (Terraform, Pulumi)"
      ]
    },
    {
      category: "Testing & Kwaliteitscontrole",
      items: [
        "Jest (Unit, Integration Testing)", "React Testing Library", "Vitest",
        "Playwright (E2E Testing)", "Cypress", "Puppeteer",
        "Storybook (Visual Testing)", "Chromatic",
        "ESLint (Custom Rules)", "Prettier", "Husky (Git Hooks)",
        "SonarQube (Code Quality)", "TypeScript Compiler (Strict Mode)",
        "Test-Driven Development (TDD)", "Behavior-Driven Development (BDD)",
        "Code Coverage (Istanbul, c8)", "Performance Testing (Lighthouse, WebPageTest)",
        "Toegankelijkheids Testing (axe, Pa11y)", "Security Testing (OWASP, Snyk)"
      ]
    },
    {
      category: "E-Commerce & CMS",
      items: [
        "MedusaJS (Headless Commerce)", "Shopify (Liquid, Storefront API)",
        "WooCommerce", "Magento", "SAP Hybris Commerce",
        "Stripe (Betalingen, Abonnementen, Webhooks)", "PayPal Integratie",
        "Betalingsverwerking (PCI Compliance)", "Multi-valuta Ondersteuning",
        "Multi-tenant Architectuur", "POS Systemen Integratie",
        "Voorraadbeheer", "Order Management Systemen",
        "Sanity CMS", "Contentful", "Strapi", "WordPress (Headless)"
      ]
    },
    {
      category: "Data & Analytics",
      items: [
        "SQL (Complexe Queries, Optimalisatie)", "NoSQL (Document, Key-Value Stores)",
        "Database Design (Normalisatie, Indexing)", "Data Modellering",
        "Google Analytics 4", "Mixpanel", "Segment", "PostHog",
        "A/B Testing (Optimizely, VWO)", "Feature Flags (LaunchDarkly)",
        "Data Visualisatie (Chart.js, D3.js, Recharts)",
        "ETL Pipelines", "Data Warehousing", "Business Intelligence"
      ]
    },
    {
      category: "Methodologieën & Best Practices",
      items: [
        "Agile/Scrum (Daily Standups, Sprints)", "Kanban", "Lean Development",
        "Code Review (Pull Requests, Pair Programming)", "Clean Code Principes",
        "SOLID Principes", "Design Patterns (MVC, Observer, Factory)",
        "API Design Best Practices", "RESTful Architectuur",
        "Microservices Patterns", "Event-Driven Architectuur",
        "Domain-Driven Design (DDD)", "Test-Driven Development (TDD)",
        "Continuous Integration/Deployment (CI/CD)", "GitFlow Workflow",
        "Documentatie (Technisch Schrijven, API Docs)", "Technische Mentoring"
      ]
    },
    {
      category: "Soft Skills & Leiderschap",
      items: [
        "Technisch Leiderschap (Team Lead, Architect)", "Team Mentoring & Coaching",
        "Stakeholder Communicatie & Management", "Klantrelaties",
        "Probleemoplossing & Kritisch Denken", "Projectmanagement",
        "Code Review & Kwaliteitscontrole", "Kennisdeling",
        "Agile Methodologieën (Scrum Master)", "Cross-functionele Samenwerking",
        "Presentatievaardigheden", "Technisch Schrijven & Documentatie",
        "Conflictoplossing", "Tijdmanagement", "Prioriteiten Stellen"
      ]
    }
  ],
  
  experience: experiences.slice(0, 7).map(exp => ({
    title: exp.title,
    company: exp.company,
    location: exp.location,
    period: exp.period,
    description: exp.description,
    achievements: exp.achievements || exp.highlights || [],
    technologies: exp.technologies
  })),
  
  projects: [
    {
      name: "SURF Whitelabel Platform (Edusources & MBOdata)",
      description: "Enterprise-grade whitelabel platform architectuur die meerdere Next.js 14 applicaties ondersteunt binnen een Turborepo monorepo. Ontworpen en geïmplementeerd een uitgebreide gedeelde UI component bibliotheek met 80+ herbruikbare componenten, die meer dan 50.000 educatieve bronnen bedient aan studenten en docenten in heel Nederland. Schaalbare infrastructuur gebouwd met geautomatiseerde deployments, uitgebreide testsuite en volledige WCAG 2.1 AA toegankelijkheidscompliance. Multi-tenant systeem gearchitectureerd dat meerdere onderwijsinstellingen ondersteunt met aanpasbare branding en theming.",
      technologies: ["Next.js 14", "Turborepo", "TypeScript", "React 18", "Tailwind CSS", "Storybook 8", "GitLab CI/CD", "Docker", "PostgreSQL", "Elasticsearch", "Redis"],
      achievements: [
        "Ontwikkeltijd verminderd met 40% door uitgebreide gedeelde component bibliotheek en design systeem",
        "100% WCAG 2.1 AA compliance bereikt met geautomatiseerde toegankelijkheidstesting via axe-core en Pa11y",
        "GitLab CI/CD pipelines geïmplementeerd met geautomatiseerde testing, linting en deployment, deployment tijd verminderd met 60%",
        "Storybook documentatie gebouwd met 150+ component stories, teamsamenwerking en ontwikkelsnelheid verbeterd",
        "Bundle size geoptimaliseerd met 35% door code splitting en lazy loading strategieën",
        "TypeScript strict mode geïmplementeerd in hele monorepo, type veiligheid gewaarborgd en runtime errors verminderd met 45%"
      ]
    },
    {
      name: "Quote Tool met Geavanceerde 3D CAD Bestandsparsing",
      description: "Geavanceerd productie-offertes systeem met realtime 3D CAD bestandsanalyse en geautomatiseerde kostenberekening voor plaatwerk fabricage. Three.js geïntegreerd voor 3D visualisatie en Python-gebaseerde CAD parser voor het extraheren van fabricage specificaties uit STEP, STL en DXF bestanden. Intelligente pricing engine gebouwd rekening houdend met materiaalkosten, fabricage complexiteit, arbeidsuren en machine tijd. FastAPI backend geïmplementeerd met async processing voor het verwerken van grote CAD bestanden tot 500MB. Intuïtieve UI gecreëerd voor het beoordelen van geparseerde specificaties, aanpassen van parameters en genereren van gedetailleerde offerte PDF's.",
      technologies: ["Next.js 15", "Three.js", "Python 3.11", "FastAPI", "CAD Parser", "PostgreSQL", "Redis", "AWS S3", "Docker", "React Three Fiber", "TypeScript"],
      achievements: [
        "Offerte generatie tijd verminderd van 2+ uur handmatige berekening naar onder 2 minuten met 98% nauwkeurigheid",
        "Offerte nauwkeurigheid verbeterd met 95% door geautomatiseerde CAD parsing, menselijke meetfouten geëlimineerd",
        "500+ offertes per maand verwerkt met gemiddelde bestandsgrootte van 50MB, complexe multi-part assemblies verwerkt",
        "3-seconden laadtijd bereikt voor 3D visualisatie van bestanden tot 100MB door geoptimaliseerde rendering pipeline",
        "Geautomatiseerde PDF rapport generatie gebouwd inclusief technische tekeningen, materiaal specificaties en kostenopstelling",
        "Realtime samenwerkingsfuncties geïmplementeerd waarmee meerdere teamleden gelijktijdig offertes kunnen beoordelen en aanpassen"
      ]
    },
    {
      name: "AI Oplossingen Architectuur - De Vries Surface Technologies",
      description: "Leidde uitgebreide digitale transformatie-initiatief met implementatie van AI-powered automatisering in productie, kwaliteitscontrole en bedrijfsoperaties. Intelligente documentverwerkingssysteem gearchitectureerd met OpenAI GPT-4 voor het extraheren van gestructureerde data uit technische specificaties en kwaliteitsrapporten. Predictive analytics platform gebouwd voor oppervlaktebehandeling kwaliteitsvoorspelling met machine learning modellen getraind op historische data. Geautomatiseerde workflow orchestratie ontwikkeld met n8n die ERP, CRM en productiesystemen verbindt. Power BI dashboards gecreëerd met realtime inzichten in productie-efficiëntie, kwaliteitsmetrics en kostenoptimalisatie mogelijkheden.",
      technologies: ["OpenAI API (GPT-4)", "LangChain", "Azure AI Services", "Python", "FastAPI", "n8n", "Power BI", "Azure DevOps", "PostgreSQL", "Docker", "Redis", "TensorFlow"],
      achievements: [
        "Handmatige documentverwerking tijd verminderd met 70%, automatisering van data-extractie uit 1000+ technische documenten per maand",
        "Kwaliteitsvoorspelling nauwkeurigheid verbeterd naar 92% door ML modellen, defecten voorkomen en afval verminderd met 25%",
        "€200K+ jaarlijkse kostenbesparing gegenereerd door geoptimaliseerde resource allocatie en verminderd herwerk",
        "15 kritieke bedrijfsworkflows geautomatiseerd, administratieve overhead verminderd met 45 uur per week",
        "Realtime monitoring dashboard gebouwd dat 50+ KPI's volgt, bruikbare inzichten aan management biedt",
        "AI-powered klantenservice chatbot geïmplementeerd die 80% van routine vragen afhandelt, responstijd verminderd met 60%"
      ]
    },
    {
      name: "VodafoneZiggo Mobiele Applicatie",
      description: "Enterprise-scale cross-platform mobiele applicatie die 3M+ actieve gebruikers bedient met uitgebreid accountbeheer, realtime gebruik tracking en self-service mogelijkheden. Schaalbare React Native oplossing gearchitectureerd met Expo, offline-first architectuur geïmplementeerd voor naadloze gebruikerservaring. Uitgebreid design systeem gebouwd met 100+ componenten gedocumenteerd in Storybook, snelle feature ontwikkeling mogelijk gemaakt. Geavanceerd state management geïmplementeerd met Redux Toolkit en RTK Query voor efficiënte data fetching en caching. Push notificaties, deep linking en biometrische authenticatie geïntegreerd. 90%+ test coverage vastgesteld met Jest en React Native Testing Library.",
      technologies: ["React Native", "Expo SDK 50", "TypeScript", "Redux Toolkit", "RTK Query", "Storybook", "Jest", "React Native Testing Library", "Firebase", "GraphQL", "Apollo Client"],
      achievements: [
        "4.7-sterren beoordeling bereikt op App Store en 4.5 op Google Play met 500K+ reviews en 99.9% uptime SLA",
        "90%+ test coverage behouden voor 200+ componenten met uitgebreide unit en integration tests",
        "Schaalbaar design systeem gebouwd met Storybook met 100+ gedocumenteerde componenten, ontwikkeltijd verminderd met 50%",
        "App performance geoptimaliseerd, initiële laadtijd verminderd met 60% en Time to Interactive verbeterd naar onder 2 seconden",
        "Offline-first architectuur geïmplementeerd met intelligente sync, naadloze ervaring op slechte verbindingen gewaarborgd",
        "Crash rate verminderd naar <0.1% door uitgebreide error handling en monitoring met Sentry"
      ]
    },
    {
      name: "AllyScan - AI-Powered Toegankelijkheidsscanner & Compliance Platform",
      description: "Uitgebreid SaaS platform voor geautomatiseerde webtoegang elijksheidstesting en WCAG compliance management. Intelligente scanning engine gebouwd met Playwright voor cross-browser testing en machine learning modellen voor het identificeren van toegankelijkheidsproblemen buiten regel-gebaseerde detectie. Chrome extensie ontwikkeld voor realtime toegankelijkheidsaudit tijdens ontwikkeling. Gedetailleerd rapportage dashboard gecreëerd met geprioritiseerde hersteladvies, code voorbeelden en compliance tracking. Multi-tenant architectuur geïmplementeerd die enterprise teams ondersteunt met role-based access control en audit trails. Geïntegreerd met CI/CD pipelines voor geautomatiseerde toegankelijkheidstesting in ontwikkelworkflows.",
      technologies: ["Next.js 15", "Python", "TensorFlow", "Playwright", "PostgreSQL", "Redis", "OpenAI API", "TypeScript", "Prisma", "AWS", "Docker", "Kubernetes"],
      achievements: [
        "Toegankelijkheidstesting tijd verminderd met 80% vergeleken met handmatige audits door geautomatiseerde scanning en intelligente issue detectie",
        "Meer dan 10.000 toegankelijkheidsproblemen geïdentificeerd en geholpen verhelpen bij 50+ enterprise organisaties",
        "30+ organisaties geholpen WCAG 2.1 AA compliance te bereiken met gedetailleerde hersteladvies en code voorbeelden",
        "AI-powered aanbevelingsengine gebouwd die contextbewuste fixes biedt met 95% nauwkeurigheid, ontwikkelaarsproductiviteit verbeterd",
        "100K+ pagina scans per maand verwerkt met gemiddelde scan tijd van 15 seconden per pagina",
        "98% klanttevredenheidsscore bereikt bij enterprise klanten inclusief overheidsinstanties en Fortune 500 bedrijven"
      ]
    },
    {
      name: "Enterprise E-Commerce Platform met MedusaJS",
      description: "Headless commerce platform gebouwd op MedusaJS met aangepaste Next.js storefront die B2B en B2C operaties ondersteunt. Multi-valuta, multi-taal oplossing gearchitectureerd met complexe prijsregels, bulk ordering en quote management. Stripe geïntegreerd voor betalingsverwerking, Shippo voor verzending en Algolia voor product search. Aangepast admin dashboard gebouwd voor voorraadbeheer, order processing en klant analytics. Geavanceerde productcatalogus geïmplementeerd met configureerbare varianten, bundles en abonnementen.",
      technologies: ["MedusaJS", "Next.js 15", "TypeScript", "Stripe", "PostgreSQL", "Redis", "Algolia", "Docker", "AWS", "Tailwind CSS"],
      achievements: [
        "€2M+ in maandelijkse transacties verwerkt met 99.99% uptime en sub-seconde pagina laadtijden",
        "Winkelwagen abandonment verminderd met 35% door geoptimaliseerde checkout flow en realtime verzendberekeningen",
        "Geavanceerde product search geïmplementeerd met Algolia, 1M+ zoekopdrachten per maand verwerkt met <50ms responstijd",
        "Abonnement management systeem gebouwd dat 5.000+ terugkerende klanten ondersteunt met geautomatiseerde facturering",
        "Multi-warehouse voorraad systeem geïntegreerd met realtime voorraad updates voor 3 distributiecentra"
      ]
    }
  ],
  
  education: [
    {
      degree: "Bachelor of Science in Software Engineering",
      institution: "Hogeschool van Amsterdam",
      location: "Amsterdam, Nederland",
      period: "2014 - 2019",
      description: "Focus op software architectuur, webtechnologieën en agile ontwikkelmethodologieën"
    },
    {
      degree: "Applicatieontwikkelaar (MBO Niveau 4)",
      institution: "Regio College",
      location: "Nederland",
      period: "2011 - 2014",
      description: "ICT Applicatieontwikkeling met focus op webontwikkeling en database design"
    }
  ],
  
  certifications: [
    {
      name: "AWS Certified Solutions Architect - Associate",
      issuer: "Amazon Web Services",
      date: "2023"
    },
    {
      name: "Professional Scrum Master I (PSM I)",
      issuer: "Scrum.org",
      date: "2022"
    },
    {
      name: "Next.js & React - The Complete Guide",
      issuer: "Udemy",
      date: "2022"
    },
    {
      name: "TypeScript: The Complete Developer's Guide",
      issuer: "Udemy",
      date: "2021"
    },
    {
      name: "Docker & Kubernetes: The Practical Guide",
      issuer: "Udemy",
      date: "2021"
    },
    {
      name: "Microservices with Node.js and React",
      issuer: "Udemy",
      date: "2020"
    },
    {
      name: "Complete Web Accessibility (WCAG) Training",
      issuer: "Udemy",
      date: "2020"
    },
    {
      name: "GraphQL with React: The Complete Developers Guide",
      issuer: "Udemy",
      date: "2019"
    },
    {
      name: "React Native - The Practical Guide",
      issuer: "Udemy",
      date: "2018"
    },
    {
      name: "Angular 2 and Node.js - The Practical Guide",
      issuer: "Udemy",
      date: "2017"
    },
    {
      name: "Advanced React and Redux",
      issuer: "Udemy",
      date: "2017"
    },
    {
      name: "Modern JavaScript: ES6 and Beyond",
      issuer: "Udemy",
      date: "2016"
    },
    {
      name: "Learn and Understand AngularJS",
      issuer: "Udemy",
      date: "2016"
    },
    {
      name: "Git & GitHub Complete Masterclass",
      issuer: "Udemy",
      date: "2015"
    },
    {
      name: "Arbeidsmarktgekwalificeerd Assistent Applicatieontwikkelaar",
      issuer: "ROC",
      date: "2014"
    },
    {
      name: "Medewerker Beheer ICT",
      issuer: "ROC",
      date: "2013"
    }
  ],
  
  languages: [
    {
      language: "Nederlands",
      proficiency: "Moedertaal"
    },
    {
      language: "Engels",
      proficiency: "Professioneel Werkniveau"
    }
  ]
};
