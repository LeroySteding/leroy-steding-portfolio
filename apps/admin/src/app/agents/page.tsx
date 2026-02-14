import { AgentStatus } from "@/components/agent-status";

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
        <AgentStatus />

        {/* Add more components here */}
        {/* <ActiveTasks /> */}
        {/* <CaseFiles /> */}
        {/* <AgentMemory /> */}
      </div>
    </div>
  );
}
