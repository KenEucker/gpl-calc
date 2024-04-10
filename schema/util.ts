import type { SanityClient } from "@sanity/client";
import { getDateAbbreviation, type Card, type Player, type Standing } from "src/lib";

export const slugifySource = (s: string) =>
  s
    .toLowerCase()
    //Remove spaces
    .replace(/\s+/g, "_")
    //Remove special characters
    .replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, "");

export const slugifyCard = async (doc: any, client: SanityClient) => {
  const query = `*[_type == "player" && _id == $playerRef][0] {name}`;
  let winnerName = "";
  await client
    .fetch(query, { playerRef: doc.winner._ref ?? doc.winner._id })
    .then((player: Player) => {
      /// Set the referenceName to the category.name field
      winnerName = !!player ? player.name : "winner";
    });
  let loserName = "";
  await client
    .fetch(query, { playerRef: doc.loser._ref ?? doc.loser.id })
    .then((player: Player) => {
      /// Set the referenceName to the category.name field
      loserName = !!player ? player.name : "loser";
    });

  let sameDayCardNumber = 1;
  let mostRecentCardFound = false;
  const slugSource = () =>
    slugifySource(
      `${winnerName}-${loserName}--${doc.game}--${doc.date}-${sameDayCardNumber}`
    );

  while (!mostRecentCardFound) {
    await client
      .fetch(`*[_type == "card" && slug.current == "${slugSource()}"][0] {_id}`)
      .then((card: Card) => {
        if (card) {
          sameDayCardNumber++;
        } else {
          mostRecentCardFound = true;
        }
      });
  }

  return slugSource();
};

export const slugifyStanding = async (doc, client) => {
  let sameDayNumber = 1
  let mostRecentStandingFound = false
  const slugSource = () => slugifySource(`gpl-${getDateAbbreviation(doc.date)}-${sameDayNumber}`)

  while (!mostRecentStandingFound) {
    await client
      .fetch(
        `*[_type == "standing" && slug.current == "${slugSource()}"][0] {_id}`
      )
      .then((standing: Standing) => {
        if (standing) {
          sameDayNumber++;
        } else {
          mostRecentStandingFound = true;
        }
      })
  }

  return slugSource()
}
