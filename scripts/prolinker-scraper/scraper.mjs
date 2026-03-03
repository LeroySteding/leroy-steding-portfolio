#!/usr/bin/env node
/**
 * ProLinker Job Scraper
 * 
 * Uses Firecrawl API to scrape prolinker.com (bypasses Cloudflare)
 * and pushes results to Convex scraped_jobs table.
 * 
 * Usage:
 *   node scraper.mjs              # Full scrape
 *   DRY_RUN=true node scraper.mjs # Print results, don't push
 *   node scraper.mjs --test       # 1 page only, dry run
 */

import { ConvexHttpClient } from "convex/browser";

// ─── Config ──────────────────────────────────────────────────────────────────

const CONVEX_URL = process.env.CONVEX_URL || "https://hallowed-mole-286.convex.cloud";
const FIRECRAWL_API_KEY = process.env.FIRECRAWL_API_KEY;
const DRY_RUN = process.env.DRY_RUN === "true" || process.argv.includes("--test");
const TEST_MODE = process.argv.includes("--test");
const MAX_PAGES = TEST_MODE ? 1 : 10;
const RATE_LIMIT_MS = 1500;
const SOURCE = "prolinker";
const BASE_URL = "https://prolinker.com";

// Tech categories to focus on (URL path segments)
const TECH_CATEGORIES = [
  "website-and-apps", "software-and-systems", "technology-and-science",
];

// ─── Logging ─────────────────────────────────────────────────────────────────

function log(level, msg, data) {
  const ts = new Date().toISOString();
  const prefix = { info: "ℹ️", warn: "⚠️", error: "❌", ok: "✅" }[level] || "•";
  console.log(`${prefix} [${ts}] ${msg}`, data ? JSON.stringify(data) : "");
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ─── Firecrawl Fetch ─────────────────────────────────────────────────────────

async function fetchPage(url) {
  if (!FIRECRAWL_API_KEY) {
    throw new Error("FIRECRAWL_API_KEY not set");
  }

  const res = await fetch("https://api.firecrawl.dev/v1/scrape", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${FIRECRAWL_API_KEY}`,
    },
    body: JSON.stringify({
      url,
      formats: ["markdown"],
      waitFor: 3000,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Firecrawl error ${res.status}: ${text}`);
  }

  const data = await res.json();
  return data.data?.markdown || "";
}

// ─── Parser ──────────────────────────────────────────────────────────────────

function parseProjectList(markdown) {
  const projects = [];

  // Match project entries: [Title](URL) followed by Category, Budget, Location, Status
  const projectRegex = /\[([^\]]+)\]\((https:\/\/prolinker\.com\/projects\/[^\)]+)\)/g;
  let match;

  while ((match = projectRegex.exec(markdown)) !== null) {
    const title = match[1];
    const url = match[2];

    // Skip pagination links
    if (url.match(/\?page=\d+$/)) continue;

    // Extract context around this match (next ~300 chars after the link)
    const afterIdx = match.index + match[0].length;
    const context = markdown.slice(afterIdx, afterIdx + 400);

    // Parse category
    const categoryMatch = context.match(/Category\s*\n\n([\s\S]*?)(?:\n\nBudget|\n\n€)/);
    let category = null;
    let subcategory = null;
    if (categoryMatch) {
      const catText = categoryMatch[1].trim();
      // Categories are concatenated like "Software and systemsSoftware Development"
      const knownCats = [
        "Website and Apps", "Software and systems", "Technology and Science",
        "Graphic and Design", "Marketing and communication", "Text and translation",
        "Film, TV and Photography", "Financial", "Coaching", "Training and education",
        "Legal", "Administrative, Secretarial and Support", "(Interim) Management and Consulting",
        "Sales and Account management", "Health and Welfare", "Construction",
        "Events and Lifestyle", "Other",
      ];
      for (const c of knownCats) {
        if (catText.startsWith(c)) {
          category = c;
          subcategory = catText.slice(c.length).trim() || null;
          break;
        }
      }
      if (!category) category = catText;
    }

    // Parse budget
    const budgetMatch = context.match(/Budget\s*\n\n([\s\S]*?)(?:\n\nLocation)/);
    const budget = budgetMatch ? budgetMatch[1].trim() : "In consultation";

    // Parse location
    const locationMatch = context.match(/Location\s*\n\n([\s\S]*?)(?:\n\nStatus)/);
    const location = locationMatch ? locationMatch[1].trim() : null;

    // Parse status
    const statusMatch = context.match(/Status\s*\n\n(\w+)/);
    const status = statusMatch ? statusMatch[1].trim() : "Open";

    projects.push({ title, url, category, subcategory, budget, location, status });
  }

  return projects;
}

function extractTechnologies(title, description, subcategory) {
  const tags = new Set();
  const text = `${title} ${description || ""} ${subcategory || ""}`.toLowerCase();

  const kwMap = {
    react: "React", "next.js": "Next.js", nextjs: "Next.js",
    vue: "Vue.js", angular: "Angular", typescript: "TypeScript",
    javascript: "JavaScript", python: "Python", java: "Java",
    "c#": "C#", ".net": ".NET", php: "PHP", laravel: "Laravel",
    node: "Node.js", express: "Express", django: "Django",
    ruby: "Ruby", swift: "Swift", kotlin: "Kotlin", flutter: "Flutter",
    "react native": "React Native", docker: "Docker", kubernetes: "Kubernetes",
    aws: "AWS", azure: "Azure", gcp: "GCP",
    mysql: "MySQL", postgresql: "PostgreSQL", mongodb: "MongoDB",
    graphql: "GraphQL", wordpress: "WordPress", shopify: "Shopify",
    woocommerce: "WooCommerce", tailwind: "Tailwind CSS",
    jquery: "jQuery", ajax: "AJAX", html: "HTML", css: "CSS",
    figma: "Figma", "ui/ux": "UI/UX", "front-end": "Frontend",
    "back-end": "Backend", "full stack": "Full Stack",
    "web design": "Web Design", "e-commerce": "E-Commerce",
    "app development": "App Development", "web application": "Web Apps",
    "software development": "Software Development",
    "cloud computing": "Cloud", "machine learning": "AI/ML",
    "data processing": "Data Processing",
  };

  for (const [kw, tag] of Object.entries(kwMap)) {
    if (text.includes(kw)) tags.add(tag);
  }

  return [...tags];
}

// ─── Detail Scraper ──────────────────────────────────────────────────────────

async function scrapeProjectDetail(url) {
  try {
    const md = await fetchPage(url);
    // Clean up — extract the main content (skip nav/footer)
    const lines = md.split("\n");
    // Find the project description section
    const descStart = lines.findIndex((l) => l.includes("Project description") || l.includes("Description"));
    const description = descStart >= 0
      ? lines.slice(descStart, descStart + 30).join("\n").slice(0, 2000)
      : lines.slice(0, 40).join("\n").slice(0, 2000);
    return description;
  } catch (e) {
    log("warn", `Failed to scrape detail: ${url}`, { error: e.message });
    return null;
  }
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  log("info", "ProLinker Scraper starting", { dryRun: DRY_RUN, testMode: TEST_MODE, maxPages: MAX_PAGES });

  if (!FIRECRAWL_API_KEY) {
    log("error", "FIRECRAWL_API_KEY not set. Export it or add to .env");
    process.exitCode = 1;
    return;
  }

  const allJobs = [];
  const seenUrls = new Set();

  try {
    // Scrape listing pages
    for (let page = 1; page <= MAX_PAGES; page++) {
      const url = page === 1
        ? `${BASE_URL}/projects`
        : `${BASE_URL}/projects?page=${page}`;

      log("info", `Fetching page ${page}: ${url}`);
      const markdown = await fetchPage(url);
      const projects = parseProjectList(markdown);

      if (projects.length === 0) {
        log("info", `No projects found on page ${page}, stopping pagination`);
        break;
      }

      log("info", `Page ${page}: ${projects.length} projects found`);

      for (const p of projects) {
        if (seenUrls.has(p.url)) continue;
        seenUrls.add(p.url);

        // Filter: only tech-relevant projects or all if no category filter needed
        const isTech = TECH_CATEGORIES.some((tc) =>
          p.url.toLowerCase().includes(tc) ||
          (p.category && p.category.toLowerCase().includes(tc.replace(/-/g, " ")))
        );

        // Scrape detail page for tech projects
        let description = p.title;
        if (isTech) {
          log("info", `Fetching detail for: ${p.title}`);
          const detail = await scrapeProjectDetail(p.url);
          if (detail) description = detail;
          await sleep(RATE_LIMIT_MS);
        }

        const technologies = extractTechnologies(p.title, description, p.subcategory);

        allJobs.push({
          title: p.title,
          company: "ProLinker Client",
          location: p.location || "Remote",
          description: description,
          salary: p.budget || "In consultation",
          url: p.url,
          technologies,
          postedAt: Date.now(),
          source: SOURCE,
          remote: p.location ? p.location.toLowerCase().includes("remote") : true,
          employmentType: p.budget?.toLowerCase().includes("per hour") ? "contract" : "freelance",
          experienceLevel: undefined,
        });
      }

      await sleep(RATE_LIMIT_MS);
    }

    log("ok", `Scraped ${allJobs.length} unique jobs (${allJobs.filter(j => j.technologies.length > 0).length} with tech tags)`);

    // ─── Push to Convex ──────────────────────────────────────────────
    if (DRY_RUN) {
      log("info", "DRY RUN — not pushing to Convex");
      for (const j of allJobs) {
        console.log(`  ${j.title} | ${j.salary} | ${j.location} | [${j.technologies.join(", ")}]`);
      }
      console.log(`\nTotal: ${allJobs.length} jobs`);
    } else if (allJobs.length > 0) {
      log("info", `Pushing ${allJobs.length} jobs to Convex...`);
      const client = new ConvexHttpClient(CONVEX_URL);

      const batchSize = 10;
      let created = 0, updated = 0, errors = 0;

      for (let i = 0; i < allJobs.length; i += batchSize) {
        const batch = allJobs.slice(i, i + batchSize);
        try {
          const result = await client.mutation("scraped_jobs:pushBatch", {
            jobs: batch.map((j) => ({
              title: j.title,
              company: j.company,
              location: j.location,
              description: j.description,
              salary: j.salary,
              url: j.url,
              technologies: j.technologies,
              postedAt: j.postedAt,
              source: j.source,
              remote: j.remote,
              employmentType: j.employmentType,
              experienceLevel: j.experienceLevel,
            })),
          });
          created += result.created || 0;
          updated += result.updated || 0;
          errors += (result.errors || []).length;
        } catch (e) {
          log("error", "Batch push failed", { error: e.message });
          errors += batch.length;
        }
      }

      log("ok", `Done! Created: ${created}, Updated: ${updated}, Errors: ${errors}`);
    } else {
      log("warn", "No jobs found");
    }
  } catch (e) {
    log("error", "Scraper failed", { error: e.message, stack: e.stack });
    process.exitCode = 1;
  }
}

main();
