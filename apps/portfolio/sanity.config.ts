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
        origin: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
        previewMode: {
          enable: "/api/draft",
        },
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
