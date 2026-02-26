#!/usr/bin/env node

/**
 * Test script for reading time calculator
 */

// Simulated reading time functions (same logic as in the actual utility)
function calculateReadingTime(text, wordsPerMinute = 200) {
  let plainText = "";

  if (typeof text === "string") {
    plainText = text;
  } else if (text && typeof text === "object") {
    plainText = extractTextFromTiptap(text);
  }

  const words = plainText.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return Math.max(1, minutes);
}

function formatReadingTime(minutes) {
  return `${minutes} min read`;
}

function extractTextFromTiptap(content) {
  if (!content) return "";
  if (content.type === "doc" && Array.isArray(content.content)) {
    return content.content.map((node) => extractTextFromNode(node)).join(" ");
  }
  return extractTextFromNode(content);
}

function extractTextFromNode(node) {
  if (!node) return "";
  if (node.text) return node.text;
  if (Array.isArray(node.content)) {
    return node.content.map((child) => extractTextFromNode(child)).join(" ");
  }
  return "";
}

// Test cases
const tests = [
  {
    name: "Very short post (50 words)",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. " +
          "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. " +
          "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris. " +
          "Nisi ut aliquip ex ea commodo consequat duis aute irure dolor in.",
    expected: 1, // Should round up to 1 min minimum
  },
  {
    name: "Short post (~200 words)",
    text: Array(200).fill("word").join(" "),
    expected: 1, // 200 words = 1 minute
  },
  {
    name: "Medium post (~500 words)",
    text: Array(500).fill("word").join(" "),
    expected: 3, // 500 words = 2.5 minutes, rounds to 3
  },
  {
    name: "Long post (~1000 words)",
    text: Array(1000).fill("word").join(" "),
    expected: 5, // 1000 words = 5 minutes
  },
  {
    name: "Very long post (~2000 words)",
    text: Array(2000).fill("word").join(" "),
    expected: 10, // 2000 words = 10 minutes
  },
  {
    name: "Tiptap JSON format",
    text: {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [
            { text: "This is a test paragraph with " },
            { text: Array(200).fill("word").join(" ") }
          ]
        },
        {
          type: "paragraph",
          content: [
            { text: "Another paragraph here." }
          ]
        }
      ]
    },
    expected: 2, // ~205 words = 2 minutes (rounded up)
  }
];

console.log("\n📚 Reading Time Calculator Tests\n");
console.log("Using 200 words/minute reading speed\n");

let passed = 0;
let failed = 0;

for (const test of tests) {
  const result = calculateReadingTime(test.text);
  const formatted = formatReadingTime(result);
  const wordCount = typeof test.text === "string" 
    ? test.text.split(/\s+/).filter(Boolean).length
    : "~" + extractTextFromTiptap(test.text).split(/\s+/).filter(Boolean).length;
  
  const status = result === test.expected ? "✅" : "❌";
  
  if (result === test.expected) {
    passed++;
    console.log(`${status} ${test.name}`);
    console.log(`   Words: ${wordCount} | Result: ${formatted} | Expected: ${test.expected} min read`);
  } else {
    failed++;
    console.log(`${status} ${test.name}`);
    console.log(`   Words: ${wordCount} | Result: ${formatted} | Expected: ${test.expected} min read`);
    console.log(`   ⚠️  FAILED: Got ${result} minutes, expected ${test.expected} minutes`);
  }
  console.log();
}

console.log("─".repeat(60));
console.log(`\nResults: ${passed} passed, ${failed} failed\n`);

if (failed === 0) {
  console.log("✨ All tests passed!\n");
  process.exit(0);
} else {
  console.log("❌ Some tests failed\n");
  process.exit(1);
}
