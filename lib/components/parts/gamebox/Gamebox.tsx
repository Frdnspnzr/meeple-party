"use client";

import useGame from "@/hooks/api/useGame";
import useGameBoxSize from "@/hooks/useGameBoxSize";
import useUserProfile from "@/hooks/useUserProfile";
import useCollectionStatus from "@/lib/hooks/useCollectionStatus";
import useFriendCollectionStatus from "@/lib/hooks/useFriendCollectionStatus";
import GameboxBig from "./GameboxBig/GameboxBig";
import GameboxMedium from "./GameboxMedium/GameboxMedium";

export interface GameboxProps {
  gameId: number;
}

export default function Gamebox({
  gameId,
}: Readonly<GameboxProps & React.HTMLAttributes<HTMLDivElement>>) {
  const {
    data: friendCollections,
    isLoading: friendCollectionLoading,
    isError: friendCollectionError,
  } = useFriendCollectionStatus(gameId);
  const [gameBoxSize] = useGameBoxSize();
  const {
    data: collectionStatus,
    mutate: updateCollectionStatus,
    isLoading: collectionStatusIsLoading,
    isError: collectionStatusIsError,
  } = useCollectionStatus(gameId);
  const { userProfile } = useUserProfile();
  const {
    data: gameData,
    isLoading: gameIsLoading,
    isError: gameIsError,
  } = useGame(gameId);

  const isLoading =
    collectionStatusIsLoading || gameIsLoading || friendCollectionLoading;
  const isError =
    collectionStatusIsError || gameIsError || friendCollectionError;

  if (gameData) {
    const friends = friendCollections || {
      own: [],
      wantToPlay: [],
      wishlist: [],
    };
    const my = {
      own: !!collectionStatus?.own,
      wantToPlay: !!collectionStatus?.wantToPlay,
      wishlist: !!collectionStatus?.wishlist,
    };
    if (gameBoxSize === "md") {
      return (
        <GameboxMedium
          game={gameData}
          friendCollections={friends}
          myCollection={my}
          updateStatus={updateCollectionStatus}
        />
      );
    } else if (gameBoxSize === "xl") {
      return (
        <GameboxBig
          game={gameData}
          friendCollections={friends}
          myCollection={my}
          updateStatus={updateCollectionStatus}
        />
      );
    }
  } else {
    return <>…</>;
  }
}
