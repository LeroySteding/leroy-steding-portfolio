/**
 * Klantportaal - Portal Branding & Client Access
 */

import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// ========== PORTAL BRANDING QUERIES ==========

export const getPortalBranding = query({
  args: { userId: v.id("zzp_users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("klant_portal_branding")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();
  },
});

export const getPortalBySubdomain = query({
  args: { subdomain: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("klant_portal_branding")
      .withIndex("by_subdomain", (q) => q.eq("portal_subdomain", args.subdomain))
      .first();
  },
});

export const getPortalByCustomDomain = query({
  args: { domain: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("klant_portal_branding")
      .withIndex("by_custom_domain", (q) => q.eq("custom_domain", args.domain))
      .first();
  },
});

// ========== PORTAL BRANDING MUTATIONS ==========

export const createPortalBranding = mutation({
  args: {
    userId: v.id("zzp_users"),
    company_name: v.string(),
    portal_subdomain: v.string(),
    support_email: v.string(),
    primary_color: v.optional(v.string()),
    secondary_color: v.optional(v.string()),
    logo_url: v.optional(v.string()),
    favicon_url: v.optional(v.string()),
    welcome_message: v.optional(v.string()),
    terms_url: v.optional(v.string()),
    privacy_url: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if branding already exists
    const existing = await ctx.db
      .query("klant_portal_branding")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();

    if (existing) {
      throw new Error("Portal branding already exists. Use update instead.");
    }

    // Check if subdomain is available
    const subdomainTaken = await ctx.db
      .query("klant_portal_branding")
      .withIndex("by_subdomain", (q) => q.eq("portal_subdomain", args.portal_subdomain))
      .first();

    if (subdomainTaken) {
      throw new Error("This subdomain is already taken. Please choose another.");
    }

    const now = Date.now();
    const brandingId = await ctx.db.insert("klant_portal_branding", {
      userId: args.userId,
      company_name: args.company_name,
      portal_subdomain: args.portal_subdomain,
      support_email: args.support_email,
      primary_color: args.primary_color || "#3b82f6",
      secondary_color: args.secondary_color,
      logo_url: args.logo_url,
      favicon_url: args.favicon_url,
      welcome_message: args.welcome_message,
      terms_url: args.terms_url,
      privacy_url: args.privacy_url,
      active: true,
      createdAt: now,
      updatedAt: now,
    });

    return brandingId;
  },
});

export const updatePortalBranding = mutation({
  args: {
    brandingId: v.id("klant_portal_branding"),
    company_name: v.optional(v.string()),
    portal_subdomain: v.optional(v.string()),
    custom_domain: v.optional(v.string()),
    support_email: v.optional(v.string()),
    primary_color: v.optional(v.string()),
    secondary_color: v.optional(v.string()),
    logo_url: v.optional(v.string()),
    favicon_url: v.optional(v.string()),
    welcome_message: v.optional(v.string()),
    terms_url: v.optional(v.string()),
    privacy_url: v.optional(v.string()),
    active: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { brandingId, portal_subdomain, ...otherUpdates } = args;

    // If changing subdomain, check availability
    if (portal_subdomain) {
      const current = await ctx.db.get(brandingId);
      if (current && current.portal_subdomain !== portal_subdomain) {
        const subdomainTaken = await ctx.db
          .query("klant_portal_branding")
          .withIndex("by_subdomain", (q) => q.eq("portal_subdomain", portal_subdomain))
          .first();

        if (subdomainTaken) {
          throw new Error("This subdomain is already taken. Please choose another.");
        }
      }
    }

    await ctx.db.patch(brandingId, {
      portal_subdomain,
      ...otherUpdates,
      updatedAt: Date.now(),
    });

    return brandingId;
  },
});

// ========== CLIENT ACCESS QUERIES ==========

export const getClientAccess = query({
  args: { clientId: v.id("fact_clients") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("klant_client_access")
      .withIndex("by_client", (q) => q.eq("clientId", args.clientId))
      .first();
  },
});

export const getClientByAccessToken = query({
  args: { accessToken: v.string() },
  handler: async (ctx, args) => {
    const access = await ctx.db
      .query("klant_client_access")
      .withIndex("by_access_token", (q) => q.eq("accessToken", args.accessToken))
      .first();

    if (!access || !access.active) {
      return null;
    }

    // Get client details
    const client = await ctx.db.get(access.clientId);
    
    return {
      access,
      client,
    };
  },
});

export const getClientAccessByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("klant_client_access")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
  },
});

// ========== CLIENT ACCESS MUTATIONS ==========

export const createClientAccess = mutation({
  args: {
    clientId: v.id("fact_clients"),
    email: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if access already exists
    const existing = await ctx.db
      .query("klant_client_access")
      .withIndex("by_client", (q) => q.eq("clientId", args.clientId))
      .first();

    if (existing) {
      return existing._id; // Return existing access
    }

    // Generate access token (in production, use crypto.randomUUID() or similar)
    const accessToken = `portal_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    const accessId = await ctx.db.insert("klant_client_access", {
      clientId: args.clientId,
      email: args.email,
      accessToken,
      loginCount: 0,
      active: true,
      createdAt: Date.now(),
    });

    return accessId;
  },
});

export const recordClientLogin = mutation({
  args: { accessToken: v.string() },
  handler: async (ctx, args) => {
    const access = await ctx.db
      .query("klant_client_access")
      .withIndex("by_access_token", (q) => q.eq("accessToken", args.accessToken))
      .first();

    if (!access) {
      throw new Error("Invalid access token");
    }

    await ctx.db.patch(access._id, {
      lastLoginAt: Date.now(),
      loginCount: access.loginCount + 1,
    });
  },
});

export const deactivateClientAccess = mutation({
  args: { accessId: v.id("klant_client_access") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.accessId, {
      active: false,
    });
  },
});

export const reactivateClientAccess = mutation({
  args: { accessId: v.id("klant_client_access") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.accessId, {
      active: true,
    });
  },
});

export const regenerateAccessToken = mutation({
  args: { accessId: v.id("klant_client_access") },
  handler: async (ctx, args) => {
    const newToken = `portal_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    
    await ctx.db.patch(args.accessId, {
      accessToken: newToken,
    });

    return newToken;
  },
});

export const deleteClientAccess = mutation({
  args: { accessId: v.id("klant_client_access") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.accessId);
  },
});
