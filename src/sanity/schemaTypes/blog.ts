import { defineType, defineField, defineArrayMember } from 'sanity'

export const blog = defineType({
  name: 'blog',
  title: 'Blog',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'authorName',
      title: 'Author Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'addedOn',
      title: 'Added On',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'siteLink',
      title: 'Site Link',
      type: 'url',
    }),
    defineField({
      name: 'notes',
      title: 'Notes / Highlights',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'highlight',
          fields: [
            defineField({
              name: 'highlight',
              title: 'Highlight',
              type: 'string',
            }),
          ],
          preview: {
            select: { highlight: 'highlight' },
            prepare({ highlight }) {
              return {
                title: highlight ? String(highlight).slice(0, 60) : 'Highlight',
              }
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'authorName',
    },
    prepare({ title, subtitle }) {
      return {
        title: title ?? 'Blog',
        subtitle: subtitle ?? undefined,
      }
    },
  },
})
