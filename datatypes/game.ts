import * as client from "@prisma/client";

/**
 * General game information known to Meeple Party
 */
export type Game = Omit<client.Game, "updatedAt">;

/**
 * Game information as found on BoardGameGeek
 */
export interface BggGame extends Omit<Game, "wikidataId"> {
  description: string;
  designers: string[];
  artists: string[];
  age: number;
}

/**
 * Game information with additional data
 */
export type ExpandedGame = Game & {
  names: Omit<client.AlternateGameName, "gameId">[];
};

/**
 * Unique ID of a game. Equal to that game's ID on BoardGameGeek.
 */
export type GameId = number;

/**
 * Game data as written to the database.
 */
export type PrismaGame = client.Game;

/**
 * Game data as wirtten to the database, including alternate names.
 */
export type PrismaGameWithNames = PrismaGame & {
  alternateNames: client.AlternateGameName[];
};

/**
 * Converts a {@link PrismaGame} to {@link Game}, dropping all superfluous attributes.
 * @param game Game in database format to convert.
 */
export function prismaGameToGame(game: client.Game): Game {
  return {
    BGGRank: game.BGGRank,
    BGGRating: game.BGGRating,
    image: game.image,
    id: game.id,
    maxPlayers: game.maxPlayers,
    minPlayers: game.minPlayers,
    name: game.name,
    playingTime: game.playingTime,
    thumbnail: game.thumbnail,
    weight: game.weight,
    wikidataId: game.wikidataId,
    year: game.year,
  };
}

/**
 * Converts a {@link PrismaGameWithNames} to {@link ExpandedGame}, renaming attirbutes and dropping all superfluous attributes.
 * @param game Game in database format to convert.
 */
export function prismaGameToExpandedGame(
  game: PrismaGameWithNames
): ExpandedGame {
  return {
    BGGRank: game.BGGRank,
    BGGRating: game.BGGRating,
    image: game.image,
    id: game.id,
    maxPlayers: game.maxPlayers,
    minPlayers: game.minPlayers,
    name: game.name,
    playingTime: game.playingTime,
    thumbnail: game.thumbnail,
    weight: game.weight,
    wikidataId: game.wikidataId,
    year: game.year,
    names: game.alternateNames.map((n) => ({
      language: n.language,
      name: n.name,
    })),
  };
}

/**
 * Converts a {@link BggGame} to {@link ExpandedGame}, dropping all superfluous attributes.
 * @param game Game from BoardGameGeek to convert.
 */
export function bggGameToExpandedGame(game: BggGame): ExpandedGame {
  return {
    BGGRank: game.BGGRank,
    BGGRating: game.BGGRating,
    image: game.image,
    id: game.id,
    maxPlayers: game.maxPlayers,
    minPlayers: game.minPlayers,
    name: game.name,
    playingTime: game.playingTime,
    thumbnail: game.thumbnail,
    weight: game.weight,
    wikidataId: null,
    year: game.year,
    names: [],
  };
}

/**
 * Converts a {@link ExpandedGame} to {@link Game}, dropping all superfluous attributes
 * @param game Game to convert.
 */
export function expandedGameToGame(game: ExpandedGame): Game {
  return {
    BGGRank: game.BGGRank,
    BGGRating: game.BGGRating,
    image: game.image,
    id: game.id,
    maxPlayers: game.maxPlayers,
    minPlayers: game.minPlayers,
    name: game.name,
    playingTime: game.playingTime,
    thumbnail: game.thumbnail,
    weight: game.weight,
    wikidataId: game.wikidataId,
    year: game.year,
  };
}

/**
 * Converts a {@link Game} to {@link ExpandedGame}, initializing all needed attributes empty or undefined.
 * @param game Game to convert.
 */
export function gameToExpandedGame(game: Game): ExpandedGame {
  return { ...game, names: [] };
}

/**
 * Converts a {@link ExpandedGame} to {@link BggGame}, dropping all superfluous attributes and initializing all additional attributes empty or undefined.
 * @param game Game to convert
 */
export function expandedGameToBggGame(game: ExpandedGame): BggGame {
  return {
    BGGRank: game.BGGRank,
    BGGRating: game.BGGRating,
    image: game.image,
    id: game.id,
    maxPlayers: game.maxPlayers,
    minPlayers: game.minPlayers,
    name: game.name,
    playingTime: game.playingTime,
    thumbnail: game.thumbnail,
    weight: game.weight,
    year: game.year,
    age: 0,
    artists: [],
    description: "",
    designers: [],
  };
}
