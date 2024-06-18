import { GameGetResult } from "@/app/api/v2/game/[gameId]/route";
import { ExpandedGame, Game } from "@/datatypes/game";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Result } from "./types";

const twoWeeksInMilliSeconds = 1000 * 60 * 60 * 24 * 14;

function getGame(gameId: number) {
  return axios
    .get<GameGetResult>(`/api/v2/game/${gameId}`)
    .then((response) => response.data.game);
}

export default function useGame(gameId: number): Result<Game> {
  const queryKey = useGameQueryKey();
  const queryClient = useQueryClient();
  const { isLoading, isError, data } = useQuery({
    queryKey: queryKey(gameId),
    queryFn: () => getGame(gameId),
    refetchOnWindowFocus: false,
    staleTime: twoWeeksInMilliSeconds,
  });

  return {
    isLoading,
    isError,
    data,
    invalidate: () => {
      queryClient.invalidateQueries({ queryKey: queryKey(gameId) });
    },
  };
}

export function useGameQuery(): (gameId: number) => Promise<ExpandedGame> {
  const queryClient = useQueryClient();
  const getKey = useGameQueryKey();
  return (gameId) => {
    const cached = queryClient.getQueryData<ExpandedGame>(getKey(gameId));
    if (cached) {
      return Promise.resolve(cached);
    }
    return getGame(gameId).then((game) => {
      queryClient.setQueryData(getKey(gameId), game);
      return game;
    });
  };
}

export function useGameQueryKey(): (gameId: number) => any[] {
  return (gameId) => ["game", gameId];
}
