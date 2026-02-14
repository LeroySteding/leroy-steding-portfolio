import { Auth } from "convex/server";

export async function getAuthUserId(ctx: { auth: Auth }) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error("Not authenticated");
  }
  return identity.subject;
}

export async function requireAuth(ctx: { auth: Auth }) {
  const userId = await getAuthUserId(ctx);
  return userId;
}
