import { experiences } from "./experiences";
import { techStack } from "./techStack";
import { projects } from "./projects";

export interface CVData {
  personalInfo: {
    name: string;
    title: string;
    email: string;
    phone?: string;
    location: string;
    linkedin: string;
    github: string;
    website: string;
  };
  summary: string;
  skills: {
    category: string;
    items: string[];
  }[];
  experience: {
    title: string;
    company: string;
    companyLogo?: string;
    location: string;
    period: string;
    description: string;
    achievements: string[];
    technologies: string[];
  }[];
  projects: {
    name: string;
    description: string;
    technologies: string[];
    achievements: string[];
    url?: string;
  }[];
  education: {
    degree: string;
    institution: string;
    location: string;
    period: string;
    description?: string;
  }[];
  certifications: {
    name: string;
    issuer: string;
    date: string;
  }[];
  languages: {
    language: string;
    proficiency: string;
  }[];
}

export const cvData: CVData = {
  personalInfo: {
    name: "Leroy Steding",
    title: "Senior Full-Stack Developer & AI Automation Architect",
    email: "leroysteding@gmail.com",
    location: "Zaandam, Netherlands",
    linkedin: "linkedin.com/in/leroysteding",
    github: "github.com/leroysteding",
    website: "leroysteding.nl"
  },
  
  summary: `Highly accomplished Senior Full-Stack Developer and AI Automation Architect with 12+ years of progressive experience building enterprise-scale web platforms, mobile applications, and intelligent automation solutions. Deep expertise in modern JavaScript ecosystem (React, Next.js, TypeScript) with proven ability to architect and deliver complex systems serving millions of users. Specialized in AI integration (OpenAI, LangChain), microservices architecture, and headless commerce platforms. Track record of leading cross-functional teams, mentoring junior developers, and driving technical innovation that delivers measurable business value. Expert in full-stack development (Node.js, Python, Java), cloud infrastructure (AWS, Azure, Vercel), and modern DevOps practices (Docker, Kubernetes, CI/CD). Passionate about web accessibility (WCAG 2.1 AA/AAA), performance optimization, and creating exceptional user experiences through clean, maintainable code. Adept at translating complex business requirements into scalable technical solutions while maintaining focus on code quality, security, and best practices.`,
  
  skills: [
    {
      category: "Frontend Development",
      items: [
        "React (Hooks, Context API, Server Components)", "Next.js (App Router, Server Actions, Middleware)",
        "TypeScript", "JavaScript (ES6+)", "Vue.js (Composition API)", "Angular",
        "HTML5 (Semantic Markup, Accessibility)", "CSS3 (Grid, Flexbox, Custom Properties)",
        "Tailwind CSS", "SASS/SCSS (Modules, Mixins)", "Styled Components", "CSS-in-JS",
        "Responsive Design (Mobile-First)", "Progressive Web Apps (PWA, Service Workers)",
        "Web Accessibility (WCAG 2.1 AA/AAA, ARIA)", "SEO Optimization",
        "Storybook (Component Documentation)", "Framer Motion (Animation)", "GSAP",
        "React Native", "Expo SDK", "React Query/TanStack Query", "Zustand/Redux Toolkit",
        "Webpack", "Vite", "Turbopack", "SWC Compiler", "Babel"
      ]
    },
    {
      category: "Backend Development",
      items: [
        "Node.js 20+ (Express, Fastify, Nest.js)", "Python 3.11+ (Django, Flask)",
        "FastAPI (Async, Pydantic)", "Java 17+ (Spring Boot, Hibernate)",
        "REST APIs (OpenAPI/Swagger)", "GraphQL (Apollo Server, GraphQL Yoga)",
        "Microservices Architecture (Event-Driven, CQRS)", "Serverless Functions",
        "PostgreSQL (Advanced Queries, Indexes)", "MongoDB (Aggregation, Sharding)",
        "Redis (Caching, Pub/Sub)", "Supabase (Real-time, Auth, Storage)",
        "Prisma ORM", "TypeORM", "Sequelize", "SQLAlchemy",
        "Authentication (JWT, OAuth 2.0, SAML)", "Authorization (RBAC, ABAC)",
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
        "Machine Learning Integration", "TensorFlow.js", "Hugging Face Transformers",
        "n8n Workflow Automation", "Zapier", "Make (Integromat)",
        "Playwright Automation", "Puppeteer", "Selenium",
        "Process Optimization", "Data Pipeline Design"
      ]
    },
    {
      category: "DevOps & Infrastructure",
      items: [
        "Docker (Compose, Multi-stage Builds)", "Kubernetes (Deployments, Services)",
        "Git (Advanced Workflows, Rebasing)", "GitHub Actions", "GitLab CI/CD",
        "Jenkins", "CircleCI", "Azure DevOps Pipelines",
        "Vercel (Edge Functions, Analytics)", "Netlify", "Azure (App Service, Functions, DevOps)",
        "AWS (EC2, S3, Lambda, CloudFront, RDS)", "Google Cloud Platform",
        "Turborepo (Monorepo Management)", "pnpm", "npm", "Yarn", "Lerna",
        "Nginx", "Apache", "Load Balancing", "CDN Configuration",
        "Monitoring (Sentry, DataDog, New Relic)", "Logging (ELK Stack)",
        "Infrastructure as Code (Terraform, Pulumi)"
      ]
    },
    {
      category: "Testing & Quality Assurance",
      items: [
        "Jest (Unit, Integration Testing)", "React Testing Library", "Vitest",
        "Playwright (E2E Testing)", "Cypress", "Puppeteer",
        "Storybook (Visual Testing)", "Chromatic",
        "ESLint (Custom Rules)", "Prettier", "Husky (Git Hooks)",
        "SonarQube (Code Quality)", "TypeScript Compiler (Strict Mode)",
        "Test-Driven Development (TDD)", "Behavior-Driven Development (BDD)",
        "Code Coverage (Istanbul, c8)", "Performance Testing (Lighthouse, WebPageTest)",
        "Accessibility Testing (axe, Pa11y)", "Security Testing (OWASP, Snyk)"
      ]
    },
    {
      category: "E-Commerce & CMS",
      items: [
        "MedusaJS (Headless Commerce)", "Shopify (Liquid, Storefront API)",
        "WooCommerce", "Magento", "SAP Hybris Commerce",
        "Stripe (Payments, Subscriptions, Webhooks)", "PayPal Integration",
        "Payment Processing (PCI Compliance)", "Multi-currency Support",
        "Multi-tenant Architecture", "POS Systems Integration",
        "Inventory Management", "Order Management Systems",
        "Sanity CMS", "Contentful", "Strapi", "WordPress (Headless)"
      ]
    },
    {
      category: "Data & Analytics",
      items: [
        "SQL (Complex Queries, Optimization)", "NoSQL (Document, Key-Value Stores)",
        "Database Design (Normalization, Indexing)", "Data Modeling",
        "Google Analytics 4", "Mixpanel", "Segment", "PostHog",
        "A/B Testing (Optimizely, VWO)", "Feature Flags (LaunchDarkly)",
        "Data Visualization (Chart.js, D3.js, Recharts)",
        "ETL Pipelines", "Data Warehousing", "Business Intelligence"
      ]
    },
    {
      category: "Methodologies & Best Practices",
      items: [
        "Agile/Scrum (Daily Standups, Sprints)", "Kanban", "Lean Development",
        "Code Review (Pull Requests, Pair Programming)", "Clean Code Principles",
        "SOLID Principles", "Design Patterns (MVC, Observer, Factory)",
        "API Design Best Practices", "RESTful Architecture",
        "Microservices Patterns", "Event-Driven Architecture",
        "Domain-Driven Design (DDD)", "Test-Driven Development (TDD)",
        "Continuous Integration/Deployment (CI/CD)", "GitFlow Workflow",
        "Documentation (Technical Writing, API Docs)", "Technical Mentoring"
      ]
    },
    {
      category: "Soft Skills & Leadership",
      items: [
        "Technical Leadership (Team Lead, Architect)", "Team Mentoring & Coaching",
        "Stakeholder Communication & Management", "Client Relations",
        "Problem Solving & Critical Thinking", "Project Management",
        "Code Review & Quality Assurance", "Knowledge Sharing",
        "Agile Methodologies (Scrum Master)", "Cross-functional Collaboration",
        "Presentation Skills", "Technical Writing & Documentation",
        "Conflict Resolution", "Time Management", "Priority Setting"
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
      name: "IntelliWealth - AI Finance Tool",
      description: "Personal AI-backed financial management platform with intelligent budgeting and investment insights. Built conversational AI interface using OpenAI for natural language financial queries and automated expense categorization. Implemented real-time portfolio tracking and personalized financial recommendations.",
      technologies: ["Next.js", "OpenAI GPT-4", "Python", "PostgreSQL", "Plaid API", "TypeScript", "Recharts"],
      achievements: [
        "Built AI-powered financial assistant with natural language processing",
        "Integrated bank account connections via Plaid API",
        "Implemented automated expense categorization and budgeting"
      ]
    },
    {
      name: "AI ATS Recruitment Platform",
      description: "Intelligent applicant tracking system for automated job-candidate matching. Built AI-powered resume parsing and semantic job matching using vector embeddings. Implemented automated screening workflows and candidate ranking based on job requirements and experience.",
      technologies: ["Next.js", "OpenAI GPT-4", "LangChain", "Pinecone", "PostgreSQL", "TypeScript", "Python"],
      achievements: [
        "Automated resume parsing and skills extraction",
        "Built semantic matching engine for job-candidate fit",
        "Implemented AI-powered candidate screening workflows"
      ]
    },
    {
      name: "3D CAD Quote Tool",
      description: "Manufacturing quotation system with real-time 3D CAD file visualization and automated cost calculation. Integrated Three.js for interactive 3D rendering and Python-based parser for extracting specifications from STEP, STL, and DXF files. Built intelligent pricing engine and automated PDF quotation generation.",
      technologies: ["Next.js", "Three.js", "Python", "FastAPI", "PostgreSQL", "React Three Fiber", "TypeScript"],
      achievements: [
        "Automated quote generation process with 3D visualization",
        "Built CAD file parser supporting multiple formats",
        "Integrated automated PDF report generation"
      ]
    },
    {
      name: "AI-Powered Manufacturing Solutions",
      description: "Digital transformation initiative implementing AI automation for manufacturing operations. Built intelligent document processing using OpenAI GPT-4 and automated workflow orchestration with n8n connecting ERP and CRM systems. Created dashboards for production monitoring and quality control.",
      technologies: ["OpenAI GPT-4", "LangChain", "Python", "FastAPI", "n8n", "Power BI", "PostgreSQL"],
      achievements: [
        "Automated document processing workflows",
        "Integrated AI-powered quality prediction",
        "Built real-time production monitoring dashboards"
      ]
    },
    {
      name: "AllyScan - Accessibility Testing Platform",
      description: "SaaS platform for automated web accessibility testing and WCAG compliance. Built scanning engine using Playwright for cross-browser testing with detailed reporting and remediation recommendations. Developed Chrome extension for real-time accessibility auditing during development.",
      technologies: ["Next.js", "Playwright", "PostgreSQL", "TypeScript", "Prisma", "Docker"],
      achievements: [
        "Automated accessibility testing with detailed reports",
        "Built Chrome extension for real-time auditing",
        "Implemented CI/CD integration for testing workflows"
      ]
    },
    {
      name: "Headless E-Commerce Platform",
      description: "Modern commerce platform built on MedusaJS with custom Next.js storefront. Architected multi-currency solution with Stripe payment processing and Algolia product search. Built admin dashboard for inventory and order management with subscription support.",
      technologies: ["MedusaJS", "Next.js", "TypeScript", "Stripe", "PostgreSQL", "Algolia", "Tailwind CSS"],
      achievements: [
        "Built headless commerce architecture",
        "Integrated payment processing and shipping",
        "Implemented subscription management system"
      ]
    }
  ],
  
  education: [
    {
      degree: "Bachelor of Science in Software Engineering",
      institution: "Hogeschool van Amsterdam (Amsterdam University of Applied Sciences)",
      location: "Amsterdam, Netherlands",
      period: "2014 - 2019",
      description: "Focus on software architecture, web technologies, and agile development methodologies"
    },
    {
      degree: "Application Developer (MBO Level 4)",
      institution: "Regio College",
      location: "Netherlands",
      period: "2011 - 2014",
      description: "ICT Application Development with focus on web development and database design"
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
      language: "Dutch",
      proficiency: "Native"
    },
    {
      language: "English",
      proficiency: "Professional Working Proficiency"
    }
  ]
};
