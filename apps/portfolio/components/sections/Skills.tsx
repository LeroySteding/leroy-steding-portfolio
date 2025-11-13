"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const skillCategories = [
  {
    name: "Frontend",
    color: "cyan",
    skills: [
      { name: "Next.js 17", level: 95, icon: "⚡" },
      { name: "React 19", level: 95, icon: "⚛️" },
      { name: "TypeScript", level: 90, icon: "📘" },
      { name: "Tailwind CSS v4", level: 95, icon: "🎨" },
      { name: "Framer Motion", level: 85, icon: "✨" },
    ],
  },
  {
    name: "Backend",
    color: "violet",
    skills: [
      { name: "Python", level: 90, icon: "🐍" },
      { name: "FastAPI", level: 85, icon: "⚡" },
      { name: "Node.js", level: 85, icon: "🟢" },
      { name: "PostgreSQL", level: 85, icon: "🐘" },
      { name: "Supabase", level: 90, icon: "⚡" },
    ],
  },
  {
    name: "AI & Automation",
    color: "cyan",
    skills: [
      { name: "AI Agents", level: 90, icon: "🤖" },
      { name: "n8n Workflows", level: 95, icon: "🔄" },
      { name: "OpenAI API", level: 85, icon: "🧠" },
      { name: "LangChain", level: 80, icon: "⛓️" },
      { name: "Vector DBs", level: 75, icon: "📊" },
    ],
  },
  {
    name: "DevOps & Tools",
    color: "violet",
    skills: [
      { name: "Docker", level: 85, icon: "🐳" },
      { name: "Git & GitHub", level: 95, icon: "📦" },
      { name: "Vercel", level: 90, icon: "▲" },
      { name: "CI/CD", level: 80, icon: "🔁" },
      { name: "Monorepo", level: 85, icon: "📂" },
    ],
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function Skills() {
  return (
    <section id="skills" className="relative py-24 bg-cyber-dark overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-neon-cyan to-transparent" />
      
      {/* Gradient orbs */}
      <div className="absolute top-1/3 -right-48 w-96 h-96 bg-neon-cyan/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/3 -left-48 w-96 h-96 bg-neon-violet/10 rounded-full blur-3xl" />

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-4xl sm:text-5xl font-display font-bold mb-4"
          >
            Technical <span className="bg-gradient-to-r from-neon-cyan to-neon-violet bg-clip-text text-transparent">Skills</span>
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="w-24 h-1 bg-gradient-to-r from-neon-cyan to-neon-violet mx-auto rounded-full"
          />
        </div>

        {/* Skills grid */}
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
          {skillCategories.map((category, categoryIndex) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
              viewport={{ once: true }}
              className="p-6 rounded-xl bg-cyber-darker border border-cyber-gray-light glass hover:border-neon-cyan/50 transition-all duration-300"
            >
              <h3 className={`text-2xl font-display font-bold mb-6 flex items-center gap-3`}>
                <span className={`w-2 h-2 rounded-full bg-neon-${category.color} animate-glow-pulse`} />
                <span className={category.color === "cyan" ? "text-neon-cyan" : "text-neon-violet"}>
                  {category.name}
                </span>
              </h3>

              <motion.div
                variants={container}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="space-y-4"
              >
                {category.skills.map((skill) => (
                  <motion.div
                    key={skill.name}
                    variants={item}
                    className="group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{skill.icon}</span>
                        <span className="font-semibold text-text-primary">
                          {skill.name}
                        </span>
                      </div>
                      <span className={`text-sm font-bold ${category.color === "cyan" ? "text-neon-cyan" : "text-neon-violet"}`}>
                        {skill.level}%
                      </span>
                    </div>
                    
                    {/* Progress bar */}
                    <div className="h-2 bg-cyber-gray rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                        viewport={{ once: true }}
                        className={`h-full rounded-full ${
                          category.color === "cyan"
                            ? "bg-gradient-to-r from-neon-cyan to-neon-cyan-dark"
                            : "bg-gradient-to-r from-neon-violet to-neon-violet-dark"
                        } group-hover:animate-glow-pulse`}
                      />
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Technology badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <h4 className="text-xl font-display font-semibold mb-6 text-text-secondary">
            Also experienced with
          </h4>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              "GraphQL",
              "Redis",
              "Prisma",
              "Stripe",
              "Clerk",
              "Sanity CMS",
              "Playwright",
              "Jest",
              "Vitest",
              "Turborepo",
              "pnpm",
              "Bun",
            ].map((tech, index) => (
              <motion.span
                key={tech}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.5 + index * 0.05 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.1 }}
                className="px-4 py-2 rounded-full bg-cyber-gray border border-cyber-gray-light text-text-secondary hover:border-neon-cyan hover:text-neon-cyan transition-all duration-300 cursor-default"
              >
                {tech}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
