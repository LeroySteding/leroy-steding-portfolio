import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Experience from "@/components/sections/Experience";
import TechStack from "@/components/sections/TechStack";
import Projects from "@/components/sections/Projects";
import Blog from "@/components/sections/Blog";
import Contact from "@/components/sections/Contact";

export default function HomeNL() {
  return (
    <main className="min-h-screen bg-primary-bg">
      <Hero />
      <About />
      <Experience />
      <TechStack />
      <Projects />
      <Blog />
      <Contact />
    </main>
  );
}
