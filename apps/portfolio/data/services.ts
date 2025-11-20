export interface Service {
  id: string;
  slug: string;
  icon: string;
  gradient: string;
  titleKey: string;
  descriptionKey: string;
  longDescriptionKey: string;
  features: string[];
  technologies: string[];
  processSteps: Array<{
    titleKey: string;
    descriptionKey: string;
  }>;
  benefits: string[];
  faqs: Array<{
    questionKey: string;
    answerKey: string;
  }>;
  stats: Array<{
    value: string;
    label: string;
    icon: string;
  }>;
  caseStudies?: Array<{
    title: string;
    description: string;
    results: string[];
    image?: string;
  }>;
}

export const services: Service[] = [
  {
    id: "web-development",
    slug: "web-development",
    icon: "Code",
    gradient: "from-blue-500 to-cyan-500",
    titleKey: "webDevelopment",
    descriptionKey: "webDevelopment",
    longDescriptionKey: "webDevelopmentLong",
    features: [
      "Responsive design for all devices",
      "Progressive Web Apps (PWA)",
      "Server-side rendering (SSR)",
      "Static site generation (SSG)",
      "Performance optimization",
      "SEO optimization",
    ],
    technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Supabase"],
    processSteps: [
      { titleKey: "discovery", descriptionKey: "discoveryDesc" },
      { titleKey: "design", descriptionKey: "designDesc" },
      { titleKey: "development", descriptionKey: "developmentDesc" },
      { titleKey: "testing", descriptionKey: "testingDesc" },
      { titleKey: "deployment", descriptionKey: "deploymentDesc" },
    ],
    benefits: [
      "Fast loading times",
      "Mobile-first approach",
      "Scalable architecture",
      "Easy maintenance",
    ],
    faqs: [
      {
        questionKey: "webDevTimeframe",
        answerKey: "webDevTimeframeAnswer",
      },
      {
        questionKey: "webDevCost",
        answerKey: "webDevCostAnswer",
      },
    ],
    stats: [
      { value: "< 1s", label: "Page Load Time", icon: "Zap" },
      { value: "95+", label: "Lighthouse Score", icon: "TrendingUp" },
      { value: "100%", label: "Mobile Responsive", icon: "Smartphone" },
      { value: "SEO", label: "Optimized", icon: "Search" },
    ],
    caseStudies: [
      {
        title: "E-commerce Platform",
        description: "Built a high-performance e-commerce platform with Next.js, achieving excellent Core Web Vitals scores.",
        results: [
          "60% faster page loads",
          "40% increase in conversions",
          "95+ Lighthouse score",
        ],
      },
      {
        title: "SaaS Dashboard",
        description: "Developed a complex SaaS dashboard with real-time data visualization and seamless UX.",
        results: [
          "Real-time updates",
          "Scalable to 10K+ users",
          "99.9% uptime",
        ],
      },
    ],
  },
  {
    id: "ai-automation",
    slug: "ai-automation",
    icon: "Sparkles",
    gradient: "from-purple-500 to-pink-500",
    titleKey: "aiAutomation",
    descriptionKey: "aiAutomation",
    longDescriptionKey: "aiAutomationLong",
    features: [
      "Intelligent workflow automation",
      "AI-powered data processing",
      "Custom AI agent development",
      "n8n workflow integration",
      "API orchestration",
      "Business process automation",
    ],
    technologies: ["Python", "FastAPI", "OpenAI", "n8n", "LangChain"],
    processSteps: [
      { titleKey: "analysis", descriptionKey: "analysisDesc" },
      { titleKey: "design", descriptionKey: "designDesc" },
      { titleKey: "implementation", descriptionKey: "implementationDesc" },
      { titleKey: "integration", descriptionKey: "integrationDesc" },
      { titleKey: "optimization", descriptionKey: "optimizationDesc" },
    ],
    benefits: [
      "Reduced manual tasks",
      "Improved accuracy",
      "Cost savings",
      "24/7 automation",
    ],
    faqs: [
      {
        questionKey: "aiAutomationROI",
        answerKey: "aiAutomationROIAnswer",
      },
      {
        questionKey: "aiAutomationSecurity",
        answerKey: "aiAutomationSecurityAnswer",
      },
    ],
    stats: [
      { value: "80%", label: "Time Saved", icon: "Clock" },
      { value: "95%", label: "Accuracy Rate", icon: "Target" },
      { value: "24/7", label: "Automation", icon: "Zap" },
      { value: "3-6mo", label: "ROI Timeline", icon: "TrendingUp" },
    ],
    caseStudies: [
      {
        title: "Document Processing Automation",
        description: "Automated invoice processing using AI, reducing manual data entry by 90%.",
        results: [
          "90% reduction in manual work",
          "99% accuracy rate",
          "ROI in 4 months",
        ],
      },
    ],
  },
  {
    id: "api-integration",
    slug: "api-integration",
    icon: "Zap",
    gradient: "from-orange-500 to-red-500",
    titleKey: "apiIntegration",
    descriptionKey: "apiIntegration",
    longDescriptionKey: "apiIntegrationLong",
    features: [
      "RESTful API development",
      "GraphQL API implementation",
      "Third-party API integration",
      "Webhook management",
      "API documentation",
      "Rate limiting & security",
    ],
    technologies: ["FastAPI", "GraphQL", "PostgreSQL", "Redis", "Docker"],
    processSteps: [
      { titleKey: "requirements", descriptionKey: "requirementsDesc" },
      { titleKey: "architecture", descriptionKey: "architectureDesc" },
      { titleKey: "development", descriptionKey: "developmentDesc" },
      { titleKey: "documentation", descriptionKey: "documentationDesc" },
      { titleKey: "deployment", descriptionKey: "deploymentDesc" },
    ],
    benefits: [
      "Seamless integrations",
      "Real-time data sync",
      "Scalable solutions",
      "Comprehensive docs",
    ],
    faqs: [
      {
        questionKey: "apiComplexity",
        answerKey: "apiComplexityAnswer",
      },
      {
        questionKey: "apiMaintenance",
        answerKey: "apiMaintenanceAnswer",
      },
    ],
    stats: [
      { value: "99.9%", label: "Uptime", icon: "Activity" },
      { value: "<100ms", label: "Response Time", icon: "Zap" },
      { value: "RESTful", label: "& GraphQL", icon: "Code" },
      { value: "Secure", label: "Auth & Rate Limiting", icon: "Shield" },
    ],
    caseStudies: [
      {
        title: "Payment Gateway Integration",
        description: "Integrated multiple payment providers with robust error handling and webhook management.",
        results: [
          "99.9% success rate",
          "Real-time processing",
          "Multi-provider support",
        ],
      },
    ],
  },
  {
    id: "consulting",
    slug: "consulting",
    icon: "Rocket",
    gradient: "from-green-500 to-emerald-500",
    titleKey: "consulting",
    descriptionKey: "consulting",
    longDescriptionKey: "consultingLong",
    features: [
      "Technical architecture review",
      "Technology stack selection",
      "Code quality assessment",
      "Performance optimization strategy",
      "Team training & mentorship",
      "Best practices implementation",
    ],
    technologies: ["Architecture", "DevOps", "Performance", "Security", "Testing"],
    processSteps: [
      { titleKey: "assessment", descriptionKey: "assessmentDesc" },
      { titleKey: "strategy", descriptionKey: "strategyDesc" },
      { titleKey: "implementation", descriptionKey: "implementationDesc" },
      { titleKey: "training", descriptionKey: "trainingDesc" },
      { titleKey: "support", descriptionKey: "supportDesc" },
    ],
    benefits: [
      "Expert guidance",
      "Avoid costly mistakes",
      "Accelerated delivery",
      "Knowledge transfer",
    ],
    faqs: [
      {
        questionKey: "consultingDuration",
        answerKey: "consultingDurationAnswer",
      },
      {
        questionKey: "consultingDeliverables",
        answerKey: "consultingDeliverablesAnswer",
      },
    ],
    stats: [
      { value: "15+", label: "Years Experience", icon: "Award" },
      { value: "50+", label: "Projects Consulted", icon: "Briefcase" },
      { value: "100%", label: "Client Satisfaction", icon: "Heart" },
      { value: "Expert", label: "Technical Guidance", icon: "GraduationCap" },
    ],
    caseStudies: [
      {
        title: "SaaS Architecture Review",
        description: "Conducted comprehensive architecture review for a growing SaaS platform, identifying critical scalability issues.",
        results: [
          "Reduced infrastructure costs by 40%",
          "Improved performance by 3x",
          "Scalable to 100K users",
        ],
      },
    ],
  },
  {
    id: "full-stack",
    slug: "full-stack",
    icon: "Globe",
    gradient: "from-indigo-500 to-blue-500",
    titleKey: "fullStack",
    descriptionKey: "fullStack",
    longDescriptionKey: "fullStackLong",
    features: [
      "End-to-end application development",
      "Database design & optimization",
      "Frontend & backend integration",
      "Authentication & authorization",
      "Payment gateway integration",
      "Real-time features",
    ],
    technologies: ["Next.js", "Python", "PostgreSQL", "Supabase", "Stripe"],
    processSteps: [
      { titleKey: "planning", descriptionKey: "planningDesc" },
      { titleKey: "design", descriptionKey: "designDesc" },
      { titleKey: "development", descriptionKey: "developmentDesc" },
      { titleKey: "testing", descriptionKey: "testingDesc" },
      { titleKey: "launch", descriptionKey: "launchDesc" },
    ],
    benefits: [
      "Single point of contact",
      "Consistent codebase",
      "Faster development",
      "Better integration",
    ],
    faqs: [
      {
        questionKey: "fullStackAdvantage",
        answerKey: "fullStackAdvantageAnswer",
      },
      {
        questionKey: "fullStackTimeline",
        answerKey: "fullStackTimelineAnswer",
      },
    ],
    stats: [
      { value: "End-to-End", label: "Development", icon: "Layers" },
      { value: "Full", label: "Stack Coverage", icon: "Code" },
      { value: "Fast", label: "Development Cycles", icon: "Zap" },
      { value: "Unified", label: "Codebase", icon: "Package" },
    ],
    caseStudies: [
      {
        title: "E-learning Platform",
        description: "Built complete e-learning platform from database to frontend, including payment integration and content management.",
        results: [
          "Launch in 3 months",
          "10K+ active users",
          "Seamless UX",
        ],
      },
    ],
  },
  {
    id: "cloud-infrastructure",
    slug: "cloud-infrastructure",
    icon: "Database",
    gradient: "from-violet-500 to-purple-500",
    titleKey: "cloudInfra",
    descriptionKey: "cloudInfra",
    longDescriptionKey: "cloudInfraLong",
    features: [
      "Cloud architecture design",
      "CI/CD pipeline setup",
      "Infrastructure as Code",
      "Auto-scaling configuration",
      "Monitoring & alerting",
      "Disaster recovery planning",
    ],
    technologies: ["AWS", "Docker", "Kubernetes", "Terraform", "GitHub Actions"],
    processSteps: [
      { titleKey: "audit", descriptionKey: "auditDesc" },
      { titleKey: "design", descriptionKey: "designDesc" },
      { titleKey: "migration", descriptionKey: "migrationDesc" },
      { titleKey: "optimization", descriptionKey: "optimizationDesc" },
      { titleKey: "monitoring", descriptionKey: "monitoringDesc" },
    ],
    benefits: [
      "High availability",
      "Cost optimization",
      "Auto-scaling",
      "Security compliance",
    ],
    faqs: [
      {
        questionKey: "cloudMigration",
        answerKey: "cloudMigrationAnswer",
      },
      {
        questionKey: "cloudCosts",
        answerKey: "cloudCostsAnswer",
      },
    ],
    stats: [
      { value: "99.99%", label: "Uptime SLA", icon: "Activity" },
      { value: "Auto", label: "Scaling", icon: "TrendingUp" },
      { value: "CI/CD", label: "Pipelines", icon: "GitBranch" },
      { value: "IaC", label: "Infrastructure as Code", icon: "FileCode" },
    ],
    caseStudies: [
      {
        title: "Cloud Migration & Optimization",
        description: "Migrated legacy monolith to modern cloud infrastructure with Kubernetes and automated deployments.",
        results: [
          "Zero downtime migration",
          "50% cost reduction",
          "Auto-scaling enabled",
        ],
      },
    ],
  },
];
