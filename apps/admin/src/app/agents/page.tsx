import { AgentStatus } from "@/components/agent-status";
import { ActiveTasks } from "@/components/active-tasks";
import { CaseFiles } from "@/components/case-files";
import { AgentFeed } from "@/components/agent-feed";
import { AgentMemory } from "@/components/agent-memory";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AgentsPage() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Agent Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Monitor your multi-agent system in real-time
        </p>
      </div>

      <div className="grid gap-6">
        {/* Agent Status Overview */}
        <AgentStatus />

        {/* Main Dashboard Content */}
        <Tabs defaultValue="tasks" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="cases">Case Files</TabsTrigger>
            <TabsTrigger value="feed">Activity Feed</TabsTrigger>
            <TabsTrigger value="memory">Memory</TabsTrigger>
          </TabsList>

          <TabsContent value="tasks" className="space-y-6">
            <ActiveTasks />
          </TabsContent>

          <TabsContent value="cases" className="space-y-6">
            <CaseFiles />
          </TabsContent>

          <TabsContent value="feed" className="space-y-6">
            <AgentFeed />
          </TabsContent>

          <TabsContent value="memory" className="space-y-6">
            <AgentMemory />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
