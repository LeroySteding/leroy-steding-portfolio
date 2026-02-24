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
/**
 * Portfolio-specific public queries
 * These are read-only queries used by the portfolio frontend (SSR via ConvexHttpClient).
 * No authentication required.
 */
import { v } from "convex/values";
import { query } from "./_generated/server";
// ==================== SECTION QUERIES ====================
// Sections are stored in site_settings with keys like "section:hero", "section:about", etc.
export var getSection = query({
    args: {
        key: v.string(),
        locale: v.optional(v.union(v.literal("en"), v.literal("nl"))),
    },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        var settings, localized, fallback;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, ctx.db
                        .query("site_settings")
                        .withIndex("by_key", function (q) { return q.eq("key", args.key); })
                        .collect()];
                case 1:
                    settings = _c.sent();
                    if (args.locale) {
                        localized = settings.find(function (s) { return s.locale === args.locale; });
                        if (localized)
                            return [2 /*return*/, localized.value];
                    }
                    fallback = (_a = settings.find(function (s) { return s.locale === "en"; })) !== null && _a !== void 0 ? _a : settings[0];
                    return [2 /*return*/, (_b = fallback === null || fallback === void 0 ? void 0 : fallback.value) !== null && _b !== void 0 ? _b : null];
            }
        });
    }); },
});
// ==================== PUBLISHED CONTENT QUERIES ====================
export var getPublishedProjects = query({
    args: {
        locale: v.optional(v.union(v.literal("en"), v.literal("nl"))),
    },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        var projects;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ctx.db.query("projects").collect()];
                case 1:
                    projects = _a.sent();
                    // Only published projects
                    projects = projects.filter(function (p) { return p.published !== false; });
                    if (args.locale) {
                        projects = projects.filter(function (p) { return p.locale === args.locale; });
                    }
                    return [2 /*return*/, projects.sort(function (a, b) {
                            var _a, _b, _c, _d;
                            if (a.featured && b.featured) {
                                return ((_a = a.featuredOrder) !== null && _a !== void 0 ? _a : 999) - ((_b = b.featuredOrder) !== null && _b !== void 0 ? _b : 999);
                            }
                            if (a.featured)
                                return -1;
                            if (b.featured)
                                return 1;
                            return ((_c = b.year) !== null && _c !== void 0 ? _c : 0) - ((_d = a.year) !== null && _d !== void 0 ? _d : 0);
                        })];
            }
        });
    }); },
});
export var getFeaturedProjects = query({
    args: {
        locale: v.optional(v.union(v.literal("en"), v.literal("nl"))),
    },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        var projects;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ctx.db.query("projects").collect()];
                case 1:
                    projects = _a.sent();
                    projects = projects.filter(function (p) { return p.featured === true && p.published !== false; });
                    if (args.locale) {
                        projects = projects.filter(function (p) { return p.locale === args.locale; });
                    }
                    return [2 /*return*/, projects.sort(function (a, b) { var _a, _b; return ((_a = a.featuredOrder) !== null && _a !== void 0 ? _a : 999) - ((_b = b.featuredOrder) !== null && _b !== void 0 ? _b : 999); })];
            }
        });
    }); },
});
export var getProjectBySlug = query({
    args: {
        slug: v.string(),
        locale: v.optional(v.union(v.literal("en"), v.literal("nl"))),
    },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        var projects;
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, ctx.db
                        .query("projects")
                        .withIndex("by_slug", function (q) { return q.eq("slug", args.slug); })
                        .collect()];
                case 1:
                    projects = _e.sent();
                    if (args.locale) {
                        return [2 /*return*/, ((_c = (_b = (_a = projects.find(function (p) { return p.locale === args.locale; })) !== null && _a !== void 0 ? _a : projects.find(function (p) { return p.locale === "en"; })) !== null && _b !== void 0 ? _b : projects[0]) !== null && _c !== void 0 ? _c : null)];
                    }
                    return [2 /*return*/, (_d = projects[0]) !== null && _d !== void 0 ? _d : null];
            }
        });
    }); },
});
export var getPublishedExperiences = query({
    args: {
        locale: v.optional(v.union(v.literal("en"), v.literal("nl"))),
    },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        var experiences;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ctx.db.query("experiences").collect()];
                case 1:
                    experiences = _a.sent();
                    experiences = experiences.filter(function (e) { return e.published !== false; });
                    if (args.locale) {
                        experiences = experiences.filter(function (e) { return e.locale === args.locale; });
                    }
                    return [2 /*return*/, experiences.sort(function (a, b) {
                            if (a.order !== undefined && b.order !== undefined) {
                                return a.order - b.order;
                            }
                            return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
                        })];
            }
        });
    }); },
});
export var getExperienceBySlug = query({
    args: {
        slug: v.string(),
        locale: v.optional(v.union(v.literal("en"), v.literal("nl"))),
    },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        var experiences, matching;
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, ctx.db.query("experiences").collect()];
                case 1:
                    experiences = _e.sent();
                    matching = experiences.filter(function (e) {
                        var expSlug = "".concat(e.company, "-").concat(e.title)
                            .toLowerCase()
                            .replace(/[^a-z0-9]+/g, "-");
                        return expSlug === args.slug || e.title === args.slug;
                    });
                    if (args.locale) {
                        return [2 /*return*/, ((_c = (_b = (_a = matching.find(function (e) { return e.locale === args.locale; })) !== null && _a !== void 0 ? _a : matching.find(function (e) { return e.locale === "en"; })) !== null && _b !== void 0 ? _b : matching[0]) !== null && _c !== void 0 ? _c : null)];
                    }
                    return [2 /*return*/, (_d = matching[0]) !== null && _d !== void 0 ? _d : null];
            }
        });
    }); },
});
export var getPublishedPosts = query({
    args: {
        locale: v.optional(v.union(v.literal("en"), v.literal("nl"))),
    },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        var posts;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ctx.db.query("blog_posts").collect()];
                case 1:
                    posts = _a.sent();
                    posts = posts.filter(function (p) { return p.status === "published"; });
                    if (args.locale) {
                        posts = posts.filter(function (p) { return p.locale === args.locale; });
                    }
                    return [2 /*return*/, posts.sort(function (a, b) {
                            var _a, _b;
                            var aTime = (_a = a.publishedAt) !== null && _a !== void 0 ? _a : a._creationTime;
                            var bTime = (_b = b.publishedAt) !== null && _b !== void 0 ? _b : b._creationTime;
                            return bTime - aTime;
                        })];
            }
        });
    }); },
});
export var getFeaturedPosts = query({
    args: {
        locale: v.optional(v.union(v.literal("en"), v.literal("nl"))),
    },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        var posts;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ctx.db.query("blog_posts").collect()];
                case 1:
                    posts = _a.sent();
                    posts = posts.filter(function (p) { return p.featured === true && p.status === "published"; });
                    if (args.locale) {
                        posts = posts.filter(function (p) { return p.locale === args.locale; });
                    }
                    return [2 /*return*/, posts.sort(function (a, b) {
                            var _a, _b;
                            var aTime = (_a = a.publishedAt) !== null && _a !== void 0 ? _a : a._creationTime;
                            var bTime = (_b = b.publishedAt) !== null && _b !== void 0 ? _b : b._creationTime;
                            return bTime - aTime;
                        })];
            }
        });
    }); },
});
export var getPostBySlug = query({
    args: {
        slug: v.string(),
        locale: v.optional(v.union(v.literal("en"), v.literal("nl"))),
    },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        var posts;
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, ctx.db
                        .query("blog_posts")
                        .withIndex("by_slug", function (q) { return q.eq("slug", args.slug); })
                        .collect()];
                case 1:
                    posts = _e.sent();
                    if (args.locale) {
                        return [2 /*return*/, ((_c = (_b = (_a = posts.find(function (p) { return p.locale === args.locale; })) !== null && _a !== void 0 ? _a : posts.find(function (p) { return p.locale === "en"; })) !== null && _b !== void 0 ? _b : posts[0]) !== null && _c !== void 0 ? _c : null)];
                    }
                    return [2 /*return*/, (_d = posts[0]) !== null && _d !== void 0 ? _d : null];
            }
        });
    }); },
});
export var getPublishedSkills = query({
    args: {
        locale: v.optional(v.union(v.literal("en"), v.literal("nl"))),
        category: v.optional(v.string()),
    },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        var skills;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ctx.db.query("skills").collect()];
                case 1:
                    skills = _a.sent();
                    skills = skills.filter(function (s) { return s.published !== false; });
                    if (args.locale) {
                        skills = skills.filter(function (s) { return !s.locale || s.locale === args.locale; });
                    }
                    if (args.category) {
                        skills = skills.filter(function (s) { return s.category === args.category; });
                    }
                    return [2 /*return*/, skills.sort(function (a, b) {
                            if (a.order !== undefined && b.order !== undefined) {
                                return a.order - b.order;
                            }
                            return b.proficiency - a.proficiency;
                        })];
            }
        });
    }); },
});
