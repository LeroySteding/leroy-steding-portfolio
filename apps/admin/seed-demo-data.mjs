import { ConvexHttpClient } from "convex/browser";

const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);

console.log("🌱 Seeding demo data...\n");

// 1. Create tasks
const tasks = [
  {
    title: "Build BelastingBot expense tracker",
    assignedTo: ["coder"],
    priority: "high",
    context: "Week 3 MVP - implement expense CRUD with BTW calculation",
    createdBy: "orchestrator"
  },
  {
    title: "Review BelastingBot schema design",
    assignedTo: ["architect"],
    priority: "medium",
    context: "Validate expense table structure and BTW calculation fields",
    createdBy: "orchestrator"
  },
  {
    title: "Research BTW rates and rules",
    assignedTo: ["researcher"],
    priority: "high",
    context: "Document Dutch VAT rates (21%, 9%, 0%) and deduction rules for ZZP'ers",
    createdBy: "orchestrator"
  },
  {
    title: "Write BelastingBot landing page copy",
    assignedTo: ["business"],
    priority: "medium",
    context: "Compelling copy for homepage + value props for ZZP target audience",
    createdBy: "orchestrator"
  },
  {
    title: "Set up Telegram→Convex data pipeline",
    assignedTo: ["data-handler"],
    priority: "high",
    context: "Scrape this chat every 5 min, sync to Convex agent_feed table",
    createdBy: "orchestrator"
  }
];

for (const task of tasks) {
  const taskId = await client.mutation("agentCoordination:createAgentTask", task);
  console.log(`✅ Created task: ${task.title}`);
}

// 2. Create case file
const caseFile = await client.mutation("agentCoordination:createCaseFile", {
  projectName: "BelastingBot Week 3 Launch",
  summary: "Build and launch BTW tracking SaaS for Dutch ZZP'ers. Target: 10+ signups by EOW.",
  participants: ["orchestrator", "architect", "coder", "researcher", "business", "data-handler"],
  tags: ["week3", "saas", "belastingbot", "mvp"]
});
console.log(`✅ Created case file: BelastingBot Week 3 Launch`);

// 3. Add decision to case file
await client.mutation("agentCoordination:addDecisionToCaseFile", {
  caseFileId: caseFile,
  decision: "Use separate Convex deployment for BelastingBot (not shared with admin)",
  madeBy: "architect",
  rationale: "Clean separation of concerns, easier to scale independently"
});
console.log(`✅ Added decision to case file`);

// 4. Create agent memories
const memories = [
  {
    agentName: "researcher",
    category: "insight",
    content: "Dutch ZZP'ers must file quarterly BTW (VAT) reports. Main pain point: manual calculation of voorbelasting (input VAT).",
    tags: ["btw", "zzp", "netherlands", "research"],
    sharedWith: "all"
  },
  {
    agentName: "architect",
    category: "decision",
    content: "BelastingBot schema: Store amounts in cents (not euros) to avoid floating point precision issues in VAT calculations.",
    tags: ["architecture", "belastingbot", "database"],
    sharedWith: "all"
  },
  {
    agentName: "coder",
    category: "reference",
    content: "Admin app agents endpoint: https://admin.leroysteding.nl/agents - Shows real-time agent status with Convex subscriptions",
    tags: ["admin", "reference", "url"],
    sharedWith: "team"
  }
];

for (const memory of memories) {
  await client.mutation("agentCoordination:createAgentMemory", memory);
  console.log(`✅ Created memory by ${memory.agentName}`);
}

console.log("\n🎉 Demo data seeded successfully!");
console.log("\nRefresh https://admin.leroysteding.nl/agents to see:");
console.log("  • 5 active tasks");
console.log("  • 1 case file with decision");
console.log("  • 3 shared memories");
