import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'blogSection',
  title: 'Blog Section',
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
      name: 'viewAllText',
      title: 'View All Text',
      type: 'string',
      initialValue: 'View All Posts',
    }),
    defineField({
      name: 'showFeaturedOnly',
      title: 'Show Featured Posts Only',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'maxPosts',
      title: 'Maximum Posts to Display',
      type: 'number',
      initialValue: 6,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'language',
    },
  },
})
