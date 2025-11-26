import { BookOpen } from "lucide-react";
import { defineField, defineType } from "sanity";

export default defineType({
  name: "post",
  title: "Blog Post",
  type: "document",
  icon: BookOpen,
  fields: [
    defineField({
      name: "title",
      title: "Title",
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
      name: "excerpt",
      title: "Excerpt",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required().max(200),
    }),
    defineField({
      name: "coverImage",
      title: "Cover Image (Upload)",
      type: "image",
      description: "Upload an image directly to Sanity",
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alternative Text",
        },
      ],
    }),
    defineField({
      name: "coverImageUrl",
      title: "Cover Image URL (External)",
      type: "url",
      description:
        "Or provide an external image URL (e.g., Unsplash). This will be used if no uploaded image is provided.",
    }),
    defineField({
      name: "content",
      title: "Content",
      type: "markdown",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "Article", value: "article" },
          { title: "Tutorial", value: "tutorial" },
          { title: "Research", value: "research" },
        ],
        layout: "radio",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "string" }],
      options: {
        layout: "tags",
      },
    }),
    defineField({
      name: "author",
      title: "Author",
      type: "string",
      initialValue: "Leroy Steding",
    }),
    defineField({
      name: "publishedAt",
      title: "Published At",
      type: "datetime",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "readingTime",
      title: "Reading Time",
      type: "string",
      description: 'e.g., "8 min read" or "8 min lezen"',
    }),
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      initialValue: false,
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
      author: "author",
      media: "coverImage",
      category: "category",
      featured: "featured",
    },
    prepare(selection) {
      const { title, author, category, featured, media } = selection;

      // Check if media is a valid Sanity image object (has _type and asset)
      // If it's a string (URL) or doesn't have asset, don't use it as media
      const isValidSanityImage =
        media &&
        typeof media === "object" &&
        media._type === "image" &&
        media.asset;

      return {
        title: title || "Untitled",
        subtitle:
          `${category || ""} ${featured ? "⭐ Featured" : ""} by ${author || "Unknown"}`.trim(),
        media: isValidSanityImage ? media : BookOpen,
      };
    },
  },
});
