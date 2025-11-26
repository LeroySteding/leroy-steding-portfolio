import { Briefcase } from "lucide-react";
import { defineField, defineType } from "sanity";

export default defineType({
  name: "project",
  title: "Project",
  type: "document",
  icon: Briefcase,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "language",
      title: "Language",
      type: "string",
      options: {
        list: [
          { title: "English", value: "en" },
          { title: "Nederlands", value: "nl" },
        ],
      },
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
      name: "description",
      title: "Short Description",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "longDescription",
      title: "Long Description",
      type: "markdown",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "image",
      title: "Cover Image (Upload)",
      type: "image",
      description: "Upload an image directly to Sanity",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "imageUrl",
      title: "Cover Image URL (External)",
      type: "url",
      description:
        "Or provide an external image URL (e.g., Unsplash). Used if no uploaded image.",
    }),
    defineField({
      name: "technologies",
      title: "Technologies",
      type: "array",
      of: [{ type: "string" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "liveUrl",
      title: "Live URL",
      type: "url",
    }),
    defineField({
      name: "githubUrl",
      title: "GitHub URL",
      type: "url",
    }),
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "Product", value: "product" },
          { title: "Client", value: "client" },
          { title: "Internal", value: "internal" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "year",
      title: "Year",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "challenges",
      title: "Challenges",
      type: "array",
      of: [{ type: "text" }],
    }),
    defineField({
      name: "solutions",
      title: "Solutions",
      type: "array",
      of: [{ type: "text" }],
    }),
    defineField({
      name: "impact",
      title: "Impact",
      type: "array",
      of: [{ type: "text" }],
    }),
    defineField({
      name: "testimonial",
      title: "Testimonial",
      type: "object",
      fields: [
        { name: "quote", title: "Quote", type: "text" },
        { name: "author", title: "Author", type: "string" },
        { name: "role", title: "Role", type: "string" },
      ],
    }),
    defineField({
      name: "achievements",
      title: "Achievements",
      type: "array",
      of: [{ type: "text" }],
    }),
    defineField({
      name: "showOnCV",
      title: "Show on CV",
      type: "boolean",
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: "title",
      media: "image",
      category: "category",
      featured: "featured",
    },
    prepare(selection) {
      const { title, media, category, featured } = selection;

      // Check if media is a valid Sanity image object
      const isValidSanityImage =
        media &&
        typeof media === "object" &&
        media._type === "image" &&
        media.asset;

      return {
        title: title || "Untitled Project",
        subtitle: `${category || ""} ${featured ? "⭐ Featured" : ""}`.trim(),
        media: isValidSanityImage ? media : Briefcase,
      };
    },
  },
});
