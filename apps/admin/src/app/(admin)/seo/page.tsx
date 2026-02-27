"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../../convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Plus, Trash2, TrendingUp, MousePointer, Eye } from "lucide-react";
import { StatCard } from "@/components/stat-card";
import { format } from "date-fns";
import { useState } from "react";

export default function SeoPage() {
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ url: "", keyword: "", domain: "", position: "", pageTitle: "" });

  const items = useQuery(api.seo_tracking.list, {});
  const createItem = useMutation(api.seo_tracking.create);
  const removeItem = useMutation(api.seo_tracking.remove);

  const handleCreate = async () => {
    if (!form.url || !form.domain) return;
    await createItem({
      url: form.url, domain: form.domain,
      keyword: form.keyword || undefined,
      position: form.position ? Number(form.position) : undefined,
      pageTitle: form.pageTitle || undefined,
    });
    setForm({ url: "", keyword: "", domain: "", position: "", pageTitle: "" });
    setShowAdd(false);
  };

  // Domain stats
  const domains = new Set(items?.map((i) => i.domain));
  const avgPosition = items?.length ? (items.reduce((sum, i) => sum + (i.position ?? 0), 0) / items.filter((i) => i.position).length) : 0;
  const totalClicks = items?.reduce((sum, i) => sum + (i.clicks ?? 0), 0) ?? 0;
  const totalImpressions = items?.reduce((sum, i) => sum + (i.impressions ?? 0), 0) ?? 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold flex items-center gap-2"><Search className="h-8 w-8" /> SEO Dashboard</h1>
        <Dialog open={showAdd} onOpenChange={setShowAdd}>
          <DialogTrigger asChild><Button><Plus className="mr-2 h-4 w-4" />Add Tracking</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add SEO Entry</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <Input placeholder="URL" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} />
              <Input placeholder="Domain" value={form.domain} onChange={(e) => setForm({ ...form, domain: e.target.value })} />
              <Input placeholder="Keyword" value={form.keyword} onChange={(e) => setForm({ ...form, keyword: e.target.value })} />
              <Input placeholder="Position" type="number" value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} />
              <Input placeholder="Page Title" value={form.pageTitle} onChange={(e) => setForm({ ...form, pageTitle: e.target.value })} />
              <Button onClick={handleCreate} className="w-full">Add Entry</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard title="Domains" value={domains.size} icon={Search} description="Tracked domains" />
        <StatCard title="Avg Position" value={avgPosition ? avgPosition.toFixed(1) : "—"} icon={TrendingUp} description="Average ranking" />
        <StatCard title="Total Clicks" value={totalClicks.toLocaleString()} icon={MousePointer} description="All time" />
        <StatCard title="Impressions" value={totalImpressions.toLocaleString()} icon={Eye} description="All time" />
      </div>

      <Card>
        <CardHeader><CardTitle>Keyword Rankings</CardTitle></CardHeader>
        <CardContent>
          {!items?.length ? <p className="text-sm text-muted-foreground">No SEO data tracked yet.</p> : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Keyword</TableHead>
                  <TableHead>URL</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Clicks</TableHead>
                  <TableHead>Impressions</TableHead>
                  <TableHead>CTR</TableHead>
                  <TableHead>Checked</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item._id}>
                    <TableCell className="font-medium">{item.keyword ?? "—"}</TableCell>
                    <TableCell className="text-sm max-w-48 truncate">{item.pageTitle ?? item.url}</TableCell>
                    <TableCell>
                      {item.position ? (
                        <Badge variant={item.position <= 3 ? "default" : item.position <= 10 ? "secondary" : "destructive"}>
                          #{item.position}
                        </Badge>
                      ) : "—"}
                    </TableCell>
                    <TableCell>{item.clicks ?? "—"}</TableCell>
                    <TableCell>{item.impressions ?? "—"}</TableCell>
                    <TableCell>{item.ctr ? `${(item.ctr * 100).toFixed(1)}%` : "—"}</TableCell>
                    <TableCell className="text-sm">{format(new Date(item.checkedAt), "MMM d")}</TableCell>
                    <TableCell>
                      <Button size="sm" variant="ghost" onClick={() => removeItem({ id: item._id })}><Trash2 className="h-4 w-4" /></Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
