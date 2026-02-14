import { AgentStatus } from "@/components/agent-status";
import { ActiveTasks } from "@/components/active-tasks";
import { CaseFiles } from "@/components/case-files";
import { AgentMemory } from "@/components/agent-memory";

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
        {/* Real-time Agent Status */}
        <AgentStatus />

        {/* Task Kanban Board */}
        <ActiveTasks />

        {/* Project Case Files */}
        <CaseFiles />

        {/* Shared Knowledge Base */}
        <AgentMemory />
      </div>
    </div>
  );
}
