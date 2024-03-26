"use client";

import AvatarStack from "@/components/AvatarStack/AvatarStack";
import PersonList from "@/components/PersonList/PersonList";
import { useModal } from "@/context/modalContext";
import { GameCollectionStatus, StatusByUser } from "@/datatypes/collection";
import { Game } from "@/datatypes/game";
import { UserProfile } from "@/datatypes/userProfile";
import { useTranslation } from "@/i18n/client";
import classNames from "classnames";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useMemo } from "react";
import StatusButton from "../../StatusButton/StatusButton";
import GameboxProps from "../interface";
import styles from "./gameboxbig.module.css";

export default function GameboxBig({
  game,
  friendCollections,
  myCollection,
  updateStatus,
}: Readonly<GameboxProps>) {
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
        <Link href={`/app/game/${game.id}`}>{game.name}</Link>
      </h2>

      <StatusList
        game={game}
        friendCollection={friendCollections}
        myCollection={myCollection}
        updateStatus={updateStatus}
      />
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
  myCollection,
  updateStatus,
}: Readonly<{
  game: Game;
  friendCollection?: StatusByUser;
  myCollection: GameCollectionStatus;
  updateStatus?: (status: Partial<GameCollectionStatus>) => void;
}>) {
  return (
    <>
      <Status
        game={game}
        status="own"
        friends={friendCollection ? friendCollection.own : []}
        myCollection={myCollection}
        updateStatus={updateStatus}
      />
      <Status
        game={game}
        status="wanttoplay"
        friends={friendCollection ? friendCollection.wantToPlay : []}
        myCollection={myCollection}
        updateStatus={updateStatus}
      />
      <Status
        game={game}
        status="wishlist"
        friends={friendCollection ? friendCollection.wishlist : []}
        myCollection={myCollection}
        updateStatus={updateStatus}
      />
    </>
  );
}

function Status({
  game,
  friends,
  status,
  myCollection,
  updateStatus,
}: Readonly<{
  game: Game;
  friends: UserProfile[];
  myCollection: GameCollectionStatus;
  status: "own" | "wishlist" | "wanttoplay";
  updateStatus?: (status: Partial<GameCollectionStatus>) => void;
}>) {
  const { t } = useTranslation("default");
  const { t: ct } = useTranslation("collection");
  const { open: openModal, close: closeModal } = useModal();
  const state = useMemo(() => {
    if (status === "own") {
      return myCollection.own;
    } else if (status === "wanttoplay") {
      return myCollection.wantToPlay;
    } else if (status === "wishlist") {
      return myCollection.wishlist;
    }
  }, [myCollection, status]);

  const translationBaseKey = useMemo(() => {
    if (status === "own") {
      return "Own";
    } else if (status === "wanttoplay") {
      return "WantToPlay";
    } else if (status === "wishlist") {
      return "Wishlist";
    }
  }, [status]);

  const toggle = useCallback(() => {
    if (!updateStatus) return;
    if (status === "own") {
      updateStatus({
        own: !myCollection.own,
        wantToPlay: myCollection.wantToPlay,
        wishlist: myCollection.wishlist,
      });
    } else if (status === "wanttoplay") {
      updateStatus({
        own: myCollection.own,
        wantToPlay: !myCollection.wantToPlay,
        wishlist: myCollection.wishlist,
      });
    } else if (status === "wishlist") {
      updateStatus({
        own: myCollection.own,
        wantToPlay: myCollection.wantToPlay,
        wishlist: !myCollection.wishlist,
      });
    }
  }, [myCollection, status, updateStatus]);

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
        <StatusButton
          status={status}
          className={styles.statusButton}
          active={state || false}
          toggle={toggle}
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
