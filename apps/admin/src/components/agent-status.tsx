"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Clock, Cpu, Zap } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const agentIcons: Record<string, string> = {
  orchestrator: "🎯",
  architect: "🏗️",
  coder: "⚡",
  researcher: "🔍",
  business: "💼",
  "data-handler": "🕷️",
  critic: "🛡️",
  compliance: "⚖️",
  main: "🤖",
};

const agentColors: Record<string, string> = {
  orchestrator: "bg-purple-500",
  architect: "bg-blue-500",
  coder: "bg-yellow-500",
  researcher: "bg-green-500",
  business: "bg-pink-500",
  "data-handler": "bg-orange-500",
  critic: "bg-red-500",
  compliance: "bg-indigo-500",
  main: "bg-gray-500",
};

export function AgentStatus() {
  const sessions = useQuery(api.agentCoordination.getAgentSessions, {});
  const activeTasks = useQuery(api.agentCoordination.getAgentTasks, {
    status: "in_progress",
  });

  if (!sessions) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cpu className="h-5 w-5" />
            Agent Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">Loading...</div>
        </CardContent>
      </Card>
    );
  }

  const activeAgents = sessions.filter((s) => s.status === "active");
  const idleAgents = sessions.filter((s) => s.status === "idle");
  const offlineAgents = sessions.filter((s) => s.status === "offline");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cpu className="h-5 w-5" />
            Agent Status
          </div>
          <div className="flex gap-2 text-sm font-normal">
            <Badge variant="outline" className="bg-green-50 text-green-700">
              {activeAgents.length} Active
            </Badge>
            <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
              {idleAgents.length} Idle
            </Badge>
            <Badge variant="outline" className="bg-gray-50 text-gray-700">
              {offlineAgents.length} Offline
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Active Agents */}
        {activeAgents.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-green-700 flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Active
            </h3>
            <div className="space-y-2">
              {activeAgents.map((session) => {
                const task = activeTasks?.find(
                  (t) => t._id === session.currentTask
                );
                return (
                  <div
                    key={session._id}
                    className="flex items-center gap-3 p-3 border rounded-lg bg-green-50/50 hover:bg-green-50 transition-colors"
                  >
                    <Avatar
                      className={`h-10 w-10 ${
                        agentColors[session.agentName] || "bg-gray-500"
                      }`}
                    >
                      <AvatarFallback className="text-white">
                        {agentIcons[session.agentName] || "🤖"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium capitalize">
                          {session.agentName}
                        </p>
                        <Badge
                          variant="outline"
                          className="bg-green-100 text-green-800 text-xs"
                        >
                          Active
                        </Badge>
                      </div>
                      {task ? (
                        <p className="text-xs text-muted-foreground truncate mt-1">
                          Working on: {task.title}
                        </p>
                      ) : (
                        <p className="text-xs text-muted-foreground mt-1">
                          Available
                        </p>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDistanceToNow(session.lastActivity, {
                        addSuffix: true,
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Idle Agents */}
        {idleAgents.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-yellow-700">Idle</h3>
            <div className="grid grid-cols-2 gap-2">
              {idleAgents.map((session) => (
                <div
                  key={session._id}
                  className="flex items-center gap-2 p-2 border rounded-lg bg-yellow-50/50"
                >
                  <Avatar
                    className={`h-8 w-8 ${
                      agentColors[session.agentName] || "bg-gray-500"
                    }`}
                  >
                    <AvatarFallback className="text-white text-sm">
                      {agentIcons[session.agentName] || "🤖"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium capitalize truncate">
                      {session.agentName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(session.lastActivity, {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Offline Agents */}
        {offlineAgents.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-500">Offline</h3>
            <div className="flex flex-wrap gap-2">
              {offlineAgents.map((session) => (
                <Badge key={session._id} variant="outline" className="text-xs">
                  {agentIcons[session.agentName] || "🤖"}{" "}
                  {session.agentName}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {sessions.length === 0 && (
          <div className="text-center py-8 text-sm text-muted-foreground">
            No agents connected yet
          </div>
        )}
      </CardContent>
    </Card>
  );
}
