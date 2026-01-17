import {defineType} from 'sanity'

export const style = defineType({
  name: 'style',
  title: 'Style',
  type: 'document',
  fields: [
    { name: 'name', type: 'string', validation: Rule => Rule.required() },
    { name: 'slug', type: 'slug', options: { source: 'name' } }
  ]
})
