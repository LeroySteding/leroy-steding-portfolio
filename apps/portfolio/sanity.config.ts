import { documentInternationalization } from "@sanity/document-internationalization";
import { visionTool } from "@sanity/vision";
import { type Config, defineConfig } from "sanity";
import { presentationTool } from "sanity/presentation";
import { structureTool } from "sanity/structure";
import { markdownSchema } from "sanity-plugin-markdown";
import { schemaTypes } from "./sanity/schemas";
import { structure } from "./sanity/structure";

// Fallback values ensure Studio works even if env vars aren't loaded at build time
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "p6hg7krm";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

// Determine if we're on the studio subdomain
const isStudioSubdomain =
  typeof window !== "undefined" &&
  window.location.hostname === "studio.leroysteding.nl";

// Determine the preview URL based on environment
const getPreviewUrl = () => {
  if (typeof window !== "undefined") {
    // In browser, check if we're on the studio subdomain
    if (window.location.hostname === "studio.leroysteding.nl") {
      return "https://www.leroysteding.nl";
    }
    if (window.location.hostname === "localhost") {
      return "http://localhost:3000";
    }
  }
  return process.env.NEXT_PUBLIC_SITE_URL || "https://www.leroysteding.nl";
};

const config: Config = defineConfig({
  name: "default",
  title: "Leroy Steding Portfolio",

  projectId,
  dataset,

  // Use root path on studio subdomain, /studio path on main domain
  basePath: isStudioSubdomain ? "/" : "/studio",

  plugins: [
    structureTool({ structure }),
    presentationTool({
      previewUrl: {
        origin: getPreviewUrl(),
        previewMode: {
          enable: "/api/draft",
        },
      },
      resolve: {
        // Map documents to their preview URLs
        locations: {
          // Pages use their slug for routing
          page: {
            select: {
              slug: "slug.current",
              language: "language",
            },
            resolve: (doc) => {
              const lang = doc?.language || "en";
              const slug = doc?.slug;
              if (slug === "home") {
                return {
                  locations: [
                    { title: `Homepage (${lang})`, href: `/${lang}` },
                  ],
                };
              }
              return {
                locations: [
                  { title: `${slug} (${lang})`, href: `/${lang}/${slug}` },
                ],
              };
            },
          },
          // Blog posts
          post: {
            select: {
              slug: "slug.current",
              title: "title",
              language: "language",
            },
            resolve: (doc) => {
              const lang = doc?.language || "en";
              return {
                locations: [
                  {
                    title: doc?.title || "Blog Post",
                    href: `/${lang}/blog/${doc?.slug}`,
                  },
                ],
              };
            },
          },
          // Projects
          project: {
            select: {
              slug: "slug.current",
              title: "title",
              language: "language",
            },
            resolve: (doc) => {
              const lang = doc?.language || "en";
              return {
                locations: [
                  {
                    title: doc?.title || "Project",
                    href: `/${lang}/projects/${doc?.slug}`,
                  },
                ],
              };
            },
          },
          // Experience
          experience: {
            select: {
              slug: "slug.current",
              title: "title",
              language: "language",
            },
            resolve: (doc) => {
              const lang = doc?.language || "en";
              return {
                locations: [
                  {
                    title: doc?.title || "Experience",
                    href: `/${lang}/experience/${doc?.slug}`,
                  },
                ],
              };
            },
          },
          // Section documents - show where they appear
          hero: {
            select: { language: "language" },
            resolve: (doc) => ({
              locations: [
                {
                  title: "Homepage",
                  href: `/${doc?.language || "en"}`,
                },
              ],
            }),
          },
          aboutSection: {
            select: { language: "language" },
            resolve: (doc) => ({
              locations: [
                {
                  title: "About Page",
                  href: `/${doc?.language || "en"}/about`,
                },
              ],
            }),
          },
          contactSection: {
            select: { language: "language" },
            resolve: (doc) => ({
              locations: [
                {
                  title: "Contact Page",
                  href: `/${doc?.language || "en"}/contact`,
                },
              ],
            }),
          },
          projectsSection: {
            select: { language: "language" },
            resolve: (doc) => ({
              locations: [
                {
                  title: "Projects Page",
                  href: `/${doc?.language || "en"}/projects`,
                },
              ],
            }),
          },
          experienceSection: {
            select: { language: "language" },
            resolve: (doc) => ({
              locations: [
                {
                  title: "Homepage (Experience)",
                  href: `/${doc?.language || "en"}`,
                },
              ],
            }),
          },
          skillsSection: {
            select: { language: "language" },
            resolve: (doc) => ({
              locations: [
                {
                  title: "Homepage (Skills)",
                  href: `/${doc?.language || "en"}`,
                },
              ],
            }),
          },
          blogSection: {
            select: { language: "language" },
            resolve: (doc) => ({
              locations: [
                {
                  title: "Blog Page",
                  href: `/${doc?.language || "en"}/blog`,
                },
              ],
            }),
          },
          techStackSection: {
            select: { language: "language" },
            resolve: (doc) => ({
              locations: [
                {
                  title: "Homepage (Tech Stack)",
                  href: `/${doc?.language || "en"}`,
                },
              ],
            }),
          },
        },
        // Map routes to documents for the preview iframe
        mainDocuments: [
          // Homepage routes
          {
            route: "/",
            filter: `_type == "page" && slug.current == "home" && (language == "en" || !defined(language))`,
          },
          {
            route: "/en",
            filter: `_type == "page" && slug.current == "home" && (language == "en" || !defined(language))`,
          },
          {
            route: "/nl",
            filter: `_type == "page" && slug.current == "home" && language == "nl"`,
          },
          // Blog listing routes
          {
            route: "/blog",
            filter: `_type == "blogSection" && (language == "en" || !defined(language))`,
          },
          {
            route: "/en/blog",
            filter: `_type == "blogSection" && (language == "en" || !defined(language))`,
          },
          {
            route: "/nl/blog",
            filter: `_type == "blogSection" && language == "nl"`,
          },
          // Blog post routes
          {
            route: "/blog/:slug",
            filter: `_type == "post" && slug.current == $slug`,
          },
          {
            route: "/en/blog/:slug",
            filter: `_type == "post" && slug.current == $slug && (language == "en" || !defined(language))`,
          },
          {
            route: "/nl/blog/:slug",
            filter: `_type == "post" && slug.current == $slug && language == "nl"`,
          },
          // Projects listing routes
          {
            route: "/projects",
            filter: `_type == "projectsSection" && (language == "en" || !defined(language))`,
          },
          {
            route: "/en/projects",
            filter: `_type == "projectsSection" && (language == "en" || !defined(language))`,
          },
          {
            route: "/nl/projects",
            filter: `_type == "projectsSection" && language == "nl"`,
          },
          // Project detail routes
          {
            route: "/projects/:slug",
            filter: `_type == "project" && slug.current == $slug`,
          },
          {
            route: "/en/projects/:slug",
            filter: `_type == "project" && slug.current == $slug && (language == "en" || !defined(language))`,
          },
          {
            route: "/nl/projects/:slug",
            filter: `_type == "project" && slug.current == $slug && language == "nl"`,
          },
          // Experience routes
          {
            route: "/experience/:slug",
            filter: `_type == "experience" && slug.current == $slug`,
          },
          {
            route: "/en/experience/:slug",
            filter: `_type == "experience" && slug.current == $slug && (language == "en" || !defined(language))`,
          },
          {
            route: "/nl/experience/:slug",
            filter: `_type == "experience" && slug.current == $slug && language == "nl"`,
          },
          // About page routes
          {
            route: "/about",
            filter: `_type == "aboutSection" && (language == "en" || !defined(language))`,
          },
          {
            route: "/en/about",
            filter: `_type == "aboutSection" && (language == "en" || !defined(language))`,
          },
          {
            route: "/nl/about",
            filter: `_type == "aboutSection" && language == "nl"`,
          },
          // Contact page routes
          {
            route: "/contact",
            filter: `_type == "contactSection" && (language == "en" || !defined(language))`,
          },
          {
            route: "/en/contact",
            filter: `_type == "contactSection" && (language == "en" || !defined(language))`,
          },
          {
            route: "/nl/contact",
            filter: `_type == "contactSection" && language == "nl"`,
          },
        ],
      },
    }),
    visionTool(),
    markdownSchema(),
    documentInternationalization({
      supportedLanguages: [
        { id: "en", title: "English" },
        { id: "nl", title: "Nederlands" },
      ],
      schemaTypes: [
        "post",
        "project",
        "experience",
        "page",
        "hero",
        "aboutSection",
        "contactSection",
        "projectsSection",
        "experienceSection",
        "skillsSection",
        "blogSection",
        "techStackSection",
      ],
    }),
  ],

  schema: {
    types: schemaTypes,
  },
});

export default config;
