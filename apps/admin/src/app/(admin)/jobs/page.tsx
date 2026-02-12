"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Building2, Plus, ExternalLink, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";

const statuses = ["discovered", "researching", "applying", "applied", "interviewing", "offer", "rejected", "withdrawn"] as const;
const statusColors: Record<string, string> = {
  discovered: "secondary", researching: "secondary", applying: "default", applied: "default",
  interviewing: "default", offer: "default", rejected: "destructive", withdrawn: "destructive",
};
const statusEmoji: Record<string, string> = {
  discovered: "🔍", researching: "📚", applying: "✍️", applied: "📨",
  interviewing: "🎤", offer: "🎉", rejected: "❌", withdrawn: "🚪",
};

export default function JobsPage() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ company: "", position: "", url: "", salary: "", location: "", notes: "" });

  const jobs = useQuery(api.job_applications.list, statusFilter !== "all" ? { status: statusFilter as any } : {});
  const createJob = useMutation(api.job_applications.create);
  const updateJob = useMutation(api.job_applications.update);
  const removeJob = useMutation(api.job_applications.remove);

  const handleCreate = async () => {
    if (!form.company || !form.position) return;
    await createJob({
      company: form.company, position: form.position,
      url: form.url || undefined, salary: form.salary || undefined,
      location: form.location || undefined, notes: form.notes || undefined,
    });
    setForm({ company: "", position: "", url: "", salary: "", location: "", notes: "" });
    setShowAdd(false);
  };

  // Pipeline summary
  const pipeline = statuses.map((s) => ({ status: s, count: jobs?.filter((j) => j.status === s).length ?? 0 }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold flex items-center gap-2"><Building2 className="h-8 w-8" /> Job Applications</h1>
        <Dialog open={showAdd} onOpenChange={setShowAdd}>
          <DialogTrigger asChild><Button><Plus className="mr-2 h-4 w-4" />Add Application</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>New Job Application</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <Input placeholder="Company" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
              <Input placeholder="Position" value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} />
              <Input placeholder="URL" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} />
              <div className="flex gap-2">
                <Input placeholder="Salary" value={form.salary} onChange={(e) => setForm({ ...form, salary: e.target.value })} />
                <Input placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
              </div>
              <Textarea placeholder="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
              <Button onClick={handleCreate} className="w-full">Add Application</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Pipeline */}
      <div className="flex gap-2 flex-wrap">
        {pipeline.map((p) => (
          <Card key={p.status} className="flex-1 min-w-[100px] cursor-pointer" onClick={() => setStatusFilter(p.status === statusFilter ? "all" : p.status)}>
            <CardContent className="py-3 text-center">
              <div className="text-lg">{statusEmoji[p.status]}</div>
              <div className="text-xl font-bold">{p.count}</div>
              <div className="text-xs text-muted-foreground capitalize">{p.status}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex gap-4">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {statuses.map((s) => <SelectItem key={s} value={s}>{statusEmoji[s]} {s}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="py-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Salary</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Next Action</TableHead>
                <TableHead>Added</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {jobs?.map((job) => (
                <TableRow key={job._id}>
                  <TableCell className="font-medium">
                    {job.company}
                    {job.url && <a href={job.url} target="_blank" rel="noopener" className="ml-1 inline-block"><ExternalLink className="h-3 w-3" /></a>}
                  </TableCell>
                  <TableCell>{job.position}</TableCell>
                  <TableCell>
                    <Select value={job.status} onValueChange={(v) => updateJob({ id: job._id, status: v as any })}>
                      <SelectTrigger className="w-36 h-8"><SelectValue /></SelectTrigger>
                      <SelectContent>{statuses.map((s) => <SelectItem key={s} value={s}>{statusEmoji[s]} {s}</SelectItem>)}</SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-sm">{job.salary ?? "—"}</TableCell>
                  <TableCell className="text-sm">{job.location ?? "—"} {job.remote && "🌍"}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{job.nextAction ?? "—"}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{format(new Date(job.createdAt), "MMM d")}</TableCell>
                  <TableCell>
                    <Button size="sm" variant="ghost" onClick={() => removeJob({ id: job._id })}><Trash2 className="h-4 w-4" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
