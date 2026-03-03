export async function getAuthUserId(ctx) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
        throw new Error("Not authenticated");
    }
    return identity.subject;
}
export async function requireAuth(ctx) {
    const userId = await getAuthUserId(ctx);
    return userId;
}
