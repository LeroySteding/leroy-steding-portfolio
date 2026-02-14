"use client";

import { motion } from "framer-motion";
import { ExternalLink, Github } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  liveUrl?: string;
  githubUrl?: string;
  techStack: string[];
  category: string;
}

const projects: Project[] = [
  {
    id: "1",
    title: "Admin Dashboard & Agent Coordination",
    description:
      "Multi-agent coordination platform with real-time task management, Kanban boards, and agent performance metrics. Built for coordinating AI agents in a team environment.",
    image: "/projects/admin-dashboard.png",
    liveUrl: "https://admin.leroysteding.nl",
    techStack: [
      "Next.js 16",
      "React 19",
      "Convex",
      "Clerk",
      "Tailwind CSS",
      "TypeScript",
    ],
    category: "SaaS Platform",
  },
  {
    id: "2",
    title: "Portfolio & Blog Platform",
    description:
      "Modern portfolio website with internationalization, blog CMS integration via Sanity, and optimized performance. Features dynamic content management and SEO optimization.",
    image: "/projects/portfolio.png",
    liveUrl: "https://leroysteding.nl",
    techStack: ["Next.js 16", "Sanity CMS", "Vercel", "Tailwind CSS", "i18n"],
    category: "Portfolio",
  },
  {
    id: "3",
    title: "BelastingBot (In Development)",
    description:
      "BTW/VAT tracking tool for Dutch freelancers (ZZP). Automated expense tracking, VAT calculation, and reporting dashboard.",
    image: "/projects/belastingbot.png",
    liveUrl: "https://belastingbot.vercel.app",
    techStack: ["Next.js 16", "Convex", "Clerk", "React 19", "Tailwind CSS"],
    category: "Finance Tool",
  },
];

export default function ProjectShowcase() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Built With Me</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Real projects, live in production. Each one solving real problems
            for real users.
          </p>
        </motion.div>

        <div className="space-y-12">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group"
            >
              <div
                className={`grid grid-cols-1 lg:grid-cols-2 gap-8 items-center ${index % 2 === 1 ? "lg:grid-flow-dense" : ""}`}
              >
                {/* Image */}
                <div className={`${index % 2 === 1 ? "lg:col-start-2" : ""}`}>
                  <div className="relative aspect-video rounded-2xl overflow-hidden border border-border bg-muted group-hover:border-primary/50 transition-colors">
                    {project.image ? (
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                        <p className="text-muted-foreground">
                          Project Screenshot
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div
                  className={`${index % 2 === 1 ? "lg:col-start-1 lg:row-start-1" : ""}`}
                >
                  <div className="space-y-4">
                    <div>
                      <Badge variant="outline" className="mb-3">
                        {project.category}
                      </Badge>
                      <h3 className="text-3xl font-bold mb-3">
                        {project.title}
                      </h3>
                      <p className="text-foreground/80 leading-relaxed">
                        {project.description}
                      </p>
                    </div>

                    {/* Tech Stack */}
                    <div>
                      <p className="text-sm font-semibold text-muted-foreground mb-2">
                        Tech Stack:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {project.techStack.map((tech) => (
                          <Badge
                            key={tech}
                            variant="secondary"
                            className="text-xs"
                          >
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Links */}
                    <div className="flex gap-3 pt-2">
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                        >
                          <ExternalLink className="h-4 w-4" />
                          View Live
                        </a>
                      )}
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-5 py-2.5 border border-border rounded-lg font-semibold hover:bg-muted transition-colors"
                        >
                          <Github className="h-4 w-4" />
                          Source Code
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Projects CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-16"
        >
          <a
            href="/projects"
            className="inline-flex items-center gap-2 text-primary hover:underline font-semibold"
          >
            View All Projects →
          </a>
        </motion.div>
      </div>
    </section>
  );
}
