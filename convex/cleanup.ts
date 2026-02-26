import { internalMutation } from "./_generated/server";

const DAY_MS = 24 * 60 * 60 * 1000;

type TableRule = {
  table: "agent_feed" | "analytics_log" | "github_activity" | "deployments";
  maxAgeDays: number;
};

const RETENTION_RULES: TableRule[] = [
  { table: "agent_feed", maxAgeDays: 30 },
  { table: "analytics_log", maxAgeDays: 90 },
  { table: "github_activity", maxAgeDays: 60 },
  { table: "deployments", maxAgeDays: 60 },
];

export const run = internalMutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    const results: string[] = [];

    for (const { table, maxAgeDays } of RETENTION_RULES) {
      const cutoff = now - maxAgeDays * DAY_MS;
      const old = await ctx.db
        .query(table)
        .withIndex("by_created_at", (q) => q.lt("createdAt", cutoff))
        .collect();

      for (const doc of old) {
        await ctx.db.delete(doc._id);
      }

      if (old.length > 0) {
        results.push(
          `${table}: deleted ${old.length} items older than ${maxAgeDays}d`,
        );
      }
    }

    if (results.length > 0) {
      console.log(`[cleanup] ${results.join(", ")}`);
    } else {
      console.log("[cleanup] nothing to clean up");
    }
  },
});
