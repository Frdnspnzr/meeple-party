import { prisma } from "@/db";
import { getGameData } from "@/utility/games";
import { NextResponse } from "next/server";
import { getCronAuthToken } from "../../utility";

interface UpdateGamesResult {
  success: boolean;
  games: { id: number; name: string }[];
}

const AUTHENTICATION_HEADER_NAME = "CronAuth";

/**
 * Updates the games that haven't been updated for the longest. *
 * @param request HTTP request data
 * @returns Wether the update was a success or not and, if successful, what games were updated.
 */
export async function PATCH(request: Request) {
  try {
    const token = getCronAuthToken();
    if (
      !request.headers.has(AUTHENTICATION_HEADER_NAME) ||
      request.headers.get(AUTHENTICATION_HEADER_NAME) !== token
    ) {
      throw "Wrong authentication header.";
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, games: [] } as UpdateGamesResult,
      {
        status: 403,
      }
    );
  }

  try {
    const gamesToUpdate = await prisma.game.findMany({
      select: { id: true },
      orderBy: { updatedAt: "asc" },
      take: 10,
    });

    const games = await getGameData(
      gamesToUpdate.map((g) => g.id),
      "always"
    );

    return NextResponse.json({
      success: true,
      games: games.map((g) => ({ id: g.id, name: g.name })),
    } as UpdateGamesResult);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        games: [],
      } as UpdateGamesResult,
      { status: 500 }
    );
  }
}
