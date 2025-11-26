import { createClient } from "next-sanity";
import { defineEnableDraftMode } from "next-sanity/draft-mode";

const token = process.env.SANITY_API_TOKEN;

if (!token) {
  console.error("SANITY_API_TOKEN is not set");
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "p6hg7krm",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2025-01-01",
  useCdn: false,
  token,
});

const { GET: enableDraftMode } = defineEnableDraftMode({ client });

export async function GET(request: Request) {
  try {
    return await enableDraftMode(request);
  } catch (error) {
    console.error("Draft mode error:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to enable draft mode",
        message: error instanceof Error ? error.message : String(error),
        hasToken: !!token,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
