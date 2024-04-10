import type { Slug } from "@sanity/types"
import type { Player } from "./types"

export function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

export function getDateAbbreviation(date: Date) {
  return new Date(date).toISOString().split('T')[0]
}

export function isSlug(value: string | Slug): value is Slug {
  return typeof value === 'object' && 'current' in value
}

export function isPlayer(value: string | Player): value is Player {
  return typeof value === 'object' && 'name' in value
}

export function generateGUID(): string {
  const timestamp = new Date().getTime();
  const randomNum = Math.floor(Math.random() * 1000000);
  return `${timestamp}-${randomNum}`;
}

export const getPageUrl = (path = '') => `${import.meta.env.SITE}${import.meta.env.BASE_URL ?? ''}${path}`