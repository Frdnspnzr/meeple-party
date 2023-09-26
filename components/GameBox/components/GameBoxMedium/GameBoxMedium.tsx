"use client";

import Avatar from "@/components/Avatar/Avatar";
import CollectionStatusButtons from "@/components/CollectionStatusButtons/CollectionStatusButtons";
import { StatusByUser } from "@/datatypes/collection";
import { Game } from "@/datatypes/game";
import { UserProfile } from "@/datatypes/userProfile";
import { useTranslation } from "@/i18n/client";
import { CollectionStatus } from "@/pages/api/collection/[gameId]";
import classNames from "classnames";
import Image from "next/image";
import Link from "next/link";
import styles from "./gameboxmedium.module.css";

export interface GameBoxProps {
  game: Game;
  status?: CollectionStatus;
  friendCollection?: StatusByUser;
  showFriendCollection: boolean;
}

export default function GameBoxMedium({
  game,
  status,
  friendCollection,
  showFriendCollection = false,
}: GameBoxProps) {
  const { t } = useTranslation("game");

  return (
    <div className={classNames(styles.container)}>
      <div className={styles.gamebox}>
        <Link href={`/app/game/${game.id}`}>
          <div className={styles.imageBox}>
            {!!game.thumbnail && (
              <Image
                src={game.thumbnail}
                className={`card-img-top ${styles.image}`}
                alt={game.name}
                width="200"
                height="150"
                unoptimized
              />
            )}
          </div>
        </Link>
        <div className={styles.title}>
          <h3 className="card-title">
            <Link href={`/app/game/${game.id}`}>{game.name}</Link>
          </h3>
        </div>
        <div className={styles.info}>
          <div className={styles.infoBox}>
            <div className={styles.metric}>
              {game.minPlayers === game.maxPlayers ? (
                game.minPlayers
              ) : (
                <>
                  {game.minPlayers}-{game.maxPlayers}
                </>
              )}
            </div>
            <div className={styles.label}>{t("Attributes.Players")}</div>
          </div>
          <div className={styles.infoBox}>
            <div className={styles.metric}>{game.playingTime}</div>
            <div className={styles.label}>
              {t("Filters.Traits.PlayingTime")}
            </div>
          </div>
          <div className={styles.infoBox}>
            <div className={styles.metric}>{round(game.weight)}</div>
            <div className={styles.label}>{t("Attributes.Weight")}</div>
          </div>
        </div>
        <CollectionStatusButtons
          gameId={game.id}
          status={status}
          className={styles.collectionbuttons}
        />
      </div>
      {showFriendCollection && friendCollection && (
        <Link href={`/app/game/${game.id}`} className={styles.friends}>
          <div className={styles.collection}>
            <UserList users={friendCollection.own} />
          </div>
          <div className={styles.collection}>
            <UserList users={friendCollection.wantToPlay} />
          </div>
          <div className={styles.collection}>
            <UserList users={friendCollection.wishlist} />
          </div>
        </Link>
      )}
    </div>
  );
}

function round(x: number): number {
  return Math.round(x * 10) / 10;
}

function UserList({ users }: { users: UserProfile[] }) {
  return (
    <>
      {users.map((u, i) => (
        <CollectionAvatar user={u} index={i} key={i} />
      ))}
    </>
  );
}

function CollectionAvatar({
  user,
  index,
}: {
  user: UserProfile;
  index: number;
}) {
  return (
    <Avatar
      name={user.name || ""}
      image={user.image}
      key={user.id}
      className={styles.person}
      style={{ zIndex: index * -1 }}
    />
  );
}
