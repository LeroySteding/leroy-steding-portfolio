import { defineEnableDraftMode } from "next-sanity/draft-mode";
import { client } from "@/sanity/lib/client";

// Ensure we have a token for draft mode
const token = process.env.SANITY_API_TOKEN;

if (!token) {
  throw new Error(
    "The SANITY_API_TOKEN environment variable is required for draft mode.",
  );
}

// Use the existing client but ensure token is set
const draftClient = client.withConfig({ token });

export const { GET } = defineEnableDraftMode({
  client: draftClient,
});
