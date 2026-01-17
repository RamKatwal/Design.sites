import {defineType} from 'sanity'

export const font = defineType({
  name: 'font',
  title: 'Font',
  type: 'document',
  fields: [
    { name: 'name', type: 'string' },
    { name: 'slug', type: 'slug', options: { source: 'name' } }
  ]
})
