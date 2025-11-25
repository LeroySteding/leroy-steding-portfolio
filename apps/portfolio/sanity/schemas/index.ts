import experience from "./experience";
import page from "./page";
import post from "./post";
import project from "./project";
import { sections } from "./sections";
import { settings } from "./settings";

export const schemaTypes = [
  // Content Types
  post,
  project,
  experience,

  // Pages
  page,

  // Sections
  ...sections,

  // Settings
  ...settings,
];
