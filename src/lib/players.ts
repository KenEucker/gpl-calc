import { getSanityPlayers } from './sanity'

export const getPlayers = async () => {
    const sanityPlayers  = await getSanityPlayers()
    if (sanityPlayers.length) {
        return sanityPlayers.map(p => p.name)
    }
    return [ "no players" ]
}