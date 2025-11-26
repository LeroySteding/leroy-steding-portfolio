import { createClient } from "next-sanity";
import { defineEnableDraftMode } from "next-sanity/draft-mode";

// Create a dedicated client for draft mode with token at runtime
// This ensures the token is read at request time, not at build time
function getDraftClient() {
  const token = process.env.SANITY_API_TOKEN;

  if (!token) {
    throw new Error("SANITY_API_TOKEN environment variable is required");
  }

  return createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "p6hg7krm",
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
    apiVersion: "2025-01-01",
    useCdn: false,
    token,
  });
}

// We need to lazily create the handler to ensure token is read at runtime
export async function GET(request: Request) {
  try {
    const client = getDraftClient();
    const { GET: handler } = defineEnableDraftMode({ client });
    return handler(request);
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: "Failed to enable draft mode",
        message: error instanceof Error ? error.message : String(error),
        hasToken: !!process.env.SANITY_API_TOKEN,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
