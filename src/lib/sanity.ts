import { sanityClient } from "sanity:client";
import groq from "groq";
import type { Post, Player, Standing } from "./types";

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

export async function getSanityPost(slug: string): Promise<Post> {
  return await sanityClient.fetch(
    groq`*[_type == "post" && slug.current == $slug][0]`,
    {
      slug,
    }
  );
}

export async function getSanityStandings(): Promise<Standing[]> {
  return await sanityClient.fetch(
    groq`*[_type == "standing"]{"slug": slug.current, date, "players": players[]->name, "proleaderboard": proleaderboard[]{"player": player->name, "bracket": select(player->bracket == "1" => "Beginner", player->bracket == "3" => "Pro", null), score, games}| order(score desc), "beginnerleaderboard": beginnerleaderboard[]{"player": player->name, "bracket": select(player->bracket == "1" => "Beginner", player->bracket == "3" => "Pro", null), score, games}| order(score desc)}`);
}
