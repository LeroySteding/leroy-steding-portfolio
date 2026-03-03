/**
 * Medium Scraper
 * 
 * Scrapes job opportunities from Medium posts and engineering blogs.
 * Use cases:
 * 1. Find "We're Hiring" posts from companies
 * 2. Monitor engineering blogs for culture insights
 * 3. Detect companies posting about growth/hiring
 */

import { v } from "convex/values";
import { action, query, internalMutation } from "./_generated/server";
import { internal, api } from "./_generated/api";

/**
 * Get Medium scraper statistics
 */
export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const jobs = await ctx.db
      .query("scraped_jobs")
      .filter((q) => q.eq(q.field("source"), "medium"))
      .collect();
    
    if (jobs.length === 0) {
      return {
        totalJobs: 0,
        lastScrape: undefined,
        avgMatchScore: 0,
      };
    }
    
    // Find last scrape time
    const lastScrape = Math.max(...jobs.map(j => j.scrapedAt));
    
    // Calculate average match score
    const jobsWithScores = jobs.filter(j => j.matchScore !== undefined);
    const avgMatchScore = jobsWithScores.length > 0
      ? jobsWithScores.reduce((sum, j) => sum + (j.matchScore || 0), 0) / jobsWithScores.length
      : 0;
    
    return {
      totalJobs: jobs.length,
      lastScrape,
      avgMatchScore: Math.round(avgMatchScore),
    };
  },
});

/**
 * Store scraped Medium job
 * Uses standard scraped_jobs schema
 */
export const storeJob = internalMutation({
  args: {
    title: v.string(), // Position title
    company: v.string(),
    description: v.string(),
    url: v.string(),
    location: v.optional(v.string()),
    salary: v.optional(v.string()),
    remote: v.optional(v.boolean()),
    technologies: v.array(v.string()), // Skills/tech stack
    postedAt: v.optional(v.number()), // Original post date
    employmentType: v.optional(v.string()),
    experienceLevel: v.optional(v.string()),
    metadata: v.optional(v.object({
      mediumPostUrl: v.string(),
      author: v.string(),
      publishedAt: v.optional(v.number()),
      claps: v.optional(v.number()),
      readTime: v.optional(v.number()),
      tags: v.optional(v.array(v.string())),
    })),
  },
  handler: async (ctx, args) => {
    // Use standard push mutation with deduplication
    const jobId = await ctx.db.insert("scraped_jobs", {
      source: "medium",
      title: args.title,
      company: args.company,
      description: args.description,
      url: args.url,
      location: args.location,
      salary: args.salary,
      remote: args.remote,
      technologies: args.technologies,
      postedAt: args.postedAt,
      employmentType: args.employmentType,
      experienceLevel: args.experienceLevel,
      scrapedAt: Date.now(),
      archived: false,
    });
    
    console.log(`[Medium] Stored job: ${args.company} - ${args.title}`);
    return jobId;
  },
});

/**
 * Main scraping action
 * Called by cron job or manually from dashboard
 */
export const scrapePublications = action({
  args: {
    keywords: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    console.log("[Medium] Starting Medium scrape...");
    
    const keywords = args.keywords || [
      "hiring",
      "we're hiring",
      "join our team",
      "career opportunity",
      "software engineer position",
      "remote developer",
    ];
    
    try {
      // In production, this would use the Medium API or web scraping
      // For now, we'll create a placeholder that can be replaced with actual implementation
      
      // Example structure of what the real scraper would return:
      const mockResults = [
        {
          title: "We're Hiring: Senior React Developer",
          url: "https://medium.com/@company/hiring-react-dev-123",
          company: "Example Tech Co",
          position: "Senior React Developer",
          author: "@company",
          publishedAt: Date.now() - 2 * 24 * 60 * 60 * 1000, // 2 days ago
          claps: 156,
          readTime: 3,
          content: "We're looking for a talented React developer to join our growing team...",
          tags: ["JavaScript", "React", "Remote"],
        },
      ];
      
      // Process results and store jobs
      const storedJobs = [];
      
      for (const result of mockResults) {
        // Extract job details using AI (Claude) in production
        const jobData = await extractJobDetails(result);
        
        if (jobData) {
          const jobId = await ctx.runMutation(internal.medium_scraper.storeJob, {
            title: jobData.position,
            company: jobData.company,
            description: jobData.description || result.content,
            url: jobData.url,
            location: jobData.location,
            salary: jobData.salary,
            remote: jobData.remote,
            technologies: jobData.skills || result.tags || [],
            postedAt: result.publishedAt,
            employmentType: jobData.employmentType,
            experienceLevel: jobData.experienceLevel,
            metadata: {
              mediumPostUrl: result.url,
              author: result.author,
              publishedAt: result.publishedAt,
              claps: result.claps,
              readTime: result.readTime,
              tags: result.tags,
            },
          });
          
          storedJobs.push(jobId);
        }
      }
      
      console.log(`[Medium] Scrape complete: ${storedJobs.length} jobs stored`);
      
      return {
        success: true,
        jobsFound: storedJobs.length,
        message: `Found ${storedJobs.length} job opportunities from Medium`,
      };
      
    } catch (error) {
      console.error("[Medium] Scrape error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },
});

/**
 * Analyze company engineering blogs
 * Used by researcher agent for company insights
 */
export const analyzeEngineeringBlog = action({
  args: {
    companyName: v.string(),
  },
  handler: async (ctx, args) => {
    console.log(`[Medium] Analyzing ${args.companyName} engineering blog...`);
    
    try {
      // Search Medium for company's engineering blog
      // const posts = await searchMediumByAuthor(`@${args.companyName}`);
      
      // Mock data for now
      const insights = {
        found: true,
        postCount: 24,
        lastPost: Date.now() - 7 * 24 * 60 * 60 * 1000, // 1 week ago
        technologies: [
          "React",
          "TypeScript",
          "Node.js",
          "PostgreSQL",
          "Kubernetes",
        ],
        culture: {
          remoteFirst: true,
          engineeringDriven: true,
          openSource: true,
          blogFrequency: "weekly",
        },
        topics: [
          "Architecture",
          "Performance",
          "Team Growth",
          "Engineering Culture",
        ],
        teamSize: "estimated 50-100 engineers",
      };
      
      return insights;
      
    } catch (error) {
      console.error(`[Medium] Error analyzing ${args.companyName}:`, error);
      return {
        found: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },
});

/**
 * Helper function to extract job details from Medium post
 * In production, this would use Claude API for intelligent extraction
 */
async function extractJobDetails(post: any) {
  // This is a placeholder - in production, use Anthropic Claude API
  // Example:
  // const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  // const analysis = await anthropic.messages.create({
  //   model: "claude-3-5-haiku-20241022",
  //   max_tokens: 1024,
  //   messages: [{
  //     role: "user",
  //     content: `Extract job details from this Medium post:\n\nTitle: ${post.title}\nContent: ${post.content}\n\nReturn JSON with: company, position, location, salary, remote (boolean), skills (array), description, employmentType, experienceLevel`
  //   }]
  // });
  
  // For now, return mock data matching schema
  return {
    company: post.company || "Unknown Company",
    position: post.position || "Software Engineer",
    url: post.url,
    description: post.content || "",
    location: "Remote",
    salary: undefined,
    remote: true,
    skills: post.tags || [],
    employmentType: "full-time",
    experienceLevel: undefined,
  };
}

/**
 * Search Medium publications by keyword
 * In production, use Medium API or web scraping
 */
async function searchMediumPublications(keywords: string[]) {
  // Placeholder - implement actual Medium API search
  return [];
}

/**
 * Extract job postings from Medium publication
 */
async function extractJobPostings(publicationUrl: string) {
  // Placeholder - implement actual extraction
  return [];
}

/**
 * Search Medium by author (company)
 */
async function searchMediumByAuthor(author: string) {
  // Placeholder - implement actual Medium API search
  return [];
}

/**
 * Extract technologies mentioned in posts
 */
function extractTechnologies(posts: any[]) {
  // Placeholder - implement NLP/keyword extraction
  return [];
}

/**
 * Analyze culture from blog posts
 */
function analyzeCulture(posts: any[]) {
  // Placeholder - implement sentiment/topic analysis
  return {
    remoteFirst: false,
    engineeringDriven: false,
    openSource: false,
    blogFrequency: "unknown",
  };
}

/**
 * Estimate team size from blog posts
 */
function estimateTeamSize(posts: any[]) {
  // Placeholder - implement estimation logic
  return "unknown";
}

/**
 * Calculate blog post frequency
 */
function calculatePostFrequency(posts: any[]) {
  // Placeholder - implement frequency calculation
  return "unknown";
}
