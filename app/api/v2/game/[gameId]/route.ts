import { fetchGames } from "@/utility/games";
import { Game } from "@prisma/client";
import { NextResponse } from "next/server";
import validator from "validator";

export interface GameGetResult {
  game: Game;
}

export async function GET(
  request: Request,
  { params }: { params: { gameId: string } }
) {
  if (!validator.isInt(params.gameId)) {
    throw new Error("Game ID format error");
  }
  const gameId = validator.toInt(params.gameId);

  if (gameId < 1 || gameId > 999999999) {
    throw new Error("Game ID format error");
  }

  const games = await fetchGames([gameId]);

  if (!games || games.length === 0) {
    return new Response(`Can not find game with id ${gameId}`, { status: 404 });
  }

  if (games.length > 1) {
    return new Response(`Multiple games with id ${gameId} found.`, {
      status: 500,
    });
  }

  return NextResponse.json({
    game: games[0],
  } as GameGetResult);
}
