import type { PortableTextBlock } from "@portabletext/types";
import type { ImageAsset, Slug } from "@sanity/types";

export interface Post {
  _type: "post";
  _createdAt: string;
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
  _createdAt: string;
  name?: string;
  slug: Slug;
  bracket: "Begninner" | "Pro";
  about: PortableTextBlock[];
}

export interface Standing {
  _type: "standing";
  _createdAt: string;
  slug: Slug;
  players: Player[];
  date: Date;
  beginnerleaderboard: string[];
  proleaderboard: string[];
}
