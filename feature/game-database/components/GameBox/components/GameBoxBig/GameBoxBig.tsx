"use client";

import StatusButton from "@/feature/game-collection/components/StatusButton/StatusButton";
import useCollectionStatus from "@/feature/game-collection/hooks/useCollectionStatus";
import GameName from "@/feature/game-database/components/GameName/GameName";
import Metric from "@/feature/game-database/components/Metric/Metric";
import AvatarStack from "@/feature/profiles/components/AvatarStack/AvatarStack";
import PersonList from "@/feature/profiles/components/PersonList/PersonList";
import { useTranslation } from "@/i18n/client";
import { useModal } from "@/lib/contexts/modalContext";
import { StatusByUser } from "@/lib/types/collection";
import { Game } from "@/lib/types/game";
import { UserProfile } from "@/lib/types/userProfile";
import classNames from "classnames";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useMemo } from "react";
import { GameBoxProps } from "../../GameBox";
import styles from "./gameboxbig.module.css";

export default function GameBoxBig({
  game,
  friendCollection,
}: Readonly<GameBoxProps>) {
  return (
    <div className={classNames("card", styles.card)}>
      {game.image ? (
        <Link href={`/app/game/${game.id}`} className={styles.imagePosition}>
          <Image
            src={game.image}
            alt={game.name}
            width={250}
            height={250}
            unoptimized
            className={classNames(styles.image, "rounded-start")}
          />
        </Link>
      ) : (
        <div className={classNames(styles.image, "rounded-start")} />
      )}
      <MetricList game={game} />

      <h2 className={styles.name}>
        <Link href={`/app/game/${game.id}`}>
          <GameName game={game} />
        </Link>
      </h2>

      <StatusList game={game} friendCollection={friendCollection} />
    </div>
  );
}

function MetricList({ game }: Readonly<{ game: Game }>) {
  const { t } = useTranslation("game");
  return (
    <div className={styles.info}>
      <Metric
        value={game.weight}
        precision={1}
        label={t("Attributes.Weight")}
      />
      <hr className={styles.metricDivider} />
      <Metric value={game.playingTime} label={t("Attributes.PlayingTime")} />
      <hr className={styles.metricDivider} />
      <Metric
        value={
          game.minPlayers === game.maxPlayers
            ? game.minPlayers.toString()
            : `${game.minPlayers}-${game.maxPlayers}`
        }
        label={t("Attributes.Players")}
      />
    </div>
  );
}

function StatusList({
  game,
  friendCollection,
}: Readonly<{
  game: Game;
  friendCollection?: StatusByUser;
}>) {
  return (
    <>
      <Status
        game={game}
        status="own"
        friends={friendCollection ? friendCollection.own : []}
      />
      <Status
        game={game}
        status="wanttoplay"
        friends={friendCollection ? friendCollection.wantToPlay : []}
      />
      <Status
        game={game}
        status="wishlist"
        friends={friendCollection ? friendCollection.wishlist : []}
      />
    </>
  );
}

function Status({
  game,
  friends,
  status,
}: Readonly<{
  game: Game;
  friends: UserProfile[];
  status: "own" | "wishlist" | "wanttoplay";
}>) {
  const { t } = useTranslation("default");
  const { t: ct } = useTranslation("collection");
  const { data } = useCollectionStatus(game.id);
  const { open: openModal, close: closeModal } = useModal();
  const state = useMemo(() => {
    if (!data) {
      return false;
    } else if (status === "own") {
      return data.own;
    } else if (status === "wanttoplay") {
      return data.wantToPlay;
    } else if (status === "wishlist") {
      return data.wishlist;
    }
  }, [data, status]);

  const translationBaseKey = useMemo(() => {
    if (status === "own") {
      return "Own";
    } else if (status === "wanttoplay") {
      return "WantToPlay";
    } else if (status === "wishlist") {
      return "Wishlist";
    }
  }, [status]);

  const showFriends = useCallback(() => {
    openModal({
      title: ct(`FriendCollections.${translationBaseKey}`, {
        game: game.name,
      }),
      content: <PersonList persons={friends} onClick={closeModal} />,
    });
  }, [friends, game.name, ct, openModal, closeModal, translationBaseKey]);

  return (
    <>
      <div
        className={classNames({
          [styles.myStatusOwn]: status === "own",
          [styles.myStatusWantToPlay]: status === "wanttoplay",
          [styles.myStatusWishlist]: status === "wishlist",
        })}
      >
        <StatusButton status={status} gameId={game.id} />
      </div>
      {friends.length > 0 && (
        <div
          className={classNames({
            [styles.friendStatusOwn]: status === "own",
            [styles.friendStatusWantToPlay]: status === "wanttoplay",
            [styles.friendStatusWishlist]: status === "wishlist",
          })}
          onClick={showFriends}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              showFriends();
            }
          }}
          tabIndex={0}
          data-testid={`friends-${translationBaseKey}`}
        >
          <AvatarStack
            max={4}
            distance="sm"
            avatars={friends.map((f) => ({
              id: f.id,
              name: f.name || "",
              image: f.image,
            }))}
          />
          <div className={styles.statusText}>
            {t(`FriendStates.${translationBaseKey}`, { count: friends.length })}
          </div>
        </div>
      )}
    </>
  );
}
