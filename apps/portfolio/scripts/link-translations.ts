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

// Mapping of EN slugs to NL slugs for blog posts (based on actual data)
const blogPostTranslations: Record<string, string> = {
  "ai-chat-widget-openai-nextjs": "ai-chat-widget-openai-nextjs-nl",
  "booking-system-calcom-calendly": "boekingssysteem-calcom-calendly",
  "multilingual-portfolio-nextjs": "meertalige-portfolio-nextjs",
  "nextjs-16-migration-guide": "nextjs-16-migratie-handleiding",
  "sanity-cms-nextjs-integration": "sanity-cms-nextjs-integratie",
  "building-scalable-nextjs-apps": "schaalbare-nextjs-apps-bouwen",
  "ai-automation-future": "ai-automatisering-toekomst",
  "react-server-components-deep-dive": "react-server-componenten-diepgaand",
  "typescript-advanced-patterns": "typescript-geavanceerde-patronen",
  "web-performance-optimization": "web-prestatie-optimalisatie",
  "building-design-systems": "design-systemen-bouwen",
};

async function linkTranslations() {
  console.log("🔗 Linking blog post translations...\n");

  try {
    // Fetch all posts
    const posts = await client.fetch<
      Array<{
        _id: string;
        title: string;
        slug: { current: string } | string;
        language: string;
      }>
    >(`*[_type == "post"]{
      _id,
      title,
      "slug": slug.current,
      language
    }`);

    console.log(`Found ${posts.length} blog posts\n`);

    // Group posts by slug
    const postsBySlug = new Map<string, (typeof posts)[0]>();
    for (const post of posts) {
      const slug =
        typeof post.slug === "string" ? post.slug : post.slug?.current;
      if (slug) {
        postsBySlug.set(slug, post);
      }
    }

    let linkedCount = 0;

    for (const [enSlug, nlSlug] of Object.entries(blogPostTranslations)) {
      const enPost = postsBySlug.get(enSlug);
      const nlPost = postsBySlug.get(nlSlug);

      if (enPost && nlPost) {
        console.log(`📝 Linking: "${enPost.title}"`);
        console.log(`   EN: ${enPost._id} (${enSlug})`);
        console.log(`   NL: ${nlPost._id} (${nlSlug})`);

        // Create translation metadata document
        // The @sanity/document-internationalization plugin uses a metadata document
        // to track which documents are translations of each other
        const baseId = enPost._id.replace("drafts.", "");
        const metadataId = `translation.metadata.${baseId}`;

        const translationMetadata = {
          _id: metadataId,
          _type: "translation.metadata",
          translations: [
            {
              _key: "en",
              value: {
                _type: "reference",
                _ref: enPost._id.replace("drafts.", ""),
              },
            },
            {
              _key: "nl",
              value: {
                _type: "reference",
                _ref: nlPost._id.replace("drafts.", ""),
              },
            },
          ],
        };

        await client.createOrReplace(translationMetadata);
        console.log(`   ✅ Linked!\n`);
        linkedCount++;
      } else {
        if (!enPost) console.log(`⚠️  EN post not found: ${enSlug}`);
        if (!nlPost) console.log(`⚠️  NL post not found: ${nlSlug}`);
      }
    }

    console.log(`\n🎉 Successfully linked ${linkedCount} translation pairs!`);
  } catch (error) {
    console.error("❌ Error linking translations:", error);
    process.exit(1);
  }
}

linkTranslations();
