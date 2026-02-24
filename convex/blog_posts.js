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
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAuth } from "./_helpers";
// List all blog posts with optional locale filter
export var list = query({
    args: {
        locale: v.optional(v.union(v.literal("en"), v.literal("nl"))),
        status: v.optional(v.union(v.literal("draft"), v.literal("published"))),
    },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        var posts;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ctx.db.query("blog_posts").collect()];
                case 1:
                    posts = _a.sent();
                    if (args.locale) {
                        posts = posts.filter(function (post) { return post.locale === args.locale; });
                    }
                    if (args.status) {
                        posts = posts.filter(function (post) { return post.status === args.status; });
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
// Get a single blog post by ID
export var get = query({
    args: { id: v.id("blog_posts") },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ctx.db.get(args.id)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    }); },
});
export var getById = get;
// Get a single blog post by slug
export var getBySlug = query({
    args: {
        slug: v.string(),
        locale: v.optional(v.union(v.literal("en"), v.literal("nl"))),
    },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        var posts;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ctx.db
                        .query("blog_posts")
                        .withIndex("by_slug", function (q) { return q.eq("slug", args.slug); })
                        .collect()];
                case 1:
                    posts = _a.sent();
                    if (args.locale) {
                        return [2 /*return*/, posts.find(function (post) { return post.locale === args.locale; })];
                    }
                    return [2 /*return*/, posts[0]];
            }
        });
    }); },
});
// Public push mutation for agents (no auth required)
export var push = mutation({
    args: {
        title: v.string(), slug: v.string(), content: v.any(),
        excerpt: v.optional(v.string()), coverImage: v.optional(v.string()),
        locale: v.union(v.literal("en"), v.literal("nl")),
        status: v.union(v.literal("draft"), v.literal("published")),
        tags: v.optional(v.array(v.string())), seoTitle: v.optional(v.string()),
        seoDescription: v.optional(v.string()), featured: v.optional(v.boolean()),
        author: v.optional(v.string()), authorName: v.optional(v.string()),
        readingTime: v.optional(v.number()), publishedAt: v.optional(v.number()),
    },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        var existing, slug, updates;
        var _a, _b, _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0: return [4 /*yield*/, ctx.db.query("blog_posts")
                        .withIndex("by_slug", function (q) { return q.eq("slug", args.slug); })
                        .first()];
                case 1:
                    existing = _f.sent();
                    if (!existing) return [3 /*break*/, 3];
                    slug = args.slug, updates = __rest(args, ["slug"]);
                    return [4 /*yield*/, ctx.db.patch(existing._id, __assign(__assign({}, updates), { author: (_a = args.author) !== null && _a !== void 0 ? _a : existing.author, authorName: (_b = args.authorName) !== null && _b !== void 0 ? _b : existing.authorName }))];
                case 2:
                    _f.sent();
                    return [2 /*return*/, existing._id];
                case 3: return [4 /*yield*/, ctx.db.insert("blog_posts", __assign(__assign({}, args), { author: (_c = args.author) !== null && _c !== void 0 ? _c : "agent", authorName: (_d = args.authorName) !== null && _d !== void 0 ? _d : "AI Agent", publishedAt: args.status === "published" ? ((_e = args.publishedAt) !== null && _e !== void 0 ? _e : Date.now()) : undefined }))];
                case 4: return [2 /*return*/, _f.sent()];
            }
        });
    }); },
});
// Create a new blog post
export var create = mutation({
    args: {
        title: v.string(),
        slug: v.string(),
        content: v.any(),
        excerpt: v.optional(v.string()),
        coverImage: v.optional(v.string()),
        locale: v.union(v.literal("en"), v.literal("nl")),
        status: v.union(v.literal("draft"), v.literal("published")),
        tags: v.optional(v.array(v.string())),
        seoTitle: v.optional(v.string()),
        seoDescription: v.optional(v.string()),
        featured: v.optional(v.boolean()),
    },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        var userId, identity, postId;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, requireAuth(ctx)];
                case 1:
                    userId = _a.sent();
                    return [4 /*yield*/, ctx.auth.getUserIdentity()];
                case 2:
                    identity = _a.sent();
                    return [4 /*yield*/, ctx.db.insert("blog_posts", __assign(__assign({}, args), { author: userId, authorName: identity === null || identity === void 0 ? void 0 : identity.name, authorAvatar: identity === null || identity === void 0 ? void 0 : identity.pictureUrl, publishedAt: args.status === "published" ? Date.now() : undefined }))];
                case 3:
                    postId = _a.sent();
                    return [2 /*return*/, postId];
            }
        });
    }); },
});
// Update a blog post
export var update = mutation({
    args: {
        id: v.id("blog_posts"),
        title: v.optional(v.string()),
        slug: v.optional(v.string()),
        content: v.optional(v.any()),
        excerpt: v.optional(v.string()),
        coverImage: v.optional(v.string()),
        locale: v.optional(v.union(v.literal("en"), v.literal("nl"))),
        status: v.optional(v.union(v.literal("draft"), v.literal("published"))),
        tags: v.optional(v.array(v.string())),
        seoTitle: v.optional(v.string()),
        seoDescription: v.optional(v.string()),
        featured: v.optional(v.boolean()),
    },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        var id, updates, existingPost, publishedAt;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, requireAuth(ctx)];
                case 1:
                    _a.sent();
                    id = args.id, updates = __rest(args, ["id"]);
                    return [4 /*yield*/, ctx.db.get(id)];
                case 2:
                    existingPost = _a.sent();
                    if (!existingPost) {
                        throw new Error("Blog post not found");
                    }
                    publishedAt = updates.status === "published" && !existingPost.publishedAt
                        ? Date.now()
                        : existingPost.publishedAt;
                    return [4 /*yield*/, ctx.db.patch(id, __assign(__assign({}, updates), { publishedAt: publishedAt }))];
                case 3:
                    _a.sent();
                    return [2 /*return*/, id];
            }
        });
    }); },
});
// Delete a blog post
export var remove = mutation({
    args: { id: v.id("blog_posts") },
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
