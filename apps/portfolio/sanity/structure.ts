import type { StructureResolver } from 'sanity/structure'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      // Content Management
      S.listItem()
        .title('📝 Content')
        .child(
          S.list()
            .title('Content Types')
            .items([
              S.listItem()
                .title('Blog Posts')
                .child(
                  S.documentTypeList('post')
                    .title('Blog Posts')
                    .filter('_type == "post"')
                    .child((documentId) =>
                      S.document()
                        .documentId(documentId)
                        .schemaType('post')
                    )
                ),
              S.listItem()
                .title('Projects')
                .child(
                  S.documentTypeList('project')
                    .title('Projects')
                ),
              S.listItem()
                .title('Work Experience')
                .child(
                  S.documentTypeList('experience')
                    .title('Work Experience')
                ),
            ])
        ),
      
      S.divider(),

      // Page Builder
      S.listItem()
        .title('🏗️ Pages')
        .child(
          S.list()
            .title('Pages')
            .items([
              S.listItem()
                .title('Home Page')
                .child(
                  S.document()
                    .schemaType('page')
                    .documentId('home-page-en')
                    .title('Home Page (EN)')
                ),
              S.listItem()
                .title('Home Page (NL)')
                .child(
                  S.document()
                    .schemaType('page')
                    .documentId('home-page-nl')
                    .title('Home Page (NL)')
                ),
              S.divider(),
              S.documentTypeListItem('page').title('All Pages'),
            ])
        ),

      S.divider(),

      // Sections
      S.listItem()
        .title('🧩 Sections')
        .child(
          S.list()
            .title('Page Sections')
            .items([
              S.listItem()
                .title('Hero Sections')
                .child(
                  S.documentTypeList('hero')
                    .title('Hero Sections')
                ),
              S.listItem()
                .title('About Sections')
                .child(
                  S.documentTypeList('aboutSection')
                    .title('About Sections')
                ),
              S.listItem()
                .title('Contact Sections')
                .child(
                  S.documentTypeList('contactSection')
                    .title('Contact Sections')
                ),
              S.listItem()
                .title('Projects Sections')
                .child(
                  S.documentTypeList('projectsSection')
                    .title('Projects Sections')
                ),
              S.listItem()
                .title('Experience Sections')
                .child(
                  S.documentTypeList('experienceSection')
                    .title('Experience Sections')
                ),
              S.listItem()
                .title('Skills Sections')
                .child(
                  S.documentTypeList('skillsSection')
                    .title('Skills Sections')
                ),
              S.listItem()
                .title('Blog Sections')
                .child(
                  S.documentTypeList('blogSection')
                    .title('Blog Sections')
                ),
              S.listItem()
                .title('Tech Stack Sections')
                .child(
                  S.documentTypeList('techStackSection')
                    .title('Tech Stack Sections')
                ),
            ])
        ),

    ])
