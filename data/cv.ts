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
  
  summary: `Highly accomplished Senior Full-Stack Developer and AI Automation Architect with 12+ years of progressive experience building enterprise-scale web platforms, mobile applications, and intelligent automation solutions. Deep expertise in modern JavaScript ecosystem (React 19, Next.js 16, TypeScript 5.x) with proven ability to architect and deliver complex systems serving millions of users. Specialized in AI integration (OpenAI, LangChain), microservices architecture, and headless commerce platforms. Track record of leading cross-functional teams, mentoring junior developers, and driving technical innovation that delivers measurable business value. Expert in full-stack development (Node.js, Python, Java), cloud infrastructure (AWS, Azure, Vercel), and modern DevOps practices (Docker, Kubernetes, CI/CD). Passionate about web accessibility (WCAG 2.1 AA/AAA), performance optimization, and creating exceptional user experiences through clean, maintainable code. Adept at translating complex business requirements into scalable technical solutions while maintaining focus on code quality, security, and best practices.`,
  
  skills: [
    {
      category: "Frontend Development",
      items: [
        "React 19 (Hooks, Context API, Server Components)", "Next.js 16 (App Router, Server Actions, Middleware)",
        "TypeScript 5.x", "JavaScript (ES6+, ES2023)", "Vue.js 3 (Composition API)", "Angular 14+",
        "HTML5 (Semantic Markup, Accessibility)", "CSS3 (Grid, Flexbox, Custom Properties)",
        "Tailwind CSS v4", "SASS/SCSS (Modules, Mixins)", "Styled Components", "CSS-in-JS",
        "Responsive Design (Mobile-First)", "Progressive Web Apps (PWA, Service Workers)",
        "Web Accessibility (WCAG 2.1 AA/AAA, ARIA)", "SEO Optimization",
        "Storybook 8 (Component Documentation)", "Framer Motion (Animation)", "GSAP",
        "React Native", "Expo SDK", "React Query/TanStack Query", "Zustand/Redux Toolkit",
        "Webpack 5", "Vite", "Turbopack", "SWC Compiler", "Babel"
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
      description: "Enterprise-grade whitelabel platform architecture supporting multiple Next.js 14 applications within a Turborepo monorepo. Designed and implemented a comprehensive shared UI component library with 80+ reusable components, serving over 50,000 educational resources to students and educators across the Netherlands. Built scalable infrastructure with automated deployments, comprehensive testing suite, and full WCAG 2.1 AA accessibility compliance. Architected multi-tenant system supporting multiple educational institutions with customizable branding and theming.",
      technologies: ["Next.js 14", "Turborepo", "TypeScript", "React 18", "Tailwind CSS", "Storybook 8", "GitLab CI/CD", "Docker", "PostgreSQL", "Elasticsearch", "Redis"],
      achievements: [
        "Reduced development time by 40% through comprehensive shared component library and design system",
        "Achieved 100% WCAG 2.1 AA compliance with automated accessibility testing using axe-core and Pa11y",
        "Implemented GitLab CI/CD pipelines with automated testing, linting, and deployment reducing deployment time by 60%",
        "Built Storybook documentation with 150+ component stories improving team collaboration and development velocity",
        "Optimized bundle size by 35% through code splitting and lazy loading strategies",
        "Established TypeScript strict mode across entire monorepo ensuring type safety and reducing runtime errors by 45%"
      ]
    },
    {
      name: "Quote Tool with Advanced 3D CAD File Parsing",
      description: "Sophisticated manufacturing quotation system featuring real-time 3D CAD file analysis and automated cost calculation for sheet metal fabrication. Integrated Three.js for 3D visualization and Python-based CAD parser for extracting manufacturing specifications from STEP, STL, and DXF files. Built intelligent pricing engine considering material costs, manufacturing complexity, labor hours, and machine time. Implemented FastAPI backend with async processing for handling large CAD files up to 500MB. Created intuitive UI for reviewing parsed specifications, adjusting parameters, and generating detailed quotation PDFs.",
      technologies: ["Next.js 15", "Three.js", "Python 3.11", "FastAPI", "CAD Parser", "PostgreSQL", "Redis", "AWS S3", "Docker", "React Three Fiber", "TypeScript"],
      achievements: [
        "Reduced quote generation time from 2+ hours of manual calculation to under 2 minutes with 98% accuracy",
        "Improved quote accuracy by 95% through automated CAD parsing eliminating human measurement errors",
        "Processing 500+ quotes monthly with average file size of 50MB handling complex multi-part assemblies",
        "Achieved 3-second load time for 3D visualization of files up to 100MB through optimized rendering pipeline",
        "Built automated PDF report generation including technical drawings, material specifications, and cost breakdowns",
        "Implemented real-time collaboration features allowing multiple team members to review and adjust quotes simultaneously"
      ]
    },
    {
      name: "AI Solutions Architecture - De Vries Surface Technologies",
      description: "Led comprehensive digital transformation initiative implementing AI-powered automation across manufacturing, quality control, and business operations. Architected intelligent document processing system using OpenAI GPT-4 for extracting structured data from technical specifications and quality reports. Built predictive analytics platform for surface treatment quality prediction using machine learning models trained on historical data. Developed automated workflow orchestration with n8n connecting ERP, CRM, and manufacturing systems. Created Power BI dashboards providing real-time insights into production efficiency, quality metrics, and cost optimization opportunities.",
      technologies: ["OpenAI API (GPT-4)", "LangChain", "Azure AI Services", "Python", "FastAPI", "n8n", "Power BI", "Azure DevOps", "PostgreSQL", "Docker", "Redis", "TensorFlow"],
      achievements: [
        "Reduced manual document processing time by 70% automating data extraction from 1000+ technical documents monthly",
        "Improved quality prediction accuracy to 92% through ML models preventing defects and reducing waste by 25%",
        "Generated $200K+ annual cost savings through optimized resource allocation and reduced rework",
        "Automated 15 critical business workflows reducing administrative overhead by 45 hours per week",
        "Built real-time monitoring dashboard tracking 50+ KPIs providing actionable insights to management",
        "Implemented AI-powered customer support chatbot handling 80% of routine inquiries reducing response time by 60%"
      ]
    },
    {
      name: "VodafoneZiggo Mobile Application",
      description: "Enterprise-scale cross-platform mobile application serving 3M+ active users with comprehensive account management, real-time usage tracking, and self-service capabilities. Architected scalable React Native solution with Expo, implementing offline-first architecture for seamless user experience. Built comprehensive design system with 100+ components documented in Storybook enabling rapid feature development. Implemented advanced state management with Redux Toolkit and RTK Query for efficient data fetching and caching. Integrated push notifications, deep linking, and biometric authentication. Established 90%+ test coverage with Jest and React Native Testing Library.",
      technologies: ["React Native", "Expo SDK 50", "TypeScript", "Redux Toolkit", "RTK Query", "Storybook", "Jest", "React Native Testing Library", "Firebase", "GraphQL", "Apollo Client"],
      achievements: [
        "Achieved 4.7-star rating on App Store and 4.5 on Google Play with 500K+ reviews and 99.9% uptime SLA",
        "Maintained 90%+ test coverage across 200+ components with comprehensive unit and integration tests",
        "Built scalable design system with Storybook containing 100+ documented components reducing development time by 50%",
        "Optimized app performance reducing initial load time by 60% and improving Time to Interactive to under 2 seconds",
        "Implemented offline-first architecture with intelligent sync ensuring seamless experience on poor connections",
        "Reduced crash rate to <0.1% through comprehensive error handling and monitoring with Sentry"
      ]
    },
    {
      name: "AllyScan - AI-Powered Accessibility Scanner & Compliance Platform",
      description: "Comprehensive SaaS platform for automated web accessibility testing and WCAG compliance management. Built intelligent scanning engine using Playwright for cross-browser testing and machine learning models for identifying accessibility issues beyond rule-based detection. Developed Chrome extension for real-time accessibility auditing during development. Created detailed reporting dashboard with prioritized remediation recommendations, code examples, and compliance tracking. Implemented multi-tenant architecture supporting enterprise teams with role-based access control and audit trails. Integrated with CI/CD pipelines for automated accessibility testing in development workflows.",
      technologies: ["Next.js 15", "Python", "TensorFlow", "Playwright", "PostgreSQL", "Redis", "OpenAI API", "TypeScript", "Prisma", "AWS", "Docker", "Kubernetes"],
      achievements: [
        "Reduced accessibility testing time by 80% compared to manual audits through automated scanning and intelligent issue detection",
        "Identified and helped remediate over 10,000 accessibility issues across 50+ enterprise organizations",
        "Helped 30+ organizations achieve WCAG 2.1 AA compliance with detailed remediation guidance and code examples",
        "Built AI-powered recommendation engine providing context-aware fixes with 95% accuracy improving developer productivity",
        "Processed 100K+ page scans monthly with average scan time of 15 seconds per page",
        "Achieved 98% customer satisfaction score with enterprise customers including government agencies and Fortune 500 companies"
      ]
    },
    {
      name: "Enterprise E-Commerce Platform with MedusaJS",
      description: "Headless commerce platform built on MedusaJS with custom Next.js storefront supporting B2B and B2C operations. Architected multi-currency, multi-language solution with complex pricing rules, bulk ordering, and quote management. Integrated Stripe for payment processing, Shippo for shipping, and Algolia for product search. Built custom admin dashboard for inventory management, order processing, and customer analytics. Implemented advanced product catalog with configurable variants, bundles, and subscriptions.",
      technologies: ["MedusaJS", "Next.js 15", "TypeScript", "Stripe", "PostgreSQL", "Redis", "Algolia", "Docker", "AWS", "Tailwind CSS"],
      achievements: [
        "Processed $2M+ in monthly transactions with 99.99% uptime and sub-second page load times",
        "Reduced cart abandonment by 35% through optimized checkout flow and real-time shipping calculations",
        "Implemented advanced product search with Algolia handling 1M+ searches monthly with <50ms response time",
        "Built subscription management system supporting 5,000+ recurring customers with automated billing",
        "Integrated multi-warehouse inventory system with real-time stock updates across 3 distribution centers"
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
      language: "Dutch",
      proficiency: "Native"
    },
    {
      language: "English",
      proficiency: "Professional Working Proficiency"
    }
  ]
};
