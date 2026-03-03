/**
 * ProLinker Dashboard Queries
 *
 * Comprehensive queries for the ProLinker admin dashboard
 */
import { v } from "convex/values";
import { query, mutation, action } from "./_generated/server";
import { api } from "./_generated/api";
import { requireAuth } from "./_helpers";
/**
 * Overview Stats
 * Returns high-level metrics for the dashboard
 */
export const overviewStats = query({
    args: {},
    handler: async (ctx) => {
        await requireAuth(ctx);
        const allJobs = await ctx.db
            .query("scraped_jobs")
            .filter((q) => q.eq(q.field("source"), "prolinker"))
            .collect();
        const activeJobs = allJobs.filter((j) => !j.archived);
        const now = Date.now();
        const oneDayAgo = now - 24 * 60 * 60 * 1000;
        const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;
        const newToday = activeJobs.filter((j) => j.scrapedAt >= oneDayAgo).length;
        const newThisWeek = activeJobs.filter((j) => j.scrapedAt >= sevenDaysAgo).length;
        // Get application stats
        const applications = await ctx.db.query("job_applications").collect();
        const autoApplied = applications.filter((a) => a.appliedVia === "auto-apply").length;
        const manualApplied = applications.length - autoApplied;
        // Calculate success rate (offers / applications)
        const offers = applications.filter((a) => a.status === "offer").length;
        const successRate = applications.length > 0
            ? Math.round((offers / applications.length) * 100)
            : 0;
        return {
            totalJobs: activeJobs.length,
            newToday,
            newThisWeek,
            archivedJobs: allJobs.length - activeJobs.length,
            totalApplications: applications.length,
            autoApplied,
            manualApplied,
            offers,
            successRate,
        };
    },
});
/**
 * Get all scraped jobs with optional filters and sorting
 */
export const listJobs = query({
    args: {
        location: v.optional(v.string()),
        techStack: v.optional(v.array(v.string())),
        minSalary: v.optional(v.number()),
        maxSalary: v.optional(v.number()),
        minScore: v.optional(v.number()),
        sortBy: v.optional(v.union(v.literal("score"), v.literal("date"), v.literal("salary"))),
        sortOrder: v.optional(v.union(v.literal("asc"), v.literal("desc"))),
        archived: v.optional(v.boolean()),
        limit: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        await requireAuth(ctx);
        let jobs = await ctx.db
            .query("scraped_jobs")
            .filter((q) => q.eq(q.field("source"), "prolinker"))
            .collect();
        // Filter by archived status
        if (args.archived !== undefined) {
            jobs = jobs.filter((j) => !!j.archived === args.archived);
        }
        else {
            jobs = jobs.filter((j) => !j.archived);
        }
        // Filter by location
        if (args.location) {
            jobs = jobs.filter((j) => j.location?.toLowerCase().includes(args.location.toLowerCase()));
        }
        // Filter by tech stack
        if (args.techStack && args.techStack.length > 0) {
            jobs = jobs.filter((j) => args.techStack.some((tech) => j.technologies.some((t) => t.toLowerCase().includes(tech.toLowerCase()))));
        }
        // Filter by salary (basic parse - assumes format like "€50,000 - €70,000")
        if (args.minSalary || args.maxSalary) {
            jobs = jobs.filter((j) => {
                if (!j.salary)
                    return false;
                const numbers = j.salary.match(/\d+(?:,\d+)?/g);
                if (!numbers || numbers.length === 0)
                    return false;
                const minSalary = parseInt(numbers[0].replace(/,/g, ""), 10);
                if (args.minSalary && minSalary < args.minSalary)
                    return false;
                if (args.maxSalary && minSalary > args.maxSalary)
                    return false;
                return true;
            });
        }
        // TODO: Calculate match scores when job_matching is implemented
        // For now, add a placeholder score field
        const jobsWithScores = jobs.map((j) => ({
            ...j,
            matchScore: 0, // Placeholder
        }));
        // Filter by score
        let filteredJobs = args.minScore
            ? jobsWithScores.filter((j) => j.matchScore >= args.minScore)
            : jobsWithScores;
        // Sort
        const sortBy = args.sortBy || "date";
        const sortOrder = args.sortOrder || "desc";
        filteredJobs.sort((a, b) => {
            let comparison = 0;
            if (sortBy === "score") {
                comparison = a.matchScore - b.matchScore;
            }
            else if (sortBy === "date") {
                comparison = a.scrapedAt - b.scrapedAt;
            }
            else if (sortBy === "salary") {
                const aSalary = a.salary ? parseInt(a.salary.match(/\d+(?:,\d+)?/)?.[0]?.replace(/,/g, "") || "0", 10) : 0;
                const bSalary = b.salary ? parseInt(b.salary.match(/\d+(?:,\d+)?/)?.[0]?.replace(/,/g, "") || "0", 10) : 0;
                comparison = aSalary - bSalary;
            }
            return sortOrder === "asc" ? comparison : -comparison;
        });
        // Limit results
        if (args.limit) {
            filteredJobs = filteredJobs.slice(0, args.limit);
        }
        return filteredJobs;
    },
});
/**
 * Get single job with full details
 */
export const getJob = query({
    args: { id: v.id("scraped_jobs") },
    handler: async (ctx, args) => {
        await requireAuth(ctx);
        const job = await ctx.db.get(args.id);
        if (!job)
            return null;
        // TODO: Calculate match score
        return {
            ...job,
            matchScore: 0, // Placeholder
        };
    },
});
/**
 * Get match score distribution for chart
 */
export const scoreDistribution = query({
    args: {},
    handler: async (ctx) => {
        await requireAuth(ctx);
        const jobs = await ctx.db
            .query("scraped_jobs")
            .filter((q) => q.eq(q.field("source"), "prolinker"))
            .filter((q) => q.neq(q.field("archived"), true))
            .collect();
        // TODO: Calculate real scores - for now return placeholder
        const distribution = [
            { range: "0-20", count: 0 },
            { range: "20-40", count: 0 },
            { range: "40-60", count: 0 },
            { range: "60-80", count: 0 },
            { range: "80-100", count: 0 },
        ];
        return distribution;
    },
});
/**
 * Get top matched jobs
 */
export const topMatches = query({
    args: { limit: v.optional(v.number()) },
    handler: async (ctx, args) => {
        await requireAuth(ctx);
        const jobs = await ctx.db
            .query("scraped_jobs")
            .filter((q) => q.eq(q.field("source"), "prolinker"))
            .filter((q) => q.neq(q.field("archived"), true))
            .collect();
        // TODO: Calculate real scores and sort
        const jobsWithScores = jobs.map((j) => ({
            ...j,
            matchScore: 0, // Placeholder
        }));
        return jobsWithScores
            .sort((a, b) => b.matchScore - a.matchScore)
            .slice(0, args.limit || 10);
    },
});
/**
 * Application history for auto-apply dashboard
 */
export const applicationHistory = query({
    args: {
        limit: v.optional(v.number()),
        appliedVia: v.optional(v.union(v.literal("manual"), v.literal("auto-apply"))),
    },
    handler: async (ctx, args) => {
        await requireAuth(ctx);
        let applications = await ctx.db
            .query("job_applications")
            .order("desc")
            .collect();
        if (args.appliedVia) {
            applications = applications.filter((a) => a.appliedVia === args.appliedVia);
        }
        if (args.limit) {
            applications = applications.slice(0, args.limit);
        }
        return applications;
    },
});
/**
 * Weekly performance data for chart
 */
export const weeklyPerformance = query({
    args: {},
    handler: async (ctx) => {
        await requireAuth(ctx);
        const applications = await ctx.db.query("job_applications").collect();
        const now = Date.now();
        const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;
        // Group by day
        const dayData = {};
        for (let i = 0; i < 7; i++) {
            const date = new Date(sevenDaysAgo + i * 24 * 60 * 60 * 1000);
            const dateStr = date.toISOString().split("T")[0];
            dayData[dateStr] = { date: dateStr, applied: 0, responses: 0 };
        }
        applications.forEach((app) => {
            if (app.appliedAt && app.appliedAt >= sevenDaysAgo) {
                const dateStr = new Date(app.appliedAt).toISOString().split("T")[0];
                if (dayData[dateStr]) {
                    dayData[dateStr].applied++;
                    if (app.status !== "applied" && app.status !== "discovered") {
                        dayData[dateStr].responses++;
                    }
                }
            }
        });
        return Object.values(dayData);
    },
});
/**
 * Scraper health metrics
 */
export const scraperHealth = query({
    args: {},
    handler: async (ctx) => {
        await requireAuth(ctx);
        // Get last run
        const lastRun = await ctx.db
            .query("analytics_log")
            .withIndex("by_event", (q) => q.eq("event", "prolinker_scraper_completed"))
            .order("desc")
            .first();
        // Get recent runs (last 10)
        const recentRuns = await ctx.db
            .query("analytics_log")
            .withIndex("by_event", (q) => q.eq("event", "prolinker_scraper_completed"))
            .order("desc")
            .take(10);
        // Calculate success/error rates
        const totalRuns = recentRuns.length;
        const successfulRuns = recentRuns.filter((r) => !r.metadata?.error).length;
        const successRate = totalRuns > 0 ? Math.round((successfulRuns / totalRuns) * 100) : 0;
        // Get error logs
        const errorLogs = await ctx.db
            .query("analytics_log")
            .withIndex("by_agent", (q) => q.eq("agent", "scraper"))
            .order("desc")
            .take(20);
        const errors = errorLogs.filter((log) => log.event.includes("error") || log.event === "prolinker_scraper_fatal_error");
        // Jobs per scrape trend
        const jobsPerScrape = recentRuns.map((run) => ({
            date: new Date(run.createdAt).toISOString().split("T")[0],
            count: run.metadata?.newJobs || 0,
            total: run.metadata?.totalJobs || 0,
        }));
        return {
            lastRunTime: lastRun?.createdAt || null,
            lastRunStatus: lastRun?.metadata?.error ? "error" : "success",
            lastRunStats: lastRun?.metadata || null,
            successRate,
            totalRuns,
            errors: errors.slice(0, 10),
            jobsPerScrape,
        };
    },
});
/**
 * Get unique technologies from scraped jobs for filter dropdown
 */
export const getTechnologies = query({
    args: {},
    handler: async (ctx) => {
        await requireAuth(ctx);
        const jobs = await ctx.db
            .query("scraped_jobs")
            .filter((q) => q.eq(q.field("source"), "prolinker"))
            .filter((q) => q.neq(q.field("archived"), true))
            .collect();
        const techSet = new Set();
        jobs.forEach((job) => {
            job.technologies.forEach((tech) => techSet.add(tech));
        });
        return Array.from(techSet).sort();
    },
});
/**
 * Get unique locations from scraped jobs for filter dropdown
 */
export const getLocations = query({
    args: {},
    handler: async (ctx) => {
        await requireAuth(ctx);
        const jobs = await ctx.db
            .query("scraped_jobs")
            .filter((q) => q.eq(q.field("source"), "prolinker"))
            .filter((q) => q.neq(q.field("archived"), true))
            .collect();
        const locationSet = new Set();
        jobs.forEach((job) => {
            if (job.location)
                locationSet.add(job.location);
        });
        return Array.from(locationSet).sort();
    },
});
/**
 * Archive a job
 */
export const archiveJob = mutation({
    args: { id: v.id("scraped_jobs") },
    handler: async (ctx, args) => {
        await requireAuth(ctx);
        await ctx.db.patch(args.id, { archived: true });
    },
});
/**
 * Blacklist a company
 */
export const blacklistCompany = mutation({
    args: { company: v.string() },
    handler: async (ctx, args) => {
        await requireAuth(ctx);
        const settings = await ctx.db.query("auto_apply_settings").first();
        if (settings) {
            const blacklist = [...(settings.blacklistCompanies || [])];
            if (!blacklist.includes(args.company)) {
                blacklist.push(args.company);
                await ctx.db.patch(settings._id, {
                    blacklistCompanies: blacklist,
                    updatedAt: Date.now(),
                });
            }
        }
        else {
            // Create settings if they don't exist
            await ctx.db.insert("auto_apply_settings", {
                mode: "manual",
                enabled: false,
                dailyLimit: 10,
                scoreThreshold: 70,
                companyCooldownDays: 30,
                blacklistCompanies: [args.company],
                blacklistKeywords: [],
                whitelistCompanies: [],
                requiredKeywords: [],
                dryRun: true,
                notifyOnApply: true,
                autoWithdrawOnBetter: false,
                weeklyReportEnabled: true,
                createdAt: Date.now(),
                updatedAt: Date.now(),
            });
        }
    },
});
/**
 * Export jobs to CSV
 */
export const exportToCSV = action({
    args: {
        filters: v.optional(v.object({
            location: v.optional(v.string()),
            techStack: v.optional(v.array(v.string())),
            minSalary: v.optional(v.number()),
            archived: v.optional(v.boolean()),
        })),
    },
    handler: async (ctx, args) => {
        // Query jobs with filters
        const jobs = await ctx.runQuery(api.prolinker_dashboard.listJobs, {
            ...args.filters,
        });
        // Convert to CSV format
        const headers = ["Title", "Company", "Location", "Salary", "Technologies", "Remote", "Scraped Date", "URL"];
        const rows = jobs.map((job) => [
            job.title,
            job.company,
            job.location || "",
            job.salary || "",
            job.technologies.join("; "),
            job.remote ? "Yes" : "No",
            new Date(job.scrapedAt).toISOString(),
            job.url,
        ]);
        const csv = [headers, ...rows]
            .map((row) => row.map((cell) => `"${cell}"`).join(","))
            .join("\n");
        return csv;
    },
});
/**
 * Trigger manual scraper run
 */
export const triggerScraper = action({
    args: {},
    handler: async (ctx) => {
        // Log the trigger
        await ctx.runMutation(api.prolinker_scraper.logTrigger, {
            triggeredBy: "admin-dashboard",
            method: "manual",
        });
        // TODO: Actually trigger the scraper script
        // This would need to call the scraper script or webhook
        return { success: true, message: "Scraper triggered" };
    },
});
