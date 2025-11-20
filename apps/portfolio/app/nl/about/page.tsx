import About from "@/components/sections/About";
import Experience from "@/components/sections/Experience";
import TechStack from "@/components/sections/TechStack";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Over | Leroy Steding - Full-Stack Developer & AI Automatisering Architect",
  description: "Leer over Leroy Steding's reis, ervaring, technische expertise en opleiding. Full-stack developer gespecialiseerd in AI automatisering, Next.js, React en moderne webtechnologieën.",
  keywords: [
    "over Leroy Steding",
    "full-stack developer biografie",
    "AI automatisering architect",
    "technische expertise",
    "professionele ervaring",
    "opleiding en certificeringen",
    "webontwikkeling carrière"
  ],
  openGraph: {
    title: "Over Leroy Steding | Full-Stack Developer & AI Automatisering Architect",
    description: "Leer over Leroy Steding's reis, ervaring, technische expertise en opleiding.",
    url: "https://steding.digital/nl/about",
    siteName: "Leroy Steding Portfolio",
    locale: "nl_NL",
    type: "profile",
  },
  alternates: {
    canonical: "https://steding.digital/nl/about",
    languages: {
      "en-US": "https://steding.digital/about",
      "nl-NL": "https://steding.digital/nl/about",
    },
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
