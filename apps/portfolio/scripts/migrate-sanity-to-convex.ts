/**
 * Migration script: Sanity → Convex
 *
 * Exports content from Sanity and imports it into Convex.
 * Run: npx tsx apps/portfolio/scripts/migrate-sanity-to-convex.ts
 *
 * Requires:
 *   CONVEX_URL=https://hallowed-mole-286.eu-west-1.convex.cloud
 *   (Sanity project ID is hardcoded: p6hg7krm, dataset: production)
 */

const SANITY_PROJECT_ID = "p6hg7krm";
const SANITY_DATASET = "production";
const SANITY_API_VERSION = "2024-01-01";
const CONVEX_URL =
  process.env.CONVEX_URL ?? "https://hallowed-mole-286.eu-west-1.convex.cloud";

async function sanityFetch(query: string) {
  const url = `https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VERSION}/data/query/${SANITY_DATASET}?query=${encodeURIComponent(query)}`;
  const res = await fetch(url);
  const data = await res.json();
  return data.result;
}

async function convexMutation(
  functionName: string,
  args: Record<string, unknown>,
) {
  const res = await fetch(`${CONVEX_URL}/api/mutation`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ path: functionName, args, format: "json" }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Convex mutation ${functionName} failed: ${text}`);
  }
  return res.json();
}

async function convexAction(
  functionName: string,
  args: Record<string, unknown>,
) {
  const res = await fetch(`${CONVEX_URL}/api/action`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ path: functionName, args, format: "json" }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Convex action ${functionName} failed: ${text}`);
  }
  return res.json();
}

async function migrateSections() {
  console.log("\n📄 Migrating sections...");

  const sectionTypes = [
    { type: "heroSection", key: "section:hero" },
    { type: "aboutSection", key: "section:about" },
    { type: "contactSection", key: "section:contact" },
    { type: "projectsSection", key: "section:projects" },
    { type: "experienceSection", key: "section:experience" },
    { type: "skillsSection", key: "section:skills" },
    { type: "blogSection", key: "section:blog" },
    { type: "techStackSection", key: "section:techstack" },
  ];

  for (const { type, key } of sectionTypes) {
    const sections = await sanityFetch(`*[_type == "${type}"]`);
    for (const section of sections) {
      const locale = section.language === "nl" ? "nl" : "en";
      // Strip Sanity internal fields
      const {
        _id,
        _type,
        _rev,
        _createdAt,
        _updatedAt,
        _system,
        language,
        ...value
      } = section;
      value.language = locale;
      value._id = _id; // Keep for reference

      console.log(
        `  → ${key} (${locale}): ${section.name || section.title || _id}`,
      );

      try {
        await convexMutation("site_settings:upsert", {
          key,
          value,
          locale,
          description: `Migrated from Sanity ${type}`,
        });
      } catch (e: any) {
        // upsert requires auth - we'll note this
        console.log(
          `    ⚠ Auth required for upsert, skipping. Import via admin UI.`,
        );
        break;
      }
    }
  }
}

async function main() {
  console.log("🚀 Sanity → Convex Migration");
  console.log(`   Sanity: ${SANITY_PROJECT_ID}/${SANITY_DATASET}`);
  console.log(`   Convex: ${CONVEX_URL}`);

  // Phase 1: Check what's in Sanity
  console.log("\n📊 Checking Sanity content...");
  const allContent = await sanityFetch(
    `*[_type in ["project", "experience", "post", "heroSection", "aboutSection", "contactSection", "projectsSection", "experienceSection", "skillsSection", "blogSection", "techStackSection", "service"]] { _type, _id, title, language }`,
  );

  const byType: Record<string, number> = {};
  for (const item of allContent) {
    byType[item._type] = (byType[item._type] || 0) + 1;
  }
  console.log("Content found:", byType);

  // Phase 2: Export full content
  console.log("\n📥 Exporting full Sanity content...");
  const fullExport = await sanityFetch(
    `*[_type in ["project", "experience", "post", "heroSection", "aboutSection", "contactSection", "projectsSection", "experienceSection", "skillsSection", "blogSection", "techStackSection", "service"]]`,
  );

  // Save export to file
  const fs = await import("fs");
  const exportPath = "./sanity-export-full.json";
  fs.writeFileSync(exportPath, JSON.stringify(fullExport, null, 2));
  console.log(`   Saved to ${exportPath} (${fullExport.length} documents)`);

  // Phase 3: Try migrating sections (requires auth)
  await migrateSections();

  console.log("\n✅ Export complete!");
  console.log("\n📋 Next steps:");
  console.log(
    "   1. Import sections via admin UI (site_settings) - requires auth",
  );
  console.log("   2. Import projects, experiences, blog posts via admin UI");
  console.log("   3. Or create an admin-side import script with Clerk auth");
}

main().catch(console.error);
