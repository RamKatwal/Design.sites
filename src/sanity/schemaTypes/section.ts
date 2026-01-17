import {defineType} from 'sanity'

export const section = defineType({
  name: 'section',
  title: 'Section Type',
  type: 'document',
  fields: [{ name: 'name', type: 'string' }]
})
