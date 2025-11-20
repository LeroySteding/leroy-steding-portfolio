import About from "@/components/sections/About";
import Experience from "@/components/sections/Experience";
import TechStack from "@/components/sections/TechStack";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | Leroy Steding - Full-Stack Developer & AI Automation Architect",
  description: "Learn about Leroy Steding's journey, experience, technical expertise, and education. Full-stack developer specializing in AI automation, Next.js, React, and modern web technologies.",
  keywords: [
    "about Leroy Steding",
    "full-stack developer biography",
    "AI automation architect",
    "technical expertise",
    "professional experience",
    "education and certifications",
    "web development career"
  ],
  openGraph: {
    title: "About Leroy Steding | Full-Stack Developer & AI Automation Architect",
    description: "Learn about Leroy Steding's journey, experience, technical expertise, and education.",
    url: "https://steding.digital/about",
    siteName: "Leroy Steding Portfolio",
    locale: "en_US",
    type: "profile",
  },
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-primary-bg">
      <About />
      <Experience />
      <TechStack />
    </main>
  );
}
