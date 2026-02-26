"use client";

import { motion } from "framer-motion";
import {
  AlertCircle,
  Lightbulb,
  TrendingUp,
  Code,
  Layers,
  CheckCircle2,
} from "lucide-react";

interface ChallengeItem {
  title: string;
  description: string;
}

interface SolutionItem {
  title: string;
  description: string;
  details?: string[];
}

interface ResultMetric {
  label: string;
  value: string;
  description?: string;
  icon?: "trending" | "check" | "code" | "layers";
}

interface ProjectCaseStudyProps {
  challenge?: {
    overview: string;
    items: ChallengeItem[];
  };
  solution?: {
    overview: string;
    items: SolutionItem[];
    architecture?: {
      description: string;
      diagram?: string;
    };
  };
  results?: {
    overview: string;
    metrics: ResultMetric[];
    learnings?: string[];
  };
  translations: {
    challenge: string;
    solution: string;
    results: string;
    architecture: string;
    keyLearnings: string;
  };
}

const iconMap = {
  trending: TrendingUp,
  check: CheckCircle2,
  code: Code,
  layers: Layers,
};

export default function ProjectCaseStudy({
  challenge,
  solution,
  results,
  translations: t,
}: ProjectCaseStudyProps) {
  return (
    <div className="space-y-24">
      {/* Challenge Section */}
      {challenge && (
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 rounded-xl bg-red-500/20 border-2 border-red-500">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-black text-text-primary">
              {t.challenge}
            </h2>
          </div>

          <p className="text-xl text-text-secondary leading-relaxed max-w-4xl">
            {challenge.overview}
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {challenge.items.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card p-6 border-l-4 border-red-500/50 hover:border-red-500 transition-colors"
              >
                <h3 className="text-xl font-bold text-text-primary mb-3">
                  {item.title}
                </h3>
                <p className="text-text-secondary leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}

      {/* Solution Section */}
      {solution && (
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 rounded-xl bg-accent-primary/20 border-2 border-accent-primary">
              <Lightbulb className="w-8 h-8 text-accent-primary" />
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-black text-text-primary">
              {t.solution}
            </h2>
          </div>

          <p className="text-xl text-text-secondary leading-relaxed max-w-4xl">
            {solution.overview}
          </p>

          <div className="space-y-6">
            {solution.items.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card p-8 border-l-4 border-accent-primary/50 hover:border-accent-primary transition-colors"
              >
                <h3 className="text-2xl font-bold text-text-primary mb-4 flex items-center gap-3">
                  <span className="text-accent-primary">✓</span>
                  {item.title}
                </h3>
                <p className="text-lg text-text-secondary leading-relaxed mb-4">
                  {item.description}
                </p>
                {item.details && item.details.length > 0 && (
                  <ul className="space-y-2 mt-4 pl-6">
                    {item.details.map((detail, i) => (
                      <li
                        key={i}
                        className="text-text-secondary flex items-start gap-3"
                      >
                        <span className="text-accent-secondary mt-1">→</span>
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </motion.div>
            ))}
          </div>

          {/* Architecture Diagram */}
          {solution.architecture && (
            <div className="card p-8 bg-surface-light">
              <h3 className="text-2xl font-bold text-text-primary mb-4 flex items-center gap-3">
                <Layers className="w-6 h-6 text-accent-primary" />
                {t.architecture}
              </h3>
              <p className="text-text-secondary leading-relaxed mb-6">
                {solution.architecture.description}
              </p>
              {solution.architecture.diagram && (
                <div className="relative aspect-video rounded-xl overflow-hidden bg-surface">
                  <img
                    src={solution.architecture.diagram}
                    alt="Architecture Diagram"
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
            </div>
          )}
        </motion.section>
      )}

      {/* Results Section */}
      {results && (
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 rounded-xl bg-green-500/20 border-2 border-green-500">
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-black text-text-primary">
              {t.results}
            </h2>
          </div>

          <p className="text-xl text-text-secondary leading-relaxed max-w-4xl">
            {results.overview}
          </p>

          {/* Metrics Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {results.metrics.map((metric, index) => {
              const Icon = metric.icon ? iconMap[metric.icon] : TrendingUp;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="card p-6 text-center hover:scale-105 transition-transform"
                >
                  <div className="inline-flex p-3 rounded-full bg-accent-primary/20 mb-4">
                    <Icon className="w-6 h-6 text-accent-primary" />
                  </div>
                  <div className="text-3xl font-bold text-gradient mb-2">
                    {metric.value}
                  </div>
                  <div className="text-sm font-bold text-text-primary mb-2">
                    {metric.label}
                  </div>
                  {metric.description && (
                    <p className="text-xs text-text-muted">
                      {metric.description}
                    </p>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Key Learnings */}
          {results.learnings && results.learnings.length > 0 && (
            <div className="card p-8 bg-gradient-to-br from-accent-primary/10 to-accent-secondary/10 border-2 border-accent-primary/20">
              <h3 className="text-2xl font-bold text-text-primary mb-6">
                {t.keyLearnings}
              </h3>
              <ul className="space-y-4">
                {results.learnings.map((learning, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-4"
                  >
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-accent-primary/20 flex items-center justify-center text-accent-primary font-bold">
                      {index + 1}
                    </span>
                    <p className="text-text-secondary leading-relaxed pt-1">
                      {learning}
                    </p>
                  </motion.li>
                ))}
              </ul>
            </div>
          )}
        </motion.section>
      )}
    </div>
  );
}
