import { documentInternationalization } from "@sanity/document-internationalization";
import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { presentationTool } from "sanity/presentation";
import { structureTool } from "sanity/structure";
import { markdownSchema } from "sanity-plugin-markdown";
import { schemaTypes } from "./sanity/schemas";
import { structure } from "./sanity/structure";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!;

export default defineConfig({
  name: "default",
  title: "Leroy Steding Portfolio",

  projectId,
  dataset,

  basePath: "/studio",

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
}) as any;
