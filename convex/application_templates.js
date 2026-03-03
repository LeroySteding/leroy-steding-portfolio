/**
 * Application Templates
 *
 * Pre-filled data for job applications. Supports multiple templates for different
 * job types or scenarios.
 */
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAuth } from "./_helpers";
export const list = query({
    args: {},
    handler: async (ctx) => {
        await requireAuth(ctx);
        return await ctx.db.query("application_templates").order("desc").collect();
    },
});
export const get = query({
    args: { id: v.id("application_templates") },
    handler: async (ctx, args) => {
        await requireAuth(ctx);
        return await ctx.db.get(args.id);
    },
});
export const getDefault = query({
    args: {},
    handler: async (ctx) => {
        await requireAuth(ctx);
        const defaultTemplate = await ctx.db
            .query("application_templates")
            .withIndex("by_is_default", (q) => q.eq("isDefault", true))
            .first();
        return defaultTemplate;
    },
});
export const create = mutation({
    args: {
        name: v.string(),
        isDefault: v.boolean(),
        fullName: v.string(),
        email: v.string(),
        phone: v.string(),
        location: v.string(),
        linkedinUrl: v.optional(v.string()),
        githubUrl: v.optional(v.string()),
        portfolioUrl: v.optional(v.string()),
        cvUrl: v.optional(v.string()),
        cvStorageId: v.optional(v.id("_storage")),
        coverLetterTemplate: v.optional(v.string()),
        availability: v.optional(v.string()),
        salaryExpectation: v.optional(v.string()),
        rightsToWork: v.optional(v.string()),
        customFields: v.optional(v.object({})),
    },
    handler: async (ctx, args) => {
        await requireAuth(ctx);
        // If setting as default, unset other defaults
        if (args.isDefault) {
            const existingDefaults = await ctx.db
                .query("application_templates")
                .withIndex("by_is_default", (q) => q.eq("isDefault", true))
                .collect();
            for (const template of existingDefaults) {
                await ctx.db.patch(template._id, { isDefault: false });
            }
        }
        return await ctx.db.insert("application_templates", {
            ...args,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        });
    },
});
export const update = mutation({
    args: {
        id: v.id("application_templates"),
        name: v.optional(v.string()),
        isDefault: v.optional(v.boolean()),
        fullName: v.optional(v.string()),
        email: v.optional(v.string()),
        phone: v.optional(v.string()),
        location: v.optional(v.string()),
        linkedinUrl: v.optional(v.string()),
        githubUrl: v.optional(v.string()),
        portfolioUrl: v.optional(v.string()),
        cvUrl: v.optional(v.string()),
        cvStorageId: v.optional(v.id("_storage")),
        coverLetterTemplate: v.optional(v.string()),
        availability: v.optional(v.string()),
        salaryExpectation: v.optional(v.string()),
        rightsToWork: v.optional(v.string()),
        customFields: v.optional(v.object({})),
    },
    handler: async (ctx, args) => {
        await requireAuth(ctx);
        const { id, ...fields } = args;
        // If setting as default, unset other defaults
        if (args.isDefault) {
            const existingDefaults = await ctx.db
                .query("application_templates")
                .withIndex("by_is_default", (q) => q.eq("isDefault", true))
                .collect();
            for (const template of existingDefaults) {
                if (template._id !== id) {
                    await ctx.db.patch(template._id, { isDefault: false });
                }
            }
        }
        const update = { updatedAt: Date.now() };
        for (const [k, val] of Object.entries(fields)) {
            if (val !== undefined)
                update[k] = val;
        }
        await ctx.db.patch(id, update);
    },
});
export const remove = mutation({
    args: { id: v.id("application_templates") },
    handler: async (ctx, args) => {
        await requireAuth(ctx);
        await ctx.db.delete(args.id);
    },
});
// Render cover letter with placeholders replaced
export const renderCoverLetter = query({
    args: {
        templateId: v.id("application_templates"),
        company: v.string(),
        position: v.string(),
        customVariables: v.optional(v.object({})),
    },
    handler: async (ctx, args) => {
        await requireAuth(ctx);
        const template = await ctx.db.get(args.templateId);
        if (!template || !template.coverLetterTemplate) {
            return null;
        }
        let rendered = template.coverLetterTemplate;
        // Replace standard placeholders
        rendered = rendered.replace(/{company}/gi, args.company);
        rendered = rendered.replace(/{position}/gi, args.position);
        rendered = rendered.replace(/{name}/gi, template.fullName);
        // Replace custom variables
        if (args.customVariables) {
            for (const [key, value] of Object.entries(args.customVariables)) {
                const regex = new RegExp(`{${key}}`, 'gi');
                rendered = rendered.replace(regex, String(value));
            }
        }
        return rendered;
    },
});
