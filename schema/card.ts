import {defineField, defineType} from 'sanity'
import { slugifySource, slugifyCard } from './util'

export default defineType({
  name: 'card',
  title: 'Card',
  type: 'document',
  fields: [
    defineField({
      title: 'Date',
      name: 'date',
      type: 'date',
      options: {
        dateFormat: 'YYYY-MM-DD',
      }
    }),
    defineField({
      name: 'winner',
      title: 'Winner',
      type: 'reference',
      weak: true,
      to: [{type: 'player'}],
      description: 'Who was the winner one the card?'
    }),
    defineField({
      name: 'loser',
      title: 'Loser',
      type: 'reference',
      weak: true,
      to: [{type: 'player'}],
      description: 'Who was the loser one the card?'
    }),
    defineField({
      name: 'referee',
      title: 'Referee',
      type: 'reference',
      weak: true,
      to: [{type: 'player'}],
      description: 'Who witnessed the game?'
    }),
    defineField({
      name: "game",
      type: "string",
      title: "Game Played",
      options: {
        list: [
          { title: "8-ball", value: "8-ball" },
          { title: "9-ball", value: "9-ball" }
        ],
        layout: "radio",
        direction: "horizontal"
      }
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      validation: (Rule) => Rule.required(),
      options: {
        source: async (doc:any, context:any) => {
          const client = context.getClient({apiVersion: '2023-05-03', dataset: 'production'})
          return slugifyCard(doc, client)
        },
        slugify: slugifySource,
        maxLength: 96,
      },
    }),
  ],
  preview: {
    select: {
      title: 'slug.current',
    },
  },
})
