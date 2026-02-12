/**
 * Convex HTTP Client for server-side queries (SSR)
 *
 * Uses ConvexHttpClient instead of React hooks since the portfolio is SSR.
 * Points to the same Convex deployment as the admin app.
 */
import { ConvexHttpClient } from "convex/browser";
import { anyApi } from "convex/server";

const CONVEX_URL =
  process.env.NEXT_PUBLIC_CONVEX_URL ??
  "https://hallowed-mole-286.eu-west-1.convex.cloud";

export const convex = new ConvexHttpClient(CONVEX_URL);

/**
 * Helper to query a Convex function by name string.
 * Since the portfolio doesn't have its own convex/ folder,
 * we use anyApi to reference functions by path.
 */
export async function queryConvex<T>(
  functionPath: string,
  args: Record<string, unknown> = {},
): Promise<T> {
  // Parse "module:functionName" format
  const [module, fn] = functionPath.split(":");
  const ref = (anyApi as any)[module][fn];
  return convex.query(ref, args);
}
