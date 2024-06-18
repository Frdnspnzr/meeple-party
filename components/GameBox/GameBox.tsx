"use client";

import { StatusByUser } from "@/datatypes/collection";
import { ExpandedGame, Game } from "@/datatypes/game";
import useGameBoxSize from "@/hooks/useGameBoxSize";
import { CollectionStatus } from "@/pages/api/collection/[gameId]";
import { useEffect, useState } from "react";
import GameBoxBig from "./components/GameBoxBig/GameBoxBig";
import GameBoxMedium from "./components/GameBoxMedium/GameBoxMedium";

export interface GameBoxProps {
  game: ExpandedGame;
  status?: CollectionStatus;
  friendCollection?: StatusByUser;
  showFriendCollection: boolean;
}

export default function GameBox({
  game,
  status,
  friendCollection,
  showFriendCollection = false,
}: Readonly<GameBoxProps & React.HTMLAttributes<HTMLDivElement>>) {
  const [gameData, setGameData] = useState<ExpandedGame>();
  const [friendCollections, setFriendCollections] = useState<StatusByUser>();
  const [gameBoxSize] = useGameBoxSize();

  useEffect(() => {
    if (showFriendCollection) {
      if (!friendCollection) {
        fetch(`/api/collection/friends/byGame/${getGameId(game)}`)
          .then((response) => {
            if (response.ok) {
              return response.json();
            } else {
              throw Error(`${response.status} ${response.statusText}`);
            }
          })
          .then(setFriendCollections)
          .catch((reason) => {
            throw Error(
              `Error loading friend collection data for game ${game}. Reason: ${reason}`
            );
          });
      } else {
        setFriendCollections(friendCollection);
      }
    }
  }, [game, friendCollection, showFriendCollection]);

  useEffect(() => {
    if (typeof game === "number") {
      fetch(`/api/games/${game}`)
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw Error(`${response.status} ${response.statusText}`);
          }
        })
        .then(setGameData)
        .catch((reason) => {
          throw Error(`Error loading data for game ${game}. Reason: ${reason}`);
        });
    } else {
      setGameData(game);
    }
  }, [game]);

  if (gameData) {
    if (gameBoxSize === "md") {
      return (
        <GameBoxMedium
          game={gameData}
          status={status}
          friendCollection={friendCollections}
          showFriendCollection={showFriendCollection}
        />
      );
    } else if (gameBoxSize === "xl") {
      return (
        <GameBoxBig
          game={gameData}
          status={status}
          friendCollection={friendCollections}
          showFriendCollection={showFriendCollection}
        />
      );
    }
  } else {
    return <>…</>;
  }
}

function getGameId(game: Game | number) {
  if (typeof game === "number") {
    return game;
  }
  return game.id;
}
