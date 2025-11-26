import { createClient } from "next-sanity";
import { defineEnableDraftMode } from "next-sanity/draft-mode";

// Create a dedicated client for draft mode with the token
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "p6hg7krm",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2025-01-01",
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

export const { GET } = defineEnableDraftMode({
  client,
});
