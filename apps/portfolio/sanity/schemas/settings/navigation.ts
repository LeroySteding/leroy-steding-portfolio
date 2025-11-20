import { defineType, defineField } from 'sanity'
import { MenuIcon } from '@sanity/icons'

export default defineType({
  name: 'navigation',
  title: 'Navigation',
  type: 'document',
  icon: MenuIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Navigation Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'mainNav',
      title: 'Main Navigation',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'label', type: 'string', title: 'Label' },
          { name: 'link', type: 'string', title: 'Link' },
          { name: 'external', type: 'boolean', title: 'External Link?' },
        ],
      }],
    }),
    defineField({
      name: 'footerNav',
      title: 'Footer Navigation',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'label', type: 'string', title: 'Label' },
          { name: 'link', type: 'string', title: 'Link' },
        ],
      }],
    }),
  ],
  preview: {
    select: {
      title: 'title',
    },
  },
})
