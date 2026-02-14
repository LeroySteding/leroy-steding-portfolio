"use client";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Construction } from "lucide-react";

export function CaseFiles() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Construction className="h-5 w-5" />
          Case Files
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-center py-8">
          Component under development. See AGENT_INTEGRATION_REQUIREMENTS.md
        </p>
      </CardContent>
    </Card>
  );
}
