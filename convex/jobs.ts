/**
 * Jobs API - Clean exports for admin dashboard
 * Re-exports from job_applications with simplified naming
 */

export {
  list,
  get,
  activeCount,
  push,
  create,
  update,
  updateStatus,
  remove,
} from "./job_applications";
