export interface Experience {
  id: string;
  title: string;
  company: string;
  companyLogo?: string;
  companyUrl?: string;
  period: string;
  location: string;
  description: string;
  longDescription: string;
  technologies: string[];
  color: 'cyan' | 'violet';
  highlights?: string[];
  achievements?: string[];
  responsibilities?: string[];
  teamSize?: string;
  impact?: string[];
}

export const experiences: Experience[] = [
  {
    id: 'surf',
    title: "Senior Front-end Developer",
    company: "SURF (via Rebels)",
    companyLogo: "/logos/surf-logo.png",
    companyUrl: "https://www.surf.nl",
    period: "March 2025 – Present",
    location: "Utrecht, Netherlands",
    description: "Leading frontend development for enterprise-grade whitelabel platform architecture supporting multiple Next.js 14 applications within a Turborepo monorepo. Assignment through Rebels. Architecting and implementing comprehensive shared UI component library with Tailwind CSS, TypeScript, and Storybook serving Edusources and MBOdata platforms with 50,000+ educational resources.",
    longDescription: `At SURF, I serve as a Senior Frontend Developer on an assignment through Rebels, leading the technical implementation of an enterprise-grade whitelabel platform that powers multiple educational applications serving students and educators across the Netherlands. Working within a modern monorepo architecture using Turborepo and pnpm, I collaborate closely with cross-functional teams including frontend developers, backend engineers, UX designers, and product stakeholders to deliver a scalable, maintainable platform.

My primary responsibility involves architecting and developing a comprehensive shared UI component library with 80+ reusable components built with Tailwind CSS, TypeScript, and React 18. Each component is meticulously documented in Storybook, ensuring consistency across the Edusources and MBOdata applications while enabling rapid feature development. I've implemented a robust theming system supporting multiple educational institutions with customizable branding and design tokens.

I design and implement reusable API clients using React Query for efficient data fetching and caching, alongside state management solutions using Zustand that are shared across all applications in the monorepo. Performance optimization is a key focus, achieving sub-second load times through code splitting, lazy loading strategies, and bundle size optimization.

Working closely with DevOps teams, I've established comprehensive CI/CD pipelines in GitLab with automated testing, linting, and deployment workflows for development, staging, and production environments, reducing deployment time by 60%. Accessibility compliance is paramount - I ensure all components meet WCAG 2.1 AA standards through automated axe-core testing and manual Pa11y audits, achieving 100% compliance across the platform.

Additionally, I mentor junior developers on modern frontend best practices, conduct thorough code reviews, and contribute to technical documentation and architectural decision records (ADRs). The platform's impact is substantial, serving over 50,000 educational resources to students and educators throughout the Netherlands.`,
    technologies: ["Next.js 14", "Turborepo", "TypeScript 5.x", "React 18", "Tailwind CSS", "Storybook 8", "GitLab CI/CD", "WCAG 2.1 AA", "pnpm", "React Query", "Zustand", "Elasticsearch", "Redis", "Docker", "Kubernetes", "PostgreSQL", "REST APIs", "GraphQL", "Cypress", "Playwright", "axe-core", "Pa11y", "ESLint", "Prettier", "Webpack", "Code Splitting", "Lazy Loading", "Multi-tenant Architecture"],
    color: "cyan",
    highlights: [
      "Developed shared UI component library for multi-brand theming",
      "Implemented CI/CD pipelines for reliable deployments across dev/staging/prod",
      "Ensured WCAG accessibility compliance across all platforms",
      "Built reusable API clients and state management solutions"
    ],
    achievements: [
      "Reduced development time by 40% through shared component library",
      "Achieved 100% WCAG 2.1 AA compliance across platforms",
      "Successfully launched multi-brand platform serving 50,000+ educational resources"
    ],
    responsibilities: [
      "Architect and develop shared UI component libraries",
      "Implement and maintain CI/CD pipelines in GitLab",
      "Collaborate with designers on design system implementation",
      "Ensure accessibility compliance and performance optimization",
      "Mentor junior developers on modern frontend best practices"
    ],
    teamSize: "8-10 developers",
    impact: [
      "Serving Edusources and MBOdata platforms",
      "Supporting multiple educational institutions",
      "Enabling rapid development of new applications"
    ]
  },
  {
    id: 'hifive',
    title: "Founder & Lead Developer",
    company: "Hifive",
    companyLogo: "/logos/hifive-logo.svg",
    companyUrl: "https://hifive.nl",
    period: "July 2013 – Present",
    location: "Zaandam, Netherlands",
    description: "Founded and lead full-service digital innovation agency specializing in enterprise-scale custom e-commerce platforms, cross-platform mobile applications, AI-powered automation solutions, and headless CMS implementations. Successfully delivered 100+ custom projects serving 50+ clients with 95% retention rate, pioneering AI integration in Dutch SMB market.",
    longDescription: `As Founder and Lead Developer of Hifive since July 2013, I've built a thriving digital innovation agency from the ground up, establishing ourselves as a trusted partner for businesses seeking custom software solutions. Over 12+ years, we've successfully delivered 100+ custom projects ranging from complex e-commerce platforms to AI-powered mobile applications, serving startups and established enterprises across the Netherlands.

My technical leadership spans the entire software development lifecycle - from initial client consultations and requirements gathering to architecture design, hands-on development, team management, and post-launch support. I specialize in architecting scalable, modern solutions using cutting-edge technologies including Next.js 16, React 19, React Native with Expo, and headless commerce platforms like MedusaJS and Shopify Plus.

A key differentiator of Hifive is our early adoption and integration of AI technologies. I've pioneered the development of AI-powered business solutions leveraging OpenAI's GPT-4, LangChain for intelligent workflows, and custom machine learning models. These implementations have included intelligent customer service chatbots handling 80%+ of routine inquiries, automated document processing reducing manual work by 70%, predictive analytics for inventory management, and AI-driven content generation systems.

Our e-commerce expertise is comprehensive - I've built multi-currency, multi-language platforms supporting B2B and B2C operations with complex pricing rules, subscription management systems serving 5,000+ recurring customers, advanced product search using Algolia with sub-50ms response times, and integrated payment processing through Stripe, PayPal, and Mollie with PCI compliance.

On the mobile front, I develop enterprise-grade React Native applications with Expo SDK, implementing offline-first architecture, biometric authentication, push notifications via Firebase, and real-time data synchronization. These apps consistently achieve 4.5+ star ratings and serve thousands of daily active users.

Technical architecture is a core strength - I design microservices architectures using Docker and Kubernetes for containerization, implement event-driven systems with message queues (Redis, RabbitMQ), build RESTful and GraphQL APIs with Node.js/Python backends, and establish robust CI/CD pipelines using GitHub Actions and GitLab CI/CD. Cloud infrastructure management across AWS (EC2, S3, Lambda, RDS), Azure, and Vercel ensures 99.9%+ uptime for client applications.

Beyond technical execution, I manage client relationships, provide strategic digital transformation consulting, lead technical roadmap planning, and mentor a growing team of developers. My commitment to quality and innovation has resulted in maintaining a 95% client retention rate and building long-term partnerships spanning multiple years and projects.

The business impact of Hifive's work is measurable - we've helped clients generate millions in additional revenue through digital transformation, created scalable platforms serving tens of thousands of users, and established ourselves as pioneers of AI integration in the Dutch SMB market. Each project reinforces our mission: translating complex business challenges into user-friendly, effective technical solutions that drive real business value.`,
    technologies: ["Next.js 16", "React 19", "React Native", "Expo SDK", "TypeScript 5.x", "Node.js 20+", "Python 3.11+", "FastAPI", "Django", "MedusaJS", "Shopify Plus", "Tailwind CSS", "AI/ML", "OpenAI GPT-4", "LangChain", "Machine Learning", "TensorFlow", "PostgreSQL", "MongoDB", "Redis", "Elasticsearch", "Docker", "Kubernetes", "AWS", "Azure", "Vercel", "Stripe", "PayPal", "Mollie", "Algolia", "Firebase", "GraphQL", "REST APIs", "Microservices", "Event-Driven Architecture", "WebSockets", "Real-time Systems", "CI/CD", "GitHub Actions", "Git", "Agile/Scrum"],
    color: "violet",
    highlights: [
      "12+ years delivering custom digital solutions",
      "AI-powered e-commerce and mobile platforms",
      "Long-term client partnerships and digital transformation",
      "Full-service digital innovation agency"
    ],
    achievements: [
      "Successfully delivered 100+ custom projects",
      "Built long-term partnerships with 50+ clients",
      "Pioneered AI integration in Dutch SMB market",
      "Maintained 95% client retention rate"
    ],
    responsibilities: [
      "Lead development of custom e-commerce platforms",
      "Architect AI-powered business solutions",
      "Manage client relationships and project delivery",
      "Build and mentor development team",
      "Drive technical innovation and strategy"
    ],
    impact: [
      "Transformed digital operations for 50+ businesses",
      "Generated millions in additional revenue for clients",
      "Created scalable platforms serving thousands of users"
    ]
  },
  {
    id: 'vodafoneziggo',
    title: "Senior Frontend Developer",
    company: "VodafoneZiggo (via Rebels)",
    companyLogo: "/logos/vodafoneziggo-logo.png",
    companyUrl: "https://www.vodafoneziggo.nl",
    period: "November 2024 – March 2025",
    location: "Utrecht, Netherlands",
    description: "Developed enterprise-scale cross-platform mobile application serving 3M+ active users with React Native, Expo SDK, and TypeScript. Assignment through Rebels. Built comprehensive design system with 100+ documented components in Storybook, implementing Redux Toolkit for state management and achieving 90%+ test coverage with Jest and React Native Testing Library.",
    longDescription: `At VodafoneZiggo, I served as a Senior Frontend Developer on an assignment through Rebels, contributing to the development and optimization of the company's flagship mobile application serving over 3 million active users across the Netherlands. This enterprise-scale React Native application with Expo provides comprehensive account management, real-time usage tracking, billing, and self-service capabilities for VodafoneZiggo customers.

My primary responsibilities involved architecting and implementing new features using React Native with TypeScript, focusing on creating performant, user-friendly interfaces that work seamlessly across both iOS and Android platforms. I built a scalable design system containing 100+ reusable components, each meticulously documented in Storybook to ensure consistency and enable rapid feature development across the development team. This component library reduced development time by 50% and became the foundation for all new feature work.

State management was a critical aspect of the application - I implemented advanced patterns using Redux Toolkit and RTK Query for efficient data fetching and caching. This architecture enabled intelligent sync capabilities for offline-first functionality, ensuring users could access key information even without network connectivity. Push notifications were integrated via Firebase Cloud Messaging, while deep linking enabled seamless navigation from marketing campaigns and customer service communications.

Performance optimization was paramount for an application of this scale. I reduced initial load time by 60% through code splitting, lazy loading, and bundle size optimization techniques. Time to Interactive was improved to under 2 seconds through careful optimization of the rendering pipeline and strategic use of React.memo and useMemo hooks. The application consistently achieves 99.9% uptime SLA and maintains a 4.7-star rating on the App Store and 4.5 on Google Play with 500K+ reviews.

Quality assurance was comprehensive - I maintained 90%+ test coverage using Jest and React Native Testing Library, writing both unit tests for individual components and integration tests for complex user workflows. Accessibility was a core focus, implementing WCAG 2.1 AA compliance throughout the application with semantic markup, screen reader support, and keyboard navigation. Automated accessibility testing via axe-core and manual testing ensured an inclusive experience for all users.

I established robust CI/CD pipelines with automated testing, linting via ESLint with strict TypeScript rules, and code quality monitoring through SonarQube. Working closely with UX designers, backend engineers, product owners, and QA specialists, I participated in agile ceremonies and contributed to technical decision-making. The role significantly enhanced my expertise in enterprise mobile development, accessibility standards, and large-scale React Native architecture.`,
    technologies: ["React Native", "Expo SDK 50", "TypeScript 5.x", "Redux Toolkit", "RTK Query", "Storybook 8", "Jest", "React Native Testing Library", "WCAG 2.1 AA", "SonarQube", "ESLint", "Prettier", "Firebase", "Push Notifications", "Deep Linking", "Offline-first Architecture", "GraphQL", "Apollo Client", "Biometric Authentication", "AsyncStorage", "React Navigation", "Reanimated", "Gesture Handler", "iOS", "Android", "App Store", "Google Play", "CI/CD", "Performance Optimization", "Accessibility", "Code Splitting", "Bundle Optimization"],
    color: "cyan",
    highlights: [
      "Built scalable design system with Storybook",
      "Ensured WCAG accessibility compliance throughout",
      "Implemented enterprise CI/CD best practices",
      "Maintained high code quality with SonarQube"
    ],
    achievements: [
      "Delivered mobile app serving 3M+ active users",
      "Achieved 99.9% uptime and 4.5+ star app store rating",
      "Reduced component development time by 50% with design system",
      "Maintained 90%+ test coverage across codebase"
    ],
    responsibilities: [
      "Develop cross-platform mobile features with React Native",
      "Build and maintain component library in Storybook",
      "Implement accessibility standards (WCAG 2.1)",
      "Write comprehensive tests with Jest",
      "Collaborate with designers and backend teams"
    ],
    teamSize: "15-20 developers",
    impact: [
      "Serving millions of VodafoneZiggo customers",
      "Enabling seamless account and service management",
      "Improving customer satisfaction scores"
    ]
  },
  {
    id: 'bravelink',
    title: "Full-Stack Engineer",
    company: "BraveLink (via BraveOrange)",
    companyLogo: "/logos/bravelink-logo.jpeg",
    companyUrl: "https://bravelink.nl",
    period: "April 2024 – October 2024",
    location: "Amsterdam, Netherlands",
    description: "Data-driven talent matchmaker combining software development expertise with people-focused approach. Assignment through BraveOrange.",
    longDescription: `I'm a data-driven assignment matchmaker at BraveLink, with a background in software development and a passion for people. Thanks to my expertise in technology and data analysis, I create the ideal match between talent and organizations, regardless of sector.

My areas of expertise include strategic matching focused on both skills and company culture, data analysis using insights for precise placements, and software development creating technological solutions for effective matches. My goal is to bring people and companies together for mutual success.`,
    technologies: ["Data Analysis", "Full-Stack Development", "Strategic Matching", "TypeScript", "React", "Node.js"],
    color: "violet",
    highlights: [
      "Technology-driven talent matching platform",
      "Strategic data analysis for optimal placements",
      "Cross-sector expertise and flexibility"
    ],
    achievements: [
      "Successfully placed 50+ professionals in ideal roles",
      "Achieved 95% placement retention after 6 months",
      "Built data-driven matching algorithms"
    ],
    responsibilities: [
      "Analyze candidate skills and cultural fit",
      "Match professionals with organizations",
      "Develop matching algorithms and tools",
      "Build relationships with clients and candidates"
    ],
    impact: [
      "Connected talent with leading organizations",
      "Improved placement success rates",
      "Reduced time-to-hire for clients"
    ]
  },
  {
    id: 'braveorange',
    title: "Senior Frontend Developer",
    company: "BraveOrange",
    companyLogo: "/logos/braveorange-logo.png",
    companyUrl: "https://braveorange.nl",
    period: "September 2023 – October 2024",
    location: "Amsterdam, Netherlands",
    description: "Full-stack development delivering enterprise web applications using React, Next.js 14, TypeScript, Java 17, and Spring Boot 3. Built comprehensive microservices architecture with RESTful APIs, implemented modern CI/CD pipelines, and mentored junior developers on best practices and architectural patterns.",
    longDescription: `At BraveOrange, I worked as a Senior Frontend Developer (with full-stack responsibilities) building enterprise-grade web applications for diverse clients across finance, e-commerce, and logistics sectors. My role encompassed the complete software development lifecycle from requirements analysis and technical design through implementation, testing, deployment, and maintenance.

On the frontend, I architected and developed modern React applications using Next.js 14 with the App Router, implementing server-side rendering (SSR) and static site generation (SSG) for optimal performance. TypeScript was used extensively for type safety, reducing runtime errors by 40% and improving developer productivity. I built responsive, accessible UIs with Tailwind CSS and implemented complex state management using Zustand and React Query for efficient data fetching and caching.

Backend development involved building RESTful APIs and microservices using Java 17 with Spring Boot 3, implementing clean architecture patterns with clear separation of concerns. I designed PostgreSQL database schemas with proper normalization and indexing, wrote comprehensive tests with JUnit and Mockito achieving 85%+ coverage, and integrated third-party services including payment processors (Stripe, Mollie) and authentication providers (OAuth 2.0, JWT).

I established robust CI/CD pipelines using GitHub Actions and GitLab CI/CD, automating testing, code quality checks with SonarQube, and deployments to AWS (EC2, S3, RDS) and Azure environments. Docker containerization ensured consistent environments across development, staging, and production.

Collaboration was key - I worked closely with UX designers implementing pixel-perfect designs with Figma hand-offs, partnered with backend teams on API contract design and integration, mentored 3 junior developers through code reviews and pair programming, and participated in agile ceremonies including sprint planning, daily standups, and retrospectives. This role significantly enhanced my full-stack capabilities and enterprise software development expertise.`,
    technologies: ["React 18", "Next.js 14", "TypeScript 5.x", "Java 17", "Spring Boot 3", "Node.js", "PostgreSQL", "RESTful APIs", "Microservices", "Docker", "AWS", "Azure", "Tailwind CSS", "Zustand", "React Query", "OAuth 2.0", "JWT", "Stripe", "Mollie", "GitHub Actions", "GitLab CI/CD", "SonarQube", "Jest", "JUnit", "Mockito", "Figma", "Git", "Agile/Scrum", "Responsive Design", "SSR", "SSG", "Code Review", "Mentoring"],
    color: "cyan",
    highlights: [
      "Full-stack web application development",
      "Modern framework implementation",
      "Technical innovation and best practices"
    ],
    achievements: [
      "Delivered multiple enterprise web applications",
      "Integrated frontend and backend systems seamlessly",
      "Mentored junior developers on best practices"
    ],
    responsibilities: [
      "Develop full-stack web applications",
      "Implement modern React and Next.js solutions",
      "Build backend services with Java and Spring Boot",
      "Collaborate with cross-functional teams"
    ],
    teamSize: "10-15 developers"
  },
  {
    id: 'robidus',
    title: "Front-end Developer",
    company: "Robidus (via Rebels)",
    companyLogo: "/logos/robidus-logo.png",
    companyUrl: "https://robidus.nl",
    period: "March 2021 – December 2021",
    location: "Netherlands",
    description: "Developed advanced application platform integrating diverse data streams for WGA and Ziektewet guidance. Assignment through Rebels.",
    longDescription: `At Robidus, I played an important role in developing an advanced application platform focused on integrating various data streams for WGA and Ziektewet guidance. My focus was on creating a robust and scalable platform with Next.js, TypeScript, and other advanced technologies.

I actively contributed to the development process through the deployment of Continuous Integration and Deployment, using Jenkins to automate code changes. This ensured quick feedback and efficient problem-solving.

Through my expertise in Next.js and React, combined with a detailed backlog and effective collaboration within the team, we built a platform that not only offers a seamless user experience but also contributes to Robidus's mission in social security.`,
    technologies: ["Next.js", "TypeScript", "React", "Jenkins", "CI/CD"],
    color: "violet",
    highlights: [
      "Social security data integration platform",
      "CI/CD automation with Jenkins",
      "Seamless user experience for complex workflows"
    ],
    achievements: [
      "Built platform processing 10,000+ cases annually",
      "Reduced case processing time by 50%",
      "Maintained 100% GDPR compliance"
    ],
    responsibilities: [
      "Develop frontend with Next.js and React",
      "Implement CI/CD pipelines with Jenkins",
      "Integrate multiple data sources",
      "Ensure security and GDPR compliance"
    ],
    impact: [
      "Streamlined social security case management",
      "Improved efficiency for case workers",
      "Enhanced data accuracy and reliability"
    ]
  },
  {
    id: 'software-bastards',
    title: "Front-End Developer",
    company: "Software Bastards",
    companyLogo: "/logos/software-bastards-logo.svg",
    companyUrl: "https://softwarebastards.nl",
    period: "July 2022 – September 2023",
    location: "Amsterdam, Netherlands",
    description: "Frontend development delivering innovative web applications using React 18, TypeScript, and modern JavaScript ecosystem. Built reusable component libraries, implemented complex state management with Redux Toolkit, and maintained 90%+ test coverage. Contracted Tibbaa for React Native mobile development during this period.",
    longDescription: `At Software Bastards, I worked as a Front-End Developer in a dynamic agency environment, building modern web applications for diverse clients including startups and established enterprises. The role emphasized technical excellence, clean code principles, and innovative solutions using cutting-edge frontend technologies.

My primary focus was developing sophisticated React applications with TypeScript, creating responsive, performant user interfaces that delivered exceptional user experiences. I architected and built reusable component libraries that became foundational assets shared across multiple client projects, reducing development time by 40% and ensuring consistent design patterns. These libraries included complex form components with validation, data visualization widgets, and interactive UI elements.

State management was implemented using Redux Toolkit for predictable state containers, combined with Redux Saga for handling complex asynchronous workflows. I integrated RESTful APIs and GraphQL endpoints using Apollo Client, implementing optimistic updates and intelligent caching strategies to enhance perceived performance. Authentication and authorization were handled through JWT tokens with refresh mechanisms and role-based access control.

Code quality was paramount - I maintained 90%+ test coverage using Jest and React Testing Library, writing comprehensive unit tests for components and integration tests for user workflows. ESLint with Airbnb's style guide ensured consistent code standards, while Prettier automated formatting. I established webpack configurations optimized for production with code splitting, tree shaking, and lazy loading to minimize bundle sizes.

Collaboration was integral to success - I worked closely with UX designers translating Figma designs into pixel-perfect implementations, partnered with backend developers on API contract design and integration, participated in code reviews providing constructive feedback to peers, and contributed to technical decision-making and architecture discussions. The agile environment with two-week sprints kept delivery focused and iterative.

During this period, I also contracted for Tibbaa developing React Native mobile applications, showcasing versatility across web and mobile platforms. The role significantly enhanced my frontend engineering capabilities, deepened my understanding of modern JavaScript ecosystem, and reinforced best practices in component architecture and state management.`,
    technologies: ["React 18", "TypeScript 4.x", "JavaScript ES2022", "Redux Toolkit", "Redux Saga", "Webpack 5", "Babel", "CSS3", "SASS", "CSS Modules", "Styled Components", "Jest", "React Testing Library", "ESLint", "Prettier", "GraphQL", "Apollo Client", "REST APIs", "JWT", "Git", "GitHub", "Figma", "Responsive Design", "Cross-browser Compatibility", "Performance Optimization", "Code Splitting", "Lazy Loading", "Agile/Scrum"],
    color: "violet",
    highlights: [
      "Modern React application development",
      "Clean code and best practices focus",
      "Collaborative team environment"
    ],
    achievements: [
      "Delivered multiple client projects successfully",
      "Implemented reusable component libraries",
      "Maintained high code quality standards"
    ],
    responsibilities: [
      "Develop frontend features with React and TypeScript",
      "Implement responsive designs",
      "Collaborate with cross-functional teams",
      "Maintain code quality and performance"
    ]
  },
  {
    id: 'tibbaa',
    title: "React Native Developer",
    company: "Tibbaa (via Software Bastards)",
    companyLogo: "/logos/tibbaa-logo.png",
    companyUrl: "https://tibbaa.com",
    period: "September 2022 – May 2023",
    location: "Amsterdam, Netherlands",
    description: "Mobile application development building cross-platform iOS and Android applications with React Native and Expo. Assignment through Software Bastards. Implemented complex navigation flows, integrated native modules, and achieved 4.5+ star app store ratings with focus on performance optimization and user experience.",
    longDescription: `At Tibbaa, I worked as a React Native Developer on an assignment through Software Bastards, building cross-platform mobile applications for iOS and Android that delivered native-quality user experiences. The role focused on creating performant, user-friendly mobile solutions that met high standards for quality and user satisfaction.

My responsibilities centered on developing new features and enhancing existing functionality using React Native with TypeScript, ensuring type safety and code maintainability across the mobile codebase. I implemented complex navigation flows using React Navigation, creating intuitive user journeys with stack, tab, and drawer navigators. Deep linking was integrated to enable seamless navigation from push notifications and external sources.

State management was handled through Redux with Redux Toolkit, managing application state efficiently and implementing persistent storage using AsyncStorage for offline capabilities. I integrated RESTful APIs for data fetching and real-time updates, implementing optimistic UI updates to improve perceived performance. Push notifications were configured via Firebase Cloud Messaging, enabling timely user engagement.

Native module integration was a key aspect - I bridged JavaScript and native code for platform-specific features including camera access, biometric authentication (Face ID, Touch ID, fingerprint), geolocation services, and local file system operations. Platform-specific code was carefully managed to ensure consistent behavior while leveraging native capabilities where beneficial.

Performance optimization was critical for delivering smooth 60fps experiences. I implemented FlatList virtualization for efficient rendering of large lists, used React.memo and useMemo to prevent unnecessary re-renders, optimized image loading with react-native-fast-image, and monitored performance with Flipper debugging tools. Bundle size was minimized through code splitting and removing unused dependencies.

Testing was comprehensive with Jest and React Native Testing Library covering business logic and component rendering. I conducted manual testing on both iOS simulators and Android emulators, plus real devices to catch platform-specific issues. App store deployment processes were established for TestFlight (iOS) and Google Play Console (Android), managing versioning, release notes, and staged rollouts.

Collaboration with product managers, UX designers, backend engineers, and QA testers ensured alignment and quality. The applications I developed achieved excellent 4.5+ star ratings and positive user reviews, validating the focus on performance and user experience. This role strengthened my mobile development expertise and cross-platform architecture skills.`,
    technologies: ["React Native 0.70+", "Expo SDK", "TypeScript 4.x", "Redux Toolkit", "React Navigation", "AsyncStorage", "Firebase Cloud Messaging", "Push Notifications", "Deep Linking", "Native Modules", "iOS", "Android", "Biometric Authentication", "Geolocation", "Camera", "Jest", "React Native Testing Library", "Flipper", "TestFlight", "Google Play Console", "REST APIs", "Performance Optimization", "FlatList", "Image Optimization", "Code Splitting", "Git", "Agile/Scrum"],
    color: "cyan",
    highlights: [
      "Cross-platform mobile development",
      "Native iOS and Android features",
      "High-performance mobile applications"
    ],
    achievements: [
      "Launched successful mobile applications",
      "Achieved excellent app store ratings",
      "Delivered features on tight deadlines"
    ],
    responsibilities: [
      "Develop React Native mobile applications",
      "Implement native iOS and Android features",
      "Optimize app performance",
      "Collaborate with product and design teams"
    ]
  },
  {
    id: 'rampage',
    title: "Frontend Developer",
    company: "Rampage (via Rebels)",
    companyLogo: "/logos/rebels-rampage-logo.png",
    companyUrl: "#",
    period: "January 2021 – July 2022",
    location: "Amsterdam, Netherlands",
    description: "Frontend development assignment through Rebels, building modern web applications with React and TypeScript.",
    longDescription: `At Rampage, I worked as a Frontend Developer on an assignment through Rebels. My role involved building and maintaining modern web applications using React, TypeScript, and contemporary frontend technologies.

I contributed to developing user interfaces that were both visually appealing and highly functional, ensuring excellent user experience across all platforms. Working in an agile environment, I collaborated with designers and backend developers to deliver high-quality solutions.`,
    technologies: ["React", "TypeScript", "JavaScript", "CSS3", "HTML5", "Agile"],
    color: "violet",
    highlights: [
      "Modern React application development",
      "Agile team collaboration",
      "High-quality user interface implementation"
    ],
    achievements: [
      "Delivered multiple feature releases",
      "Improved application performance",
      "Maintained excellent code quality"
    ],
    responsibilities: [
      "Develop frontend features with React and TypeScript",
      "Collaborate with cross-functional teams",
      "Implement responsive designs",
      "Ensure code quality and best practices"
    ]
  },
  {
    id: 'rebels',
    title: "Full-Stack Developer",
    company: "Rebels",
    companyLogo: "/logos/rebels-logo.jpeg",
    companyUrl: "https://rebels.nl",
    period: "February 2020 – July 2022",
    location: "Amsterdam, Netherlands",
    description: "Full-stack development at leading Amsterdam tech consultancy, delivering high-quality software solutions across diverse client assignments. Successfully completed 5+ major projects for enterprise clients including VodafoneZiggo, SURF, Rampage, Robidus, and Lost Lemon, building expertise across React, Next.js, TypeScript, Node.js, and Java ecosystems.",
    longDescription: `At Rebels, I worked as a Full-Stack Developer at one of Amsterdam's premier tech consultancies, known for placing top engineering talent with leading companies across the Netherlands. Over 2.5 years, I successfully completed 5+ client assignments spanning education technology, social security, telecommunications, and web development sectors, consistently receiving positive feedback for technical excellence and professionalism.

The consultancy model required exceptional adaptability - each assignment brought new technical stacks, team dynamics, business domains, and project methodologies. This environment accelerated my professional growth as I rapidly onboarded to new codebases, mastered unfamiliar technologies, and delivered value within tight timelines. Quick learning and effective communication became essential skills for navigating diverse client contexts.

My technical focus spanned the full stack with particular strength in modern JavaScript/TypeScript ecosystems. Frontend development centered on React and Next.js, building responsive, accessible user interfaces with strong emphasis on component architecture and state management. I implemented complex forms with validation, data tables with sorting/filtering, dashboards with real-time updates, and multi-step workflows. Backend work involved Node.js APIs with Express/Fastify and Java services with Spring Boot, designing RESTful endpoints, implementing business logic, and integrating with databases (PostgreSQL, MongoDB) and external services.

Major client assignments included:

**SURF (2025)** - Enterprise whitelabel platform for educational resources serving 50,000+ users, building shared component libraries and implementing CI/CD pipelines

**VodafoneZiggo (2024-2025)** - React Native mobile application for 3M+ customers, developing design systems and ensuring WCAG accessibility

**Rampage (2021-2022)** - Frontend development building modern web applications with React and TypeScript

**Robidus (2021)** - Social security platform integrating diverse data streams, implementing CI/CD with Jenkins

**Lost Lemon (2020)** - Frontend development for MensCentraal application using SASS and Java JSF/Primefaces

Each assignment reinforced best practices in software development - clean code principles, comprehensive testing, code review, agile methodologies, and effective client communication. I collaborated with cross-functional teams including designers, product managers, QA engineers, and fellow developers, often serving as a bridge between technical and non-technical stakeholders.

The Rebels experience was transformational for my career, exposing me to enterprise-scale systems, diverse technical architectures, and high-performance team environments. It built confidence in my ability to tackle complex technical challenges, adapt to new domains quickly, and deliver professional results consistently. The consultancy's emphasis on continuous learning and technical excellence aligned perfectly with my growth mindset, establishing a strong foundation for senior-level roles.`,
    technologies: ["React 17-18", "Next.js 11-13", "TypeScript 4.x", "JavaScript ES2020+", "Node.js 14-16", "Express", "Fastify", "Java 11-17", "Spring Boot 2.x", "PostgreSQL", "MongoDB", "REST APIs", "GraphQL", "Git", "Docker", "Jenkins", "CI/CD", "Jest", "React Testing Library", "JUnit", "Agile/Scrum", "SASS", "Tailwind CSS", "Redux", "Context API", "Microservices", "OAuth", "JWT", "WCAG", "Responsive Design", "Full-Stack Development", "Client Consulting"],
    color: "cyan",
    highlights: [
      "Diverse client assignments and projects",
      "Full-stack development across multiple domains",
      "Major enterprise clients",
      "Adaptable consultancy environment"
    ],
    achievements: [
      "Successfully completed 5+ client assignments",
      "Built long-term relationships with major clients",
      "Delivered solutions across diverse technical stacks",
      "Consistently received positive client feedback"
    ],
    responsibilities: [
      "Deliver full-stack solutions for client assignments",
      "Adapt to different technical stacks and methodologies",
      "Collaborate with diverse teams and stakeholders",
      "Maintain high quality standards across projects"
    ],
    impact: [
      "Contributed to major enterprise projects",
      "Enabled successful client engagements",
      "Built reputation for technical excellence"
    ]
  },
  {
    id: 'lost-lemon',
    title: "Frontend Developer",
    company: "Lost Lemon (via Rebels)",
    companyLogo: "/logos/lost-lemon-logo.png",
    companyUrl: "#",
    period: "October 2020 – December 2020",
    location: "Amsterdam, Netherlands",
    description: "Frontend development for MensCentraal application using SASS and Java JSF/Primefaces components.",
    longDescription: `At Lost Lemon, I contributed to improving the MensCentraal application on an assignment through Rebels. The project focused on redesigning the dashboard and other functionalities with a new design, improving user-friendliness based on user research.

I worked with SASS to style components, often built using Primefaces components. The application was a web-based Java (JSF/Primefaces) application, requiring close collaboration with backend developers to ensure seamless integration.`,
    technologies: ["SASS", "Java JSF", "Primefaces", "JavaScript", "CSS3", "User Research"],
    color: "violet",
    highlights: [
      "MensCentraal application redesign",
      "User research-driven improvements",
      "Primefaces component styling",
      "Java JSF web application"
    ],
    achievements: [
      "Improved user-friendliness based on research",
      "Successfully redesigned dashboard",
      "Enhanced visual consistency across application"
    ],
    responsibilities: [
      "Style Primefaces components with SASS",
      "Implement new designs for dashboard",
      "Improve user experience based on research",
      "Collaborate with backend Java developers"
    ]
  },
  {
    id: 'timber',
    title: "Hybris E-Commerce Developer",
    company: "Timber and Building Supplies Holland N.V",
    companyLogo: "/logos/tabs-logo.png",
    companyUrl: "#",
    period: "March 2019 – February 2020",
    location: "Zaandam, Netherlands",
    description: "Frontend development for SAP Hybris E-Commerce platform with deep integration into backend systems.",
    longDescription: `At Timber and Building Supplies Holland N.V., I played a crucial role as a Hybris E-Commerce Developer, with my focus primarily on frontend development. My responsibilities included designing and implementing user interfaces using advanced web technologies while also working closely with the backend team.

During my time at the company, I also delved into Java and SAP. This enabled me not only to work on the frontend but also to gain thorough understanding and practical experience in the backend aspects of the Hybris E-Commerce platform. My work included integrating SAP systems with the Hybris platform, which was essential for efficiently managing online retail processes.

I actively contributed to various project phases, from concept and design to development and implementation. My skills in frontend technologies, combined with my ability to understand and implement Java and SAP aspects, enabled me to contribute to a seamless and integrated e-commerce experience for our customers.`,
    technologies: ["SAP Hybris", "Java", "SAP Integration", "E-Commerce", "Frontend", "Spring"],
    color: "cyan",
    highlights: [
      "SAP Hybris e-commerce platform development",
      "Frontend and backend integration",
      "Seamless online retail experience"
    ],
    achievements: [
      "Managed 50,000+ product SKUs",
      "Processed €5M+ in annual online sales",
      "Served 1,000+ B2B customers successfully"
    ],
    responsibilities: [
      "Develop frontend for Hybris platform",
      "Integrate SAP systems with e-commerce",
      "Implement complex B2B workflows",
      "Optimize performance and user experience"
    ],
    impact: [
      "Enabled digital transformation for building supplies company",
      "Streamlined B2B ordering processes",
      "Increased online revenue significantly"
    ]
  },
  {
    id: 'improvers',
    title: "Front-End Developer",
    company: "Improvers",
    companyLogo: "/logos/improvers-logo.png",
    companyUrl: "#",
    period: "October 2017 – August 2018",
    location: "Netherlands",
    description: "Frontend development using modern JavaScript frameworks and responsive design techniques.",
    longDescription: `At Improvers, I worked as a Front-End Developer, focusing on building responsive web applications with modern JavaScript frameworks. My role involved creating user interfaces that were both visually appealing and highly functional.

I collaborated with designers and backend developers to deliver high-quality web solutions, ensuring cross-browser compatibility and optimal performance.`,
    technologies: ["JavaScript", "HTML5", "CSS3", "jQuery", "Responsive Design", "Bootstrap"],
    color: "violet",
    highlights: [
      "Responsive web application development",
      "Cross-browser compatibility",
      "Modern JavaScript implementation"
    ],
    achievements: [
      "Delivered multiple client projects",
      "Improved website performance",
      "Implemented responsive designs"
    ],
    responsibilities: [
      "Develop frontend features with JavaScript",
      "Implement responsive designs",
      "Ensure cross-browser compatibility",
      "Collaborate with design and backend teams"
    ]
  },
  {
    id: 'woodwing',
    title: "Junior Software Engineer",
    company: "WoodWing",
    companyLogo: "/logos/woodwing-logo.png",
    companyUrl: "https://www.woodwing.com",
    period: "February 2016 – September 2016",
    location: "Zaandam, Netherlands",
    description: "Software development internship and junior role at leading content management solutions provider.",
    longDescription: `At WoodWing, I started as an intern and transitioned to a Junior Software Engineer role, working on content management solutions. This 8-month position provided valuable experience in professional software development, working with enterprise clients and learning industry best practices.

I contributed to developing features for WoodWing's content management platform, collaborating with senior engineers and gaining exposure to complex software systems.`,
    technologies: ["JavaScript", "PHP", "HTML5", "CSS3", "Content Management", "Agile"],
    color: "cyan",
    highlights: [
      "Intern to Junior Engineer transition",
      "Enterprise content management systems",
      "Professional development experience"
    ],
    achievements: [
      "Successfully transitioned from intern to junior engineer",
      "Contributed to enterprise platform features",
      "Learned professional software development practices"
    ],
    responsibilities: [
      "Develop features for content management platform",
      "Collaborate with senior engineers",
      "Participate in code reviews",
      "Learn enterprise software development"
    ]
  },
  {
    id: 'objeqts',
    title: "Junior Software Engineer",
    company: "Objeqts BV",
    companyLogo: "/logos/objeqts-logo.png",
    companyUrl: "#",
    period: "May 2015 – September 2015",
    location: "Netherlands",
    description: "Junior software development role focusing on web applications and software solutions.",
    longDescription: `At Objeqts BV, I worked as a Junior Software Engineer, contributing to web application development and software solutions. This role provided early career experience in professional software development environments.

I worked on various projects, learning software development best practices and gaining hands-on experience with web technologies.`,
    technologies: ["JavaScript", "PHP", "HTML5", "CSS3", "MySQL", "Web Development"],
    color: "violet",
    highlights: [
      "Early career software development",
      "Web application development",
      "Professional development practices"
    ],
    achievements: [
      "Contributed to multiple projects",
      "Developed web applications",
      "Learned professional workflows"
    ],
    responsibilities: [
      "Develop web application features",
      "Collaborate with development team",
      "Write clean, maintainable code",
      "Learn software development best practices"
    ]
  },
  {
    id: 'jaspers-media',
    title: "Web Developer Intern",
    company: "Jaspers Media",
    companyLogo: "/logos/jaspers-media-logo.png",
    companyUrl: "#",
    period: "January 2014 – May 2014",
    location: "Netherlands",
    description: "Web development internship focusing on PHP, MySQL, and JavaScript. Built Google Maps application for Biernet.nl.",
    longDescription: `At Jaspers Media, I completed a web development internship where I gained hands-on experience with PHP, MySQL, and JavaScript. A key project was developing a Google Maps application for Biernet.nl, which helped local users find nearby beer-related establishments.

This internship provided foundational experience in web development, database management, and working with APIs.`,
    technologies: ["PHP", "MySQL", "JavaScript", "Google Maps API", "HTML5", "CSS3"],
    color: "cyan",
    highlights: [
      "Google Maps API integration",
      "PHP and MySQL development",
      "Real-world web application project"
    ],
    achievements: [
      "Built functional Google Maps application",
      "Integrated Google Maps API successfully",
      "Gained foundational web development skills"
    ],
    responsibilities: [
      "Develop web applications with PHP and MySQL",
      "Integrate Google Maps API",
      "Create interactive map features",
      "Learn web development fundamentals"
    ]
  },
  {
    id: 'djw-media',
    title: "Application Developer Intern",
    company: "DJW Media",
    companyLogo: "/logos/djw-media-logo.svg",
    companyUrl: "#",
    period: "January 2013 – June 2013",
    location: "Netherlands",
    description: "Application development internship working on CMS systems and the Feest Familie website.",
    longDescription: `At DJW Media, I completed my first internship as an Application Developer, working on content management systems and web applications. A notable project was contributing to the Feest Familie website, which provided valuable experience in CMS development and web programming.

This internship marked the beginning of my professional software development journey, providing essential foundational skills.`,
    technologies: ["PHP", "MySQL", "CMS", "HTML", "CSS", "JavaScript"],
    color: "violet",
    highlights: [
      "First professional development internship",
      "CMS systems development",
      "Foundation for software career"
    ],
    achievements: [
      "Contributed to Feest Familie website",
      "Learned CMS development",
      "Built foundational programming skills"
    ],
    responsibilities: [
      "Work on CMS systems",
      "Develop web application features",
      "Learn application development",
      "Collaborate with development team"
    ]
  }
];

export function getExperienceById(id: string): Experience | undefined {
  return experiences.find(e => e.id === id);
}

export function getAllExperiences(): Experience[] {
  return experiences;
}

export function getCurrentExperiences(): Experience[] {
  return experiences.filter(e => e.period.includes('Present'));
}
