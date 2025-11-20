import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'skillsSection',
  title: 'Skills Section',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'language',
      title: 'Language',
      type: 'string',
      options: {
        list: [
          { title: 'English', value: 'en' },
          { title: 'Nederlands', value: 'nl' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'titleHighlight',
      title: 'Title Highlight',
      type: 'string',
      description: 'The highlighted part of the title',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'skills',
      title: 'Skills',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'name', title: 'Skill Name', type: 'string' },
            { name: 'category', title: 'Category', type: 'string' },
            { name: 'level', title: 'Level', type: 'number', validation: (Rule) => Rule.min(1).max(100) },
          ],
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'language',
    },
  },
})
