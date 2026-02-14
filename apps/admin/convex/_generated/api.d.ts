/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as _helpers from "../_helpers.js";
import type * as agentCoordination from "../agentCoordination.js";
import type * as agentHeartbeat from "../agentHeartbeat.js";
import type * as agent_feed from "../agent_feed.js";
import type * as analytics_log from "../analytics_log.js";
import type * as blog_posts from "../blog_posts.js";
import type * as cleanup from "../cleanup.js";
import type * as content_calendar from "../content_calendar.js";
import type * as crons from "../crons.js";
import type * as deployments from "../deployments.js";
import type * as experiences from "../experiences.js";
import type * as github_activity from "../github_activity.js";
import type * as job_applications from "../job_applications.js";
import type * as linearQueries from "../linearQueries.js";
import type * as linearSync from "../linearSync.js";
import type * as linearWebhook from "../linearWebhook.js";
import type * as media from "../media.js";
import type * as portfolio from "../portfolio.js";
import type * as projects from "../projects.js";
import type * as seedAgents from "../seedAgents.js";
import type * as seo_tracking from "../seo_tracking.js";
import type * as site_settings from "../site_settings.js";
import type * as skills from "../skills.js";
import type * as tasks from "../tasks.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  _helpers: typeof _helpers;
  agentCoordination: typeof agentCoordination;
  agentHeartbeat: typeof agentHeartbeat;
  agent_feed: typeof agent_feed;
  analytics_log: typeof analytics_log;
  blog_posts: typeof blog_posts;
  cleanup: typeof cleanup;
  content_calendar: typeof content_calendar;
  crons: typeof crons;
  deployments: typeof deployments;
  experiences: typeof experiences;
  github_activity: typeof github_activity;
  job_applications: typeof job_applications;
  linearQueries: typeof linearQueries;
  linearSync: typeof linearSync;
  linearWebhook: typeof linearWebhook;
  media: typeof media;
  portfolio: typeof portfolio;
  projects: typeof projects;
  seedAgents: typeof seedAgents;
  seo_tracking: typeof seo_tracking;
  site_settings: typeof site_settings;
  skills: typeof skills;
  tasks: typeof tasks;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
