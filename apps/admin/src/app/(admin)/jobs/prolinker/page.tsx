"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../../../convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Download, RefreshCw, Settings } from "lucide-react";

// Import dashboard components
import { OverviewStats } from "./components/OverviewStats";
import { JobsTable } from "./components/JobsTable";
import { MatchingSection } from "./components/MatchingSection";
import { AutoApplyDashboard } from "./components/AutoApplyDashboard";
import { ScraperHealth } from "./components/ScraperHealth";

export default function ProLinkerDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [isExporting, setIsExporting] = useState(false);

  const overviewStats = useQuery(api.prolinker_dashboard.overviewStats);
  const exportToCSV = useMutation(api.prolinker_dashboard.exportToCSV);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const csv = await exportToCSV({});
      
      // Download CSV file
      const blob = new Blob([csv], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `prolinker-jobs-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              ProLinker Dashboard
            </h1>
            <p className="text-slate-600 mt-1">
              Monitor and manage your automated job search system
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button
              onClick={handleExport}
              disabled={isExporting}
              variant="outline"
              size="sm"
            >
              <Download className="w-4 h-4 mr-2" />
              {isExporting ? "Exporting..." : "Export CSV"}
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 gap-2">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="jobs">Jobs</TabsTrigger>
            <TabsTrigger value="matching">Matching</TabsTrigger>
            <TabsTrigger value="auto-apply">Auto-Apply</TabsTrigger>
            <TabsTrigger value="scraper">Scraper</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <OverviewStats stats={overviewStats} />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Jobs</CardTitle>
                  <CardDescription>Latest scraped opportunities</CardDescription>
                </CardHeader>
                <CardContent>
                  <JobsTable limit={5} compact />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common dashboard actions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start" variant="outline">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Trigger Manual Scrape
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    View Top Matches
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    Review Pending Applications
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Jobs Tab */}
          <TabsContent value="jobs">
            <JobsTable />
          </TabsContent>

          {/* Matching Tab */}
          <TabsContent value="matching">
            <MatchingSection />
          </TabsContent>

          {/* Auto-Apply Tab */}
          <TabsContent value="auto-apply">
            <AutoApplyDashboard />
          </TabsContent>

          {/* Scraper Health Tab */}
          <TabsContent value="scraper">
            <ScraperHealth />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
