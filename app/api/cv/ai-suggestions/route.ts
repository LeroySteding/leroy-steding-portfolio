import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { field, content } = await request.json();

    if (!content) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }

    // Define prompts for different field types
    const promptMap: Record<string, string> = {
      summary: "professional summary for a CV",
      description: "job description for a CV",
      achievement: "achievement or accomplishment for a CV",
      skill: "skill description for a CV",
      default: "professional CV content",
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

    const prompt = `You are a professional CV/resume writer. Improve the following ${promptMap[fieldType]} to make it more compelling, professional, and achievement-focused. Provide 3 different variations that:

1. Use strong action verbs and quantifiable results
2. Highlight impact and business value
3. Are concise but impactful
4. Follow professional CV writing best practices

Original content: "${content}"

Return ONLY a JSON array of 3 improved versions, nothing else. Format:
["improved version 1", "improved version 2", "improved version 3"]`;

    // In a real implementation, this would call OpenAI API
    // For now, we'll provide mock suggestions
    const suggestions = generateMockSuggestions(content, fieldType);

    return NextResponse.json({
      original: content,
      suggestions,
      reasoning: `Improved ${fieldType} with stronger action verbs and quantifiable impact`,
    });
  } catch (error) {
    console.error("Error generating AI suggestions:", error);
    return NextResponse.json(
      { error: "Failed to generate suggestions" },
      { status: 500 }
    );
  }
}

function generateMockSuggestions(content: string, fieldType: string): string[] {
  // Mock suggestions based on field type
  // In production, this would be replaced with actual OpenAI API call
  
  const suggestions: Record<string, string[]> = {
    summary: [
      `${content} Demonstrated ability to drive digital transformation and deliver high-impact solutions.`,
      `${content} Proven track record of architecting scalable systems and leading cross-functional teams to success.`,
      `${content} Expert in leveraging cutting-edge technologies to solve complex business challenges and exceed stakeholder expectations.`,
    ],
    description: [
      `Led ${content.toLowerCase()}, resulting in 40% improvement in team productivity and code quality.`,
      `Architected and implemented ${content.toLowerCase()}, driving significant business value and user engagement.`,
      `Spearheaded ${content.toLowerCase()}, delivering measurable impact through innovative technical solutions.`,
    ],
    achievement: [
      `Achieved ${content.toLowerCase()}, exceeding performance targets by 25% and setting new team benchmarks.`,
      `Delivered ${content.toLowerCase()}, generating significant cost savings and operational efficiency improvements.`,
      `Implemented ${content.toLowerCase()}, resulting in enhanced system performance and user satisfaction scores.`,
    ],
    default: [
      `Enhanced: ${content}`,
      `Improved: ${content} with measurable impact`,
      `Professional version: ${content} - demonstrating expertise and value`,
    ],
  };

  return suggestions[fieldType] || suggestions.default;
}
