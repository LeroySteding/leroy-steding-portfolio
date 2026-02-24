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
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";
/**
 * Linear Webhook Handler
 *
 * Configure in Linear:
 * 1. Go to Settings → API → Webhooks
 * 2. Create new webhook
 * 3. URL: https://[your-convex-url]/linearWebhook
 * 4. Subscribe to: Issue created, Issue updated, Issue deleted
 * 5. Save signing secret to environment
 */
export var linearWebhook = httpAction(function (ctx, request) { return __awaiter(void 0, void 0, void 0, function () {
    var signature, webhookSecret, body, payload, bodyText, error_1, type, action, data, _a, _b, task, error_2;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                signature = request.headers.get("linear-signature");
                webhookSecret = process.env.LINEAR_WEBHOOK_SECRET;
                if (!(webhookSecret && signature)) return [3 /*break*/, 2];
                return [4 /*yield*/, request.text()];
            case 1:
                body = _c.sent();
                _c.label = 2;
            case 2:
                _c.trys.push([2, 4, , 5]);
                return [4 /*yield*/, request.text()];
            case 3:
                bodyText = _c.sent();
                payload = JSON.parse(bodyText);
                return [3 /*break*/, 5];
            case 4:
                error_1 = _c.sent();
                return [2 /*return*/, new Response("Invalid JSON", { status: 400 })];
            case 5:
                type = payload.type, action = payload.action, data = payload.data;
                console.log("Linear webhook received: ".concat(type, " ").concat(action));
                _c.label = 6;
            case 6:
                _c.trys.push([6, 17, , 18]);
                _a = type;
                switch (_a) {
                    case "Issue": return [3 /*break*/, 7];
                }
                return [3 /*break*/, 15];
            case 7:
                _b = action;
                switch (_b) {
                    case "create": return [3 /*break*/, 8];
                    case "update": return [3 /*break*/, 8];
                    case "remove": return [3 /*break*/, 10];
                }
                return [3 /*break*/, 14];
            case 8: 
            // Sync issue to Convex
            return [4 /*yield*/, ctx.runAction(internal.linearSync.syncIssueToTask, {
                    issueId: data.id,
                })];
            case 9:
                // Sync issue to Convex
                _c.sent();
                return [3 /*break*/, 14];
            case 10: return [4 /*yield*/, ctx.runQuery(internal.linearQueries.findTaskByLinearId, { linearIssueId: data.id })];
            case 11:
                task = _c.sent();
                if (!task) return [3 /*break*/, 13];
                return [4 /*yield*/, ctx.runMutation(internal.linearQueries.updateTaskFromLinear, {
                        taskId: task._id,
                        title: task.title,
                        description: task.description,
                        status: "cancelled",
                        priority: task.priority,
                        assignedTo: task.assignedTo,
                    })];
            case 12:
                _c.sent();
                _c.label = 13;
            case 13: return [3 /*break*/, 14];
            case 14: return [3 /*break*/, 16];
            case 15:
                console.log("Unhandled webhook type: ".concat(type));
                _c.label = 16;
            case 16: return [2 /*return*/, new Response(JSON.stringify({ success: true }), {
                    status: 200,
                    headers: { "Content-Type": "application/json" },
                })];
            case 17:
                error_2 = _c.sent();
                console.error("Error processing Linear webhook:", error_2);
                return [2 /*return*/, new Response(JSON.stringify({
                        success: false,
                        error: error_2 instanceof Error ? error_2.message : "Unknown error",
                    }), {
                        status: 500,
                        headers: { "Content-Type": "application/json" },
                    })];
            case 18: return [2 /*return*/];
        }
    });
}); });
