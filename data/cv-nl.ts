import { CVData } from "./cv";

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
  
  summary: `Ervaren Full-Stack Developer met 12+ jaar ervaring, gespecialiseerd in React, Next.js, TypeScript en AI-automatisering. Bewezen staat van dienst in het bouwen van schaalbare enterprise platformen, mobiele applicaties en e-commerce oplossingen. Expert in moderne ontwikkelpraktijken waaronder CI/CD, monorepo-architectuur en toegankelijkheid (WCAG). Gepassioneerd over het inzetten van cutting-edge technologieën om uitzonderlijke gebruikerservaringen te leveren en bedrijfsgroei te stimuleren.`,
  
  skills: [
    {
      category: "Frontend Ontwikkeling",
      items: [
        "React 19", "Next.js 16", "TypeScript", "JavaScript (ES6+)", "Vue.js", "Angular",
        "HTML5", "CSS3", "Tailwind CSS", "SASS/SCSS", "Styled Components",
        "Responsive Design", "Progressive Web Apps (PWA)", "Web Toegankelijkheid (WCAG)",
        "Storybook", "Framer Motion", "React Native", "Expo"
      ]
    },
    {
      category: "Backend Ontwikkeling",
      items: [
        "Node.js", "Python", "FastAPI", "Java", "Spring Boot",
        "REST APIs", "GraphQL", "Microservices Architectuur",
        "PostgreSQL", "MongoDB", "Redis", "Supabase",
        "Authenticatie & Autorisatie", "API Design"
      ]
    },
    {
      category: "AI & Automatisering",
      items: [
        "OpenAI API", "LangChain", "AI Agents", "Machine Learning Integratie",
        "n8n Workflow Automatisering", "Playwright Automatisering", "Proces Optimalisatie"
      ]
    },
    {
      category: "DevOps & Tools",
      items: [
        "Docker", "Git", "GitHub", "GitLab CI/CD", "Jenkins",
        "Vercel", "Azure", "AWS", "Turborepo", "pnpm",
        "ESLint", "Jest", "SonarQube", "Agile/Scrum"
      ]
    },
    {
      category: "E-Commerce & Platformen",
      items: [
        "MedusaJS", "Stripe Integratie", "SAP Hybris Commerce",
        "Betalingsverwerking", "Multi-tenant Architectuur", "POS Systemen"
      ]
    },
    {
      category: "Soft Skills",
      items: [
        "Technisch Leiderschap", "Team Mentoring", "Stakeholder Communicatie",
        "Probleemoplossing", "Projectmanagement", "Code Review",
        "Agile Methodologieën", "Cross-functionele Samenwerking"
      ]
    }
  ],
  
  experience: [
    {
      title: "Senior Front-end Developer",
      company: "SURF",
      location: "Utrecht, Nederland",
      period: "Maart 2025 – Heden",
      description: "Bouwen van enterprise whitelabel platform met ondersteuning voor meerdere Next.js applicaties in Turborepo monorepo. Ontwikkeling van gedeelde UI component bibliotheek met Tailwind CSS, TypeScript en Storybook voor Edusources en MBOdata.",
      achievements: [
        "Ontwikkeltijd verminderd met 40% door gedeelde component bibliotheek",
        "100% WCAG 2.1 AA compliance bereikt",
        "Geautomatiseerde CI/CD pipelines geïmplementeerd voor betrouwbare deployments"
      ],
      technologies: ["Next.js", "Turborepo", "TypeScript", "Tailwind CSS", "Storybook", "GitLab CI/CD"]
    },
    {
      title: "Oprichter & Lead Developer",
      company: "Hifive",
      location: "Zaandam, Nederland",
      period: "Juli 2013 – Heden",
      description: "Opgericht digitaal innovatiebureau gespecialiseerd in maatwerk e-commerce platformen, mobiele applicaties en websites met AI-technologieën en software-integraties.",
      achievements: [
        "Succesvol 100+ maatwerk projecten opgeleverd",
        "Langdurige partnerschappen opgebouwd met 50+ klanten",
        "Pionier in AI-integratie in Nederlandse MKB-markt",
        "95% klantretentie behouden"
      ],
      technologies: ["Next.js", "React Native", "AI/ML", "Python", "FastAPI", "TypeScript", "E-commerce"]
    },
    {
      title: "Senior Frontend Developer",
      company: "VodafoneZiggo",
      location: "Utrecht, Nederland",
      period: "November 2024 – Maart 2025",
      description: "Ontwikkeling van hoogperformante cross-platform mobiele applicaties met React Native, Expo en TypeScript. Opbouw van schaalbaar design systeem met Storybook.",
      achievements: [
        "Mobiele app opgeleverd voor 3M+ actieve gebruikers",
        "99.9% uptime en 4.5+ ster app store rating bereikt",
        "Component ontwikkeltijd verminderd met 50% door design systeem",
        "90%+ test coverage behouden"
      ],
      technologies: ["React Native", "Expo", "TypeScript", "Storybook", "Jest", "WCAG"]
    },
    {
      title: "Full-Stack Engineer",
      company: "BraveLink",
      location: "Amsterdam, Nederland",
      period: "April 2024 – Oktober 2024",
      description: "Data-gedreven talent matchmaker die software ontwikkelingsexpertise combineert met een mensgericht benadering.",
      achievements: [
        "Succesvol 50+ professionals geplaatst in ideale rollen",
        "95% plaatsing retentie na 6 maanden bereikt",
        "Data-gedreven matching algoritmes gebouwd"
      ],
      technologies: ["Data Analyse", "Full-Stack Ontwikkeling", "TypeScript", "React", "Node.js"]
    },
    {
      title: "Senior Frontend Developer",
      company: "BraveOrange",
      location: "Amsterdam, Nederland",
      period: "September 2023 – Oktober 2024",
      description: "Full-stack ontwikkeling met Java, Spring Boot, JavaScript en TypeScript. Bouwen van uitgebreide webapplicaties met moderne frameworks.",
      achievements: [
        "Meerdere enterprise webapplicaties opgeleverd",
        "Frontend en backend systemen naadloos geïntegreerd",
        "Junior developers gementord in best practices"
      ],
      technologies: ["React", "Next.js", "TypeScript", "Java", "Spring Boot", "Node.js"]
    },
    {
      title: "Front-end Developer",
      company: "Robidus",
      location: "Nederland",
      period: "Maart 2021 – December 2021",
      description: "Ontwikkeling van geavanceerd applicatieplatform met integratie van diverse datastromen voor WGA en Ziektewet begeleiding.",
      achievements: [
        "Platform gebouwd dat 10.000+ zaken jaarlijks verwerkt",
        "Zaakverwerktijd verminderd met 50%",
        "100% GDPR compliance behouden"
      ],
      technologies: ["Next.js", "TypeScript", "React", "Jenkins", "CI/CD"]
    },
    {
      title: "Hybris E-Commerce Developer",
      company: "Timber and Building Supplies Holland N.V",
      location: "Zaandam, Nederland",
      period: "Maart 2019 – Februari 2020",
      description: "Frontend ontwikkeling voor SAP Hybris E-Commerce platform met diepe integratie in backend systemen.",
      achievements: [
        "50.000+ product SKUs beheerd",
        "€5M+ aan jaarlijkse online verkopen verwerkt",
        "1.000+ B2B klanten succesvol bediend"
      ],
      technologies: ["SAP Hybris", "Java", "SAP Integratie", "E-Commerce", "Frontend"]
    }
  ],
  
  projects: [
    {
      name: "SURF Whitelabel Platform (Edusources & MBOdata)",
      description: "Enterprise whitelabel platform met ondersteuning voor meerdere Next.js applicaties in Turborepo monorepo met gedeelde UI component bibliotheek voor 50.000+ educatieve bronnen.",
      technologies: ["Next.js", "Turborepo", "TypeScript", "Tailwind CSS", "Storybook", "GitLab CI/CD"],
      achievements: [
        "Ontwikkeltijd verminderd met 40% door gedeelde component bibliotheek",
        "100% WCAG 2.1 AA compliance bereikt",
        "Geautomatiseerde CI/CD pipelines geïmplementeerd"
      ]
    },
    {
      name: "Quote Tool met 3D Bestand Parsing",
      description: "Geavanceerd productie offertetool met 3D CAD bestand parsing voor geautomatiseerde plaatwerk kostenschatting.",
      technologies: ["Next.js", "Three.js", "Python", "CAD Parser", "FastAPI"],
      achievements: [
        "Offerte generatietijd verminderd van 2 uur naar 2 minuten",
        "Offerte nauwkeurigheid verbeterd met 95%",
        "Verwerking van 500+ offertes per maand"
      ]
    },
    {
      name: "AI Solutions Architectuur - De Vries Surface Technologies",
      description: "Uitgebreide AI-transformatie met implementatie van intelligente procesautomatisering over meerdere bedrijfsworkflows.",
      technologies: ["AI/ML", "Azure", "Python", "FastAPI", "Power BI"],
      achievements: [
        "Handmatige verwerkingstijd verminderd met 70%",
        "Kwaliteitsvoorspelling nauwkeurigheid verbeterd naar 92%",
        "€180K+ jaarlijkse kostenbesparingen gegenereerd"
      ]
    },
    {
      name: "VodafoneZiggo Mobiele Applicatie",
      description: "Hoogperformante cross-platform mobiele app met React Native voor 3M+ actieve gebruikers met 99.9% uptime.",
      technologies: ["React Native", "Expo", "TypeScript", "Storybook", "Jest"],
      achievements: [
        "4.5+ ster rating op app stores bereikt",
        "90%+ test coverage behouden",
        "Schaalbaar design systeem gebouwd met Storybook"
      ]
    },
    {
      name: "AllyScan - AI-Aangedreven Toegankelijkheidsscanner",
      description: "Uitgebreid toegankelijkheidstest platform dat 50+ organisaties helpt WCAG compliance te bereiken.",
      technologies: ["Next.js", "Python", "AI/ML", "PostgreSQL"],
      achievements: [
        "Toegankelijkheidstest tijd verminderd met 80%",
        "Meer dan 10.000 toegankelijkheidsproblemen geïdentificeerd en opgelost",
        "Organisaties geholpen WCAG 2.1 AA compliance te bereiken"
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
      name: "Angular 2 en Node.js - De Praktische Gids",
      issuer: "Udemy",
      date: "2017"
    },
    {
      name: "Leer en Begrijp AngularJS",
      issuer: "Udemy",
      date: "2016"
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
      proficiency: "Professioneel Werkend Niveau"
    }
  ]
};
