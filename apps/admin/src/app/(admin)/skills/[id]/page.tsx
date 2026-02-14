"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Save, Trash2 } from "lucide-react";
import Link from "next/link";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { toast } from "@/components/ui/use-toast";

export default function SkillDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const skill = useQuery(api.skills.get, { id: params.id as any });
  const updateSkill = useMutation(api.skills.update);
  const deleteSkill = useMutation(api.skills.remove);

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [proficiency, setProficiency] = useState(50);
  const [icon, setIcon] = useState("");
  const [iconUrl, setIconUrl] = useState("");
  const [color, setColor] = useState("");
  const [yearsOfExperience, setYearsOfExperience] = useState<string>("");
  const [order, setOrder] = useState<string>("");
  const [locale, setLocale] = useState<string>("");
  const [published, setPublished] = useState(true);
  const [showDelete, setShowDelete] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (skill) {
      setName(skill.name);
      setCategory(skill.category);
      setProficiency(skill.proficiency);
      setIcon(skill.icon || "");
      setIconUrl(skill.iconUrl || "");
      setColor(skill.color || "");
      setYearsOfExperience(skill.yearsOfExperience?.toString() || "");
      setOrder(skill.order?.toString() || "");
      setLocale(skill.locale || "");
      setPublished(skill.published ?? true);
    }
  }, [skill]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await updateSkill({
        id: params.id as any,
        name,
        category,
        proficiency,
        icon: icon || undefined,
        iconUrl: iconUrl || undefined,
        color: color || undefined,
        yearsOfExperience: yearsOfExperience ? Number(yearsOfExperience) : undefined,
        order: order ? Number(order) : undefined,
        locale: locale === "en" || locale === "nl" ? locale : undefined,
        published,
      });
      toast({ title: "Success", description: "Skill updated successfully" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to update skill", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteSkill({ id: params.id as any });
      toast({ title: "Success", description: "Skill deleted successfully" });
      router.push("/skills");
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete skill", variant: "destructive" });
    }
  };

  if (skill === undefined) return <div>Loading...</div>;
  if (skill === null) return <div>Skill not found</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/skills"><ArrowLeft className="h-4 w-4 mr-1" />Back</Link>
          </Button>
          <h1 className="text-3xl font-bold">{skill.name}</h1>
        </div>
        <Button variant="destructive" size="sm" onClick={() => setShowDelete(true)}>
          <Trash2 className="h-4 w-4 mr-1" />Delete
        </Button>
      </div>

      <form onSubmit={handleSave}>
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader><CardTitle>Details</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Input value={category} onChange={(e) => setCategory(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>Proficiency: {proficiency}%</Label>
                <Slider value={[proficiency]} onValueChange={([v]) => setProficiency(v)} min={1} max={100} step={1} />
                <div className="h-3 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-primary transition-all" style={{ width: `${proficiency}%` }} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Years of Experience</Label>
                <Input type="number" value={yearsOfExperience} onChange={(e) => setYearsOfExperience(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Order</Label>
                <Input type="number" value={order} onChange={(e) => setOrder(e.target.value)} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Appearance & Settings</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Icon (Lucide name)</Label>
                <Input value={icon} onChange={(e) => setIcon(e.target.value)} placeholder="e.g., Code" />
              </div>
              <div className="space-y-2">
                <Label>Icon URL</Label>
                <Input value={iconUrl} onChange={(e) => setIconUrl(e.target.value)} placeholder="https://..." />
              </div>
              <div className="space-y-2">
                <Label>Color</Label>
                <div className="flex gap-2 items-center">
                  <Input value={color} onChange={(e) => setColor(e.target.value)} placeholder="#3b82f6" />
                  {color && (
                    <div
                      className="w-10 h-10 rounded-md border flex-shrink-0"
                      style={{ backgroundColor: color }}
                    />
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Locale</Label>
                <Select value={locale || "none"} onValueChange={(v) => setLocale(v === "none" ? "" : v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="en">🇬🇧 English</SelectItem>
                    <SelectItem value="nl">🇳🇱 Dutch</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={published} onCheckedChange={setPublished} />
                <Label>Published</Label>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end mt-6">
          <Button type="submit" disabled={isSubmitting}>
            <Save className="h-4 w-4 mr-1" />
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>

      <ConfirmDialog
        open={showDelete}
        onOpenChange={setShowDelete}
        onConfirm={handleDelete}
        title="Delete skill?"
        description="This action cannot be undone. The skill will be permanently deleted."
      />
    </div>
  );
}
