import { NextResponse } from "next/server";

export async function GET() {
  const apiKey = process.env.OPENAI_API_KEY;

  return NextResponse.json({
    hasKey: !!apiKey,
    keyLength: apiKey?.length || 0,
    keyPrefix: apiKey?.substring(0, 20) || "none",
    allEnvKeys: Object.keys(process.env).filter(
      (k) => k.includes("OPENAI") || k.includes("SANITY"),
    ),
  });
}
