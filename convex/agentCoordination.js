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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
// ============================================================================
// AGENT TASKS
// ============================================================================
export var createAgentTask = mutation({
    args: {
        title: v.string(),
        description: v.optional(v.string()),
        assignedTo: v.array(v.string()),
        priority: v.union(v.literal("low"), v.literal("medium"), v.literal("high"), v.literal("critical")),
        context: v.optional(v.string()),
        dependencies: v.optional(v.array(v.string())),
        createdBy: v.string(),
        linearIssueId: v.optional(v.string()),
        caseFileId: v.optional(v.id("case_files")),
        metadata: v.optional(v.any()),
    },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        var taskId;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ctx.db.insert("agent_tasks", {
                        title: args.title,
                        description: args.description,
                        assignedTo: args.assignedTo,
                        status: "pending",
                        priority: args.priority,
                        context: args.context,
                        dependencies: args.dependencies || [],
                        createdBy: args.createdBy,
                        linearIssueId: args.linearIssueId,
                        caseFileId: args.caseFileId,
                        metadata: args.metadata,
                        createdAt: Date.now(),
                        updatedAt: Date.now(),
                    })];
                case 1:
                    taskId = _a.sent();
                    // Create agent feed entry
                    return [4 /*yield*/, ctx.db.insert("agent_feed", {
                            type: "task_update",
                            title: "New Task: ".concat(args.title),
                            content: "Assigned to: ".concat(args.assignedTo.join(", ")),
                            source: args.createdBy,
                            tags: __spreadArray(["agent_task"], args.assignedTo, true),
                            priority: args.priority,
                            read: false,
                            metadata: { taskId: taskId },
                            createdAt: Date.now(),
                        })];
                case 2:
                    // Create agent feed entry
                    _a.sent();
                    return [2 /*return*/, taskId];
            }
        });
    }); },
});
export var updateAgentTask = mutation({
    args: {
        taskId: v.id("agent_tasks"),
        status: v.optional(v.union(v.literal("pending"), v.literal("in_progress"), v.literal("blocked"), v.literal("completed"), v.literal("cancelled"))),
        assignedTo: v.optional(v.array(v.string())),
        priority: v.optional(v.union(v.literal("low"), v.literal("medium"), v.literal("high"), v.literal("critical"))),
        context: v.optional(v.string()),
        metadata: v.optional(v.any()),
    },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        var taskId, updates, task;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    taskId = args.taskId, updates = __rest(args, ["taskId"]);
                    return [4 /*yield*/, ctx.db.patch(taskId, __assign(__assign(__assign({}, updates), { updatedAt: Date.now() }), (updates.status === "completed" && { completedAt: Date.now() })))];
                case 1:
                    _a.sent();
                    if (!updates.status) return [3 /*break*/, 4];
                    return [4 /*yield*/, ctx.db.get(taskId)];
                case 2:
                    task = _a.sent();
                    if (!task) return [3 /*break*/, 4];
                    return [4 /*yield*/, ctx.db.insert("agent_feed", {
                            type: "task_update",
                            title: "Task ".concat(updates.status, ": ").concat(task.title),
                            content: "Status changed to ".concat(updates.status),
                            source: "system",
                            tags: __spreadArray(["agent_task"], task.assignedTo, true),
                            priority: task.priority,
                            read: false,
                            metadata: { taskId: taskId },
                            createdAt: Date.now(),
                        })];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4: return [2 /*return*/, taskId];
            }
        });
    }); },
});
export var getAgentTasks = query({
    args: {
        agentName: v.optional(v.string()),
        status: v.optional(v.union(v.literal("pending"), v.literal("in_progress"), v.literal("blocked"), v.literal("completed"), v.literal("cancelled"))),
        caseFileId: v.optional(v.id("case_files")),
    },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        var tasks;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ctx.db.query("agent_tasks").collect()];
                case 1:
                    tasks = _a.sent();
                    if (args.agentName) {
                        tasks = tasks.filter(function (t) { return t.assignedTo.includes(args.agentName); });
                    }
                    if (args.status) {
                        tasks = tasks.filter(function (t) { return t.status === args.status; });
                    }
                    if (args.caseFileId) {
                        tasks = tasks.filter(function (t) { return t.caseFileId === args.caseFileId; });
                    }
                    return [2 /*return*/, tasks.sort(function (a, b) { return b.createdAt - a.createdAt; })];
            }
        });
    }); },
});
// ============================================================================
// AGENT MEMORY
// ============================================================================
export var createAgentMemory = mutation({
    args: {
        agentName: v.string(),
        category: v.union(v.literal("decision"), v.literal("learning"), v.literal("context"), v.literal("reference"), v.literal("insight")),
        content: v.string(),
        tags: v.array(v.string()),
        sharedWith: v.union(v.literal("all"), v.literal("team"), v.literal("private")),
        relatedTaskId: v.optional(v.id("agent_tasks")),
        relatedCaseId: v.optional(v.id("case_files")),
        metadata: v.optional(v.any()),
    },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        var memoryId;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ctx.db.insert("agent_memory", __assign(__assign({}, args), { createdAt: Date.now() }))];
                case 1:
                    memoryId = _a.sent();
                    return [2 /*return*/, memoryId];
            }
        });
    }); },
});
export var searchAgentMemory = query({
    args: {
        searchTerm: v.string(),
        agentName: v.optional(v.string()),
        category: v.optional(v.union(v.literal("decision"), v.literal("learning"), v.literal("context"), v.literal("reference"), v.literal("insight"))),
        sharedWith: v.optional(v.union(v.literal("all"), v.literal("team"), v.literal("private"))),
    },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        var results, filtered;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ctx.db
                        .query("agent_memory")
                        .withSearchIndex("search_content", function (q) {
                        return q.search("content", args.searchTerm);
                    })
                        .collect()];
                case 1:
                    results = _a.sent();
                    filtered = results;
                    if (args.agentName) {
                        filtered = filtered.filter(function (m) { return m.agentName === args.agentName; });
                    }
                    if (args.category) {
                        filtered = filtered.filter(function (m) { return m.category === args.category; });
                    }
                    if (args.sharedWith) {
                        filtered = filtered.filter(function (m) { return m.sharedWith === args.sharedWith; });
                    }
                    return [2 /*return*/, filtered.sort(function (a, b) { return b.createdAt - a.createdAt; })];
            }
        });
    }); },
});
export var getAgentMemories = query({
    args: {
        agentName: v.optional(v.string()),
        category: v.optional(v.union(v.literal("decision"), v.literal("learning"), v.literal("context"), v.literal("reference"), v.literal("insight"))),
        tags: v.optional(v.array(v.string())),
        limit: v.optional(v.number()),
    },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        var memories;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ctx.db.query("agent_memory").collect()];
                case 1:
                    memories = _a.sent();
                    if (args.agentName) {
                        memories = memories.filter(function (m) { return m.agentName === args.agentName; });
                    }
                    if (args.category) {
                        memories = memories.filter(function (m) { return m.category === args.category; });
                    }
                    if (args.tags && args.tags.length > 0) {
                        memories = memories.filter(function (m) {
                            return args.tags.some(function (tag) { return m.tags.includes(tag); });
                        });
                    }
                    memories = memories.sort(function (a, b) { return b.createdAt - a.createdAt; });
                    if (args.limit) {
                        memories = memories.slice(0, args.limit);
                    }
                    return [2 /*return*/, memories];
            }
        });
    }); },
});
// ============================================================================
// CASE FILES
// ============================================================================
export var createCaseFile = mutation({
    args: {
        projectName: v.string(),
        summary: v.string(),
        participants: v.array(v.string()),
        tags: v.optional(v.array(v.string())),
        linearProjectId: v.optional(v.string()),
        telegramGroupId: v.optional(v.string()),
        metadata: v.optional(v.any()),
    },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        var caseFileId;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ctx.db.insert("case_files", {
                        projectName: args.projectName,
                        status: "active",
                        participants: args.participants,
                        summary: args.summary,
                        decisions: [],
                        resources: [],
                        tags: args.tags || [],
                        linearProjectId: args.linearProjectId,
                        telegramGroupId: args.telegramGroupId,
                        metadata: args.metadata,
                        createdAt: Date.now(),
                        updatedAt: Date.now(),
                    })];
                case 1:
                    caseFileId = _a.sent();
                    // Create agent feed entry
                    return [4 /*yield*/, ctx.db.insert("agent_feed", {
                            type: "insight",
                            title: "New Case File: ".concat(args.projectName),
                            content: args.summary,
                            source: "orchestrator",
                            tags: __spreadArray(["case_file"], args.participants, true),
                            priority: "high",
                            read: false,
                            metadata: { caseFileId: caseFileId },
                            createdAt: Date.now(),
                        })];
                case 2:
                    // Create agent feed entry
                    _a.sent();
                    return [2 /*return*/, caseFileId];
            }
        });
    }); },
});
export var addDecisionToCaseFile = mutation({
    args: {
        caseFileId: v.id("case_files"),
        decision: v.string(),
        madeBy: v.string(),
        rationale: v.optional(v.string()),
    },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        var caseFile, newDecision;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ctx.db.get(args.caseFileId)];
                case 1:
                    caseFile = _a.sent();
                    if (!caseFile)
                        throw new Error("Case file not found");
                    newDecision = {
                        decision: args.decision,
                        madeBy: args.madeBy,
                        timestamp: Date.now(),
                        rationale: args.rationale,
                    };
                    return [4 /*yield*/, ctx.db.patch(args.caseFileId, {
                            decisions: __spreadArray(__spreadArray([], caseFile.decisions, true), [newDecision], false),
                            updatedAt: Date.now(),
                        })];
                case 2:
                    _a.sent();
                    return [2 /*return*/, args.caseFileId];
            }
        });
    }); },
});
export var addResourceToCaseFile = mutation({
    args: {
        caseFileId: v.id("case_files"),
        type: v.union(v.literal("link"), v.literal("file"), v.literal("code"), v.literal("note"), v.literal("reference")),
        title: v.string(),
        content: v.string(),
        url: v.optional(v.string()),
        addedBy: v.string(),
    },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        var caseFile, newResource;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ctx.db.get(args.caseFileId)];
                case 1:
                    caseFile = _a.sent();
                    if (!caseFile)
                        throw new Error("Case file not found");
                    newResource = {
                        type: args.type,
                        title: args.title,
                        content: args.content,
                        url: args.url,
                        addedBy: args.addedBy,
                        timestamp: Date.now(),
                    };
                    return [4 /*yield*/, ctx.db.patch(args.caseFileId, {
                            resources: __spreadArray(__spreadArray([], caseFile.resources, true), [newResource], false),
                            updatedAt: Date.now(),
                        })];
                case 2:
                    _a.sent();
                    return [2 /*return*/, args.caseFileId];
            }
        });
    }); },
});
export var getCaseFiles = query({
    args: {
        status: v.optional(v.union(v.literal("active"), v.literal("paused"), v.literal("completed"), v.literal("archived"))),
        participant: v.optional(v.string()),
    },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        var caseFiles;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ctx.db.query("case_files").collect()];
                case 1:
                    caseFiles = _a.sent();
                    if (args.status) {
                        caseFiles = caseFiles.filter(function (cf) { return cf.status === args.status; });
                    }
                    if (args.participant) {
                        caseFiles = caseFiles.filter(function (cf) {
                            return cf.participants.includes(args.participant);
                        });
                    }
                    return [2 /*return*/, caseFiles.sort(function (a, b) { return b.updatedAt - a.updatedAt; })];
            }
        });
    }); },
});
export var getCaseFileById = query({
    args: { caseFileId: v.id("case_files") },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ctx.db.get(args.caseFileId)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    }); },
});
// ============================================================================
// AGENT SESSIONS
// ============================================================================
export var updateAgentSession = mutation({
    args: {
        agentName: v.string(),
        sessionId: v.string(),
        status: v.union(v.literal("active"), v.literal("idle"), v.literal("offline")),
        currentTask: v.optional(v.id("agent_tasks")),
        metadata: v.optional(v.any()),
    },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        var existing;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ctx.db
                        .query("agent_sessions")
                        .withIndex("by_session_id", function (q) { return q.eq("sessionId", args.sessionId); })
                        .first()];
                case 1:
                    existing = _a.sent();
                    if (!existing) return [3 /*break*/, 3];
                    return [4 /*yield*/, ctx.db.patch(existing._id, {
                            status: args.status,
                            currentTask: args.currentTask,
                            lastActivity: Date.now(),
                            metadata: args.metadata,
                        })];
                case 2:
                    _a.sent();
                    return [2 /*return*/, existing._id];
                case 3: return [4 /*yield*/, ctx.db.insert("agent_sessions", {
                        agentName: args.agentName,
                        sessionId: args.sessionId,
                        status: args.status,
                        currentTask: args.currentTask,
                        lastActivity: Date.now(),
                        metadata: args.metadata,
                        createdAt: Date.now(),
                    })];
                case 4: return [2 /*return*/, _a.sent()];
            }
        });
    }); },
});
export var getAgentSessions = query({
    args: {
        status: v.optional(v.union(v.literal("active"), v.literal("idle"), v.literal("offline"))),
    },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        var sessions;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ctx.db.query("agent_sessions").collect()];
                case 1:
                    sessions = _a.sent();
                    if (args.status) {
                        sessions = sessions.filter(function (s) { return s.status === args.status; });
                    }
                    return [2 /*return*/, sessions.sort(function (a, b) { return b.lastActivity - a.lastActivity; })];
            }
        });
    }); },
});
// ============================================================================
// AGENT FEED
// ============================================================================
export var getAgentFeed = query({
    args: {
        type: v.optional(v.union(v.literal("news"), v.literal("trend"), v.literal("alert"), v.literal("task_update"), v.literal("deploy"), v.literal("pr"), v.literal("briefing"), v.literal("insight"))),
        limit: v.optional(v.number()),
        read: v.optional(v.boolean()),
    },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        var feed;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ctx.db.query("agent_feed").collect()];
                case 1:
                    feed = _a.sent();
                    if (args.type) {
                        feed = feed.filter(function (f) { return f.type === args.type; });
                    }
                    if (args.read !== undefined) {
                        feed = feed.filter(function (f) { return f.read === args.read; });
                    }
                    feed = feed.sort(function (a, b) { return b.createdAt - a.createdAt; });
                    if (args.limit) {
                        feed = feed.slice(0, args.limit);
                    }
                    return [2 /*return*/, feed];
            }
        });
    }); },
});
