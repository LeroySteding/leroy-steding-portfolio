import Blog from "@/components/sections/Blog";
import Contact from "@/components/sections/Contact";
import Hero from "@/components/sections/Hero";
import IntroAbout from "@/components/sections/IntroAbout";
import Projects from "@/components/sections/Projects";
import Services from "@/components/sections/Services";
import Testimonials from "@/components/sections/Testimonials";

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
