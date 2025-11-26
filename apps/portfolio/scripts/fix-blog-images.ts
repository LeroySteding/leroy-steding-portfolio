import { createClient } from "@sanity/client";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: ".env.local" });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "p6hg7krm",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

async function fixBlogImages() {
  console.log("🔧 Fixing blog post images...\n");

  try {
    // Fetch all posts where coverImage is a string (URL) instead of an image object
    const posts = await client.fetch(`*[_type == "post"]{
      _id,
      title,
      coverImage,
      coverImageUrl
    }`);

    console.log(`Found ${posts.length} blog posts\n`);

    for (const post of posts) {
      // Check if coverImage is a string (URL) - this is the broken state
      if (typeof post.coverImage === "string") {
        console.log(`📝 Fixing: ${post.title}`);
        console.log(`   Moving URL to coverImageUrl field`);

        // Move the URL to coverImageUrl and unset coverImage
        await client
          .patch(post._id)
          .set({ coverImageUrl: post.coverImage })
          .unset(["coverImage"])
          .commit();

        console.log(`   ✅ Fixed!\n`);
      } else if (post.coverImage?.asset) {
        console.log(`✅ OK: ${post.title} (has proper Sanity image)`);
      } else if (post.coverImageUrl) {
        console.log(`✅ OK: ${post.title} (has external URL)`);
      } else {
        console.log(`⚠️  No image: ${post.title}`);
      }
    }

    console.log("\n�� All blog post images fixed!");
  } catch (error) {
    console.error("❌ Error fixing images:", error);
    process.exit(1);
  }
}

fixBlogImages();
