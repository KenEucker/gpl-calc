import type { Slug } from "@sanity/types";

export function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function isSlug(value: string | Slug): value is Slug {
  return typeof value === 'object' && 'current' in value;
}
