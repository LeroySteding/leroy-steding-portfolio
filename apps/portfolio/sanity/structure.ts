import type { StructureResolver } from "sanity/structure";

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      // Content Management
      S.listItem()
        .title("📝 Content")
        .child(
          S.list()
            .title("Content Types")
            .items([
              // Blog Posts - grouped by language
              S.listItem()
                .title("Blog Posts")
                .child(
                  S.list()
                    .title("Blog Posts")
                    .items([
                      S.listItem()
                        .title("All Posts")
                        .child(
                          S.documentTypeList("post")
                            .title("All Blog Posts")
                            .defaultOrdering([
                              { field: "publishedAt", direction: "desc" },
                            ]),
                        ),
                      S.listItem()
                        .title("English Posts")
                        .child(
                          S.documentTypeList("post")
                            .title("English Posts")
                            .apiVersion("2024-01-01")
                            .filter('_type == "post" && language == "en"'),
                        ),
                      S.listItem()
                        .title("Dutch Posts")
                        .child(
                          S.documentTypeList("post")
                            .title("Dutch Posts")
                            .apiVersion("2024-01-01")
                            .filter('_type == "post" && language == "nl"'),
                        ),
                    ]),
                ),
              // Projects - grouped by language
              S.listItem()
                .title("Projects")
                .child(
                  S.list()
                    .title("Projects")
                    .items([
                      S.listItem()
                        .title("All Projects")
                        .child(
                          S.documentTypeList("project")
                            .title("All Projects")
                            .defaultOrdering([
                              { field: "year", direction: "desc" },
                            ]),
                        ),
                      S.listItem()
                        .title("English Projects")
                        .child(
                          S.documentTypeList("project")
                            .title("English Projects")
                            .apiVersion("2024-01-01")
                            .filter(
                              '_type == "project" && (language == "en" || !defined(language))',
                            ),
                        ),
                      S.listItem()
                        .title("Dutch Projects")
                        .child(
                          S.documentTypeList("project")
                            .title("Dutch Projects")
                            .apiVersion("2024-01-01")
                            .filter('_type == "project" && language == "nl"'),
                        ),
                    ]),
                ),
              // Work Experience - grouped by language
              S.listItem()
                .title("Work Experience")
                .child(
                  S.list()
                    .title("Work Experience")
                    .items([
                      S.listItem()
                        .title("All Experience")
                        .child(
                          S.documentTypeList("experience").title(
                            "All Work Experience",
                          ),
                        ),
                      S.listItem()
                        .title("English Experience")
                        .child(
                          S.documentTypeList("experience")
                            .title("English Experience")
                            .apiVersion("2024-01-01")
                            .filter(
                              '_type == "experience" && (language == "en" || !defined(language))',
                            ),
                        ),
                      S.listItem()
                        .title("Dutch Experience")
                        .child(
                          S.documentTypeList("experience")
                            .title("Dutch Experience")
                            .apiVersion("2024-01-01")
                            .filter(
                              '_type == "experience" && language == "nl"',
                            ),
                        ),
                    ]),
                ),
            ]),
        ),

      S.divider(),

      // Page Builder
      S.listItem()
        .title("🏗️ Pages")
        .child(
          S.list()
            .title("Pages")
            .items([
              S.listItem()
                .title("Home Page (EN)")
                .child(
                  S.document()
                    .schemaType("page")
                    .documentId("home-page-en")
                    .title("Home Page (EN)"),
                ),
              S.listItem()
                .title("Home Page (NL)")
                .child(
                  S.document()
                    .schemaType("page")
                    .documentId("home-page-nl")
                    .title("Home Page (NL)"),
                ),
              S.divider(),
              S.documentTypeListItem("page").title("All Pages"),
            ]),
        ),

      S.divider(),

      // Sections
      S.listItem()
        .title("�� Sections")
        .child(
          S.list()
            .title("Page Sections")
            .items([
              S.listItem()
                .title("Hero Sections")
                .child(S.documentTypeList("hero").title("Hero Sections")),
              S.listItem()
                .title("About Sections")
                .child(
                  S.documentTypeList("aboutSection").title("About Sections"),
                ),
              S.listItem()
                .title("Contact Sections")
                .child(
                  S.documentTypeList("contactSection").title(
                    "Contact Sections",
                  ),
                ),
              S.listItem()
                .title("Projects Sections")
                .child(
                  S.documentTypeList("projectsSection").title(
                    "Projects Sections",
                  ),
                ),
              S.listItem()
                .title("Experience Sections")
                .child(
                  S.documentTypeList("experienceSection").title(
                    "Experience Sections",
                  ),
                ),
              S.listItem()
                .title("Skills Sections")
                .child(
                  S.documentTypeList("skillsSection").title("Skills Sections"),
                ),
              S.listItem()
                .title("Blog Sections")
                .child(
                  S.documentTypeList("blogSection").title("Blog Sections"),
                ),
              S.listItem()
                .title("Tech Stack Sections")
                .child(
                  S.documentTypeList("techStackSection").title(
                    "Tech Stack Sections",
                  ),
                ),
            ]),
        ),

      S.divider(),

      // Settings
      S.listItem()
        .title("⚙️ Settings")
        .child(
          S.list()
            .title("Settings")
            .items([
              S.listItem()
                .title("Site Settings")
                .child(
                  S.document()
                    .schemaType("siteSettings")
                    .documentId("siteSettings")
                    .title("Site Settings"),
                ),
              S.listItem()
                .title("Navigation")
                .child(
                  S.document()
                    .schemaType("navigation")
                    .documentId("navigation")
                    .title("Navigation"),
                ),
            ]),
        ),
    ]);
