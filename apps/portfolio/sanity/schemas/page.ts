import { DocumentTextIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export default defineType({
  name: "page",
  title: "Page",
  type: "document",
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: "title",
      title: "Page Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "pageBuilder",
      title: "Page Builder",
      type: "array",
      of: [
        {
          type: "reference",
          name: "heroReference",
          title: "Hero Section",
          to: [{ type: "hero" }],
        },
        {
          type: "reference",
          name: "aboutReference",
          title: "About Section",
          to: [{ type: "aboutSection" }],
        },
        {
          type: "reference",
          name: "contactReference",
          title: "Contact Section",
          to: [{ type: "contactSection" }],
        },
        {
          type: "reference",
          name: "projectsReference",
          title: "Projects Section",
          to: [{ type: "projectsSection" }],
        },
        {
          type: "reference",
          name: "experienceReference",
          title: "Experience Section",
          to: [{ type: "experienceSection" }],
        },
        {
          type: "reference",
          name: "skillsReference",
          title: "Skills Section",
          to: [{ type: "skillsSection" }],
        },
        {
          type: "reference",
          name: "blogReference",
          title: "Blog Section",
          to: [{ type: "blogSection" }],
        },
        {
          type: "reference",
          name: "techStackReference",
          title: "Tech Stack Section",
          to: [{ type: "techStackSection" }],
        },
      ],
    }),
    defineField({
      name: "seo",
      title: "SEO Settings",
      type: "object",
      fields: [
        {
          name: "metaTitle",
          title: "Meta Title",
          type: "string",
        },
        {
          name: "metaDescription",
          title: "Meta Description",
          type: "text",
          rows: 3,
        },
        {
          name: "ogImage",
          title: "Open Graph Image",
          type: "image",
        },
      ],
    }),
    defineField({
      name: "language",
      title: "Language",
      type: "string",
      readOnly: true,
      hidden: true,
    }),
  ],
  preview: {
    select: {
      title: "title",
      slug: "slug",
    },
    prepare(selection) {
      const { title, slug } = selection;
      return {
        title,
        subtitle: slug?.current || "No slug",
      };
    },
  },
});
