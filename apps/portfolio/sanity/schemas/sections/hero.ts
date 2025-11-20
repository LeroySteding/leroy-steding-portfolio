import { defineType, defineField } from 'sanity'
import { RocketIcon } from '@sanity/icons'

export default defineType({
  name: 'hero',
  title: 'Hero Section',
  type: 'document',
  icon: RocketIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Section Name (Internal)',
      type: 'string',
      description: 'For identification in the CMS',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'string',
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'ctaButtons',
      title: 'CTA Buttons',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'text', type: 'string', title: 'Button Text' },
          { name: 'link', type: 'string', title: 'Link' },
          { name: 'variant', type: 'string', title: 'Variant', options: { list: ['primary', 'secondary'] } },
        ],
      }],
    }),
    defineField({
      name: 'stats',
      title: 'Statistics',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'value', type: 'string', title: 'Value' },
          { name: 'label', type: 'string', title: 'Label' },
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
