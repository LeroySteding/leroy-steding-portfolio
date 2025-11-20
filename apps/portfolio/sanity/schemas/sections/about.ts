import { defineType, defineField } from 'sanity'
import { UserIcon } from '@sanity/icons'

export default defineType({
  name: 'aboutSection',
  title: 'About Section',
  type: 'document',
  icon: UserIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Section Name (Internal)',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Section Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'titleHighlight',
      title: 'Title Highlight Text',
      type: 'string',
    }),
    defineField({
      name: 'intro',
      title: 'Introduction',
      type: 'markdown',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'expertise',
      title: 'Expertise Description',
      type: 'markdown',
    }),
    defineField({
      name: 'experience',
      title: 'Experience Description',
      type: 'markdown',
    }),
    defineField({
      name: 'highlights',
      title: 'Highlights',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'key', type: 'string', title: 'Key' },
          { name: 'title', type: 'string', title: 'Title' },
          { name: 'description', type: 'text', title: 'Description' },
          { name: 'icon', type: 'string', title: 'Icon Name' },
        ],
      }],
    }),
    defineField({
      name: 'language',
      title: 'Language',
      type: 'string',
      readOnly: true,
      hidden: true,
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'title',
    },
  },
})
