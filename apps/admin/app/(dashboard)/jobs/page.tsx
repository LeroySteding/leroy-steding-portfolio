"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { MapPin, DollarSign, Calendar, ExternalLink } from "lucide-react";
import { useState } from "react";

export default function JobsPage() {
  const [statusFilter, setStatusFilter] = useState<string | undefined>("new");
  const jobs = useQuery(api.jobs.list, { status: statusFilter as any });
  const updateStatus = useMutation(api.jobs.updateStatus);

  const handleStatusChange = async (jobId: any, newStatus: string) => {
    await updateStatus({ id: jobId, status: newStatus as any });
  };

  if (!jobs) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading jobs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="flex gap-2">
          {["new", "saved", "applied", "all"].map((filter) => (
            <button
              key={filter}
              onClick={() =>
                setStatusFilter(filter === "all" ? undefined : filter)
              }
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                (filter === "all" && !statusFilter) ||
                statusFilter === filter
                  ? "bg-primary text-primary-foreground"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Jobs List */}
      <div className="space-y-4">
        {jobs.length === 0 ? (
          <div className="text-center py-12 bg-card rounded-lg border">
            <p className="text-muted-foreground">No jobs found</p>
          </div>
        ) : (
          jobs.map((job) => (
            <div
              key={job._id}
              className="rounded-lg border bg-card p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-start gap-4">
                    {job.companyLogo && (
                      <img
                        src={job.companyLogo}
                        alt={job.company}
                        className="w-12 h-12 rounded"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">{job.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {job.company}
                      </p>

                      <div className="flex flex-wrap gap-4 mt-3 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {job.location}
                        </div>
                        {job.salary && (
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4" />
                            {job.salary.currency} {job.salary.min.toLocaleString()} -{" "}
                            {job.salary.max.toLocaleString()}
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(job.postedAt).toLocaleDateString()}
                        </div>
                      </div>

                      {/* Skills */}
                      <div className="flex flex-wrap gap-2 mt-3">
                        {job.skills.slice(0, 5).map((skill) => (
                          <span
                            key={skill}
                            className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                        {job.skills.length > 5 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            +{job.skills.length - 5} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Match Score */}
                {job.matchScore !== undefined && (
                  <div className="text-right">
                    <div
                      className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${
                        job.matchScore >= 85
                          ? "bg-green-100 text-green-700"
                          : job.matchScore >= 70
                          ? "bg-orange-100 text-orange-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      <span className="text-lg font-bold">
                        {job.matchScore}%
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">match</p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 mt-4 pt-4 border-t">
                <a
                  href={job.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                  View Job
                </a>
                {job.status === "new" && (
                  <>
                    <button
                      onClick={() => handleStatusChange(job._id, "saved")}
                      className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => handleStatusChange(job._id, "applied")}
                      className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Mark Applied
                    </button>
                  </>
                )}
                {job.status !== "rejected" && (
                  <button
                    onClick={() => handleStatusChange(job._id, "rejected")}
                    className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors ml-auto"
                  >
                    Reject
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
