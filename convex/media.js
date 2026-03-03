import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAuth } from "./_helpers";
// List all media files
export const list = query({
    args: {
        mimeType: v.optional(v.string()),
        limit: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        let media = await ctx.db.query("media").collect();
        if (args.mimeType) {
            media = media.filter((item) => item.mimeType.startsWith(args.mimeType));
        }
        const sorted = media.sort((a, b) => b._creationTime - a._creationTime);
        if (args.limit) {
            return sorted.slice(0, args.limit);
        }
        return sorted;
    },
});
// Get a single media item by ID
export const getById = query({
    args: { id: v.id("media") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.id);
    },
});
// Get media by storage ID
export const getByStorageId = query({
    args: { storageId: v.id("_storage") },
    handler: async (ctx, args) => {
        const media = await ctx.db
            .query("media")
            .filter((q) => q.eq(q.field("storageId"), args.storageId))
            .first();
        return media;
    },
});
// Generate upload URL for new media
export const generateUploadUrl = mutation({
    args: {},
    handler: async (ctx) => {
        await requireAuth(ctx);
        return await ctx.storage.generateUploadUrl();
    },
});
// Create a media record after upload
export const create = mutation({
    args: {
        storageId: v.id("_storage"),
        filename: v.string(),
        mimeType: v.string(),
        alt: v.optional(v.string()),
        caption: v.optional(v.string()),
        width: v.optional(v.number()),
        height: v.optional(v.number()),
        fileSize: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const userId = await requireAuth(ctx);
        const mediaId = await ctx.db.insert("media", {
            ...args,
            uploadedBy: userId,
        });
        return mediaId;
    },
});
// Update media metadata
export const update = mutation({
    args: {
        id: v.id("media"),
        alt: v.optional(v.string()),
        caption: v.optional(v.string()),
        filename: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        await requireAuth(ctx);
        const { id, ...updates } = args;
        const existingMedia = await ctx.db.get(id);
        if (!existingMedia) {
            throw new Error("Media not found");
        }
        await ctx.db.patch(id, updates);
        return id;
    },
});
// Delete media (removes both record and file)
export const remove = mutation({
    args: { id: v.id("media") },
    handler: async (ctx, args) => {
        await requireAuth(ctx);
        const media = await ctx.db.get(args.id);
        if (!media) {
            throw new Error("Media not found");
        }
        // Delete the file from storage
        await ctx.storage.delete(media.storageId);
        // Delete the database record
        await ctx.db.delete(args.id);
        return args.id;
    },
});
// Get URL for a media file
export const getUrl = query({
    args: { storageId: v.id("_storage") },
    handler: async (ctx, args) => {
        return await ctx.storage.getUrl(args.storageId);
    },
});
