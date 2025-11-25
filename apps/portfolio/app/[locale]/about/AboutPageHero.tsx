"use client";

import { User } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import { useTranslation } from "@/hooks/useTranslation";

export default function AboutPageHero() {
  const t = useTranslation();

  return (
    <PageHero
      title={t.about.title || "About"}
      titleHighlight={t.about.titleHighlight || "Me"}
      subtitle="Full-stack developer specializing in AI automation, Next.js, React, and modern web technologies"
      icon={User}
      breadcrumbs={[{ label: "About" }]}
      backgroundImage="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1920&q=80"
    />
  );
}
