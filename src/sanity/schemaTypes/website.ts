import { defineType, defineField } from 'sanity'

export const website = defineType({
  name: 'website',
  title: 'Website',
  type: 'document',

  fields: [
    defineField({
      name: 'name',
      title: 'Website Name',
      type: 'string',
      validation: Rule => Rule.required()
    }),

    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96
      },
      validation: Rule => Rule.required()
    }),

    defineField({
      name: 'url',
      title: 'Live URL',
      type: 'url',
      validation: Rule => Rule.required()
    }),

    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: { hotspot: true },
      validation: Rule => Rule.required()
    }),

    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      options: { hotspot: true }
    }),

    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'category' }],
      validation: Rule => Rule.required()
    }),

    defineField({
      name: 'styles',
      title: 'Styles',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'style' }] }]
    }),

    defineField({
      name: 'fonts',
      title: 'Fonts',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'font' }] }]
    }),

    defineField({
      name: 'sections',
      title: 'Sections / Components',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'sectionType',
              title: 'Section Type',
              type: 'reference',
              to: [{ type: 'section' }],
              validation: Rule => Rule.required()
            }),

            defineField({
              name: 'image',
              title: 'Section Image',
              type: 'image',
              options: { hotspot: true },
              validation: Rule => Rule.required()
            }),

            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
            })
          ],
          preview: {
            select: {
              title: 'sectionType.name',
              subtitle: 'label',
              media: 'image'
            }
          }
        }
      ]
    }),

    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      initialValue: false
    }),

    defineField({
      name: 'addedDate',
      title: 'Added Date',
      type: 'datetime',
      initialValue: () => new Date().toISOString()
    })
  ],

  preview: {
    select: {
      title: 'name',
      media: 'coverImage',
      subtitle: 'url'
    }
  }
})
