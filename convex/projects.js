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
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAuth } from "./_helpers";
// List all projects with optional locale filter
export var list = query({
    args: {
        locale: v.optional(v.union(v.literal("en"), v.literal("nl"))),
        published: v.optional(v.boolean()),
    },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        var projects;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ctx.db.query("projects").collect()];
                case 1:
                    projects = _a.sent();
                    if (args.locale) {
                        projects = projects.filter(function (project) { return project.locale === args.locale; });
                    }
                    if (args.published !== undefined) {
                        projects = projects.filter(function (project) { return project.published === args.published; });
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
// Get a single project by ID
export var getById = query({
    args: { id: v.id("projects") },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ctx.db.get(args.id)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    }); },
});
// Get a single project by slug
export var getBySlug = query({
    args: {
        slug: v.string(),
        locale: v.optional(v.union(v.literal("en"), v.literal("nl"))),
    },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        var projects;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ctx.db
                        .query("projects")
                        .withIndex("by_slug", function (q) { return q.eq("slug", args.slug); })
                        .collect()];
                case 1:
                    projects = _a.sent();
                    if (args.locale) {
                        return [2 /*return*/, projects.find(function (project) { return project.locale === args.locale; })];
                    }
                    return [2 /*return*/, projects[0]];
            }
        });
    }); },
});
// Public push mutation for agents (no auth required)
export var push = mutation({
    args: {
        title: v.string(), slug: v.string(), description: v.string(), content: v.any(),
        coverImage: v.optional(v.string()), galleryImages: v.optional(v.array(v.string())),
        technologies: v.array(v.string()), liveUrl: v.optional(v.string()),
        githubUrl: v.optional(v.string()), caseStudyUrl: v.optional(v.string()),
        locale: v.union(v.literal("en"), v.literal("nl")),
        featured: v.optional(v.boolean()), featuredOrder: v.optional(v.number()),
        year: v.optional(v.number()), duration: v.optional(v.string()),
        role: v.optional(v.string()), client: v.optional(v.string()),
        order: v.optional(v.number()), published: v.optional(v.boolean()),
        seoTitle: v.optional(v.string()), seoDescription: v.optional(v.string()),
    },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        var existing;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ctx.db.query("projects")
                        .withIndex("by_slug", function (q) { return q.eq("slug", args.slug); })
                        .first()];
                case 1:
                    existing = _a.sent();
                    if (!existing) return [3 /*break*/, 3];
                    return [4 /*yield*/, ctx.db.patch(existing._id, args)];
                case 2:
                    _a.sent();
                    return [2 /*return*/, existing._id];
                case 3: return [4 /*yield*/, ctx.db.insert("projects", args)];
                case 4: return [2 /*return*/, _a.sent()];
            }
        });
    }); },
});
// Create a new project
export var create = mutation({
    args: {
        title: v.string(),
        slug: v.string(),
        description: v.string(),
        content: v.any(),
        coverImage: v.optional(v.string()),
        galleryImages: v.optional(v.array(v.string())),
        technologies: v.array(v.string()),
        liveUrl: v.optional(v.string()),
        githubUrl: v.optional(v.string()),
        caseStudyUrl: v.optional(v.string()),
        locale: v.union(v.literal("en"), v.literal("nl")),
        featured: v.optional(v.boolean()),
        featuredOrder: v.optional(v.number()),
        year: v.optional(v.number()),
        duration: v.optional(v.string()),
        role: v.optional(v.string()),
        client: v.optional(v.string()),
        order: v.optional(v.number()),
        published: v.optional(v.boolean()),
        seoTitle: v.optional(v.string()),
        seoDescription: v.optional(v.string()),
    },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        var projectId;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, requireAuth(ctx)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, ctx.db.insert("projects", args)];
                case 2:
                    projectId = _a.sent();
                    return [2 /*return*/, projectId];
            }
        });
    }); },
});
// Update a project
export var update = mutation({
    args: {
        id: v.id("projects"),
        title: v.optional(v.string()),
        slug: v.optional(v.string()),
        description: v.optional(v.string()),
        content: v.optional(v.any()),
        coverImage: v.optional(v.string()),
        galleryImages: v.optional(v.array(v.string())),
        technologies: v.optional(v.array(v.string())),
        liveUrl: v.optional(v.string()),
        githubUrl: v.optional(v.string()),
        caseStudyUrl: v.optional(v.string()),
        locale: v.optional(v.union(v.literal("en"), v.literal("nl"))),
        featured: v.optional(v.boolean()),
        featuredOrder: v.optional(v.number()),
        year: v.optional(v.number()),
        duration: v.optional(v.string()),
        role: v.optional(v.string()),
        client: v.optional(v.string()),
        order: v.optional(v.number()),
        published: v.optional(v.boolean()),
        seoTitle: v.optional(v.string()),
        seoDescription: v.optional(v.string()),
    },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        var id, updates, existingProject;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, requireAuth(ctx)];
                case 1:
                    _a.sent();
                    id = args.id, updates = __rest(args, ["id"]);
                    return [4 /*yield*/, ctx.db.get(id)];
                case 2:
                    existingProject = _a.sent();
                    if (!existingProject) {
                        throw new Error("Project not found");
                    }
                    return [4 /*yield*/, ctx.db.patch(id, updates)];
                case 3:
                    _a.sent();
                    return [2 /*return*/, id];
            }
        });
    }); },
});
// Delete a project
export var remove = mutation({
    args: { id: v.id("projects") },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, requireAuth(ctx)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, ctx.db.delete(args.id)];
                case 2:
                    _a.sent();
                    return [2 /*return*/, args.id];
            }
        });
    }); },
});
export var get = getById;
