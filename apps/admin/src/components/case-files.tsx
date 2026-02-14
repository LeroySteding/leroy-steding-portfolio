"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  Folder,
  Users,
  FileText,
  Link as LinkIcon,
  MessageSquare,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

const statusColors = {
  active: "bg-green-100 text-green-800",
  paused: "bg-yellow-100 text-yellow-800",
  completed: "bg-blue-100 text-blue-800",
  archived: "bg-gray-100 text-gray-600",
};

const agentIcons: Record<string, string> = {
  orchestrator: "🎯",
  architect: "🏗️",
  coder: "⚡",
  researcher: "🔍",
  business: "💼",
  "data-handler": "🕷️",
  critic: "🛡️",
  compliance: "⚖️",
};

export function CaseFiles() {
  const caseFiles = useQuery(api.agentCoordination.getCaseFiles, {});

  if (!caseFiles) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Folder className="h-5 w-5" />
            Case Files
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">Loading case files...</div>
        </CardContent>
      </Card>
    );
  }

  const activeCases = caseFiles.filter((cf) => cf.status === "active");
  const completedCases = caseFiles.filter((cf) => cf.status === "completed");

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Folder className="h-5 w-5" />
            Case Files
          </CardTitle>
          <div className="flex gap-2">
            <Badge variant="outline" className={statusColors.active}>
              {activeCases.length} Active
            </Badge>
            <Badge variant="outline" className={statusColors.completed}>
              {completedCases.length} Completed
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {caseFiles.length === 0 ? (
          <div className="text-center py-8 text-sm text-muted-foreground">
            No case files yet. Create one to start tracking a project.
          </div>
        ) : (
          <div className="space-y-3">
            {caseFiles.map((caseFile) => (
              <div
                key={caseFile._id}
                className="p-4 border rounded-lg hover:bg-muted/50 transition-colors space-y-3"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-medium text-sm">
                        {caseFile.projectName}
                      </h3>
                      <Badge className={statusColors[caseFile.status]}>
                        {caseFile.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {caseFile.summary}
                    </p>
                  </div>
                  <Button size="sm" variant="ghost" asChild>
                    <Link href={`/case-files/${caseFile._id}`}>
                      <FileText className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>

                {/* Participants */}
                <div className="flex items-center gap-2 flex-wrap">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <div className="flex gap-1">
                    {caseFile.participants.map((participant) => (
                      <span
                        key={participant}
                        className="text-xs px-2 py-1 bg-muted rounded-md"
                        title={participant}
                      >
                        {agentIcons[participant] || "🤖"}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MessageSquare className="h-3 w-3" />
                    {caseFile.decisions.length} decisions
                  </span>
                  <span className="flex items-center gap-1">
                    <LinkIcon className="h-3 w-3" />
                    {caseFile.resources.length} resources
                  </span>
                  <span className="ml-auto">
                    Updated {formatDistanceToNow(caseFile.updatedAt, { addSuffix: true })}
                  </span>
                </div>

                {/* Tags */}
                {caseFile.tags.length > 0 && (
                  <div className="flex gap-1 flex-wrap">
                    {caseFile.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Latest Decision */}
                {caseFile.decisions.length > 0 && (
                  <div className="pt-2 border-t">
                    <div className="text-xs font-medium text-muted-foreground mb-1">
                      Latest Decision:
                    </div>
                    <div className="text-xs text-muted-foreground line-clamp-2">
                      "{caseFile.decisions[caseFile.decisions.length - 1].decision}"
                      {" — "}
                      {caseFile.decisions[caseFile.decisions.length - 1].madeBy}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
