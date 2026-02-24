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
var status = v.union(v.literal("backlog"), v.literal("todo"), v.literal("in_progress"), v.literal("review"), v.literal("done"), v.literal("cancelled"));
var priority = v.union(v.literal("low"), v.literal("medium"), v.literal("high"), v.literal("critical"));
var category = v.union(v.literal("development"), v.literal("devops"), v.literal("content"), v.literal("seo"), v.literal("design"), v.literal("marketing"), v.literal("job_hunting"), v.literal("other"));
export var list = query({
    args: {
        status: v.optional(status),
        priority: v.optional(priority),
        category: v.optional(category),
        assignee: v.optional(v.string()),
    },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        var items;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ctx.db.query("tasks").order("desc").collect()];
                case 1:
                    items = _a.sent();
                    if (args.status)
                        items = items.filter(function (i) { return i.status === args.status; });
                    if (args.priority)
                        items = items.filter(function (i) { return i.priority === args.priority; });
                    if (args.category)
                        items = items.filter(function (i) { return i.category === args.category; });
                    if (args.assignee)
                        items = items.filter(function (i) { return i.assignee === args.assignee; });
                    return [2 /*return*/, items];
            }
        });
    }); },
});
export var get = query({
    args: { id: v.id("tasks") },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/, ctx.db.get(args.id)];
    }); }); },
});
export var countByStatus = query({
    args: {},
    handler: function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
        var all, counts, _i, all_1, t;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, ctx.db.query("tasks").collect()];
                case 1:
                    all = _b.sent();
                    counts = {};
                    for (_i = 0, all_1 = all; _i < all_1.length; _i++) {
                        t = all_1[_i];
                        counts[t.status] = ((_a = counts[t.status]) !== null && _a !== void 0 ? _a : 0) + 1;
                    }
                    return [2 /*return*/, counts];
            }
        });
    }); },
});
// Public push mutation for agents (no auth required)
export var push = mutation({
    args: {
        title: v.string(),
        description: v.optional(v.string()),
        status: v.optional(status),
        priority: v.optional(priority),
        category: v.optional(category),
        assignee: v.optional(v.string()),
        dueDate: v.optional(v.number()),
        tags: v.optional(v.array(v.string())),
        relatedUrl: v.optional(v.string()),
    },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        var existing;
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        return __generator(this, function (_o) {
            switch (_o.label) {
                case 0: return [4 /*yield*/, ctx.db.query("tasks")
                        .withIndex("by_title", function (q) { return q.eq("title", args.title); })
                        .first()];
                case 1:
                    existing = _o.sent();
                    if (!existing) return [3 /*break*/, 3];
                    return [4 /*yield*/, ctx.db.patch(existing._id, {
                            description: (_a = args.description) !== null && _a !== void 0 ? _a : existing.description,
                            status: (_b = args.status) !== null && _b !== void 0 ? _b : existing.status,
                            priority: (_c = args.priority) !== null && _c !== void 0 ? _c : existing.priority,
                            category: (_d = args.category) !== null && _d !== void 0 ? _d : existing.category,
                            assignee: (_e = args.assignee) !== null && _e !== void 0 ? _e : existing.assignee,
                            dueDate: (_f = args.dueDate) !== null && _f !== void 0 ? _f : existing.dueDate,
                            tags: (_g = args.tags) !== null && _g !== void 0 ? _g : existing.tags,
                            relatedUrl: (_h = args.relatedUrl) !== null && _h !== void 0 ? _h : existing.relatedUrl,
                        })];
                case 2:
                    _o.sent();
                    return [2 /*return*/, existing._id];
                case 3: return [4 /*yield*/, ctx.db.insert("tasks", {
                        title: args.title,
                        description: args.description,
                        status: (_j = args.status) !== null && _j !== void 0 ? _j : "backlog",
                        priority: (_k = args.priority) !== null && _k !== void 0 ? _k : "medium",
                        category: (_l = args.category) !== null && _l !== void 0 ? _l : "development",
                        assignee: args.assignee,
                        dueDate: args.dueDate,
                        tags: (_m = args.tags) !== null && _m !== void 0 ? _m : [],
                        relatedUrl: args.relatedUrl,
                        completedAt: undefined,
                        createdAt: Date.now(),
                    })];
                case 4: return [2 /*return*/, _o.sent()];
            }
        });
    }); },
});
export var create = mutation({
    args: {
        title: v.string(),
        description: v.optional(v.string()),
        status: v.optional(status),
        priority: v.optional(priority),
        category: v.optional(category),
        assignee: v.optional(v.string()),
        dueDate: v.optional(v.number()),
        tags: v.optional(v.array(v.string())),
        relatedUrl: v.optional(v.string()),
    },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, requireAuth(ctx)];
                case 1:
                    _e.sent();
                    return [4 /*yield*/, ctx.db.insert("tasks", {
                            title: args.title,
                            description: args.description,
                            status: (_a = args.status) !== null && _a !== void 0 ? _a : "backlog",
                            priority: (_b = args.priority) !== null && _b !== void 0 ? _b : "medium",
                            category: (_c = args.category) !== null && _c !== void 0 ? _c : "development",
                            assignee: args.assignee,
                            dueDate: args.dueDate,
                            tags: (_d = args.tags) !== null && _d !== void 0 ? _d : [],
                            relatedUrl: args.relatedUrl,
                            createdAt: Date.now(),
                        })];
                case 2: return [2 /*return*/, _e.sent()];
            }
        });
    }); },
});
export var update = mutation({
    args: {
        id: v.id("tasks"),
        title: v.optional(v.string()),
        description: v.optional(v.string()),
        status: v.optional(status),
        priority: v.optional(priority),
        category: v.optional(category),
        assignee: v.optional(v.string()),
        dueDate: v.optional(v.number()),
        completedAt: v.optional(v.number()),
        tags: v.optional(v.array(v.string())),
        relatedUrl: v.optional(v.string()),
    },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        var id, fields, update, _i, _a, _b, k, val;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, requireAuth(ctx)];
                case 1:
                    _c.sent();
                    id = args.id, fields = __rest(args, ["id"]);
                    update = {};
                    for (_i = 0, _a = Object.entries(fields); _i < _a.length; _i++) {
                        _b = _a[_i], k = _b[0], val = _b[1];
                        if (val !== undefined)
                            update[k] = val;
                    }
                    if (args.status === "done" && !args.completedAt)
                        update.completedAt = Date.now();
                    return [4 /*yield*/, ctx.db.patch(id, update)];
                case 2:
                    _c.sent();
                    return [2 /*return*/];
            }
        });
    }); },
});
export var remove = mutation({
    args: { id: v.id("tasks") },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, requireAuth(ctx)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, ctx.db.delete(args.id)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); },
});
