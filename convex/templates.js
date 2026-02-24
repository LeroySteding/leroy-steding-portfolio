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
import { query, mutation } from "./_generated/server";
// List all published templates
export var list = query({
    args: {
        category: v.optional(v.string()),
        sortBy: v.optional(v.union(v.literal("newest"), v.literal("popular"), v.literal("price-low"), v.literal("price-high"))),
    },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        var query, templates;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    query = ctx.db
                        .query("templates")
                        .filter(function (q) { return q.eq(q.field("published"), true); });
                    if (args.category && args.category !== "all") {
                        query = query.filter(function (q) { return q.eq(q.field("category"), args.category); });
                    }
                    return [4 /*yield*/, query.collect()];
                case 1:
                    templates = _a.sent();
                    // Sort
                    switch (args.sortBy) {
                        case "popular":
                            templates.sort(function (a, b) { return b.salesCount - a.salesCount; });
                            break;
                        case "price-low":
                            templates.sort(function (a, b) { return a.price - b.price; });
                            break;
                        case "price-high":
                            templates.sort(function (a, b) { return b.price - a.price; });
                            break;
                        case "newest":
                        default:
                            templates.sort(function (a, b) { return b.createdAt - a.createdAt; });
                            break;
                    }
                    return [2 /*return*/, templates];
            }
        });
    }); },
});
// Get single template by slug
export var getBySlug = query({
    args: { slug: v.string() },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ctx.db
                        .query("templates")
                        .withIndex("by_slug", function (q) { return q.eq("slug", args.slug); })
                        .first()];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    }); },
});
// Get template by ID
export var get = query({
    args: { id: v.id("templates") },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ctx.db.get(args.id)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    }); },
});
// Create template (admin only)
export var create = mutation({
    args: {
        name: v.string(),
        slug: v.string(),
        tagline: v.string(),
        description: v.string(),
        price: v.number(),
        category: v.string(),
        stack: v.array(v.string()),
        features: v.array(v.string()),
        image: v.string(),
        demoUrl: v.string(),
    },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ctx.db.insert("templates", __assign(__assign({}, args), { published: false, rating: 5.0, reviewCount: 0, salesCount: 0, createdAt: Date.now(), updatedAt: Date.now() }))];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    }); },
});
// Update template
export var update = mutation({
    args: {
        id: v.id("templates"),
        name: v.optional(v.string()),
        tagline: v.optional(v.string()),
        description: v.optional(v.string()),
        price: v.optional(v.number()),
        published: v.optional(v.boolean()),
        badge: v.optional(v.string()),
    },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        var id, updates;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    id = args.id, updates = __rest(args, ["id"]);
                    return [4 /*yield*/, ctx.db.patch(id, __assign(__assign({}, updates), { updatedAt: Date.now() }))];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    }); },
});
// Record purchase
export var recordPurchase = mutation({
    args: {
        templateId: v.id("templates"),
        buyerEmail: v.string(),
        buyerName: v.optional(v.string()),
        licenseType: v.union(v.literal("standard"), v.literal("pro"), v.literal("enterprise")),
        price: v.number(),
        stripeSessionId: v.string(),
    },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        var purchaseId, template;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ctx.db.insert("template_purchases", __assign(__assign({}, args), { purchasedAt: Date.now() }))];
                case 1:
                    purchaseId = _a.sent();
                    return [4 /*yield*/, ctx.db.get(args.templateId)];
                case 2:
                    template = _a.sent();
                    if (!template) return [3 /*break*/, 4];
                    return [4 /*yield*/, ctx.db.patch(args.templateId, {
                            salesCount: template.salesCount + 1,
                        })];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4: return [2 /*return*/, purchaseId];
            }
        });
    }); },
});
