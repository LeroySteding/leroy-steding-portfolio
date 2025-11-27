import { type NextRequest, NextResponse } from "next/server";
import { cvData } from "@/data/cv";
import { projects } from "@/data/projects";
import { createLead, getLeadByEmail } from "@/lib/supabase";

// Create a comprehensive context about Leroy for the AI
function getPortfolioContext(): string {
  const context = `
You are an AI assistant for Leroy Steding's portfolio website. You help visitors learn about Leroy's experience, skills, projects, and services.

# About Leroy Steding
${cvData.summary}

# Contact Information
- Name: ${cvData.personalInfo.name}
- Title: ${cvData.personalInfo.title}
- Location: ${cvData.personalInfo.location}
- Email: ${cvData.personalInfo.email}
- LinkedIn: ${cvData.personalInfo.linkedin}
- GitHub: ${cvData.personalInfo.github}
- Website: ${cvData.personalInfo.website}

# Core Expertise
${cvData.skills
  .map(
    (category) => `
## ${category.category}
${category.items.slice(0, 10).join(", ")}
`,
  )
  .join("\n")}

# Featured Projects
${projects
  .filter((p) => p.featured)
  .map(
    (project) => `
## ${project.title}
${project.description}
Technologies: ${project.technologies.join(", ")}
${project.impact ? `Impact: ${project.impact.join("; ")}` : ""}
`,
  )
  .join("\n")}

# Professional Experience
${cvData.experience
  .slice(0, 3)
  .map(
    (exp) => `
## ${exp.title} at ${exp.company}
${exp.period} | ${exp.location}
${exp.description}
Key achievements: ${exp.achievements.slice(0, 3).join("; ")}
`,
  )
  .join("\n")}

# Services Offered
- Full-Stack Web Development (React, Next.js, Node.js, Python)
- AI Integration & Automation (OpenAI, LangChain, RAG)
- E-Commerce Solutions (MedusaJS, Shopify, Headless Commerce)
- Mobile App Development (React Native, Cross-platform)
- Web Accessibility Consulting (WCAG Compliance)
- Technical Leadership & Mentoring
- Cloud Infrastructure & DevOps (AWS, Azure, Docker, Kubernetes)

# How to Work With Leroy
Visitors can contact Leroy through:
- Email: ${cvData.personalInfo.email}
- Contact page: /contact
- Schedule a call: https://calendly.com/leroysteding
- LinkedIn: ${cvData.personalInfo.linkedin}

# Personality & Approach
Leroy is passionate about building accessible, performant, and user-centered applications. He values clean code, best practices, and continuous learning. With 12+ years of experience, he combines technical expertise with strong communication skills to deliver solutions that create real business value.

# Important Guidelines
- Be helpful, professional, and friendly
- Provide specific examples from Leroy's experience when relevant
- If asked about services or collaboration, encourage visitors to reach out via the contact page
- If you don't know something specific, be honest and suggest they contact Leroy directly
- Focus on Leroy's strengths in full-stack development, AI integration, and e-commerce
- Highlight his commitment to accessibility, performance, and code quality
`;

  return context;
}

// Analyze conversation for lead intent signals
interface IntentAnalysis {
  hasProjectIntent: boolean;
  hasHiringIntent: boolean;
  hasCollaborationIntent: boolean;
  hasPricingIntent: boolean;
  hasUrgentNeed: boolean;
  intentScore: number; // 0-100
  detectedTopics: string[];
}

function analyzeConversationIntent(
  messages: Array<{ role: string; content: string }>,
): IntentAnalysis {
  const userMessages = messages
    .filter((m) => m.role === "user")
    .map((m) => m.content.toLowerCase())
    .join(" ");

  // Intent detection patterns
  const projectPatterns = [
    /\b(project|build|create|develop|website|app|application|platform|system)\b/,
    /\b(need|want|looking for|interested in)\b.*\b(developer|help|someone)\b/,
    /\b(can you|could you|would you)\b.*\b(build|create|help)\b/,
  ];

  const hiringPatterns = [
    /\b(hire|hiring|contract|freelance|consultant|available|availability)\b/,
    /\b(rate|rates|pricing|cost|budget|quote)\b/,
    /\b(full[- ]?time|part[- ]?time|remote|on[- ]?site)\b/,
  ];

  const collaborationPatterns = [
    /\b(collaborate|partnership|together|team up|joint)\b/,
    /\b(startup|venture|co-found|agency)\b/,
  ];

  const pricingPatterns = [
    /\b(price|pricing|cost|rate|rates|budget|quote|estimate|how much)\b/,
    /\b(affordable|expensive|cheap)\b/,
  ];

  const urgentPatterns = [
    /\b(urgent|asap|quickly|soon|deadline|rush|immediately)\b/,
    /\b(this week|next week|by monday|by friday)\b/,
  ];

  // Topic detection
  const topicPatterns: Record<string, RegExp> = {
    "web-development":
      /\b(website|web app|frontend|backend|full[- ]?stack|react|next\.?js|node)\b/,
    "ai-automation":
      /\b(ai|artificial intelligence|machine learning|automation|chatbot|gpt|openai)\b/,
    "e-commerce":
      /\b(e-?commerce|shop|store|shopify|medusa|payment|checkout)\b/,
    mobile: /\b(mobile|app|ios|android|react native|flutter)\b/,
    accessibility: /\b(accessibility|wcag|a11y|screen reader|ada compliance)\b/,
    consulting: /\b(consult|advice|strategy|audit|review)\b/,
  };

  const hasProjectIntent = projectPatterns.some((p) => p.test(userMessages));
  const hasHiringIntent = hiringPatterns.some((p) => p.test(userMessages));
  const hasCollaborationIntent = collaborationPatterns.some((p) =>
    p.test(userMessages),
  );
  const hasPricingIntent = pricingPatterns.some((p) => p.test(userMessages));
  const hasUrgentNeed = urgentPatterns.some((p) => p.test(userMessages));

  const detectedTopics = Object.entries(topicPatterns)
    .filter(([, pattern]) => pattern.test(userMessages))
    .map(([topic]) => topic);

  // Calculate intent score (0-100)
  let intentScore = 0;
  if (hasProjectIntent) intentScore += 30;
  if (hasHiringIntent) intentScore += 25;
  if (hasCollaborationIntent) intentScore += 20;
  if (hasPricingIntent) intentScore += 15;
  if (hasUrgentNeed) intentScore += 10;
  intentScore += Math.min(detectedTopics.length * 5, 20); // Up to 20 points for topics

  // Boost score based on conversation length (more engaged = higher intent)
  const messageCount = messages.filter((m) => m.role === "user").length;
  if (messageCount >= 3) intentScore += 10;
  if (messageCount >= 5) intentScore += 10;

  return {
    hasProjectIntent,
    hasHiringIntent,
    hasCollaborationIntent,
    hasPricingIntent,
    hasUrgentNeed,
    intentScore: Math.min(intentScore, 100),
    detectedTopics,
  };
}

// Extract email from conversation if mentioned
function extractEmailFromConversation(
  messages: Array<{ role: string; content: string }>,
): string | null {
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;

  for (const message of messages) {
    if (message.role === "user") {
      const match = message.content.match(emailRegex);
      if (match) return match[0];
    }
  }
  return null;
}

export async function POST(request: NextRequest) {
  try {
    const { messages, locale = "en", sessionId } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Messages array is required" },
        { status: 400 },
      );
    }

    const openaiApiKey = process.env.OPENAI_API_KEY?.trim();

    if (!openaiApiKey) {
      console.error(
        "OpenAI API key not configured. Please set OPENAI_API_KEY in .env.local",
      );
      return NextResponse.json(
        { error: "Chat service is not configured. Please check server logs." },
        { status: 503 },
      );
    }

    // Analyze conversation intent
    const intentAnalysis = analyzeConversationIntent(messages);
    const extractedEmail = extractEmailFromConversation(messages);

    // Build messages array with system context
    const systemMessage = {
      role: "system",
      content: `${getPortfolioContext()}

# Response Style Guidelines
- Keep responses concise and conversational (2-4 sentences for simple questions)
- Use bullet points sparingly - only for lists of 4+ items
- Avoid excessive formatting like numbered lists, bold text, or asterisks
- Write in a natural, friendly tone as if having a conversation
- For project details, focus on 1-2 key highlights rather than exhaustive lists
- End with a clear call-to-action when relevant (contact page, scheduling a call)
- Be helpful but brief - visitors can always ask follow-up questions

# Lead Capture Guidelines
- If a visitor expresses interest in working together, gently ask for their email to follow up
- If they mention a project or hiring need, encourage them to schedule a call or use the contact form
- Never be pushy, but naturally guide high-intent conversations toward action

# Language
- Respond in ${locale === "nl" ? "Dutch (Nederlands)" : "English"}
- Use appropriate cultural references and tone for ${locale === "nl" ? "Dutch" : "English"} audience
- Keep technical terms in English but explanations in the target language`,
    };

    // Call OpenAI API
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [systemMessage, ...messages],
        temperature: 0.7,
        max_tokens: 400,
        stream: false,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("OpenAI API error:", error);
      return NextResponse.json(
        { error: "Failed to generate response" },
        { status: 500 },
      );
    }

    const data = await response.json();
    const assistantMessage = data.choices[0]?.message;

    if (!assistantMessage) {
      return NextResponse.json(
        { error: "No response generated" },
        { status: 500 },
      );
    }

    // If we have an extracted email and high intent, create/update lead
    if (extractedEmail && intentAnalysis.intentScore >= 30) {
      const existingLead = await getLeadByEmail(extractedEmail);

      if (!existingLead) {
        // Create new lead from chat
        await createLead({
          email: extractedEmail,
          source: "chat",
          locale,
          metadata: {
            chat_session_id: sessionId,
            intent_score: intentAnalysis.intentScore,
            detected_intents: {
              project: intentAnalysis.hasProjectIntent,
              hiring: intentAnalysis.hasHiringIntent,
              collaboration: intentAnalysis.hasCollaborationIntent,
              pricing: intentAnalysis.hasPricingIntent,
              urgent: intentAnalysis.hasUrgentNeed,
            },
            detected_topics: intentAnalysis.detectedTopics,
            message_count: messages.filter(
              (m: { role: string }) => m.role === "user",
            ).length,
            conversation_summary: messages
              .filter((m: { role: string }) => m.role === "user")
              .slice(-3)
              .map((m: { content: string }) => m.content.substring(0, 100))
              .join(" | "),
            captured_at: new Date().toISOString(),
          },
        });
      }
    }

    return NextResponse.json({
      message: assistantMessage,
      usage: data.usage,
      // Include intent analysis for frontend (optional: can be used to show CTAs)
      intent: {
        score: intentAnalysis.intentScore,
        topics: intentAnalysis.detectedTopics,
        showContactCTA: intentAnalysis.intentScore >= 50,
      },
    });
  } catch (error) {
    console.error("Error in chat API:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 },
    );
  }
}
