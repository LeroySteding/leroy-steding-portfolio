import { draftMode } from "next/headers";
import { redirect } from "next/navigation";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");
  const slug = searchParams.get("slug") || "/";

  // Check the secret if provided (for manual draft mode activation)
  // The presentation tool doesn't always send a secret, so we allow requests
  // from Sanity Studio origins
  const origin = request.headers.get("origin") || "";
  const referer = request.headers.get("referer") || "";
  const isSanityStudio =
    origin.includes("sanity.studio") ||
    origin.includes("studio.leroysteding.nl") ||
    referer.includes("sanity.studio") ||
    referer.includes("studio.leroysteding.nl");

  if (secret) {
    // If secret is provided, validate it
    if (secret !== process.env.SANITY_PREVIEW_SECRET) {
      return new Response("Invalid token", { status: 401 });
    }
  } else if (!isSanityStudio) {
    // If no secret and not from Sanity Studio, reject
    return new Response("Missing secret parameter", { status: 401 });
  }

  // Enable Draft Mode
  const draft = await draftMode();
  draft.enable();

  // Redirect to the path from the fetched post
  redirect(slug);
}

// Handle POST requests from Sanity Presentation tool
export async function POST(request: Request) {
  const draft = await draftMode();
  draft.enable();

  return new Response(JSON.stringify({ status: "Draft mode enabled" }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
