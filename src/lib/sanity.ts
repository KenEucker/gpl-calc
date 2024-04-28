import { sanityClient } from "sanity:client"
import groq from "groq"
import type { Post, Player, Standing, Card } from "./types"
import { isPlayer, getDateAbbreviation, generateGUID } from "./methods"
import { slugifyCard, slugifyStanding } from "schema/util"

export async function getSanityPosts(): Promise<Post[]> {
  return sanityClient.fetch(
    groq`*[_type == "post" && defined(slug.current)] | order(_createdAt desc)`
  )
}

export async function getSanityPlayers(): Promise<Player[]> {
  return sanityClient.fetch(
    groq`*[_type == "player" && defined(slug.current)] | order(_createdAt desc)`
  )
}

export async function getSanityPlayer(name: string): Promise<Player> {
  return await sanityClient.fetch(
    groq`*[_type == "player" && name == $name][0]{_id, about, "bracket": select(bracket == "1" => "Beginner", bracket == "3" => "Pro", null), name}`,
    {
      name,
    }
  )
}

export async function getSanityPost(slug: string): Promise<Post> {
  return await sanityClient.fetch(
    groq`*[_type == "post" && slug.current == $slug][0]`,
    {
      slug,
    }
  )
}

export async function getSanityStandings(): Promise<Standing[]> {
  return await sanityClient.fetch(
    groq`*[_type == "standing"]{"slug": slug.current, date, "players": players[]->name, "proleaderboard": proleaderboard[]{"player": player->name, "bracket": select(player->bracket == "1" => "Beginner", player->bracket == "3" => "Pro", null), score, games}| order(score desc), "beginnerleaderboard": beginnerleaderboard[]{"player": player->name, "bracket": select(player->bracket == "1" => "Beginner", player->bracket == "3" => "Pro", null), score, games}| order(date desc)}`)
}

export async function getSanityStandingsByMonth(date: Date): Promise<Standing[]> {
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1)
  const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0)
  const dateRangeStart = firstDay.toISOString().slice(0,10)
  const dateRangeEnd = lastDay.toISOString().slice(0,10)
  // console.log(`*[_type == "standing" && date > "${dateRangeStart}" && date < "${dateRangeEnd}"]{"slug": slug.current, date, "players": players[]->name, "proleaderboard": proleaderboard[]{"player": player->name, "bracket": select(player->bracket == "1" => "Beginner", player->bracket == "3" => "Pro", null), score, games}| order(score desc), "beginnerleaderboard": beginnerleaderboard[]{"player": player->name, "bracket": select(player->bracket == "1" => "Beginner", player->bracket == "3" => "Pro", null), score, games}}| order(date desc)`)
  return await sanityClient.fetch(
          groq`*[_type == "standing" && date > "${dateRangeStart}" && date < "${dateRangeEnd}"]{"slug": slug.current, date, "players": players[]->name, "proleaderboard": proleaderboard[]{"player": player->name, "bracket": select(player->bracket == "1" => "Beginner", player->bracket == "3" => "Pro", null), score, games}| order(score desc), "beginnerleaderboard": beginnerleaderboard[]{"player": player->name, "bracket": select(player->bracket == "1" => "Beginner", player->bracket == "3" => "Pro", null), score, games}}| order(date desc)`)
}

export async function getSanityCards(): Promise<Card[]> {
  return await sanityClient.fetch(
    groq`*[_type == "card"]{"winner": winner->name, "loser": loser->name, "referee": referee->name, game, date}`)
}

export async function getSanityCard(slug: string): Promise<Card[]> {
  return await sanityClient.fetch(
    groq`*[_type == "card" && slug.current=${slug}]{"winner": winner->name, "loser": loser->name, "referee": referee->name, game, date}`)
}

export async function createSanityCard(card: Card): Promise<any> {
  const newCard: any = {
    _type: 'card',
    date: getDateAbbreviation(card.date),
    game: card.game,
    winner: {
      _type: 'reference',
      _ref: (await getSanityPlayer(isPlayer(card.winner) ? card.winner.name : card.winner))._id,
      _weak: true,
    },
    loser: {
      _type: 'reference',
      _ref: (await getSanityPlayer(isPlayer(card.loser) ? card.loser.name : card.loser))._id,
      _weak: true,
    },
    referee: {
      _type: 'reference',
      _ref: (await getSanityPlayer(isPlayer(card.referee) ? card.referee.name : card.referee))._id,
      _weak: true,
    },
    slug: {
      _type: 'slug',
      current: '',
    }
  }
  newCard.slug.current = await slugifyCard(newCard, sanityClient)

  return await sanityClient.create(newCard)
}

export const createSanityStanding = async (standing: Standing) => {
  const newStanding: any = {
      _type: 'standing',
      date: getDateAbbreviation(standing.date),
      slug: {
          _type: 'slug',
          current: await slugifyStanding(standing, sanityClient),
      },
      players: standing.players.map((player: Player) => {
          return {
              _key: generateGUID(),
              _type: 'reference',
              _ref: player._id,
              _weak: true,
          }
      }),
      proleaderboard: standing.proleaderboard.map((position) => {
          return {
              _key: generateGUID(),
              player: {
                  _type: 'reference',
                  _ref: position.player._id,
                  _weak: true,
              },
              score: position.score,
              games: position.games,
          }
      }),
      beginnerleaderboard: standing.beginnerleaderboard.map((position) => {
          return {
              _key: generateGUID(),
              player: {
                  _type: 'reference',
                  _ref: position.player._id,
                  _weak: true,
              },
              score: position.score,
              games: position.games,
          }
      }),
  }

  return await sanityClient.create(newStanding)
}