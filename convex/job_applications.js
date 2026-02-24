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
var status = v.union(v.literal("discovered"), v.literal("researching"), v.literal("applying"), v.literal("applied"), v.literal("interviewing"), v.literal("offer"), v.literal("rejected"), v.literal("withdrawn"));
export var list = query({
    args: { status: v.optional(status) },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        var items;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ctx.db.query("job_applications").order("desc").collect()];
                case 1:
                    items = _a.sent();
                    if (args.status)
                        items = items.filter(function (i) { return i.status === args.status; });
                    return [2 /*return*/, items];
            }
        });
    }); },
});
export var get = query({
    args: { id: v.id("job_applications") },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/, ctx.db.get(args.id)];
    }); }); },
});
export var activeCount = query({
    args: {},
    handler: function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
        var all;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ctx.db.query("job_applications").collect()];
                case 1:
                    all = _a.sent();
                    return [2 /*return*/, all.filter(function (j) { return !["rejected", "withdrawn"].includes(j.status); }).length];
            }
        });
    }); },
});
// Public push mutation for agents (no auth required)
export var push = mutation({
    args: {
        company: v.string(), position: v.string(), url: v.optional(v.string()),
        status: v.optional(status), salary: v.optional(v.string()), location: v.optional(v.string()),
        remote: v.optional(v.boolean()), notes: v.optional(v.string()),
        contacts: v.optional(v.array(v.object({ name: v.string(), role: v.optional(v.string()), linkedin: v.optional(v.string()) }))),
        tags: v.optional(v.array(v.string())), nextAction: v.optional(v.string()), nextActionDate: v.optional(v.number()),
    },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        var existing;
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, ctx.db.query("job_applications")
                        .withIndex("by_company_position", function (q) { return q.eq("company", args.company).eq("position", args.position); })
                        .first()];
                case 1:
                    existing = _e.sent();
                    if (!existing) return [3 /*break*/, 3];
                    return [4 /*yield*/, ctx.db.patch(existing._id, __assign(__assign({}, args), { status: (_a = args.status) !== null && _a !== void 0 ? _a : existing.status, tags: (_b = args.tags) !== null && _b !== void 0 ? _b : existing.tags }))];
                case 2:
                    _e.sent();
                    return [2 /*return*/, existing._id];
                case 3: return [4 /*yield*/, ctx.db.insert("job_applications", __assign(__assign({}, args), { status: (_c = args.status) !== null && _c !== void 0 ? _c : "discovered", tags: (_d = args.tags) !== null && _d !== void 0 ? _d : [], createdAt: Date.now() }))];
                case 4: return [2 /*return*/, _e.sent()];
            }
        });
    }); },
});
export var create = mutation({
    args: {
        company: v.string(),
        position: v.string(),
        url: v.optional(v.string()),
        status: v.optional(status),
        salary: v.optional(v.string()),
        location: v.optional(v.string()),
        remote: v.optional(v.boolean()),
        notes: v.optional(v.string()),
        contacts: v.optional(v.array(v.object({ name: v.string(), role: v.optional(v.string()), linkedin: v.optional(v.string()) }))),
        tags: v.optional(v.array(v.string())),
        nextAction: v.optional(v.string()),
        nextActionDate: v.optional(v.number()),
    },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, requireAuth(ctx)];
                case 1:
                    _c.sent();
                    return [4 /*yield*/, ctx.db.insert("job_applications", __assign(__assign({}, args), { status: (_a = args.status) !== null && _a !== void 0 ? _a : "discovered", tags: (_b = args.tags) !== null && _b !== void 0 ? _b : [], createdAt: Date.now() }))];
                case 2: return [2 /*return*/, _c.sent()];
            }
        });
    }); },
});
export var update = mutation({
    args: {
        id: v.id("job_applications"),
        company: v.optional(v.string()),
        position: v.optional(v.string()),
        url: v.optional(v.string()),
        status: v.optional(status),
        salary: v.optional(v.string()),
        location: v.optional(v.string()),
        remote: v.optional(v.boolean()),
        notes: v.optional(v.string()),
        contacts: v.optional(v.array(v.object({ name: v.string(), role: v.optional(v.string()), linkedin: v.optional(v.string()) }))),
        appliedAt: v.optional(v.number()),
        nextAction: v.optional(v.string()),
        nextActionDate: v.optional(v.number()),
        tags: v.optional(v.array(v.string())),
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
                    if (args.status === "applied" && !args.appliedAt)
                        update.appliedAt = Date.now();
                    return [4 /*yield*/, ctx.db.patch(id, update)];
                case 2:
                    _c.sent();
                    return [2 /*return*/];
            }
        });
    }); },
});
export var remove = mutation({
    args: { id: v.id("job_applications") },
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
