import { Project } from "./projects";

export const projectsNL: Project[] = [
  {
    id: 'allyscan',
    title: "AllyScan",
    description: "AI-aangedreven toegankelijkheidsscanner die websites analyseert op WCAG-naleving en bruikbare aanbevelingen geeft voor verbetering.",
    longDescription: `AllyScan is een uitgebreid AI-aangedreven toegankelijkheidstestplatform dat organisaties helpt ervoor te zorgen dat hun digitale producten toegankelijk zijn voor iedereen. Met behulp van geavanceerde machine learning-algoritmen scant AllyScan automatisch websites en webapplicaties om WCAG 2.1-nalevingsproblemen te identificeren en biedt gedetailleerde, bruikbare aanbevelingen voor herstel.

Het platform beschikt over realtime scannen, geautomatiseerde testworkflows en intelligente rapportage die problemen prioriteert op basis van ernst en impact. AllyScan integreert naadloos in CI/CD-pipelines, waardoor ontwikkelteams toegankelijkheidsproblemen vroeg in het ontwikkelingsproces kunnen opsporen.`,
    image: "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=1200&h=600&fit=crop",
    technologies: ["Next.js", "Python", "AI/ML", "WCAG", "TypeScript", "FastAPI", "PostgreSQL"],
    liveUrl: "https://allyscan.com",
    githubUrl: "https://github.com/leroysteding/allyscan",
    featured: true,
    category: 'product',
    year: '2024',
    challenges: [
      "Bouwen van nauwkeurige AI-modellen voor complexe toegankelijkheidsregeldetectie",
      "Efficiënt verwerken en analyseren van grootschalige webapplicaties",
      "Intuïtieve visualisaties creëren voor technische toegankelijkheidsgegevens"
    ],
    solutions: [
      "Aangepaste ML-modellen ontwikkeld, getraind op WCAG-richtlijnen en praktijkvoorbeelden",
      "Parallelle verwerkingsarchitectuur geïmplementeerd voor snel scannen",
      "Interactieve UI gemaakt met duidelijke prioritering en herstelhandleidingen"
    ],
    impact: [
      "50+ organisaties geholpen om WCAG 2.1 AA-naleving te bereiken",
      "Toegankelijkheidstesttijd met 80% verminderd",
      "Meer dan 10.000 toegankelijkheidsproblemen geïdentificeerd en opgelost"
    ]
  },
  {
    id: 'smart-shop-scraper',
    title: "Smart Shop Scraper",
    description: "Intelligent e-commerce data-extractieplatform met geautomatiseerde productmonitoring, prijsvolgen en concurrentieanalyse.",
    longDescription: `Smart Shop Scraper is een intelligent webscrapingplatform ontworpen voor e-commercebedrijven om concurrenten te monitoren, prijzen te volgen en markttrends te analyseren. Gebouwd met Python en Playwright voor robuuste browserautomatisering, kan het platform productgegevens extraheren uit zelfs de meest complexe moderne webapplicaties.

Het systeem beschikt over intelligente snelheidsbeperking, roterende proxies en geavanceerde anti-detectiemechanismen om betrouwbare gegevensverzameling te garanderen. Met FastAPI-backend en PostgreSQL-database biedt het realtime waarschuwingen, historische trendanalyse en aanpasbare dashboards voor business intelligence.`,
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=1200&h=600&fit=crop",
    technologies: ["Python", "Playwright", "FastAPI", "PostgreSQL", "Redis", "Docker"],
    liveUrl: "https://shopscraper.com",
    githubUrl: "https://github.com/leroysteding/shop-scraper",
    featured: true,
    category: 'product',
    year: '2024',
    challenges: [
      "Omgaan met moderne JavaScript-zware e-commercesites",
      "Detectie en snelheidsbeperking vermijden",
      "Grote hoeveelheden productgegevens verwerken en opslaan"
    ],
    solutions: [
      "Playwright gebruikt voor volledige JavaScript-rendering en interactie",
      "Intelligente proxy-rotatie en verzoekregeling geïmplementeerd",
      "Schaalbare datapijplijn gebouwd met Redis-wachtrij en batchverwerking"
    ],
    impact: [
      "Dagelijks 1M+ producten verwerken op 500+ e-commercesites",
      "Detailhandelaren helpen prijsstrategieën te optimaliseren",
      "Realtime concurrentie-intelligentie bieden"
    ]
  },
  {
    id: 'intelliwealth',
    title: "IntelliWealth",
    description: "AI-gedreven financiële planningsplatform dat gepersonaliseerde beleggingsaanbevelingen en portefeuilleoptimalisatie biedt.",
    longDescription: `IntelliWealth is een AI-aangedreven financieel planningsplatform dat de toegang tot geavanceerd beleggingsadvies democratiseert. Met behulp van geavanceerde machine learning-algoritmen analyseert het platform de financiële situatie, risicotolerantie en doelen van gebruikers om gepersonaliseerde beleggingsaanbevelingen en portefeuilleoptimalisatiestrategieën te bieden.

Gebouwd met Next.js en Supabase, beschikt IntelliWealth over realtime marktdata-integratie, geautomatiseerde portefeuilleherschikking en AI-agents die voortdurend aanbevelingen monitoren en aanpassen op basis van marktomstandigheden en gebruikersvoorkeuren. Het platform integreert met Stripe voor naadloos abonnementsbeheer.`,
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&h=600&fit=crop",
    technologies: ["Next.js", "Supabase", "AI Agents", "Stripe", "TypeScript", "Financial APIs"],
    liveUrl: "https://intelliwealth.com",
    githubUrl: "https://github.com/leroysteding/intelliwealth",
    featured: true,
    category: 'product',
    year: '2023',
    challenges: [
      "Realtime financiële marktdata integreren",
      "Vertrouwen en veiligheid opbouwen voor financiële gegevens",
      "AI-modellen creëren die aansluiten bij regelgevende compliance"
    ],
    solutions: [
      "Meerdere financiële data-API's geïntegreerd met fallback-mechanismen",
      "Encryptie en beveiligingsmaatregelen op bankniveau geïmplementeerd",
      "AI-aanbevelingssysteem ontworpen met compliance-beschermingsmechanismen"
    ],
    impact: [
      "2.000+ actieve gebruikers bedienen met gepersonaliseerd financieel advies",
      "$5M+ beheerd aan bijgehouden portefeuillewaarde",
      "Gemiddelde portefeuilleprestatieverbetering van 12%"
    ]
  },
  {
    id: 'lotto-manager',
    title: "Lotto Manager",
    description: "Loterijsyndicaatbeheersysteem met geautomatiseerde lotvolging, prijzendistributie en ledenbeheer.",
    longDescription: `Lotto Manager is een uitgebreid platform voor loterijsyndicaatbeheer dat groepsloterijspel vereenvoudigt. Het systeem automatiseert lotvolging, berekeningen voor prijzendistributie en ledenbeheer, waardoor het voor groepen gemakkelijk wordt om samen te spelen met eerlijke en transparante prijzendeling.

Gebouwd met Next.js en TypeScript, beschikt het platform over Stripe-integratie voor het innen van ledenbijdragen, geautomatiseerde prijsberekeningsalgoritmen en gedetailleerde rapportage. Het systeem ondersteunt meerdere loterijtypen en valuta's, met realtime meldingen voor winsten en trekkingen.`,
    image: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=1200&h=600&fit=crop",
    technologies: ["Next.js", "TypeScript", "Supabase", "Stripe", "Automated Calculations"],
    liveUrl: "https://lottomanager.com",
    githubUrl: null,
    featured: false,
    category: 'product',
    year: '2023',
    challenges: [
      "Nauwkeurige en eerlijke prijsverdelingsberekeningen garanderen",
      "Vertrouwen en transparantie beheren in financiële transacties",
      "Verschillende loterijformaten en regels afhandelen"
    ],
    solutions: [
      "Controleerbare berekeningsengine ontwikkeld met gedetailleerde logging",
      "Transparante transactiegeschiedenis en rapportage geïmplementeerd",
      "Flexibele regelengine gemaakt die meerdere loterijtypen ondersteunt"
    ],
    impact: [
      "50+ actieve loterijsyndicaten beheren",
      "€100K+ aan ledenbijdragen jaarlijks verwerken",
      "€25K+ aan prijzen eerlijk en transparant uitbetaald"
    ]
  },
  {
    id: 'ai-mood-journal',
    title: "AI Stemming Dagboek",
    description: "Persoonlijke wellness-app met AI-aangedreven stemmingsanalyse, inzichten en mentale gezondheidsvolging met privacy-first ontwerp.",
    longDescription: `AI Stemming Dagboek is een privacy-first mentale wellness-applicatie die gebruikers helpt hun emotionele welzijn bij te houden via AI-aangedreven analyse. Gebouwd met React Native voor cross-platform mobiele ondersteuning, biedt de app gepersonaliseerde inzichten in stemmingspatronen, triggers en mentale gezondheidstrends.

Het platform gebruikt on-device AI-verwerking om gebruikersprivacy te garanderen en tegelijkertijd geavanceerde analyse te bieden. Integratie met Supabase maakt veilige cloudback-up mogelijk terwijl end-to-end-encryptie wordt gehandhaafd. De app beschikt over dagelijkse prompts, stemmingsvisualisatie en evidence-based wellness-aanbevelingen.`,
    image: "https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=1200&h=600&fit=crop",
    technologies: ["React Native", "AI/ML", "Supabase", "TypeScript", "Privacy-First Architecture"],
    liveUrl: "https://moodjournal.app",
    githubUrl: "https://github.com/leroysteding/mood-journal",
    featured: false,
    category: 'product',
    year: '2023',
    challenges: [
      "AI-inzichten balanceren met gebruikersprivacy",
      "Boeiende dagelijkse gewoontevorming creëren",
      "Nauwkeurige mentale gezondheidsinzichten bieden zonder medische diagnose"
    ],
    solutions: [
      "On-device AI-verwerking geïmplementeerd met optionele cloudanalyse",
      "Gamificatie en zacht notificatiesysteem ontworpen",
      "Educatieve inhoud gemaakt met professionele mentale gezondheidsbegeleiding"
    ],
    impact: [
      "5.000+ gebruikers ondersteunen bij het volgen van mentale wellness",
      "Gemiddelde gebruikersbetrokkenheid van 4,5 dagen per week",
      "Positieve gebruikersfeedback over stemmingspatroonbewustzijn"
    ]
  },
  {
    id: 'surf-platform',
    title: "SURF Whitelabel Platform",
    description: "Enterprise whitelabel platform met ondersteuning voor meerdere Next.js-applicaties in Turborepo monorepo. Gedeelde UI-componentenbibliotheek met Tailwind CSS, TypeScript en Storybook voor Edusources en MBOdata.",
    longDescription: `Het SURF Whitelabel Platform is een educatief resourcebeheersysteem op enterprise-niveau dat meerdere merken bedient, waaronder Edusources en MBOdata. Gebouwd als een moderne Turborepo monorepo, stelt het platform snelle ontwikkeling en implementatie van meerdere Next.js-applicaties mogelijk, terwijl consistentie wordt gehandhaafd via gedeelde componentenbibliotheken.

De architectuur beschikt over een uitgebreid ontwerpsysteem gebouwd met Tailwind CSS en TypeScript, gedocumenteerd en getest in Storybook. Het platform implementeert herbruikbare API-clients, state management-oplossingen en een robuuste CI/CD-pijplijn in GitLab die betrouwbare implementaties garandeert in ontwikkel-, staging- en productieomgevingen.

Belangrijkste functies zijn multi-brand theming, WCAG-toegankelijkheidsnaleving, prestatie-optimalisatie en schaalbare architectuur die duizenden gelijktijdige gebruikers ondersteunt.`,
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=600&fit=crop",
    technologies: ["Next.js", "Turborepo", "TypeScript", "Tailwind CSS", "Storybook", "GitLab CI/CD", "WCAG"],
    liveUrl: "https://edusources.nl",
    githubUrl: null,
    featured: true,
    category: 'client',
    year: '2025',
    challenges: [
      "Meerdere merken beheren met gedeelde codebase",
      "Toegankelijkheidsnaleving garanderen voor alle applicaties",
      "Releases coördineren tussen meerdere teams"
    ],
    solutions: [
      "Uitgebreid ontwerpsysteem gebouwd met multi-brand theming",
      "WCAG-testing geïmplementeerd in CI/CD-pijplijn",
      "Geautomatiseerde release-workflows gemaakt met GitLab"
    ],
    impact: [
      "50.000+ educatieve bronnen bedienen",
      "Meerdere onderwijsinstellingen ondersteunen",
      "Ontwikkeltijd met 40% verminderd door code-deling"
    ]
  },
  {
    id: 'quote-tool',
    title: "Offertetool met 3D-bestandsparsing",
    description: "Geavanceerd offerteringssysteem met 3D-bestandsparsingmogelijkheden en geautomatiseerde plaatwerkcalculaties voor productiekostenschatting.",
    longDescription: `Een geavanceerd productieofferteringssysteem dat het offerteproces voor plaatbewerking revolutioneert. Het platform beschikt over geavanceerde 3D CAD-bestandsparsingmogelijkheden die automatisch afmetingen, materialen en complexiteitsmetrieken extraheren uit STEP, STL en andere 3D-formaten.

Gebouwd met Next.js-frontend en Python-backend, gebruikt het systeem Three.js voor 3D-visualisatie en aangepaste algoritmen voor het berekenen van productiekosten, inclusief materiaal, arbeid, insteltijd en machinegebruik. Het platform integreert met bestaande ERP-systemen en biedt directe, nauwkeurige offertes die voorheen uren handmatige berekening kostten.`,
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&h=600&fit=crop",
    technologies: ["Next.js", "Three.js", "Python", "CAD Parser", "TypeScript", "FastAPI"],
    liveUrl: null,
    githubUrl: null,
    featured: true,
    category: 'client',
    year: '2024',
    challenges: [
      "Complexe 3D CAD-bestandsformaten parseren en interpreteren",
      "Nauwkeurige productiekosten berekenen uit 3D-modellen",
      "Realtime visualisatie bieden van geparseerde onderdelen"
    ],
    solutions: [
      "Aangepaste CAD-parsing-engine ontwikkeld die meerdere formaten ondersteunt",
      "Berekeningsalgoritmen gebouwd op basis van best practices in productie",
      "Three.js geïntegreerd voor interactieve 3D-visualisatie"
    ],
    impact: [
      "Offertegenereringstijd verminderd van 2 uur naar 2 minuten",
      "Offertenauwkeurigheid verbeterd met 95%",
      "Maandelijks 500+ offertes verwerken"
    ]
  },
  {
    id: 'ai-solutions-devries',
    title: "AI Solutions Architect - De Vries Surface Technologies",
    description: "Uitgebreide AI-oplossingsarchitectuur voor De Vries Surface Technologies, met implementatie van intelligente procesautomatisering en data-analyse.",
    longDescription: `Een uitgebreid AI-transformatieproject voor De Vries Surface Technologies, met implementatie van intelligente procesautomatisering over meerdere bedrijfsworkflows. De oplossingsarchitectuur omvat geautomatiseerde documentverwerking, voorspellend onderhoudsplanning, kwaliteitscontroleautomatisering en business intelligence-dashboards.

Gebouwd op Azure cloud-infrastructuur met Python-gebaseerde microservices en FastAPI-endpoints, integreert het systeem met bestaande productiesystemen terwijl het nieuwe AI-aangedreven mogelijkheden biedt. Het platform omvat aangepaste machine learning-modellen voor kwaliteitsvoorspelling, geautomatiseerde rapportage en realtime analyse.`,
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1200&h=600&fit=crop",
    technologies: ["AI/ML", "Azure", "Python", "FastAPI", "Analytics", "Power BI"],
    liveUrl: null,
    githubUrl: null,
    featured: true,
    category: 'client',
    year: '2024',
    challenges: [
      "AI integreren in bestaande productieprocessen",
      "Modellen trainen met beperkte historische gegevens",
      "Systeembetrouwbaarheid garanderen in productieomgeving"
    ],
    solutions: [
      "Geleidelijke AI-adoptie geïmplementeerd met menselijk toezicht",
      "Transfer learning en synthetische datageneratie gebruikt",
      "Robuuste monitoring en fallback-systemen gebouwd"
    ],
    impact: [
      "Handmatige verwerkingstijd met 70% verminderd",
      "Kwaliteitsvoorspellingsnauwkeurigheid verbeterd naar 92%",
      "$200K+ jaarlijkse kostenbesparingen gegenereerd"
    ]
  },
  {
    id: 'vodafoneziggo-app',
    title: "VodafoneZiggo Mobiele App",
    description: "Hoogpresterende cross-platform mobiele applicatie met React Native en Expo. Schaalbaar ontwerpsysteem met Storybook, WCAG-toegankelijkheidsnaleving en enterprise-grade testing.",
    longDescription: `Enterprise mobiele applicatie voor VodafoneZiggo die miljoenen klanten bedient. Gebouwd met React Native en Expo, biedt de app een naadloze cross-platform ervaring voor accountbeheer, servicemonitoring en klantenondersteuning.

Het project beschikt over een uitgebreid ontwerpsysteem gebouwd in Storybook, dat consistentie garandeert op iOS- en Android-platforms. WCAG-toegankelijkheidsstandaarden geïmplementeerd, met uitgebreide testing met Jest en enterprise-grade code-kwaliteitsmonitoring via SonarQube. De app bevat realtime servicestatus, factuurbeheer en gepersonaliseerde aanbevelingen.`,
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=1200&h=600&fit=crop",
    technologies: ["React Native", "Expo", "TypeScript", "Storybook", "Jest", "WCAG", "SonarQube"],
    liveUrl: null,
    githubUrl: null,
    featured: false,
    category: 'client',
    year: '2024-2025',
    challenges: [
      "Prestaties behouden met complexe functies",
      "Toegankelijkheid garanderen in mobiele context",
      "Miljoenen gebruikers ondersteunen met hoge betrouwbaarheid"
    ],
    solutions: [
      "Prestatie-optimalisatie en lazy loading geïmplementeerd",
      "Uitgebreide toegankelijkheidstestsuite gebouwd",
      "Robuuste foutafhandeling en monitoring gecreëerd"
    ],
    impact: [
      "3M+ actieve gebruikers bedienen",
      "99,9% uptime bereikt",
      "4,5+ sterren beoordeling in app stores"
    ]
  },
  {
    id: 'robidus-platform',
    title: "Robidus WGA & Ziektewet Platform",
    description: "Geavanceerd applicatieplatform met integratie van diverse datastromen voor WGA- en Ziektewetbegeleiding. Gebouwd met Next.js en TypeScript met CI/CD-automatisering via Jenkins.",
    longDescription: `Een geavanceerd platform voor socialezekerheidsgevallenbeheer, met integratie van meerdere datastromen voor WGA (re-integratie) en Ziektewet-begeleiding. Het platform bedient medewerkers en beheerders bij het beheren van complexe socialezekerheidsgevallen.

Gebouwd met Next.js en TypeScript, beschikt het systeem over realtime gegevenssynchronisatie, geautomatiseerd workflowbeheer en uitgebreide rapportage. Jenkins CI/CD-pijplijn garandeert betrouwbare implementaties en snelle iteratie. Het platform verwerkt gevoelige persoonsgegevens met beveiliging op bankniveau en volledige AVG-naleving.`,
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&h=600&fit=crop",
    technologies: ["Next.js", "TypeScript", "Jenkins", "CI/CD", "React", "Security"],
    liveUrl: null,
    githubUrl: null,
    featured: false,
    category: 'client',
    year: '2021',
    challenges: [
      "Gevoelige persoonlijke en medische gegevens beheren",
      "Meerdere overheidsdatabronnen integreren",
      "AVG-naleving en beveiliging garanderen"
    ],
    solutions: [
      "End-to-end-encryptie en toegangscontroles geïmplementeerd",
      "Robuuste API-integratielaag gebouwd met foutafhandeling",
      "Uitgebreide auditlogging en compliance-rapportage gecreëerd"
    ],
    impact: [
      "Jaarlijks 10.000+ gevallen verwerken",
      "Verwerkingstijd van gevallen met 50% verminderd",
      "100% AVG-naleving gehandhaafd"
    ]
  },
  {
    id: 'timber-ecommerce',
    title: "Hout & Bouwmaterialen E-Commerce",
    description: "SAP Hybris e-commerceplatform met geïntegreerde frontend- en backendsystemen. Full-stack ontwikkeling met Java, SAP-integratie en moderne webtechnologieën.",
    longDescription: `Enterprise e-commerceplatform voor Timber and Building Supplies Holland N.V., gebouwd op SAP Hybris Commerce. Het project omvatte full-stack ontwikkeling met diepe integratie tussen frontend-gebruikerservaring en backend SAP-systemen.

Moderne webfrontend ontwikkeld met integratie met SAP ERP voor realtime voorraad, prijzen en orderbeheer. Het platform ondersteunt B2B- en B2C-verkoopkanalen met complexe prijsregels, aangepaste catalogi en multi-warehouse voorraadbeheer. Aangepaste extensies geïmplementeerd voor de bouwmaterialensector, inclusief bulkbestellingen, projectbeheer en leveringsplanning.`,
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&h=600&fit=crop",
    technologies: ["SAP Hybris", "Java", "JavaScript", "E-Commerce", "SAP Integration", "Spring"],
    liveUrl: null,
    githubUrl: null,
    featured: false,
    category: 'client',
    year: '2019-2020',
    challenges: [
      "Complexe SAP-backend integreren met moderne frontend",
      "Gespecialiseerde B2B e-commercevereisten afhandelen",
      "Grote productcatalogi en voorraad beheren"
    ],
    solutions: [
      "Aangepaste Hybris-extensies gebouwd voor branchespecifieke functies",
      "Efficiënte caching en gegevenssynchronisatie geïmplementeerd",
      "Intuïtieve UX gecreëerd voor complexe B2B-workflows"
    ],
    impact: [
      "50.000+ product-SKU's beheren",
      "€5M+ aan jaarlijkse online verkopen verwerken",
      "1.000+ B2B-klanten bedienen"
    ]
  }
];
