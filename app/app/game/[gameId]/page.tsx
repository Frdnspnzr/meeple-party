import Avatar from "@/components/Avatar/Avatar";
import BggRating from "@/components/BggRating/BggRating";
import CollectionStatusButtons from "@/components/CollectionStatusButtons/CollectionStatusButtons";
import { ExpandedGame } from "@/datatypes/game";
import { getGameLanguage, getTranslation } from "@/i18n";
import { getCollectionStatusOfFriends } from "@/selectors/collections";
import { getBggGame } from "@/utility/bgg";
import { getGameData } from "@/utility/games";
import { getServerUser } from "@/utility/serverSession";
import classNames from "classnames";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next/types";
import styles from "./gamepage.module.css";

export async function generateMetadata({
  params,
}: {
  params: { gameId: string };
}): Promise<Metadata> {
  const id = Number.parseInt(params.gameId);
  if (!Number.isInteger(id)) {
    notFound();
  }
  const game = await getBggGame(id);
  return {
    title: game.name,
  };
}

export default async function Game({ params }: { params: { gameId: string } }) {
  const { t } = await getTranslation("game");
  const id = Number.parseInt(params.gameId);
  if (!Number.isInteger(id)) {
    notFound();
  }
  try {
    const user = await getServerUser();
    const bggGame = await getBggGame(id);
    const game = (await getGameData([id]))[0];
    const language = await getGameLanguage();
    const friendCollections = await getCollectionStatusOfFriends(id, user.id);
    const gameDesigners =
      bggGame.designers.length <= 5
        ? bggGame.designers
        : [
            ...bggGame.designers.slice(0, 5),
            t("Page.More", { count: bggGame.designers.length - 5 }),
          ];
    const gameArtists =
      bggGame.artists.length <= 5
        ? bggGame.artists
        : [
            ...bggGame.artists.slice(0, 5),
            t("Page.More", { count: bggGame.artists.length - 5 }),
          ];

    return (
      <div className={styles.container}>
        <div
          className={classNames(styles.header, {
            [styles.noImage]: !bggGame.image,
          })}
        >
          {bggGame.image && (
            <Image
              src={bggGame.image}
              width={600}
              height={200}
              alt={bggGame.name}
              className={styles.headerImage}
              unoptimized
            />
          )}
          <div
            className={classNames(styles.headerContent, {
              [styles.noImage]: !bggGame.image,
            })}
          >
            {bggGame.image && (
              <Image
                src={bggGame.image || ""}
                width={200}
                height={200}
                alt={bggGame.name}
                className={styles.titleImage}
                unoptimized
              />
            )}
            <div className={styles.headerInformation}>
              <BggRating
                rating={bggGame.BGGRating}
                rank={bggGame.BGGRank}
                className={styles.rating}
              />
              <h2 className={styles.gameName}>{getName(game, language)}</h2>
              <span className={styles.gameYear}>{bggGame.year}</span>
              {gameDesigners.length > 0 && (
                <div className={classNames(styles.staff, styles.design)}>
                  <h3>{t("Page.Header.Design")}</h3>
                  <ul>
                    {[...gameDesigners].reverse().map((d) => (
                      <li key={d}>{d}</li>
                    ))}
                  </ul>
                </div>
              )}
              {gameArtists.length > 0 && (
                <div className={classNames(styles.staff, styles.art)}>
                  <h3>{t("Page.Header.Art")}</h3>
                  <ul>
                    {[...gameArtists].reverse().map((d) => (
                      <li key={d}>{d}</li>
                    ))}
                  </ul>
                </div>
              )}
              <div
                className={classNames(
                  styles.playerCount,
                  styles.additionalInfo
                )}
              >
                {bggGame.maxPlayers === bggGame.minPlayers
                  ? bggGame.maxPlayers
                  : `${bggGame.minPlayers}-${bggGame.maxPlayers}`}
                <small>{t("Page.Header.Players")}</small>
              </div>
              <div
                className={classNames(
                  styles.playingTime,
                  styles.additionalInfo
                )}
              >
                {bggGame.playingTime}
                <small>{t("Page.Header.Minutes")}</small>
              </div>
              <div className={classNames(styles.weight, styles.additionalInfo)}>
                {round(bggGame.weight)}
                <small>{t("Page.Header.Weight")}</small>
              </div>
            </div>
          </div>
        </div>
        <div
          className={styles.description}
          dangerouslySetInnerHTML={{ __html: bggGame.description }}
        ></div>
        <div className={styles.meta}>
          <h3>{t("Page.Collections.YourCollection")}</h3>
          <div className={styles.group}>
            <CollectionStatusButtons gameId={bggGame.id} />
          </div>
          {friendCollections.own.length > 0 && (
            <div className={styles.group}>
              <h3>{t("Page.Collections.FriendsOwn")}</h3>
              {friendCollections.own.map((c) => (
                <Link href={`/app/profile/${c.id}`} key={c.id}>
                  <Avatar
                    name={c.name || ""}
                    image={c.image}
                    className={styles.avatar}
                  />
                </Link>
              ))}
            </div>
          )}
          {friendCollections.wantToPlay.length > 0 && (
            <div className={styles.group}>
              <h3>{t("Page.Collections.FriendsWantToPlay")}</h3>
              {friendCollections.wantToPlay.map((c) => (
                <Link href={`/app/profile/${c.id}`} key={c.id}>
                  <Avatar
                    name={c.name || ""}
                    image={c.image}
                    className={styles.avatar}
                  />
                </Link>
              ))}
            </div>
          )}
          {friendCollections.wishlist.length > 0 && (
            <div className={styles.group}>
              <h3>{t("Page.Collections.FriendsWishlist")}</h3>
              {friendCollections.wishlist.map((c) => (
                <Link href={`/app/profile/${c.id}`} key={c.id}>
                  <Avatar
                    name={c.name || ""}
                    image={c.image}
                    className={styles.avatar}
                  />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  } catch (e) {
    console.error("Error fetching game data", e);
    notFound();
  }
}

function round(i: number): number {
  return Math.round(i * 10) / 10;
}

function getName(game: ExpandedGame, language: string): string {
  const name = game.names.find((n) => n.language === language);
  if (name) {
    return name.name;
  }
  return game.name;
}
