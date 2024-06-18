import {
  generateArray,
  generateDate,
  generateNumber,
  generateString,
} from "@/utility/test";
import {
  BggGame,
  ExpandedGame,
  Game,
  PrismaGame,
  PrismaGameWithNames,
  bggGameToExpandedGame,
  expandedGameToBggGame,
  expandedGameToGame,
  gameToExpandedGame,
  prismaGameToExpandedGame,
  prismaGameToGame,
} from "../game";

describe("Game datatype conversions", () => {
  describe("prismaGameToGame", () => {
    it("converts", () => {
      const givenPrismaGame: PrismaGame = {
        id: generateNumber(),
        BGGRank: generateNumber(),
        BGGRating: generateNumber(),
        image: generateString(),
        maxPlayers: generateNumber(),
        minPlayers: generateNumber(),
        name: generateString(),
        playingTime: generateNumber(),
        thumbnail: generateString(),
        updatedAt: generateDate(),
        weight: generateNumber(),
        wikidataId: generateString(),
        year: generateNumber(),
      };
      const expectedGame: Game = {
        BGGRank: givenPrismaGame.BGGRank,
        BGGRating: givenPrismaGame.BGGRating,
        image: givenPrismaGame.image,
        id: givenPrismaGame.id,
        maxPlayers: givenPrismaGame.maxPlayers,
        minPlayers: givenPrismaGame.minPlayers,
        name: givenPrismaGame.name,
        playingTime: givenPrismaGame.playingTime,
        thumbnail: givenPrismaGame.thumbnail,
        weight: givenPrismaGame.weight,
        wikidataId: givenPrismaGame.wikidataId,
        year: givenPrismaGame.year,
      };

      const result = prismaGameToGame(givenPrismaGame);

      expect(result).toEqual(expectedGame);
    });
  });
  describe("prismaGameToExpandedGame", () => {
    it("converts", () => {
      const id = generateNumber();
      const givenPrismaGameWithNames: PrismaGameWithNames = {
        id,
        BGGRank: generateNumber(),
        BGGRating: generateNumber(),
        image: generateString(),
        maxPlayers: generateNumber(),
        minPlayers: generateNumber(),
        name: generateString(),
        playingTime: generateNumber(),
        thumbnail: generateString(),
        updatedAt: generateDate(),
        weight: generateNumber(),
        wikidataId: generateString(),
        year: generateNumber(),
        alternateNames: generateArray(() => ({
          gameId: id,
          language: generateString(2),
          name: generateString(),
        })),
      };
      const expectedExpandedGame: ExpandedGame = {
        BGGRank: givenPrismaGameWithNames.BGGRank,
        BGGRating: givenPrismaGameWithNames.BGGRating,
        image: givenPrismaGameWithNames.image,
        id: givenPrismaGameWithNames.id,
        maxPlayers: givenPrismaGameWithNames.maxPlayers,
        minPlayers: givenPrismaGameWithNames.minPlayers,
        name: givenPrismaGameWithNames.name,
        playingTime: givenPrismaGameWithNames.playingTime,
        thumbnail: givenPrismaGameWithNames.thumbnail,
        weight: givenPrismaGameWithNames.weight,
        wikidataId: givenPrismaGameWithNames.wikidataId,
        year: givenPrismaGameWithNames.year,
        names: givenPrismaGameWithNames.alternateNames.map((n) => ({
          language: n.language,
          name: n.name,
        })),
      };

      const result = prismaGameToExpandedGame(givenPrismaGameWithNames);

      expect(result).toEqual(expectedExpandedGame);
    });
  });
  describe("bggGameToExpandedGame", () => {
    it("converts", () => {
      const givenBggGame: BggGame = {
        BGGRank: generateNumber(),
        BGGRating: generateNumber(),
        image: generateString(),
        maxPlayers: generateNumber(),
        minPlayers: generateNumber(),
        name: generateString(),
        playingTime: generateNumber(),
        thumbnail: generateString(),
        weight: generateNumber(),
        year: generateNumber(),
        age: generateNumber(),
        id: generateNumber(),
        description: generateString(),
        artists: generateArray(generateString),
        designers: generateArray(generateString),
      };
      const expectedExpandedGame: ExpandedGame = {
        BGGRank: givenBggGame.BGGRank,
        BGGRating: givenBggGame.BGGRating,
        image: givenBggGame.image,
        id: givenBggGame.id,
        maxPlayers: givenBggGame.maxPlayers,
        minPlayers: givenBggGame.minPlayers,
        name: givenBggGame.name,
        playingTime: givenBggGame.playingTime,
        thumbnail: givenBggGame.thumbnail,
        weight: givenBggGame.weight,
        names: [],
        wikidataId: null,
        year: givenBggGame.year,
      };

      const result = bggGameToExpandedGame(givenBggGame);
      expect(result).toEqual(expectedExpandedGame);
    });
  });
  describe("expandedGameToGame", () => {
    it("converts", () => {
      const givenExpandedGame: ExpandedGame = {
        BGGRank: generateNumber(),
        BGGRating: generateNumber(),
        image: generateString(),
        maxPlayers: generateNumber(),
        minPlayers: generateNumber(),
        name: generateString(),
        playingTime: generateNumber(),
        thumbnail: generateString(),
        weight: generateNumber(),
        year: generateNumber(),
        id: generateNumber(),
        names: generateArray(() => ({
          language: generateString(2),
          name: generateString(),
        })),
        wikidataId: generateString(),
      };
      const expectedGame: Game = {
        BGGRank: givenExpandedGame.BGGRank,
        BGGRating: givenExpandedGame.BGGRating,
        image: givenExpandedGame.image,
        id: givenExpandedGame.id,
        maxPlayers: givenExpandedGame.maxPlayers,
        minPlayers: givenExpandedGame.minPlayers,
        name: givenExpandedGame.name,
        playingTime: givenExpandedGame.playingTime,
        thumbnail: givenExpandedGame.thumbnail,
        weight: givenExpandedGame.weight,
        wikidataId: givenExpandedGame.wikidataId,
        year: givenExpandedGame.year,
      };

      const result = expandedGameToGame(givenExpandedGame);

      expect(result).toEqual(expectedGame);
    });
  });
  describe("gameToExpandedGame", () => {
    it("converts", () => {
      const givenGame: Game = {
        BGGRank: generateNumber(),
        BGGRating: generateNumber(),
        image: generateString(),
        maxPlayers: generateNumber(),
        minPlayers: generateNumber(),
        name: generateString(),
        playingTime: generateNumber(),
        thumbnail: generateString(),
        weight: generateNumber(),
        year: generateNumber(),
        id: generateNumber(),
        wikidataId: generateString(),
      };
      const expectedExpandedGame: ExpandedGame = {
        BGGRank: givenGame.BGGRank,
        BGGRating: givenGame.BGGRating,
        image: givenGame.image,
        id: givenGame.id,
        maxPlayers: givenGame.maxPlayers,
        minPlayers: givenGame.minPlayers,
        name: givenGame.name,
        playingTime: givenGame.playingTime,
        thumbnail: givenGame.thumbnail,
        weight: givenGame.weight,
        wikidataId: givenGame.wikidataId,
        year: givenGame.year,
        names: [],
      };

      const result = gameToExpandedGame(givenGame);

      expect(result).toEqual(expectedExpandedGame);
    });
  });
  describe("expandedGameToBggGame", () => {
    it("converts", () => {
      const givenExpandedGame: ExpandedGame = {
        BGGRank: generateNumber(),
        BGGRating: generateNumber(),
        image: generateString(),
        maxPlayers: generateNumber(),
        minPlayers: generateNumber(),
        name: generateString(),
        playingTime: generateNumber(),
        thumbnail: generateString(),
        weight: generateNumber(),
        year: generateNumber(),
        id: generateNumber(),
        names: generateArray(() => ({
          language: generateString(2),
          name: generateString(),
        })),
        wikidataId: generateString(),
      };
      const expectedBggGame: BggGame = {
        BGGRank: givenExpandedGame.BGGRank,
        BGGRating: givenExpandedGame.BGGRating,
        image: givenExpandedGame.image,
        id: givenExpandedGame.id,
        maxPlayers: givenExpandedGame.maxPlayers,
        minPlayers: givenExpandedGame.minPlayers,
        name: givenExpandedGame.name,
        playingTime: givenExpandedGame.playingTime,
        thumbnail: givenExpandedGame.thumbnail,
        weight: givenExpandedGame.weight,
        year: givenExpandedGame.year,
        description: "",
        age: 0,
        artists: [],
        designers: [],
      };

      const result = expandedGameToBggGame(givenExpandedGame);
      expect(result).toEqual(expectedBggGame);
    });
  });
});
