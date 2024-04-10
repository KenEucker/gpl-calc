import {defineField, defineType} from 'sanity'
import { slugifySource } from './util'

export default defineType({
  name: 'standing',
  title: 'Standing',
  type: 'document',
  fields: [
    defineField({
      title: 'Date Generated',
      name: 'date',
      type: 'date',
      options: {
        dateFormat: 'YYYY-MM-DD',
      }
    }),
    {
      title: 'Players Included',
      name: 'players',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{type: 'player'}],
        }
      ]
    },
    defineField({
      title: "Beginner Leaderboard",
      type: "array",
      name: "beginnerleaderboard",
      of: [
        {
          type: "object",
          name: "inline",
          preview: {
            select: {
              title: "player.name",
              score: "score",
              games: "games",
            },
            prepare(selection) {
              return {
                title: selection.title,
                subtitle: `Score: ${selection.score} | Games: ${selection.games}`
              }
            }
          },
          fields: [
            {
              type: 'reference',
              title: 'name',
              to: [
                {type: 'player'},
              ],
              options: {    
                filter: 'bracket == $bracket',
                filterParams: {bracket: "1"},
              },
              name: "player",
            },
            { type: "number", name: "score" },
            { type: "number", name: "games" }
          ]
        }
      ]
    }),
    defineField({
      title: "Pro Leaderboard",
      type: "array",
      name: "proleaderboard",
      of: [
        {
          type: "object",
          name: "inline",
          preview: {
            select: {
              title: "player.name",
              score: "score",
              games: "games",
            },
            prepare(selection) {
              return {
                title: selection.title,
                subtitle: `Score: ${selection.score} | Games: ${selection.games}`
              }
            }
          },
          fields: [
            {
              type: 'reference',
              title: 'name',
              to: [
                {type: 'player'},
              ],
              options: {    
                filter: 'bracket == $bracket',
                filterParams: {bracket: "3"},
              },
              name: "player",
            },
            { type: "number", name: "score" },
            { type: "number", name: "games" }
          ]
        }
      ]
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      validation: (Rule) => Rule.required(),
      options: {
        source: async (doc:any, context:any) => {
          const client = context.getClient({apiVersion: '2023-05-03', dataset: 'production'})
          let sameDayNumber = 1
          let mostRecentStandingFound = false
          const slugSource = () => slugifySource(`gpl-${doc.date}-${sameDayNumber}`)

          while (!mostRecentStandingFound) {
            await client.fetch(`*[_type == "standing" && slug.current == "${slugSource()}"][0] {_id}`).then(card => {
              if (card) {
                sameDayNumber++
              } else {
                mostRecentStandingFound = true
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
