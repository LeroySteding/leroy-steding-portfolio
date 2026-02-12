"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Edit, Trash2, Briefcase } from "lucide-react";
import Link from "next/link";
import { format, parseISO } from "date-fns";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { EmptyState } from "@/components/empty-state";
import { Award } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";

export default function ExperienceListPage() {
  const router = useRouter();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const experiences = useQuery(api.experiences.list, {});
  const deleteExperience = useMutation(api.experiences.remove);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteExperience({ id: deleteId as any });
      toast({
        title: "Success",
        description: "Experience deleted successfully",
      });
      setDeleteId(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete experience",
        variant: "destructive",
      });
    }
  };

  if (!experiences) {
    return <div>Loading...</div>;
  }

  if (experiences.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Experience</h1>
          <Button asChild>
            <Link href="/experience/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Experience
            </Link>
          </Button>
        </div>
        <EmptyState
          icon={Award}
          title="No experience entries yet"
          description="Add your work experience and education history"
          action={{
            label: "Add Experience",
            onClick: () => router.push("/experience/new"),
          }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Experience</h1>
        <Button asChild>
          <Link href="/experience/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Experience
          </Link>
        </Button>
      </div>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border" />

        <div className="space-y-6">
          {experiences.map((exp) => (
            <div key={exp._id} className="relative flex gap-6">
              {/* Timeline dot */}
              <div className="relative flex-shrink-0">
                <div className="w-16 h-16 rounded-full bg-background border-4 border-primary flex items-center justify-center">
                  {exp.type === "work" ? (
                    <Briefcase className="h-6 w-6" />
                  ) : (
                    <Award className="h-6 w-6" />
                  )}
                </div>
              </div>

              {/* Content */}
              <Card className="flex-1 group">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-xl font-semibold">{exp.title}</h3>
                      <p className="text-lg text-muted-foreground">{exp.company}</p>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/experience/${exp._id}/edit`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setDeleteId(exp._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <Badge
                      variant={exp.type === "work" ? "default" : "secondary"}
                    >
                      {exp.type}
                    </Badge>
                    <Badge variant="outline">
                      {exp.locale === "en" ? "🇬🇧 EN" : "🇳🇱 NL"}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {format(parseISO(exp.startDate), "MMM yyyy")} -{" "}
                      {exp.endDate
                        ? format(parseISO(exp.endDate), "MMM yyyy")
                        : "Present"}
                    </span>
                  </div>

                  {exp.description && (
                    <p className="text-sm text-muted-foreground">
                      {exp.description}
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete experience?"
        description="This action cannot be undone. The experience entry will be permanently deleted."
      />
    </div>
  );
}
