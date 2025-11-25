"use client";

import { FileText } from "lucide-react";
import PageHero from "@/components/ui/PageHero";

interface BlogHeroProps {
  title: string;
  titleHighlight: string;
  subtitle: string;
}

export default function BlogHero({
  title,
  titleHighlight,
  subtitle,
}: BlogHeroProps) {
  return (
    <PageHero
      title={title}
      titleHighlight={titleHighlight}
      subtitle={subtitle}
      icon={FileText}
      breadcrumbs={[{ label: "Blog" }]}
      backgroundImage="https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1920&q=80"
    />
  );
}
