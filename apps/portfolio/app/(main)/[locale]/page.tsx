import { getLocale } from "next-intl/server";
import JsonLd from "@/components/JsonLd";
import Blog from "@/components/sections/Blog";
import Contact from "@/components/sections/Contact";
import Hero from "@/components/sections/Hero";
import IntroAbout from "@/components/sections/IntroAbout";
import Projects from "@/components/sections/Projects";
import Services from "@/components/sections/Services";
import Testimonials from "@/components/sections/Testimonials";
import {
  getAboutSection,
  getBlogSection,
  getContactSection,
  getFeaturedPosts,
  getHeroSection,
  getProjectsSection,
  getProjects as getSanityProjects,
} from "@/lib/sanity-content";
import {
  getOrganizationSchema,
  getPersonSchema,
  getWebsiteSchema,
} from "@/lib/structured-data";

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
        <Projects data={projects} sectionData={projectsSection} />
        <Blog data={featuredPosts} sectionData={blogSection} />
        <Testimonials />
        <Contact data={contactData} />
      </main>
    </>
  );
}
