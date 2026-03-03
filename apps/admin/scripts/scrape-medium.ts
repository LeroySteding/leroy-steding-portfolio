/**
 * Medium Job Scraper
 * 
 * Scrapes job opportunities from Medium posts and engineering blogs.
 * Uses Anthropic Claude for intelligent job extraction from content.
 * 
 * Usage:
 *   tsx scripts/scrape-medium.ts
 */

import Anthropic from "@anthropic-ai/sdk";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../convex/_generated/api";

// Initialize Convex client
const convex = new ConvexHttpClient(process.env.CONVEX_URL!);

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

interface MediumPost {
  title: string;
  url: string;
  content: string;
  author: string;
  publishedAt: number;
  claps?: number;
  readTime?: number;
  tags?: string[];
}

interface ExtractedJob {
  company: string;
  position: string;
  location?: string;
  salary?: string;
  remote?: boolean;
  description?: string;
  skills?: string[];
  isJobPosting: boolean;
  confidence: number;
}

/**
 * Main scraper function
 */
async function scrapeMedium() {
  console.log("🔍 Starting Medium job scraper...\n");
  
  const keywords = [
    "we're hiring",
    "join our team",
    "software engineer position",
    "remote developer",
    "career opportunity",
    "engineering roles",
  ];
  
  try {
    // Step 1: Search Medium for relevant posts
    console.log("1️⃣ Searching Medium for job-related posts...");
    const posts = await searchMediumPosts(keywords);
    console.log(`   Found ${posts.length} potential posts\n`);
    
    if (posts.length === 0) {
      console.log("ℹ️  No posts found. This is expected in development.");
      console.log("   In production, this would search Medium RSS feeds and API.");
      return;
    }
    
    // Step 2: Analyze each post with Claude
    console.log("2️⃣ Analyzing posts with Claude AI...");
    const jobs: ExtractedJob[] = [];
    
    for (let i = 0; i < posts.length; i++) {
      const post = posts[i];
      console.log(`   [${i + 1}/${posts.length}] Analyzing: ${post.title}`);
      
      const extracted = await extractJobWithClaude(post);
      
      if (extracted.isJobPosting && extracted.confidence >= 0.7) {
        jobs.push(extracted);
        console.log(`   ✅ Job found: ${extracted.company} - ${extracted.position} (${Math.round(extracted.confidence * 100)}% confidence)`);
      } else {
        console.log(`   ⏭️  Not a job posting (${Math.round(extracted.confidence * 100)}% confidence)`);
      }
    }
    
    console.log(`\n   Found ${jobs.length} valid job postings\n`);
    
    // Step 3: Store jobs in Convex
    console.log("3️⃣ Storing jobs in database...");
    let storedCount = 0;
    
    for (const job of jobs) {
      try {
        // Find original post for metadata
        const post = posts.find(p => p.title.includes(job.position) || p.content.includes(job.company));
        
        await convex.mutation(api.medium_scraper.storeJob, {
          company: job.company,
          position: job.position,
          url: post?.url || `https://medium.com/search?q=${encodeURIComponent(job.company)}`,
          description: job.description,
          location: job.location,
          salary: job.salary,
          remote: job.remote,
          requiredSkills: job.skills,
          metadata: post ? {
            mediumPostUrl: post.url,
            author: post.author,
            publishedAt: post.publishedAt,
            claps: post.claps,
            readTime: post.readTime,
            tags: post.tags,
          } : undefined,
        });
        
        storedCount++;
        console.log(`   ✅ Stored: ${job.company} - ${job.position}`);
      } catch (error) {
        console.error(`   ❌ Error storing job:`, error);
      }
    }
    
    console.log(`\n✅ Medium scrape complete!`);
    console.log(`   📊 Summary:`);
    console.log(`      - Posts analyzed: ${posts.length}`);
    console.log(`      - Jobs found: ${jobs.length}`);
    console.log(`      - Jobs stored: ${storedCount}\n`);
    
  } catch (error) {
    console.error("\n❌ Error during Medium scrape:", error);
    throw error;
  }
}

/**
 * Search Medium for job-related posts
 * 
 * In production, this would:
 * 1. Use Medium's RSS feeds (https://medium.com/feed/@company)
 * 2. Search via Medium API if available
 * 3. Web scrape Medium search results
 * 
 * For now, returns empty array (implement when ready for production)
 */
async function searchMediumPosts(keywords: string[]): Promise<MediumPost[]> {
  // Production implementation would go here
  // Example sources:
  // - Medium RSS feeds: https://medium.com/feed/tag/hiring
  // - Medium search: https://medium.com/search?q=hiring+software+engineer
  // - Company engineering blogs: https://medium.com/@company
  
  // Return empty for now - replace with actual scraping when ready
  return [];
}

/**
 * Extract job details from Medium post using Claude
 */
async function extractJobWithClaude(post: MediumPost): Promise<ExtractedJob> {
  const prompt = `Analyze this Medium post and determine if it's a job posting. If so, extract the job details.

Title: ${post.title}

Content:
${post.content.slice(0, 3000)} ${post.content.length > 3000 ? '...(truncated)' : ''}

Author: ${post.author}
Tags: ${post.tags?.join(", ") || "none"}

Respond with JSON in this exact format:
{
  "isJobPosting": true/false,
  "confidence": 0.0-1.0,
  "company": "Company Name" or null,
  "position": "Job Title" or null,
  "location": "Location" or null,
  "salary": "Salary range" or null,
  "remote": true/false/null,
  "description": "Brief description" or null,
  "skills": ["skill1", "skill2"] or null
}

Rules:
- Set isJobPosting to true only if this is clearly a job advertisement
- Set confidence based on how certain you are (0.9+ for explicit "We're Hiring" posts)
- Extract company name even if it's the author
- Include both required and preferred skills
- Indicate if remote work is explicitly mentioned`;

  try {
    const response = await anthropic.messages.create({
      model: "claude-3-5-haiku-20241022",
      max_tokens: 1024,
      temperature: 0.3, // Lower temperature for more consistent extraction
      messages: [{
        role: "user",
        content: prompt,
      }],
    });
    
    // Extract JSON from response
    const content = response.content[0];
    if (content.type !== "text") {
      throw new Error("Unexpected response type from Claude");
    }
    
    // Parse JSON (handle potential markdown code blocks)
    let jsonText = content.text;
    const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      jsonText = jsonMatch[0];
    }
    
    const extracted = JSON.parse(jsonText);
    
    // Validate required fields
    if (typeof extracted.isJobPosting !== "boolean") {
      extracted.isJobPosting = false;
    }
    if (typeof extracted.confidence !== "number") {
      extracted.confidence = 0;
    }
    
    return extracted;
    
  } catch (error) {
    console.error("   ⚠️  Error extracting job with Claude:", error);
    return {
      isJobPosting: false,
      confidence: 0,
      company: "",
      position: "",
    };
  }
}

/**
 * Search specific company engineering blogs
 */
async function searchCompanyBlogs(companies: string[]) {
  const posts: MediumPost[] = [];
  
  for (const company of companies) {
    // In production: fetch RSS feed from https://medium.com/feed/@company
    // Parse XML and extract posts
    // Filter for recent posts (last 30 days)
  }
  
  return posts;
}

// Run scraper
if (require.main === module) {
  scrapeMedium()
    .then(() => {
      console.log("👋 Scraper finished successfully");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Scraper failed:", error);
      process.exit(1);
    });
}

export { scrapeMedium, extractJobWithClaude, searchMediumPosts };
