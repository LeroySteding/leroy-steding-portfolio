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
import type * as belt_btw from "../belt_btw.js";
import type * as belt_expenses from "../belt_expenses.js";
import type * as blog_posts from "../blog_posts.js";
import type * as cleanup from "../cleanup.js";
import type * as contentCalendar from "../contentCalendar.js";
import type * as content_calendar from "../content_calendar.js";
import type * as crons from "../crons.js";
import type * as deployments from "../deployments.js";
import type * as experiences from "../experiences.js";
import type * as fact_clients from "../fact_clients.js";
import type * as fact_invoices from "../fact_invoices.js";
import type * as fact_settings from "../fact_settings.js";
import type * as github_activity from "../github_activity.js";
import type * as intelligence from "../intelligence.js";
import type * as job_applications from "../job_applications.js";
import type * as jobs from "../jobs.js";
import type * as klant_portal from "../klant_portal.js";
import type * as klant_projects from "../klant_projects.js";
import type * as linearQueries from "../linearQueries.js";
import type * as linearSync from "../linearSync.js";
import type * as linearWebhook from "../linearWebhook.js";
import type * as media from "../media.js";
import type * as portfolio from "../portfolio.js";
import type * as portfolioLeads from "../portfolioLeads.js";
import type * as projects from "../projects.js";
import type * as seo_tracking from "../seo_tracking.js";
import type * as site_settings from "../site_settings.js";
import type * as skills from "../skills.js";
import type * as tasks from "../tasks.js";
import type * as templates from "../templates.js";
import type * as uren_tracking from "../uren_tracking.js";
import type * as zzp_schema_additions from "../zzp_schema_additions.js";
import type * as zzp_users from "../zzp_users.js";

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
  belt_btw: typeof belt_btw;
  belt_expenses: typeof belt_expenses;
  blog_posts: typeof blog_posts;
  cleanup: typeof cleanup;
  contentCalendar: typeof contentCalendar;
  content_calendar: typeof content_calendar;
  crons: typeof crons;
  deployments: typeof deployments;
  experiences: typeof experiences;
  fact_clients: typeof fact_clients;
  fact_invoices: typeof fact_invoices;
  fact_settings: typeof fact_settings;
  github_activity: typeof github_activity;
  intelligence: typeof intelligence;
  job_applications: typeof job_applications;
  jobs: typeof jobs;
  klant_portal: typeof klant_portal;
  klant_projects: typeof klant_projects;
  linearQueries: typeof linearQueries;
  linearSync: typeof linearSync;
  linearWebhook: typeof linearWebhook;
  media: typeof media;
  portfolio: typeof portfolio;
  portfolioLeads: typeof portfolioLeads;
  projects: typeof projects;
  seo_tracking: typeof seo_tracking;
  site_settings: typeof site_settings;
  skills: typeof skills;
  tasks: typeof tasks;
  templates: typeof templates;
  uren_tracking: typeof uren_tracking;
  zzp_schema_additions: typeof zzp_schema_additions;
  zzp_users: typeof zzp_users;
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
