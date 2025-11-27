import experience from "./experience";
import page from "./page";
import post from "./post";
import project from "./project";
import { sections } from "./sections";
import service from "./service";
import { settings } from "./settings";

export const schemaTypes = [
  // Content Types
  post,
  project,
  experience,
  service,

  // Pages
  page,

  // Sections
  ...sections,

  // Settings
  ...settings,
];
