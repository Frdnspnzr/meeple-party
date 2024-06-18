import { BggGame } from "@/datatypes/game";
import { decodeHTML } from "entities";
import { XMLParser } from "fast-xml-parser";
import validator from "validator";

const parser = new XMLParser({ ignoreAttributes: false });

export async function getBggGame(id: number): Promise<BggGame> {
  return getBggGames([id]).then((games) => games[0]);
}

export async function getBggGames(ids: number[]): Promise<BggGame[]> {
  if (ids.length === 0) {
    return [];
  }
  return fetch(
    `https://api.geekdo.com/xmlapi/boardgame/${ids.join(",")}?stats=1`
  )
    .then((response) => {
      if (response.ok) {
        return response.text();
      }
      throw Error(
        `Error fetching game data from BoardGameGeek. Status: ${response.status} ${response.statusText}`
      );
    })
    .then((text) => parseBggGames(text));
}

export async function searchBggGames(term: string): Promise<number[]> {
  if (!term || term.length === 0) {
    return [];
  }
  return fetch(`https://api.geekdo.com/xmlapi/search?search=${term}`)
    .then((response) => response.text())
    .then(parseGameIdsFromSearchResult);
}

function parseGameIdsFromSearchResult(xmlString: string): number[] {
  const bggObject = parser.parse(xmlString);
  checkData(bggObject);
  const bggGames = splitBggObject(bggObject);
  return bggGames.slice(0, 50).map((g) => validator.toInt(g["@_objectid"]));
}

function parseBggGames(xmlString: string): BggGame[] {
  const bggObject = parser.parse(xmlString);
  checkData(bggObject);
  const bggGames = splitBggObject(bggObject);
  return bggGames.map(parseBggGame);
}

function parseBggGame(bggGame: any): BggGame {
  return {
    id: validator.toInt(bggGame["@_objectid"]),
    name: decodeHTML(getPrimaryName(bggGame)),
    description: decodeHTML(bggGame.description),
    thumbnail: bggGame.thumbnail,
    image: bggGame.image,
    year: bggGame.yearpublished,
    designers: getDesigners(bggGame),
    artists: getArtists(bggGame),
    playingTime: bggGame.playingtime,
    minPlayers: bggGame.minplayers,
    maxPlayers: bggGame.maxplayers,
    weight: getWeight(bggGame),
    age: bggGame.age,
    BGGRating: getRating(bggGame),
    BGGRank: getRank(bggGame),
  };
}

function getRank(bggGame: any): number | null {
  function readRank(): string {
    if (
      !bggGame.statistics ||
      !bggGame.statistics.ratings ||
      !bggGame.statistics.ratings.ranks
    ) {
      throw Error("Error parsing BoardGameGeekRank");
    } else {
      const ranks = bggGame.statistics.ratings.ranks.rank;
      if (Array.isArray(ranks)) {
        for (let rank of ranks) {
          if (rank["@_id"] == "1") {
            return rank["@_value"];
          }
        }
        throw Error("Error parsing BoardGameGeekRank");
      } else {
        return ranks["@_value"];
      }
    }
  }
  const rank = readRank();
  if (rank === "Not Ranked") {
    return null;
  } else {
    return validator.toInt(rank);
  }
}

function getRating(bggGame: any): number | null {
  if (
    !bggGame.statistics ||
    !bggGame.statistics.ratings ||
    !bggGame.statistics.ratings.bayesaverage
  ) {
    return null;
  } else {
    return Number.parseFloat(bggGame.statistics.ratings.bayesaverage);
  }
}

function getWeight(bggGame: any): number {
  if (
    !bggGame.statistics ||
    !bggGame.statistics.ratings ||
    !bggGame.statistics.ratings.averageweight
  ) {
    return 0.0;
  } else {
    return Number.parseFloat(bggGame.statistics.ratings.averageweight);
  }
}

function getDesigners(bggGame: any): string[] {
  if (!bggGame.boardgamedesigner) {
    return [];
  } else if (Array.isArray(bggGame.boardgamedesigner)) {
    return bggGame.boardgamedesigner.map((designer: any) => designer["#text"]);
  } else {
    return [bggGame.boardgamedesigner["#text"]];
  }
}

function getArtists(bggGame: any): string[] {
  if (!bggGame.boardgameartist) {
    return [];
  } else if (Array.isArray(bggGame.boardgameartist)) {
    return bggGame.boardgameartist.map((artist: any) => artist["#text"]);
  } else {
    return [bggGame.boardgameartist["#text"]];
  }
}

function getPrimaryName(bggGame: any): string {
  if (Array.isArray(bggGame.name)) {
    let found = bggGame.name[0]["#text"];
    bggGame.name.forEach((name: any) => {
      if (name["@_primary"]) {
        found = name["#text"];
      }
    });
    return "" + found;
  } else {
    return "" + bggGame.name["#text"];
  }
}

function splitBggObject(bggObject: any): any[] {
  if (!bggObject.boardgames.boardgame) {
    return [];
  } else if (Array.isArray(bggObject.boardgames.boardgame)) {
    return bggObject.boardgames.boardgame;
  } else {
    return [bggObject.boardgames.boardgame];
  }
}

function checkData(bggObject: any) {
  if (bggObject.boardgames.boardgame.error) {
    throw Error(`BGG API error: ${bggObject.boardgames.boardgame.error["@_message"]}`);
  }
  if (bggObject.boardgames.boardgame["@_subtypemismatch"]) {
    throw Error(
      `Item with ID ${bggObject.boardgame["@_objectid"]} is not a boardgame.`
    );
  }
}
