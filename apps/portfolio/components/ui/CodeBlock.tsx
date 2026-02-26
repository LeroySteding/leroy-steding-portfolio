"use client";

import { Check, Copy } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import {
  type BundledLanguage,
  type BundledTheme,
  codeToHtml,
  createHighlighter,
  HighlighterGeneric,
} from "shiki";

interface CodeBlockProps {
  code: string;
  language: string;
  showLineNumbers?: boolean;
  filename?: string;
}

// Language display names
const languageNames: Record<string, string> = {
  typescript: "TypeScript",
  javascript: "JavaScript",
  tsx: "TSX",
  jsx: "JSX",
  python: "Python",
  bash: "Bash",
  shell: "Shell",
  json: "JSON",
  css: "CSS",
  html: "HTML",
  markdown: "Markdown",
  yaml: "YAML",
  sql: "SQL",
  rust: "Rust",
  go: "Go",
  java: "Java",
  php: "PHP",
  ruby: "Ruby",
  swift: "Swift",
  kotlin: "Kotlin",
  dart: "Dart",
  c: "C",
  cpp: "C++",
  csharp: "C#",
};

export default function CodeBlock({
  code,
  language,
  showLineNumbers = false,
  filename,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const [html, setHtml] = useState<string>("");
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Wait for theme to mount to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const highlightCode = async () => {
      const highlighter = await createHighlighter({
        themes: ["github-light", "github-dark"],
        langs: [
          "typescript",
          "javascript",
          "tsx",
          "jsx",
          "python",
          "bash",
          "json",
          "css",
          "html",
          "markdown",
          "yaml",
          "sql",
          "rust",
          "go",
          "java",
          "php",
          "ruby",
          "swift",
          "kotlin",
          "dart",
          "c",
          "cpp",
          "csharp",
        ] as BundledLanguage[],
      });

      const theme = resolvedTheme === "dark" ? "github-dark" : "github-light";

      const html = await codeToHtml(code, {
        lang: language as BundledLanguage,
        theme: theme as BundledTheme,
        transformers: showLineNumbers
          ? [
              {
                name: "line-numbers",
                line(node, line) {
                  node.children.unshift({
                    type: "element",
                    tagName: "span",
                    properties: {
                      class: "line-number",
                      "data-line": line,
                    },
                    children: [],
                  });
                },
              },
            ]
          : [],
      });

      setHtml(html);
    };

    highlightCode();
  }, [code, language, resolvedTheme, showLineNumbers, mounted]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  const displayLanguage =
    languageNames[language.toLowerCase()] || language.toUpperCase();

  if (!mounted) {
    // Show loading state during hydration
    return (
      <div className="relative group my-8 rounded-xl overflow-hidden bg-surface border-2 border-surface-light">
        <div className="flex items-center justify-between px-6 py-3 bg-surface-light/50">
          <span className="text-xs font-bold text-text-muted uppercase tracking-wider">
            Loading...
          </span>
        </div>
        <div className="p-6">
          <pre className="text-sm text-text-muted">
            <code>{code}</code>
          </pre>
        </div>
      </div>
    );
  }

  return (
    <div className="relative group my-8 rounded-xl overflow-hidden bg-surface border-2 border-surface-light hover:border-accent-primary/30 transition-all">
      {/* Header with filename or language badge + copy button */}
      <div className="flex items-center justify-between px-6 py-3 bg-surface-light/50 backdrop-blur-sm border-b border-surface-light">
        <div className="flex items-center gap-3">
          {filename ? (
            <span className="text-sm font-mono text-text-primary font-bold">
              {filename}
            </span>
          ) : (
            <span className="text-xs font-bold text-text-muted uppercase tracking-wider">
              {displayLanguage}
            </span>
          )}
        </div>

        {/* Copy Button */}
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface hover:bg-accent-primary/20 text-text-secondary hover:text-accent-primary transition-all border border-transparent hover:border-accent-primary/30"
          aria-label="Copy code"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              <span className="text-xs font-bold">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span className="text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                Copy
              </span>
            </>
          )}
        </button>
      </div>

      {/* Code Content */}
      <div className="relative overflow-x-auto">
        <style
          // biome-ignore lint/security/noDangerouslySetInnerHtml: Shiki generates safe HTML
          dangerouslySetInnerHTML={{
            __html: `
              .shiki-wrapper pre {
                margin: 0;
                padding: 1.5rem;
                font-size: 0.875rem;
                line-height: 1.6;
                overflow-x: auto;
              }
              .shiki-wrapper code {
                font-family: ui-monospace, 'Cascadia Code', 'Source Code Pro', Menlo, Consolas, 'DejaVu Sans Mono', monospace;
                counter-reset: line;
              }
              .shiki-wrapper .line {
                display: inline-block;
                width: 100%;
              }
              ${
                showLineNumbers
                  ? `
              .shiki-wrapper .line::before {
                counter-increment: line;
                content: counter(line);
                display: inline-block;
                width: 2.5rem;
                margin-right: 1.5rem;
                text-align: right;
                color: var(--shiki-token-comment);
                opacity: 0.5;
                user-select: none;
              }
              `
                  : ""
              }
            `,
          }}
        />
        <div
          className="shiki-wrapper"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: Shiki generates safe HTML
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>

      {/* Language Badge - Bottom Right */}
      {!filename && (
        <div className="absolute bottom-4 right-4 px-3 py-1.5 rounded-lg bg-accent-primary/10 backdrop-blur-sm border border-accent-primary/20 opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="text-xs font-bold text-accent-primary uppercase tracking-wider">
            {displayLanguage}
          </span>
        </div>
      )}
    </div>
  );
}
