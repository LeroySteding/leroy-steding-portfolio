/**
 * Job Matching Engine
 * 
 * Intelligent job matching system that scores scraped jobs against user profiles.
 * Generates daily digests of top-matched opportunities.
 */

import { v } from "convex/values";
import { mutation, query, action } from "./_generated/server";
import { api, internal } from "./_generated/api";
import { Doc, Id } from "./_generated/dataModel";

// ============================================================================
// SCORING ALGORITHM
// ============================================================================

/**
 * Calculate tech stack match score (40% of total)
 * Weighted by proficiency and importance
 */
function calculateTechStackScore(
  jobTechnologies: string[],
  preferences: Doc<"job_preferences">["techStackPreferences"]
): {
  score: number;
  matched: string[];
  missing: string[];
} {
  if (!preferences || preferences.length === 0) {
    return { score: 0, matched: [], missing: [] };
  }

  const normalizedJobTech = jobTechnologies.map((t) => t.toLowerCase());
  let totalWeight = 0;
  let achievedWeight = 0;
  const matched: string[] = [];
  const missing: string[] = [];

  for (const pref of preferences) {
    const weight = pref.proficiency * (pref.importance === "required" ? 1.5 : pref.importance === "preferred" ? 1.2 : 1.0);
    totalWeight += weight;

    const skillNormalized = pref.skill.toLowerCase();
    const isMatch = normalizedJobTech.some((tech) => tech.includes(skillNormalized) || skillNormalized.includes(tech));

    if (isMatch) {
      achievedWeight += weight;
      matched.push(pref.skill);
    } else {
      missing.push(pref.skill);
    }
  }

  const score = totalWeight > 0 ? (achievedWeight / totalWeight) * 40 : 0;
  return { score, matched, missing };
}

/**
 * Calculate location score (20% of total)
 */
function calculateLocationScore(
  jobLocation: string | undefined,
  jobRemote: boolean | undefined,
  preferences: Doc<"job_preferences">
): { score: number; flags: string[] } {
  const flags: string[] = [];
  let score = 0;

  // Handle remote preference
  if (jobRemote) {
    if (preferences.remotePreference === "required") {
      score = 20;
      flags.push("remote_match");
    } else if (preferences.remotePreference === "preferred") {
      score = 18;
      flags.push("remote_match");
    } else {
      score = 15;
    }
    return { score, flags };
  }

  // Handle location matching
  if (!jobLocation) {
    score = preferences.remotePreference === "no_preference" ? 10 : 5;
    return { score, flags };
  }

  const normalizedJobLocation = jobLocation.toLowerCase();
  const locationMatch = preferences.preferredLocations.some((loc) =>
    normalizedJobLocation.includes(loc.toLowerCase()) || loc.toLowerCase().includes(normalizedJobLocation)
  );

  if (locationMatch) {
    score = 20;
    flags.push("location_match");
  } else if (preferences.remotePreference === "acceptable") {
    score = 8;
  } else {
    score = 3;
  }

  return { score, flags };
}

/**
 * Calculate salary score (15% of total)
 */
function calculateSalaryScore(
  jobSalary: string | undefined,
  preferences: Doc<"job_preferences">
): { score: number; flags: string[] } {
  const flags: string[] = [];

  if (!jobSalary || (!preferences.minSalary && !preferences.maxSalary)) {
    return { score: 7.5, flags }; // Neutral score when no data
  }

  // Extract numbers from salary string (e.g., "€50k-€70k", "$80,000 - $100,000")
  const numbers = jobSalary.match(/\d+[,\.]?\d*/g)?.map((n) => parseFloat(n.replace(/,/g, ""))) || [];
  if (numbers.length === 0) {
    return { score: 7.5, flags };
  }

  // Assume salary range or single value
  const salaryMin = Math.min(...numbers) * (jobSalary.toLowerCase().includes("k") ? 1000 : 1);
  const salaryMax = numbers.length > 1 ? Math.max(...numbers) * (jobSalary.toLowerCase().includes("k") ? 1000 : 1) : salaryMin;

  let score = 15;

  // Check if salary meets minimum
  if (preferences.minSalary && salaryMax < preferences.minSalary) {
    score = 2;
    flags.push("below_min_salary");
  }

  // Check if salary exceeds maximum
  if (preferences.maxSalary && salaryMin > preferences.maxSalary) {
    score = 5;
    flags.push("above_max_salary");
  }

  // Perfect match if within range
  if (
    (!preferences.minSalary || salaryMax >= preferences.minSalary) &&
    (!preferences.maxSalary || salaryMin <= preferences.maxSalary)
  ) {
    score = 15;
    flags.push("salary_match");
  }

  return { score, flags };
}

/**
 * Calculate company preference score (10% of total)
 */
function calculateCompanyScore(
  jobCompany: string,
  preferences: Doc<"job_preferences">
): { score: number; flags: string[] } {
  const flags: string[] = [];
  const normalizedCompany = jobCompany.toLowerCase();

  // Check if company should be avoided
  if (preferences.avoidCompanies.some((c) => normalizedCompany.includes(c.toLowerCase()))) {
    flags.push("avoid_company");
    return { score: 0, flags };
  }

  // Check if company is targeted
  if (preferences.targetCompanies.some((c) => normalizedCompany.includes(c.toLowerCase()))) {
    flags.push("target_company");
    return { score: 10, flags };
  }

  return { score: 5, flags }; // Neutral
}

/**
 * Calculate keyword score (10% of total)
 */
function calculateKeywordScore(
  jobTitle: string,
  jobDescription: string,
  preferences: Doc<"job_preferences">
): { score: number; flags: string[]; matched: string[] } {
  const flags: string[] = [];
  const matched: string[] = [];
  const combinedText = `${jobTitle} ${jobDescription}`.toLowerCase();

  // Check avoid keywords first
  if (preferences.avoidKeywords.some((kw) => combinedText.includes(kw.toLowerCase()))) {
    flags.push("contains_avoid_keyword");
    return { score: 0, flags, matched };
  }

  let score = 10;

  // Check required keywords
  if (preferences.requiredKeywords.length > 0) {
    const requiredMatches = preferences.requiredKeywords.filter((kw) => {
      const match = combinedText.includes(kw.toLowerCase());
      if (match) matched.push(kw);
      return match;
    });

    if (requiredMatches.length === 0) {
      flags.push("missing_required_keywords");
      score = 0;
    } else if (requiredMatches.length === preferences.requiredKeywords.length) {
      flags.push("all_required_keywords_match");
      score = 10;
    } else {
      score = (requiredMatches.length / preferences.requiredKeywords.length) * 10;
    }
  }

  // Check preferred titles
  if (preferences.preferredTitles.length > 0) {
    const titleMatch = preferences.preferredTitles.some((title) =>
      jobTitle.toLowerCase().includes(title.toLowerCase())
    );
    if (titleMatch) {
      flags.push("preferred_title_match");
      score = Math.max(score, 8);
    }
  }

  return { score, flags, matched };
}

/**
 * Calculate experience level score (5% of total)
 */
function calculateExperienceScore(
  jobExperienceLevel: string | undefined,
  preferences: Doc<"job_preferences">
): { score: number; flags: string[] } {
  const flags: string[] = [];

  if (!jobExperienceLevel || preferences.targetExperienceLevel.length === 0) {
    return { score: 2.5, flags }; // Neutral
  }

  const normalizedLevel = jobExperienceLevel.toLowerCase();
  const match = preferences.targetExperienceLevel.some((level) =>
    normalizedLevel.includes(level.toLowerCase())
  );

  if (match) {
    flags.push("experience_level_match");
    return { score: 5, flags };
  }

  return { score: 1, flags };
}

/**
 * Calculate overall match score for a job
 */
export function calculateJobMatchScore(
  job: Doc<"scraped_jobs">,
  preferences: Doc<"job_preferences">
) {
  const techStack = calculateTechStackScore(job.technologies, preferences.techStackPreferences);
  const location = calculateLocationScore(job.location, job.remote, preferences);
  const salary = calculateSalaryScore(job.salary, preferences);
  const company = calculateCompanyScore(job.company, preferences);
  const keywords = calculateKeywordScore(job.title, job.description, preferences);
  const experience = calculateExperienceScore(job.experienceLevel, preferences);

  const totalScore = techStack.score + location.score + salary.score + company.score + keywords.score + experience.score;

  return {
    score: Math.round(totalScore * 10) / 10, // Round to 1 decimal
    breakdown: {
      techStackScore: techStack.score,
      locationScore: location.score,
      salaryScore: salary.score,
      companyScore: company.score,
      keywordScore: keywords.score,
      experienceScore: experience.score,
    },
    details: {
      matchedTechnologies: techStack.matched,
      missingTechnologies: techStack.missing,
      matchedKeywords: keywords.matched,
      flags: [
        ...techStack.matched.map((t) => `tech:${t}`),
        ...location.flags,
        ...salary.flags,
        ...company.flags,
        ...keywords.flags,
        ...experience.flags,
      ],
    },
  };
}

// ============================================================================
// QUERIES & MUTATIONS
// ============================================================================

/**
 * Get or create user job preferences
 */
export const getUserPreferences = query({
  args: { userId: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const userId = args.userId || "leroy"; // Default to Leroy's profile

    const preferences = await ctx.db
      .query("job_preferences")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .first();

    return preferences;
  },
});

/**
 * Create or update user job preferences
 */
export const saveUserPreferences = mutation({
  args: {
    userId: v.optional(v.string()),
    preferredLocations: v.optional(v.array(v.string())),
    remotePreference: v.optional(
      v.union(v.literal("required"), v.literal("preferred"), v.literal("acceptable"), v.literal("no_preference"))
    ),
    minSalary: v.optional(v.number()),
    maxSalary: v.optional(v.number()),
    salaryCurrency: v.optional(v.string()),
    techStackPreferences: v.optional(
      v.array(
        v.object({
          skill: v.string(),
          proficiency: v.number(),
          importance: v.union(v.literal("required"), v.literal("preferred"), v.literal("nice_to_have")),
        })
      )
    ),
    targetCompanies: v.optional(v.array(v.string())),
    avoidCompanies: v.optional(v.array(v.string())),
    preferredTitles: v.optional(v.array(v.string())),
    requiredKeywords: v.optional(v.array(v.string())),
    avoidKeywords: v.optional(v.array(v.string())),
    targetExperienceLevel: v.optional(v.array(v.string())),
    employmentTypes: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const userId = args.userId || "leroy";
    const now = Date.now();

    const existing = await ctx.db
      .query("job_preferences")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .first();

    const updates: any = { ...args, userId, updatedAt: now };
    delete updates.userId; // Don't overwrite userId field

    if (existing) {
      await ctx.db.patch(existing._id, updates);
      return existing._id;
    } else {
      return await ctx.db.insert("job_preferences", {
        userId,
        preferredLocations: args.preferredLocations || [],
        remotePreference: args.remotePreference || "preferred",
        techStackPreferences: args.techStackPreferences || [],
        targetCompanies: args.targetCompanies || [],
        avoidCompanies: args.avoidCompanies || [],
        preferredTitles: args.preferredTitles || [],
        requiredKeywords: args.requiredKeywords || [],
        avoidKeywords: args.avoidKeywords || [],
        targetExperienceLevel: args.targetExperienceLevel || [],
        employmentTypes: args.employmentTypes || [],
        minSalary: args.minSalary,
        maxSalary: args.maxSalary,
        salaryCurrency: args.salaryCurrency,
        createdAt: now,
        updatedAt: now,
      });
    }
  },
});

/**
 * Match jobs against user preferences
 */
export const matchJobs = query({
  args: {
    userId: v.optional(v.string()),
    minScore: v.optional(v.number()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = args.userId || "leroy";
    const minScore = args.minScore || 50; // Default minimum score
    const limit = args.limit || 50;

    // Get user preferences
    const preferences = await ctx.db
      .query("job_preferences")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .first();

    if (!preferences) {
      return [];
    }

    // Get active (non-archived) jobs
    const jobs = await ctx.db
      .query("scraped_jobs")
      .filter((q) => q.neq(q.field("archived"), true))
      .collect();

    // Calculate scores
    const scoredJobs = jobs
      .map((job) => {
        const matchResult = calculateJobMatchScore(job, preferences);
        return {
          ...job,
          matchScore: matchResult.score,
          ...matchResult.breakdown,
          matchDetails: matchResult.details,
        };
      })
      .filter((job) => job.matchScore >= minScore)
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, limit);

    return scoredJobs;
  },
});

/**
 * Save match scores to database
 */
export const saveMatchScores = mutation({
  args: {
    userId: v.optional(v.string()),
    minScore: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = args.userId || "leroy";
    const minScore = args.minScore || 50;

    const preferences = await ctx.db
      .query("job_preferences")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .first();

    if (!preferences) {
      throw new Error("User preferences not found");
    }

    const jobs = await ctx.db
      .query("scraped_jobs")
      .filter((q) => q.neq(q.field("archived"), true))
      .collect();

    let savedCount = 0;
    const now = Date.now();

    for (const job of jobs) {
      const matchResult = calculateJobMatchScore(job, preferences);

      if (matchResult.score >= minScore) {
        // Check if match already exists
        const existingMatch = await ctx.db
          .query("job_matches")
          .withIndex("by_job_id", (q) => q.eq("jobId", job._id))
          .filter((q) => q.eq(q.field("userId"), userId))
          .first();

        if (!existingMatch) {
          await ctx.db.insert("job_matches", {
            jobId: job._id,
            userId,
            score: matchResult.score,
            techStackScore: matchResult.breakdown.techStackScore,
            locationScore: matchResult.breakdown.locationScore,
            salaryScore: matchResult.breakdown.salaryScore,
            companyScore: matchResult.breakdown.companyScore,
            keywordScore: matchResult.breakdown.keywordScore,
            experienceScore: matchResult.breakdown.experienceScore,
            matchDetails: matchResult.details,
            createdAt: now,
          });
          savedCount++;
        }
      }
    }

    return { savedCount, totalJobs: jobs.length };
  },
});

/**
 * Get matched jobs with full job data
 */
export const getMatchedJobs = query({
  args: {
    userId: v.optional(v.string()),
    minScore: v.optional(v.number()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = args.userId || "leroy";
    const minScore = args.minScore || 50;
    const limit = args.limit || 10;

    // Get matches
    let matches = await ctx.db
      .query("job_matches")
      .withIndex("by_user_score", (q) => q.eq("userId", userId))
      .filter((q) => q.gte(q.field("score"), minScore))
      .order("desc")
      .take(limit);

    // Enrich with job data
    const enrichedMatches = await Promise.all(
      matches.map(async (match) => {
        const job = await ctx.db.get(match.jobId);
        return { ...match, job };
      })
    );

    return enrichedMatches.filter((m) => m.job && !m.job.archived);
  },
});

/**
 * Generate daily digest
 */
export const generateDailyDigest = query({
  args: {
    userId: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = args.userId || "leroy";
    const limit = args.limit || 10;

    const preferences = await ctx.db
      .query("job_preferences")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .first();

    if (!preferences) {
      return { message: "No preferences found", jobs: [] };
    }

    // Get jobs from last 24 hours
    const twentyFourHoursAgo = Date.now() - 24 * 60 * 60 * 1000;
    const recentJobs = await ctx.db
      .query("scraped_jobs")
      .withIndex("by_scraped_at")
      .filter((q) => q.gte(q.field("scrapedAt"), twentyFourHoursAgo))
      .filter((q) => q.neq(q.field("archived"), true))
      .collect();

    // Score and sort
    const scoredJobs = recentJobs
      .map((job) => {
        const matchResult = calculateJobMatchScore(job, preferences);
        return {
          ...job,
          matchScore: matchResult.score,
          ...matchResult.breakdown,
          matchDetails: matchResult.details,
        };
      })
      .filter((job) => job.matchScore >= 50) // Only show jobs with 50+ score
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, limit);

    return {
      message: `Found ${scoredJobs.length} new matches in the last 24 hours`,
      jobs: scoredJobs,
      totalScraped: recentJobs.length,
    };
  },
});

// ============================================================================
// ACTIONS
// ============================================================================

/**
 * Initialize user profile from skills table (one-time setup)
 */
export const initializeProfileFromSkills = mutation({
  args: { userId: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const userId = args.userId || "leroy";

    // Get all skills
    const skills = await ctx.db.query("skills").collect();

    // Convert skills to tech stack preferences
    const techStackPreferences = skills
      .filter((skill) => skill.proficiency >= 50) // Only include skills with 50+ proficiency
      .map((skill) => ({
        skill: skill.name,
        proficiency: skill.proficiency,
        importance: (skill.proficiency >= 80 ? "required" : skill.proficiency >= 65 ? "preferred" : "nice_to_have") as
          | "required"
          | "preferred"
          | "nice_to_have",
      }));

    // Create default profile for Leroy
    const defaultProfile = {
      userId,
      preferredLocations: ["Amsterdam", "Netherlands", "Remote"],
      remotePreference: "preferred" as const,
      minSalary: 60000,
      maxSalary: 90000,
      salaryCurrency: "EUR",
      techStackPreferences,
      targetCompanies: ["Vercel", "Linear", "Stripe", "Cloudflare", "GitHub"],
      avoidCompanies: [],
      preferredTitles: [
        "Full Stack Developer",
        "Frontend Developer",
        "Senior Developer",
        "Lead Developer",
        "Software Engineer",
      ],
      requiredKeywords: [],
      avoidKeywords: ["outsourcing", "offshore", "junior"],
      targetExperienceLevel: ["mid", "senior", "lead"],
      employmentTypes: ["full-time", "contract"],
    };

    // Check if profile exists
    const existing = await ctx.db
      .query("job_preferences")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, { ...defaultProfile, updatedAt: Date.now() });
      return { action: "updated", profileId: existing._id };
    } else {
      const profileId = await ctx.db.insert("job_preferences", {
        ...defaultProfile,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
      return { action: "created", profileId };
    }
  },
});

/**
 * Action: Run daily matching and save results
 */
export const runDailyMatching = action({
  args: { userId: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const userId = args.userId || "leroy";
    const result = await ctx.runMutation(api.job_matching.saveMatchScores, { userId, minScore: 50 });
    return result;
  },
});
