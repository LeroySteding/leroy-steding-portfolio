"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../../../../../convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RefreshCw, User, Target, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export function MatchingSection() {
  const [isRescoring, setIsRescoring] = useState(false);
  
  const scoreDistribution = useQuery(api.prolinker_dashboard.scoreDistribution);
  const topMatches = useQuery(api.prolinker_dashboard.topMatches, { limit: 10 });

  const handleRescore = async () => {
    setIsRescoring(true);
    // TODO: Implement rescoring logic
    setTimeout(() => setIsRescoring(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Profile Editor Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Your Profile & Preferences
          </CardTitle>
          <CardDescription>
            Configure your skills and preferences to improve job matching
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="text-sm font-medium text-blue-900">Skills Configured</div>
              <div className="text-2xl font-bold text-blue-600 mt-1">12</div>
              <div className="text-xs text-blue-700 mt-1">8 required, 4 preferred</div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="text-sm font-medium text-green-900">Target Companies</div>
              <div className="text-2xl font-bold text-green-600 mt-1">5</div>
              <div className="text-xs text-green-700 mt-1">Priority companies set</div>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="text-sm font-medium text-purple-900">Blacklisted</div>
              <div className="text-2xl font-bold text-purple-600 mt-1">3</div>
              <div className="text-xs text-purple-700 mt-1">Companies to avoid</div>
            </div>
          </div>

          {/* Skills Section */}
          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <Target className="w-4 h-4" />
              Required Skills
            </h4>
            <div className="flex flex-wrap gap-2 mb-4">
              {["React", "TypeScript", "Next.js", "Node.js", "PostgreSQL", "Tailwind CSS", "GraphQL", "Convex"].map((skill) => (
                <Badge key={skill} variant="default" className="text-sm">
                  {skill}
                </Badge>
              ))}
            </div>
            
            <h4 className="font-semibold mb-3 mt-4">Preferred Skills</h4>
            <div className="flex flex-wrap gap-2">
              {["AWS", "Docker", "Kubernetes", "Python"].map((skill) => (
                <Badge key={skill} variant="secondary" className="text-sm">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          {/* Location & Salary Preferences */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
            <div>
              <h4 className="font-semibold mb-2">Location Preferences</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Preferred Locations:</span>
                  <span className="font-medium">Amsterdam, Remote, Netherlands</span>
                </div>
                <div className="flex justify-between">
                  <span>Remote Preference:</span>
                  <Badge variant="outline">Preferred</Badge>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Salary Expectations</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Minimum:</span>
                  <span className="font-medium">€60,000</span>
                </div>
                <div className="flex justify-between">
                  <span>Target:</span>
                  <span className="font-medium">€75,000 - €90,000</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button variant="outline" size="sm">
              Edit Profile
            </Button>
            <Button variant="outline" size="sm">
              Manage Skills
            </Button>
            <Button variant="outline" size="sm">
              Update Preferences
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Score Distribution Chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Match Score Distribution
              </CardTitle>
              <CardDescription>
                How well do active jobs match your profile
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRescore}
              disabled={isRescoring}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isRescoring ? "animate-spin" : ""}`} />
              {isRescoring ? "Rescoring..." : "Re-score All"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {scoreDistribution && scoreDistribution.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={scoreDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-slate-500">
              <div className="text-center">
                <Target className="w-12 h-12 mx-auto mb-2 opacity-20" />
                <p>No score data available yet</p>
                <p className="text-sm mt-1">
                  Click &quot;Re-score All&quot; to calculate match scores
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Top Matches */}
      <Card>
        <CardHeader>
          <CardTitle>Top Matched Jobs</CardTitle>
          <CardDescription>
            Jobs that best match your skills and preferences
          </CardDescription>
        </CardHeader>
        <CardContent>
          {topMatches && topMatches.length > 0 ? (
            <div className="space-y-3">
              {topMatches.map((job: any) => (
                <div
                  key={job._id}
                  className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h4 className="font-semibold">{job.title}</h4>
                      <p className="text-sm text-slate-600">{job.company}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {job.technologies.slice(0, 4).map((tech: string) => (
                          <Badge key={tech} variant="outline" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                        {job.technologies.length > 4 && (
                          <Badge variant="outline" className="text-xs">
                            +{job.technologies.length - 4}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600">
                        {job.matchScore}%
                      </div>
                      <div className="text-xs text-slate-500 mt-1">match score</div>
                      <Button size="sm" className="mt-2">
                        View Details
                      </Button>
                    </div>
                  </div>
                  <div className="mt-3">
                    <Progress value={job.matchScore} className="h-2" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-500">
              <Target className="w-12 h-12 mx-auto mb-2 opacity-20" />
              <p>No matched jobs yet</p>
              <p className="text-sm mt-1">
                Make sure your profile is configured and click &quot;Re-score All&quot;
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
