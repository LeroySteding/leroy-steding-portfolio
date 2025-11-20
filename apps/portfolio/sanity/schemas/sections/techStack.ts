import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'techStackSection',
  title: 'Tech Stack Section',
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
      name: 'categories',
      title: 'Tech Categories',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'name', title: 'Category Name', type: 'string' },
            { name: 'icon', title: 'Icon', type: 'string' },
            {
              name: 'technologies',
              title: 'Technologies',
              type: 'array',
              of: [
                {
                  type: 'object',
                  fields: [
                    { name: 'name', title: 'Name', type: 'string' },
                    { name: 'icon', title: 'Icon', type: 'string' },
                  ],
                },
              ],
            },
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
