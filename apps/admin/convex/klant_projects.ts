/**
 * Klantportaal - Projects, Files, Comments
 */

import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// ========== PROJECT QUERIES ==========

export const listProjects = query({
  args: {
    userId: v.id("zzp_users"),
    status: v.optional(v.union(
      v.literal("planning"),
      v.literal("in_progress"),
      v.literal("review"),
      v.literal("completed"),
      v.literal("on_hold")
    )),
  },
  handler: async (ctx, args) => {
    let query = ctx.db
      .query("klant_projects")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc");

    if (args.status) {
      query = query.filter((q) => q.eq(q.field("status"), args.status));
    }

    return await query.collect();
  },
});

export const getProject = query({
  args: { projectId: v.id("klant_projects") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.projectId);
  },
});

export const getProjectsByClient = query({
  args: { clientId: v.id("fact_clients") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("klant_projects")
      .withIndex("by_client", (q) => q.eq("clientId", args.clientId))
      .order("desc")
      .collect();
  },
});

export const getProjectWithDetails = query({
  args: { projectId: v.id("klant_projects") },
  handler: async (ctx, args) => {
    const project = await ctx.db.get(args.projectId);
    if (!project) return null;

    // Get client info
    const client = await ctx.db.get(project.clientId);

    // Get file count
    const files = await ctx.db
      .query("klant_project_files")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
      .collect();

    // Get comment count
    const comments = await ctx.db
      .query("klant_project_comments")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
      .collect();

    return {
      ...project,
      client,
      fileCount: files.length,
      commentCount: comments.length,
    };
  },
});

// ========== PROJECT MUTATIONS ==========

export const createProject = mutation({
  args: {
    userId: v.id("zzp_users"),
    clientId: v.id("fact_clients"),
    name: v.string(),
    description: v.optional(v.string()),
    startDate: v.optional(v.number()),
    deadline: v.optional(v.number()),
    color: v.optional(v.string()),
    priority: v.optional(v.union(
      v.literal("low"),
      v.literal("medium"),
      v.literal("high")
    )),
    milestones: v.optional(v.array(v.object({
      title: v.string(),
      description: v.optional(v.string()),
      dueDate: v.optional(v.number()),
      completed: v.boolean(),
    }))),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const projectId = await ctx.db.insert("klant_projects", {
      userId: args.userId,
      clientId: args.clientId,
      name: args.name,
      description: args.description,
      status: "planning",
      startDate: args.startDate,
      deadline: args.deadline,
      progress: 0,
      color: args.color || "#3b82f6",
      priority: args.priority,
      milestones: args.milestones || [],
      tags: args.tags,
      createdAt: now,
      updatedAt: now,
    });

    return projectId;
  },
});

export const updateProject = mutation({
  args: {
    projectId: v.id("klant_projects"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    status: v.optional(v.union(
      v.literal("planning"),
      v.literal("in_progress"),
      v.literal("review"),
      v.literal("completed"),
      v.literal("on_hold")
    )),
    priority: v.optional(v.union(
      v.literal("low"),
      v.literal("medium"),
      v.literal("high")
    )),
    startDate: v.optional(v.number()),
    deadline: v.optional(v.number()),
    progress: v.optional(v.number()),
    color: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const { projectId, ...updates } = args;
    
    const updateData: any = { ...updates, updatedAt: Date.now() };

    // Auto-set completedAt when status changes to completed
    if (updates.status === "completed") {
      updateData.completedAt = Date.now();
    }

    await ctx.db.patch(projectId, updateData);
    return projectId;
  },
});

export const updateMilestones = mutation({
  args: {
    projectId: v.id("klant_projects"),
    milestones: v.array(v.object({
      title: v.string(),
      description: v.optional(v.string()),
      dueDate: v.optional(v.number()),
      completed: v.boolean(),
      completedAt: v.optional(v.number()),
    })),
  },
  handler: async (ctx, args) => {
    // Calculate progress based on completed milestones
    const totalMilestones = args.milestones.length;
    const completedCount = args.milestones.filter(m => m.completed).length;
    const progress = totalMilestones > 0 
      ? Math.round((completedCount / totalMilestones) * 100)
      : 0;

    await ctx.db.patch(args.projectId, {
      milestones: args.milestones,
      progress,
      updatedAt: Date.now(),
    });

    return { progress };
  },
});

export const deleteProject = mutation({
  args: { projectId: v.id("klant_projects") },
  handler: async (ctx, args) => {
    // Note: In production, consider cascading deletes or soft deletes
    await ctx.db.delete(args.projectId);
  },
});

// ========== FILE QUERIES ==========

export const getProjectFiles = query({
  args: {
    projectId: v.id("klant_projects"),
    visibleToClientOnly: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db
      .query("klant_project_files")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
      .order("desc");

    if (args.visibleToClientOnly) {
      query = query.filter((q) => q.eq(q.field("visible_to_client"), true));
    }

    return await query.collect();
  },
});

// ========== FILE MUTATIONS ==========

export const uploadProjectFile = mutation({
  args: {
    projectId: v.id("klant_projects"),
    name: v.string(),
    url: v.string(),
    description: v.optional(v.string()),
    storageId: v.optional(v.id("_storage")),
    mimeType: v.optional(v.string()),
    fileSize: v.optional(v.number()),
    uploaded_by: v.union(v.literal("zzp"), v.literal("client")),
    uploaderId: v.optional(v.string()),
    visible_to_client: v.boolean(),
  },
  handler: async (ctx, args) => {
    const fileId = await ctx.db.insert("klant_project_files", {
      projectId: args.projectId,
      name: args.name,
      url: args.url,
      description: args.description,
      storageId: args.storageId,
      mimeType: args.mimeType,
      fileSize: args.fileSize,
      uploaded_by: args.uploaded_by,
      uploaderId: args.uploaderId,
      visible_to_client: args.visible_to_client,
      createdAt: Date.now(),
    });

    return fileId;
  },
});

export const toggleFileVisibility = mutation({
  args: {
    fileId: v.id("klant_project_files"),
    visible_to_client: v.boolean(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.fileId, {
      visible_to_client: args.visible_to_client,
    });
  },
});

export const deleteProjectFile = mutation({
  args: { fileId: v.id("klant_project_files") },
  handler: async (ctx, args) => {
    // TODO: Also delete from storage if storageId exists
    await ctx.db.delete(args.fileId);
  },
});

// ========== COMMENT QUERIES ==========

export const getProjectComments = query({
  args: { projectId: v.id("klant_projects") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("klant_project_comments")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
      .order("asc") // Oldest first for threading
      .collect();
  },
});

// ========== COMMENT MUTATIONS ==========

export const addComment = mutation({
  args: {
    projectId: v.id("klant_projects"),
    author: v.string(),
    authorType: v.union(v.literal("zzp"), v.literal("client")),
    text: v.string(),
    attachments: v.optional(v.array(v.object({
      name: v.string(),
      url: v.string(),
    }))),
    parentCommentId: v.optional(v.id("klant_project_comments")),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const commentId = await ctx.db.insert("klant_project_comments", {
      projectId: args.projectId,
      author: args.author,
      authorType: args.authorType,
      text: args.text,
      attachments: args.attachments,
      parentCommentId: args.parentCommentId,
      edited: false,
      createdAt: now,
      updatedAt: now,
    });

    return commentId;
  },
});

export const updateComment = mutation({
  args: {
    commentId: v.id("klant_project_comments"),
    text: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.commentId, {
      text: args.text,
      edited: true,
      updatedAt: Date.now(),
    });
  },
});

export const deleteComment = mutation({
  args: { commentId: v.id("klant_project_comments") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.commentId);
  },
});
