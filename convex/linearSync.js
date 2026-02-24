"use node";
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
import { internalAction } from "./_generated/server";
import { LinearClient } from "@linear/sdk";
import { internal } from "./_generated/api";
// Linear Client initialization (reusable)
function getLinearClient() {
    var apiKey = process.env.LINEAR_API_KEY;
    if (!apiKey) {
        throw new Error("LINEAR_API_KEY not configured");
    }
    return new LinearClient({ apiKey: apiKey });
}
// ============================================================================
// LINEAR → CONVEX SYNC
// ============================================================================
/**
 * Sync a Linear issue to Convex agent_tasks
 */
export var syncIssueToTask = internalAction({
    args: {
        issueId: v.string(),
    },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        var linear, issue, assignee, assigneeName, statusMap, state, status, priorityMap, priority, existingTask, taskId;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    linear = getLinearClient();
                    return [4 /*yield*/, linear.issue(args.issueId)];
                case 1:
                    issue = _a.sent();
                    if (!issue) {
                        throw new Error("Issue ".concat(args.issueId, " not found in Linear"));
                    }
                    return [4 /*yield*/, issue.assignee];
                case 2:
                    assignee = _a.sent();
                    assigneeName = (assignee === null || assignee === void 0 ? void 0 : assignee.name) || "unassigned";
                    statusMap = {
                        "Backlog": "pending",
                        "Todo": "pending",
                        "In Progress": "in_progress",
                        "In Review": "in_progress",
                        "Done": "completed",
                        "Canceled": "cancelled",
                    };
                    return [4 /*yield*/, issue.state];
                case 3:
                    state = _a.sent();
                    status = statusMap[(state === null || state === void 0 ? void 0 : state.name) || "Todo"] || "pending";
                    priorityMap = {
                        0: "low", // No priority
                        1: "low", // Urgent
                        2: "medium", // High
                        3: "high", // Medium
                        4: "critical", // Low (inverted in Linear)
                    };
                    priority = priorityMap[issue.priority || 0] || "medium";
                    return [4 /*yield*/, ctx.runQuery(internal.linearQueries.findTaskByLinearId, { linearIssueId: issue.id })];
                case 4:
                    existingTask = _a.sent();
                    if (!existingTask) return [3 /*break*/, 6];
                    // Update existing task
                    return [4 /*yield*/, ctx.runMutation(internal.linearQueries.updateTaskFromLinear, {
                            taskId: existingTask._id,
                            title: issue.title,
                            description: issue.description || undefined,
                            status: status,
                            priority: priority,
                            assignedTo: [assigneeName],
                        })];
                case 5:
                    // Update existing task
                    _a.sent();
                    return [2 /*return*/, { action: "updated", taskId: existingTask._id }];
                case 6: return [4 /*yield*/, ctx.runMutation(internal.linearQueries.createTaskFromLinear, {
                        linearIssueId: issue.id,
                        title: issue.title,
                        description: issue.description || undefined,
                        status: status,
                        priority: priority,
                        assignedTo: [assigneeName],
                        linearUrl: issue.url,
                    })];
                case 7:
                    taskId = _a.sent();
                    return [2 /*return*/, { action: "created", taskId: taskId }];
            }
        });
    }); },
});
/**
 * Sync all issues from a Linear team
 */
export var syncTeamIssues = internalAction({
    args: {
        teamKey: v.string(), // e.g., "STE"
        limit: v.optional(v.number()),
    },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        var linear, teams, team, issues, results, _i, _a, issue, result, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    linear = getLinearClient();
                    return [4 /*yield*/, linear.teams()];
                case 1:
                    teams = _b.sent();
                    team = teams.nodes.find(function (t) { return t.key === args.teamKey; });
                    if (!team) {
                        throw new Error("Team with key ".concat(args.teamKey, " not found"));
                    }
                    return [4 /*yield*/, team.issues({
                            first: args.limit || 50,
                            filter: {
                                state: {
                                    type: { nin: ["canceled", "completed"] }, // Only active issues
                                },
                            },
                        })];
                case 2:
                    issues = _b.sent();
                    results = [];
                    _i = 0, _a = issues.nodes;
                    _b.label = 3;
                case 3:
                    if (!(_i < _a.length)) return [3 /*break*/, 8];
                    issue = _a[_i];
                    _b.label = 4;
                case 4:
                    _b.trys.push([4, 6, , 7]);
                    return [4 /*yield*/, ctx.runAction(internal.linearSync.syncIssueToTask, {
                            issueId: issue.id,
                        })];
                case 5:
                    result = _b.sent();
                    results.push(__assign({ issueId: issue.id }, result));
                    return [3 /*break*/, 7];
                case 6:
                    error_1 = _b.sent();
                    console.error("Failed to sync issue ".concat(issue.id, ":"), error_1);
                    results.push({ issueId: issue.id, action: "failed", error: String(error_1) });
                    return [3 /*break*/, 7];
                case 7:
                    _i++;
                    return [3 /*break*/, 3];
                case 8: return [2 /*return*/, {
                        teamKey: args.teamKey,
                        synced: results.length,
                        results: results,
                    }];
            }
        });
    }); },
});
// ============================================================================
// CONVEX → LINEAR SYNC
// ============================================================================
/**
 * Update Linear issue status when agent task status changes
 */
export var updateLinearIssueStatus = internalAction({
    args: {
        linearIssueId: v.string(),
        status: v.union(v.literal("pending"), v.literal("in_progress"), v.literal("completed"), v.literal("cancelled")),
    },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        var linear, statusToStateMap, targetStateName, issue, team, states, targetState;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    linear = getLinearClient();
                    statusToStateMap = {
                        pending: "Todo",
                        in_progress: "In Progress",
                        completed: "Done",
                        cancelled: "Canceled",
                    };
                    targetStateName = statusToStateMap[args.status];
                    return [4 /*yield*/, linear.issue(args.linearIssueId)];
                case 1:
                    issue = _a.sent();
                    return [4 /*yield*/, issue.team];
                case 2:
                    team = _a.sent();
                    if (!team) {
                        throw new Error("Team not found for issue");
                    }
                    return [4 /*yield*/, team.states()];
                case 3:
                    states = _a.sent();
                    targetState = states.nodes.find(function (s) { return s.name === targetStateName; });
                    if (!targetState) {
                        throw new Error("State ".concat(targetStateName, " not found in team"));
                    }
                    // Update the issue
                    return [4 /*yield*/, issue.update({
                            stateId: targetState.id,
                        })];
                case 4:
                    // Update the issue
                    _a.sent();
                    return [2 /*return*/, { success: true, newState: targetStateName }];
            }
        });
    }); },
});
/**
 * Create a new Linear issue from an agent task
 */
export var createLinearIssue = internalAction({
    args: {
        taskId: v.id("agent_tasks"),
        teamKey: v.string(),
    },
    handler: function (ctx, args) { return __awaiter(void 0, void 0, void 0, function () {
        var linear, task, teams, team, priorityMap, issuePayload, issue;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    linear = getLinearClient();
                    return [4 /*yield*/, ctx.runQuery(internal.linearQueries.getTask, {
                            taskId: args.taskId,
                        })];
                case 1:
                    task = _a.sent();
                    if (!task) {
                        throw new Error("Task not found");
                    }
                    if (task.linearIssueId) {
                        throw new Error("Task already has a Linear issue");
                    }
                    return [4 /*yield*/, linear.teams()];
                case 2:
                    teams = _a.sent();
                    team = teams.nodes.find(function (t) { return t.key === args.teamKey; });
                    if (!team) {
                        throw new Error("Team with key ".concat(args.teamKey, " not found"));
                    }
                    priorityMap = {
                        low: 1,
                        medium: 2,
                        high: 3,
                        critical: 4,
                    };
                    return [4 /*yield*/, linear.createIssue({
                            teamId: team.id,
                            title: task.title,
                            description: task.description || "",
                            priority: priorityMap[task.priority] || 2,
                        })];
                case 3:
                    issuePayload = _a.sent();
                    return [4 /*yield*/, issuePayload.issue];
                case 4:
                    issue = _a.sent();
                    if (!issue) {
                        throw new Error("Failed to create Linear issue");
                    }
                    // Update task with Linear issue ID
                    return [4 /*yield*/, ctx.runMutation(internal.linearQueries.updateTaskLinearId, {
                            taskId: args.taskId,
                            linearIssueId: issue.id,
                        })];
                case 5:
                    // Update task with Linear issue ID
                    _a.sent();
                    return [2 /*return*/, {
                            linearIssueId: issue.id,
                            url: issue.url,
                        }];
            }
        });
    }); },
});
