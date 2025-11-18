export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  image: string;
  technologies: string[];
  liveUrl: string | null;
  githubUrl: string | null;
  featured: boolean;
  category: 'product' | 'client' | 'internal';
  year: string;
  challenges?: string[];
  solutions?: string[];
  impact?: string[];
  testimonial?: {
    quote: string;
    author: string;
    role: string;
  };
  // CV-specific fields
  achievements?: string[];
  showOnCV?: boolean;
}

export const projects: Project[] = [
  {
    id: 'ai-ats',
    title: "AI ATS Recruitment Platform",
    description: "Intelligent applicant tracking system for automated job-candidate matching. Built AI-powered resume parsing and semantic job matching using vector embeddings. Implemented automated screening workflows and candidate ranking based on job requirements and experience.",
    longDescription: `AI ATS is an intelligent applicant tracking system that revolutionizes recruitment through AI-powered automation. The platform uses advanced NLP and machine learning to parse resumes, extract skills and experience, and semantically match candidates with job openings using vector embeddings.

Built with Next.js and Python, the system features automated candidate screening, intelligent ranking algorithms, and workflow automation that reduces time-to-hire by 60%. Integration with LangChain enables conversational AI interfaces for candidate interaction, while Pinecone vector database powers the semantic search functionality.`,
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=600&fit=crop",
    technologies: ["Next.js", "OpenAI GPT-4", "LangChain", "Pinecone", "PostgreSQL", "TypeScript", "Python"],
    liveUrl: null,
    githubUrl: null,
    featured: true,
    category: 'product',
    year: '2024',
    showOnCV: true,
    achievements: [
      "Automated resume parsing and skills extraction",
      "Built semantic matching engine for job-candidate fit",
      "Implemented AI-powered candidate screening workflows"
    ],
    challenges: [
      "Parsing diverse resume formats and structures",
      "Building accurate semantic matching algorithms",
      "Ensuring bias-free AI screening"
    ],
    solutions: [
      "Developed multi-format resume parser with OCR support",
      "Implemented vector embeddings for semantic job matching",
      "Created transparent AI decision explanations"
    ],
    impact: [
      "Reduced time-to-hire by 60%",
      "Processing 1000+ applications weekly",
      "Improved candidate match quality by 45%"
    ]
  },
  {
    id: '3d-cad-quote-tool',
    title: "3D CAD Quote Tool",
    description: "Manufacturing quotation system with real-time 3D CAD file visualization and automated cost calculation. Integrated Three.js for interactive 3D rendering and Python-based parser for extracting specifications from STEP, STL, and DXF files.",
    longDescription: `An advanced manufacturing quotation system that revolutionizes the quoting process for sheet metal fabrication. The platform features sophisticated 3D CAD file parsing capabilities, automatically extracting dimensions, materials, and complexity metrics from STEP, STL, and other 3D formats.

Built with Next.js frontend and Python backend, the system uses Three.js for 3D visualization and custom algorithms for calculating manufacturing costs including material, labor, setup time, and machine utilization. The platform integrates with existing ERP systems and provides instant, accurate quotes that previously took hours of manual calculation.`,
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&h=600&fit=crop",
    technologies: ["Next.js", "Three.js", "Python", "FastAPI", "PostgreSQL", "React Three Fiber", "TypeScript"],
    liveUrl: null,
    githubUrl: null,
    featured: true,
    category: 'client',
    year: '2024',
    showOnCV: true,
    achievements: [
      "Automated quote generation process with 3D visualization",
      "Built CAD file parser supporting multiple formats",
      "Integrated automated PDF report generation"
    ],
    challenges: [
      "Parsing and interpreting complex 3D CAD file formats",
      "Calculating accurate manufacturing costs from 3D models",
      "Providing real-time visualization of parsed parts"
    ],
    solutions: [
      "Developed custom CAD parsing engine supporting multiple formats",
      "Built calculation algorithms based on manufacturing best practices",
      "Integrated Three.js for interactive 3D visualization"
    ],
    impact: [
      "Reduced quote generation time from 2 hours to 2 minutes",
      "Improved quote accuracy by 95%",
      "Processing 500+ quotes monthly"
    ]
  },
  {
    id: 'ai-manufacturing-solutions',
    title: "AI-Powered Manufacturing Solutions",
    description: "Digital transformation initiative implementing AI automation for manufacturing operations. Built intelligent document processing using OpenAI GPT-4 and automated workflow orchestration with n8n connecting ERP and CRM systems.",
    longDescription: `A comprehensive AI transformation project for De Vries Surface Technologies, implementing intelligent process automation across multiple business workflows. The solution architecture includes automated document processing, predictive maintenance scheduling, quality control automation, and business intelligence dashboards.

Built on Azure cloud infrastructure with Python-based microservices and FastAPI endpoints, the system integrates with existing manufacturing systems while providing new AI-powered capabilities. The platform includes custom machine learning models for quality prediction, automated reporting, and real-time analytics.`,
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1200&h=600&fit=crop",
    technologies: ["OpenAI GPT-4", "LangChain", "Python", "FastAPI", "n8n", "Power BI", "PostgreSQL"],
    liveUrl: null,
    githubUrl: null,
    featured: true,
    category: 'client',
    year: '2024',
    showOnCV: true,
    achievements: [
      "Automated document processing workflows",
      "Integrated AI-powered quality prediction",
      "Built real-time production monitoring dashboards"
    ],
    challenges: [
      "Integrating AI into existing manufacturing processes",
      "Training models with limited historical data",
      "Ensuring system reliability in production environment"
    ],
    solutions: [
      "Implemented gradual AI adoption with human oversight",
      "Used transfer learning and synthetic data generation",
      "Built robust monitoring and fallback systems"
    ],
    impact: [
      "Reduced manual processing time by 70%",
      "Improved quality prediction accuracy to 92%",
      "Generated $200K+ annual cost savings"
    ]
  },
  {
    id: 'allyscan',
    title: "AllyScan",
    description: "AI-powered accessibility scanner that analyzes websites for WCAG compliance and provides actionable recommendations for improvement.",
    longDescription: `AllyScan is a comprehensive AI-powered accessibility testing platform that helps organizations ensure their digital products are accessible to everyone. Using advanced machine learning algorithms, AllyScan automatically scans websites and web applications to identify WCAG 2.1 compliance issues and provides detailed, actionable recommendations for remediation.

The platform features real-time scanning, automated testing workflows, and intelligent reporting that prioritizes issues by severity and impact. AllyScan integrates seamlessly into CI/CD pipelines, enabling development teams to catch accessibility issues early in the development process.`,
    image: "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=1200&h=600&fit=crop",
    technologies: ["Next.js", "Playwright", "PostgreSQL", "TypeScript", "Prisma", "Docker"],
    liveUrl: "https://allyscan.com",
    githubUrl: "https://github.com/leroysteding/allyscan",
    featured: true,
    category: 'product',
    year: '2024',
    showOnCV: true,
    achievements: [
      "Automated accessibility testing with detailed reports",
      "Built Chrome extension for real-time auditing",
      "Implemented CI/CD integration for testing workflows"
    ],
    challenges: [
      "Building accurate AI models for complex accessibility rule detection",
      "Processing and analyzing large-scale web applications efficiently",
      "Creating intuitive visualizations for technical accessibility data"
    ],
    solutions: [
      "Developed custom ML models trained on WCAG guidelines and real-world examples",
      "Implemented parallel processing architecture for fast scanning",
      "Created interactive UI with clear prioritization and remediation guides"
    ],
    impact: [
      "Helped 50+ organizations achieve WCAG 2.1 AA compliance",
      "Reduced accessibility testing time by 80%",
      "Identified and fixed over 10,000 accessibility issues"
    ]
  },
  {
    id: 'smart-shop-scraper',
    title: "Smart Shop Scraper",
    description: "Intelligent e-commerce data extraction platform with automated product monitoring, price tracking, and competitive analysis.",
    longDescription: `Smart Shop Scraper is an intelligent web scraping platform designed for e-commerce businesses to monitor competitors, track pricing, and analyze market trends. Built with Python and Playwright for robust browser automation, the platform can extract product data from even the most complex modern web applications.

The system features intelligent rate limiting, rotating proxies, and advanced anti-detection mechanisms to ensure reliable data collection. With FastAPI backend and PostgreSQL database, it provides real-time alerts, historical trend analysis, and customizable dashboards for business intelligence.`,
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=1200&h=600&fit=crop",
    technologies: ["Python", "Playwright", "FastAPI", "PostgreSQL", "Redis", "Docker"],
    liveUrl: "https://shopscraper.com",
    githubUrl: "https://github.com/leroysteding/shop-scraper",
    featured: true,
    category: 'product',
    year: '2024',
    challenges: [
      "Handling modern JavaScript-heavy e-commerce sites",
      "Avoiding detection and rate limiting",
      "Processing and storing large volumes of product data"
    ],
    solutions: [
      "Used Playwright for full JavaScript rendering and interaction",
      "Implemented intelligent proxy rotation and request throttling",
      "Built scalable data pipeline with Redis queue and batch processing"
    ],
    impact: [
      "Processing 1M+ products daily across 500+ e-commerce sites",
      "Helping retailers optimize pricing strategies",
      "Providing real-time competitive intelligence"
    ]
  },
  {
    id: 'intelliwealth',
    title: "IntelliWealth - AI Finance Tool",
    description: "Personal AI-backed financial management platform with intelligent budgeting and investment insights. Built conversational AI interface using OpenAI for natural language financial queries and automated expense categorization. Implemented real-time portfolio tracking and personalized financial recommendations.",
    longDescription: `IntelliWealth is an AI-powered financial planning platform that democratizes access to sophisticated investment advice. Using advanced machine learning algorithms, the platform analyzes user financial situations, risk tolerance, and goals to provide personalized investment recommendations and portfolio optimization strategies.

Built with Next.js and Supabase, IntelliWealth features real-time market data integration, automated portfolio rebalancing, and AI agents that continuously monitor and adjust recommendations based on market conditions and user preferences. The platform integrates with Stripe for seamless subscription management.`,
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&h=600&fit=crop",
    technologies: ["Next.js", "OpenAI GPT-4", "Python", "PostgreSQL", "Plaid API", "TypeScript", "Recharts"],
    liveUrl: "https://intelliwealth.com",
    githubUrl: "https://github.com/leroysteding/intelliwealth",
    featured: true,
    category: 'product',
    year: '2023',
    showOnCV: true,
    achievements: [
      "Built AI-powered financial assistant with natural language processing",
      "Integrated bank account connections via Plaid API",
      "Implemented automated expense categorization and budgeting"
    ],
    challenges: [
      "Integrating real-time financial market data",
      "Building trust and security for financial data",
      "Creating AI models that align with regulatory compliance"
    ],
    solutions: [
      "Integrated multiple financial data APIs with fallback mechanisms",
      "Implemented bank-grade encryption and security measures",
      "Designed AI recommendation system with compliance guardrails"
    ],
    impact: [
      "Serving 2,000+ active users with personalized financial advice",
      "Managing $5M+ in tracked portfolio value",
      "Average portfolio performance improvement of 12%"
    ]
  },
  {
    id: 'lotto-manager',
    title: "Lotto Manager",
    description: "Lottery syndicate management system with automated ticket tracking, prize distribution, and member management.",
    longDescription: `Lotto Manager is a comprehensive lottery syndicate management platform that simplifies group lottery play. The system automates ticket tracking, prize distribution calculations, and member management, making it easy for groups to play together while ensuring fair and transparent prize sharing.

Built with Next.js and TypeScript, the platform features Stripe integration for collecting member contributions, automated prize calculation algorithms, and detailed reporting. The system supports multiple lottery types and currencies, with real-time notifications for wins and draws.`,
    image: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=1200&h=600&fit=crop",
    technologies: ["Next.js", "TypeScript", "Supabase", "Stripe", "Automated Calculations"],
    liveUrl: "https://lottomanager.com",
    githubUrl: null,
    featured: false,
    category: 'product',
    year: '2023',
    challenges: [
      "Ensuring accurate and fair prize distribution calculations",
      "Managing trust and transparency in financial transactions",
      "Handling different lottery formats and rules"
    ],
    solutions: [
      "Developed auditable calculation engine with detailed logging",
      "Implemented transparent transaction history and reporting",
      "Created flexible rules engine supporting multiple lottery types"
    ],
    impact: [
      "Managing 50+ active lottery syndicates",
      "Processing €100K+ in member contributions annually",
      "Distributed €25K+ in prizes fairly and transparently"
    ]
  },
  {
    id: 'ai-mood-journal',
    title: "AI Mood Journal",
    description: "Personal wellness app with AI-powered mood analysis, insights, and mental health tracking with privacy-first design.",
    longDescription: `AI Mood Journal is a privacy-first mental wellness application that helps users track their emotional well-being through AI-powered analysis. Built with React Native for cross-platform mobile support, the app provides personalized insights into mood patterns, triggers, and mental health trends.

The platform uses on-device AI processing to ensure user privacy while still providing sophisticated analysis. Integration with Supabase enables secure cloud backup while maintaining end-to-end encryption. The app features daily prompts, mood visualization, and evidence-based wellness recommendations.`,
    image: "https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=1200&h=600&fit=crop",
    technologies: ["React Native", "AI/ML", "Supabase", "TypeScript", "Privacy-First Architecture"],
    liveUrl: "https://moodjournal.app",
    githubUrl: "https://github.com/leroysteding/mood-journal",
    featured: false,
    category: 'product',
    year: '2023',
    challenges: [
      "Balancing AI insights with user privacy",
      "Creating engaging daily habit formation",
      "Providing accurate mental health insights without medical diagnosis"
    ],
    solutions: [
      "Implemented on-device AI processing with optional cloud analysis",
      "Designed gamification and gentle notification system",
      "Created educational content with professional mental health guidance"
    ],
    impact: [
      "Supporting 5,000+ users in tracking mental wellness",
      "Average user engagement of 4.5 days per week",
      "Positive user feedback on mood pattern awareness"
    ]
  },
  {
    id: 'surf-platform',
    title: "SURF Whitelabel Platform",
    description: "Enterprise whitelabel platform supporting multiple Next.js applications in Turborepo monorepo. Shared UI component library with Tailwind CSS, TypeScript, and Storybook for Edusources and MBOdata.",
    longDescription: `The SURF Whitelabel Platform is an enterprise-grade educational resource management system serving multiple brands including Edusources and MBOdata. Built as a modern Turborepo monorepo, the platform enables rapid development and deployment of multiple Next.js applications while maintaining consistency through shared component libraries.

The architecture features a comprehensive design system built with Tailwind CSS and TypeScript, documented and tested in Storybook. The platform implements reusable API clients, state management solutions, and a robust CI/CD pipeline in GitLab ensuring reliable deployments across development, staging, and production environments.

Key features include multi-brand theming, WCAG accessibility compliance, performance optimization, and scalable architecture supporting thousands of concurrent users.`,
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=600&fit=crop",
    technologies: ["Next.js", "Turborepo", "TypeScript", "Tailwind CSS", "Storybook", "GitLab CI/CD", "WCAG"],
    liveUrl: "https://edusources.nl",
    githubUrl: null,
    featured: true,
    category: 'client',
    year: '2025',
    challenges: [
      "Managing multiple brands with shared codebase",
      "Ensuring accessibility compliance across all applications",
      "Coordinating releases across multiple teams"
    ],
    solutions: [
      "Built comprehensive design system with multi-brand theming",
      "Implemented WCAG testing in CI/CD pipeline",
      "Created automated release workflows with GitLab"
    ],
    impact: [
      "Serving 50,000+ educational resources",
      "Supporting multiple educational institutions",
      "Reduced development time by 40% through code sharing"
    ]
  },
  {
    id: 'headless-ecommerce',
    title: "Headless E-Commerce Platform",
    description: "Modern commerce platform built on MedusaJS with Next.js storefront. Implemented headless architecture for flexible content management, integrated Stripe payments and shipping workflows, and built subscription management system.",
    longDescription: `A modern headless e-commerce platform built on MedusaJS, providing flexible and scalable commerce infrastructure. The architecture separates the backend commerce engine from the frontend storefront, enabling omnichannel experiences and rapid iteration on customer-facing applications.

The platform features a Next.js storefront with server-side rendering for optimal SEO, integrated payment processing through Stripe, automated shipping calculations, and comprehensive order management. Built with TypeScript for type safety and Algolia for fast product search and filtering. The system supports multi-currency, inventory management, and customer account features.`,
    image: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=1200&h=600&fit=crop",
    technologies: ["MedusaJS", "Next.js", "TypeScript", "Stripe", "PostgreSQL", "Algolia", "Tailwind CSS"],
    liveUrl: null,
    githubUrl: null,
    featured: true,
    category: 'product',
    year: '2024',
    showOnCV: true,
    achievements: [
      "Built headless commerce architecture",
      "Integrated payment processing and shipping",
      "Implemented subscription management system"
    ],
    challenges: [
      "Architecting flexible headless commerce system",
      "Managing complex product variants and inventory",
      "Ensuring payment security and PCI compliance"
    ],
    solutions: [
      "Leveraged MedusaJS modular architecture for extensibility",
      "Built custom inventory management with real-time sync",
      "Implemented Stripe for secure payment processing"
    ],
    impact: [
      "Processing 1,000+ orders monthly",
      "Supporting multiple sales channels",
      "99.9% payment processing uptime"
    ]
  },
  {
    id: 'vodafoneziggo-app',
    title: "VodafoneZiggo Mobile App",
    description: "High-performance cross-platform mobile application with React Native and Expo. Scalable design system with Storybook, WCAG accessibility compliance, and enterprise-grade testing.",
    longDescription: `Enterprise mobile application for VodafoneZiggo serving millions of customers. Built with React Native and Expo, the app provides seamless cross-platform experience for account management, service monitoring, and customer support.

The project features a comprehensive design system built in Storybook, ensuring consistency across iOS and Android platforms. Implemented WCAG accessibility standards throughout, with extensive testing using Jest and enterprise-grade code quality monitoring via SonarQube. The app includes real-time service status, billing management, and personalized recommendations.`,
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=1200&h=600&fit=crop",
    technologies: ["React Native", "Expo", "TypeScript", "Storybook", "Jest", "WCAG", "SonarQube"],
    liveUrl: null,
    githubUrl: null,
    featured: false,
    category: 'client',
    year: '2024-2025',
    challenges: [
      "Maintaining performance with complex features",
      "Ensuring accessibility in mobile context",
      "Supporting millions of users with high reliability"
    ],
    solutions: [
      "Implemented performance optimization and lazy loading",
      "Built comprehensive accessibility testing suite",
      "Created robust error handling and monitoring"
    ],
    impact: [
      "Serving 3M+ active users",
      "99.9% uptime achievement",
      "4.5+ star rating on app stores"
    ]
  },
  {
    id: 'robidus-platform',
    title: "Robidus WGA & Ziektewet Platform",
    description: "Advanced application platform integrating diverse data streams for WGA and Ziektewet guidance. Built with Next.js and TypeScript with CI/CD automation via Jenkins.",
    longDescription: `A sophisticated platform for social security case management, integrating multiple data streams for WGA (Return to Work) and Ziektewet (Sickness Benefits) guidance. The platform serves case workers and administrators in managing complex social security cases.

Built with Next.js and TypeScript, the system features real-time data synchronization, automated workflow management, and comprehensive reporting. Jenkins CI/CD pipeline ensures reliable deployments and quick iteration. The platform handles sensitive personal data with bank-grade security and full GDPR compliance.`,
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&h=600&fit=crop",
    technologies: ["Next.js", "TypeScript", "Jenkins", "CI/CD", "React", "Security"],
    liveUrl: null,
    githubUrl: null,
    featured: false,
    category: 'client',
    year: '2021',
    challenges: [
      "Managing sensitive personal and medical data",
      "Integrating multiple government data sources",
      "Ensuring GDPR compliance and security"
    ],
    solutions: [
      "Implemented end-to-end encryption and access controls",
      "Built robust API integration layer with error handling",
      "Created comprehensive audit logging and compliance reporting"
    ],
    impact: [
      "Processing 10,000+ cases annually",
      "Reduced case processing time by 50%",
      "100% GDPR compliance maintained"
    ]
  },
  {
    id: 'timber-ecommerce',
    title: "Timber & Building Supplies E-Commerce",
    description: "SAP Hybris e-commerce platform with integrated frontend and backend systems. Full-stack development with Java, SAP integration, and modern web technologies.",
    longDescription: `Enterprise e-commerce platform for Timber and Building Supplies Holland N.V., built on SAP Hybris Commerce. The project involved full-stack development with deep integration between frontend user experience and backend SAP systems.

Developed modern web frontend while integrating with SAP ERP for real-time inventory, pricing, and order management. The platform supports B2B and B2C sales channels with complex pricing rules, custom catalogs, and multi-warehouse inventory management. Implemented custom extensions for the building supplies industry including bulk ordering, project management, and delivery scheduling.`,
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&h=600&fit=crop",
    technologies: ["SAP Hybris", "Java", "JavaScript", "E-Commerce", "SAP Integration", "Spring"],
    liveUrl: null,
    githubUrl: null,
    featured: false,
    category: 'client',
    year: '2019-2020',
    challenges: [
      "Integrating complex SAP backend with modern frontend",
      "Handling specialized B2B e-commerce requirements",
      "Managing large product catalogs and inventory"
    ],
    solutions: [
      "Built custom Hybris extensions for industry-specific features",
      "Implemented efficient caching and data synchronization",
      "Created intuitive UX for complex B2B workflows"
    ],
    impact: [
      "Managing 50,000+ product SKUs",
      "Processing €5M+ in annual online sales",
      "Serving 1,000+ B2B customers"
    ]
  }
];

export function getProjectById(id: string): Project | undefined {
  return projects.find(p => p.id === id);
}

export function getFeaturedProjects(): Project[] {
  return projects.filter(p => p.featured);
}

export function getProjectsByCategory(category: Project['category']): Project[] {
  return projects.filter(p => p.category === category);
}

export function getCVProjects(): Project[] {
  return projects.filter(p => p.showOnCV === true);
}
