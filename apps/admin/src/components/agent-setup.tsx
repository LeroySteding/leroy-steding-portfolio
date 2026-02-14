"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Bot, CheckCircle2, AlertCircle, Rocket } from "lucide-react";
import { useState } from "react";
import { useToast } from "./ui/use-toast";

export function AgentSetup() {
  const sessions = useQuery(api.agentCoordination.getAgentSessions, {});
  const registerDemo = useMutation(api.agentHeartbeat.registerDemoAgents);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Only show setup if no agents are connected
  if (!sessions || sessions.length > 0) {
    return null;
  }

  const handleSeed = async () => {
    setLoading(true);
    try {
      await registerDemo({});
      toast({
        title: "Success!",
        description: "Demo agents registered successfully!",
      });
      // Auto-reload page to show new agents
      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to register demo agents",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          Agent Setup Required
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          No agents are currently connected. Get started by registering demo agents.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2 text-sm">
          <p className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <strong>Development Mode:</strong> This creates 7 demo agent sessions for testing
          </p>
          <ul className="list-disc list-inside ml-6 space-y-1 text-muted-foreground">
            <li>🎯 Orchestrator (active)</li>
            <li>🏗️ Architect (idle)</li>
            <li>⚡ Coder (active)</li>
            <li>🔍 Researcher (idle)</li>
            <li>💼 Business (active)</li>
            <li>🕷️ Data Handler (idle)</li>
            <li>🛡️ Critic (active)</li>
          </ul>
        </div>

        <Button 
          onClick={handleSeed} 
          disabled={loading}
          className="w-full"
        >
          {loading ? (
            <>Registering...</>
          ) : (
            <>
              <Rocket className="mr-2 h-4 w-4" />
              Register Demo Agents
            </>
          )}
        </Button>

        <p className="text-xs text-muted-foreground pt-2 border-t">
          <CheckCircle2 className="h-3 w-3 inline mr-1" />
          In production, agents will auto-register via the registerHeartbeat mutation
        </p>
      </CardContent>
    </Card>
  );
}
