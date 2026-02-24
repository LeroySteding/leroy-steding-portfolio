var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
// Lead scoring configuration
var SCORING_CONFIG = {
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
    var _a, _b, _c, _d, _e, _f;
    var score = 0;
    // Source scoring
    if (lead.source) {
        score += SCORING_CONFIG.sourceScores[lead.source] || 0;
    }
    // Engagement indicators
    if ((_a = lead.name) === null || _a === void 0 ? void 0 : _a.trim())
        score += SCORING_CONFIG.hasName;
    if ((_b = lead.company) === null || _b === void 0 ? void 0 : _b.trim())
        score += SCORING_CONFIG.hasCompany;
    if ((_c = lead.phone) === null || _c === void 0 ? void 0 : _c.trim())
        score += SCORING_CONFIG.hasPhone;
    if ((_d = lead.message) === null || _d === void 0 ? void 0 : _d.trim())
        score += SCORING_CONFIG.hasMessage;
    if (lead.subscribedToNewsletter)
        score += SCORING_CONFIG.subscribedToNewsletter;
    // Content quality
    if (lead.message) {
        var messageLength = lead.message.length;
        if (messageLength > 200) {
            score += SCORING_CONFIG.messageLength.long;
        }
        else if (messageLength > 50) {
            score += SCORING_CONFIG.messageLength.medium;
        }
        else {
            score += SCORING_CONFIG.messageLength.short;
        }
        var messageLower = lead.message.toLowerCase();
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
        var subjectLower = lead.subject.toLowerCase();
        if (/\b(project|hire|collaborate|opportunity)\b/.test(subjectLower)) {
            score += 5;
        }
    }
    // Context signals
    if (lead.utmSource)
        score += SCORING_CONFIG.hasUtmSource;
    if ((_e = lead.referrer) === null || _e === void 0 ? void 0 : _e.includes("linkedin"))
        score += SCORING_CONFIG.linkedinReferrer;
    if (!lead.referrer)
        score += SCORING_CONFIG.directVisit;
    // Metadata-based scoring
    if (lead.metadata) {
        if (((_f = lead.metadata.previous_interactions) === null || _f === void 0 ? void 0 : _f.length) > 0) {
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
export var getByEmail = query({
    args: { email: v.string() },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ctx.db
                        .query("portfolio_leads")
                        .withIndex("by_email", function (q) { return q.eq("email", args.email); })
                        .order("desc")
                        .first()];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    }); },
});
// Create new lead
export var create = mutation({
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
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        var leadScore, leadId;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    leadScore = calculateLeadScore(args);
                    return [4 /*yield*/, ctx.db.insert("portfolio_leads", __assign(__assign({}, args), { leadScore: leadScore, status: "new", createdAt: Date.now(), updatedAt: Date.now() }))];
                case 1:
                    leadId = _a.sent();
                    return [2 /*return*/, {
                            id: leadId,
                            score: leadScore,
                            tier: leadScore >= 70 ? "hot" : leadScore >= 50 ? "warm" : leadScore >= 30 ? "cool" : "cold",
                        }];
            }
        });
    }); },
});
// Update lead by email
export var updateByEmail = mutation({
    args: {
        email: v.string(),
        name: v.optional(v.string()),
        subscribedToNewsletter: v.optional(v.boolean()),
        newsletterConfirmed: v.optional(v.boolean()),
        status: v.optional(v.union(v.literal("new"), v.literal("contacted"), v.literal("qualified"), v.literal("converted"), v.literal("archived"))),
        metadata: v.optional(v.any()),
    },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        var email, updates, existing;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    email = args.email, updates = __rest(args, ["email"]);
                    return [4 /*yield*/, ctx.db
                            .query("portfolio_leads")
                            .withIndex("by_email", function (q) { return q.eq("email", email); })
                            .first()];
                case 1:
                    existing = _a.sent();
                    if (!existing) {
                        return [2 /*return*/, { success: false, error: "Lead not found" }];
                    }
                    return [4 /*yield*/, ctx.db.patch(existing._id, __assign(__assign({}, updates), { updatedAt: Date.now() }))];
                case 2:
                    _a.sent();
                    return [2 /*return*/, { success: true }];
            }
        });
    }); },
});
// Upsert lead (create or update if exists)
export var upsert = mutation({
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
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        var existing, mergedMetadata, updates, mergedLead, leadScore, leadId;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, ctx.db
                        .query("portfolio_leads")
                        .withIndex("by_email", function (q) { return q.eq("email", args.email); })
                        .first()];
                case 1:
                    existing = _b.sent();
                    if (!existing) return [3 /*break*/, 3];
                    mergedMetadata = __assign(__assign(__assign({}, (existing.metadata || {})), (args.metadata || {})), { previous_interactions: __spreadArray(__spreadArray([], (((_a = existing.metadata) === null || _a === void 0 ? void 0 : _a.previous_interactions) || []), true), [
                            {
                                source: args.source,
                                timestamp: Date.now(),
                                subject: args.subject,
                            },
                        ], false) });
                    updates = __assign(__assign({}, args), { metadata: mergedMetadata, updatedAt: Date.now() });
                    if (args.subscribedToNewsletter) {
                        updates.subscribedToNewsletter = true;
                    }
                    mergedLead = __assign(__assign({}, existing), updates);
                    updates.leadScore = calculateLeadScore(mergedLead);
                    return [4 /*yield*/, ctx.db.patch(existing._id, updates)];
                case 2:
                    _b.sent();
                    return [2 /*return*/, {
                            success: true,
                            id: existing._id,
                            isNew: false,
                            score: updates.leadScore,
                            tier: updates.leadScore >= 70 ? "hot" : updates.leadScore >= 50 ? "warm" : updates.leadScore >= 30 ? "cool" : "cold",
                        }];
                case 3:
                    leadScore = calculateLeadScore(args);
                    return [4 /*yield*/, ctx.db.insert("portfolio_leads", __assign(__assign({}, args), { leadScore: leadScore, status: "new", createdAt: Date.now(), updatedAt: Date.now() }))];
                case 4:
                    leadId = _b.sent();
                    return [2 /*return*/, {
                            success: true,
                            id: leadId,
                            isNew: true,
                            score: leadScore,
                            tier: leadScore >= 70 ? "hot" : leadScore >= 50 ? "warm" : leadScore >= 30 ? "cool" : "cold",
                        }];
            }
        });
    }); },
});
// List leads (for admin dashboard)
export var list = query({
    args: {
        status: v.optional(v.string()),
        source: v.optional(v.string()),
        limit: v.optional(v.number()),
    },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!args.status) return [3 /*break*/, 2];
                    return [4 /*yield*/, ctx.db
                            .query("portfolio_leads")
                            .withIndex("by_status", function (q) { return q.eq("status", args.status); })
                            .order("desc")
                            .take(args.limit || 100)];
                case 1: return [2 /*return*/, _a.sent()];
                case 2:
                    if (!args.source) return [3 /*break*/, 4];
                    return [4 /*yield*/, ctx.db
                            .query("portfolio_leads")
                            .withIndex("by_source", function (q) { return q.eq("source", args.source); })
                            .order("desc")
                            .take(args.limit || 100)];
                case 3: return [2 /*return*/, _a.sent()];
                case 4: return [4 /*yield*/, ctx.db
                        .query("portfolio_leads")
                        .withIndex("by_created_at")
                        .order("desc")
                        .take(args.limit || 100)];
                case 5: 
                // No filter - use created_at index
                return [2 /*return*/, _a.sent()];
            }
        });
    }); },
});
