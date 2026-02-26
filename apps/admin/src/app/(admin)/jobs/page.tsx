"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ExternalLink, MapPin, DollarSign, Building2, Plus } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

type JobStatus = "discovered" | "researching" | "applying" | "applied" | "interviewing" | "offer" | "rejected" | "withdrawn";

const STATUS_COLUMNS: { status: JobStatus; label: string; color: string }[] = [
  { status: "discovered", label: "Discovered", color: "bg-slate-100" },
  { status: "researching", label: "Researching", color: "bg-blue-100" },
  { status: "applying", label: "Applying", color: "bg-indigo-100" },
  { status: "applied", label: "Applied", color: "bg-purple-100" },
  { status: "interviewing", label: "Interviewing", color: "bg-orange-100" },
  { status: "offer", label: "Offer", color: "bg-green-100" },
  { status: "rejected", label: "Rejected", color: "bg-red-100" },
  { status: "withdrawn", label: "Withdrawn", color: "bg-gray-100" },
];

export default function JobsPage() {
  const jobs = useQuery(api.jobs.list);
  const updateStatus = useMutation(api.jobs.updateStatus);
  const createJob = useMutation(api.jobs.create);
  const [isAddingJob, setIsAddingJob] = useState(false);

  if (!jobs) {
    return (
      <div className="container py-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4" />
          <div className="grid grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-64 bg-muted rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const handleStatusChange = async (jobId: Id<"job_applications">, newStatus: JobStatus) => {
    try {
      await updateStatus({ id: jobId, status: newStatus });
    } catch (error) {
      console.error("Failed to update job status:", error);
    }
  };

  const handleCreateJob = async (data: any) => {
    try {
      await createJob(data);
      setIsAddingJob(false);
    } catch (error) {
      console.error("Failed to create job:", error);
    }
  };

  const jobsByStatus = STATUS_COLUMNS.map((column) => ({
    ...column,
    jobs: jobs.filter((job: any) => job.status === column.status),
  }));

  const stats = {
    discovered: jobs.filter((j: any) => j.status === "discovered" && j.createdAt > Date.now() - 7 * 24 * 60 * 60 * 1000).length,
    active: jobs.filter((j: any) => ["researching", "applying", "applied", "interviewing"].includes(j.status)).length,
    offers: jobs.filter((j: any) => j.status === "offer").length,
  };

  return (
    <div className="container py-6 space-y-6">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Job Opportunities</h1>
          <p className="text-muted-foreground mt-1">
            {stats.discovered} new this week • {stats.active} active • {stats.offers} offers
          </p>
        </div>
        <Dialog open={isAddingJob} onOpenChange={setIsAddingJob}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Job
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Job Opportunity</DialogTitle>
              <DialogDescription>
                Manually add a job opportunity to track
              </DialogDescription>
            </DialogHeader>
            <AddJobForm onSubmit={handleCreateJob} onCancel={() => setIsAddingJob(false)} />
          </DialogContent>
        </Dialog>
      </header>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        {jobsByStatus.map((column) => (
          <div key={column.status} className="space-y-3">
            <div className={`${column.color} rounded-lg p-3`}>
              <h3 className="font-semibold text-sm">{column.label}</h3>
              <p className="text-xs text-muted-foreground">{column.jobs.length} jobs</p>
            </div>
            <div className="space-y-3">
              {column.jobs.length === 0 ? (
                <Card className="border-dashed">
                  <CardContent className="py-6 text-center">
                    <p className="text-xs text-muted-foreground">No jobs</p>
                  </CardContent>
                </Card>
              ) : (
                column.jobs.map((job: any) => (
                  <JobCard
                    key={job._id}
                    job={job}
                    onStatusChange={handleStatusChange}
                    availableStatuses={STATUS_COLUMNS}
                  />
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function JobCard({
  job,
  onStatusChange,
  availableStatuses,
}: {
  job: any;
  onStatusChange: (id: Id<"job_applications">, status: JobStatus) => void;
  availableStatuses: typeof STATUS_COLUMNS;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setIsOpen(true)}>
        <CardHeader className="p-4">
          <CardTitle className="text-sm font-semibold">{job.position}</CardTitle>
          <CardDescription className="flex items-center gap-1 text-xs">
            <Building2 className="h-3 w-3" />
            {job.company}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 pt-0 space-y-2">
          {job.salary && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <DollarSign className="h-3 w-3" />
              {job.salary}
            </div>
          )}
          {job.location && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />
              {job.location}
              {job.remote && <Badge variant="secondary" className="ml-1 text-xs">Remote</Badge>}
            </div>
          )}
          {job.tags && job.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {job.tags.slice(0, 3).map((tag: string) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
          <p className="text-xs text-muted-foreground">
            {formatDistanceToNow(job.createdAt, { addSuffix: true })}
          </p>
        </CardContent>
      </Card>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{job.position}</DialogTitle>
            <DialogDescription>{job.company}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs text-muted-foreground">Location</Label>
                <p className="text-sm">{job.location || "Not specified"}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Salary</Label>
                <p className="text-sm">{job.salary || "Not specified"}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Remote</Label>
                <p className="text-sm">{job.remote ? "Yes" : "No"}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Status</Label>
                <select
                  className="text-sm border rounded px-2 py-1"
                  value={job.status}
                  onChange={(e) => onStatusChange(job._id, e.target.value as JobStatus)}
                >
                  {availableStatuses.map((status) => (
                    <option key={status.status} value={status.status}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {job.notes && (
              <div>
                <Label className="text-xs text-muted-foreground">Notes</Label>
                <p className="text-sm whitespace-pre-wrap">{job.notes}</p>
              </div>
            )}
            {job.tags && job.tags.length > 0 && (
              <div>
                <Label className="text-xs text-muted-foreground">Tags</Label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {job.tags.map((tag: string) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {job.url && (
              <Button variant="outline" onClick={() => window.open(job.url, "_blank")} className="w-full">
                <ExternalLink className="h-4 w-4 mr-2" />
                View Job Posting
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function AddJobForm({ onSubmit, onCancel }: { onSubmit: (data: any) => void; onCancel: () => void }) {
  const [formData, setFormData] = useState({
    company: "",
    position: "",
    url: "",
    salary: "",
    location: "",
    remote: false,
    status: "discovered" as JobStatus,
    notes: "",
    tags: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      tags: formData.tags.split(",").map((t) => t.trim()).filter(Boolean),
      createdAt: Date.now(),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="company">Company *</Label>
        <Input
          id="company"
          value={formData.company}
          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
          required
        />
      </div>
      <div>
        <Label htmlFor="position">Position *</Label>
        <Input
          id="position"
          value={formData.position}
          onChange={(e) => setFormData({ ...formData, position: e.target.value })}
          required
        />
      </div>
      <div>
        <Label htmlFor="url">Job Posting URL</Label>
        <Input
          id="url"
          type="url"
          value={formData.url}
          onChange={(e) => setFormData({ ...formData, url: e.target.value })}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="salary">Salary</Label>
          <Input
            id="salary"
            value={formData.salary}
            onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
            placeholder="€60k - €80k"
          />
        </div>
        <div>
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            placeholder="Amsterdam"
          />
        </div>
      </div>
      <div>
        <Label htmlFor="tags">Tags (comma-separated)</Label>
        <Input
          id="tags"
          value={formData.tags}
          onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
          placeholder="React, TypeScript, Remote"
        />
      </div>
      <div>
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          rows={3}
        />
      </div>
      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Add Job</Button>
      </div>
    </form>
  );
}
