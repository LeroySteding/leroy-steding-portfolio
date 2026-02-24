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
// List all skills with optional filters
export var list = query({
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
                    if (args.locale) {
                        skills = skills.filter(function (skill) { return skill.locale === args.locale; });
                    }
                    if (args.category) {
                        skills = skills.filter(function (skill) { return skill.category === args.category; });
                    }
                    return [2 /*return*/, skills.sort(function (a, b) {
                            // Sort by order first if specified
                            if (a.order !== undefined && b.order !== undefined) {
                                return a.order - b.order;
                            }
                            // Then by proficiency (highest first)
                            return b.proficiency - a.proficiency;
                        })];
            }
        });
    }); },
});
// Get a single skill by ID
export var getById = query({
    args: { id: v.id("skills") },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ctx.db.get(args.id)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    }); },
});
// Get a skill by name
export var getByName = query({
    args: { name: v.string() },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        var skills;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ctx.db
                        .query("skills")
                        .withIndex("by_name", function (q) { return q.eq("name", args.name); })
                        .collect()];
                case 1:
                    skills = _a.sent();
                    return [2 /*return*/, skills[0]];
            }
        });
    }); },
});
// Public push mutation for agents (no auth required)
export var push = mutation({
    args: {
        name: v.string(), category: v.string(), proficiency: v.number(),
        icon: v.optional(v.string()), iconUrl: v.optional(v.string()), color: v.optional(v.string()),
        yearsOfExperience: v.optional(v.number()), order: v.optional(v.number()),
        locale: v.optional(v.union(v.literal("en"), v.literal("nl"))), published: v.optional(v.boolean()),
    },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        var existing;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (args.proficiency < 1 || args.proficiency > 100)
                        throw new Error("Proficiency must be between 1 and 100");
                    return [4 /*yield*/, ctx.db.query("skills")
                            .withIndex("by_name", function (q) { return q.eq("name", args.name); })
                            .first()];
                case 1:
                    existing = _a.sent();
                    if (!existing) return [3 /*break*/, 3];
                    return [4 /*yield*/, ctx.db.patch(existing._id, args)];
                case 2:
                    _a.sent();
                    return [2 /*return*/, existing._id];
                case 3: return [4 /*yield*/, ctx.db.insert("skills", args)];
                case 4: return [2 /*return*/, _a.sent()];
            }
        });
    }); },
});
// Create a new skill
export var create = mutation({
    args: {
        name: v.string(),
        category: v.string(),
        proficiency: v.number(),
        icon: v.optional(v.string()),
        iconUrl: v.optional(v.string()),
        color: v.optional(v.string()),
        yearsOfExperience: v.optional(v.number()),
        order: v.optional(v.number()),
        locale: v.optional(v.union(v.literal("en"), v.literal("nl"))),
        published: v.optional(v.boolean()),
    },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        var skillId;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, requireAuth(ctx)];
                case 1:
                    _a.sent();
                    // Validate proficiency range
                    if (args.proficiency < 1 || args.proficiency > 100) {
                        throw new Error("Proficiency must be between 1 and 100");
                    }
                    return [4 /*yield*/, ctx.db.insert("skills", args)];
                case 2:
                    skillId = _a.sent();
                    return [2 /*return*/, skillId];
            }
        });
    }); },
});
// Update a skill
export var update = mutation({
    args: {
        id: v.id("skills"),
        name: v.optional(v.string()),
        category: v.optional(v.string()),
        proficiency: v.optional(v.number()),
        icon: v.optional(v.string()),
        iconUrl: v.optional(v.string()),
        color: v.optional(v.string()),
        yearsOfExperience: v.optional(v.number()),
        order: v.optional(v.number()),
        locale: v.optional(v.union(v.literal("en"), v.literal("nl"))),
        published: v.optional(v.boolean()),
    },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        var id, updates, existingSkill;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, requireAuth(ctx)];
                case 1:
                    _a.sent();
                    id = args.id, updates = __rest(args, ["id"]);
                    return [4 /*yield*/, ctx.db.get(id)];
                case 2:
                    existingSkill = _a.sent();
                    if (!existingSkill) {
                        throw new Error("Skill not found");
                    }
                    // Validate proficiency range if provided
                    if (updates.proficiency !== undefined &&
                        (updates.proficiency < 1 || updates.proficiency > 100)) {
                        throw new Error("Proficiency must be between 1 and 100");
                    }
                    return [4 /*yield*/, ctx.db.patch(id, updates)];
                case 3:
                    _a.sent();
                    return [2 /*return*/, id];
            }
        });
    }); },
});
// Delete a skill
export var remove = mutation({
    args: { id: v.id("skills") },
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
