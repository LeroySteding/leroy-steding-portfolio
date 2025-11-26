import { createClient } from "@sanity/client";
import { config } from "dotenv";
import { resolve } from "path";

// Load .env.local
config({ path: resolve(process.cwd(), ".env.local") });

const token = process.env.SANITY_API_TOKEN;

if (!token) {
  console.error("ERROR: SANITY_API_TOKEN not found in .env.local");
  process.exit(1);
}

const client = createClient({
  projectId: "p6hg7krm",
  dataset: "production",
  apiVersion: "2025-01-01",
  useCdn: false,
  token,
});

// Section content for EN
const sectionsEN = {
  hero: {
    _id: "hero-en",
    _type: "hero",
    name: "Homepage Hero (EN)",
    title: "Full-Stack Developer",
    subtitle: "& AI Automation Architect",
    tagline:
      "Building scalable AI-driven web platforms & digital automation solutions.",
    language: "en",
    ctaButtons: [
      { text: "View Projects", link: "#projects", variant: "primary" },
      { text: "Download CV", link: "/cv", variant: "secondary" },
    ],
    stats: [
      { value: "8+", label: "Years Experience" },
      { value: "50+", label: "Projects Completed" },
      { value: "30+", label: "Happy Clients" },
    ],
  },
  about: {
    _id: "about-en",
    _type: "aboutSection",
    name: "About Section (EN)",
    title: "About Me",
    subtitle: "Passionate Developer & Problem Solver",
    description:
      "I'm a full-stack developer with a passion for creating elegant, efficient solutions. With expertise in modern web technologies and AI integration, I help businesses transform their digital presence.",
    language: "en",
    highlights: [
      "Full-Stack Development",
      "AI & Automation",
      "Cloud Architecture",
      "Team Leadership",
    ],
  },
  contact: {
    _id: "contact-en",
    _type: "contactSection",
    name: "Contact Section (EN)",
    title: "Get In Touch",
    subtitle: "Let's work together",
    description:
      "Have a project in mind? Let's discuss how I can help bring your ideas to life.",
    language: "en",
    email: "hello@leroysteding.nl",
    phone: "+31 6 12345678",
    location: "Amsterdam, Netherlands",
  },
  projects: {
    _id: "projects-section-en",
    _type: "projectsSection",
    name: "Projects Section (EN)",
    title: "Featured",
    titleHighlight: "Projects",
    subtitle: "A selection of my recent work",
    language: "en",
  },
  experience: {
    _id: "experience-section-en",
    _type: "experienceSection",
    name: "Experience Section (EN)",
    title: "Work",
    titleHighlight: "Experience",
    subtitle: "My professional journey",
    language: "en",
  },
  skills: {
    _id: "skills-section-en",
    _type: "skillsSection",
    name: "Skills Section (EN)",
    title: "Skills &",
    titleHighlight: "Expertise",
    subtitle: "Technologies I work with",
    language: "en",
  },
  blog: {
    _id: "blog-section-en",
    _type: "blogSection",
    name: "Blog Section (EN)",
    title: "Latest",
    titleHighlight: "Articles",
    subtitle: "Thoughts, tutorials, and insights",
    language: "en",
  },
  techStack: {
    _id: "techstack-section-en",
    _type: "techStackSection",
    name: "Tech Stack Section (EN)",
    title: "Tech",
    titleHighlight: "Stack",
    subtitle: "Tools and technologies I use daily",
    language: "en",
  },
};

// Section content for NL
const sectionsNL = {
  hero: {
    _id: "hero-nl",
    _type: "hero",
    name: "Homepage Hero (NL)",
    title: "Full-Stack Developer",
    subtitle: "& AI Automatisering Architect",
    tagline:
      "Bouwt schaalbare AI-gedreven webplatforms & digitale automatiseringsoplossingen.",
    language: "nl",
    ctaButtons: [
      { text: "Bekijk Projecten", link: "#projects", variant: "primary" },
      { text: "Download CV", link: "/cv", variant: "secondary" },
    ],
    stats: [
      { value: "8+", label: "Jaar Ervaring" },
      { value: "50+", label: "Projecten Voltooid" },
      { value: "30+", label: "Tevreden Klanten" },
    ],
  },
  about: {
    _id: "about-nl",
    _type: "aboutSection",
    name: "About Section (NL)",
    title: "Over Mij",
    subtitle: "Gepassioneerde Developer & Probleemoplosser",
    description:
      "Ik ben een full-stack developer met een passie voor het creëren van elegante, efficiënte oplossingen. Met expertise in moderne webtechnologieën en AI-integratie help ik bedrijven hun digitale aanwezigheid te transformeren.",
    language: "nl",
    highlights: [
      "Full-Stack Development",
      "AI & Automatisering",
      "Cloud Architectuur",
      "Team Leiderschap",
    ],
  },
  contact: {
    _id: "contact-nl",
    _type: "contactSection",
    name: "Contact Section (NL)",
    title: "Neem Contact Op",
    subtitle: "Laten we samenwerken",
    description:
      "Heeft u een project in gedachten? Laten we bespreken hoe ik kan helpen uw ideeën tot leven te brengen.",
    language: "nl",
    email: "hello@leroysteding.nl",
    phone: "+31 6 12345678",
    location: "Amsterdam, Nederland",
  },
  projects: {
    _id: "projects-section-nl",
    _type: "projectsSection",
    name: "Projects Section (NL)",
    title: "Uitgelichte",
    titleHighlight: "Projecten",
    subtitle: "Een selectie van mijn recente werk",
    language: "nl",
  },
  experience: {
    _id: "experience-section-nl",
    _type: "experienceSection",
    name: "Experience Section (NL)",
    title: "Werk",
    titleHighlight: "Ervaring",
    subtitle: "Mijn professionele reis",
    language: "nl",
  },
  skills: {
    _id: "skills-section-nl",
    _type: "skillsSection",
    name: "Skills Section (NL)",
    title: "Vaardigheden &",
    titleHighlight: "Expertise",
    subtitle: "Technologieën waar ik mee werk",
    language: "nl",
  },
  blog: {
    _id: "blog-section-nl",
    _type: "blogSection",
    name: "Blog Section (NL)",
    title: "Laatste",
    titleHighlight: "Artikelen",
    subtitle: "Gedachten, tutorials en inzichten",
    language: "nl",
  },
  techStack: {
    _id: "techstack-section-nl",
    _type: "techStackSection",
    name: "Tech Stack Section (NL)",
    title: "Tech",
    titleHighlight: "Stack",
    subtitle: "Tools en technologieën die ik dagelijks gebruik",
    language: "nl",
  },
};

async function createSections() {
  console.log("=== Creating Page Sections ===\n");

  // Create EN sections
  console.log("Creating English sections...");
  for (const [key, section] of Object.entries(sectionsEN)) {
    try {
      await client.createOrReplace(section);
      console.log(`  ✓ Created: ${section.name}`);
    } catch (err: any) {
      console.log(`  ✗ Failed: ${section.name} - ${err.message}`);
    }
  }

  // Create NL sections
  console.log("\nCreating Dutch sections...");
  for (const [key, section] of Object.entries(sectionsNL)) {
    try {
      await client.createOrReplace(section);
      console.log(`  ✓ Created: ${section.name}`);
    } catch (err: any) {
      console.log(`  ✗ Failed: ${section.name} - ${err.message}`);
    }
  }

  // Create Home Pages with references to sections
  console.log("\nCreating Home Pages...");

  const homePageEN = {
    _id: "home-page-en",
    _type: "page",
    title: "Home",
    slug: { current: "home", _type: "slug" },
    language: "en",
    pageBuilder: [
      { _type: "reference", _ref: "hero-en", _key: "hero" },
      { _type: "reference", _ref: "about-en", _key: "about" },
      { _type: "reference", _ref: "projects-section-en", _key: "projects" },
      { _type: "reference", _ref: "experience-section-en", _key: "experience" },
      { _type: "reference", _ref: "skills-section-en", _key: "skills" },
      { _type: "reference", _ref: "blog-section-en", _key: "blog" },
      { _type: "reference", _ref: "contact-en", _key: "contact" },
    ],
    seo: {
      metaTitle:
        "Leroy Steding - Full-Stack Developer & AI Automation Architect",
      metaDescription:
        "Building scalable AI-driven web platforms & digital automation solutions.",
    },
  };

  const homePageNL = {
    _id: "home-page-nl",
    _type: "page",
    title: "Home",
    slug: { current: "home", _type: "slug" },
    language: "nl",
    pageBuilder: [
      { _type: "reference", _ref: "hero-nl", _key: "hero" },
      { _type: "reference", _ref: "about-nl", _key: "about" },
      { _type: "reference", _ref: "projects-section-nl", _key: "projects" },
      { _type: "reference", _ref: "experience-section-nl", _key: "experience" },
      { _type: "reference", _ref: "skills-section-nl", _key: "skills" },
      { _type: "reference", _ref: "blog-section-nl", _key: "blog" },
      { _type: "reference", _ref: "contact-nl", _key: "contact" },
    ],
    seo: {
      metaTitle:
        "Leroy Steding - Full-Stack Developer & AI Automatisering Architect",
      metaDescription:
        "Bouwt schaalbare AI-gedreven webplatforms & digitale automatiseringsoplossingen.",
    },
  };

  try {
    await client.createOrReplace(homePageEN);
    console.log("  ✓ Created: Home Page (EN)");
  } catch (err: any) {
    console.log(`  ✗ Failed: Home Page (EN) - ${err.message}`);
  }

  try {
    await client.createOrReplace(homePageNL);
    console.log("  ✓ Created: Home Page (NL)");
  } catch (err: any) {
    console.log(`  ✗ Failed: Home Page (NL) - ${err.message}`);
  }

  console.log("\n=== Done ===");
}

createSections().catch(console.error);
