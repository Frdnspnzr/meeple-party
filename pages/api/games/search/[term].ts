import {
  ExtendedGameCollection,
  GameCollectionStatus,
} from "@/datatypes/collection";
import { ExpandedGame } from "@/datatypes/game";
import { prisma } from "@/db";
import { withUser } from "@/utility/apiAuth";
import { searchBggGames } from "@/utility/bgg";
import { findFriendCollection } from "@/utility/collections";
import { getGameData } from "@/utility/games";
import { GameCollection, RelationshipType, User } from "@prisma/client";
import { XMLParser } from "fast-xml-parser";
import { NextApiRequest, NextApiResponse } from "next";
import validator from "validator";

const parser = new XMLParser({
  ignoreAttributes: false,
});

export default withUser(async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
  user: User
) {
  try {
    if (req.method === "GET") {
      const term = getSanitizedSearchTerm(req);
      const games = await searchBggGames(term).then(getGameData);
      const enrichedGameData = await enrichGameData(games, user.id);
      res.status(200).json(enrichedGameData);
    } else {
      res.status(405).send({});
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, error: e });
  }
});

async function enrichGameData(
  games: ExpandedGame[],
  userId: string
): Promise<ExtendedGameCollection[]> {
  const gameIds = games.map((g) => g.id);
  const myCollectionStatus = await getMyCollectionStatus(gameIds, userId);
  const myFriendsCollectionStatus = await getMyFriendsCollectionStatus(
    gameIds,
    userId
  );

  return games.map((game) => ({
    game,
    status: extractStatus(game.id, myCollectionStatus),
    friendCollections: findFriendCollection(game.id, myFriendsCollectionStatus),
  }));
}

function extractStatus(
  gameId: number,
  myCollectionStatus: GameCollection[]
): GameCollectionStatus {
  const status = myCollectionStatus.find((s) => s.gameId === gameId);
  if (!status) {
    return {
      own: false,
      wantToPlay: false,
      wishlist: false,
    };
  }
  return {
    own: status.own,
    wantToPlay: status.wantToPlay,
    wishlist: status.wishlist,
  };
}

async function getMyFriendsCollectionStatus(gameIds: number[], userId: string) {
  return await prisma.gameCollection.findMany({
    where: {
      gameId: { in: gameIds },
      user: {
        OR: [
          {
            receivedRelationships: {
              some: {
                senderId: userId,
                type: RelationshipType.FRIENDSHIP,
              },
            },
          },
          {
            sentRelationships: {
              some: {
                recipientId: userId,
                type: RelationshipType.FRIENDSHIP,
              },
            },
          },
        ],
      },
    },
    include: { user: true },
  });
}

async function getMyCollectionStatus(gameIds: number[], userId: string) {
  return await prisma.gameCollection.findMany({
    where: { gameId: { in: gameIds }, userId },
  });
}

function getSanitizedSearchTerm(req: NextApiRequest): string {
  const { term } = req.query;
  if (
    !term ||
    Array.isArray(term) ||
    !validator.isLength(term, { min: 1, max: 150 })
  ) {
    throw Error("Search term has an invalid format.");
  }
  return validator.stripLow(validator.trim(term));
}
