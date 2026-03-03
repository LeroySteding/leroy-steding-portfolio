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
import type * as application_templates from "../application_templates.js";
import type * as auto_apply_settings from "../auto_apply_settings.js";
import type * as blog_posts from "../blog_posts.js";
import type * as cleanup from "../cleanup.js";
import type * as content_calendar from "../content_calendar.js";
import type * as cron_tasks from "../cron_tasks.js";
import type * as crons from "../crons.js";
import type * as deployments from "../deployments.js";
import type * as experiences from "../experiences.js";
import type * as freep_automation from "../freep_automation.js";
import type * as freep_scraper from "../freep_scraper.js";
import type * as github_activity from "../github_activity.js";
import type * as job_applications from "../job_applications.js";
import type * as job_matching from "../job_matching.js";
import type * as jobs from "../jobs.js";
import type * as linearQueries from "../linearQueries.js";
import type * as linearSync from "../linearSync.js";
import type * as linearWebhook from "../linearWebhook.js";
import type * as media from "../media.js";
import type * as medium_scraper from "../medium_scraper.js";
import type * as portfolio from "../portfolio.js";
import type * as portfolioLeads from "../portfolioLeads.js";
import type * as projects from "../projects.js";
import type * as prolinker_dashboard from "../prolinker_dashboard.js";
import type * as prolinker_scraper from "../prolinker_scraper.js";
import type * as scraped_jobs from "../scraped_jobs.js";
import type * as seo_tracking from "../seo_tracking.js";
import type * as site_settings from "../site_settings.js";
import type * as skills from "../skills.js";
import type * as tasks from "../tasks.js";
import type * as templates from "../templates.js";
import type * as workflow_engine from "../workflow_engine.js";
import type * as workflow_engine_executor from "../workflow_engine_executor.js";
import type * as workflow_engine_templates from "../workflow_engine_templates.js";
import type * as workflows_old from "../workflows_old.js";

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
  application_templates: typeof application_templates;
  auto_apply_settings: typeof auto_apply_settings;
  blog_posts: typeof blog_posts;
  cleanup: typeof cleanup;
  content_calendar: typeof content_calendar;
  cron_tasks: typeof cron_tasks;
  crons: typeof crons;
  deployments: typeof deployments;
  experiences: typeof experiences;
  freep_automation: typeof freep_automation;
  freep_scraper: typeof freep_scraper;
  github_activity: typeof github_activity;
  job_applications: typeof job_applications;
  job_matching: typeof job_matching;
  jobs: typeof jobs;
  linearQueries: typeof linearQueries;
  linearSync: typeof linearSync;
  linearWebhook: typeof linearWebhook;
  media: typeof media;
  medium_scraper: typeof medium_scraper;
  portfolio: typeof portfolio;
  portfolioLeads: typeof portfolioLeads;
  projects: typeof projects;
  prolinker_dashboard: typeof prolinker_dashboard;
  prolinker_scraper: typeof prolinker_scraper;
  scraped_jobs: typeof scraped_jobs;
  seo_tracking: typeof seo_tracking;
  site_settings: typeof site_settings;
  skills: typeof skills;
  tasks: typeof tasks;
  templates: typeof templates;
  workflow_engine: typeof workflow_engine;
  workflow_engine_executor: typeof workflow_engine_executor;
  workflow_engine_templates: typeof workflow_engine_templates;
  workflows_old: typeof workflows_old;
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
