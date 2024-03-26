"use client";

import Avatar from "@/components/Avatar/Avatar";
import { GameCollectionStatus } from "@/datatypes/collection";
import { UserProfile } from "@/datatypes/userProfile";
import { useTranslation } from "@/i18n/client";
import classNames from "classnames";
import Image from "next/image";
import Link from "next/link";
import StatusButton from "../../StatusButton/StatusButton";
import GameboxProps from "../interface";
import styles from "./gameboxmedium.module.css";

export default function GameboxMedium({
  game,
  friendCollections,
  myCollection,
  updateStatus,
}: Readonly<GameboxProps>) {
  const { t } = useTranslation("game");

  const update = (status: Partial<GameCollectionStatus>) => {
    if (updateStatus) {
      updateStatus(status);
    }
  };

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
        <div className={styles.collectionbuttons}>
          <StatusButton
            status={"own"}
            className={styles.statusButton}
            active={myCollection.own}
            toggle={() =>
              update({
                own: !myCollection.own,
                wantToPlay: myCollection.wantToPlay,
                wishlist: myCollection.wishlist,
              })
            }
          />
          <StatusButton
            status={"wanttoplay"}
            className={styles.statusButton}
            active={myCollection.wantToPlay}
            toggle={() =>
              update({
                own: myCollection.own,
                wantToPlay: !myCollection.wantToPlay,
                wishlist: myCollection.wishlist,
              })
            }
          />
          <StatusButton
            status={"wishlist"}
            className={styles.statusButton}
            active={myCollection.wishlist}
            toggle={() =>
              update({
                own: myCollection.own,
                wantToPlay: myCollection.wantToPlay,
                wishlist: !myCollection.wishlist,
              })
            }
          />
        </div>
      </div>
      <Link href={`/app/game/${game.id}`} className={styles.friends}>
        <div className={styles.collection}>
          <UserList users={friendCollections.own} />
        </div>
        <div className={styles.collection}>
          <UserList users={friendCollections.wantToPlay} />
        </div>
        <div className={styles.collection}>
          <UserList users={friendCollections.wishlist} />
        </div>
      </Link>
    </div>
  );
}

function round(x: number): number {
  return Math.round(x * 10) / 10;
}

function UserList({ users }: Readonly<{ users: UserProfile[] }>) {
  return (
    <>
      {users.map((u, i) => (
        <CollectionAvatar user={u} index={i} key={u.id} />
      ))}
    </>
  );
}

function CollectionAvatar({
  user,
  index,
}: Readonly<{
  user: UserProfile;
  index: number;
}>) {
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
