"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { Folder, FolderOpen, Plus, FileText, Link as LinkIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { Id } from "../../convex/_generated/dataModel";

const agentIcons: Record<string, string> = {
  orchestrator: "🎯",
  architect: "🏗️",
  coder: "💻",
  researcher: "🔍",
  business: "📈",
  "data-handler": "🕷️",
  critic: "⚠️",
};

const statusColors = {
  active: "bg-green-100 text-green-700 border-green-300",
  paused: "bg-yellow-100 text-yellow-700 border-yellow-300",
  completed: "bg-blue-100 text-blue-700 border-blue-300",
  archived: "bg-gray-100 text-gray-500 border-gray-300",
};

const agentsList = [
  "orchestrator",
  "architect",
  "coder",
  "researcher",
  "business",
  "data-handler",
  "critic",
];

export function CaseFiles() {
  const caseFiles = useQuery(api.agentCoordination.getCaseFiles, {});
  const createCaseFile = useMutation(api.agentCoordination.createCaseFile);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    projectName: "",
    summary: "",
    participants: [] as string[],
  });
  const [expandedCase, setExpandedCase] = useState<string | null>(null);

  const handleCreateCaseFile = async () => {
    if (!formData.projectName || !formData.summary || formData.participants.length === 0) return;

    await createCaseFile({
      projectName: formData.projectName,
      summary: formData.summary,
      participants: formData.participants,
    });

    setFormData({
      projectName: "",
      summary: "",
      participants: [],
    });
    setIsDialogOpen(false);
  };

  const activeCases = caseFiles?.filter((cf) => cf.status === "active");

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-xl font-semibold">Case Files</CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              New Case
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Case File</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="projectName">Project Name</Label>
                <Input
                  id="projectName"
                  value={formData.projectName}
                  onChange={(e) =>
                    setFormData({ ...formData, projectName: e.target.value })
                  }
                  placeholder="Project name..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="summary">Summary</Label>
                <Textarea
                  id="summary"
                  value={formData.summary}
                  onChange={(e) =>
                    setFormData({ ...formData, summary: e.target.value })
                  }
                  placeholder="Project summary..."
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label>Participants</Label>
                <div className="flex flex-wrap gap-2">
                  {agentsList.map((agent) => (
                    <Button
                      key={agent}
                      type="button"
                      variant={
                        formData.participants.includes(agent) ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => {
                        if (formData.participants.includes(agent)) {
                          setFormData({
                            ...formData,
                            participants: formData.participants.filter((a) => a !== agent),
                          });
                        } else {
                          setFormData({
                            ...formData,
                            participants: [...formData.participants, agent],
                          });
                        }
                      }}
                    >
                      {agentIcons[agent]} {agent}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateCaseFile}>Create Case</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {!caseFiles ? (
          <div className="text-sm text-muted-foreground">Loading...</div>
        ) : activeCases && activeCases.length > 0 ? (
          <Accordion type="single" collapsible className="space-y-2">
            {activeCases.map((caseFile) => (
              <AccordionItem
                key={caseFile._id}
                value={caseFile._id}
                className="border rounded-lg px-4"
              >
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-3 flex-1 text-left">
                    <div className="text-2xl">
                      {expandedCase === caseFile._id ? <FolderOpen /> : <Folder />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{caseFile.projectName}</h4>
                        <Badge
                          variant="outline"
                          className={statusColors[caseFile.status]}
                        >
                          {caseFile.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {caseFile.summary}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        {caseFile.participants.slice(0, 5).map((participant) => (
                          <span key={participant} className="text-sm">
                            {agentIcons[participant]}
                          </span>
                        ))}
                        {caseFile.participants.length > 5 && (
                          <span className="text-xs text-muted-foreground">
                            +{caseFile.participants.length - 5}
                          </span>
                        )}
                        <span className="text-xs text-muted-foreground ml-2">
                          • {caseFile.decisions.length} decisions
                        </span>
                        <span className="text-xs text-muted-foreground">
                          • {caseFile.resources.length} resources
                        </span>
                      </div>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="pt-4 space-y-4">
                    {/* Decisions */}
                    {caseFile.decisions.length > 0 && (
                      <div>
                        <h5 className="text-sm font-semibold mb-2 flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          Decisions
                        </h5>
                        <div className="space-y-2">
                          {caseFile.decisions.map((decision, idx) => (
                            <div
                              key={idx}
                              className="text-sm p-3 bg-muted/50 rounded border"
                            >
                              <p className="font-medium">{decision.decision}</p>
                              {decision.rationale && (
                                <p className="text-muted-foreground mt-1">
                                  {decision.rationale}
                                </p>
                              )}
                              <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                                <Badge variant="secondary" className="text-xs">
                                  {agentIcons[decision.madeBy]} {decision.madeBy}
                                </Badge>
                                <span>
                                  {formatDistanceToNow(decision.timestamp, {
                                    addSuffix: true,
                                  })}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Resources */}
                    {caseFile.resources.length > 0 && (
                      <div>
                        <h5 className="text-sm font-semibold mb-2 flex items-center gap-2">
                          <LinkIcon className="h-4 w-4" />
                          Resources
                        </h5>
                        <div className="space-y-2">
                          {caseFile.resources.map((resource, idx) => (
                            <div
                              key={idx}
                              className="text-sm p-3 bg-muted/50 rounded border"
                            >
                              <div className="flex items-center gap-2 mb-1">
                                <Badge variant="outline" className="text-xs">
                                  {resource.type}
                                </Badge>
                                <span className="font-medium">{resource.title}</span>
                              </div>
                              <p className="text-muted-foreground">{resource.content}</p>
                              {resource.url && (
                                <a
                                  href={resource.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:underline text-xs mt-1 inline-block"
                                >
                                  {resource.url}
                                </a>
                              )}
                              <div className="text-xs text-muted-foreground mt-2">
                                Added by {agentIcons[resource.addedBy]} {resource.addedBy} •{" "}
                                {formatDistanceToNow(resource.timestamp, {
                                  addSuffix: true,
                                })}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {caseFile.decisions.length === 0 &&
                      caseFile.resources.length === 0 && (
                        <div className="text-center py-4 text-sm text-muted-foreground">
                          No decisions or resources yet
                        </div>
                      )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <div className="text-center py-8 text-sm text-muted-foreground">
            No active case files
          </div>
        )}
      </CardContent>
    </Card>
  );
}
