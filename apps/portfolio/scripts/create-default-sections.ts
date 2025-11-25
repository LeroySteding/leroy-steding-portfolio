import { resolve } from "node:path";
import { createClient } from "@sanity/client";
import { config } from "dotenv";

// Load environment variables
config({ path: resolve(__dirname, "../../../.env.local") });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
  apiVersion: "2024-01-01",
});

async function createDefaultSections() {
  console.log("Creating default sections...");

  const sections = [
    // Hero Sections
    {
      _type: "hero",
      _id: "hero-en",
      title: "Welcome to My Portfolio",
      language: "en",
      subtitle: "Full-Stack Developer & AI Specialist",
      description: "Building innovative solutions with modern technologies",
      ctaButtons: [
        { text: "View Projects", link: "/projects", variant: "primary" },
        { text: "Contact Me", link: "/contact", variant: "secondary" },
      ],
    },
    {
      _type: "hero",
      _id: "hero-nl",
      title: "Welkom bij Mijn Portfolio",
      language: "nl",
      subtitle: "Full-Stack Developer & AI Specialist",
      description: "Innovatieve oplossingen bouwen met moderne technologieën",
      ctaButtons: [
        { text: "Bekijk Projecten", link: "/nl/projects", variant: "primary" },
        { text: "Contact", link: "/nl/contact", variant: "secondary" },
      ],
    },

    // About Sections
    {
      _type: "aboutSection",
      _id: "about-en",
      title: "About",
      language: "en",
      titleHighlight: "Me",
      description:
        "Passionate developer with expertise in building scalable applications",
      content:
        "## My Story\n\nI'm a full-stack developer specializing in modern web technologies...",
    },
    {
      _type: "aboutSection",
      _id: "about-nl",
      title: "Over",
      language: "nl",
      titleHighlight: "Mij",
      description:
        "Gepassioneerde ontwikkelaar met expertise in schaalbare applicaties",
      content:
        "## Mijn Verhaal\n\nIk ben een full-stack developer gespecialiseerd in moderne webtechnologieën...",
    },

    // Contact Sections
    {
      _type: "contactSection",
      _id: "contact-en",
      title: "Get in",
      language: "en",
      titleHighlight: "Touch",
      description: "Let's discuss your next project",
      email: "hello@example.com",
      socialLinks: [
        { platform: "GitHub", url: "https://github.com", icon: "github" },
        { platform: "LinkedIn", url: "https://linkedin.com", icon: "linkedin" },
      ],
    },
    {
      _type: "contactSection",
      _id: "contact-nl",
      title: "Neem",
      language: "nl",
      titleHighlight: "Contact Op",
      description: "Laten we uw volgende project bespreken",
      email: "hello@example.com",
      socialLinks: [
        { platform: "GitHub", url: "https://github.com", icon: "github" },
        { platform: "LinkedIn", url: "https://linkedin.com", icon: "linkedin" },
      ],
    },

    // Projects Sections
    {
      _type: "projectsSection",
      _id: "projects-section-en",
      title: "Featured",
      language: "en",
      titleHighlight: "Projects",
      description: "Explore my latest work and projects",
      viewAllText: "View All Projects",
      showFeaturedOnly: true,
      maxProjects: 6,
    },
    {
      _type: "projectsSection",
      _id: "projects-section-nl",
      title: "Uitgelichte",
      language: "nl",
      titleHighlight: "Projecten",
      description: "Ontdek mijn laatste werk en projecten",
      viewAllText: "Bekijk Alle Projecten",
      showFeaturedOnly: true,
      maxProjects: 6,
    },

    // Experience Sections
    {
      _type: "experienceSection",
      _id: "experience-section-en",
      title: "Work",
      language: "en",
      titleHighlight: "Experience",
      description: "My professional journey and achievements",
    },
    {
      _type: "experienceSection",
      _id: "experience-section-nl",
      title: "Werk",
      language: "nl",
      titleHighlight: "Ervaring",
      description: "Mijn professionele reis en prestaties",
    },

    // Skills Sections
    {
      _type: "skillsSection",
      _id: "skills-section-en",
      title: "Technical",
      language: "en",
      titleHighlight: "Skills",
      description: "Technologies and tools I work with",
      skills: [
        { name: "React", category: "Frontend", level: 95 },
        { name: "TypeScript", category: "Languages", level: 90 },
        { name: "Node.js", category: "Backend", level: 85 },
      ],
    },
    {
      _type: "skillsSection",
      _id: "skills-section-nl",
      title: "Technische",
      language: "nl",
      titleHighlight: "Vaardigheden",
      description: "Technologieën en tools waarmee ik werk",
      skills: [
        { name: "React", category: "Frontend", level: 95 },
        { name: "TypeScript", category: "Talen", level: 90 },
        { name: "Node.js", category: "Backend", level: 85 },
      ],
    },

    // Blog Sections
    {
      _type: "blogSection",
      _id: "blog-section-en",
      title: "Latest from the",
      language: "en",
      titleHighlight: "Journal",
      description: "Articles, tutorials, and insights",
      viewAllText: "View All Posts",
      showFeaturedOnly: false,
      maxPosts: 6,
    },
    {
      _type: "blogSection",
      _id: "blog-section-nl",
      title: "Laatste uit het",
      language: "nl",
      titleHighlight: "Journaal",
      description: "Artikelen, tutorials en inzichten",
      viewAllText: "Bekijk Alle Posts",
      showFeaturedOnly: false,
      maxPosts: 6,
    },

    // Tech Stack Sections
    {
      _type: "techStackSection",
      _id: "tech-stack-section-en",
      title: "Tech",
      language: "en",
      titleHighlight: "Stack",
      description: "Technologies I use to build amazing products",
      categories: [
        {
          name: "Frontend",
          icon: "frontend",
          technologies: [
            { name: "React", icon: "react" },
            { name: "Next.js", icon: "nextjs" },
            { name: "TypeScript", icon: "typescript" },
          ],
        },
      ],
    },
    {
      _type: "techStackSection",
      _id: "tech-stack-section-nl",
      title: "Tech",
      language: "nl",
      titleHighlight: "Stack",
      description:
        "Technologieën die ik gebruik om geweldige producten te bouwen",
      categories: [
        {
          name: "Frontend",
          icon: "frontend",
          technologies: [
            { name: "React", icon: "react" },
            { name: "Next.js", icon: "nextjs" },
            { name: "TypeScript", icon: "typescript" },
          ],
        },
      ],
    },
  ];

  try {
    for (const section of sections) {
      console.log(`Creating ${section._type} (${section.language})...`);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await client.createOrReplace(section as any);
    }
    console.log("✅ All default sections created successfully!");
  } catch (error) {
    console.error("Error creating sections:", error);
    process.exit(1);
  }
}

createDefaultSections();
