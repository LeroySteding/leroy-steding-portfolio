import Hero from "@/components/sections/Hero";
import IntroAbout from "@/components/sections/IntroAbout";
import Services from "@/components/sections/Services";
import Projects from "@/components/sections/Projects";
import Blog from "@/components/sections/Blog";
import Testimonials from "@/components/sections/Testimonials";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
    <main className="min-h-screen bg-primary-bg">
      <Hero />
      <IntroAbout />
      <Services />
      <Projects />
      <Blog />
      <Testimonials />
      <Contact />
    </main>
  );
}
