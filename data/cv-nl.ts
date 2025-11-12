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
  
  experience: experiences.map(exp => ({
    title: exp.title,
    company: exp.company,
    companyLogo: exp.companyLogo,
    location: exp.location,
    period: exp.period,
    description: exp.description,
    achievements: exp.achievements || exp.highlights || [],
    technologies: exp.technologies
  })),
  
  projects: [
    {
      name: "IntelliWealth - AI Financiële Tool",
      description: "Persoonlijk AI-ondersteund financieel beheerplatform met intelligente budgettering en beleggingsinzichten. Conversationele AI interface gebouwd met OpenAI voor natuurlijke financiële vragen en geautomatiseerde uitgavencategorisatie. Realtime portfolio tracking en gepersonaliseerde financiële aanbevelingen geïmplementeerd.",
      technologies: ["Next.js", "OpenAI GPT-4", "Python", "PostgreSQL", "Plaid API", "TypeScript", "Recharts"],
      achievements: [
        "AI-powered financiële assistent gebouwd met natuurlijke taalverwerking",
        "Bankrekening connecties geïntegreerd via Plaid API",
        "Geautomatiseerde uitgavencategorisatie en budgettering geïmplementeerd"
      ]
    },
    {
      name: "AI ATS Recruitment Platform",
      description: "Intelligent applicant tracking systeem voor geautomatiseerde vacature-kandidaat matching. AI-powered cv parsing en semantische job matching gebouwd met vector embeddings. Geautomatiseerde screening workflows en kandidaat ranking geïmplementeerd op basis van functie-eisen en ervaring.",
      technologies: ["Next.js", "OpenAI GPT-4", "LangChain", "Pinecone", "PostgreSQL", "TypeScript", "Python"],
      achievements: [
        "Geautomatiseerde cv parsing en skills extractie",
        "Semantische matching engine gebouwd voor job-kandidaat fit",
        "AI-powered kandidaat screening workflows geïmplementeerd"
      ]
    },
    {
      name: "3D CAD Offerte Tool",
      description: "Productie-offertesysteem met realtime 3D CAD bestand visualisatie en geautomatiseerde kostenberekening. Three.js geïntegreerd voor interactieve 3D rendering en Python-gebaseerde parser voor het extraheren van specificaties uit STEP, STL en DXF bestanden. Intelligente pricing engine en geautomatiseerde PDF offerte generatie gebouwd.",
      technologies: ["Next.js", "Three.js", "Python", "FastAPI", "PostgreSQL", "React Three Fiber", "TypeScript"],
      achievements: [
        "Offerte generatie proces geautomatiseerd met 3D visualisatie",
        "CAD bestand parser gebouwd die meerdere formaten ondersteunt",
        "Geautomatiseerde PDF rapport generatie geïntegreerd"
      ]
    },
    {
      name: "AI-Powered Productieoplossingen",
      description: "Digitale transformatie-initiatief met implementatie van AI automatisering voor productieoperaties. Intelligente documentverwerking gebouwd met OpenAI GPT-4 en geautomatiseerde workflow orchestratie met n8n die ERP en CRM systemen verbindt. Dashboards gecreëerd voor productie monitoring en kwaliteitscontrole.",
      technologies: ["OpenAI GPT-4", "LangChain", "Python", "FastAPI", "n8n", "Power BI", "PostgreSQL"],
      achievements: [
        "Documentverwerking workflows geautomatiseerd",
        "AI-powered kwaliteitsvoorspelling geïntegreerd",
        "Realtime productie monitoring dashboards gebouwd"
      ]
    },
    {
      name: "AllyScan - Toegankelijkheidstest Platform",
      description: "SaaS platform voor geautomatiseerde webtoegang elijksheidstesting en WCAG compliance. Scanning engine gebouwd met Playwright voor cross-browser testing met gedetailleerde rapportage en hersteladvies. Chrome extensie ontwikkeld voor realtime toegankelijkheidsaudit tijdens ontwikkeling.",
      technologies: ["Next.js", "Playwright", "PostgreSQL", "TypeScript", "Prisma", "Docker"],
      achievements: [
        "Toegankelijkheidstesting geautomatiseerd met gedetailleerde rapporten",
        "Chrome extensie gebouwd voor realtime auditing",
        "CI/CD integratie geïmplementeerd voor testworkflows"
      ]
    },
    {
      name: "Headless E-Commerce Platform",
      description: "Modern commerce platform gebouwd op MedusaJS met aangepaste Next.js storefront. Multi-valuta oplossing gearchitectureerd met Stripe betalingsverwerking en Algolia product search. Admin dashboard gebouwd voor voorraad- en orderbeheer met abonnement ondersteuning.",
      technologies: ["MedusaJS", "Next.js", "TypeScript", "Stripe", "PostgreSQL", "Algolia", "Tailwind CSS"],
      achievements: [
        "Headless commerce architectuur gebouwd",
        "Betalingsverwerking en verzending geïntegreerd",
        "Abonnement management systeem geïmplementeerd"
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
