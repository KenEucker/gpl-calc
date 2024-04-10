import { sanityClient } from "sanity:client"
import groq from "groq"
import type { Post, Player, Standing, Card } from "./types"
import { isPlayer, getDateAbbreviation } from "./methods"
import { slugifyCard } from "schema/util"

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
    groq`*[_type == "player" && name == $name][0]`,
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
    groq`*[_type == "standing"]{"slug": slug.current, date, "players": players[]->name, "proleaderboard": proleaderboard[]{"player": player->name, "bracket": select(player->bracket == "1" => "Beginner", player->bracket == "3" => "Pro", null), score, games}| order(score desc), "beginnerleaderboard": beginnerleaderboard[]{"player": player->name, "bracket": select(player->bracket == "1" => "Beginner", player->bracket == "3" => "Pro", null), score, games}| order(score desc)}`)
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