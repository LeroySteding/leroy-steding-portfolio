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
// List all media files
export var list = query({
    args: {
        mimeType: v.optional(v.string()),
        limit: v.optional(v.number()),
    },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        var media, sorted;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ctx.db.query("media").collect()];
                case 1:
                    media = _a.sent();
                    if (args.mimeType) {
                        media = media.filter(function (item) { return item.mimeType.startsWith(args.mimeType); });
                    }
                    sorted = media.sort(function (a, b) { return b._creationTime - a._creationTime; });
                    if (args.limit) {
                        return [2 /*return*/, sorted.slice(0, args.limit)];
                    }
                    return [2 /*return*/, sorted];
            }
        });
    }); },
});
// Get a single media item by ID
export var getById = query({
    args: { id: v.id("media") },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ctx.db.get(args.id)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    }); },
});
// Get media by storage ID
export var getByStorageId = query({
    args: { storageId: v.id("_storage") },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        var media;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ctx.db
                        .query("media")
                        .filter(function (q) { return q.eq(q.field("storageId"), args.storageId); })
                        .first()];
                case 1:
                    media = _a.sent();
                    return [2 /*return*/, media];
            }
        });
    }); },
});
// Generate upload URL for new media
export var generateUploadUrl = mutation({
    args: {},
    handler: function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, requireAuth(ctx)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, ctx.storage.generateUploadUrl()];
                case 2: return [2 /*return*/, _a.sent()];
            }
        });
    }); },
});
// Create a media record after upload
export var create = mutation({
    args: {
        storageId: v.id("_storage"),
        filename: v.string(),
        mimeType: v.string(),
        alt: v.optional(v.string()),
        caption: v.optional(v.string()),
        width: v.optional(v.number()),
        height: v.optional(v.number()),
        fileSize: v.optional(v.number()),
    },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        var userId, mediaId;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, requireAuth(ctx)];
                case 1:
                    userId = _a.sent();
                    return [4 /*yield*/, ctx.db.insert("media", __assign(__assign({}, args), { uploadedBy: userId }))];
                case 2:
                    mediaId = _a.sent();
                    return [2 /*return*/, mediaId];
            }
        });
    }); },
});
// Update media metadata
export var update = mutation({
    args: {
        id: v.id("media"),
        alt: v.optional(v.string()),
        caption: v.optional(v.string()),
        filename: v.optional(v.string()),
    },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        var id, updates, existingMedia;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, requireAuth(ctx)];
                case 1:
                    _a.sent();
                    id = args.id, updates = __rest(args, ["id"]);
                    return [4 /*yield*/, ctx.db.get(id)];
                case 2:
                    existingMedia = _a.sent();
                    if (!existingMedia) {
                        throw new Error("Media not found");
                    }
                    return [4 /*yield*/, ctx.db.patch(id, updates)];
                case 3:
                    _a.sent();
                    return [2 /*return*/, id];
            }
        });
    }); },
});
// Delete media (removes both record and file)
export var remove = mutation({
    args: { id: v.id("media") },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        var media;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, requireAuth(ctx)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, ctx.db.get(args.id)];
                case 2:
                    media = _a.sent();
                    if (!media) {
                        throw new Error("Media not found");
                    }
                    // Delete the file from storage
                    return [4 /*yield*/, ctx.storage.delete(media.storageId)];
                case 3:
                    // Delete the file from storage
                    _a.sent();
                    // Delete the database record
                    return [4 /*yield*/, ctx.db.delete(args.id)];
                case 4:
                    // Delete the database record
                    _a.sent();
                    return [2 /*return*/, args.id];
            }
        });
    }); },
});
// Get URL for a media file
export var getUrl = query({
    args: { storageId: v.id("_storage") },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ctx.storage.getUrl(args.storageId)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    }); },
});
