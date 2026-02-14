import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { queryConvex } from "@/lib/convex-client";
import FAQ from "./components/FAQ";
import FinalCTA from "./components/FinalCTA";
import TemplatesGrid from "./components/TemplatesGrid";
import TemplatesHero from "./components/TemplatesHero";
import WhatsIncluded from "./components/WhatsIncluded";

export const metadata: Metadata = {
  title: "SaaS Templates | Ship Faster with Production-Ready Code",
  description:
    "Production-ready SaaS templates built with Next.js 16, Convex, and Clerk. Launch your product in days, not months.",
  openGraph: {
    title: "SaaS Templates - Ship Your Product Faster",
    description:
      "Complete SaaS templates for Dutch developers. Everything you need to launch profitably.",
    images: ["/og/templates.jpg"],
  },
};

export default async function TemplatesPage() {
  const locale = await getLocale();

  // Fetch templates from Convex
  const templates = await queryConvex<any[]>("templates:list", {
    sortBy: "newest",
  });

  return (
    <main className="min-h-screen bg-primary-bg">
      <TemplatesHero />

      <TemplatesGrid templates={templates} />

      <WhatsIncluded />

      <FAQ />

      <FinalCTA />
    </main>
  );
}
