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
          // Blog routes
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
          // Projects routes
          {
            route: "/projects/:id",
            filter: `_type == "project" && slug.current == $id`,
          },
          {
            route: "/en/projects/:id",
            filter: `_type == "project" && slug.current == $id && (language == "en" || !defined(language))`,
          },
          {
            route: "/nl/projects/:id",
            filter: `_type == "project" && slug.current == $id && language == "nl"`,
          },
          // Experience routes
          {
            route: "/experience/:id",
            filter: `_type == "experience" && slug.current == $id`,
          },
          {
            route: "/en/experience/:id",
            filter: `_type == "experience" && slug.current == $id && (language == "en" || !defined(language))`,
          },
          {
            route: "/nl/experience/:id",
            filter: `_type == "experience" && slug.current == $id && language == "nl"`,
          },
          // About page
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
          // Projects listing page
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
          // Contact page
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
