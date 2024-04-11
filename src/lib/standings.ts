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
        const gameWas9Ball = card.game === "9-ball"
        let winnerScore = 0
        let loserScore = 0


        // for each card, calculate the change in score for each player
        const crossBracketMatch = winner.bracket !== loser.bracket
        if (crossBracketMatch) {
            if (winnerInProBracket) {
                // pro is winner
                if (gameWas9Ball) {
                    // a player in the pro bracket wins 3 points if they win in 9-ball against a beginner
                    winnerScore = 3
                    loserScore = -1
                } else {
                    // There is no loss penalty for Beginners playing 8-ball.
                    winnerScore = 2
                }
            } else {
                // pro is loser
                if (gameWas9Ball) {
                    // a player in the beginner bracket wins 4 points if they win in 9-ball against a pro
                    winnerScore = 4
                } else {
                    /// A win in an 8-ball match cross-bracket is 3 points for the Beginner or 2 points for the Pro.
                    winnerScore = 3
                }

                // a player in the pro bracket loses 1 point if the lose a match
                /// A loss in an 8-ball match cross-bracket is -1 point for the Pro player. 
                loserScore = -1
            }
        } else {
            // same bracket match
            if (gameWas9Ball) {
                if (winnerInProBracket) {
                    // 9-ball Pro match
                    /// A win in a 9-ball match between Pros is 4 points.
                    winnerScore = 4
                } else {
                    // 9-ball Beginner match
                    /// A loss in an 8-ball match between Beginners is 0 points.
                    /// A win in 9-ball between beginners is 3 points.
                    winnerScore = 3
                }
                /// A loss in a 9-ball match cross-bracket is -1 for the loser.
                /// A loss in a 9-ball match between Pros is -1 point.
                loserScore = -1
            } else {
                if (!winnerInProBracket) {
                    // 8-ball Beginner match
                    /// A win in an 8-ball match between Beginners is 3 points.
                    /// A win in a 9-ball match cross-bracket is 4 points for the Beginner or 3 points for the Pro player.
                    winnerScore = 4
                } else {
                    /// Pro players are not able to gain points by playing 8-ball matches with other Pro players.
                    loserScore = -1
                }
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