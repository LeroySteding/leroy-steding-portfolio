"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import type { Id } from "../../../../../convex/_generated/dataModel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TagInput } from "@/components/tag-input";
import { toast } from "@/components/ui/use-toast";
import { ArrowLeft, Pencil, Save, X, ExternalLink, Plus, Trash2, AlertCircle, Linkedin } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

const statuses = ["discovered", "researching", "applying", "applied", "interviewing", "offer", "rejected", "withdrawn"] as const;
const statusEmoji: Record<string, string> = {
  discovered: "🔍", researching: "📚", applying: "✍️", applied: "📨",
  interviewing: "🎤", offer: "🎉", rejected: "❌", withdrawn: "🚪",
};

type Contact = { name: string; role?: string; linkedin?: string };

export default function JobDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const job = useQuery(api.job_applications.get, { id: params.id as Id<"job_applications"> });
  const updateJob = useMutation(api.job_applications.update);

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    company: "", position: "", url: "", status: "" as string, salary: "", location: "",
    remote: false, notes: "", tags: [] as string[], nextAction: "", nextActionDate: "",
    contacts: [] as Contact[],
  });

  useEffect(() => {
    if (job) {
      setForm({
        company: job.company ?? "", position: job.position ?? "", url: job.url ?? "",
        status: job.status, salary: job.salary ?? "", location: job.location ?? "",
        remote: job.remote ?? false, notes: job.notes ?? "", tags: job.tags ?? [],
        nextAction: job.nextAction ?? "",
        nextActionDate: job.nextActionDate ? format(new Date(job.nextActionDate), "yyyy-MM-dd") : "",
        contacts: job.contacts ?? [],
      });
    }
  }, [job]);

  const handleSave = async () => {
    try {
      await updateJob({
        id: params.id as Id<"job_applications">,
        company: form.company, position: form.position,
        url: form.url || undefined, status: form.status as any,
        salary: form.salary || undefined, location: form.location || undefined,
        remote: form.remote, notes: form.notes || undefined, tags: form.tags,
        nextAction: form.nextAction || undefined,
        nextActionDate: form.nextActionDate ? new Date(form.nextActionDate).getTime() : undefined,
        contacts: form.contacts.length > 0 ? form.contacts : undefined,
      });
      toast({ title: "Saved", description: "Job application updated" });
      setEditing(false);
    } catch {
      toast({ title: "Error", description: "Failed to update", variant: "destructive" });
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    await updateJob({ id: params.id as Id<"job_applications">, status: newStatus as any });
    toast({ title: "Status updated" });
  };

  const addContact = () => setForm({ ...form, contacts: [...form.contacts, { name: "", role: "", linkedin: "" }] });
  const removeContact = (i: number) => setForm({ ...form, contacts: form.contacts.filter((_, idx) => idx !== i) });
  const updateContact = (i: number, field: keyof Contact, value: string) => {
    const contacts = [...form.contacts];
    contacts[i] = { ...contacts[i], [field]: value };
    setForm({ ...form, contacts });
  };

  if (job === undefined) return <div className="p-8">Loading...</div>;
  if (job === null) return <div className="p-8">Job application not found.</div>;

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/jobs"><ArrowLeft className="h-4 w-4" /></Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{job.position}</h1>
            <p className="text-muted-foreground text-lg">{job.company}</p>
          </div>
        </div>
        <div className="flex gap-2">
          {editing ? (
            <>
              <Button onClick={handleSave}><Save className="mr-2 h-4 w-4" />Save</Button>
              <Button variant="outline" onClick={() => setEditing(false)}><X className="mr-2 h-4 w-4" />Cancel</Button>
            </>
          ) : (
            <Button variant="outline" onClick={() => setEditing(true)}><Pencil className="mr-2 h-4 w-4" />Edit</Button>
          )}
        </div>
      </div>

      {/* Pipeline visualization */}
      <div className="flex gap-1 overflow-x-auto">
        {statuses.map((s) => (
          <button
            key={s}
            onClick={() => !editing && handleStatusChange(s)}
            className={`flex-1 min-w-[90px] py-2 px-3 rounded-lg text-center text-xs font-medium transition-colors ${
              s === job.status
                ? "bg-primary text-primary-foreground"
                : "bg-muted hover:bg-muted/80 text-muted-foreground"
            }`}
          >
            <div className="text-base">{statusEmoji[s]}</div>
            <div className="capitalize">{s}</div>
          </button>
        ))}
      </div>

      {/* Next action banner */}
      {!editing && job.nextAction && (
        <Card className="border-orange-500/50 bg-orange-500/5">
          <CardContent className="py-4 flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-orange-500 shrink-0" />
            <div>
              <p className="font-medium">Next Action: {job.nextAction}</p>
              {job.nextActionDate && (
                <p className="text-sm text-muted-foreground">Due {format(new Date(job.nextActionDate), "EEEE, MMM d, yyyy")}</p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {editing ? (
        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Details</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Company</Label>
                  <Input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Position</Label>
                  <Input value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>URL</Label>
                <Input value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} placeholder="https://..." />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Salary</Label>
                  <Input value={form.salary} onChange={(e) => setForm({ ...form, salary: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Remote</Label>
                  <div className="flex items-center gap-2 pt-2">
                    <Switch checked={form.remote} onCheckedChange={(v) => setForm({ ...form, remote: v })} />
                    <span className="text-sm">{form.remote ? "Yes" : "No"}</span>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{statuses.map((s) => <SelectItem key={s} value={s}>{statusEmoji[s]} {s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Next Action</Label>
                  <Input value={form.nextAction} onChange={(e) => setForm({ ...form, nextAction: e.target.value })} placeholder="e.g. Follow up email" />
                </div>
                <div className="space-y-2">
                  <Label>Next Action Date</Label>
                  <Input type="date" value={form.nextActionDate} onChange={(e) => setForm({ ...form, nextActionDate: e.target.value })} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Notes</Label>
                <Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={4} />
              </div>
              <TagInput value={form.tags} onChange={(tags) => setForm({ ...form, tags })} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Contacts</CardTitle>
                <Button size="sm" variant="outline" onClick={addContact}><Plus className="mr-1 h-3 w-3" />Add</Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {form.contacts.map((c, i) => (
                <div key={i} className="flex gap-2 items-start">
                  <Input placeholder="Name" value={c.name} onChange={(e) => updateContact(i, "name", e.target.value)} className="flex-1" />
                  <Input placeholder="Role" value={c.role ?? ""} onChange={(e) => updateContact(i, "role", e.target.value)} className="flex-1" />
                  <Input placeholder="LinkedIn URL" value={c.linkedin ?? ""} onChange={(e) => updateContact(i, "linkedin", e.target.value)} className="flex-1" />
                  <Button size="sm" variant="ghost" onClick={() => removeContact(i)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              ))}
              {form.contacts.length === 0 && <p className="text-muted-foreground text-sm italic">No contacts yet</p>}
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="md:col-span-2">
            <CardHeader><CardTitle>Details</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {job.url && (
                <div>
                  <Label className="text-muted-foreground text-xs">Job Listing</Label>
                  <a href={job.url} target="_blank" rel="noopener" className="mt-1 flex items-center gap-1 text-blue-500 hover:underline">
                    {job.url} <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              )}
              {job.notes ? (
                <div>
                  <Label className="text-muted-foreground text-xs">Notes</Label>
                  <p className="mt-1 whitespace-pre-wrap">{job.notes}</p>
                </div>
              ) : (
                <p className="text-muted-foreground italic">No notes</p>
              )}
              {job.tags && job.tags.length > 0 && (
                <div>
                  <Label className="text-muted-foreground text-xs">Tags</Label>
                  <div className="flex gap-1 mt-1 flex-wrap">
                    {job.tags.map((tag) => <Badge key={tag} variant="outline">{tag}</Badge>)}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Info</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Salary</span>
                <span>{job.salary ?? "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Location</span>
                <span>{job.location ?? "—"} {job.remote && "🌍"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Remote</span>
                <span>{job.remote ? "Yes" : "No"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Applied</span>
                <span>{job.appliedAt ? format(new Date(job.appliedAt), "MMM d, yyyy") : "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Created</span>
                <span>{format(new Date(job.createdAt), "MMM d, yyyy")}</span>
              </div>
            </CardContent>
          </Card>

          {/* Contacts */}
          {job.contacts && job.contacts.length > 0 && (
            <Card className="md:col-span-3">
              <CardHeader><CardTitle>Contacts</CardTitle></CardHeader>
              <CardContent>
                <div className="grid gap-3 md:grid-cols-2">
                  {job.contacts.map((c, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <div className="flex-1">
                        <p className="font-medium">{c.name}</p>
                        {c.role && <p className="text-sm text-muted-foreground">{c.role}</p>}
                      </div>
                      {c.linkedin && (
                        <a href={c.linkedin} target="_blank" rel="noopener" className="text-blue-500 hover:text-blue-600">
                          <Linkedin className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
