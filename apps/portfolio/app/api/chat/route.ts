import { type NextRequest, NextResponse } from "next/server";
import { cvData } from "@/data/cv";
import { projects } from "@/data/projects";

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

export async function POST(request: NextRequest) {
  try {
    const { messages, locale = "en" } = await request.json();

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

    return NextResponse.json({
      message: assistantMessage,
      usage: data.usage,
    });
  } catch (error) {
    console.error("Error in chat API:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 },
    );
  }
}
