import { resolve } from "node:path";
import { createClient } from "@sanity/client";
import { config } from "dotenv";

// Load environment variables
config({ path: resolve(__dirname, "../../../.env.local") });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "p6hg7krm",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
  apiVersion: "2024-01-01",
});

// Cover images for each tutorial (using high-quality Unsplash images)
const coverImages: Record<string, string> = {
  // Next.js 16 Migration
  "tutorial-nextjs-16-migration-en":
    "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=630&fit=crop",
  "tutorial-nextjs-16-migration-nl":
    "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=630&fit=crop",

  // Sanity CMS Integration
  "tutorial-sanity-nextjs-en":
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=630&fit=crop",
  "tutorial-sanity-nextjs-nl":
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=630&fit=crop",

  // Multilingual Portfolio
  "tutorial-multilingual-portfolio-en":
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&h=630&fit=crop",
  "tutorial-multilingual-portfolio-nl":
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&h=630&fit=crop",

  // AI Chat Integration
  "tutorial-ai-chat-integration-en":
    "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=630&fit=crop",
  "tutorial-ai-chat-integration-nl":
    "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=630&fit=crop",

  // Booking Integration
  "tutorial-booking-integration-en":
    "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=1200&h=630&fit=crop",
  "tutorial-booking-integration-nl":
    "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=1200&h=630&fit=crop",
};

async function updateBlogImages() {
  console.log("🖼️  Updating blog post cover images...\n");

  try {
    for (const [postId, imageUrl] of Object.entries(coverImages)) {
      console.log(`📝 Updating: ${postId}`);

      await client.patch(postId).set({ coverImage: imageUrl }).commit();

      console.log(`   ✅ Updated with image\n`);
    }

    console.log("🎉 All cover images updated successfully!");
  } catch (error) {
    console.error("❌ Error updating images:", error);
    process.exit(1);
  }
}

updateBlogImages();
