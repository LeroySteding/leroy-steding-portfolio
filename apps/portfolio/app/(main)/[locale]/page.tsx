import dynamic from "next/dynamic";
import { getLocale } from "next-intl/server";
import JsonLd from "@/components/JsonLd";
// Above-fold sections - loaded immediately
import Hero from "@/components/sections/Hero";
import IntroAbout from "@/components/sections/IntroAbout";
import {
  getAboutSection,
  getBlogSection,
  getContactSection,
  getFeaturedPosts,
  getHeroSection,
  getProjectsSection,
  getProjects as getSanityProjects,
} from "@/lib/convex-content";
import {
  getOrganizationSchema,
  getPersonSchema,
  getWebsiteSchema,
} from "@/lib/structured-data";

// Below-fold sections - lazy loaded for better initial performance
const Services = dynamic(() => import("@/components/sections/Services"));
const Projects = dynamic(() => import("@/components/sections/Projects"));
const ProjectShowcase = dynamic(
  () => import("@/components/sections/ProjectShowcase"),
);
const ZZPTools = dynamic(() => import("@/components/sections/ZZPTools"));
const Blog = dynamic(() => import("@/components/sections/Blog"));
const TestimonialsReal = dynamic(
  () => import("@/components/sections/TestimonialsReal"),
);
const Contact = dynamic(() => import("@/components/sections/Contact"));

export default async function Home() {
  const locale = await getLocale();

  // Fetch all Sanity data in parallel
  const [
    heroData,
    aboutData,
    contactData,
    projectsSection,
    blogSection,
    projects,
    featuredPosts,
  ] = await Promise.all([
    getHeroSection(locale),
    getAboutSection(locale),
    getContactSection(locale),
    getProjectsSection(locale),
    getBlogSection(locale),
    getSanityProjects(locale),
    getFeaturedPosts(locale),
  ]);

  // Generate structured data for SEO
  const structuredData = [
    getPersonSchema(locale),
    getWebsiteSchema(locale),
    getOrganizationSchema(),
  ];

  return (
    <>
      <JsonLd data={structuredData} />
      <main className="min-h-screen bg-primary-bg">
        <Hero data={heroData} />
        <IntroAbout data={aboutData} />
        <Services />
        <ProjectShowcase />
        <Projects data={projects} sectionData={projectsSection} />
        <ZZPTools />
        <Blog data={featuredPosts} sectionData={blogSection} />
        <TestimonialsReal />
        <Contact data={contactData} />
      </main>
    </>
  );
}
