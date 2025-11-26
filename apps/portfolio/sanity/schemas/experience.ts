import { Building2 } from "lucide-react";
import { defineField, defineType } from "sanity";

export default defineType({
  name: "experience",
  title: "Experience",
  type: "document",
  icon: Building2,
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
      name: "company",
      title: "Company",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "companyLogo",
      title: "Company Logo (Upload)",
      type: "image",
      description: "Upload a logo image directly to Sanity",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "companyLogoUrl",
      title: "Company Logo URL (External)",
      type: "url",
      description:
        "Or provide an external logo URL. Used if no uploaded image.",
    }),
    defineField({
      name: "companyUrl",
      title: "Company URL",
      type: "url",
    }),
    defineField({
      name: "period",
      title: "Period",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
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
      name: "technologies",
      title: "Technologies",
      type: "array",
      of: [{ type: "string" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "color",
      title: "Color",
      type: "string",
      options: {
        list: [
          { title: "Cyan", value: "cyan" },
          { title: "Violet", value: "violet" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "highlights",
      title: "Highlights",
      type: "array",
      of: [{ type: "text" }],
    }),
    defineField({
      name: "achievements",
      title: "Achievements",
      type: "array",
      of: [{ type: "text" }],
    }),
    defineField({
      name: "responsibilities",
      title: "Responsibilities",
      type: "array",
      of: [{ type: "text" }],
    }),
    defineField({
      name: "teamSize",
      title: "Team Size",
      type: "string",
    }),
    defineField({
      name: "impact",
      title: "Impact",
      type: "array",
      of: [{ type: "text" }],
    }),
  ],
  preview: {
    select: {
      title: "title",
      company: "company",
      media: "companyLogo",
    },
    prepare(selection) {
      const { title, company, media } = selection;

      // Check if media is a valid Sanity image object
      const isValidSanityImage =
        media &&
        typeof media === "object" &&
        media._type === "image" &&
        media.asset;

      return {
        title: title || "Untitled Experience",
        subtitle: company || "",
        media: isValidSanityImage ? media : Building2,
      };
    },
  },
});
