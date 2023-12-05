"use client";

import AvatarStack from "@/components/AvatarStack/AvatarStack";
import PersonList from "@/components/PersonList/PersonList";
import StatusButton from "@/components/StatusButton/StatusButton";
import { useModal } from "@/context/modalContext";
import { StatusByUser } from "@/datatypes/collection";
import { Game } from "@/datatypes/game";
import { UserProfile } from "@/datatypes/userProfile";
import useCollectionStatus from "@/hooks/api/useCollectionStatus";
import { useTranslation } from "@/i18n/client";
import classNames from "classnames";
import Image from "next/image";
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
        <Image
          src={game.image}
          alt={game.name}
          width={250}
          height={250}
          unoptimized
          className={classNames(styles.image, "rounded-start")}
        />
      ) : (
        <div className={classNames(styles.image, "rounded-start")} />
      )}
      <MetricList game={game} />
      <h2 className={styles.name}>{game.name}</h2>
      <StatusList game={game} friendCollection={friendCollection} />
    </div>
  );
}

function MetricList({ game }: Readonly<{ game: Game }>) {
  const { t } = useTranslation("game");
  return (
    <div className={styles.info}>
      <Metric
        text={round(game.weight).toString()}
        label={t("Attributes.Weight")}
      />
      <hr className={styles.metricDivider} />
      <Metric
        text={game.playingTime.toString()}
        label={t("Attributes.PlayingTime")}
      />
      <hr className={styles.metricDivider} />
      <Metric
        text={
          game.minPlayers === game.maxPlayers
            ? game.minPlayers.toString()
            : `${game.minPlayers}-${game.maxPlayers}`
        }
        label={t("Attributes.Players")}
      />
    </div>
  );
}

function Metric({ text, label }: Readonly<{ text: string; label: string }>) {
  return (
    <div className={styles.metric}>
      <div className={styles.metricTitle}>{text}</div>
      <div className={styles.metricLabel}>{label}</div>
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
  const { open: openModal } = useModal();
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
      content: <PersonList persons={friends} />,
    });
  }, [friends, game.name, ct, openModal, translationBaseKey]);

  return (
    <>
      <div
        className={classNames({
          [styles.myStatusOwn]: status === "own",
          [styles.myStatusWantToPlay]: status === "wanttoplay",
          [styles.myStatusWishlist]: status === "wishlist",
        })}
      >
        <StatusButton
          status={status}
          gameId={game.id}
          className={styles.statusButton}
        />
        <div className={styles.statusText}>
          {state
            ? t(`States.${translationBaseKey}`)
            : t(`States.Not${translationBaseKey}`)}
        </div>
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

function round(x: number): number {
  return Math.round(x * 10) / 10;
}
