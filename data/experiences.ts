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
    company: "SURF",
    companyLogo: "🎓",
    companyUrl: "https://www.surf.nl",
    period: "March 2025 – Present",
    location: "Utrecht, Netherlands",
    description: "Building enterprise whitelabel platform supporting multiple Next.js applications in Turborepo monorepo. Developing shared UI component library with Tailwind CSS, TypeScript, and Storybook for Edusources and MBOdata.",
    longDescription: `At SURF, I'm part of a collaborative team building and expanding a whitelabel platform that supports multiple Next.js applications within a modern monorepo structure using Turborepo and pnpm. Working alongside frontend developers, backend teams, and designers, we're developing a shared UI component library with Tailwind CSS, TypeScript, and Storybook, enabling different applications to scale and consistently use the same foundation.

We're also developing reusable API clients and state management solutions shared across multiple applications. Together, we've set up CI/CD pipelines in GitLab for development, staging, and production, ensuring releases are reliable and predictable.

In close collaboration with other teams and stakeholders, we ensure the platform is not only scalable and maintainable but also meets modern standards for performance, WCAG accessibility, and multi-brand theming.`,
    technologies: ["Next.js", "Turborepo", "TypeScript", "Tailwind CSS", "Storybook", "GitLab CI/CD", "WCAG", "pnpm"],
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
    companyLogo: "🚀",
    companyUrl: "https://hifive.nl",
    period: "July 2013 – Present",
    location: "Zaandam, Netherlands",
    description: "Founded digital innovation agency specializing in custom e-commerce platforms, mobile applications, and websites with AI technologies and software integrations.",
    longDescription: `At Hifive, we believe in the power of custom solutions to transform businesses. Our expertise in creating unique e-commerce platforms, mobile applications, and custom websites, supported by the latest AI technologies and software integrations, enables us to optimize your digital presence.

At Hifive, we stand for innovation, quality, and customer satisfaction. Our dedicated team of professionals works closely with each client to design solutions that not only meet their current needs but also prepare them for future growth and success. Whether you're a startup or an established enterprise, we provide the tools and insights needed to thrive in an ever-changing digital world.

We take pride in our ability to translate complex challenges into user-friendly, effective solutions. Our approach is always personal, with a focus on building lasting relationships with our clients. Hifive is more than a supplier; we are your partner in digital innovation.`,
    technologies: ["Next.js", "React Native", "AI/ML", "Python", "FastAPI", "TypeScript", "E-commerce", "MedusaJS", "Tailwind"],
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
    company: "VodafoneZiggo",
    companyLogo: "📡",
    companyUrl: "https://www.vodafoneziggo.nl",
    period: "November 2024 – March 2025",
    location: "Utrecht, Netherlands",
    description: "Developed high-performance cross-platform mobile applications with React Native, Expo, and TypeScript. Built scalable design system with Storybook.",
    longDescription: `At VodafoneZiggo, I contributed to the development of high-performance mobile applications as a React Native Developer. My role involved building and optimizing user interfaces with React Native, Expo, and TypeScript, aiming to guarantee a seamless cross-platform experience.

I utilized Storybook to develop and maintain a scalable design system, enabling efficient component testing and UI consistency. Writing robust, maintainable code was central, supported by ESLint for static analysis and Jest for unit and integration testing.

With a strong focus on accessibility (WCAG standards), I ensured the applications were inclusive and compliant with industry norms. Additionally, SonarQube was used to continuously monitor code quality and maintain high development standards.

This experience deepened my expertise in mobile development, accessibility, and CI/CD best practices within an enterprise environment.`,
    technologies: ["React Native", "Expo", "TypeScript", "Storybook", "Jest", "WCAG", "SonarQube", "ESLint"],
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
    company: "BraveLink",
    companyLogo: "🔗",
    companyUrl: "https://bravelink.nl",
    period: "April 2024 – October 2024",
    location: "Amsterdam, Netherlands",
    description: "Data-driven talent matchmaker combining software development expertise with people-focused approach.",
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
    companyLogo: "🍊",
    companyUrl: "https://braveorange.nl",
    period: "September 2023 – October 2024",
    location: "Amsterdam, Netherlands",
    description: "Full-stack development using Java, Spring Boot, JavaScript, and TypeScript. Built comprehensive web applications with modern frameworks.",
    longDescription: `At Brave Orange, I was active as a Fullstack Developer, deploying a wide range of techniques including Java, Spring Boot, JavaScript, and TypeScript. My role encompassed developing and implementing comprehensive web applications.

I brought rich experience in using advanced technologies such as React, Node.js, Next.js, and various other modern frameworks and tools, contributing to my continuously growing passion for technical innovation.`,
    technologies: ["React", "Next.js", "TypeScript", "Java", "Spring Boot", "Node.js"],
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
    company: "Robidus",
    companyLogo: "🏥",
    companyUrl: "https://robidus.nl",
    period: "March 2021 – December 2021",
    location: "Netherlands",
    description: "Developed advanced application platform integrating diverse data streams for WGA and Ziektewet guidance.",
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
    id: 'timber',
    title: "Hybris E-Commerce Developer",
    company: "Timber and Building Supplies Holland N.V",
    companyLogo: "🏗️",
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
