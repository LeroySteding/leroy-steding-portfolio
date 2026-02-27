"use client";

import { useState, useMemo } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import type { Id } from "../../../../../convex/_generated/dataModel";
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  ExternalLink, MapPin, DollarSign, Building2, Plus, 
  TrendingUp, TrendingDown, Clock, CheckCircle2, XCircle, 
  Calendar, BarChart3, Filter, Eye
} from "lucide-react";
import { formatDistanceToNow, differenceInDays, format, subDays, startOfDay, endOfDay } from "date-fns";

type JobStatus = "discovered" | "researching" | "applying" | "applied" | "interviewing" | "offer" | "rejected" | "withdrawn";

// Simplified 4-column Kanban as requested
const STATUS_COLUMNS = [
  { 
    id: "applied", 
    label: "Applied", 
    statuses: ["discovered", "researching", "applying", "applied"] as JobStatus[],
    color: "bg-blue-50 border-blue-200",
    icon: Clock,
    iconColor: "text-blue-600"
  },
  { 
    id: "interviewing", 
    label: "Interviewing", 
    statuses: ["interviewing"] as JobStatus[],
    color: "bg-purple-50 border-purple-200",
    icon: TrendingUp,
    iconColor: "text-purple-600"
  },
  { 
    id: "offer", 
    label: "Offer", 
    statuses: ["offer"] as JobStatus[],
    color: "bg-green-50 border-green-200",
    icon: CheckCircle2,
    iconColor: "text-green-600"
  },
  { 
    id: "rejected", 
    label: "Rejected", 
    statuses: ["rejected", "withdrawn"] as JobStatus[],
    color: "bg-red-50 border-red-200",
    icon: XCircle,
    iconColor: "text-red-600"
  },
] as const;

type DateRange = "7d" | "30d" | "90d" | "all";

export default function JobsPage() {
  const jobs = useQuery(api.jobs.list);
  const updateStatus = useMutation(api.jobs.updateStatus);
  const createJob = useMutation(api.jobs.create);
  
  const [isAddingJob, setIsAddingJob] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange>("30d");
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [showAnalytics, setShowAnalytics] = useState(true);

  // Date range filtering
  const filteredJobs = useMemo(() => {
    if (!jobs) return [];
    
    const now = Date.now();
    const cutoffDate = dateRange === "all" ? 0 : 
      dateRange === "7d" ? subDays(now, 7).getTime() :
      dateRange === "30d" ? subDays(now, 30).getTime() :
      subDays(now, 90).getTime();
    
    return jobs.filter(job => job.createdAt >= cutoffDate);
  }, [jobs, dateRange]);

  // Analytics calculations
  const analytics = useMemo(() => {
    if (!filteredJobs.length) {
      return {
        total: 0,
        applied: 0,
        interviewing: 0,
        offers: 0,
        rejected: 0,
        successRate: 0,
        responseRate: 0,
        avgResponseTime: 0,
        trending: {
          applied: 0,
          interviewing: 0,
          offers: 0,
        }
      };
    }

    const total = filteredJobs.length;
    const applied = filteredJobs.filter(j => STATUS_COLUMNS[0].statuses.includes(j.status)).length;
    const interviewing = filteredJobs.filter(j => j.status === "interviewing").length;
    const offers = filteredJobs.filter(j => j.status === "offer").length;
    const rejected = filteredJobs.filter(j => ["rejected", "withdrawn"].includes(j.status)).length;

    // Success rate: offers / (offers + rejected)
    const concluded = offers + rejected;
    const successRate = concluded > 0 ? (offers / concluded) * 100 : 0;

    // Response rate: (interviewing + offers + rejected) / applied
    const responded = interviewing + offers + rejected;
    const responseRate = applied > 0 ? (responded / applied) * 100 : 0;

    // Average response time: time from appliedAt to first status change
    const jobsWithResponse = filteredJobs.filter(j => 
      j.appliedAt && ["interviewing", "offer", "rejected"].includes(j.status)
    );
    const avgResponseTime = jobsWithResponse.length > 0
      ? jobsWithResponse.reduce((sum, j) => sum + differenceInDays(j._creationTime, j.appliedAt!), 0) / jobsWithResponse.length
      : 0;

    // Trending: compare last 7 days vs previous 7 days
    const now = Date.now();
    const last7Days = subDays(now, 7).getTime();
    const prev7Days = subDays(now, 14).getTime();

    const recentApplied = filteredJobs.filter(j => j.createdAt >= last7Days && STATUS_COLUMNS[0].statuses.includes(j.status)).length;
    const prevApplied = filteredJobs.filter(j => j.createdAt >= prev7Days && j.createdAt < last7Days && STATUS_COLUMNS[0].statuses.includes(j.status)).length;

    const recentInterviewing = filteredJobs.filter(j => j.createdAt >= last7Days && j.status === "interviewing").length;
    const prevInterviewing = filteredJobs.filter(j => j.createdAt >= prev7Days && j.createdAt < last7Days && j.status === "interviewing").length;

    const recentOffers = filteredJobs.filter(j => j.createdAt >= last7Days && j.status === "offer").length;
    const prevOffers = filteredJobs.filter(j => j.createdAt >= prev7Days && j.createdAt < last7Days && j.status === "offer").length;

    return {
      total,
      applied,
      interviewing,
      offers,
      rejected,
      successRate,
      responseRate,
      avgResponseTime,
      trending: {
        applied: prevApplied > 0 ? ((recentApplied - prevApplied) / prevApplied) * 100 : 0,
        interviewing: prevInterviewing > 0 ? ((recentInterviewing - prevInterviewing) / prevInterviewing) * 100 : 0,
        offers: prevOffers > 0 ? ((recentOffers - prevOffers) / prevOffers) * 100 : 0,
      }
    };
  }, [filteredJobs]);

  // Group jobs by column
  const jobsByColumn = useMemo(() => {
    return STATUS_COLUMNS.map(column => ({
      ...column,
      jobs: filteredJobs.filter(job => column.statuses.includes(job.status))
    }));
  }, [filteredJobs]);

  if (!jobs) {
    return (
      <div className="container py-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4" />
          <div className="grid grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-64 bg-muted rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const handleDragEnd = async (result: DropResult) => {
    const { destination, draggableId } = result;
    
    if (!destination) return;
    
    const targetColumn = STATUS_COLUMNS.find(col => col.id === destination.droppableId);
    if (!targetColumn) return;

    // Map column to actual status (use first status in the column for simplicity)
    const newStatus = targetColumn.statuses[0];
    
    try {
      await updateStatus({ 
        id: draggableId as Id<"job_applications">, 
        status: newStatus 
      });
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

  return (
    <div className="container py-6 space-y-6">
      {/* Header */}
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Job Applications</h1>
          <p className="text-muted-foreground mt-1">
            Track and manage your job search pipeline
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={dateRange} onValueChange={(v) => setDateRange(v as DateRange)}>
            <SelectTrigger className="w-[140px]">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="all">All time</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => setShowAnalytics(!showAnalytics)}
          >
            <BarChart3 className="h-4 w-4" />
          </Button>
          <Dialog open={isAddingJob} onOpenChange={setIsAddingJob}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Job
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Job Application</DialogTitle>
                <DialogDescription>
                  Manually track a new job application
                </DialogDescription>
              </DialogHeader>
              <AddJobForm onSubmit={handleCreateJob} onCancel={() => setIsAddingJob(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </header>

      {/* Analytics Panel */}
      {showAnalytics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription>Total Applications</CardDescription>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.total}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {analytics.applied} active applications
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription>Success Rate</CardDescription>
                {analytics.successRate > 50 ? (
                  <TrendingUp className="h-4 w-4 text-green-600" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-600" />
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {analytics.successRate.toFixed(1)}%
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {analytics.offers} offers / {analytics.offers + analytics.rejected} concluded
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription>Response Rate</CardDescription>
                <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {analytics.responseRate.toFixed(1)}%
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Companies that responded
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription>Avg Response Time</CardDescription>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {analytics.avgResponseTime > 0 ? `${Math.round(analytics.avgResponseTime)}d` : "—"}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Time to first response
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Kanban Board */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {jobsByColumn.map((column) => (
            <div key={column.id} className="space-y-3">
              {/* Column Header */}
              <div className={`${column.color} rounded-lg p-4 border-2`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <column.icon className={`h-5 w-5 ${column.iconColor}`} />
                    <h3 className="font-semibold">{column.label}</h3>
                  </div>
                  <Badge variant="secondary" className="font-mono">
                    {column.jobs.length}
                  </Badge>
                </div>
                {/* Trending indicator */}
                {column.id !== "rejected" && analytics.trending[column.id as keyof typeof analytics.trending] !== 0 && (
                  <div className="flex items-center gap-1 mt-2 text-xs">
                    {analytics.trending[column.id as keyof typeof analytics.trending] > 0 ? (
                      <>
                        <TrendingUp className="h-3 w-3 text-green-600" />
                        <span className="text-green-600 font-medium">
                          +{analytics.trending[column.id as keyof typeof analytics.trending].toFixed(0)}%
                        </span>
                      </>
                    ) : (
                      <>
                        <TrendingDown className="h-3 w-3 text-red-600" />
                        <span className="text-red-600 font-medium">
                          {analytics.trending[column.id as keyof typeof analytics.trending].toFixed(0)}%
                        </span>
                      </>
                    )}
                    <span className="text-muted-foreground">vs last week</span>
                  </div>
                )}
              </div>

              {/* Droppable Area */}
              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`space-y-3 min-h-[200px] rounded-lg p-2 transition-colors ${
                      snapshot.isDraggingOver ? "bg-muted/50" : ""
                    }`}
                  >
                    {column.jobs.length === 0 ? (
                      <Card className="border-dashed">
                        <CardContent className="py-8 text-center">
                          <p className="text-sm text-muted-foreground">
                            No applications
                          </p>
                        </CardContent>
                      </Card>
                    ) : (
                      column.jobs.map((job, index) => (
                        <Draggable key={job._id} draggableId={job._id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={snapshot.isDragging ? "opacity-50" : ""}
                            >
                              <JobCard
                                job={job}
                                onClick={() => setSelectedJob(job)}
                              />
                            </div>
                          )}
                        </Draggable>
                      ))
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>

      {/* Job Detail Dialog */}
      {selectedJob && (
        <JobDetailDialog
          job={selectedJob}
          isOpen={!!selectedJob}
          onClose={() => setSelectedJob(null)}
          onStatusChange={updateStatus}
        />
      )}
    </div>
  );
}

function JobCard({ job, onClick }: { job: any; onClick: () => void }) {
  return (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-all hover:scale-[1.02] active:scale-95" 
      onClick={onClick}
    >
      <CardHeader className="p-4">
        <CardTitle className="text-sm font-semibold line-clamp-2">
          {job.position}
        </CardTitle>
        <CardDescription className="flex items-center gap-1 text-xs mt-1">
          <Building2 className="h-3 w-3 flex-shrink-0" />
          <span className="line-clamp-1">{job.company}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0 space-y-2">
        {job.salary && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <DollarSign className="h-3 w-3 flex-shrink-0" />
            <span className="line-clamp-1">{job.salary}</span>
          </div>
        )}
        {job.location && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3 flex-shrink-0" />
            <span className="line-clamp-1">{job.location}</span>
            {job.remote && (
              <Badge variant="secondary" className="ml-auto text-xs py-0">
                Remote
              </Badge>
            )}
          </div>
        )}
        {job.tags && job.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {job.tags.slice(0, 2).map((tag: string) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {job.tags.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{job.tags.length - 2}
              </Badge>
            )}
          </div>
        )}
        <p className="text-xs text-muted-foreground pt-1 border-t">
          {formatDistanceToNow(job.createdAt, { addSuffix: true })}
        </p>
      </CardContent>
    </Card>
  );
}

function JobDetailDialog({ 
  job, 
  isOpen, 
  onClose, 
  onStatusChange 
}: { 
  job: any; 
  isOpen: boolean; 
  onClose: () => void;
  onStatusChange: (args: { id: Id<"job_applications">; status: JobStatus }) => Promise<void>;
}) {
  const [status, setStatus] = useState(job.status);

  const handleStatusChange = async (newStatus: JobStatus) => {
    try {
      await onStatusChange({ id: job._id, status: newStatus });
      setStatus(newStatus);
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{job.position}</DialogTitle>
          <DialogDescription>{job.company}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {/* Status */}
          <div>
            <Label className="text-sm font-medium">Status</Label>
            <Select value={status} onValueChange={handleStatusChange}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="discovered">Discovered</SelectItem>
                <SelectItem value="researching">Researching</SelectItem>
                <SelectItem value="applying">Applying</SelectItem>
                <SelectItem value="applied">Applied</SelectItem>
                <SelectItem value="interviewing">Interviewing</SelectItem>
                <SelectItem value="offer">Offer</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="withdrawn">Withdrawn</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-xs text-muted-foreground">Location</Label>
              <p className="text-sm mt-1">{job.location || "Not specified"}</p>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Salary</Label>
              <p className="text-sm mt-1">{job.salary || "Not specified"}</p>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Remote</Label>
              <p className="text-sm mt-1">{job.remote ? "Yes" : "No"}</p>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Added</Label>
              <p className="text-sm mt-1">
                {format(job.createdAt, "MMM d, yyyy")}
              </p>
            </div>
            {job.appliedAt && (
              <div>
                <Label className="text-xs text-muted-foreground">Applied</Label>
                <p className="text-sm mt-1">
                  {format(job.appliedAt, "MMM d, yyyy")}
                </p>
              </div>
            )}
            {job.nextActionDate && (
              <div>
                <Label className="text-xs text-muted-foreground">Next Action</Label>
                <p className="text-sm mt-1">
                  {format(job.nextActionDate, "MMM d, yyyy")}
                </p>
              </div>
            )}
          </div>

          {/* Notes */}
          {job.notes && (
            <div>
              <Label className="text-sm font-medium">Notes</Label>
              <p className="text-sm mt-1 whitespace-pre-wrap">{job.notes}</p>
            </div>
          )}

          {/* Next Action */}
          {job.nextAction && (
            <div>
              <Label className="text-sm font-medium">Next Action</Label>
              <p className="text-sm mt-1">{job.nextAction}</p>
            </div>
          )}

          {/* Tags */}
          {job.tags && job.tags.length > 0 && (
            <div>
              <Label className="text-sm font-medium">Tags</Label>
              <div className="flex flex-wrap gap-2 mt-1">
                {job.tags.map((tag: string) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Contacts */}
          {job.contacts && job.contacts.length > 0 && (
            <div>
              <Label className="text-sm font-medium">Contacts</Label>
              <div className="space-y-2 mt-1">
                {job.contacts.map((contact: any, i: number) => (
                  <div key={i} className="text-sm border rounded-lg p-3">
                    <p className="font-medium">{contact.name}</p>
                    {contact.role && (
                      <p className="text-muted-foreground text-xs">{contact.role}</p>
                    )}
                    {contact.linkedin && (
                      <a 
                        href={contact.linkedin} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:underline flex items-center gap-1 mt-1"
                      >
                        <ExternalLink className="h-3 w-3" />
                        LinkedIn
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-4 border-t">
            {job.url && (
              <Button 
                variant="outline" 
                onClick={() => window.open(job.url, "_blank")} 
                className="flex-1"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                View Posting
              </Button>
            )}
            <Button onClick={onClose} className="flex-1">
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function AddJobForm({ 
  onSubmit, 
  onCancel 
}: { 
  onSubmit: (data: any) => void; 
  onCancel: () => void;
}) {
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
          placeholder="https://..."
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
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="remote"
          checked={formData.remote}
          onChange={(e) => setFormData({ ...formData, remote: e.target.checked })}
          className="h-4 w-4"
        />
        <Label htmlFor="remote" className="cursor-pointer">
          Remote position
        </Label>
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
          placeholder="Any additional details..."
        />
      </div>
      <div className="flex gap-2 justify-end pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Add Application</Button>
      </div>
    </form>
  );
}
