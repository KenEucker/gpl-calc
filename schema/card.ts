import {defineField, defineType} from 'sanity'
import { slugifySource } from './util'
import type { Card, Player } from 'src/lib/types'

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
          const query = `*[_type == "player" && _id == $playerRef][0] {name}`
          let winnerName = ''
          await client.fetch(query, {playerRef: doc.winner._ref}).then((player: Player) => {
            /// Set the referenceName to the category.name field
            winnerName = !!player ? player.name : 'winner'
          })
          let loserName = ''
          await client.fetch(query, {playerRef: doc.loser._ref}).then((player: Player) => {
            /// Set the referenceName to the category.name field
            loserName = !!player ? player.name : 'loser'
          })

          let sameDayCardNumber = 1
          let mostRecentCardFound = false
          const slugSource = () => slugifySource(`${winnerName}-${loserName}--${doc.game}--${doc.date}-${sameDayCardNumber}`)

          while (!mostRecentCardFound) {
            await client.fetch(`*[_type == "card" && slug.current == "${slugSource()}"][0] {_id}`).then((card: Card) => {
              if (card) {
                sameDayCardNumber++
              } else {
                mostRecentCardFound = true
              }
            })
          }
          
          return slugSource()
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
