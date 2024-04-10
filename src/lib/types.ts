import type { PortableTextBlock } from "@portabletext/types";
import type { ImageAsset, Slug } from "@sanity/types";

export interface Card {
  _type: "card";
  _createdAt?: string;
  slug: Slug;
  date: Date;
  game: string;
  winner: Player | string;
  loser: Player | string;
  referee: Player | string;
}

export interface Post {
  _type: "post";
  _createdAt?: string;
  type?: string;
  date?: string;
  name?: string;
  title?: string;
  slug: string | Slug;
  excerpt?: string;
  mainImage?: ImageAsset;
  body: PortableTextBlock[];
}


export interface Player {
  _type: "player";
  _id: string;
  _weak?: boolean;
  _createdAt?: string;
  name?: string;
  slug: Slug;
  bracket: "Beginner" | "Pro";
  about: PortableTextBlock[];
}

export interface PlayerRef {
  _type: string;
  _id?: string;
  _ref?: string;
  _weak?: boolean;
}

export interface Position {
  player: Player;
  score: number;
  games: number;
}


export interface Standing {
  _type: "standing";
  _createdAt?: string;
  slug: Slug;
  players: Player[] | PlayerRef[];
  date: Date;
  beginnerleaderboard: Position[];
  proleaderboard: Position[];
}

