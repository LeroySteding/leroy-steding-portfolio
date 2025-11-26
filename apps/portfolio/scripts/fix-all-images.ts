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

async function fixImages(
  docType: string,
  imageField: string,
  urlField: string,
) {
  console.log(`\n🔧 Fixing ${docType} ${imageField} fields...\n`);

  const docs = await client.fetch(
    `*[_type == "${docType}"]{_id, title, ${imageField}}`,
  );

  console.log(`Found ${docs.length} ${docType} documents\n`);

  let fixedCount = 0;

  for (const doc of docs) {
    const imageValue = doc[imageField];

    // Check if image is a string (URL) - this is the broken state
    if (typeof imageValue === "string" && imageValue.startsWith("http")) {
      console.log(`📝 Fixing: ${doc.title}`);
      console.log(`   Moving URL to ${urlField} field`);

      // Move the URL to the URL field and unset the image field
      await client
        .patch(doc._id)
        .set({ [urlField]: imageValue })
        .unset([imageField])
        .commit();

      console.log(`   ✅ Fixed!\n`);
      fixedCount++;
    } else if (imageValue?.asset) {
      console.log(`✅ OK: ${doc.title} (has proper Sanity image)`);
    } else if (!imageValue) {
      // Check if there's already a URL in the url field
      const urlDoc = await client.fetch(
        `*[_type == "${docType}" && _id == $id][0]{${urlField}}`,
        { id: doc._id },
      );
      if (urlDoc?.[urlField]) {
        console.log(`✅ OK: ${doc.title} (has external URL)`);
      } else {
        console.log(`⚠️  No image: ${doc.title}`);
      }
    }
  }

  return fixedCount;
}

async function main() {
  console.log("🖼️  Fixing all image fields across document types...\n");

  try {
    // Fix blog posts (already done, but run again to be safe)
    const postsFixed = await fixImages("post", "coverImage", "coverImageUrl");

    // Fix projects
    const projectsFixed = await fixImages("project", "image", "imageUrl");

    // Fix experiences
    const experiencesFixed = await fixImages(
      "experience",
      "companyLogo",
      "companyLogoUrl",
    );

    console.log("\n" + "=".repeat(50));
    console.log("🎉 Summary:");
    console.log(`   Posts fixed: ${postsFixed}`);
    console.log(`   Projects fixed: ${projectsFixed}`);
    console.log(`   Experiences fixed: ${experiencesFixed}`);
    console.log("=".repeat(50));
  } catch (error) {
    console.error("❌ Error fixing images:", error);
    process.exit(1);
  }
}

main();
