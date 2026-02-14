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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { 
  Brain, 
  Search, 
  Plus, 
  Lightbulb, 
  BookOpen, 
  FileText, 
  Link as LinkIcon,
  Target
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const agentIcons: Record<string, string> = {
  orchestrator: "🎯",
  architect: "🏗️",
  coder: "💻",
  researcher: "🔍",
  business: "📈",
  "data-handler": "🕷️",
  critic: "⚠️",
};

const categoryIcons = {
  decision: <Target className="h-4 w-4" />,
  learning: <BookOpen className="h-4 w-4" />,
  context: <FileText className="h-4 w-4" />,
  reference: <LinkIcon className="h-4 w-4" />,
  insight: <Lightbulb className="h-4 w-4" />,
};

const categoryColors = {
  decision: "bg-blue-100 text-blue-700 border-blue-300",
  learning: "bg-green-100 text-green-700 border-green-300",
  context: "bg-purple-100 text-purple-700 border-purple-300",
  reference: "bg-orange-100 text-orange-700 border-orange-300",
  insight: "bg-yellow-100 text-yellow-700 border-yellow-300",
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

type Category = "decision" | "learning" | "context" | "reference" | "insight";
type SharedWith = "all" | "team" | "private";

export function AgentMemory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterAgent, setFilterAgent] = useState<string | undefined>(undefined);
  const [filterCategory, setFilterCategory] = useState<Category | undefined>(undefined);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const memories = useQuery(
    api.agentCoordination.getAgentMemories,
    {
      agentName: filterAgent,
      category: filterCategory,
      limit: 50,
    }
  );

  const searchResults = useQuery(
    api.agentCoordination.searchAgentMemory,
    searchTerm.length > 2
      ? {
          searchTerm,
          agentName: filterAgent,
          category: filterCategory,
        }
      : "skip"
  );

  const createMemory = useMutation(api.agentCoordination.createAgentMemory);

  const [formData, setFormData] = useState({
    agentName: "orchestrator",
    category: "insight" as Category,
    content: "",
    tags: [] as string[],
    sharedWith: "all" as SharedWith,
  });

  const [tagInput, setTagInput] = useState("");

  const handleCreateMemory = async () => {
    if (!formData.content || formData.tags.length === 0) return;

    await createMemory({
      agentName: formData.agentName,
      category: formData.category,
      content: formData.content,
      tags: formData.tags,
      sharedWith: formData.sharedWith,
    });

    setFormData({
      agentName: "orchestrator",
      category: "insight",
      content: "",
      tags: [],
      sharedWith: "all",
    });
    setTagInput("");
    setIsDialogOpen(false);
  };

  const handleAddTag = () => {
    if (tagInput && !formData.tags.includes(tagInput)) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput],
      });
      setTagInput("");
    }
  };

  const displayMemories = searchTerm.length > 2 ? searchResults : memories;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          <Brain className="h-5 w-5" />
          Agent Memory
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filters and Search */}
        <div className="space-y-3">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search memories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Memory
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Memory</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="agentName">Agent</Label>
                      <Select
                        value={formData.agentName}
                        onValueChange={(value) =>
                          setFormData({ ...formData, agentName: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {agentsList.map((agent) => (
                            <SelectItem key={agent} value={agent}>
                              {agentIcons[agent]} {agent}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value: Category) =>
                          setFormData({ ...formData, category: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="decision">Decision</SelectItem>
                          <SelectItem value="learning">Learning</SelectItem>
                          <SelectItem value="context">Context</SelectItem>
                          <SelectItem value="reference">Reference</SelectItem>
                          <SelectItem value="insight">Insight</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="content">Content</Label>
                    <Textarea
                      id="content"
                      value={formData.content}
                      onChange={(e) =>
                        setFormData({ ...formData, content: e.target.value })
                      }
                      placeholder="Memory content..."
                      rows={6}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tags">Tags</Label>
                    <div className="flex gap-2">
                      <Input
                        id="tags"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddTag();
                          }
                        }}
                        placeholder="Add tag..."
                      />
                      <Button type="button" onClick={handleAddTag}>
                        Add
                      </Button>
                    </div>
                    {formData.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {formData.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="cursor-pointer"
                            onClick={() =>
                              setFormData({
                                ...formData,
                                tags: formData.tags.filter((t) => t !== tag),
                              })
                            }
                          >
                            {tag} ×
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sharedWith">Shared With</Label>
                    <Select
                      value={formData.sharedWith}
                      onValueChange={(value: SharedWith) =>
                        setFormData({ ...formData, sharedWith: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Agents</SelectItem>
                        <SelectItem value="team">Team Only</SelectItem>
                        <SelectItem value="private">Private</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end gap-2 pt-4">
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateMemory}>Add Memory</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <div className="flex gap-2">
            <Select
              value={filterAgent || "all"}
              onValueChange={(value) =>
                setFilterAgent(value === "all" ? undefined : value)
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All agents" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All agents</SelectItem>
                {agentsList.map((agent) => (
                  <SelectItem key={agent} value={agent}>
                    {agentIcons[agent]} {agent}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={filterCategory || "all"}
              onValueChange={(value) =>
                setFilterCategory(value === "all" ? undefined : (value as Category))
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                <SelectItem value="decision">Decision</SelectItem>
                <SelectItem value="learning">Learning</SelectItem>
                <SelectItem value="context">Context</SelectItem>
                <SelectItem value="reference">Reference</SelectItem>
                <SelectItem value="insight">Insight</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Memories List */}
        {!displayMemories ? (
          <div className="text-sm text-muted-foreground">Loading...</div>
        ) : displayMemories.length > 0 ? (
          <ScrollArea className="h-[500px] pr-4">
            <div className="space-y-3">
              {displayMemories.map((memory, idx) => (
                <div key={memory._id}>
                  <div className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-start gap-3 mb-2">
                      <div
                        className={`p-2 rounded-lg border ${
                          categoryColors[memory.category]
                        }`}
                      >
                        {categoryIcons[memory.category]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="secondary" className="text-xs">
                            {agentIcons[memory.agentName]} {memory.agentName}
                          </Badge>
                          <Badge
                            variant="outline"
                            className={`text-xs ${categoryColors[memory.category]}`}
                          >
                            {memory.category}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {memory.sharedWith}
                          </Badge>
                          <span className="text-xs text-muted-foreground ml-auto">
                            {formatDistanceToNow(memory.createdAt, {
                              addSuffix: true,
                            })}
                          </span>
                        </div>
                        <p className="text-sm">{memory.content}</p>
                        {memory.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {memory.tags.map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  {idx < displayMemories.length - 1 && <Separator className="my-3" />}
                </div>
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="text-center py-8 text-sm text-muted-foreground">
            {searchTerm.length > 2 ? "No memories found" : "No memories yet"}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
