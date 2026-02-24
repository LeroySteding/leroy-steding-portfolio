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
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
// Public log mutation for agents (no auth required)
export var log = mutation({
    args: {
        event: v.string(), agent: v.optional(v.string()), model: v.optional(v.string()),
        tokensIn: v.optional(v.number()), tokensOut: v.optional(v.number()),
        cost: v.optional(v.number()), durationMs: v.optional(v.number()),
        metadata: v.optional(v.any()),
    },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ctx.db.insert("analytics_log", __assign(__assign({}, args), { createdAt: Date.now() }))];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    }); },
});
export var list = query({
    args: { event: v.optional(v.string()), agent: v.optional(v.string()), model: v.optional(v.string()), limit: v.optional(v.number()) },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        var items;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, ctx.db.query("analytics_log").order("desc").collect()];
                case 1:
                    items = _b.sent();
                    if (args.event)
                        items = items.filter(function (i) { return i.event === args.event; });
                    if (args.agent)
                        items = items.filter(function (i) { return i.agent === args.agent; });
                    if (args.model)
                        items = items.filter(function (i) { return i.model === args.model; });
                    return [2 /*return*/, items.slice(0, (_a = args.limit) !== null && _a !== void 0 ? _a : 100)];
            }
        });
    }); },
});
export var summary = query({
    args: {},
    handler: function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
        var all, totalCost, totalTokensIn, totalTokensOut, byAgent, byModel, _i, all_1, item;
        var _a, _b, _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0: return [4 /*yield*/, ctx.db.query("analytics_log").collect()];
                case 1:
                    all = _f.sent();
                    totalCost = 0, totalTokensIn = 0, totalTokensOut = 0;
                    byAgent = {};
                    byModel = {};
                    for (_i = 0, all_1 = all; _i < all_1.length; _i++) {
                        item = all_1[_i];
                        totalCost += (_a = item.cost) !== null && _a !== void 0 ? _a : 0;
                        totalTokensIn += (_b = item.tokensIn) !== null && _b !== void 0 ? _b : 0;
                        totalTokensOut += (_c = item.tokensOut) !== null && _c !== void 0 ? _c : 0;
                        if (item.agent)
                            byAgent[item.agent] = ((_d = byAgent[item.agent]) !== null && _d !== void 0 ? _d : 0) + 1;
                        if (item.model)
                            byModel[item.model] = ((_e = byModel[item.model]) !== null && _e !== void 0 ? _e : 0) + 1;
                    }
                    return [2 /*return*/, { totalCost: totalCost, totalTokensIn: totalTokensIn, totalTokensOut: totalTokensOut, totalEvents: all.length, byAgent: byAgent, byModel: byModel }];
            }
        });
    }); },
});
export var remove = mutation({
    args: { id: v.id("analytics_log") },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, ctx.db.delete(args.id)];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    }); }); },
});
