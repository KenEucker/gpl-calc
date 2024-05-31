import { getSanityCards, getSanityCardsByMonth, getSanityCard, createSanityCard } from './sanity'
import type { Card } from './types'

export const getCards = async () => {
    return getSanityCards()
}

export const getCardsByMonth = async (date = new Date()) => {
    return getSanityCardsByMonth(date)
}

export const getCard = async (slug: string) => {
    return getSanityCard(slug)
}

export const createCard = async (card: Card) => {
    return createSanityCard(card)
}
