import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();
crons.daily("cleanup old data", { hourUTC: 3, minuteUTC: 0 }, internal.cleanup.run, {});
export default crons;
