"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { FolderOpen, Plus, Users } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const statusColors: Record<string, "default" | "secondary" | "outline"> = {
  active: "default",
  completed: "secondary",
  archived: "outline",
};

export function CaseFiles() {
  const caseFiles = useQuery(api.agentCoordination.getCaseFiles, {
    status: "active",
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <FolderOpen className="h-5 w-5" />
          Case Files
          {caseFiles && caseFiles.length > 0 && (
            <Badge variant="outline" className="ml-2">
              {caseFiles.length} active
            </Badge>
          )}
        </CardTitle>
        <Button size="sm" variant="outline">
          <Plus className="h-4 w-4 mr-2" />
          New Case
        </Button>
      </CardHeader>
      <CardContent>
        {!caseFiles || caseFiles.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <FolderOpen className="h-12 w-12 mx-auto mb-3 opacity-20" />
            <p className="font-medium">No active cases</p>
            <p className="text-sm">Create a case file to track multi-agent projects</p>
            <Button size="sm" className="mt-4">
              <Plus className="h-4 w-4 mr-2" />
              Create First Case
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {caseFiles.map((caseFile) => (
              <div
                key={caseFile._id}
                className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium">{caseFile.projectName}</h4>
                  <Badge variant={statusColors[caseFile.status]}>
                    {caseFile.status}
                  </Badge>
                </div>
                
                {caseFile.summary && (
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {caseFile.summary}
                  </p>
                )}

                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  {caseFile.participants && caseFile.participants.length > 0 && (
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      <span>{caseFile.participants.length} agents</span>
                    </div>
                  )}
                  <span>
                    {formatDistanceToNow(caseFile.createdAt, { addSuffix: true })}
                  </span>
                  {caseFile.tags && caseFile.tags.length > 0 && (
                    <div className="flex gap-1">
                      {caseFile.tags.slice(0, 2).map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
