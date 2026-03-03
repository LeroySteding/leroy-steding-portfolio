"use client";

import { useState, useMemo } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../../../../convex/_generated/api";
import type { Id } from "../../../../../../../../convex/_generated/dataModel";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  ExternalLink, 
  MapPin, 
  DollarSign, 
  MoreVertical, 
  Eye, 
  Send, 
  Archive, 
  Ban,
  ArrowUpDown,
  Filter,
  X,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface JobsTableProps {
  limit?: number;
  compact?: boolean;
}

export function JobsTable({ limit, compact = false }: JobsTableProps) {
  const [filters, setFilters] = useState({
    location: "",
    techStack: [] as string[],
    minSalary: undefined as number | undefined,
    maxSalary: undefined as number | undefined,
    minScore: undefined as number | undefined,
    sortBy: "date" as "score" | "date" | "salary",
    sortOrder: "desc" as "asc" | "desc",
  });
  const [searchTech, setSearchTech] = useState("");
  const [showFilters, setShowFilters] = useState(!compact);

  const jobs = useQuery(api.prolinker_dashboard.listJobs, {
    ...filters,
    limit: limit || 50,
  });
  
  const technologies = useQuery(api.prolinker_dashboard.getTechnologies);
  const locations = useQuery(api.prolinker_dashboard.getLocations);
  
  const archiveJob = useMutation(api.prolinker_dashboard.archiveJob);
  const blacklistCompany = useMutation(api.prolinker_dashboard.blacklistCompany);

  const handleArchive = async (jobId: Id<"scraped_jobs">) => {
    await archiveJob({ id: jobId });
  };

  const handleBlacklist = async (company: string) => {
    await blacklistCompany({ company });
  };

  const filteredTechnologies = useMemo(() => {
    if (!technologies) return [];
    if (!searchTech) return technologies.slice(0, 20);
    return technologies
      .filter((tech: string) => tech.toLowerCase().includes(searchTech.toLowerCase()))
      .slice(0, 20);
  }, [technologies, searchTech]);

  const toggleTechFilter = (tech: string) => {
    setFilters((prev) => ({
      ...prev,
      techStack: prev.techStack.includes(tech)
        ? prev.techStack.filter((t) => t !== tech)
        : [...prev.techStack, tech],
    }));
  };

  const removeTechFilter = (tech: string) => {
    setFilters((prev) => ({
      ...prev,
      techStack: prev.techStack.filter((t) => t !== tech),
    }));
  };

  const clearFilters = () => {
    setFilters({
      location: "",
      techStack: [],
      minSalary: undefined,
      maxSalary: undefined,
      minScore: undefined,
      sortBy: "date",
      sortOrder: "desc",
    });
  };

  const hasActiveFilters = 
    filters.location || 
    filters.techStack.length > 0 || 
    filters.minSalary || 
    filters.maxSalary || 
    filters.minScore;

  if (compact && jobs && jobs.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500">
        No jobs found
      </div>
    );
  }

  return (
    <Card className={compact ? "border-0 shadow-none" : ""}>
      {!compact && (
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Scraped Jobs</CardTitle>
              <CardDescription>
                {jobs ? `${jobs.length} jobs found` : "Loading..."}
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-4 h-4 mr-2" />
              {showFilters ? "Hide" : "Show"} Filters
            </Button>
          </div>
        </CardHeader>
      )}
      
      <CardContent className={compact ? "p-0" : ""}>
        {/* Filters */}
        {showFilters && !compact && (
          <div className="mb-6 p-4 bg-slate-50 rounded-lg space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm">Filters</h3>
              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  <X className="w-4 h-4 mr-1" />
                  Clear All
                </Button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Location Filter */}
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Select
                  value={filters.location}
                  onValueChange={(value) =>
                    setFilters((prev) => ({ ...prev, location: value }))
                  }
                >
                  <SelectTrigger id="location">
                    <SelectValue placeholder="Any location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any location</SelectItem>
                    {locations?.map((loc: string) => (
                      <SelectItem key={loc} value={loc}>
                        {loc}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Min Salary Filter */}
              <div className="space-y-2">
                <Label htmlFor="minSalary">Min Salary (€)</Label>
                <Input
                  id="minSalary"
                  type="number"
                  placeholder="e.g., 50000"
                  value={filters.minSalary || ""}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      minSalary: e.target.value ? parseInt(e.target.value) : undefined,
                    }))
                  }
                />
              </div>

              {/* Max Salary Filter */}
              <div className="space-y-2">
                <Label htmlFor="maxSalary">Max Salary (€)</Label>
                <Input
                  id="maxSalary"
                  type="number"
                  placeholder="e.g., 80000"
                  value={filters.maxSalary || ""}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      maxSalary: e.target.value ? parseInt(e.target.value) : undefined,
                    }))
                  }
                />
              </div>

              {/* Min Score Filter */}
              <div className="space-y-2">
                <Label htmlFor="minScore">Min Match Score</Label>
                <Input
                  id="minScore"
                  type="number"
                  placeholder="e.g., 70"
                  min="0"
                  max="100"
                  value={filters.minScore || ""}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      minScore: e.target.value ? parseInt(e.target.value) : undefined,
                    }))
                  }
                />
              </div>
            </div>

            {/* Tech Stack Filter */}
            <div className="space-y-2">
              <Label>Tech Stack</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  placeholder="Search technologies..."
                  value={searchTech}
                  onChange={(e) => setSearchTech(e.target.value)}
                  className="max-w-xs"
                />
              </div>
              
              {/* Selected Technologies */}
              {filters.techStack.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {filters.techStack.map((tech) => (
                    <Badge key={tech} variant="secondary" className="cursor-pointer">
                      {tech}
                      <X
                        className="w-3 h-3 ml-1"
                        onClick={() => removeTechFilter(tech)}
                      />
                    </Badge>
                  ))}
                </div>
              )}
              
              {/* Available Technologies */}
              <div className="flex flex-wrap gap-2">
                {filteredTechnologies.map((tech: string) => (
                  <Badge
                    key={tech}
                    variant={filters.techStack.includes(tech) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleTechFilter(tech)}
                  >
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Sort Options */}
            <div className="flex gap-4">
              <div className="space-y-2 flex-1">
                <Label htmlFor="sortBy">Sort By</Label>
                <Select
                  value={filters.sortBy}
                  onValueChange={(value: "score" | "date" | "salary") =>
                    setFilters((prev) => ({ ...prev, sortBy: value }))
                  }
                >
                  <SelectTrigger id="sortBy">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="score">Match Score</SelectItem>
                    <SelectItem value="date">Date Scraped</SelectItem>
                    <SelectItem value="salary">Salary</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2 flex-1">
                <Label htmlFor="sortOrder">Order</Label>
                <Select
                  value={filters.sortOrder}
                  onValueChange={(value: "asc" | "desc") =>
                    setFilters((prev) => ({ ...prev, sortOrder: value }))
                  }
                >
                  <SelectTrigger id="sortOrder">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="desc">High to Low</SelectItem>
                    <SelectItem value="asc">Low to High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}

        {/* Jobs Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Job Title</TableHead>
                {!compact && <TableHead>Company</TableHead>}
                {!compact && <TableHead>Location</TableHead>}
                <TableHead>Tech Stack</TableHead>
                {!compact && <TableHead>Salary</TableHead>}
                {!compact && <TableHead>Score</TableHead>}
                <TableHead>Scraped</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!jobs ? (
                <TableRow>
                  <TableCell colSpan={compact ? 4 : 8} className="text-center py-8">
                    Loading jobs...
                  </TableCell>
                </TableRow>
              ) : jobs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={compact ? 4 : 8} className="text-center py-8 text-slate-500">
                    No jobs found matching your filters
                  </TableCell>
                </TableRow>
              ) : (
                jobs.map((job: any) => (
                  <TableRow key={job._id} className="hover:bg-slate-50">
                    <TableCell className="font-medium">
                      <div className="flex items-start gap-2">
                        <div>
                          <div className="font-semibold">{job.title}</div>
                          {compact && (
                            <div className="text-sm text-slate-500">{job.company}</div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    {!compact && <TableCell>{job.company}</TableCell>}
                    {!compact && (
                      <TableCell>
                        {job.location && (
                          <div className="flex items-center gap-1 text-sm">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            {job.location}
                          </div>
                        )}
                        {job.remote && (
                          <Badge variant="secondary" className="text-xs mt-1">
                            Remote
                          </Badge>
                        )}
                      </TableCell>
                    )}
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {job.technologies.slice(0, 3).map((tech: string) => (
                          <Badge key={tech} variant="outline" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                        {job.technologies.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{job.technologies.length - 3}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    {!compact && (
                      <TableCell>
                        {job.salary && (
                          <div className="flex items-center gap-1 text-sm">
                            <DollarSign className="w-3 h-3 text-slate-400" />
                            {job.salary}
                          </div>
                        )}
                      </TableCell>
                    )}
                    {!compact && (
                      <TableCell>
                        <Badge
                          variant={
                            job.matchScore >= 80
                              ? "default"
                              : job.matchScore >= 60
                              ? "secondary"
                              : "outline"
                          }
                        >
                          {job.matchScore}%
                        </Badge>
                      </TableCell>
                    )}
                    <TableCell className="text-sm text-slate-500">
                      {formatDistanceToNow(job.scrapedAt, { addSuffix: true })}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <a href={job.url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="w-4 h-4 mr-2" />
                              View Job
                            </a>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Send className="w-4 h-4 mr-2" />
                            Apply Now
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleArchive(job._id)}>
                            <Archive className="w-4 h-4 mr-2" />
                            Archive
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleBlacklist(job.company)}
                            className="text-red-600"
                          >
                            <Ban className="w-4 h-4 mr-2" />
                            Blacklist Company
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
