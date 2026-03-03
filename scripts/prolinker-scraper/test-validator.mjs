import { ConvexHttpClient } from "convex/browser";

const CONVEX_URL = process.env.CONVEX_URL || "https://hallowed-mole-286.eu-west-1.convex.cloud";
const convex = new ConvexHttpClient(CONVEX_URL);

// Test the validator fix - send an event with explicit createdAt
async function testValidator() {
  console.log("🧪 Testing analytics_log validator with createdAt field...\n");
  
  try {
    const testTimestamp = Date.now() - 60000; // 1 minute ago
    
    const result = await convex.mutation("analytics_log:push", {
      event: "test_validator_fix",
      agent: "orchestrator",
      metadata: { test: true, purpose: "verify_createdAt_acceptance" },
      createdAt: testTimestamp, // This should now be accepted!
    });
    
    console.log("✅ SUCCESS! Validator accepted createdAt field");
    console.log("📝 Event ID:", result);
    console.log("⏰ Timestamp:", new Date(testTimestamp).toISOString());
    console.log("\n🎉 The validator fix worked!");
    
    return true;
  } catch (error) {
    console.error("❌ FAILED:", error.message);
    console.error("\n💡 This means the validator still rejects createdAt");
    return false;
  }
}

testValidator().then(success => process.exit(success ? 0 : 1));
