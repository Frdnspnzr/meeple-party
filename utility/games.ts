import { BggGame, Game } from "@/datatypes/game";
import { PrismaClient } from "@prisma/client";
import { getBggGames } from "./bgg";

const prisma = new PrismaClient();

const DEV = process.env.NODE_ENV === "development";

const MONTHLY = 30 * 24 * 60 * 60;

export async function fetchGames(gameIds: number[]): Promise<Game[]> {
  const gamesFromDatabase = await prisma.game.findMany({
    where: {
      id: { in: gameIds },
    },
  });

  const staleIds = gamesFromDatabase
    .filter(
      (g) =>
        !g.updatedAt ||
        (Date.now().valueOf() - g.updatedAt.valueOf()) / 1000 >
          getUpdateInterval()
    )
    .map((g) => g.id);

  const missingIds = gameIds.filter(
    (gameId) => !gamesFromDatabase.find((g) => g.id === gameId)
  );

  const missingGames = (await getBggGames(missingIds)).map(convertForDataBase);
  const staleGames = (await getBggGames(staleIds)).map(convertForDataBase);

  if (missingGames && missingGames.length > 0) {
    if (DEV) {
      console.log(
        "Inserting missing games",
        missingGames.map((g) => `${[g.id]} ${g.name}}`)
      );
    }
    await prisma.game.createMany({ data: missingGames });
  }
  if (staleGames && staleGames.length > 0) {
    if (DEV) {
      console.log(
        "Updating stale games",
        staleGames.map((g) => `${[g.id]} ${g.name}`)
      );
    }
    for (let staleGame of staleGames) {
      await prisma.game.update({
        data: staleGame,
        where: { id: staleGame.id },
      });
    }
  }

  return [...gamesFromDatabase, ...missingGames];
}

function convertForDataBase(game: BggGame): Game {
  return {
    id: game.id,
    name: game.name,
    thumbnail: game.thumbnail,
    image: game.image,
    year: game.year,
    playingTime: game.playingTime,
    minPlayers: game.minPlayers,
    maxPlayers: game.maxPlayers,
    weight: game.weight,
    BGGRating: game.BGGRating,
    BGGRank: game.BGGRank,
  };
}

function getUpdateInterval() {
  if (process.env.BGG_UPDATE_INTERVAL) {
    return Number.parseInt(process.env.BGG_UPDATE_INTERVAL);
  } else {
    return MONTHLY;
  }
}
