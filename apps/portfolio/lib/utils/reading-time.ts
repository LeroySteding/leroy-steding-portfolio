/**
 * Calculate reading time from text content
 * @param text - The text content to analyze (string or Tiptap JSON)
 * @param wordsPerMinute - Average reading speed (default: 200 wpm)
 * @returns Reading time in minutes (rounded up)
 */
export function calculateReadingTime(
  text: string | any,
  wordsPerMinute: number = 200,
): number {
  let plainText = "";

  // Handle different input formats
  if (typeof text === "string") {
    plainText = text;
  } else if (text && typeof text === "object") {
    // Handle Tiptap JSON format
    plainText = extractTextFromTiptap(text);
  }

  // Count words (split by whitespace and filter empty strings)
  const words = plainText.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  // Calculate reading time (minimum 1 minute)
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return Math.max(1, minutes);
}

/**
 * Format reading time as a human-readable string
 * @param minutes - Reading time in minutes
 * @returns Formatted string like "5 min read" or "1 min read"
 */
export function formatReadingTime(minutes: number): string {
  return `${minutes} min read`;
}

/**
 * Calculate and format reading time in one step
 * @param text - The text content to analyze
 * @param wordsPerMinute - Average reading speed (default: 200 wpm)
 * @returns Formatted reading time string
 */
export function getReadingTime(
  text: string | any,
  wordsPerMinute: number = 200,
): string {
  const minutes = calculateReadingTime(text, wordsPerMinute);
  return formatReadingTime(minutes);
}

/**
 * Extract plain text from Tiptap JSON structure
 * @param content - Tiptap JSON content
 * @returns Plain text string
 */
function extractTextFromTiptap(content: any): string {
  if (!content) return "";

  // Handle root document
  if (content.type === "doc" && Array.isArray(content.content)) {
    return content.content.map((node: any) => extractTextFromNode(node)).join(" ");
  }

  // Handle single node
  return extractTextFromNode(content);
}

/**
 * Recursively extract text from a Tiptap node
 * @param node - Tiptap node
 * @returns Plain text from node
 */
function extractTextFromNode(node: any): string {
  if (!node) return "";

  // Handle text nodes
  if (node.text) {
    return node.text;
  }

  // Handle nodes with content array
  if (Array.isArray(node.content)) {
    return node.content.map((child: any) => extractTextFromNode(child)).join(" ");
  }

  return "";
}
