import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'player',
  title: 'Player',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      validation: (Rule) => Rule.required(),
      options: {
        source: 'name',
        maxLength: 96,
      },
    }),
    defineField({
      name: 'bracket',
      title: 'Bracket',
      type: "string",
      options: {
        list: [
          { title: "Beginner", value: "1" },
          { title: "Pro", value: "3" },
        ],
        layout: "radio",
        direction: "horizontal"
      },
    }),
    defineField({
      name: 'about',
      title: 'About',
      type: 'blockContent',
    }),
  ],
  preview: {
    select: {
      title: 'name',
    },
  },
})
