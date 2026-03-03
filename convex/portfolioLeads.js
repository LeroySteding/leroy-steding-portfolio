import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
// Lead scoring configuration
const SCORING_CONFIG = {
    sourceScores: {
        booking: 25,
        contact_form: 20,
        chat: 15,
        newsletter: 10,
    },
    hasName: 5,
    hasCompany: 8,
    hasPhone: 7,
    hasMessage: 5,
    subscribedToNewsletter: 3,
    messageLength: {
        short: 2,
        medium: 5,
        long: 10,
    },
    mentionsProject: 8,
    mentionsBudget: 10,
    mentionsTimeline: 7,
    mentionsUrgent: 5,
    hasUtmSource: 3,
    linkedinReferrer: 5,
    directVisit: 2,
    returnVisitor: 10,
};
// Calculate lead score
function calculateLeadScore(lead) {
    let score = 0;
    // Source scoring
    if (lead.source) {
        score += SCORING_CONFIG.sourceScores[lead.source] || 0;
    }
    // Engagement indicators
    if (lead.name?.trim())
        score += SCORING_CONFIG.hasName;
    if (lead.company?.trim())
        score += SCORING_CONFIG.hasCompany;
    if (lead.phone?.trim())
        score += SCORING_CONFIG.hasPhone;
    if (lead.message?.trim())
        score += SCORING_CONFIG.hasMessage;
    if (lead.subscribedToNewsletter)
        score += SCORING_CONFIG.subscribedToNewsletter;
    // Content quality
    if (lead.message) {
        const messageLength = lead.message.length;
        if (messageLength > 200) {
            score += SCORING_CONFIG.messageLength.long;
        }
        else if (messageLength > 50) {
            score += SCORING_CONFIG.messageLength.medium;
        }
        else {
            score += SCORING_CONFIG.messageLength.short;
        }
        const messageLower = lead.message.toLowerCase();
        if (/\b(project|website|app|platform|build|develop|create)\b/.test(messageLower)) {
            score += SCORING_CONFIG.mentionsProject;
        }
        if (/\b(budget|cost|price|rate|invest|spend)\b/.test(messageLower)) {
            score += SCORING_CONFIG.mentionsBudget;
        }
        if (/\b(deadline|timeline|when|asap|urgent|soon|month|week)\b/.test(messageLower)) {
            score += SCORING_CONFIG.mentionsTimeline;
        }
        if (/\b(urgent|asap|immediately|rush|critical)\b/.test(messageLower)) {
            score += SCORING_CONFIG.mentionsUrgent;
        }
    }
    // Subject analysis
    if (lead.subject) {
        const subjectLower = lead.subject.toLowerCase();
        if (/\b(project|hire|collaborate|opportunity)\b/.test(subjectLower)) {
            score += 5;
        }
    }
    // Context signals
    if (lead.utmSource)
        score += SCORING_CONFIG.hasUtmSource;
    if (lead.referrer?.includes("linkedin"))
        score += SCORING_CONFIG.linkedinReferrer;
    if (!lead.referrer)
        score += SCORING_CONFIG.directVisit;
    // Metadata-based scoring
    if (lead.metadata) {
        if (lead.metadata.previous_interactions?.length > 0) {
            score += SCORING_CONFIG.returnVisitor;
        }
        if (typeof lead.metadata.intent_score === "number") {
            score += Math.round((lead.metadata.intent_score / 100) * 15);
        }
        if (typeof lead.metadata.message_count === "number") {
            if (lead.metadata.message_count >= 5)
                score += 5;
            else if (lead.metadata.message_count >= 3)
                score += 3;
        }
    }
    return Math.min(score, 100);
}
// Get lead by email
export const getByEmail = query({
    args: { email: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("portfolio_leads")
            .withIndex("by_email", (q) => q.eq("email", args.email))
            .order("desc")
            .first();
    },
});
// Create new lead
export const create = mutation({
    args: {
        email: v.string(),
        name: v.optional(v.string()),
        company: v.optional(v.string()),
        phone: v.optional(v.string()),
        source: v.union(v.literal("contact_form"), v.literal("newsletter"), v.literal("booking"), v.literal("chat")),
        subject: v.optional(v.string()),
        message: v.optional(v.string()),
        subscribedToNewsletter: v.optional(v.boolean()),
        ipAddress: v.optional(v.string()),
        userAgent: v.optional(v.string()),
        referrer: v.optional(v.string()),
        utmSource: v.optional(v.string()),
        utmMedium: v.optional(v.string()),
        utmCampaign: v.optional(v.string()),
        locale: v.optional(v.string()),
        metadata: v.optional(v.any()),
    },
    handler: async (ctx, args) => {
        const leadScore = calculateLeadScore(args);
        const leadId = await ctx.db.insert("portfolio_leads", {
            ...args,
            leadScore,
            status: "new",
            createdAt: Date.now(),
            updatedAt: Date.now(),
        });
        return {
            id: leadId,
            score: leadScore,
            tier: leadScore >= 70 ? "hot" : leadScore >= 50 ? "warm" : leadScore >= 30 ? "cool" : "cold",
        };
    },
});
// Update lead by email
export const updateByEmail = mutation({
    args: {
        email: v.string(),
        name: v.optional(v.string()),
        subscribedToNewsletter: v.optional(v.boolean()),
        newsletterConfirmed: v.optional(v.boolean()),
        status: v.optional(v.union(v.literal("new"), v.literal("contacted"), v.literal("qualified"), v.literal("converted"), v.literal("archived"))),
        metadata: v.optional(v.any()),
    },
    handler: async (ctx, args) => {
        const { email, ...updates } = args;
        const existing = await ctx.db
            .query("portfolio_leads")
            .withIndex("by_email", (q) => q.eq("email", email))
            .first();
        if (!existing) {
            return { success: false, error: "Lead not found" };
        }
        await ctx.db.patch(existing._id, {
            ...updates,
            updatedAt: Date.now(),
        });
        return { success: true };
    },
});
// Upsert lead (create or update if exists)
export const upsert = mutation({
    args: {
        email: v.string(),
        name: v.optional(v.string()),
        company: v.optional(v.string()),
        phone: v.optional(v.string()),
        source: v.union(v.literal("contact_form"), v.literal("newsletter"), v.literal("booking"), v.literal("chat")),
        subject: v.optional(v.string()),
        message: v.optional(v.string()),
        subscribedToNewsletter: v.optional(v.boolean()),
        ipAddress: v.optional(v.string()),
        userAgent: v.optional(v.string()),
        referrer: v.optional(v.string()),
        utmSource: v.optional(v.string()),
        utmMedium: v.optional(v.string()),
        utmCampaign: v.optional(v.string()),
        locale: v.optional(v.string()),
        metadata: v.optional(v.any()),
    },
    handler: async (ctx, args) => {
        const existing = await ctx.db
            .query("portfolio_leads")
            .withIndex("by_email", (q) => q.eq("email", args.email))
            .first();
        if (existing) {
            // Merge metadata
            const mergedMetadata = {
                ...(existing.metadata || {}),
                ...(args.metadata || {}),
                previous_interactions: [
                    ...(existing.metadata?.previous_interactions || []),
                    {
                        source: args.source,
                        timestamp: Date.now(),
                        subject: args.subject,
                    },
                ],
            };
            const updates = {
                ...args,
                metadata: mergedMetadata,
                updatedAt: Date.now(),
            };
            if (args.subscribedToNewsletter) {
                updates.subscribedToNewsletter = true;
            }
            // Recalculate score
            const mergedLead = { ...existing, ...updates };
            updates.leadScore = calculateLeadScore(mergedLead);
            await ctx.db.patch(existing._id, updates);
            return {
                success: true,
                id: existing._id,
                isNew: false,
                score: updates.leadScore,
                tier: updates.leadScore >= 70 ? "hot" : updates.leadScore >= 50 ? "warm" : updates.leadScore >= 30 ? "cool" : "cold",
            };
        }
        // Create new
        const leadScore = calculateLeadScore(args);
        const leadId = await ctx.db.insert("portfolio_leads", {
            ...args,
            leadScore,
            status: "new",
            createdAt: Date.now(),
            updatedAt: Date.now(),
        });
        return {
            success: true,
            id: leadId,
            isNew: true,
            score: leadScore,
            tier: leadScore >= 70 ? "hot" : leadScore >= 50 ? "warm" : leadScore >= 30 ? "cool" : "cold",
        };
    },
});
// List leads (for admin dashboard)
export const list = query({
    args: {
        status: v.optional(v.string()),
        source: v.optional(v.string()),
        limit: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        if (args.status) {
            return await ctx.db
                .query("portfolio_leads")
                .withIndex("by_status", (q) => q.eq("status", args.status))
                .order("desc")
                .take(args.limit || 100);
        }
        if (args.source) {
            return await ctx.db
                .query("portfolio_leads")
                .withIndex("by_source", (q) => q.eq("source", args.source))
                .order("desc")
                .take(args.limit || 100);
        }
        // No filter - use created_at index
        return await ctx.db
            .query("portfolio_leads")
            .withIndex("by_created_at")
            .order("desc")
            .take(args.limit || 100);
    },
});
