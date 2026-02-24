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
var ghType = v.union(v.literal("pr"), v.literal("issue"), v.literal("review"), v.literal("merge"), v.literal("release"));
export var list = query({
    args: { repo: v.optional(v.string()), type: v.optional(ghType), limit: v.optional(v.number()) },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        var items;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, ctx.db.query("github_activity").order("desc").collect()];
                case 1:
                    items = _b.sent();
                    if (args.repo)
                        items = items.filter(function (i) { return i.repo === args.repo; });
                    if (args.type)
                        items = items.filter(function (i) { return i.type === args.type; });
                    return [2 /*return*/, items.slice(0, (_a = args.limit) !== null && _a !== void 0 ? _a : 50)];
            }
        });
    }); },
});
export var get = query({
    args: { id: v.id("github_activity") },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/, ctx.db.get(args.id)];
    }); }); },
});
// Public push mutation for agents (no auth required)
export var push = mutation({
    args: {
        repo: v.string(), type: ghType, number: v.number(), title: v.string(),
        status: v.string(), url: v.string(), author: v.optional(v.string()),
        labels: v.optional(v.array(v.string())),
    },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        var existing;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ctx.db.query("github_activity")
                        .withIndex("by_url", function (q) { return q.eq("url", args.url); })
                        .first()];
                case 1:
                    existing = _a.sent();
                    if (!existing) return [3 /*break*/, 3];
                    return [4 /*yield*/, ctx.db.patch(existing._id, { title: args.title, status: args.status, author: args.author, labels: args.labels, updatedAt: Date.now() })];
                case 2:
                    _a.sent();
                    return [2 /*return*/, existing._id];
                case 3: return [4 /*yield*/, ctx.db.insert("github_activity", __assign(__assign({}, args), { createdAt: Date.now() }))];
                case 4: return [2 /*return*/, _a.sent()];
            }
        });
    }); },
});
export var create = mutation({
    args: {
        repo: v.string(), type: ghType, number: v.number(), title: v.string(),
        status: v.string(), url: v.string(), author: v.optional(v.string()),
        labels: v.optional(v.array(v.string())),
    },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        var existing, match;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ctx.db.query("github_activity")
                        .withIndex("by_repo", function (q) { return q.eq("repo", args.repo); })
                        .collect()];
                case 1:
                    existing = _a.sent();
                    match = existing.find(function (i) { return i.type === args.type && i.number === args.number; });
                    if (!match) return [3 /*break*/, 3];
                    return [4 /*yield*/, ctx.db.patch(match._id, { title: args.title, status: args.status, url: args.url, author: args.author, labels: args.labels, updatedAt: Date.now() })];
                case 2:
                    _a.sent();
                    return [2 /*return*/, match._id];
                case 3: return [4 /*yield*/, ctx.db.insert("github_activity", __assign(__assign({}, args), { createdAt: Date.now() }))];
                case 4: return [2 /*return*/, _a.sent()];
            }
        });
    }); },
});
export var update = mutation({
    args: {
        id: v.id("github_activity"), status: v.optional(v.string()), title: v.optional(v.string()),
        labels: v.optional(v.array(v.string())),
    },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        var id, fields, update, _i, _a, _b, k, val;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    id = args.id, fields = __rest(args, ["id"]);
                    update = { updatedAt: Date.now() };
                    for (_i = 0, _a = Object.entries(fields); _i < _a.length; _i++) {
                        _b = _a[_i], k = _b[0], val = _b[1];
                        if (val !== undefined)
                            update[k] = val;
                    }
                    return [4 /*yield*/, ctx.db.patch(id, update)];
                case 1:
                    _c.sent();
                    return [2 /*return*/];
            }
        });
    }); },
});
export var remove = mutation({
    args: { id: v.id("github_activity") },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, ctx.db.delete(args.id)];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    }); }); },
});
