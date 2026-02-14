"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Lightbulb } from "lucide-react";
import Link from "next/link";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { EmptyState } from "@/components/empty-state";
import { toast } from "@/components/ui/use-toast";

interface SkillFormData {
  name: string;
  category: string;
  proficiency: number;
  icon?: string;
}

export default function SkillsPage() {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editingSkill, setEditingSkill] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const skills = useQuery(api.skills.list, {});
  const createSkill = useMutation(api.skills.create);
  const updateSkill = useMutation(api.skills.update);
  const deleteSkill = useMutation(api.skills.remove);

  const [formData, setFormData] = useState<SkillFormData>({
    name: "",
    category: "",
    proficiency: 50,
    icon: "",
  });

  const handleOpenDialog = (skill?: any) => {
    if (skill) {
      setEditingSkill(skill);
      setFormData({
        name: skill.name,
        category: skill.category,
        proficiency: skill.proficiency,
        icon: skill.icon || "",
      });
    } else {
      setEditingSkill(null);
      setFormData({
        name: "",
        category: "",
        proficiency: 50,
        icon: "",
      });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingSkill) {
        await updateSkill({
          id: editingSkill._id,
          name: formData.name,
          category: formData.category,
          proficiency: formData.proficiency,
          icon: formData.icon || undefined,
        });
        toast({
          title: "Success",
          description: "Skill updated successfully",
        });
      } else {
        await createSkill({
          name: formData.name,
          category: formData.category,
          proficiency: formData.proficiency,
          icon: formData.icon || undefined,
          published: true,
        });
        toast({
          title: "Success",
          description: "Skill created successfully",
        });
      }
      setIsDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${editingSkill ? "update" : "create"} skill`,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteSkill({ id: deleteId as any });
      toast({
        title: "Success",
        description: "Skill deleted successfully",
      });
      setDeleteId(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete skill",
        variant: "destructive",
      });
    }
  };

  if (!skills) {
    return <div>Loading...</div>;
  }

  // Group skills by category
  const groupedSkills = skills.reduce((acc: any, skill: any) => {
    const category = skill.category || "Other";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(skill);
    return acc;
  }, {});

  if (skills.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Skills</h1>
          <Button onClick={() => handleOpenDialog()}>
            <Plus className="mr-2 h-4 w-4" />
            Add Skill
          </Button>
        </div>
        <EmptyState
          icon={Lightbulb}
          title="No skills yet"
          description="Add your technical skills and expertise"
          action={{
            label: "Add Skill",
            onClick: () => handleOpenDialog(),
          }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Skills</h1>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="mr-2 h-4 w-4" />
          Add Skill
        </Button>
      </div>

      <div className="space-y-6">
        {Object.entries(groupedSkills).map(([category, categorySkills]: [string, any]) => (
          <Card key={category}>
            <CardHeader>
              <CardTitle>{category}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {categorySkills.map((skill: any) => (
                  <div
                    key={skill._id}
                    className="flex items-center justify-between p-3 rounded-lg border group hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Link href={`/skills/${skill._id}`} className="font-medium hover:underline">{skill.name}</Link>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary transition-all"
                            style={{ width: `${skill.proficiency}%` }}
                          />
                        </div>
                        <span className="text-sm text-muted-foreground min-w-[3ch]">
                          {skill.proficiency}%
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-1 ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleOpenDialog(skill)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setDeleteId(skill._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>
                {editingSkill ? "Edit Skill" : "Add Skill"}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Name *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g., React"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Category *</Label>
                <Input
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  placeholder="e.g., Frontend, Backend, Tools"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Proficiency: {formData.proficiency}%</Label>
                <Slider
                  value={[formData.proficiency]}
                  onValueChange={([value]: number[]) =>
                    setFormData({ ...formData, proficiency: value })
                  }
                  min={0}
                  max={100}
                  step={5}
                />
              </div>

              <div className="space-y-2">
                <Label>Icon (Lucide name)</Label>
                <Input
                  value={formData.icon}
                  onChange={(e) =>
                    setFormData({ ...formData, icon: e.target.value })
                  }
                  placeholder="e.g., Code, Database, Globe"
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                {editingSkill ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete skill?"
        description="This action cannot be undone. The skill will be permanently deleted."
      />
    </div>
  );
}
