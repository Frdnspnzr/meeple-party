import { Game } from "@/datatypes/game";
import { prisma } from "@/db";
import { withUser } from "@/utility/apiAuth";
import { getGameData } from "@/utility/games";
import { User } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

export interface CollectionStatus {
  own: undefined | boolean;
  wantToPlay: undefined | boolean;
  wishlist: undefined | boolean;
}

export interface CollectionUpdate {
  success: boolean;
  game: Game;
  status: CollectionStatus;
}

export default withUser(async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
  user: User
) {
  if (req.method === "GET") {
    try {
      const gameId = getGameId(req);
      const collection = await prisma.gameCollection.findUnique({
        where: { userId_gameId: { gameId, userId: user.id } },
      });
      if (!collection) {
        return res.status(200).json(
          JSON.stringify({
            own: false,
            wishlist: false,
            wantToPlay: false,
          } as CollectionStatus)
        );
      }
      return res.status(200).json(
        JSON.stringify({
          own: collection.own,
          wishlist: collection.wishlist,
          wantToPlay: collection.wantToPlay,
        } as CollectionStatus)
      );
    } catch (e) {
      console.error(e);
      return res.status(500).json({ success: false, error: e });
    }
  } else if (req.method === "POST") {
    try {
      const gameId = getGameId(req);
      const parameters = JSON.parse(req.body) as CollectionStatus;
      const game = (await getGameData([gameId]))[0];

      if (parameters.own || parameters.wantToPlay || parameters.wishlist) {
        await upsertStatus(gameId, user.id, parameters);
      } else {
        await deleteStatus(gameId, user.id);
      }
      return res
        .status(200)
        .json({ success: true, status: parameters, game } as CollectionUpdate);
    } catch (e) {
      console.error(e);
      return res.status(500).json({ success: false, error: e });
    }
  }
});

function getCollectionStatusPartial(status: {
  own: undefined | boolean;
  wantToPlay: undefined | boolean;
  wishlist: undefined | boolean;
}): object {
  let ret = {};
  if (status.own !== undefined) {
    ret = { ...ret, own: status.own };
  }
  if (status.wantToPlay !== undefined) {
    ret = { ...ret, wantToPlay: status.wantToPlay };
  }
  if (status.wishlist !== undefined) {
    ret = { ...ret, wishlist: status.wishlist };
  }
  return ret;
}

function getGameId(req: NextApiRequest): number {
  const { gameId } = req.query;
  if (!gameId || Array.isArray(gameId)) {
    throw new Error("Game ID format error");
  }
  //TODO Validation
  return Number.parseInt(gameId);
}

async function upsertStatus(
  gameId: number,
  userId: string,
  status: CollectionStatus
) {
  await prisma.gameCollection.upsert({
    where: {
      userId_gameId: {
        gameId,
        userId,
      },
    },
    update: {
      ...getCollectionStatusPartial(status),
    },
    create: {
      userId,
      gameId,
      own: !!status.own,
      wantToPlay: !!status.wantToPlay,
      wishlist: !!status.wishlist,
    },
  });
}

async function deleteStatus(gameId: number, userId: string) {
  await prisma.gameCollection.delete({
    where: { userId_gameId: { gameId, userId } },
  });
}
