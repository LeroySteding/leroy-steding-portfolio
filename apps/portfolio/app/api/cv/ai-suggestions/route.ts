import { type NextRequest, NextResponse } from "next/server";

// Clean GPT response from common AI-like formatting
function cleanGPTResponse(text: string): string {
  return (
    text
      // Remove markdown formatting
      .replace(/\*\*(.*?)\*\*/g, "$1") // Remove bold
      .replace(/\*(.*?)\*/g, "$1") // Remove italic
      .replace(/_{2}(.*?)_{2}/g, "$1") // Remove underline
      .replace(/`{1,3}(.*?)`{1,3}/g, "$1") // Remove code blocks

      // Remove common separators and dividers
      .replace(/^[-=_*]{3,}$/gm, "") // Remove lines like ---, ===, ***, ___
      .replace(/^[•·▪▫■□●○◆◇★☆]+\s*/gm, "") // Remove bullet points

      // Remove numbering patterns
      .replace(/^\d+[.)]\s*/gm, "") // Remove numbered lists like "1. " or "1) "

      // Remove "Here's" or "Here is" style introductions
      .replace(/^(here'?s?|here is)\s+/gi, "")

      // Remove meta-commentary
      .replace(
        /\(.*?(improved|enhanced|better|version|revised|updated).*?\)/gi,
        "",
      )

      // Clean up whitespace
      .replace(/\n{3,}/g, "\n\n") // Max 2 newlines
      .replace(/^\s+/gm, "") // Remove leading whitespace
      .replace(/\s+$/gm, "") // Remove trailing whitespace
      .trim()
      // Remove surrounding quotes if present
      .replace(/^["']|["']$/g, "")
  );
}

// Extract JSON array from GPT response that might have extra text
function extractSuggestionsArray(response: string): string[] {
  try {
    // Try to parse directly first
    const parsed = JSON.parse(response);
    if (Array.isArray(parsed)) {
      return parsed.map(cleanGPTResponse);
    }
  } catch {
    // If direct parsing fails, try to find JSON array in the text
    const jsonMatch = response.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[0]);
        if (Array.isArray(parsed)) {
          return parsed.map(cleanGPTResponse);
        }
      } catch {
        // Fall through to default
      }
    }
  }

  // Fallback: split by newlines and clean
  return response
    .split("\n")
    .filter((line) => line.trim().length > 0)
    .slice(0, 3)
    .map(cleanGPTResponse);
}

export async function POST(request: NextRequest) {
  try {
    const { field, content } = await request.json();

    if (!content) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 },
      );
    }

    // Check if OpenAI API key is configured
    const openaiApiKey = process.env.OPENAI_API_KEY;

    if (!openaiApiKey) {
      console.warn("OpenAI API key not configured, using mock suggestions");
      return generateMockResponse(content, field);
    }

    // Define prompts for different field types
    const promptMap: Record<string, string> = {
      summary: "professional summary for a CV/resume",
      description: "job description for a CV/resume",
      achievement: "achievement or accomplishment for a CV/resume",
      skill: "skill description for a CV/resume",
      default: "professional CV/resume content",
    };

    const fieldType = field.includes("summary")
      ? "summary"
      : field.includes("description")
        ? "description"
        : field.includes("achievement")
          ? "achievement"
          : field.includes("skill")
            ? "skill"
            : "default";

    const systemPrompt = `You are a professional CV/resume writer with expertise in creating compelling, achievement-focused content. Your responses must be:
1. Professional and formal in tone
2. Action-oriented with strong verbs
3. Focused on quantifiable results and business impact
4. Concise but impactful
5. Free from AI-like formatting (no asterisks, dashes, quotes, or meta-commentary)
6. Written in natural, professional language as if written by the candidate

CRITICAL: Return ONLY a valid JSON array of exactly 3 improved versions. No additional text, explanations, or formatting.`;

    const userPrompt = `Improve the following ${promptMap[fieldType]} by creating 3 different professional variations. Each variation should:
- Use strong action verbs (led, architected, delivered, achieved, implemented, etc.)
- Include specific, quantifiable results where possible
- Highlight business value and impact
- Be written in first person (past tense for completed work)
- Sound natural and human-written, not AI-generated

Original content:
"${content}"

Return format (JSON array only):
["improved version 1", "improved version 2", "improved version 3"]`;

    // Call OpenAI API
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.8,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("OpenAI API error:", error);
      return generateMockResponse(content, field);
    }

    const data = await response.json();
    const gptResponse = data.choices[0]?.message?.content;

    if (!gptResponse) {
      return generateMockResponse(content, field);
    }

    // Extract and clean suggestions
    const suggestions = extractSuggestionsArray(gptResponse);

    // Ensure we have exactly 3 suggestions
    while (suggestions.length < 3) {
      suggestions.push(content); // Use original as fallback
    }

    return NextResponse.json({
      original: content,
      suggestions: suggestions.slice(0, 3),
      reasoning: `AI-improved ${fieldType} with enhanced action verbs, quantifiable impact, and professional tone`,
    });
  } catch (error) {
    console.error("Error generating AI suggestions:", error);
    return NextResponse.json(
      { error: "Failed to generate suggestions" },
      { status: 500 },
    );
  }
}

function generateMockResponse(content: string, field: string) {
  const fieldType = field.includes("summary")
    ? "summary"
    : field.includes("description")
      ? "description"
      : field.includes("achievement")
        ? "achievement"
        : field.includes("skill")
          ? "skill"
          : "default";

  const suggestions: Record<string, string[]> = {
    summary: [
      `${content} Demonstrated ability to drive digital transformation and deliver high-impact solutions that exceed stakeholder expectations.`,
      `${content} Proven track record of architecting scalable systems, leading cross-functional teams, and delivering measurable business value through innovative technical solutions.`,
      `${content} Expert in leveraging cutting-edge technologies to solve complex business challenges, with consistent success in optimizing performance and enhancing user experiences.`,
    ],
    description: [
      `Led ${content.toLowerCase()}, resulting in 40% improvement in team productivity, code quality, and delivery timelines through systematic process optimization.`,
      `Architected and implemented ${content.toLowerCase()}, driving significant business value through enhanced system performance, reduced operational costs, and improved user engagement.`,
      `Spearheaded ${content.toLowerCase()}, delivering measurable impact through innovative technical solutions that improved efficiency by 35% and reduced technical debt by 50%.`,
    ],
    achievement: [
      `Achieved ${content.toLowerCase()}, exceeding performance targets by 25% and establishing new benchmarks for team excellence and delivery quality.`,
      `Delivered ${content.toLowerCase()}, generating €150K in annual cost savings through optimized resource allocation and automated workflows.`,
      `Implemented ${content.toLowerCase()}, resulting in 60% faster processing times, enhanced system reliability, and 95% user satisfaction scores.`,
    ],
    default: [
      `Enhanced: ${content} with measurable impact on system performance and user satisfaction.`,
      `Improved: ${content} through strategic optimization and implementation of industry best practices.`,
      `Optimized: ${content} resulting in significant efficiency gains and enhanced business outcomes.`,
    ],
  };

  return NextResponse.json({
    original: content,
    suggestions: suggestions[fieldType] || suggestions.default,
    reasoning: `Mock AI-improved ${fieldType} (OpenAI API key not configured)`,
  });
}
