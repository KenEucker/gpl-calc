import { isPlayer } from "./methods"
import { getSanityPlayer, getSanityStandings } from "./sanity"
import type { Card, Player, Standing } from "./types"

export const getStandings = async () => {
    return getSanityStandings()
}

export const generateStandings = async (cards: Card[]) => {
    // loop through cards and generate standings
    const date = new Date()
    const standings: Standing = {
        _type: 'standing',
        date,
        proleaderboard: [],
        beginnerleaderboard: [],
        players: [] as Player[],
        slug: {
            _type: 'slug',
            current: '',
        },
    }

    for(const card of cards) {
        // check if the player is already in the standings
        const winnerIndex = standings.players.findIndex((player: Player) => player.name === card.winner)
        const loserIndex = standings.players.findIndex((player: Player) => player.name === card.loser)

        const winner = (winnerIndex === -1 ? isPlayer(card.winner) ? card.winner : await getSanityPlayer(card.winner) : standings.players[winnerIndex]) as Player
        const loser = (loserIndex === -1 ? isPlayer(card.loser) ? card.loser : await getSanityPlayer(card.loser) : standings.players[loserIndex]) as Player
        const winnerInProBracket = winner.bracket === "Pro"
        const loserInProBracket = loser.bracket === "Pro"
        let winnerScore = 0
        let loserScore = 0

        // for each card, calculate the change in score for each player
        const crossBracketMatch = winner.bracket !== loser.bracket
        if (crossBracketMatch) {
            if (winnerInProBracket) {
                // pro wins against beginner
                // a player in the pro bracket wins 3 points if they win in 9-ball against a beginner
                winnerScore += 3
                // a beginner loses 1 point if the lose a match to a pro in 9-ball
                loserScore -= 1
            } else {
                // beginner wins against pro
                // a player in the beginner bracket wins 4 points if they win in 9-ball against a pro
                winnerScore += 4
                // a player in the pro bracket loses 1 point if the lose a match
                loserScore -= 1
            }
        } else {
            // same bracket match
            if (card.game === "9-ball") {
                if (winnerInProBracket) {
                    // 9-ball Pro match
                    // a player in the pro bracket wins 4 points if they win in 9-ball against another pro
                    winnerScore += 4
                    // a player in the pro bracket loses 1 point if the lose a match
                    loserScore -= 1
                } else {
                    // 9-ball Beginner match
                    // a player in the beginner bracket wins 3 points if they win in 9-ball against another beginner
                    winnerScore += 3
                }
            } else {
                if (!winnerInProBracket) {
                    // 8-ball Beginner match
                    // a player in the beginner bracket wins 2 points if they win in 8-ball against another beginner
                    winnerScore += 2
                }
                // a player in the pro bracket cannot play another pro in 8-ball
            }
        }

        // set the player in the leaderboard if it does not exist
        let winnerLeaderboardIndex = -1
        if (winnerIndex !== -1) {
            winnerLeaderboardIndex = winnerInProBracket ? standings.proleaderboard.findIndex((position) => position.player.name === winner.name) : standings.beginnerleaderboard.findIndex((position) => position.player.name === winner.name)
        } else {
            standings.players.push(winner)
            if (winnerInProBracket) {
                winnerLeaderboardIndex = standings.proleaderboard.length
                standings.proleaderboard.push({
                    player: winner,
                    score: 0,
                    games: 0,
                })
            } else {
                winnerLeaderboardIndex = standings.beginnerleaderboard.length
                standings.beginnerleaderboard.push({
                    player: winner,
                    score: 0,
                    games: 0,
                })
            }
        }
        // update the player's score and games played
        if (winnerInProBracket) {
            standings.proleaderboard[winnerLeaderboardIndex].score += winnerScore
            standings.proleaderboard[winnerLeaderboardIndex].games += 1
        } else {
            standings.beginnerleaderboard[winnerLeaderboardIndex].score += winnerScore
            standings.beginnerleaderboard[winnerLeaderboardIndex].games += 1
        }
        
        // set the player in the leaderboard if it does not exist
        let loserLeaderboardIndex = -1
        if (loserIndex !== -1) {
            loserLeaderboardIndex = loserInProBracket ? standings.proleaderboard.findIndex((position) => position.player.name === loser.name) : standings.beginnerleaderboard.findIndex((position) => position.player.name === loser.name)
        } else {
            standings.players.push(loser)
            if (loserInProBracket) {
                loserLeaderboardIndex = standings.proleaderboard.length
                standings.proleaderboard.push({
                    player: loser,
                    score: 0,
                    games: 0,
                })
            } else {
                loserLeaderboardIndex = standings.beginnerleaderboard.length
                standings.beginnerleaderboard.push({
                    player: loser,
                    score: 0,
                    games: 0,
                })
            }
        }

        // update the player's score and games played
        if (loserInProBracket) {
            standings.proleaderboard[loserLeaderboardIndex].score += loserScore
            standings.proleaderboard[loserLeaderboardIndex].games += 1
        } else {
            standings.beginnerleaderboard[loserLeaderboardIndex].score += loserScore
            standings.beginnerleaderboard[loserLeaderboardIndex].games += 1
        }
    }

    return standings
}